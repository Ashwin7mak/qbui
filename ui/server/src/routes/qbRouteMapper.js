
/**
 * The route mapper provides a static mapping from each route to the function we expect to call for that route
 * Created by cschneider1 on 7/2/15.
 */
(function() {
    'use strict';

    let _ = require('lodash');
    let log = require('../logger').getLogger();
    let perfLogger = require('../perfLogger');
    let routesConstants = require('./routeConstants');
    let env = require('../config/environment');
    let request = require('../requestClient').getClient(env);
    let routeGroupMapper = require('./qbRouteGroupMapper');
    let simpleStringify = require('./../../../common/src/simpleStringify.js');
    let queryFormatter = require('../api/quickbase/formatter/queryFormatter');
    let commonConstants = require('./../../../common/src/constants.js');
    const httpConstants = require('../constants/httpStatusCodes');

    //  these all are initialized with the config parameter
    let healthApi;
    let requestHelper;
    let formsApi;
    let recordsApi;
    let reportsApi;
    let appsApi;
    let rolesApi;
    let routeGroup;
    let usersApi;
    let tablesApi;
    let featureSwitchesApi;
    let accountUsersApi;
    let governanceApi;

    /*eslint no-shadow:0 */
    module.exports = function(config) {
        requestHelper = require('../api/quickbase/requestHelper')(config);
        routeGroup = config.routeGroup;

        healthApi = require('../api/quickbase/healthApi')(config);
        formsApi = require('../api/quickbase/formsApi')(config);
        recordsApi = require('../api/quickbase/recordsApi')(config);
        reportsApi = require('../api/quickbase/reportsApi')(config);
        appsApi = require('../api/quickbase/appsApi')(config);

        // initialize the feature switches API, use master.featureSwitches.json override these with config.featureSwitchConfigOverride if defined
        // (unit tests can override this through the 2nd parameter)
        featureSwitchesApi = require('../api/quickbase/featureSwitchesApi')(config, true);
        rolesApi = require('../api/quickbase/rolesApi')(config);
        usersApi = require('../api/quickbase/usersApi')(config);
        accountUsersApi = require('../governance/account/users/AccountUsersApi')(config);
        tablesApi = require('../api/quickbase/tablesApi')(config);
        governanceApi = require('../governance/common/GovernanceCommonApi')(config);

        /**
         * Define all DELETE routes which map to a custom function. Another words these
         * routes DO NOT just proxy through node to the backend server.
         *
         * @returns List of get routes
         */
        function bindDeleteRequestRouteToFunction(routes) {
            let requestFunctions = {};

            //  With multiple node instances, want to have the option of deploying an instance
            //  where only 'public' routes are defined.
            if (config.publicRoutesOnly !== true) {
                requestFunctions[routes.RECORD] = deleteSingleRecord;
                requestFunctions[routes.RECORDS_BULK] = deleteRecordsBulk;
                requestFunctions[routes.TABLE] = deleteTableComponents;
            }

            return requestFunctions;
        }

        /**
         * Define all GET routes
         *
         * @returns List of get routes
         */
        function bindGetRequestRouteToFunction(routes) {
            let requestFunctions = {};

            //  With multiple node instances, want to have the option of deploying an instance
            //  where only 'public' routes are defined.
            if (config.publicRoutesOnly !== true) {
                requestFunctions[routes.APPS] = getApps;
                requestFunctions[routes.APP_USERS] = getAppUsers;
                requestFunctions[routes.APP_ROLES] = getAppRoles;
                requestFunctions[routes.APP_COMPONENTS] = getAppComponents;

                /***
                 *  Shall be enabled when this epic is worked on :
                 *  https://quickbase.atlassian.net/browse/MC-1189
                 */
                // requestFunctions[routes.FEATURE_SWITCHES] = getFeatureSwitches;
                requestFunctions[routes.FEATURE_STATES] = getFeatureStates;

                requestFunctions[routes.FORM_COMPONENTS] = fetchFormComponents;
                requestFunctions[routes.FORM_AND_RECORD_COMPONENTS] = fetchFormAndRecordComponents;

                requestFunctions[routes.RECORD] = fetchSingleRecord;
                requestFunctions[routes.RECORDS] = fetchAllRecords;

                requestFunctions[routes.REPORT_META] = fetchReportMeta;
                requestFunctions[routes.REPORT_RESULTS] = fetchReportResults;
                requestFunctions[routes.REPORT_INVOKE_RESULTS] = fetchReportInvokeResults;
                requestFunctions[routes.REPORT_RECORDS_COUNT] = fetchReportRecordsCount;
                requestFunctions[routes.FACET_EXPRESSION_PARSE] = resolveReportFacets;

                requestFunctions[routes.TABLE_HOMEPAGE_REPORT] = fetchTableHomePageReport;

                requestFunctions[routes.REQ_USER] = getReqUser;

                requestFunctions[routes.GOVERNANCE_ACCOUNT_USERS] = getAccountUsers;
                requestFunctions[routes.GOVERNANCE_CONTEXT] = getGovernanceContext;
            }

            requestFunctions[routes.QBUI_HEALTH] = getHealthCheck;
            requestFunctions[routes.SWAGGER_CORE] = forwardApiRequest;
            requestFunctions[routes.SWAGGER_EE] = forwardApiRequest;
            requestFunctions[routes.SWAGGER_WE] = forwardApiRequest;

            requestFunctions[routes.SWAGGER_RESOURCES] = forwardApiRequest;
            requestFunctions[routes.SWAGGER_V2] = forwardApiRequest;

            return requestFunctions;
        }

        /**
         * Define all PATCH routes
         *
         * @returns List of get routes
         */
        function bindPatchRequestRouteToFunction(routes) {
            let requestFunctions = {};

            //  With multiple node instances, want to have the option of deploying an instance
            //  where only 'public' routes are defined.
            if (config.publicRoutesOnly !== true) {
                requestFunctions[routes.RECORD] = saveSingleRecord;
                requestFunctions[routes.TABLE] = updateTable;
            }

            return requestFunctions;
        }

        /**
         * Define all POST routes
         *
         * @returns List of get routes
         */
        function bindPostRequestRouteToFunction(routes) {
            let requestFunctions = {};

            //  With multiple node instances, want to have the option of deploying an instance
            //  where only 'public' routes are defined.
            if (config.publicRoutesOnly !== true) {
                /***
                 *  Shall be enabled when this epic is worked on :
                 *  https://quickbase.atlassian.net/browse/MC-1189
                 */
                // requestFunctions[routes.FEATURE_SWITCHES] = createFeatureSwitch;
                // requestFunctions[routes.FEATURE_OVERRIDES] = createFeatureSwitchOverride;
                // requestFunctions[routes.FEATURE_SWITCHES_BULK] = deleteFeatureSwitchesBulk;
                // requestFunctions[routes.FEATURE_OVERRIDES_BULK] = deleteFeatureSwitchOverridesBulk;

                requestFunctions[routes.APPS] = createApp;
                requestFunctions[routes.RECORDS] = createSingleRecord;
                requestFunctions[routes.RECORDS_BULK] = forwardApiRequest;
                requestFunctions[routes.TABLE_COMPONENTS] = createTableComponents;
            }

            return requestFunctions;
        }

        /**
         * Define all PUT routes
         *
         * @returns List of get routes
         */

        function bindPutRequestRouteToFunction(routes) {
            let requestFunctions = {};

            //  With multiple node instances, want to have the option of deploying an instance
            //  where only 'public' routes are defined.
            // if (config.publicRoutesOnly !== true) {
            //     requestFunctions[routes.FEATURE_SWITCH] = updateFeatureSwitch;
            //     requestFunctions[routes.FEATURE_OVERRIDE] = updateFeatureSwitchOverride;
            // }

            return requestFunctions;
        }

        /**
         * Define routes which support all request methods
         *
         * @returns List of get routes
         */
        function bindAllRequestRouteToFunction(routes) {
            let requestFunctions = {};
            //
            routesConstants.publicEndPoints.forEach(endPoint => {
                requestFunctions[endPoint.route] = forwardApiRequest;
            });
            //
            requestFunctions[routes.CORE_ENGINE] = forwardApiRequest;
            requestFunctions[routes.EXPERIENCE_ENGINE] = forwardApiRequest;
            requestFunctions[routes.WORKFLOW_ENGINE] = forwardApiRequest;
            requestFunctions[routes.AUTOMATION_ENGINE] = forwardApiRequest;

            return requestFunctions;
        }

        // Map all requests
        let routeToGetFunction = bindGetRequestRouteToFunction(routesConstants.routes);
        let routeToPostFunction = bindPostRequestRouteToFunction(routesConstants.routes);
        let routeToPutFunction = bindPutRequestRouteToFunction(routesConstants.routes);
        let routeToPatchFunction = bindPatchRequestRouteToFunction(routesConstants.routes);
        let routeToDeleteFunction = bindDeleteRequestRouteToFunction(routesConstants.routes);
        let routeToAllFunction = bindAllRequestRouteToFunction(routesConstants.routes);

        return {

            /**
             * Return all registered routes
             * @returns {*[]}
             */
            fetchAllRoutes: function() {
                return routesConstants.routes;
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

    /**
     * Common function to log a consistent api success message and output
     * optional performance information if a perfLog object is included on
     * the request.
     *
     * @param req
     * @param response
     * @param perfLog
     * @param apiName
     */
    function logApiSuccess(req, response, perfLog, apiName) {
        log.debug({req: filterNodeReq(req), res:response}, apiName ? 'API SUCCESS:' + apiName : 'API SUCCESS');
        if (perfLog) {
            perfLog.log();
        }
    }

    /**
     * Common function to log a consistent api failure message and output
     * optional performance information if a perfLog object is included on
     * the request.
     *
     * @param req
     * @param response
     * @param perfLog
     * @param apiName
     */
    function logApiFailure(req, response, perfLog, apiName) {
        log.error({req: req, res:response}, apiName ? 'API ERROR:' + apiName : 'API ERROR');
        if (perfLog) {
            perfLog.log();
        }
    }

    /**
     * This helper method examines the req.url and updates based on whether
     * it is a client customer endpoint or public short-hand notation endpoint.
     *
     * @param req
     */
    function modifyRequestPathForApi(req) {
        //   if this is a client endpoint route, replace the client route identifier with its back-end context.
        let clientRoute = routesConstants.clientEndPoints.find(endPoint => endPoint.regEx.test(req.url) === true);
        if (clientRoute) {
            req.url = req.url.replace(clientRoute.route, clientRoute.context);
            return;
        }

        //  if this is a public endpoint route, prepend its back-end context
        let publicRoute = routesConstants.publicEndPoints.find(endPoint => endPoint.regEx.test(req.url) === true);
        if (publicRoute) {
            req.url = publicRoute.context + req.url;
            return;
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
     * Completes a health check for the node layer
     *
     * Does not include any unnecessary tasks (e.g., performance logging) so
     * that this request can be as fast as possible.
     * @param req
     * @param res
     */
    function getHealthCheck(req, res) {
        healthApi.getShallowHealthCheck().then(
            success => res.send(success),
            error => {
                if (error && error.statusCode) {
                    res.status(error.statusCode).send(error);
                } else {
                    res.status(httpConstants.INTERNAL_SERVER_ERROR).send(error);
                }
            }
        );
    }

    /**
     * get account users
     *
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        }
    }

    /**
     * Get context of the governance
     * @param req
     * @param res
     */
    function getGovernanceContext(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get governance context', {req:filterNodeReq(req)});

        if (!isRouteEnabled(req)) {
            routeTo404(req, res);
        } else {
            governanceApi.getContext(req, req.query.accountId).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Get governance context');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Get governance context');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * create new feature switch
     * @param req
     * @param res
     */
    function createFeatureSwitch(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Create feature switch', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * update existing feature switch
     * @param req
     * @param res
     */
    function updateFeatureSwitch(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Update feature switch', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * delete a set of feature switches
     * @param req
     * @param res
     */
    function deleteFeatureSwitchesBulk(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Delete feature switches', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * create feature switch override
     * @param req
     * @param res
     */
    function createFeatureSwitchOverride(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Create feature switch override', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * update an override for a feature switch
     * @param req
     * @param res
     */
    function updateFeatureSwitchOverride(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Save feature switch overrides', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * delete a set of feature switch overrides
     * @param req
     * @param res
     */
    function deleteFeatureSwitchOverridesBulk(req, res) {

        let perfLog = perfLogger.getInstance();
        perfLog.init('Delete feature switch overrides', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * get current feature states
     * @param req
     * @param res
     */
    function getFeatureStates(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get feature states', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * Return an app with table information and app rights
     * @param req
     * @param res
     */
    function getAppComponents(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get App Components', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {

            let appId = req.params.appId ? req.params.appId : null;
            appsApi.getAppComponents(req, appId).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Get App Hydrated');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Get App Hydrated');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * Create an app.  The request adds to both core and ee.
     *
     * @param req
     * @param res
     */
    function createApp(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Get App', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            appsApi.createApp(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Create App');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Create App');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
            reportsApi.fetchReportCount(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'Fetch Report records count');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'Fetch Report records count');
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    function resolveReportFacets(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Resolve Report Facets', {req:filterNodeReq(req)});

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

        processRequest(req, res, function(req, res) {
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    function createSingleRecord(req, res) {
        let activityName = 'Add Record';
        let perfLog = perfLogger.getInstance();
        perfLog.init(activityName, {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
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
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    function createTableComponents(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Create table components', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            tablesApi.createTableComponents(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'createTableComponents');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'createTableComponents');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    function updateTable(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Update table', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            tablesApi.updateTable(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'updateTable');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'updateTable');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    function deleteTableComponents(req, res) {
        let perfLog = perfLogger.getInstance();
        perfLog.init('Delete table', {req:filterNodeReq(req)});

        processRequest(req, res, function(req, res) {
            tablesApi.deleteTableComponents(req).then(
                function(response) {
                    res.send(response);
                    logApiSuccess(req, response, perfLog, 'deleteTableComponents');
                },
                function(response) {
                    logApiFailure(req, response, perfLog, 'deleteTableComponents');

                    //  client is waiting for a response..make sure one is always returned
                    if (response && response.statusCode) {
                        res.status(response.statusCode).send(response);
                    } else {
                        res.status(httpConstants.INTERNAL_SERVER_ERROR).send(response);
                    }
                }
            );
        });
    }

    /**
     * Forward a request
     *
     * @param req
     * @param res
     */
    function forwardApiRequest(req, res) {
        processRequest(req, res, function(req, res) {
            let opts;
            switch (true) {
            case req.url.startsWith('/api'):
                opts = requestHelper.setOptions(req);
                break;
            case req.url.startsWith('/ee'):
                opts = requestHelper.setExperienceEngineOptions(req);
                break;
            case req.url.startsWith('/we'):
                opts = requestHelper.setAutomationEngineOptions(req);
                break;
            }

            if (opts) {
                let perfLog = perfLogger.getInstance();
                perfLog.init('Forward Request', {req:filterNodeReq(req)});
                request(opts)
                    .on('response', function(response) {
                        logApiSuccess(req, response, perfLog);
                    })
                    .on('error', function(error) {
                        logApiFailure(req, error, perfLog);
                    })
                    .pipe(res);
            } else {
                log.error({req:req}, 'Forward Request error.  Unable to determine route request.');
                routeTo404(req, res);
            }
        });
    }

    /**
     * Method explicitly returns a 404 after logging relevant information
     * @param req
     * @param res
     */
    function routeTo404(req, res) {
        log.error({req:req, res:res}, 'Route is not enabled for routeGroup ' + routeGroup);
        res.status(httpConstants.NOT_FOUND).send();
    }

    /**
     * Check that the route has been enabled for this environment
     * @param req
     */
    function isRouteEnabled(req) {
        if (req !== undefined) {
            if (req.route !== undefined && req.method !== undefined) {
                return routeGroupMapper.routeIsEnabled(routeGroup, req.route.path, req.method);
            }
        }
        return false;
    }

}());
