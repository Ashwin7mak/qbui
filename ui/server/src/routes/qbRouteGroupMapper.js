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
        routeConsts = require('./routeConstants');

    /*
     * routeGroupDisabled maps each enumerated route group to the routes that are disabled for a route/method combination
     */
    var routeGroupDisabled = {};
    //  debug
    routeGroupDisabled[routeGroups.DEBUG] = [
        {route: routeConsts.APP_USERS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.APPS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]}
    ];

    //  mercury v1
    routeGroupDisabled[routeGroups.LH_V1] = [
        {route: routeConsts.FEATURE_STATES, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.FEATURE_SWITCHES, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.FEATURE_SWITCH, methods: [constants.PATCH]},
        {route: routeConsts.FEATURE_SWITCH_OVERRIDE, methods: [constants.PATCH]},
        //  app endpoints
        {route: routeConsts.APPS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.APP_USERS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        // form endpoints
        {route: routeConsts.FORM_COMPONENTS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.FORM_AND_RECORD_COMPONENTS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        // report endpoints
        {route: routeConsts.REPORT_RESULTS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.REPORT_INVOKE_RESULTS, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.REPORT_META, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.REPORT_RECORDS_COUNT, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.TABLE_HOMEPAGE_REPORT, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        // record endpoints
        {route: routeConsts.RECORD, methods: [constants.POST, constants.PUT]}, //get, delete and patch allowed
        {route: routeConsts.RECORDS, methods: [constants.DELETE, constants.PATCH, constants.PUT]}, //get and post allowed
        {route: routeConsts.RECORDS_BULK, methods: [constants.POST, constants.GET, constants.PATCH, constants.PUT]}, //delete allowed
        // swagger endpoints
        {route: routeConsts.SWAGGER_API, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.SWAGGER_API_EE, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.SWAGGER_RESOURCES, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.SWAGGER_IMAGES, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.SWAGGER_DOCUMENTATION, methods: [constants.GET, constants.POST, constants.DELETE, constants.PATCH, constants.PUT]},
        {route: routeConsts.TOMCAT_ALL, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]}, // get allowed
        {route: routeConsts.EXPERIENCE_ENGINE_ALL, methods: [constants.POST, constants.DELETE, constants.PATCH, constants.PUT]}]; //get allowed

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
