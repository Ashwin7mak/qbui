/**
 * Route constants encapsulate the valid routes defined when calling the node layer of Quick Base.
 *
 * Routes are grouped into 2 segments:
 *    - custom/composition routes: these routes have custom functions defined in node to fulfill the request
 *    - proxy/pass-through routes:  these are immediately forwarded to a back-end system for fulfillment.
 *
 * Follow these steps when adding a new route:
 *
 * FOR CUSTOM/COMPOSITION ROUTES:
 *    a) review clientApiEndpoints and nodeApiEndpoints and add the route definition if not already defined to
 *    the appropriate object.
 *    b) if adding to clientEndPoints array:
 *        Review regExCoreDefinition.  Verify new route evaluates to true when tested against the reg expression. If
 *        route evaluates to false, update the expression.
 *    c) if adding to nodeApiEndpoints array:
 *        Review regExNodeDefinition.  Verify new route evaluates to true when tested against the reg expression. If
 *        route evaluates to false, update the expression.
 *    d) add the new route to qbRouteMapper and cooresponding function and define how the request should get processed
 *    e) enable the new route in qbRouteGroupMapper.js and which http methods are supported
 *    f) add tests against the new route to qbRouteMapper.unit.spec.js and qbRouteGroupMapper.unit.spec.js
 *
 * 2) FOR PUBLIC/PROXY ROUTES:
 *    a) review publicControllerEndpoints and add the route definition if not already defined.
 *    b) review the publicEndPoints array.  Verify if the new route evaluates to true when tested against the list of
 *    associated reg expression. If route is not defined, then add the list with the new route definition.
 *    NOTE: if adding a new route, ORDER OF ENTRY IN THE LIST IS IMPORTANT
 *    c) should be a no-op, but verify the new route in qbRouteGroupMapper.js is enabled
 *    d) should be a no-op, but verify the new route in qbRouteMapper.unit.spec.js and qbRouteGroupMapper.unit.spec.js
 */
(function() {
    'use strict';

    let _ = require('lodash');

    //  Note: architect decision is that a breaking change to an api
    //  will mean a new api endpoint and not a new version release. That's
    //  why you are seeing hard-coded versions here and not on the client..
    let context = {
        base: {
            //  base context for supported back-end system.
            //  NOTE: review qbRouteMapper.forwardApiRequest if adding/changing
            CORE: '/api',
            EE: '/ee',
            WE: '/we'
        },
        client: {
            // QB UI context prefix
            QBUI: '/qbui'
        },
        api: {
            // API prefixes defined for each back-end system that node calls when fulfilling a route request
            CORE: '/api/api/v1',
            NODE: '/qbui',
            EE: '/ee/v1',
            GOVERNANCE: '/governance/api/:version',
            WORKFLOW: {
                FLOW_MANAGER: '/we/api/v1',
                AUTOMATION: '/we/workflow'
            }
        }
    };

    /*
     *  List of QuickBase public API client endpoints which are expected to call node functions that processes the
     *  request based on business requirements.  The assumption is these routes will call back-end services to fulfill
     *  its request.
     *
     *  NOTE: there is no need to define a route here if the expectation is to only proxy/forward the request through node.
     */
    let clientApiEndpoints = {
        FORM_AND_RECORD_COMPONENTS  : context.client.QBUI + '/apps/:appId/tables/:tableId/records/:recordId/formComponents',
        FORM_COMPONENTS             : context.client.QBUI + '/apps/:appId/tables/:tableId/formComponents',

        RECORD                      : context.client.QBUI + '/apps/:appId/tables/:tableId/records/:recordId',
        RECORDS                     : context.client.QBUI + '/apps/:appId/tables/:tableId/records',
        RECORDS_BULK                : context.client.QBUI + '/apps/:appId/tables/:tableId/records/bulk',

        REPORT_META                 : context.client.QBUI + '/apps/:appId/tables/:tableId/reports/:reportId',
        REPORT_RESULTS              : context.client.QBUI + '/apps/:appId/tables/:tableId/reports/:reportId/results',
        REPORT_INVOKE_RESULTS       : context.client.QBUI + '/apps/:appId/tables/:tableId/reports/:reportId/invoke',
        REPORT_RECORDS_COUNT        : context.client.QBUI + '/apps/:appId/tables/:tableId/reports/:reportId/recordsCount',
        TABLE_HOMEPAGE_REPORT       : context.client.QBUI + '/apps/:appId/tables/:tableId/homePage',

        TABLE_COMPONENTS            : context.client.QBUI + '/apps/:appId/tables/tableComponents',
        TABLE                       : context.client.QBUI + '/apps/:appId/tables/:tableId',
        TABLES                      : context.client.QBUI + '/apps/:appId/tables',

        APPS                        : context.client.QBUI + '/apps',
        APP_USERS                   : context.client.QBUI + '/apps/:appId/users',
        APP_ROLES                   : context.client.QBUI + '/apps/:appId/roles',
        APP_COMPONENTS              : context.client.QBUI + '/apps/:appId/appComponents',

        ADMIN                       : context.client.QBUI + '/admin',
        FEATURE_SWITCHES            : context.client.QBUI + '/admin/featureSwitches',
        FEATURE_SWITCHES_BULK       : context.client.QBUI + '/admin/featureSwitches/bulk',
        FEATURE_SWITCH              : context.client.QBUI + '/admin/featureSwitches/:featureSwitchId',
        FEATURE_OVERRIDES           : context.client.QBUI + '/admin/featureSwitches/:featureSwitchId/overrides',
        FEATURE_OVERRIDES_BULK      : context.client.QBUI + '/admin/featureSwitches/:featureSwitchId/overrides/bulk',
        FEATURE_OVERRIDE            : context.client.QBUI + '/admin/featureSwitches/:featureSwitchId/overrides/:overrideId',
        FEATURE_STATES              : context.client.QBUI + '/featureStates',

        REQ_USER                    : context.client.QBUI + '/users/reqUser',

        GOVERNANCE_ACCOUNT_USERS    : context.api.GOVERNANCE + '/:accountId/users', // the account id is an optional parameter
        GOVERNANCE_CONTEXT          : context.api.GOVERNANCE + '/context'
    };

    /*
     *  An extension to clientApiEndpoints list...these endpoints are intended for requests where processing
     *  is performed strictly on the node server.  Another words, no back-end service work is expected/required
     *  to fulfill the request.
     */
    let nodeApiEndpoints = {
        //  log routes are defined in routes.js
        LOG_CLIENT_MSG          : context.client.QBUI + '/log',
        LOG_CLIENT_PERF_MSG     : context.client.QBUI + '/clientPerf',
        FACET_EXPRESSION_PARSE  : context.client.QBUI + '/facets/parse',
        QBUI_HEALTH             : context.client.QBUI + '/health'
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
        PUBLIC_PAGES               : '/apps/:appId/pages*',
        PUBLIC_APPS                : '/apps*',
        PUBLIC_HEALTH              : '/health',
        PUBLIC_OPERATIONS          : '/operations*',
        PUBLIC_REALMS              : '/realms*',
        PUBLIC_TICKET              : '/ticket*',
        PUBLIC_USERS               : '/users*',
        PUBLIC_WORKFLOW_AUTOMATION_API : '/workflow/apps/:appId/api*',
        PUBLIC_WORKFLOW_AUTOMATION_INVOKE: '/workflow/apps/:appId/invokes*'
    };

    // Define list of public 'short-hand' routes and its back-end server api context.
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
        {route: publicControllerEndpoints.PUBLIC_FIELDS, regEx: /^\/apps\/.*\/tables\/.*\/fields(.*)?$/i, context: context.api.CORE},
        {route: publicControllerEndpoints.PUBLIC_FORMS, regEx: /^\/apps\/.*\/tables\/.*\/forms(.*)?$/i, context: context.api.EE},
        {route: publicControllerEndpoints.PUBLIC_RECORDS, regEx: /^\/apps\/.*\/tables\/.*\/records(.*)?$/i, context: context.api.CORE},
        {route: publicControllerEndpoints.PUBLIC_REPORTS, regEx: /^\/apps\/.*\/tables\/.*\/reports(.*)?$/i, context: context.api.CORE},
        {route: publicControllerEndpoints.PUBLIC_TABLE_PROPERTIES, regEx: /^\/apps\/.*\/tables\/.*\/tableproperties(.*)?$/i, context: context.api.EE},
        {route: publicControllerEndpoints.PUBLIC_TABLES, regEx: /^\/apps\/.*\/tables(.*)?$/i, context: context.api.CORE},
        {route: publicControllerEndpoints.PUBLIC_RELATIONSHIPS, regEx: /^\/apps\/.*\/relationships(.*)?$/i, context: context.api.CORE},
        {route: publicControllerEndpoints.PUBLIC_ROLES, regEx: /^\/apps\/.*\/roles(.*)?$/i, context: context.api.CORE},
        {route: publicControllerEndpoints.PUBLIC_WORKFLOW_FLOW_MGR, regEx: /^\/apps\/.*\/workflow\/flows(.*)?$/i, context: context.api.WORKFLOW.FLOW_MANAGER},
        {route: publicControllerEndpoints.PUBLIC_PAGES, regEx: /^\/apps\/.*\/pages(.*)?$/i, context: context.api.EE},
        {route: publicControllerEndpoints.PUBLIC_APPS, regEx: /^\/apps(.*)?$/i, context: context.api.CORE},                  // conflict with EE
        {route: publicControllerEndpoints.PUBLIC_HEALTH, regEx: /^\/health$/i, context: context.api.CORE},                // conflict with EE, Workflow
        {route: publicControllerEndpoints.PUBLIC_OPERATIONS, regEx: /^\/operations(.*)?$/i, context: context.api.CORE},        // conflict with EE
        {route: publicControllerEndpoints.PUBLIC_REALMS, regEx: /^\/realms(.*)?$/i, context: context.api.CORE},
        {route: publicControllerEndpoints.PUBLIC_TICKET, regEx: /^\/ticket(.*)?$/i, context: context.api.CORE},
        {route: publicControllerEndpoints.PUBLIC_USERS, regEx: /^\/users(.*)?$/i, context: context.api.CORE},
        {route: publicControllerEndpoints.PUBLIC_WORKFLOW_AUTOMATION_API, regEx: /^\/workflow\/apps\/.*\/api(.*)?$/i, context: context.base.WE},
        {
            route: publicControllerEndpoints.PUBLIC_WORKFLOW_AUTOMATION_INVOKE,
            regEx: /^\/workflow\/apps\/.*\/invokes(.*)?$/i,
            context: context.base.WE
        }
    ];

    // The regular expression is used to identify the client routes when determining which
    // back-end server to send the request.  See qbRouteMapper.modifyRequestPathForApi() method for
    // reference to this list and how it is used..
    //
    // NOTE: currently only CORE and NODE are setup.  EE, WORKFLOW, etc to be added when needed.
    //
    const regExCoreExpression = `^${context.client.QBUI}/(admin|apps|featureStates|users)(.*)?$`;
    const regExNodeExpression = `^${context.client.QBUI}/(log|health|facets)(.*)?$`;
    let clientEndPoints = [
        {route: context.client.QBUI, regEx: new RegExp(regExNodeExpression, 'i'), context: context.api.NODE},
        {route: context.client.QBUI, regEx: new RegExp(regExCoreExpression, 'i'), context: context.api.CORE}
    ];

    /**
     * Define the base context url for each respective context
     */
    let apiEndpoints = {
        CORE_ENGINE            : context.api.CORE + '/*',
        EXPERIENCE_ENGINE      : context.api.EE + '/*',
        WORKFLOW_ENGINE        : context.api.WORKFLOW.FLOW_MANAGER + '/*',
        AUTOMATION_ENGINE      : context.api.WORKFLOW.AUTOMATION + '/*'
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

    //  Export the combined list of routes.
    //
    //  The ordering of the routes exported is important.  Make sure the most specific route definitions are
    //  defined early in the return object and the more generic last.  Routes that resolve to multiple mappings
    //  will always use the first route definition that it matches.  For additional detail on how the ordering
    //  is important, take a look at qbApiRoutes.js and how the initializeRoutes() method uses this export.
    exports.routes = Object.freeze(_.assign({},
        clientApiEndpoints, nodeApiEndpoints, publicControllerEndpoints, apiEndpoints, swaggerEndpoints));

    //  These are exported and used in qbRouteMapper.
    exports.publicEndPoints = publicEndPoints;
    exports.clientEndPoints = clientEndPoints;

}());
