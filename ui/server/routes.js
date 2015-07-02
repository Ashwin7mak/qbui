/**
 * QuickBase application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function (app, config) {

    var envMapper = require('./qbEnvironmentRouteMapper')(config);
    require('./routes/qbAngularRoutes')(app, config);
    require('./routes/qbApiRoutes')(app, config, envMapper);

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
