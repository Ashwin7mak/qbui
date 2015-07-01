/**
 * qbEnvironmentRouteMapping provides a mapping from a validEnvironment to the routes that are available in that environment.
 * qbApiRoutes will then use this to actually call 'route'
 * Created by cschneider1 on 6/30/15.
 */
(function () {
    'use strict';
    var request = require('request'),
        log = require('../logger').getLogger(module.filename),
        envConsts = require('../config/environment/valid_environments'),
        routeConsts = require('./routeConstants');

    module.exports = function (config) {
        var requestHelper = require('../api/quickbase/requestHelper')(config);
        var recordsApi = require('../api/quickbase/recordsApi')(config);

        function getRequestHelper(){
            return requestHelper;
        }

        function getRecordsApi(){
            return recordsApi;
        }

        /**
         * For the app environment return all valid routes for this env
         * @param env
         * @returns {*}
         */
        function fetchAllRoutesForEnv(env){
            return environmentToEnabledRoutes[env];
        }

        /**
         * For a given route, return the GET function associated with this route or group of routes
         * @param route
         */
        function fetchGetFunctionForRoute(route){
            return routeToGetFunction[route];
        }

        /**
         * For a given route, return the POST function associated with this route or group of routes
         * @param route
         */
        function fetchPostFunctionForRoute(route){
            return routeToPostFunction[route];
        }

        /**
         * For a given route, return the POST function associated with this route or group of routes
         * @param route
         */
        function fetchPutFunctionForRoute(route){
            return routeToPutFunction[route];
        }

        /**
         * For a given route, return the PATCH function associated with this route or group of routes
         * @param route
         */
        function fetchPatchFunctionForRoute(route){
            return routeToPatchFunction[route];
        }

        /**
         * For a given route, return the DELETE function associated with this route or group of routes
         * @param route
         */
        function fetchDeleteFunctionForRoute(route){
            return routeToDeleteFunction[route];
        }

        /**
         * For a given route, return the function associated with this route or group of routes for all http verbs
         * @param route
         */
        function fetchAllFunctionForRoute(route){
            return routeToAllFunction[route];
        }
    };

    /*
     * get the requestHelper and the recordsApi
     * These will both be initialized in the export block. We are initializing these, but
     * they are required in many of the functions used in routing. To hide the functions being used for routing as those
     * should not be called outside of a route, we get the requestHelper and recordsApi here,
     * and use them in functions that are not exported as part of the environment route mapper.
     */
    var requestHelper = this.getRequestHelper();
    var recordsApi = this.getRecordsApi();

    /*
     * environmentToEnabledRoutes maps each enumerated environment to the routes that are enabled for that environment
     */
    var environmentToEnabledRoutes = {};

    environmentToEnabledRoutes[envConsts.LOCAL] = routeConsts.ALL;
    environmentToEnabledRoutes[envConsts.TEST] = routeConsts.ALL;
    environmentToEnabledRoutes[envConsts.DEVELOPMENT] = routeConsts.ALL;
    environmentToEnabledRoutes[envConsts.INTEGRATION] = routeConsts.ALL;
    environmentToEnabledRoutes[envConsts.PRE_PROD] = routeConsts.ALL;
    environmentToEnabledRoutes[envConsts.PRODUCTION] = [routeConsts.RECORD, routeConsts.REPORT_RESULTS, routeConsts.RECORDS, routeConsts.REP]

    /*
     * routeToGetFunction maps each route to the proper function associated with that route for a GET request
     */
    var routeToGetFunction = {};

    routeToGetFunction[routeConsts.RECORD] = this.fetchSingleRecord;
    routeToGetFunction[routeConsts.RECORDS] = this.fetchAllRecords;
    routeToGetFunction[routeConsts.REPORT_RESULTS] = this.fetchAllRecords;
    routeToGetFunction[routeConsts.SWAGGER_DOC_ENDPOINTS] = this.fetchSwagger;

    /*
     * routeToGetFunction maps each route to the proper function associated with that route for a POST request
     */
    var routeToPostFunction = {};

    /*
     * routeToGetFunction maps each route to the proper function associated with that route for a PUT request
     */
    var routeToPutFunction = {};

    /*
     * routeToGetFunction maps each route to the proper function associated with that route for a PATCH request
     */
    var routeToPatchFunction = {};

    /*
     * routeToGetFunction maps each route to the proper function associated with that route for a DELETE request
     */
    var routeToDeleteFunction = {};

    /*
     * routeToAllFunction maps each route to the proper function associated with the route for all HTTP verb requests
     */
    var routeToAllFunction = {};

    routeToAllFunction[routeConsts.TOMCAT_ALL] = this.forwardAllApiRequests;

    /**
     * This helper method takes the request url produced and replaces the single /api with /api/api.
     *
     * @param req
     */
    function getOptionsForRequest(req){
        var opts = requestHelper.setOptions(req);
        var url = config.javaHost + req.url;
        if(url.search('/api/api') === -1) {
            opts.url = url.replace('/api', '/api/api');
        }

        return opts;
    };

    /**
     * This helper method takes the request url produced and replaces the single /api with /api/api on the original
     * request
     *
     * @param req
     */
    function modifyRequestPathForApi(req){
        var originalUrl = req.url;
        if(originalUrl.search('/api/api') === -1) {
            req.url = originalUrl.replace('/api', '/api/api');
        }
    }

    /**
     * This is the function for fetching a single record from the recordsApi
     * @param req
     * @param res
     */
    function fetchSingleRecord(req, res) {
        //  log some route info and set the request options
        log.logRequest(req);

        modifyRequestPathForApi(req);

        recordsApi.fetchSingleRecordAndFields(req)
            .then(function(response) {
                log.logResponse(response);
                res.send(response);
            })
            .catch(function(error) {
                log.error('ERROR: ' + JSON.stringify(error));
                requestHelper.copyHeadersToResponse(res, error.headers);
                res.status(error.statusCode)
                    .send(error.body);
            });
    }

    /**
     * This is the function for fetching all records from the recordsApi
     * This is used for both the records endpoint and the reports endpoint
     * @param req
     * @param res
     */
    function fetchAllRecords(req, res) {
        //  log some route info and set the request options
        log.logRequest(req);

        modifyRequestPathForApi(req);

        recordsApi.fetchRecordsAndFields(req)
            .then(function(response) {
                log.logResponse(response);
                res.send(response);
            })
            .catch(function(error) {
                log.error('ERROR: ' + JSON.stringify(error));
                requestHelper.copyHeadersToResponse(res, error.headers);
                res.status(error.statusCode)
                    .send(error.body);
            });
    }

    /**
     * This is the function for proxying to the swagger endpoint
     * @param req
     * @param res
     */
    function fetchSwagger(req, res) {
        //  log some route info and set the request options
        log.logRequest(req);

        var opts = requestHelper.setOptions(req);

        request(opts)
            .on('error', function(error) {
                log.error('Swagger API ERROR ' + JSON.stringify(error));
            })
            .pipe(res);
    }

    /**
     * This is the function for forwarding all other requests to the api
     * @param req
     * @param res
     */
    function forwardAllApiRequests(req, res) {
        //  log some route info and set the request options
        log.logRequest(req);

        var opts = getOptionsForRequest(req);

        request(opts)
            .on('response', function (response) {
                log.info('API response: ' + response.statusCode + ' - ' + req.method + ' ' + req.path);
            })
            .on('error', function (error) {
                log.error('API ERROR ' + JSON.stringify(error));
            })
            .pipe(res);
    }


}());