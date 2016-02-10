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
        QUICKBASE_API   : '/api/api/:version',
        QUICKBASE_API2  : '/api/:version',
        NODE_API        : '/api/n/:version'
    };

    /*
     *  List of node server endpoints used by the Quickbase client.  These endpoints are
     *  intended for requests where processing is performed strictly on the node server.
     *  NO public QuickBase API endpoints are used to fulfill the request.
     */
    var nodeApiEndpoints = {
        FACET_EXPRESSION_PARSE  : baseUrl.NODE_API + '/facets',
        LOG_CLIENT_MSG          : baseUrl.NODE_API + '/log'
    };

    /*
     *  List of QuickBase public API endpoints used by the client which perform pre/post operations
     *  in the node layer and are not just proxyed through to the quickbase public api.
     */
    var quickBaseApiEndpoints = {
        //  These routes are configured in qbRouteMapper to call node modules which perform
        //  additional processing either pre/post the API call.
        RECORD                  : baseUrl.QUICKBASE_API + '/apps/:appId/tables/:tableId/records/:recordId',
        RECORDS                 : baseUrl.QUICKBASE_API + '/apps/:appId/tables/:tableId/records',
        REPORT_RESULTS          : baseUrl.QUICKBASE_API + '/apps/:appId/tables/:tableId/reports/:reportId/results',
        REPORT_FACETS           : baseUrl.QUICKBASE_API + '/apps/:appId/tables/:tableId/reports/:reportId/facets/results',
        // No need to explictly declare other endpoints as there is no special pre-processing required.  qbRouteMapper
        // is configured to act as proxy and pass the request directly to the server side resource.
        TOMCAT_ALL              : baseUrl.QUICKBASE_API + '/*'
    };

    var quickbaseApi2Endpoints = {
        HEALTH_CHECK            : baseUrl.QUICKBASE_API2 + '/health'
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

    //  Export the combined list of endpoints.  THE ORDER of the routes is important..
    module.exports = Object.freeze(_.assign({}, swaggerApiEndpoints, nodeApiEndpoints, quickbaseApi2Endpoints, quickBaseApiEndpoints));

}());
