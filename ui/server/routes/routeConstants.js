/**
 * route constants encapsulate the valid routes for a quickbase app
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';

    var _ = require('lodash');

    //  Quickbase and Node server base url
    var baseUrl = {
        QUICKBASE   : '/api/api/:version',
        NODE        : '/api/n/:version'
    };

    /*
     *  List of node server endpoints used by the Quickbase client.  These endpoints are
     *  intended for requests where processing is performed strictly on the node server.
     *  NO public QuickBase API endpoints are used to fulfill the request.
     */
    var nodeApiEndpoints = {
        FACET_EXPRESSION_PARSE  : baseUrl.NODE + '/facets',
        LOG_CLIENT_MSG          : baseUrl.NODE + '/log'
    };

    /*
     *  List of QuickBase public API endpoints used by the Quickbase client
     */
    var quickBaseApiEndpoints = {
        //  These routes are configured in qbRouteMapper to call node modules which perform
        //  additional processing either pre/post the API call.
        RECORD                  : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/records/:recordId',
        RECORDS                 : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/records',
        REPORT_RESULTS          : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/reports/:reportId/results',
        REPORT_FACETS           : baseUrl.QUICKBASE + '/apps/:appId/tables/:tableId/reports/:reportId/facets/results',

        // No need to explictly declare other endpoints as there is no special pre-processing required.  qbRouteMapper
        // is configured to act as proxy and pass the request directly to the resource.
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
    module.exports = Object.freeze(_.assign({}, nodeApiEndpoints, quickBaseApiEndpoints, swaggerApiEndpoints));

}());
