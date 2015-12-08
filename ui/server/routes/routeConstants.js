/**
 * route constants encapsulate the valid routes for a quickbase app
 * Created by cschneider1 on 6/30/15.
 */
(function() {
    'use strict';
    //save the substrings for lack of repetition
    module.exports = Object.freeze({
        LOG_CLIENT_MSG       : '/api/api/:version/log',
        REALM                : '/api/api/v1/realms',
        RECORD               : '/api/api/:version/apps/:appId/tables/:tableId/records/:recordId',
        RECORDS              : '/api/api/:version/apps/:appId/tables/:tableId/records',
        REPORT_RESULTS       : '/api/api/:version/apps/:appId/tables/:tableId/reports/:reportId/results',
        SWAGGER_API          : '/api',
        SWAGGER_DOCUMENTATION: '/api/documentation/*',
        SWAGGER_IMAGES       : '/api/images/*',
        SWAGGER_RESOURCES    : '/api/resources/*',
        TICKET               : '/api/api/v1/ticket',
        TOMCAT_ALL           : '/api/*'
    });
}());
