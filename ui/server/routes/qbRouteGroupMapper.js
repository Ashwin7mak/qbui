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
        constants = require('../api/constants'),
        routeConsts = require('./routeConstants');

    /*
     * environmentToEnabledRoutes maps each enumerated environment to the routes that are enabled for that environment
     */
    var environmentRouteDisabled = {};
    environmentRouteDisabled[routeGroups.DEBUG] = [];
    environmentRouteDisabled[routeGroups.LH_V1] = [
        { route: routeConsts.RECORD, methods: [constants.POST,constants.DELETE, constants.PATCH, constants.PUT]},
        { route: routeConsts.RECORDS, methods: [constants.POST,constants.DELETE, constants.PATCH, constants.PUT]},
        { route: routeConsts.REPORT_RESULTS, methods: [constants.POST,constants.DELETE, constants.PATCH, constants.PUT]},
        { route: routeConsts.SWAGGER_API, methods: [constants.GET,constants.POST,constants.DELETE, constants.PATCH, constants.PUT]},
        { route: routeConsts.SWAGGER_RESOURCES, methods: [constants.GET,constants.POST,constants.DELETE, constants.PATCH, constants.PUT]},
        { route: routeConsts.SWAGGER_IMAGES, methods: [constants.GET,constants.POST,constants.DELETE, constants.PATCH, constants.PUT]},
        { route: routeConsts.SWAGGER_DOCUMENTATION, methods: [constants.GET,constants.POST,constants.DELETE, constants.PATCH, constants.PUT]},
        { route: routeConsts.TOMCAT_ALL, methods: [constants.POST,constants.DELETE, constants.PATCH, constants.PUT]}];

    module.exports = {

        /**
         * For the app environment return all valid routes for this env
         * @param env
         * @returns {*}
         */
        routeIsEnabled: function(routeGroup, route, method) {
            var disabledRoutes = environmentRouteDisabled[routeGroup];

            var routeEnabled = true;

            _.forEach(disabledRoutes, function(disabledRoute){
                if(route === disabledRoute.route && _.contains(disabledRoute.methods, method.toUpperCase(), 0)){
                    routeEnabled = false;
                }
            });

            return routeEnabled;
        }
    };
}());