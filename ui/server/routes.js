(function() {
    /**
     * QuickBase application routes
     */

    'use strict';

    var errors = require('./components/errors');
    var log = require('./logger').getLogger();

    module.exports = function(app, config) {

        var requestHelper = require('./api/quickbase/requestHelper')(config);

        //  For all api requests:
        //     -- generate a new Transaction Id(TID) and add to the request header.
        //     -- log the request route.
        //     -- continue matching subsequent routes
        //
        app.all('*', function(req, res, next) {
            requestHelper.setTidHeader(req);
            log.logRequest(req, __filename);
            next();
        });


        var routeMapper = require('./routes/qbRouteMapper')(config);
        require('./routes/qbAngularRoutes')(app, config);
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
