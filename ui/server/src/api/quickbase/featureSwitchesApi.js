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

            getFeatureSwitchesRequestOpts(req) {

                const opts = {
                    method: req.method,
                    body: req.rawBody,
                    headers: {}
                };
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                opts.cookies = req.cookies;
                const featureSwitchesUrl = routeHelper.getFeatureSwitchesRoute(req.url);

                opts.url = requestHelper.getRequestAWSHost() + featureSwitchesUrl;

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
                                log.error({req: req}, "getFeatureSwitches.createFeatureSwitch(): Error retrieving feature switches.");
                                reject(error);
                            }
                        ).catch((ex) => {
                            requestHelper.logUnexpectedError('getFeatureSwitches.createFeatureSwitch(): unexpected error retrieving feature switches.', ex, true);
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
                        let opts = this.getFeatureSwitchesRequestOpts(req);

                        resolve(); // todo: call lambda
                    }
                });
            },

            deleteFeatureSwitches: function(req, ids) {

                return new Promise((resolve, reject) => {
                    if (useMockStore) {
                        resolve(mockApi.deleteFeatureSwitches(req, ids));
                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            createFeatureSwitchOverride: function(req, featureSwitchId) {

                return new Promise((resolve, reject) => {
                    if (useMockStore) {
                        resolve(mockApi.createFeatureSwitchOverride(req, featureSwitchId));

                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            updateFeatureSwitchOverride: function(req, featureSwitchId, overrideId) {

                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {

                        resolve(mockApi.updateFeatureSwitchOverride(req, featureSwitchId, overrideId));

                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            deleteFeatureSwitchOverrides: function(req, featureSwitchId, ids) {

                return new Promise((resolve, reject) => {
                    if (useMockStore) {
                        resolve(mockApi.deleteFeatureSwitchOverrides(req, featureSwitchId, ids));

                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            getFeatureSwitchStates: function(req, appId) {
                return new Promise((resolve, reject) => {
                    let states = {};

                    if (useMockStore) {
                        resolve(mockApi.getFeatureSwitchStates(req, appId));
                    } else {
                        // todo: call lambda
                    }

                    resolve(states);
                });
            }
        };

        return featureSwitchesApi;
    };
}());
