/**
 * route constants encapsulate the valid routes for a quickbase app
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';

    let _ = require('lodash');

    let baseContext = {
        QUICKBASE_CLIENT    : '/qb',
        QUICKBASE_NODE      : '/n',
        CORE_ENGINE         : '/api/api/:version',
        CORE_HEALTH         : '/api/:version',
        EXPERIENCE_ENGINE   : '/ee/:version',
        GOVERNANCE          : '/api/governance/:version',
        WORKFLOW : {
            FLOW_MANAGER    : '/we/api/:version',
            AUTOMATION      : '/we/workflow'
        }
    };

    //  base context routes for supported back-end servers.
    //
    //  Note: current architect decision is that a breaking change to an api
    //  will mean a new api endpoint and not a new version release.
    let baseUrl = {
        CORE: '/api/api/v1',
        EE: '/ee/v1',
        WORKFLOW: {
            FLOW_MANAGER: '/we/api/v1',
            AUTOMATION: '/we/workflow'
        }
    };

    /*
     *  List of QuickBase public API endpoints which call custom node functions.  The routes call a node
     *  function that processes the request based on business requirements.
     *
     *  DO NOT define a route here if the expectation is to only proxy/forward the request through node.
     */
    let customFunctionApiEndpoints = {
        HEALTH_CHECK                : baseContext.CORE_HEALTH + '/health',
        QBUI_HEALTH_CHECK           : baseUrl.CORE_HEALTH + '/qbuiHealth',   // remove with NODE_HEALTH_CHECK endpoint

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

        APPS                        : baseContext.QUICKBASE_CLIENT + '/apps',
        APP_USERS                   : baseContext.QUICKBASE_CLIENT + '/apps/:appId/users',
        APP_ROLES                   : baseContext.QUICKBASE_CLIENT + '/apps/:appId/roles',

        ADMIN                       : baseContext.QUICKBASE_CLIENT + '/admin',
        FEATURE_SWITCHES            : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches',
        FEATURE_SWITCHES_BULK       : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/bulk',
        FEATURE_SWITCH              : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/:featureSwitchId',
        FEATURE_OVERRIDES           : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/:featureSwitchId/overrides',
        FEATURE_OVERRIDES_BULK      : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/:featureSwitchId/overrides/bulk',
        FEATURE_OVERRIDE            : baseContext.QUICKBASE_CLIENT + '/admin/featureSwitches/:featureSwitchId/overrides/:overrideId',
        FEATURE_STATES              : baseContext.QUICKBASE_CLIENT + '/featureStates',

        REQ_USER                    : baseContext.QUICKBASE_CLIENT + '/users/reqUser',

        GOVERNANCE_ACCOUNT_USERS     : baseContext.GOVERNANCE + '/:accountId/users',
        // the account id is an optional parameter
        GOVERNANCE_CONTEXT           : baseContext.GOVERNANCE + '/context'
    };

    /*
     *  List of node server endpoints used by the Quickbase client.  These endpoints are
     *  intended for requests where processing is performed strictly on the node server.
     */

    let nodeApiEndpoints = {
        //  log routes are defined in routes.js
        LOG_CLIENT_MSG          : baseContext.QUICKBASE_NODE + '/log',
        LOG_CLIENT_PERF_MSG     : baseContext.QUICKBASE_NODE + '/clientPerf',
        //
        FACET_EXPRESSION_PARSE  : baseContext.QUICKBASE_NODE + '/facets/parse',
        NODE_HEALTH_CHECK       : baseContext.QUICKBASE_NODE + '/qbuiHealth'
    };

    /**
     * Allow for swagger to render for each respective context
     */
    let swaggerEndpoints = {
        SWAGGER_CORE           : '/api/*',
        SWAGGER_EE             : '/ee/*',
        SWAGGER_WE             : '/we/*'
    };

    /**
     * Define the base context url for each respective context
     */
    let apiEndpoints = {
        CORE_ENGINE            : baseContext.CORE_ENGINE + '/*',
        EXPERIENCE_ENGINE      : baseContext.EXPERIENCE_ENGINE + '/*',
        WORKFLOW_ENGINE        : baseContext.WORKFLOW.FLOW_MANAGER + '/*',
        AUTOMATION_ENGINE      : baseContext.WORKFLOW.AUTOMATION + '/*'
    };

    /**
     * Define public endpoints which map to support back-end server endpoint. These endpoints will route
     * the the appropriate back-end server base on the configuration file defined in qbRouteMapper.js
     *
     * Note these endpoints map roughly to the controllers defined on the respective back-end servers
     */
    let publicControllerEndpoints = {
        PUBLIC_FIELDS              : '/apps/:appId/tables/:tableId/fields*',
        PUBLIC_FORMS               : '/apps/:appId/tables/:tableId/forms*',
        PUBLIC_RECORDS             : '/apps/:appId/tables/:tableId/records*',
        PUBLIC_REPORTS             : '/apps/:appId/tables/:tableId/reports*',
        PUBLIC_TABLE_PROPERTIES    : '/apps/:appId/tables/:tableId/tableproperties*',
        PUBLIC_TABLES              : '/apps/:appId/tables*',
        PUBLIC_RELATIONSHIPS       : '/apps/:appId/relationships*',
        PUBLIC_ROLES               : '/apps/:appId/roles*',
        PUBLIC_WORKFLOW_FLOW_MGR   : '/apps/:appId/workflow/flows*',
        PUBLIC_APPS                : '/apps*',
        PUBLIC_HEALTH              : '/health',
        PUBLIC_OPERATIONS          : '/operations*',
        PUBLIC_REALMS              : '/realms*',
        PUBLIC_TICKET              : '/ticket*',
        PUBLIC_USERS               : '/users*',
        PUBLIC_WORKFLOW_AUTOMATION : '/workflow/apps/:appId/*'
    };

    // Define list of public 'short-hand' routes and its back-end server api context.  This list
    // allows users to call an endpoint but not care/know which back end server fulfills the request.
    //
    // Examples:
    //    - testRealm.domain.com/apps/1/tables/2/fields will resolve to call CORE
    //    - testRealm.domain.com/apps/1/tables/2/forms will resolve to call EE
    //
    // The regular expression is used to identify the short-hand notation routes when determining which
    // back-end server to prepend to the route.  See qbRouteMapper.modifyRequestPathForApi() method for
    // reference to this list and how it is used..
    //
    //  ORDER OF ENTRY IN THE LIST IS IMPORTANT.  When adding new routes, define specific/granular
    //  routes FIRST.  The route matching function will check the request route against this list starting
    //  at index 0.  The first regEx match that it finds is what will be used.
    //
    //  The same endpoints may be defined on multiple back-end servers.  For example, the health-controller.
    //  In that case, whatever context is defined in the below setup will be used for the 'short-hand' notation.
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
        {route: publicControllerEndpoints.PUBLIC_WORKFLOW_FLOW_MGR, regEx: /^\/apps\/.*\/workflow\/flows(.*)?$/i, context: baseUrl.WORKFLOW.FLOW_MANAGER},
        {route: publicControllerEndpoints.PUBLIC_APPS, regEx: /^\/apps(.*)?$/i, context: baseUrl.CORE},                  // conflict with EE
        {route: publicControllerEndpoints.PUBLIC_HEALTH, regEx: /^\/health$/i, context: baseUrl.CORE},                // conflict with EE, Workflow
        {route: publicControllerEndpoints.PUBLIC_OPERATIONS, regEx: /^\/operations(.*)?$/i, context: baseUrl.CORE},        // conflict with EE
        {route: publicControllerEndpoints.PUBLIC_REALMS, regEx: /^\/realms(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_TICKET, regEx: /^\/ticket(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_USERS, regEx: /^\/users(.*)?$/i, context: baseUrl.CORE},
        {route: publicControllerEndpoints.PUBLIC_WORKFLOW_AUTOMATION, regEx: /^\/workflow\/apps\/.*\/(.*)?$/i, context: baseUrl.WORKFLOW.AUTOMATION}
    ];

    // List of routes used by the quickbase client to perform functionality either exclusively in node code or
    // composition routes in support of a client request.  See qbRouteMapper.modifyRequestPathForApi() for
    // reference to this list and how it is used.
    let clientEndPoints = [
        {route: baseContext.QUICKBASE_CLIENT, regEx: /^\/qb\/(.*)?$/i, context: baseUrl.CORE}                  // replace QB_CLIENT endpoint with CORE content
    ];

    //  Export the public and client endpoints
    exports.publicEndPoints = publicEndPoints;
    exports.clientEndPoints = clientEndPoints;
    //  Export the combined list of routes.
    exports.routes = Object.freeze(_.assign({},
        customFunctionApiEndpoints, nodeApiEndpoints, publicControllerEndpoints, swaggerEndpoints, apiEndpoints));

}());
