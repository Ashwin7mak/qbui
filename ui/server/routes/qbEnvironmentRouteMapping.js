/**
 * qbEnvironmentRouteMapping provides a mapping from a validEnvironment to the routes that are available in that environment.
 * qbApiRoutes will then use this to actually call 'route'
 * Created by cschneider1 on 6/30/15.
 */
(function () {
    'use strict';
    var request = require('request'),
        log = require('../logger').getLogger(module.filename),
        envConsts = require('../config/environment/valid_environments'),
        routeConsts = require('./routeConstants');

    module.exports = function (config) {
        var requestHelper = require('../api/quickbase/requestHelper')(config);
        var recordsApi = require('../api/quickbase/recordsApi')(config);

    };

    var routeToGetFunction = {};
    var routeToPostFunction = {};
    var routeToPutFunction = {};
    var routeToPatchFunction = {};
    var environmentToEnabledRoute = {};
}());