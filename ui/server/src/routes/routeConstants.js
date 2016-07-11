/**
 * route constants encapsulate the valid routes for a quickbase app
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';

    var _ = require('lodash');

    //  Quickbase and Node server base url
    var baseUrl = {
        // TODO: merge the 2 quickbase_api constants into 1...need to fix integration tests first..
        QUICKBASE   : '/api/api/:version',
        QUICKBASE_2 : '/api/:version',
        NODE        : '/api/n/:version'
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
     *  List of QuickBase public API endpoints used by the client which perform pre/post operations
     *  in the node layer and are not just proxied through to the quickbase public api.
     */
    var quickBaseApiEndpoints = {
        HEALTH_CHECK            : baseUrl.QUICKBASE_2 + '/health',
        //  These routes are configured in qbRouteMapper to call node modules which perform
        //  additional processing either pre/post the API call.
        //
        //  TABLE ENDPOINTS for FORM, RECORD and REPORT
        FORM_COMPONENTS         : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/records/:recordId/formComponents',

        RECORD                  : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/records/:recordId',
        RECORDS                 : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/records',

        REPORT_COMPONENTS       : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/reports/:reportId/reportComponents',
        REPORT_RESULTS          : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/reports/:reportId/results',
        TABLE_HOMEPAGE_REPORT   : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/homePage',

        // No need to explicitly declare other endpoints as there is no special pre-processing required.  qbRouteMapper
        // is configured to act as proxy and pass the request directly to the server side resource.
        TOMCAT_ALL              : baseUrl.QUICKBASE + '/*'
    };

    /**
     * List of Quickbase public API Swagger doc endpoints.
     */
    var swaggerApiEndpoints = {
        SWAGGER_API             : '/api',
        SWAGGER_DOCUMENTATION   : '/api/documentation/*',
        SWAGGER_IMAGES          : '/api/images/*',
        SWAGGER_RESOURCES       : '/api/resources/*'
    };

    //  Export the combined list of endpoints.
    module.exports = Object.freeze(_.assign({}, swaggerApiEndpoints, nodeApiEndpoints, quickBaseApiEndpoints));

}());
