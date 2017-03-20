
/**
 * The route mapper provides a static mapping from each route to the function we expect to call for that route
 * Created by cschneider1 on 7/2/15.
 */
(function() {
    'use strict';

    let log = require('../logger').getLogger();
    let perfLogger = require('../perfLogger');
    let routeConsts = require('./routeConstants');
    let request = require('request');
    let routeGroupMapper = require('./qbRouteGroupMapper');
    let simpleStringify = require('./../../../common/src/simpleStringify.js');
    let queryFormatter = require('../api/quickbase/formatter/queryFormatter');
    let commonConstants = require('./../../../common/src/constants.js');

    //  these all are initialized with the config parameter
    let requestHelper;
    let formsApi;
    let recordsApi;
    let reportsApi;
    let appsApi;
    let rolesApi;
    let routeGroup;
    let usersApi;
    let featureSwitchesApi;
    let accountUsersApi;

    module.exports = function(config) {
        requestHelper = require('../api/quickbase/requestHelper')(config);
        routeGroup = config.routeGroup;

        formsApi = require('../api/quickbase/formsApi')(config);
        recordsApi = require('../api/quickbase/recordsApi')(config);
        reportsApi = require('../api/quickbase/reportsApi')(config);
        appsApi = require('../api/quickbase/appsApi')(config);

        // initialize the feature switches API, use mock API if config.featureSwitchesMockData is defined
        // (unit tests can override this through the 2nd parameter)
        featureSwitchesApi = require('../api/quickbase/featureSwitchesApi')(config, config.featureSwitchesMockData);
        rolesApi = require('../api/quickbase/rolesApi')(config);
        usersApi = require('../api/quickbase/usersApi')(config);
        accountUsersApi = require('../governance/account/users/AccountUsersApi')(config);

        /* internal data */
        /*
         * routeToGetFunction maps each route to the proper function associated with that route for a GET request
         */
        var routeToGetFunction = {};

        routeToGetFunction[routeConsts.FEATURE_SWITCHES] = getFeatureSwitches;
        routeToGetFunction[routeConsts.FEATURE_STATES] = getFeatureStates;

        // governance endpoints
        routeToGetFunction[routeConsts.GOVERNANCE_ACCOUNT_USERS] = getAccountUsers;

        //  app endpoints
        routeToGetFunction[routeConsts.APPS] = getApps;
        routeToGetFunction[routeConsts.APP_USERS] = getAppUsers;

        routeToGetFunction[routeConsts.FACET_EXPRESSION_PARSE] = resolveFacets;

        //  form endpoints
        routeToGetFunction[routeConsts.FORM_COMPONENTS] = fetchFormComponents;
        routeToGetFunction[routeConsts.FORM_AND_RECORD_COMPONENTS] = fetchFormAndRecordComponents;

        //  record endpoints
        routeToGetFunction[routeConsts.RECORD] = fetchSingleRecord;
        routeToGetFunction[routeConsts.RECORDS] = fetchAllRecords;

        //  report endpoints
        routeToGetFunction[routeConsts.REPORT_META] = fetchReportMeta;
        routeToGetFunction[routeConsts.REPORT_RESULTS] = fetchReportResults;
        routeToGetFunction[routeConsts.REPORT_INVOKE_RESULTS] = fetchReportInvokeResults;
        routeToGetFunction[routeConsts.REPORT_RECORDS_COUNT] = fetchReportRecordsCount;
        routeToGetFunction[routeConsts.TABLE_HOMEPAGE_REPORT] = fetchTableHomePageReport;

        routeToGetFunction[routeConsts.SWAGGER_API] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_RESOURCES] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_IMAGES] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_DOCUMENTATION] = fetchSwagger;

        routeToGetFunction[routeConsts.SWAGGER_API_EE] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_RESOURCES_EE] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_IMAGES_EE] = fetchSwagger;
        routeToGetFunction[routeConsts.SWAGGER_DOCUMENTATION_EE] = fetchSwagger;

        //  role endpoints
        routeToGetFunction[routeConsts.APP_ROLES] = getAppRoles;

        routeToGetFunction[routeConsts.HEALTH_CHECK] = forwardApiRequest;

        //  users endpoints
        routeToGetFunction[routeConsts.REQ_USER] = getReqUser;

        /*
         * routeToPostFunction maps each route to the proper function associated with that route for a POST request
         */
        var routeToPostFunction = {};
        routeToPostFunction[routeConsts.RECORDS] = createSingleRecord;


        routeToPostFunction[routeConsts.FEATURE_SWITCHES] = createFeatureSwitch;
        routeToPostFunction[routeConsts.FEATURE_OVERRIDES] = createFeatureSwitchOverride;
        routeToPostFunction[routeConsts.FEATURE_SWITCHES_BULK] = deleteFeatureSwitchesBulk;
        routeToPostFunction[routeConsts.FEATURE_OVERRIDES_BULK] = deleteFeatureSwitchOverridesBulk;

        /*
         * routeToPutFunction maps each route to the proper function associated with that route for a PUT request
         */
        var routeToPutFunction = {};
        routeToPutFunction[routeConsts.FEATURE_SWITCH] = updateFeatureSwitch;
        routeToPutFunction[routeConsts.FEATURE_OVERRIDE] = updateFeatureSwitchOverride;

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
        routeToAllFunction[routeConsts.EXPERIENCE_ENGINE_ALL] = forwardExperienceEngineApiRequest;

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
        log.debug({req: filterNodeReq(req), res:response}, apiName ? 'API SUCCESS:' + apiName : 'API SUCCESS');
        if (perfLog) {
            perfLog.log();
        }
    }

    function logApiFailure(req, response, perfLog, apiName) {
        log.error({req: req, res:response}, apiName ? 'API ERROR:' + apiName : 'API ERROR');
        if (perfLog) {
            perfLog.log();
        }
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
     *
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
     * get feature switches with overrides
     * @param req
     * @param res
     */
    function getFeatureSwitches(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get feature switches', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            featureSwitchesApi.getFeatureSwitches(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Get feature switches');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Get feature switches');

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
     * get account users
     * @param req
     * @param res
     */
    function getAccountUsers(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get account users', {req:filterNodeReq(req)});

        if (!isRouteEnabled(req)) {
            routeTo404(req, res);
        } else {
            accountUsersApi.getAccountUsers(req, req.params.accountId).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Get account Users');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Get account Users');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(500).send(response);
                    }
                }
            );
        }
    }


    /**
     * create new feature switch
     * @param req
     * @param res
     */
    function createFeatureSwitch(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Create feature switch', {req:filterNodeReq(req)});

        featureSwitchesApi.createFeatureSwitch(req).then(
            function(response) {
                res.send(response);
                logApiSuccess(req, response, perfLog, 'Create feature switch');
            },
            function(response) {
                logApiFailure(req, response, perfLog, 'Create feature switch');

                //  client is waiting for a response..make sure one is always returned
                if (response && response.statusCode) {
                    res.status(response.statusCode).send(response);
                } else {
                    res.status(500).send(response);
                }
            }
        );
    }

    /**
     * update existing feature switch
     * @param req
     * @param res
     */
    function updateFeatureSwitch(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Update feature switch', {req:filterNodeReq(req)});

        featureSwitchesApi.updateFeatureSwitch(req, req.params.featureSwitchId).then(
            function(response) {
                res.send(response);
                logApiSuccess(req, response, perfLog, 'Update feature switch');
            },
            function(response) {
                logApiFailure(req, response, perfLog, 'Update feature switch');

                //  client is waiting for a response..make sure one is always returned
                if (response && response.statusCode) {
                    res.status(response.statusCode).send(response);
                } else {
                    res.status(500).send(response);
                }
            }
        );
    }

    /**
     * delete a set of feature switches
     * @param req
     * @param res
     */
    function deleteFeatureSwitchesBulk(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Delete feature switches', {req:filterNodeReq(req)});

        let ids = req.query && req.query.ids ? req.query.ids.split(',') : [];
        featureSwitchesApi.deleteFeatureSwitches(req, ids).then(
            function(response) {
                res.send(response);
                logApiSuccess(req, response, perfLog, 'Delete feature switches');
            },
            function(response) {
                logApiFailure(req, response, perfLog, 'Delete features switches');

                //  client is waiting for a response..make sure one is always returned
                if (response && response.statusCode) {
                    res.status(response.statusCode).send(response);
                } else {
                    res.status(500).send(response);
                }
            }
        );
    }

    /**
     * create feature switch override
     * @param req
     * @param res
     */
    function createFeatureSwitchOverride(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Create feature switch override', {req:filterNodeReq(req)});

        featureSwitchesApi.createFeatureSwitchOverride(req, req.params.featureSwitchId).then(
            function(response) {
                res.send(response);
                logApiSuccess(req, response, perfLog, 'Create feature switch override');
            },
            function(response) {
                logApiFailure(req, response, perfLog, 'Create feature switch override');

                //  client is waiting for a response..make sure one is always returned
                if (response && response.statusCode) {
                    res.status(response.statusCode).send(response);
                } else {
                    res.status(500).send(response);
                }
            }
        );
    }

    /**
     * update an override for a feature switch
     * @param req
     * @param res
     */
    function updateFeatureSwitchOverride(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Save feature switch overrides', {req:filterNodeReq(req)});

        featureSwitchesApi.updateFeatureSwitchOverride(req, req.params.featureSwitchId, req.params.overrideId).then(
            function(response) {
                res.send(response);
                logApiSuccess(req, response, perfLog, 'Save feature switch overrides');
            },
            function(response) {
                logApiFailure(req, response, perfLog, 'Save feature switch overrides');

                //  client is waiting for a response..make sure one is always returned
                if (response && response.statusCode) {
                    res.status(response.statusCode).send(response);
                } else {
                    res.status(500).send(response);
                }
            }
        );
    }

    /**
     * delete a set of feature switch overrides
     * @param req
     * @param res
     */
    function deleteFeatureSwitchOverridesBulk(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Delete feature switch overrides', {req:filterNodeReq(req)});

        let ids = req.query && req.query.ids ? req.query.ids.split(',') : [];
        featureSwitchesApi.deleteFeatureSwitchOverrides(req, req.params.featureSwitchId, ids).then(
            function(response) {
                res.send(response);
                logApiSuccess(req, response, perfLog, 'Delete feature switch overrides');
            },
            function(response) {
                logApiFailure(req, response, perfLog, 'Delete features switch overrides');

                //  client is waiting for a response..make sure one is always returned
                if (response && response.statusCode) {
                    res.status(response.statusCode).send(response);
                } else {
                    res.status(500).send(response);
                }
            }
        );
    }

    /**
     * get current feature states
     * @param req
     * @param res
     */
    function getFeatureStates(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get feature states', {req:filterNodeReq(req)});

        let appId = req.query && req.query.appId;

        featureSwitchesApi.getFeatureSwitchStates(req, appId ? appId : null).then(
            function(response) {
                res.send(response);
                logApiSuccess(req, response, perfLog, 'Get feature states');
            },
            function(response) {
                logApiFailure(req, response, perfLog, 'Get feature states');

                //  client is waiting for a response..make sure one is always returned
                if (response && response.statusCode) {
                    res.status(response.statusCode).send(response);
                } else {
                    res.status(500).send(response);
                }
            }
        );
    }

    /**
     * Return list of apps.
     *
     * Note: if request includes query parameter hydrate=1, then the return object will
     * include appRights.
     *
     * @param req
     * @param res
     */
    function getApps(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get Apps', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            appsApi.getApps(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Get Apps');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Get Apps');

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
     * Fetch report meta data.
     *
     * @param req
     * @param res
     */
    function fetchReportMeta(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Report Meta', {req: filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            let rptId = req.params.reportId ? req.params.reportId : null;
            reportsApi.fetchReportMetaData(req, rptId).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Report Meta');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Report Meta');
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
     * This is a wrapper function for fetching report results
     * when paging and/or overriding the default report meta data.
     *
     * @param req
     * @param res
     * @returns {*}
     */
    function fetchReportInvokeResults(req, res) {
        fetchReport(req, res, true, false);
    }

    /**
     * This is a wrapper function for fetching report results
     * when loading a report using the default report meta data.
     *
     * @param req
     * @param res
     * @returns {*}
     */
    function fetchReportResults(req, res) {
        fetchReport(req, res, true, true);
    }

    /**
     * This function fetches the report results from the reportsApi endpoint.  It should
     * only get called from either the fetchReportInvokeResults or fetchReportResults
     * wrapper functions.
     *
     * @param req
     * @param res
     * @param includeFacets - should the report facet information be included in the response
     * @param useReportMetaData - if false, allows for override of report meta data defaults with
     * a query parameter value included on the request (query expression, clist, slist, etc).
     */
    function fetchReport(req, res, includeFacets, useReportMetaData) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Fetch Report Results', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {

            //  get the reportId
            let reportId = req.params ? req.params.reportId : '';

            //  If the route request is for the default table report (/apps/:appId/tables/:tableId/reports/default/results),
            //  set the report id to ('0'). This is an internal id value that is used to identify that this
            //  is a request to generate the synthetic default table report.
            if (reportId === commonConstants.SYNTHETIC_TABLE_REPORT.ROUTE) {
                reportId = commonConstants.SYNTHETIC_TABLE_REPORT.ID;
            }

            reportsApi.fetchReport(req, reportId, includeFacets, useReportMetaData).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Report Results');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Report Results');

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
     * This is the function for getting all roles for an app
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function getAppRoles(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get App Roles', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            rolesApi.getAppRoles(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Get App Roles');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Get App Roles');

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

    function getReqUser(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get User by id', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            usersApi.getReqUser(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'getReqUser');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'getReqUser');

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
     * This is the function for proxying to a swagger endpoint on
     * either core or experience engine.
     *
     * @param req
     * @param res
     */
    function fetchSwagger(req, res) {
        //  ensure the route is enabled
        if (!isRouteEnabled(req)) {
            routeTo404(req, res);
            return;
        }

        //  log some route info and set the request options
        log.debug({req: req}, 'Fetch swagger');

        //  experience engine or core
        let opts = req.url.startsWith(routeConsts.SWAGGER_API_EE) ? requestHelper.setExperienceEngineOptions(req) : requestHelper.setOptions(req);
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
     * This is the function for forwarding a request to the experience engine server.  Expectation
     * is that the data in the body of the response is a json structure for all requests.
     *
     * @param req
     * @param res
     */
    /*eslint no-shadow:0 */
    function forwardExperienceEngineApiRequest(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Forward experience engine API Request', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            var opts = requestHelper.setExperienceEngineOptions(req);
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
