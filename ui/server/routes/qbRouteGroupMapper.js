/**
 * qbEnvironmentRouteMapping provides a mapping from a validEnvironment to the routes that are available in that environment.
 * qbApiRoutes will then use this to actually call 'route'
 * Created by cschneider1 on 6/30/15.
 */
(function () {
    'use strict';
    var request = require('request'),
        routeGroups = require('./routeGroups'),
        _ = require('lodash'),
        routeConsts = require('./routeConstants');

    /*
     * environmentToEnabledRoutes maps each enumerated environment to the routes that are enabled for that environment
     */
    var environmentRouteDisabled = {};
    environmentRouteDisabled[routeGroups.DEBUG] = [];
    environmentRouteDisabled[routeGroups.LH_V1] = [routeConsts.SWAGGER_API, routeConsts.SWAGGER_RESOURCES, routeConsts.SWAGGER_IMAGES, routeConsts.SWAGGER_DOCUMENTATION, routeConsts.TOMCAT_ALL];

    module.exports = {

        /**
         * For the app environment return all valid routes for this env
         * @param env
         * @returns {*}
         */
        routeIsEnabled: function(env, route) {
            var disabledRoutes = environmentRouteDisabled[env];

            return !_.contains(disabledRoutes, route, 0);
        }
    };
}());