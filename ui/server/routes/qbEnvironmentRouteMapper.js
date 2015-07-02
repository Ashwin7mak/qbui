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
        routeConsts = require('./routeConstants'),
        requestHelper,
        recordsApi,
        allRoutes = [routeConsts.RECORD,
            routeConsts.RECORDS,
            routeConsts.REPORT_RESULTS,
            routeConsts.TOMCAT_ALL,
            routeConsts.SWAGGER_DOCUMENTATION,
            routeConsts.SWAGGER_IMAGES,
            routeConsts.SWAGGER_RESOURCES,
            routeConsts.SWAGGER_API];


    module.exports = function (config){
        requestHelper = require('../api/quickbase/requestHelper')(config);
        recordsApi = require('../api/quickbase/recordsApi')(config);

        return {

            /**
             * Return all registered routes
             * @returns {*[]}
             */
             fetchAllRoutes : function(){
                return allRoutes;
             },

            /**
             * For the app environment return all valid routes for this env
             * @param env
             * @returns {*}
             */
            routeIsEnabledForEnv: function(env, route) {
                return _.contains(environmentToEnabledRoutes[env], route, 0);
            },

            /**
             * For the app environment return all valid routes for this env
             * @param env
             * @returns {*}
             */
            fetchAllRoutesForEnv: function(env) {
                return environmentToEnabledRoutes[env];
            },

            /**
             * For a given route, return the GET function associated with this route or group of routes
             * @param route
             */
            fetchGetFunctionForRoute : function(route) {
                return routeToGetFunction[route];
            },

            /**
             * For a given route, return the POST function associated with this route or group of routes
             * @param route
             */
            fetchPostFunctionForRoute : function(route) {
                return routeToPostFunction[route];
            },

            /**
             * For a given route, return the POST function associated with this route or group of routes
             * @param route
             */
            fetchPutFunctionForRoute : function(route) {
                return routeToPutFunction[route];
            },

            /**
             * For a given route, return the PATCH function associated with this route or group of routes
             * @param route
             */
            fetchPatchFunctionForRoute : function(route) {
                return routeToPatchFunction[route];
            },

            /**
             * For a given route, return the DELETE function associated with this route or group of routes
             * @param route
             */
            fetchDeleteFunctionForRoute : function(route) {
                return routeToDeleteFunction[route];
            },

            /**
             * For a given route, return the function associated with this route or group of routes for all http verbs
             * @param route
             */
            fetchAllFunctionForRoute : function(route) {
                return routeToAllFunction[route];
            },

            /**
             * Return a pointer to the 404 method
             * @returns {fetch404}
             */
            fetch404Function : function(){
                return fetch404;
            }
        }
    };


    /*
     * environmentToEnabledRoutes maps each enumerated environment to the routes that are enabled for that environment
     */
    var environmentToEnabledRoutes = {};

    environmentToEnabledRoutes[envConsts.LOCAL] = allRoutes;
    environmentToEnabledRoutes[envConsts.TEST] = allRoutes;
    environmentToEnabledRoutes[envConsts.DEVELOPMENT] = allRoutes;
    environmentToEnabledRoutes[envConsts.INTEGRATION] = allRoutes;
    environmentToEnabledRoutes[envConsts.PRE_PROD] = allRoutes;
    environmentToEnabledRoutes[envConsts.PRODUCTION] = [routeConsts.RECORD, routeConsts.REPORT_RESULTS, routeConsts.RECORDS];

    /*
     * routeToGetFunction maps each route to the proper function associated with that route for a GET request
     */
    var routeToGetFunction = {};

    routeToGetFunction[routeConsts.RECORD] = fetchSingleRecord;
    routeToGetFunction[routeConsts.RECORDS] = fetchAllRecords;
    routeToGetFunction[routeConsts.REPORT_RESULTS] = fetchAllRecords;
    routeToGetFunction[routeConsts.SWAGGER_API] = fetchSwagger;
    routeToGetFunction[routeConsts.SWAGGER_RESOURCES] = fetchSwagger;
    routeToGetFunction[routeConsts.SWAGGER_IMAGES] = fetchSwagger;
    routeToGetFunction[routeConsts.SWAGGER_DOCUMENTATION] = fetchSwagger;

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

    routeToAllFunction[routeConsts.TOMCAT_ALL] = forwardAllApiRequests;

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

    /**
     * Return a 404 for a response
     * @param req
     * @param res
     */
    function fetch404(req, res) {
        log.logRequest(req);
        res.status(404).send();
    }

}());