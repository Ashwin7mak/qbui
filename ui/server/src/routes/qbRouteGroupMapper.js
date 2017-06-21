/**
 * qbEnvironmentRouteMapping provides a mapping from a validEnvironment to the routes that are available in that environment.
 * qbApiRoutes will then use this to actually call 'route'
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';

    let routeGroups = require('./routeGroups');
    let _ = require('lodash');
    let constants = require('../../../common/src/constants');
    let routeConstants = require('./routeConstants');

    let routes = routeConstants.routes;
    let publicRoutes = routeConstants.publicEndPoints;

    /*
     * routeList defines the routes that are enabled for a route/method combination
     */
    var routeList = {};
    //  debug
    routeList[routeGroups.DEBUG] = [
        {route: routes.APP_USERS, methods: [constants.GET]},
        {route: routes.APPS, methods: [constants.GET]},
        {route: routes.APP_ROLES, methods: [constants.GET]}
    ];

    /**
     * These routes are enabled in the prod environment. If you are getting an unexpected 404 error, you should look
     * add an entry in this list for the specific route and also add the definition to routeConstants and qbRouteMapper.
     */
    routeList[routeGroups.LH_V1] = [
        //  For specific custom function routes, provide list of support http verb methods
        {route: routes.APPS, methods: [constants.GET, constants.POST]},
        {route: routes.APP_USERS, methods: [constants.GET]},
        {route: routes.APP_ROLES, methods: [constants.GET]},

        {route: routes.FEATURE_STATES, methods: [constants.GET]},
        {route: routes.FEATURE_SWITCH, methods: [constants.PUT]},
        {route: routes.FEATURE_SWITCHES, methods: [constants.GET, constants.POST]},
        {route: routes.FEATURE_OVERRIDE, methods: [constants.PUT]},
        {route: routes.FEATURE_OVERRIDES, methods: [constants.POST]},
        {route: routes.FEATURE_SWITCHES_BULK, methods: [constants.POST]},
        {route: routes.FEATURE_OVERRIDES_BULK, methods: [constants.POST]},

        {route: routes.FORM_AND_RECORD_COMPONENTS, methods: [constants.GET]},
        {route: routes.FORM_COMPONENTS, methods: [constants.GET]},

        {route: routes.RECORD, methods: [constants.DELETE, constants.GET, constants.PATCH]},
        {route: routes.RECORDS, methods: [constants.GET, constants.POST]},
        {route: routes.RECORDS_BULK, methods: [constants.DELETE, constants.POST]},

        {route: routes.REPORT_META, methods: [constants.GET]},
        {route: routes.REPORT_RESULTS, methods: [constants.GET]},
        {route: routes.REPORT_INVOKE_RESULTS, methods: [constants.GET]},
        {route: routes.REPORT_RECORDS_COUNT, methods: [constants.GET]},

        {route: routes.FACET_EXPRESSION_PARSE, methods: [constants.GET]},
        //  don't need to define the log routes as they are explicitly checked in routes.js

        {route: routes.TABLE, methods: [constants.DELETE, constants.PATCH]},
        {route: routes.TABLE_COMPONENTS, methods: [constants.POST]},
        {route: routes.TABLE_HOMEPAGE_REPORT, methods: [constants.GET]},

        {route: routes.REQ_USER, methods: [constants.GET]},

        {route: routes.GOVERNANCE_ACCOUNT_USERS, methods: [constants.GET]},
        {route: routes.GOVERNANCE_CONTEXT, methods: [constants.GET]},

        {route: routes.SWAGGER_CORE, methods: [constants.GET]},
        {route: routes.SWAGGER_EE, methods: [constants.GET]},
        {route: routes.SWAGGER_WE, methods: [constants.GET]},
        {route: routes.SWAGGER_RESOURCES, methods: [constants.GET]},
        {route: routes.SWAGGER_V2, methods: [constants.GET]},

        {route: routes.QBUI_HEALTH, methods: [constants.GET]},

        //  all http verbs are supported with wildcard routes
        {route: routes.CORE_ENGINE, methods: [constants.DELETE, constants.GET, constants.PATCH, constants.POST, constants.PUT]},
        {route: routes.EXPERIENCE_ENGINE, methods: [constants.DELETE, constants.GET, constants.PATCH, constants.POST, constants.PUT]},
        {route: routes.WORKFLOW_ENGINE, methods: [constants.DELETE, constants.GET, constants.PATCH, constants.POST, constants.PUT]},
        {route: routes.AUTOMATION_ENGINE, methods: [constants.DELETE, constants.GET, constants.PATCH, constants.POST, constants.PUT]}
    ];

    //  enable the public short-hand endpoints..all http verbs are supported
    publicRoutes.forEach(publicRoute => {
        routeList[routeGroups.LH_V1].push({route: publicRoute.route, methods: [constants.DELETE, constants.GET, constants.PATCH, constants.POST, constants.PUT]});
    });

    /**
     * Start with a list of disabled http verbs, remove the supported methods and
     * return a list of methods that are not allowed.
     *
     * @param supportedMethods
     */
    function getDisabledMethodList(supportedMethods) {
        let disabledList = [constants.DELETE, constants.GET, constants.PATCH, constants.POST, constants.PUT];
        supportedMethods.forEach(method => {
            _.pull(disabledList, method);
        });
        return disabledList;
    }

    module.exports = {
        /**
         * For the app environment return all valid routes for this env
         *
         * @param routeGroup
         * @param route
         * @param method
         * @returns {*}
         */
        routeIsEnabled: function(routeGroup, route, method) {

            var routeGroupList = routeList[routeGroup];

            //  unless the route is explicitly configured, the route is by default enabled.
            var routeEnabled = true;

            // search for the route in the list...will exit the loop once we have a match
            routeGroupList.some(configuredRoute => {
                if (configuredRoute.route === route) {
                    //  is the route enabled for this method request
                    if (_.includes(getDisabledMethodList(configuredRoute.methods), method.toUpperCase(), 0)) {
                        routeEnabled = false;
                    }
                    return true;
                }
            });

            return routeEnabled;
        }
    };
}());
