/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let defaultRequest = require('request');
    let perfLogger = require('../../perfLogger');
    let httpStatusCodes = require('../../constants/httpStatusCodes');
    let log = require('../../logger').getLogger();
    let _ = require('lodash');

    module.exports = function(config) {
        let requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        let constants = require('../../../../common/src/constants');

        let request = defaultRequest;

        let appsApi = {

            /**
             * Allows you to override the request object
             * @param requestOverride
             */
            setRequestObject: function(requestOverride) {
                request = requestOverride;
            },
            /**
             * Allows you to override the requestHelper object
             * @param requestRequestOverride
             */
            setRequestHelperObject: function(requestHelperOverride) {
                requestHelper = requestHelperOverride;
            },

            getAppAccessRights: function(req, appId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppsAccessRightsRoute(req.url, appId);

                    //  make the api request to get the app rights
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let rights = JSON.parse(response.body);
                            resolve(rights);
                        },
                        (error) => {
                            log.error({req: req}, "appsApi.getAppAccessRights(): Error retrieving app access rights.");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('appsApi.getAppAccessRights(): unexpected error fetching app access rights.', ex, true);
                        reject(ex);
                    });
                });
            },

            getApp: function(req, appId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppsRoute(req.url, appId);

                    //  make the api request to get the app
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let app = JSON.parse(response.body);
                            resolve(app);
                        },
                        (error) => {
                            log.error({req: req}, "appsApi.getApp(): Error retrieving app.");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('appsApi.getApp(): unexpected error fetching app', ex, true);
                        reject(ex);
                    });
                });
            },

            getHydratedApp: function(req, appId) {
                return new Promise((resolve, reject) => {
                    let appRequests = [this.getApp(req, appId), this.getAppAccessRights(req, appId), this.stackPreference(req, appId)];
                    Promise.all(appRequests).then(
                        function(response) {
                            let app = response[0];
                            app.accessRights = response[1];
                            if (response[2].errorCode === 0) {
                                app.openInV3 = (response[2].v3Status === true);
                            } else {
                                //TODO comment out until legacy stack configuration is in place
                                //log.warn('Error fetching application stack preference.  Setting to open in V3.  Error: ' + response[2].errorText);
                                app.openInV3 = true;
                            }
                            resolve(app);
                        },
                        function(error) {
                            log.error({req: req}, "appsApi.getHydratedApp(): Error retrieving hydrated app.");
                            reject(error);
                        }
                    ).catch(function(error) {
                        requestHelper.logUnexpectedError('reportsAPI..getHydratedApp', error, true);
                        reject(error);
                    });
                });
            },

            getApps: function(req) {
                let hydrate = (requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.HYDRATE) === '1');
                if (hydrate === true) {
                    return new Promise((resolve, reject) => {
                        let opts = requestHelper.setOptions(req);
                        opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppsRoute(req.url);

                        //  make the api request to get the apps
                        requestHelper.executeRequest(req, opts).then(
                            (response) => {
                                let apps = JSON.parse(response.body);

                                //  TODO: investigate...concern if the number of apps is large???
                                let promises = [];
                                apps.forEach((app) => {
                                    promises.push(this.getHydratedApp(_.clone(req), app.id));
                                });

                                Promise.all(promises).then(
                                    function(resp) {
                                        let hydratedApps = [];
                                        for (let i = 0; i < resp.length; i++) {
                                            hydratedApps.push(resp[i]);
                                        }
                                        resolve(hydratedApps);
                                    },
                                    function(err) {
                                        log.error({req: req}, "appsApi.getApps(): Error retrieving app in hydrated apps");
                                        reject(err);
                                    }
                                );
                            },
                            (error) => {
                                log.error({req: req}, "appsApi.getApps(): Error retrieving list of apps");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('appsApi.getApps()..unexpected error retrieving list of hydrated apps', ex, true);
                            reject(ex);
                        });
                    });
                } else {
                    return new Promise((resolve, reject) => {
                        let opts = requestHelper.setOptions(req);
                        opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppsRoute(req.url);

                        //  make the api request to get the apps
                        requestHelper.executeRequest(req, opts).then(
                            (response) => {
                                let apps = JSON.parse(response.body);
                                resolve(apps);
                            },
                            (error) => {
                                log.error({req: req}, "appsApi.getApps(): Error retrieving hydrated apps");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('appsApi.getApps()..unexpected error fetching apps', ex, true);
                            reject(ex);
                        });
                    });
                }
            },

            /**
             *
             * @param req
             * @returns Promise
             */
            getAppUsers: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getAppUsersRoute(req.url);

                    //  make the api request to get the app users
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let users = {};
                            if (response.body) {
                                users = JSON.parse(response.body);
                                if (users) {
                                    //  convert id property to userId for consistency with user values in records
                                    users.forEach(user => {
                                        user.userId = user.id;
                                        _.unset(user, "id");
                                    });
                                }
                            }
                            resolve(users);
                        },
                        (error) => {
                            log.error({req: req}, "Error getting app users in getAppUsers()");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('appsAPI..unexpected error fetching app user in getAppUsers method', ex, true);
                        reject(ex);
                    });
                });
            },

            /**
             * Supports both GET and POST request to resolve an applications run-time stack
             * preference.
             *
             * For a GET request, will return which stack (mercury or classic) the application is
             * configured to run in.
             *
             * For a POST request, will set the application stack (mercury or classic) preference
             * on where the application is to be run.
             *
             * @param req
             * @returns Promise
             */
            stackPreference: function(req, appId) {
                let opts = requestHelper.setOptions(req);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                let subDomain = requestHelper.getLegacySubDomain(req);
                if (requestHelper.isPost(req)) {
                    //  if a post request, then updating stack preference
                    let resp = JSON.parse(opts.body);
                    let value = resp[constants.REQUEST_PARAMETER.OPEN_IN_V3] === true ? 1 : 0;
                    opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackPreferenceRoute(appId, subDomain, true, value);
                } else {
                    opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackPreferenceRoute(appId, subDomain);
                }

                log.debug("Legacy Stack preference endpoint: " + opts.url);

                return new Promise((resolve) => {
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let msg = JSON.parse(response.body);
                            if (msg.errorCode !== 0) {
                                log.error({req: req}, opts.url);
                            }
                            resolve(msg);
                        },
                        (error) => {
                            //TODO comment out until legacy stack configuration is in place
                            //log.error({req: req, res:error}, opts.url);
                            resolve({errorText: error ? error.message : 'Unknown error thrown calling for stack preference.'});
                        }
                    ).catch((ex) => {
                        //TODO comment out until legacy stack configuration is in place
                        //requestHelper.logUnexpectedError('Unexpected error calling legacy stack preference: ' + opts.url, ex, true);
                        resolve(ex);
                    });
                });
            }

        };
        return appsApi;
    };
}());
