(function() {
    /**
     * QuickBase application routes
     */

    'use strict';

    var errors = require('./components/errors');
    var authentication = require('./components/authentication');
    var log = require('./logger').getLogger();
    var _ = require('lodash');
    var mixins = require('./../../common/src/lodashMixins');

    require('./logger').getLogger();

    module.exports = function(app, config) {

        var requestHelper = require('./api/quickbase/requestHelper')();
        var routeConstants = require('./routes/routeConstants');

        /*
         *  Route to log a message. Only a post request is supported.
         *  This needs to be the first route defined.
         */
        log.debug('Routing POST method for route ' + routeConstants.LOG_CLIENT_MSG);
        app.all(routeConstants.LOG_CLIENT_MSG, function(req, res, next) {
            // TODO: this endpoint needs to be protected...validate that the requested
            // TODO: endpoint includes a valid authenticated ticket.
            if (requestHelper.isPost(req)) {
                sendOutLogMessage(req, res, req.body.level, 'CLIENT', req.body.msg);
                // ...route terminates...logging a client side message only
            } else {
                res.status(405).send('Method not supported');
            }
        });


        /*
         *  Route to log a performance stats from the client. Only a post request is supported.
         */
        log.debug('Routing POST method for route ' + routeConstants.LOG_CLIENT_PERF_MSG);
        app.all(routeConstants.LOG_CLIENT_PERF_MSG, function(req, res, next) {
            // TODO: this endpoint needs to be protected...validate that the requested
            // TODO: endpoint includes a valid authenticated ticket.
            if (requestHelper.isPost(req)) {
                // serialize all the params for message output
                let stats = req.body;
                stats.browser = req.useragent.browser;
                stats.browserVersion = req.useragent.version;
                let msg = "Client Perf stats (ms): " +
                    JSON.stringify(_.sortKeysBy(stats, (val, key) => key.toLowerCase()));
                sendOutLogMessage(req, res, 'info', 'CLIENT_PERF', msg);
            } else {
                res.status(405).send('Method not supported');
            }
            // ...route terminates...logging a client side message only
        });


        //  For all requests:
        //     -- log the request route.
        //     -- continue matching subsequent routes
        app.all('*', function(req, res, next) {
            log.info({req: req}, 'Router');
            next();
        });

        var routeMapper = require('./routes/qbRouteMapper')(config);

        require('./routes/qbClientRoutes')(app, config);
        require('./routes/qbApiRoutes')(app, config, routeMapper);

        app.route('/signin')
            .get(authentication.signin);

        app.route('/signout')
                .get(authentication.signout);

        // unauthorized
        app.route('/unauthorized*')
            .get(errors[401]);

        // forbidden
        app.route('/forbidden*')
            .get(errors[403]);

        app.route('/pageNotFound*')
                .get(errors[404]);

        app.route('/internalServerError*')
                .get(errors[500]);

        // All undefined asset or api routes should return a 404
        app.route('/:url(api|auth|components|app|bower_components|assets)/*')
                .get(errors[404]);

        //  Unknown page
        app.route('/*')
                .get(errors[404]);


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
                        
                        // find the userId and add to the request object
                        requestHelper.setUserIdHeader(req);
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
                        res.status(200).send('OK');
                    } else {
                        res.status(400).send('Bad Request');
                    }
                } else {
                    res.status(400).send('Bad Request');
                }
            } else {
                res.status(200).send('OK');
            }
        }

    };
}());
