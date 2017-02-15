/**
 * route constants encapsulate the valid routes for a quickbase app
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';

    var _ = require('lodash');

    /*
     *  Mercury Quickbase, Legacy Quickbase and Node server base url's
     */
    var baseUrl = {
        // TODO: merge the 2 quickbase_api constants into 1...need to fix integration tests first..
        QUICKBASE           : '/api/api/:version',
        EXPERIENCE_ENGINE   : '/ee/:version',
        QUICKBASE_HEALTH    : '/api/:version',
        NODE                : '/api/n/:version',
        QUICKBASE_LEGACY    : '/api/l/:version'
    };

    /*
     *  List of node server endpoints used by the Quickbase client.  These endpoints are
     *  intended for requests where processing is performed strictly on the node server.
     *  NO public QuickBase API endpoints are used to fulfill the request.
     */
    var nodeApiEndpoints = {
        FACET_EXPRESSION_PARSE  : baseUrl.NODE + '/facets/parse',
        LOG_CLIENT_MSG          : baseUrl.NODE + '/log',
        LOG_CLIENT_PERF_MSG     : baseUrl.NODE + '/clientPerf'
    };

    /*
     *  List of Legacy Quickbase endpoints used by the Quickbase client.
     */
    var legacyApiEndpoints = {
        APP_STACK_PREFERENCE        : baseUrl.QUICKBASE_LEGACY + '/apps/:appId/stack'
    };

    /*
     *  List of QuickBase public API endpoints used by the client.
     */
    var quickBaseApiEndpoints = {
        //  These routes are configured in qbRouteMapper to call node modules which perform
        //  additional processing either pre/post the API call.
        //
        //  TABLE ENDPOINTS for FORM, RECORD and REPORT

        HEALTH_CHECK                : baseUrl.QUICKBASE_HEALTH + '/health',
        FORM_AND_RECORD_COMPONENTS  : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/records/:recordId/formComponents',
        FORM_COMPONENTS             : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/formComponents',
        RECORD                      : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/records/:recordId',
        RECORDS                     : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/records',
        RECORDS_BULK                : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/records/bulk',

        REPORT_META                 : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/reports/:reportId',
        REPORT_RESULTS              : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/reports/:reportId/results',
        REPORT_INVOKE_RESULTS       : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/reports/:reportId/invoke',
        REPORT_RECORDS_COUNT        : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/reports/:reportId/recordsCount',
        TABLE_HOMEPAGE_REPORT       : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/homePage',

        //  APP ENDPOINTS
        APPS                        : baseUrl.QUICKBASE + '/apps',
        APP_USERS                   : baseUrl.QUICKBASE + '/apps/:appId/users',

        // No need to explicitly declare other endpoints as there is no special pre-processing required.  qbRouteMapper
        // is configured to act as proxy and pass the request directly to the server side resource.
        TOMCAT_ALL                  : baseUrl.QUICKBASE + '/*'
    };

    /*
     *  List of Experience engine public API endpoints
     */
    var experienceEngineApiEndpoints = {
        // No need to explicitly declare other endpoints as there is no special pre-processing required.  qbRouteMapper
        // is configured to act as proxy and pass the request directly to the server side resource.
        EXPERIENCE_ENGINE_ALL       : baseUrl.EXPERIENCE_ENGINE + '/*'
    };

    /**
     * List of Quickbase public API Swagger doc endpoints.
     */
    var swaggerApiEndpoints = {
        SWAGGER_API              : '/api',
        SWAGGER_DOCUMENTATION    : '/api/documentation/*',
        SWAGGER_IMAGES           : '/api/images/*',
        SWAGGER_RESOURCES        : '/api/resources/*',
        SWAGGER_API_EE           : '/ee',
        SWAGGER_DOCUMENTATION_EE : '/ee/documentation/*',
        SWAGGER_IMAGES_EE        : '/ee/images/*',
        SWAGGER_RESOURCES_EE     : '/ee/resources/*'
    };

    //  Export the combined list of endpoints.
    module.exports = Object.freeze(_.assign({},
        swaggerApiEndpoints, nodeApiEndpoints, legacyApiEndpoints, quickBaseApiEndpoints, experienceEngineApiEndpoints));

}());
