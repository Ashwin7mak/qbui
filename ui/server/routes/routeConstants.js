/**
 * route constants encapsulate the valid routes for a quickbase app
 * Created by cschneider1 on 6/30/15.
 */
module.exports = Object.freeze({
    RECORD : '/api/:version/apps/:appId/tables/:tableId/records/:recordId',
    RECORDS : '/api/:version/apps/:appId/tables/:tableId/records',
    RECORD_RESULTS: '/api/:version/apps/:appId/tables/:tableId/reports/:reportId/results',
    SWAGGER_API: '/api',
    SWAGGER_RESOURCES: '/api/resources/*',
    SWAGGER_IMAGES: '/api/images/*',
    SWAGGER_DOCUMENTATOIN: '/api/documentation/*',
    TOMCAT_ALL: '/api/*'
});
