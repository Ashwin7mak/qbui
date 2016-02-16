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
    var reportsApi;
    var routeGroupMapper = require('./qbRouteGroupMapper');
    var routeGroup;
    var simpleStringify = require('./../../common/src/simpleStringify.js');
    var queryFormatter = require('../api/quickbase/formatter/queryFormatter');

    module.exports = function(config) {
        requestHelper = require('../api/quickbase/requestHelper')(config);
        recordsApi = require('../api/quickbase/recordsApi')(config);
        reportsApi = require('../api/quickbase/reportsApi')(config);
        routeGroup = config.routeGroup;

        /* internal data */
        /*
         * routeToGetFunction maps each route to the proper function associated with that route for a GET request
         */
        var routeToGetFunction = {};
        routeToGetFunction[routeConsts.FACET_EXPRESSION_PARSE] = resolveFacets;
        routeToGetFunction[routeConsts.RECORD] = fetchSingleRecord;
        routeToGetFunction[routeConsts.RECORDS] = fetchAllRecords;
        routeToGetFunction[routeConsts.REPORT_AND_FACETS] = fetchReportAndFacets;
        routeToGetFunction[routeConsts.REPORT_RESULTS] = fetchReportData;

        routeToGetFunction[routeConsts.SWAGGER_API] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_RESOURCES] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_IMAGES] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_DOCUMENTATION] = fetchSwagger;
        routeToGetFunction[routeConsts.HEALTH_CHECK] = forwardApiRequest;

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
        routeToAllFunction[routeConsts.TOMCAT_ALL] = forwardApiRequest;

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
        //  request info is logged in routes.js
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
            recordsApi.fetchSingleRecordAndFields(req).then(
                function(response) {
                    log.debug({req:req, res:response}, 'FetchSingleRecord API SUCCESS');
                    res.send(response);
                },
                function(response) {
                    log.error({req:req, res:response}, 'FetchSingleRecord API ERROR');
                    res.status(response.statusCode).send(response);
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
            recordsApi.fetchRecordsAndFields(req).then(
                function(response) {
                    log.debug({req:req, res:response}, 'FetchAllRecords API SUCCESS');
                    res.send(response);
                },
                function(response) {
                    log.error({req:req, res:response}, 'FetchAllRecords API ERROR');
                    res.status(response.statusCode).send(response);
                });
        });
    }

    /**
     * This is the function for fetching records and facets for a report from the reportssApi
     * This is called from GetReportAndFacets end point from client.
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function fetchReportAndFacets(req, res) {
        processRequest(req, res, function(req, res) {
            reportsApi.fetchReportResultsAndFacets(req).then(
                function(response) {
                    log.debug({req:req, res:response}, 'fetchReportAndFacets API SUCCESS');
                    res.send(response);
                },
                function(response) {
                    log.error({req:req, res:response}, 'fetchReportAndFacets API ERROR');
                    res.status(response.statusCode).send(response);
                });
        });
    }

    /**
     * This is the function for fetching records for a report from the reportssApi
     * This is called from GetReportResults end point from client.
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function fetchReportData(req, res) {
        processRequest(req, res, function(req, res) {
            reportsApi.fetchReportResults(req).then(
                function(response) {
                    log.debug({req:req, res:response}, 'FetchReportData API SUCCESS');
                    res.send(response);
                },
                function(response) {
                    log.error({req:req, res:response}, 'FetchReportData API ERROR');
                    res.status(response.statusCode).send(response);
                });
        });
    }

    function resolveFacets(req, res) {
        processRequest(req, res, function(req, res) {
            log.debug("facetExpression in mapper =" + req.param('expression'));
            queryFormatter.format(req.param('facetexpression'))
                .then(function(response) {
                    res.pipe(response);
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
                log.error({req:req}, 'API SWAGGER ERROR: ' + JSON.stringify(error));
            })
            .pipe(res);
    }

    /**
     * This is the function for forwarding a request
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function forwardApiRequest(req, res) {
        processRequest(req, res, function(req, res) {
            var opts = requestHelper.setOptions(req);
            request(opts)
                .on('response', function(response) {
                    log.debug({req:req, res:response}, 'API SUCCESS');
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
