/**
 * route constants encapsulate the valid routes for a quickbase app
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';

    let _ = require('lodash');

    let baseContext = {
        QUICKBASE_CLIENT    : '/qb',
        NODE                : '/n',
        //
        CORE_ENGINE         : '/api/api/:version',
        CORE_HEALTH         : '/api/:version',
        EXPERIENCE_ENGINE   : '/ee/:version',
        GOVERNANCE          : '/api/governance/:version',
        AUTOMATION          : '/we/workflow/:version'
    };

    let baseUrl = {
        CORE: '/api/api/v1',
        EE: '/ee/v1',
        AUTOMATION: '/we/workflow/v1'
    };

    /*
     *  List of QuickBase public API endpoints which call custom node functions.  The routes call a node
     *  function that processes the request based on business requirements.
     *
     *  DO NOT define a route here if the expectation is to only proxy/forward the request through node.
     */
    let customFunctionApiEndpoints = {
        HEALTH_CHECK                : baseContext.CORE_HEALTH + '/health',

        FORM_AND_RECORD_COMPONENTS  : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/records/:recordId/formComponents',
        FORM_COMPONENTS             : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/formComponents',

        RECORD                      : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/records/:recordId',
        RECORDS                     : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/records',
        RECORDS_BULK                : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/records/bulk',

        REPORT_META                 : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/reports/:reportId',
        REPORT_RESULTS              : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/reports/:reportId/results',
        REPORT_INVOKE_RESULTS       : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/reports/:reportId/invoke',
        REPORT_RECORDS_COUNT        : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/reports/:reportId/recordsCount',
        TABLE_HOMEPAGE_REPORT       : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId/homePage',

        TABLE_COMPONENTS            : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/tableComponents',
        TABLE                       : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables/:tableId',
        TABLES                      : baseContext.QUICKBASE_CLIENT + '/apps/:appId/tables',

        //  APP ENDPOINTS
        APPS                        : baseContext.QUICKBASE_CLIENT + '/apps',
        APP_USERS                   : baseContext.QUICKBASE_CLIENT + '/apps/:appId/users',

        FEATURE_SWITCHES            : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches',
        FEATURE_SWITCHES_BULK       : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/bulk',
        FEATURE_SWITCH              : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/:featureSwitchId',
        FEATURE_OVERRIDES           : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/:featureSwitchId/overrides',
        FEATURE_OVERRIDES_BULK      : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/:featureSwitchId/overrides/bulk',
        FEATURE_OVERRIDE            : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/:featureSwitchId/overrides/:overrideId',
        FEATURE_STATES              : baseContext.QUICKBASE_CLIENT + '/featureStates',

        //  ROLE ENDPOINTS
        APP_ROLES                   : baseContext.QUICKBASE_CLIENT + '/apps/:appId/roles',

        // USER ENDPOINTS
        REQ_USER                    : baseContext.QUICKBASE_CLIENT + '/users/reqUser',

        ADMIN                       : baseContext.QUICKBASE_CLIENT + '/admin',

        GOVERNANCE_ACCOUNT_USERS     : baseContext.GOVERNANCE + '/:accountId/users',

        // the account id is an optional parameter
        GOVERNANCE_CONTEXT           : baseContext.GOVERNANCE + '/context'
    };

    /*
     *  List of node server endpoints used by the Quickbase client.  These endpoints are
     *  intended for requests where processing is performed strictly on the node server.
     */
    let nodeApiEndpoints = {
        FACET_EXPRESSION_PARSE  : baseContext.NODE + '/facets/parse',
        LOG_CLIENT_MSG          : baseContext.NODE + '/log',
        LOG_CLIENT_PERF_MSG     : baseContext.NODE + '/clientPerf'
    };

    /**
     * Allow for swagger to render for each respective context
     */
    let swaggerEndpoints = {
        SWAGGER_CORE_V2          : '/api/*',
        SWAGGER_EE_V2            : '/ee/*'
    };

    /**
     * Define the direct api endpoints for each respective context
     */
    let apiEndpoints = {
        CORE_ALL                 : baseContext.CORE_ENGINE + '/*',
        EXPERIENCE_ENGINE_ALL    : baseContext.EXPERIENCE_ENGINE + '/*',
        AUTOMATION_ENGINE_ALL    : baseContext.AUTOMATION + '/*'
    };

    /**
     * Define public endpoints which map to support back-end server endpoint. These endpoints will route
     * the the appropriate back-end server base on the configuration file defined in qbRouteMapper.js
     *
     * Note these endpoints map roughly to the controllers defined on the respective back-end servers
     */
    let publicControllerEndpoints = {
        PUBLIC_FIELDS            : '/apps/:appId/tables/:tableId/fields*',
        PUBLIC_FORMS             : '/apps/:appId/tables/:tableId/forms*',
        PUBLIC_RECORDS           : '/apps/:appId/tables/:tableId/records*',
        PUBLIC_REPORTS           : '/apps/:appId/tables/:tableId/reports*',
        PUBLIC_TABLE_PROPERTIES  : '/apps/:appId/tables/:tableId/tableproperties*',
        PUBLIC_TABLES            : '/apps/:appId/tables*',
        PUBLIC_RELATIONSHIPS     : '/apps/:appId/relationships*',
        PUBLIC_ROLES             : '/apps/:appId/roles*',
        PUBLIC_APPS              : '/apps*',
        PUBLIC_HEALTH            : '/health',
        PUBLIC_OPERATIONS        : '/operations*',
        PUBLIC_REALMS            : '/realms*',
        PUBLIC_TICKET            : '/ticket*',
        PUBLIC_USERS             : '/users*'
    };

    // Define list of public 'short-hand' routes and its back-end server api context.
    //
    // The regular expression is used to identify the short-hand notation routes when determine which
    // back-end server to assign the route.  See qbRouteMapper.modifyRequestPathForApi() method for
    // reference to this map and how it is used..
    //
    //  NOTE: ORDER OF ENTRY IN THE LIST IS IMPORTANT.  Define specific/granular routes FIRST..
    //
    //  The regular expression is interpreted as:
    //      ^     - starts with
    //      (.*)? - optionally match any character(s)
    //      \/    - escaped forward slash
    //      .*    - wildcard match any character(s)
    //      /i    - case insensitive
    //
    let publicEndPoints = [
        {route: publicControllerEndpoints.PUBLIC_FIELDS, regEx: /^\/apps\/.*\/tables\/.*\/fields(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_FORMS, regEx: /^\/apps\/.*\/tables\/.*\/forms(.*)?$/i, context: baseUrl.EE},
        {route: publicControllerEndpoints.PUBLIC_RECORDS, regEx: /^\/apps\/.*\/tables\/.*\/records(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_REPORTS, regEx: /^\/apps\/.*\/tables\/.*\/reports(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_TABLE_PROPERTIES, regEx: /^\/apps\/.*\/tables\/.*\/tableproperties(.*)?$/i, context: baseUrl.EE},
        {route: publicControllerEndpoints.PUBLIC_TABLES, regEx: /^\/apps\/.*\/tables(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_RELATIONSHIPS, regEx: /^\/apps\/.*\/relationships(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_ROLES, regEx: /^\/apps\/.*\/roles(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_APPS, regEx: /^\/apps\/(.*)?$/i, context: baseUrl.CORE},                  // conflict with EE
        {route: publicControllerEndpoints.PUBLIC_HEALTH, regEx: /^\/health(.*)?$/i, context: baseUrl.CORE},                // conflict with EE
        {route: publicControllerEndpoints.PUBLIC_OPERATIONS, regEx: /^\/operations(.*)?$/i, context: baseUrl.CORE},        // conflict with EE
        {route: publicControllerEndpoints.PUBLIC_REALMS, regEx: /^\/realms(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_TICKET, regEx: /^\/ticket(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_USERS, regEx: /^\/users(.*)?$/i, context: baseUrl.CORE}
    ];

    let clientEndPoints = [
        {route: '/qb/*', regEx: /^\/qb\/(.*)?$/i, context: baseUrl.CORE}
    ];

    //  Export the combined list of routes.
    exports.routes = Object.freeze(_.assign({},
        customFunctionApiEndpoints, nodeApiEndpoints, publicControllerEndpoints, swaggerEndpoints, apiEndpoints));

    exports.publicEndPoints = publicEndPoints;
    exports.clientEndPoints = clientEndPoints;

}());
