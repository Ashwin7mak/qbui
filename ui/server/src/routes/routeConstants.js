/**
 * route constants encapsulate the valid routes for a quickbase app
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';

    let _ = require('lodash');

    let baseContext = {
        //  custom client function endpoints
        QUICKBASE_CLIENT      : '/qbui',
        QUICKBASE_CLIENT_NODE : '/qbn',

        //  direct api endpoints
        //
        //  Note: current architect decision is that a breaking change to an api
        //  will mean a new api endpoint and not a new version release. That's
        //  why you are seeing hard-coded versions.
        CORE_ENGINE         : '/api/api/v1',
        CORE_HEALTH         : '/api/v1',
        EXPERIENCE_ENGINE   : '/ee/v1',
        GOVERNANCE          : '/api/governance/:version',
        WORKFLOW : {
            WORKFLOW        : '/we',
            FLOW_MANAGER    : '/we/api/v1',
            AUTOMATION      : '/we/workflow'
        }
    };

    /*
     *  List of QuickBase public API client endpoints which call custom node functions.  The routes call a node
     *  function that processes the request based on business requirements.
     *
     *  NOTE: there is no need to define a route here if the expectation is to only proxy/forward the request through node.
     */
    let qbuiApiEndpoints = {
        // TODO: will be removed and replaced with QBUI_HEALTH endpoint once pit team makes changes in sprint 7
        QBUI_HEALTH_CHECK           : baseContext.CORE_HEALTH + '/qbuiHealth',

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
        GOVERNANCE_CONTEXT           : baseContext.GOVERNANCE + '/context',

        // ************ TEMPORARY routes needed to allow E2E tests to continue to work under new routing scheme  *************
        // ************ PLEASE DO NOT ADD TO THIS LIST as these will go away once E2E is updated                 *************
        //  E2E needs these routes to be defined as some tests do not differentiate between the /qbui prefixed route or
        //  the /api/api/v1 core routes.  JIRA MC-2268 has been created to refactor how routing is constructed so that the
        //  test framework does not call the custom routing using the incorrect prefix.
        E2E_FORM_AND_RECORD_COMPONENTS  : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/records/:recordId/formComponents',
        E2E_FORM_COMPONENTS             : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/formComponents',
        E2E_RECORD                      : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/records/:recordId',
        E2E_RECORDS                     : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/records',
        E2E_RECORDS_BULK                : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/records/bulk',
        E2E_REPORT_META                 : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/reports/:reportId',
        E2E_REPORT_RESULTS              : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/reports/:reportId/results',
        E2E_REPORT_INVOKE_RESULTS       : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/reports/:reportId/invoke',
        E2E_REPORT_RECORDS_COUNT        : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/reports/:reportId/recordsCount',
        E2E_TABLE_HOMEPAGE_REPORT       : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId/homePage',
        E2E_TABLE_COMPONENTS            : baseContext.CORE_ENGINE + '/apps/:appId/tables/tableComponents',
        E2E_TABLE                       : baseContext.CORE_ENGINE + '/apps/:appId/tables/:tableId',
        E2E_TABLES                      : baseContext.CORE_ENGINE + '/apps/:appId/tables',
        E2E_APPS                        : baseContext.CORE_ENGINE + '/apps',
        E2E_APP_USERS                   : baseContext.CORE_ENGINE + '/apps/:appId/users',
        E2E_APP_ROLES                   : baseContext.CORE_ENGINE + '/apps/:appId/roles',
        E2E_REQ_USER                    : baseContext.CORE_ENGINE + '/users/reqUser'
        // ********************************************************************************
    };

    /*
     *  List of node server endpoints used by the Quickbase client.  These endpoints are
     *  intended for requests where processing is performed strictly on the node server.
     */

    let nodeApiEndpoints = {
        //  log routes are defined in routes.js
        LOG_CLIENT_MSG          : baseContext.QUICKBASE_CLIENT_NODE + '/log',
        LOG_CLIENT_PERF_MSG     : baseContext.QUICKBASE_CLIENT_NODE + '/clientPerf',
        //
        FACET_EXPRESSION_PARSE  : baseContext.QUICKBASE_CLIENT_NODE + '/facets/parse',
        QBUI_HEALTH             : baseContext.QUICKBASE_CLIENT_NODE + '/health'
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
        PUBLIC_WORKFLOW_AUTOMATION_API : '/workflow/apps/:appId/api*',
        PUBLIC_WORKFLOW_AUTOMATION_INVOKE : '/workflow/apps/:appId/invokes*'
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
        {route: publicControllerEndpoints.PUBLIC_FIELDS, regEx: /^\/apps\/.*\/tables\/.*\/fields(.*)?$/i, context: baseContext.CORE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_FORMS, regEx: /^\/apps\/.*\/tables\/.*\/forms(.*)?$/i, context: baseContext.EXPERIENCE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_RECORDS, regEx: /^\/apps\/.*\/tables\/.*\/records(.*)?$/i, context: baseContext.CORE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_REPORTS, regEx: /^\/apps\/.*\/tables\/.*\/reports(.*)?$/i, context: baseContext.CORE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_TABLE_PROPERTIES, regEx: /^\/apps\/.*\/tables\/.*\/tableproperties(.*)?$/i, context: baseContext.EXPERIENCE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_TABLES, regEx: /^\/apps\/.*\/tables(.*)?$/i, context: baseContext.CORE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_RELATIONSHIPS, regEx: /^\/apps\/.*\/relationships(.*)?$/i, context: baseContext.CORE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_ROLES, regEx: /^\/apps\/.*\/roles(.*)?$/i, context: baseContext.CORE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_WORKFLOW_FLOW_MGR, regEx: /^\/apps\/.*\/workflow\/flows(.*)?$/i, context: baseContext.WORKFLOW.FLOW_MANAGER},
        {route: publicControllerEndpoints.PUBLIC_APPS, regEx: /^\/apps(.*)?$/i, context: baseContext.CORE_ENGINE},                  // conflict with EE
        {route: publicControllerEndpoints.PUBLIC_HEALTH, regEx: /^\/health$/i, context: baseContext.CORE_ENGINE},                // conflict with EE, Workflow
        {route: publicControllerEndpoints.PUBLIC_OPERATIONS, regEx: /^\/operations(.*)?$/i, context: baseContext.CORE_ENGINE},        // conflict with EE
        {route: publicControllerEndpoints.PUBLIC_REALMS, regEx: /^\/realms(.*)?$/i, context: baseContext.CORE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_TICKET, regEx: /^\/ticket(.*)?$/i, context: baseContext.CORE_ENGINE},
        {route: publicControllerEndpoints.PUBLIC_USERS, regEx: /^\/users(.*)?$/i, context: baseContext.CORE_ENGINE},
        //  workflow team should consider having common context for their routes
        {route: publicControllerEndpoints.PUBLIC_WORKFLOW_AUTOMATION_API, regEx: /^\/workflow\/apps\/.*\/api(.*)?$/i, context: baseContext.WORKFLOW.WORKFLOW},
        {route: publicControllerEndpoints.PUBLIC_WORKFLOW_AUTOMATION_INVOKE, regEx: /^\/workflow\/apps\/.*\/invokes(.*)?$/i, context: baseContext.WORKFLOW.WORKFLOW}
    ];

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
     * Allow for swagger to render for each respective context
     */
    let swaggerEndpoints = {
        SWAGGER_CORE           : '/api',
        SWAGGER_EE             : '/ee',
        SWAGGER_WE             : '/we',
        SWAGGER_RESOURCES      : '/*/*swagger*',
        SWAGGER_V2             : '/*/v2/api-docs*'
    };

    // List of routes used by the quickbase client to perform functionality either exclusively in node code or
    // composition routes in support of a client request.  See qbRouteMapper.modifyRequestPathForApi() for
    // reference to this list and how it is used.
    const regExExpression = `^${baseContext.QUICKBASE_CLIENT}/(.*)?$`;
    let clientEndPoints = [
        {route: baseContext.QUICKBASE_CLIENT, regEx: new RegExp(regExExpression, 'i'), context: baseContext.CORE_ENGINE}
    ];

    //  Export the combined list of routes.
    //
    //  The ordering of the routes exported is important.  Make sure the most specific route definitions are
    //  defined early in the return object and the more generic last.  Routes that resolve to multiple mappings
    //  will always use the first route definition that it matches.
    exports.routes = Object.freeze(_.assign({},
        qbuiApiEndpoints, nodeApiEndpoints, publicControllerEndpoints, apiEndpoints, swaggerEndpoints));

    //  These are exported to avoid the need of duplicating in qbRouteMapper.
    exports.publicEndPoints = publicEndPoints;
    exports.clientEndPoints = clientEndPoints;

}());
