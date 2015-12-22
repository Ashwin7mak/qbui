/**
 * The route mapper provides a static mapping from each route to the function we expect to call for that route
 * Created by cschneider1 on 7/2/15.
 */
(function() {
    'use strict';
    var log = require('../logger').getLogger();
    var routeConsts = require('./routeConstants');
    var request = require('request');
    var requestHelper;
    var recordsApi;
    var routeGroupMapper = require('./qbRouteGroupMapper');
    var routeGroup;
    var simpleStringify = require('./../components/utility/simpleStringify.js');

    module.exports = function(config) {
        requestHelper = require('../api/quickbase/requestHelper')(config);
        recordsApi = require('../api/quickbase/recordsApi')(config);
        routeGroup = config.routeGroup;

        /* internal data */
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
        routeToAllFunction[routeConsts.TICKET] = forwardAllApiRequests;
        routeToAllFunction[routeConsts.REALM] = forwardAllApiRequests;

        /*** public data ****/
        return {

            /**
             * Return all registered routes
             * @returns {*[]}
             */
            fetchAllRoutes: function() {
                return routeConsts;
            },

            /**
             * For a given route, return the GET function associated with this route or group of routes
             * @param route
             */
            fetchGetFunctionForRoute: function(route) {
                return routeToGetFunction[route];
            },

            /**
             * For a given route, return the POST function associated with this route or group of routes
             * @param route
             */
            fetchPostFunctionForRoute: function(route) {
                return routeToPostFunction[route];
            },

            /**
             * For a given route, return the POST function associated with this route or group of routes
             * @param route
             */
            fetchPutFunctionForRoute: function(route) {
                return routeToPutFunction[route];
            },

            /**
             * For a given route, return the PATCH function associated with this route or group of routes
             * @param route
             */
            fetchPatchFunctionForRoute: function(route) {
                return routeToPatchFunction[route];
            },

            /**
             * For a given route, return the DELETE function associated with this route or group of routes
             * @param route
             */
            fetchDeleteFunctionForRoute: function(route) {
                return routeToDeleteFunction[route];
            },

            /**
             * For a given route, return the function associated with this route or group of routes for all http verbs
             * @param route
             */
            fetchAllFunctionForRoute: function(route) {
                return routeToAllFunction[route];
            },

            /**
             * Override the default functionality of the recordsApi
             */
            setRecordsApi: function(recordsApiOverride) {
                recordsApi = recordsApiOverride;
            }
        };
    };



    /**
     * This helper method takes the request url produced and replaces the single /api with /api/api on the original
     * request
     *
     * @param req
     */
    function modifyRequestPathForApi(req) {
        var originalUrl = req.url;
        if (originalUrl.search('/api/api') === -1) {
            req.url = originalUrl.replace('/api', '/api/api');
        }
    }

    /**
     * processRequest is the default implementation for processing a request coming through the router. We first log the
     * request and then we check whether the route has been enabled. We will then modify the request path and send it
     * along to the return function.
     * @param req
     * @param res
     * @param returnFunction
     */
    function processRequest(req, res, returnFunction) {
        //  log some route info and set the request options
        log.info({req: req}, 'qbRouteMapper - process request');

        if (!isRouteEnabled(req)) {
            routeTo404(req, res);
        } else {
            modifyRequestPathForApi(req);
            returnFunction(req, res);
        }
    }

    /**
     * This is the function for fetching a single record from the recordsApi
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function fetchSingleRecord(req, res) {
        processRequest(req, res, function(req, res) {
            recordsApi.fetchSingleRecordAndFields(req)
                    .then(function(response) {
                        log.debug({req:req, res:res}, 'API response status: ' + response.statusCode);
                        res.send(response);
                    })
                    .catch(function(error) {
                        log.error({req:req}, 'API ERROR: ' + JSON.stringify(error));
                        requestHelper.copyHeadersToResponse(res, error.headers);
                        res.status(error.statusCode)
                                       .send(error.body);
                    });
        });

    }

    /**
     * This is the function for fetching all records from the recordsApi
     * This is used for both the records endpoint and the reports endpoint
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function fetchAllRecords(req, res) {
        processRequest(req, res, function(req, res) {
            recordsApi.fetchRecordsAndFields(req)
                    .then(function(response) {
                        log.debug({req:req}, 'API response status: ' + response.statusCode);
                        res.send(response);
                    })
                    .catch(function(error) {
                        log.error({req:req}, 'API ERROR: ' + JSON.stringify(error));
                        requestHelper.copyHeadersToResponse(res, error.headers);
                        res.status(error.statusCode)
                                       .send(error.body);
                    });
        });
    }

    /**
     * This is the function for proxying to the swagger endpoint
     * @param req
     * @param res
     */
    function fetchSwagger(req, res) {
        if (!isRouteEnabled(req)) {
            routeTo404(req, res);
            return;
        }

        //  log some route info and set the request options
        log.debug({req: req}, 'Fetch swagger');

        var opts = requestHelper.setOptions(req);

        request(opts)
                .on('error', function(error) {
                    log.error({req:req}, 'API ERROR: ' + JSON.stringify(error));
                })
                .pipe(res);
    }

    /**
     * This is the function for forwarding all other requests to the api
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function forwardAllApiRequests(req, res) {
        processRequest(req, res, function(req, res) {
            var opts = requestHelper.setOptions(req);
            log.debug({req:req}, 'Java api request');
            request(opts)
                    .on('response', function(response) {
                        log.debug({req:req, res:response});
                    })
                    .on('error', function(error) {
                        log.error({req:req, res:res}, 'API ERROR: ' + JSON.stringify(error));
                    })
                    .pipe(res);
        });
    }

    /**
     * Method explicitly returns a 404 after logging relevant information
     * @param req
     * @param res
     */
    function routeTo404(req, res) {
        log.error({req:req, res:res}, 'Route ' + req.route.path + ' is not enabled for routeGroup ' + routeGroup);
        res.status(404).send();
    }

    /**
     * Check that the route has been enabled for this environment, if it has, then
     * @param req
     */
    function isRouteEnabled(req) {

        var enabled = false;
        if (req !== undefined) {
            if (req.route !== undefined && req.method !== undefined) {
                enabled = routeGroupMapper.routeIsEnabled(routeGroup, req.route.path, req.method);
            }
        }

        return enabled;
    }

}());
