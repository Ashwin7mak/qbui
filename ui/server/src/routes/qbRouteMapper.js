/**
 * The route mapper provides a static mapping from each route to the function we expect to call for that route
 * Created by cschneider1 on 7/2/15.
 */
(function() {
    'use strict';
    var log = require('../logger').getLogger();
    var perfLogger = require('../perfLogger');
    var routeConsts = require('./routeConstants');
    var request = require('request');

    var requestHelper;

    var formsApi;
    var recordsApi;
    var reportsApi;
    var appsApi;

    var routeGroupMapper = require('./qbRouteGroupMapper');
    var routeGroup;

    var simpleStringify = require('./../../../common/src/simpleStringify.js');
    var queryFormatter = require('../api/quickbase/formatter/queryFormatter');

    module.exports = function(config) {
        requestHelper = require('../api/quickbase/requestHelper')(config);
        routeGroup = config.routeGroup;

        formsApi = require('../api/quickbase/formsApi')(config);
        recordsApi = require('../api/quickbase/recordsApi')(config);
        reportsApi = require('../api/quickbase/reportsApi')(config);
        appsApi = require('../api/quickbase/appsApi')(config);

        /* internal data */
        /*
         * routeToGetFunction maps each route to the proper function associated with that route for a GET request
         */
        var routeToGetFunction = {};
        routeToGetFunction[routeConsts.APP_USERS] = getAppUsers;

        routeToGetFunction[routeConsts.FACET_EXPRESSION_PARSE] = resolveFacets;

        routeToGetFunction[routeConsts.FORM_COMPONENTS] = fetchFormComponents;
        routeToGetFunction[routeConsts.FORM_AND_RECORD_COMPONENTS] = fetchFormAndRecordComponents;
        routeToGetFunction[routeConsts.RECORD] = fetchSingleRecord;
        routeToGetFunction[routeConsts.RECORDS] = fetchAllRecords;
        routeToGetFunction[routeConsts.REPORT] = fetchReport;
        routeToGetFunction[routeConsts.REPORT_COMPONENTS] = fetchReportComponents;
        routeToGetFunction[routeConsts.REPORT_RESULTS] = fetchReportData;
        routeToGetFunction[routeConsts.REPORT_RECORDS_COUNT] = fetchReportRecordsCount;
        routeToGetFunction[routeConsts.TABLE_HOMEPAGE_REPORT] = fetchTableHomePageReport;

        routeToGetFunction[routeConsts.SWAGGER_API] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_RESOURCES] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_IMAGES] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_DOCUMENTATION] = fetchSwagger;
        routeToGetFunction[routeConsts.HEALTH_CHECK] = forwardApiRequest;

        /*
         * routeToPostFunction maps each route to the proper function associated with that route for a POST request
         */
        var routeToPostFunction = {};
        routeToPostFunction[routeConsts.RECORDS] = createSingleRecord;

        /*
         * routeToPutFunction maps each route to the proper function associated with that route for a PUT request
         */
        var routeToPutFunction = {};

        /*
         * routeToPatchFunction maps each route to the proper function associated with that route for a PATCH request
         */
        var routeToPatchFunction = {};
        routeToPatchFunction[routeConsts.RECORD] = saveSingleRecord;

        /*
         * routeToDeleteFunction maps each route to the proper function associated with that route for a DELETE request
         */
        var routeToDeleteFunction = {};
        routeToDeleteFunction[routeConsts.RECORD] = deleteSingleRecord;
        routeToDeleteFunction[routeConsts.RECORDS_BULK] = deleteRecordsBulk;

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
             * For a given route, return the PUT function associated with this route or group of routes
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
            },

            /**
             * Override the default functionality of the request
             */
            setRequest: function(requestOverride) {
                request = requestOverride;
            }
        };
    };

    function filterNodeReq(req) {
        let filtered = {};
        if (req) {
            filtered.method = req.method;
            filtered.url = req.url;
            filtered.userId = req.userId;
            if (req.headers) {
                filtered.headers = {
                    tid: req.headers.tid,
                    sid: req.headers.sid
                };
            }
        }
        return filtered;
    }

    function logApiSuccess(req, response, perfLog, apiName) {
        if (perfLog) {
            perfLog.log();
        }
        log.debug({req: filterNodeReq(req), res:response}, apiName ? 'API SUCCESS:' + apiName : 'API SUCCESS');
    }

    function logApiFailure(req, response, perfLog, apiName) {
        if (perfLog) {
            perfLog.log();
        }
        log.error({req: req, res:response}, apiName ? 'API ERROR:' + apiName : 'API ERROR');
    }

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
     * This is the function for getting all users for an app
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function getAppUsers(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get App Users', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            appsApi.getAppUsers(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Get App Users');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Get App Users');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }

    /**
     * This is the function for fetching a single record from the recordsApi
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function fetchSingleRecord(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Single Record', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            recordsApi.fetchSingleRecordAndFields(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Single Record');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Single Record');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
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
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch All Records', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            recordsApi.fetchRecordsAndFields(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch All Records');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch All Records');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }

    /**
     * This is the function for fetching a the report home page for the given app and table.
     * Currently, a hydrated report means report data, meta data and facet information
     *
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function fetchTableHomePageReport(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Table HomePage Report Components', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            reportsApi.fetchTableHomePageReport(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Table HomePage Report Components');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Table HomePage Report Components');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }

    /**
     * Fetch form meta data and record data for a record.
     *
     * @param req
     * @param res
     */
    function fetchFormComponents(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Form Components', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            formsApi.fetchFormComponents(req, false).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Form Components');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Form Components');
                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }
    /**
     * Fetch form meta data and record data for a record.
     *
     * @param req
     * @param res
     */
    function fetchFormAndRecordComponents(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Form Components', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            formsApi.fetchFormComponents(req, true).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Form Components');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Form Components');
                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }

    /**
     * Fetch report meta data, report data and facets (if any) for the report.
     *
     * @param req
     * @param res
     */
    function fetchReport(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Report', {req: filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            reportsApi.fetchReportMetaDataAndContent(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Report');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Report');
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }

    /**
     * This is the function for fetching a completely hydrated report from the reportssApi endpoint.
     * Currently, a hydrated report means report data plus facet information.
     *
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function fetchReportComponents(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Report Components', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            reportsApi.fetchReportComponents(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Report Components');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Report Components');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }

    /**
     * Fetch the count of total records in a report.
     *
     * @param req
     * @param res
     */
    function fetchReportRecordsCount(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Report records count', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            reportsApi.fetchReportRecordsCount(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Report records count');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Report records count');
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }

    /**
     * This is the function for fetching data records for a report from the reportsApi endpoint.
     * This endpoint is intended to be used primarily when a client needs to refresh the data for
     * a report.   Report paging is one use case.
     *
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function fetchReportData(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Report Data', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            reportsApi.fetchReportResults(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Report Data');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Report Data');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }

    function resolveFacets(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Resolve Facets', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            queryFormatter.format(req).then(
                function(response) {
                    res.send(response);
                    perfLog.log();
                }
            );
        });
    }

    function saveSingleRecord(req, res) {
        let activityName = 'Save Record';
        let perfLog = perfLogger.getInstance();
        perfLog.init(activityName, {req:filterNodeReq(req)});
        recordsApi.saveSingleRecord(req).then(
            function(response) {
                res.send(response);
                logApiSuccess(req, response, perfLog, activityName);
            },
            function(response) {
                logApiFailure(req, response, perfLog, activityName);
                //  client is waiting for a response..make sure one is always returned
                if (response && response.statusCode) {
                    res.status(response.statusCode).send(response);
                } else {
                    res.status(500).send(response);
                }
            }
        );
    }

    function createSingleRecord(req, res) {
        let activityName = 'Add Record';
        let perfLog = perfLogger.getInstance();
        perfLog.init(activityName, {req:filterNodeReq(req)});
        recordsApi.createSingleRecord(req).then(
            function(response) {
                res.send(response);
                logApiSuccess(req, response, perfLog, activityName);
            },
            function(response) {
                logApiFailure(req, response, perfLog, activityName);
                //  client is waiting for a response..make sure one is always returned
                if (response && response.statusCode) {
                    res.status(response.statusCode).send(response);
                } else {
                    res.status(500).send(response);
                }
            }
        );
    }

    function deleteSingleRecord(req, res) {
        let activityName = 'Delete a Record';
        let perfLog = perfLogger.getInstance();
        perfLog.init(activityName, {req:filterNodeReq(req)});
        processRequest(req, res, function(req, res) {
            recordsApi.deleteSingleRecord(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, activityName);
                },
                function(response) {
                    logApiFailure(req, response, perfLog, activityName);
                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        });
    }

    function deleteRecordsBulk(req, res) {
        let activityName = 'Delete Records Bulk';
        let perfLog = perfLogger.getInstance();
        perfLog.init(activityName, {req:filterNodeReq(req)});
        processRequest(req, res, function(req, res) {
            recordsApi.deleteRecordsBulk(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, activityName);
                },
                function(response) {
                    logApiFailure(req, response, perfLog, activityName);
                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
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
     * This is the function for forwarding a request to the core server.  Expectation
     * is that the data in the body of the response is a json structure for all requests.
     *
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function forwardApiRequest(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Forward API Request', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            var opts = requestHelper.setOptions(req);
            request(opts)
                .on('response', function(response) {
                    logApiSuccess(req, response, perfLog);
                })
                .on('error', function(error) {
                    logApiFailure(req, error, perfLog);
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
