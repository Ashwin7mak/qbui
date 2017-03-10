/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let perfLogger = require('../../perfLogger');
    let httpStatusCodes = require('../../constants/httpStatusCodes');
    let log = require('../../logger').getLogger();
    let _ = require('lodash');

    module.exports = function(config, useMockStore) {
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        let requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        let constants = require('../../../../common/src/constants');

        let cookieUtils = require('../../utility/cookieUtils');
        let ob32Utils = require('../../utility/ob32Utils');
        let CookieConsts = require('../../../../common/src/constants');
        let mockApi = require('./mock/mockFeatureSwitchesApi')(config);

        let featureSwitchesApi = {

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

            getFeatureSwitchesRequestOpts(req, isOverrides, switchId, overrideId, bulkIds) {

                const opts = {
                    method: req.method,
                    body: req.rawBody,
                    headers: {}
                };
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                opts.cookies = req.cookies;

                let featureSwitchesUrl;

                if (bulkIds) {
                    featureSwitchesUrl = routeHelper.getFeatureSwitchesBulkRoute(req.url, isOverrides, switchId, overrideId, bulkIds);
                } else {
                    featureSwitchesUrl = routeHelper.getFeatureSwitchesRoute(req.url, isOverrides, switchId, overrideId);
                }

                opts.url = requestHelper.getRequestAWSHost() + featureSwitchesUrl;

                return opts;
            },

            getFeatureSwitchStatesRequestOpts(req, realmId, appId) {

                const opts = {
                    method: req.method,
                    body: req.rawBody,
                    headers: {}
                };
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                opts.cookies = req.cookies;

                const featureStatesUrl = routeHelper.getFeatureSwitchStatesRoute(req.url, appId, realmId);

                opts.url = requestHelper.getRequestAWSHost() + featureStatesUrl;

                return opts;
            },

            getFeatureSwitches: function(req) {
                return new Promise((resolve, reject) => {
                    if (useMockStore) {
                        resolve(mockApi.getFeatureSwitches(req));
                    } else {
                        let opts = this.getFeatureSwitchesRequestOpts(req);

                        //  make the api request to get the app rights
                        requestHelper.executeRequest({}, opts).then(
                            (response) => {
                                let featureSwitches = JSON.parse(response.body);
                                resolve(featureSwitches);
                            },
                            (error) => {
                                log.error({req: req}, "getFeatureSwitches.getFeatureSwitches(): Error retrieving feature switches.");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('getFeatureSwitches.getFeatureSwitches(): unexpected error retrieving feature switches.', ex, true);
                            reject(ex);
                        });
                    }
                });
            },

            createFeatureSwitch: function(req) {
                return new Promise((resolve, reject) => {
                    if (useMockStore) {
                        resolve(mockApi.createFeatureSwitch(req));

                    } else {
                        let opts = this.getFeatureSwitchesRequestOpts(req);

                        //  make the api request to get the app rights
                        requestHelper.executeRequest({}, opts).then(
                            (response) => {
                                let feature = JSON.parse(response.body);
                                resolve(feature);
                            },
                            (error) => {
                                log.error({req: req}, "getFeatureSwitches.createFeatureSwitch(): Error creating feature switch.");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('getFeatureSwitches.createFeatureSwitch(): unexpected error creating feature switch.', ex, true);
                            reject(ex);
                        });
                    }
                });
            },

            updateFeatureSwitch: function(req, featureSwitchId) {

                return new Promise((resolve, reject) => {
                    if (useMockStore) {
                        resolve(mockApi.updateFeatureSwitch(req, featureSwitchId));
                    } else {
                        let opts = this.getFeatureSwitchesRequestOpts(req, false, featureSwitchId);

                        //  make the api request to get the app rights
                        requestHelper.executeRequest({}, opts).then(
                            (response) => {
                                resolve();
                            },
                            (error) => {
                                log.error({req: req}, "getFeatureSwitches.updateFeatureSwitch(): Error updating feature switch.");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('getFeatureSwitches.updateFeatureSwitch(): unexpected error updating feature switch.', ex, true);
                            reject(ex);
                        });
                    }
                });
            },

            deleteFeatureSwitches: function(req, ids) {

                return new Promise((resolve, reject) => {
                    if (useMockStore) {
                        resolve(mockApi.deleteFeatureSwitches(req, ids));
                    } else {

                        let opts = this.getFeatureSwitchesRequestOpts(req, false, null, null, ids);

                        //  make the api request to get the app rights
                        requestHelper.executeRequest({}, opts).then(
                            (response) => {
                                resolve();
                            },
                            (error) => {
                                log.error({req: req}, "getFeatureSwitches.deleteFeatureSwitches(): Error deleting feature switches.");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('getFeatureSwitches.deleteFeatureSwitches(): unexpected error deleting feature switches.', ex, true);
                            reject(ex);
                        });
                    }
                });
            },

            createFeatureSwitchOverride: function(req, featureSwitchId) {

                return new Promise((resolve, reject) => {
                    if (useMockStore) {
                        resolve(mockApi.createFeatureSwitchOverride(req, featureSwitchId));

                    } else {
                        let opts = this.getFeatureSwitchesRequestOpts(req, true, featureSwitchId);

                        //  make the api request to get the app rights
                        requestHelper.executeRequest({}, opts).then(
                            (response) => {
                                let override = JSON.parse(response.body);
                                resolve(override);
                            },
                            (error) => {
                                log.error({req: req}, "getFeatureSwitches.createFeatureSwitchOverride(): Error creating feature override.");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('getFeatureSwitches.createFeatureSwitchOverride(): unexpected error creating feature override.', ex, true);
                            reject(ex);
                        });
                    }
                });
            },

            updateFeatureSwitchOverride: function(req, featureSwitchId, overrideId) {

                return new Promise((resolve, reject) => {
                    if (useMockStore) {

                        resolve(mockApi.updateFeatureSwitchOverride(req, featureSwitchId, overrideId));

                    } else {
                        let opts = this.getFeatureSwitchesRequestOpts(req, true, featureSwitchId, overrideId);

                        //  make the api request to get the app rights
                        requestHelper.executeRequest({}, opts).then(
                            (response) => {
                                resolve();
                            },
                            (error) => {
                                log.error({req: req}, "getFeatureSwitches.updateFeatureSwitchOverride(): Error updating feature override.");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('getFeatureSwitches.updateFeatureSwitchOverride(): unexpected error updating feature override.', ex, true);
                            reject(ex);
                        });

                    }
                });
            },

            deleteFeatureSwitchOverrides: function(req, featureSwitchId, ids) {

                return new Promise((resolve, reject) => {
                    if (useMockStore) {
                        resolve(mockApi.deleteFeatureSwitchOverrides(req, featureSwitchId, ids));

                    } else {
                        let opts = this.getFeatureSwitchesRequestOpts(req, true, featureSwitchId, null, ids);

                        //  make the api request to get the app rights
                        requestHelper.executeRequest({}, opts).then(
                            (response) => {
                                resolve();
                            },
                            (error) => {
                                log.error({req: req}, "getFeatureSwitches.deleteFeatureSwitchOverrides(): Error deleting feature overrides.");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('getFeatureSwitches.deleteFeatureSwitchOverrides(): unexpected error deleting feature overrides.', ex, true);
                            reject(ex);
                        });
                    }
                });
            },

            getFeatureSwitchStates: function(req, appId = null) {
                return new Promise((resolve, reject) => {
                    let realmId = null;
                    let ticketCookie = req.cookies && req.cookies[CookieConsts.COOKIES.TICKET];
                    if (ticketCookie) {
                        realmId = ob32Utils.decoder(cookieUtils.breakTicketDown(ticketCookie, 3));
                    }
                    if (useMockStore) {
                        resolve(mockApi.getFeatureSwitchStates(req, realmId, appId));
                    } else {
                        let opts = this.getFeatureSwitchStatesRequestOpts(req, realmId, appId);

                        //  make the api request to get the app rights
                        requestHelper.executeRequest({}, opts).then(
                            (response) => {
                                let featureStates = JSON.parse(response.body);
                                resolve(featureStates);
                            },
                            (error) => {
                                log.error({req: req}, "getFeatureSwitches.getFeatureSwitchStates(): Error retrieving feature switches.");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('getFeatureSwitches.getFeatureSwitchStates(): unexpected error retrieving feature switches.', ex, true);
                            reject(ex);
                        });
                    }
                });
            }
        };

        return featureSwitchesApi;
    };
}());
