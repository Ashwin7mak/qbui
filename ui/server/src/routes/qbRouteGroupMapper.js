/**
 * qbEnvironmentRouteMapping provides a mapping from a validEnvironment to the routes that are available in that environment.
 * qbApiRoutes will then use this to actually call 'route'
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';
    var routeGroups = require('./routeGroups'),
        _ = require('lodash'),
        constants = require('../../../common/src/constants'),
        routes = require('./routeConstants').routes;

    /*
     * routeGroupDisabled maps each enumerated route group to the routes that are disabled for a route/method combination
     */
    var routeGroupDisabled = {};
    //  debug
    routeGroupDisabled[routeGroups.DEBUG] = [
        {route: routes.APP_USERS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.APPS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.APP_ROLES, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]}
    ];

    //  mercury v1
    /**
     * These routes are disabled in the prod environment. If you are getting an unexpected 404 error in prod you can:
     * A) Enable that HTTP verb for all routes to that endpoint by modifying the wildcard routes (e.g., TOMCAT_ALL, EXPERIENCE_ENGINE_ALL)
     * B) Enabled a specific subset of routes by defining the specific route in both routeConstants and qbRouteMapper.
     */
    routeGroupDisabled[routeGroups.LH_V1] = [
        {route: routes.FEATURE_STATES, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.FEATURE_SWITCHES, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.FEATURE_SWITCH, methods: [constants.PATCH]},
        {route: routes.FEATURE_OVERRIDE, methods: [constants.PATCH]},
        //  app endpoints
        {route: routes.APPS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.APP_USERS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        // form endpoints
        {route: routes.FORM_COMPONENTS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.FORM_AND_RECORD_COMPONENTS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        // report endpoints
        {route: routes.REPORT_RESULTS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.REPORT_INVOKE_RESULTS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.REPORT_META, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.REPORT_RECORDS_COUNT, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routes.TABLE_HOMEPAGE_REPORT, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        // record endpoints
        {route: routes.RECORD, methods: [constants.POST, constants.PUT]}, //get, delete and patch allowed
        {route: routes.RECORDS, methods: [constants.DELETE, constants.PATCH, constants.PUT]}, //get and post allowed
        {route: routes.RECORDS_BULK, methods: [constants.POST, constants.GET, constants.PATCH, constants.PUT]}, //delete allowed
        // role endpoints
        {route: routes.APP_ROLES, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},

        // allow get, post, patch and delete on core
        {route: routes.CORE_ALL, methods: [constants.PUT]},
        // allow get on ee
        {route: routes.EXPERIENCE_ENGINE_ALL, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]}
    ];

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
                if (route === disabledRoute.route && _.includes(disabledRoute.methods, method.toUpperCase(), 0)) {
                    routeEnabled = false;
                }
            });

            return routeEnabled;
        }
    };
}());
