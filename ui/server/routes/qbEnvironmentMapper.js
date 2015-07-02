/**
 * qbEnvironmentRouteMapping provides a mapping from a validEnvironment to the routes that are available in that environment.
 * qbApiRoutes will then use this to actually call 'route'
 * Created by cschneider1 on 6/30/15.
 */
(function () {
    'use strict';
    var request = require('request'),
        envConsts = require('../config/environment/valid_environments'),
        _ = require('lodash'),
        routeConsts = require('./routeConstants');


    module.exports = {
        /**
         * For the app environment return all valid routes for this env
         * @param env
         * @returns {*}
         */
        routeIsEnabled: function(env, route) {
            var envRoutes = environmentToEnabledRoutes[env];

            return _.contains(envRoutes, route, 0);
        },

        /**
         * For the app environment return all valid routes for this env
         * @param env
         * @returns {*}
         */
        fetchAllRoutesForEnv: function(env) {
            return environmentToEnabledRoutes[env];
        }

    };


    /*
     * environmentToEnabledRoutes maps each enumerated environment to the routes that are enabled for that environment
     */
    var environmentToEnabledRoutes = {};

    environmentToEnabledRoutes[envConsts.LOCAL] = routeConsts;
    environmentToEnabledRoutes[envConsts.TEST] = routeConsts;
    environmentToEnabledRoutes[envConsts.DEVELOPMENT] = [routeConsts.RECORD, routeConsts.REPORT_RESULTS, routeConsts.RECORDS];
    environmentToEnabledRoutes[envConsts.INTEGRATION] = routeConsts;
    environmentToEnabledRoutes[envConsts.PRE_PROD] = routeConsts;
    environmentToEnabledRoutes[envConsts.PRODUCTION] = [routeConsts.RECORD, routeConsts.REPORT_RESULTS, routeConsts.RECORDS];

}());