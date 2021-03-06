(function() {
    /**
     * QuickBase application routes
     */

    'use strict';
    var log = require('./logger').getLogger();
    var _ = require('lodash');
    var httpStatusCodes = require('./constants/httpStatusCodes');
    var mixins = require('./../../common/src/lodashMixins');

    require('./logger').getLogger();

    module.exports = function(app, config) {
        var errors = require('./components/errors')(config);
        var authentication = require('./components/authentication')(config);
        var requestHelper = require('./api/quickbase/requestHelper')();
        var routes = require('./routes/routeConstants').routes;
        var routeMapper = require('./routes/qbRouteMapper')(config);
        var usersApi = require('./api/quickbase/usersApi')(config);
        /*
         *  Route to log a message. Only a post request is supported.
         *  This needs to be the first route defined.
         */
        log.debug('Routing POST method for route ' + routes.LOG_CLIENT_MSG);
        app.all(routes.LOG_CLIENT_MSG, function(req, res, next) {
            // TODO: this endpoint needs to be protected...validate that the requested
            // TODO: endpoint includes a valid authenticated ticket.
            if (requestHelper.isPost(req)) {
                sendOutLogMessage(req, res, req.body.level, 'CLIENT', req.body.msg);
                // ...route terminates...logging a client side message only
            } else {
                res.status(httpStatusCodes.METHOD_NOT_ALLOWED).send('Method not supported');
            }
        });


        /*
         *  Route to log a performance stats from the client. Only a post request is supported.
         */
        log.debug('Routing POST method for route ' + routes.LOG_CLIENT_PERF_MSG);
        app.all(routes.LOG_CLIENT_PERF_MSG, function(req, res, next) {
            // TODO: this endpoint needs to be protected...validate that the requested
            // TODO: endpoint includes a valid authenticated ticket.
            if (requestHelper.isPost(req)) {
                // serialize all the params for message output
                let stats = req.body;
                if (req.useragent) {
                    stats.browser = req.useragent.browser ? req.useragent.browser : 'unspecified';
                    stats.browserVersion = req.useragent.browser ? req.useragent.version : 'unspecified';
                }
                let msg = "Client Perf stats (ms): " +
                    JSON.stringify(_.sortKeysBy(stats, (val, key) => key.toLowerCase()));
                sendOutLogMessage(req, res, 'info', 'CLIENT_PERF', msg);
            } else {
                res.status(httpStatusCodes.METHOD_NOT_ALLOWED).send('Method not supported');
            }
            // ...route terminates...logging a client side message only
        });

        /*
         * intercept all record bulk requests because express can't route them properly. We need to handle them manually
         */

        //  TODO look into why this block needs to be here and not in qbRouteMapper..jira mc-2412
        app.all(routes.RECORDS_BULK, function(req, res, next) {
            //be awesome
            if (requestHelper.isDelete(req)) {
                var recordBulkDelete = routeMapper.fetchDeleteFunctionForRoute(routes.RECORDS_BULK);
                if (recordBulkDelete !== null) {
                    recordBulkDelete(req, res);
                } else {
                    //the method doesn't exist, we can't execute this request, log an error!
                    res.status(httpStatusCodes.NOT_IMPLEMENTED).send('Method not implemented!');
                }
            } else if (requestHelper.isPost(req)) {
                /*
                 * TODO: MB-421 (https://quickbase.atlassian.net/browse/MB-421) this is a stop gap for integration tests.
                 * UI Integration tests use the Bulk Create currently, but through the node layer
                 * UI Integration tests need to be updated to use the Java end point when creating data
                 */
                return next();
            } else {
                //the verb requested for this rest endpoint is not implemented yet, log an error!
                res.status(httpStatusCodes.METHOD_NOT_ALLOWED).send('Method not supported');
            }
        });

        app.all(routes.ADMIN + '/*', function(req, res, next) {
            usersApi.getReqUser(req).then(
                function(response) {
                    if (response.administrator) {
                        return next();
                    } else {
                        res.status(httpStatusCodes.FORBIDDEN).send('User does not have permissions to access this content');
                    }
                },
                function(error) {
                    res.status(httpStatusCodes.METHOD_NOT_ALLOWED).send(JSON.stringify(error));
                }
            );
        });

        //  For all requests:
        //     -- log the request route.
        //     -- continue matching subsequent routes
        app.all('*', function(req, res, next) {
            log.info({req: req}, 'Router');
            next();
        });

        require('./routes/qbClientRoutes')(app, config);
        require('./routes/qbApiRoutes')(app, config, routeMapper);

        app.route('/qbase/signin')
            .get(authentication.signin);

        app.route('/qbase/signout')
                .get(authentication.signout);

        app.route('/qbase/notAvailable')
            .get(errors.notAvailable);

        // unauthorized
        app.route('/qbase/unauthorized*')
            .get(errors[httpStatusCodes.UNAUTHORIZED]);

        // forbidden
        app.route('/qbase/forbidden*')
            .get(errors[httpStatusCodes.FORBIDDEN]);

        app.route('/qbase/pageNotFound*')
                .get(errors[httpStatusCodes.NOT_FOUND]);

        app.route('/qbase/internalServerError*')
                .get(errors[httpStatusCodes.INTERNAL_SERVER_ERROR]);

        // Ticket Federation
        app.route('/qbase/federation/shake')
            .get(authentication.federation);
        app.route('/qbase/federation/legacyUrl')
            .get(authentication.legacyUrl);

        // All undefined asset or api routes should return a 404
        app.route('/:url(api|auth|components|app|bower_components|assets)/*')
                .get(errors[httpStatusCodes.NOT_FOUND]);

        //  Unknown page
        app.route('/qbase/*')
                .get(errors[httpStatusCodes.NOT_FOUND]);

        //  Unknown page for custom client composition routes...valid routes should all be declared in qbRouteMapper
        app.route('/qbui/*')
            .get(errors[httpStatusCodes.NOT_FOUND]);

        //  Unknown route
        app.route('/*')
            .get(errors[httpStatusCodes.NOT_FOUND]);


        function isClientLogEnabled() {
            return (config  === undefined || config.LOG  === undefined ||
            config.LOG.logClient === undefined || config.LOG.logClient === true);
        }

        function sendOutLogMessage(req, res, level, msgType, msg) {
            if (isClientLogEnabled()) {
                if (level && msg) {
                    //
                    //  The level binds to the respective bunyan logging function.
                    //  Expected values include 'info', 'warn', 'debug', 'error'
                    //
                    //  Couple of examples:
                    //      req.body.level = 'info', will bind to log['info'] function
                    //      req.body.level = 'warn', will bind to log['warn'] function
                    //      ...
                    //
                    var fn;
                    try {
                        fn = log[level].bind(log);
                    } catch (e) {
                        // if invalid level, log it and return a bad request
                        log.error({req: req}, 'ERROR logging message: ' + e);
                    }

                    if (typeof fn === 'function') {
                        //  generate a new Transaction Id(TID) and add to the request header.
                        requestHelper.setTidHeader(req);
                        //
                        //  for readability in the outputted log message, convert all double quotes to single quotes.
                        //
                        //  NOTE: it's okay to change the contents of the body message as this request is terminated
                        //  immediately after the message is logged on the server and not used elsewhere.
                        //
                        //  There is one minor downside to converting double quotes to single quotes, and that is if
                        //  the message is a json formatted string and you want to use it for debugging purposes (via
                        //  copy/paste from the log file), the json could become corrupt if it includes a double quoted
                        //  data value.  Weighing pro's and con's of each, the readability of the log supersedes the
                        //  possibility of corrupting a json message with double quoted data.  The thought is that a
                        //  double quoted message will happen infrequently, and if it does, the corrupt data can be
                        //  manually corrected by the developer who is debugging the issue.
                        //
                        //  Below are two examples of the same message
                        /*  FILTERED MESSAGE  (double quotes replaced with single quotes)
                         { ...
                         "body":{"msg":"AppService getApps success:{'data':[{'id':'bj7dzve78','name':'app_qLBpmnXXxg','lastAccessed':null,
                         'dateFormat':'MM-dd-uuuu','timeZone':'US/Pacific','firstDayOfWeek':null,'tables':[{'id':'bj7dzve9q'},{'id':'bj7dzve9m'}],
                         'relationships':[{'masterAppId':'bj7dzve78','masterTableId':'bj7dzve9m','masterFieldId':3,'detailAppId':'bj7dzve78',
                         'detailTableId':'bj7dzve9q','detailFieldId':14,'id':1,'appId':'bj7dzve78',
                         'description':'Relationship with master table: bj7dzve9m and detail table: bj7dzve9q','referentialIntegrity':false,'cascadeDelete':true}],
                         ... }
                         */
                        /*  UNFILTERED MESSAGE  (No changes)
                         { ...
                         "body":{"msg":"AppService getApps success:{\"data\":[{\"id\":\"bj7dzve78\",\"name\":\"app_qLBpmnXXxg\",\"lastAccessed\":null,
                         \"dateFormat\":\"MM-dd-uuuu\",\"timeZone\":\"US/Pacific\",\"firstDayOfWeek\":null,\"tables\":[{\"id\":\"bj7dzve9q\"},{\"id\":\"bj7dzve9m\"}],
                         \"relationships\":[{\"masterAppId\":\"bj7dzve78\",\"masterTableId\":\"bj7dzve9m\",\"masterFieldId\":3,\"detailAppId\":\"bj7dzve78\",
                         \"detailTableId\":\"bj7dzve9q\",\"detailFieldId\":14,\"id\":1,\"appId\":\"bj7dzve78\",\"description\":\"Relationship with master table: bj7dzve9m and detail table: bj7dzve9q\",
                         \"referentialIntegrity\":false,\"cascadeDelete\":true}],
                         ... }
                         */

                        var clientMsg = msg.replace(/"/g, "'");
                        if (req) {
                            //  for client logging, since we are posting to the node logging endpoint, clear out theses variables
                            //  as they contain node logging endpoint info, which is confusing when viewing a client message in the
                            //  log output.  By initializing to empty, the value will not display in the log message.
                            req.url = '';
                            req.method = '';
                            req.body = '';
                        }
                        var args = [];
                        args.push({type:msgType, req: req}, clientMsg);

                        fn.apply(null, args);
                        res.status(httpStatusCodes.OK).send('OK');
                    } else {
                        res.status(httpStatusCodes.BAD_REQUEST).send('Bad Request');
                    }
                } else {
                    res.status(httpStatusCodes.BAD_REQUEST).send('Bad Request');
                }
            } else {
                res.status(httpStatusCodes.OK).send('OK');
            }
        }

    };
}());
