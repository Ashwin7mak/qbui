/**
 * qbEnvironmentRouteMapping provides a mapping from a validEnvironment to the routes that are available in that environment.
 * qbApiRoutes will then use this to actually call 'route'
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';
    var routeGroups = require('./routeGroups'),
        _ = require('lodash'),
        constants = require('../api/constants'),
        routeConsts = require('./routeConstants');

    /*
     * routeGroupDisabled maps each enumerated route group to the routes that are disabled for a route/method combination
     */
    var routeGroupDisabled = {};
    routeGroupDisabled[routeGroups.DEBUG] = [{route: routeConsts.TICKET, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]}];
    routeGroupDisabled[routeGroups.LH_V1] = [
        {route: routeConsts.RECORD, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.RECORDS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.REPORT_RESULTS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.SWAGGER_API, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.SWAGGER_RESOURCES, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.SWAGGER_IMAGES, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.SWAGGER_DOCUMENTATION, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.TICKET, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.REALM, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.TOMCAT_ALL, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]}];

    module.exports = {

        /**
         * For the app environment return all valid routes for this env
         * @param routeGroup
         * @param route
         * @param method
         * @returns {*}
         */
        routeIsEnabled: function(routeGroup, route, method) {
            var disabledRoutes = routeGroupDisabled[routeGroup];

            var routeEnabled = true;

            _.forEach(disabledRoutes, function(disabledRoute) {
                if (route === disabledRoute.route && _.contains(disabledRoute.methods, method.toUpperCase(), 0)) {
                    routeEnabled = false;
                }
            });

            return routeEnabled;
        }
    };
}());
