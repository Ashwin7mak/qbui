(function() {
    /**
     * QuickBase application routes
     */

    'use strict';

    var errors = require('./components/errors');
    var log = require('./logger').getLogger();

    module.exports = function(app, config) {

        var requestHelper = require('./api/quickbase/requestHelper')();
        var routeConstants = require('./routes/routeConstants');

        app.all(routeConstants.LOG_CLIENT_MSG, function(req, res, next) {
            // TODO: validate that the request includes a valid authenticated ticket
            if (requestHelper.isPost(req)) {
                if (req.body.level && req.body.msg) {
                    var fn;
                    try {
                        fn = log[req.body.level].bind(log);
                    } catch (e) {
                        // if invalid level, log it and return a bad request
                        log.error({req:req}, 'ERROR logging message: ' + e);
                    }

                    if (typeof fn === 'function') {
                        var args = [];
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
                        req.body.msg = req.body.msg.replace(/"/g, "'");

                        args.push({req:req});   // the msg is outputted as part of the req.body
                        fn.apply(null, args);
                        res.status(200).send('OK');
                    } else {
                        res.status(400).send('Bad Request');
                    }
                } else {
                    res.status(400).send('Bad Request');
                }
            } else {
                res.status(405).send('Method not supported');
            }
            // ...processing stops here...logging a client side message only
        });

        //  For all api requests:
        //     -- generate a new Transaction Id(TID) and add to the request header.
        //     -- log the request route.
        //     -- continue matching subsequent routes
        //
        app.all('*', function(req, res, next) {
            requestHelper.setTidHeader(req);
            log.info({req: req});
            next();
        });

        var routeMapper = require('./routes/qbRouteMapper')(config);

        require('./routes/qbClientRoutes')(app, config);
        require('./routes/qbApiRoutes')(app, config, routeMapper);

        // unauthorized
        app.route('/unauthorized*')
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

    };
}());
