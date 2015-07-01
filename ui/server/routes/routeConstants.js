/**
 * route constants encapsulate the valid routes for a quickbase app
 * Created by cschneider1 on 6/30/15.
 */
(function () {
    'use strict';
    module.exports = Object.freeze({
        RECORD: '/api/:version/apps/:appId/tables/:tableId/records/:recordId',
        RECORDS: '/api/:version/apps/:appId/tables/:tableId/records',
        REPORT_RESULTS: '/api/:version/apps/:appId/tables/:tableId/reports/:reportId/results',
        SWAGGER_API: '/api',
        SWAGGER_RESOURCES: '/api/resources/*',
        SWAGGER_IMAGES: '/api/images/*',
        SWAGGER_DOCUMENTATION: '/api/documentation/*',
        TOMCAT_ALL: '/api/*',
        ALL: [this.RECORD, this.RECORDS, this.REPORT_RESULTS, this.SWAGGER_DOC_ENDPOINTS, this.TOMCAT_ALL],
        SWAGGER_DOC_ENDPOINTS: [this.SWAGGER_DOCUMENTATION, this.SWAGGER_IMAGES, this.SWAGGER_RESOURCES, this.SWAGGER_API]
    });
}());
