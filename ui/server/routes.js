/**
 * QuickBase application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function (app, config) {

    require('./routes/qbAngularRoutes')(app, config);
    require('./routes/qbApiRoutes')(app, config);

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    //  Unknown page
    app.route('/*')
        .get(errors[404]);

};
