/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let fs = require('fs');
    let uuid = require('uuid');
    let perfLogger = require('../../perfLogger');
    let httpStatusCodes = require('../../constants/httpStatusCodes');
    let log = require('../../logger').getLogger();
    let _ = require('lodash');


    module.exports = function(config) {
        let requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        let constants = require('../../../../common/src/constants');

        let featureSwitchesMockData;

        /**
         * load mock data from config.featureSwitchesMockData
         */
        function loadSwitchesMockData() {
            let data = fs.readFileSync(config.featureSwitchesMockData, 'utf8');
            return JSON.parse(data);
        }

        /**
         * save mock data to config.featureSwitchesMockData
         */
        function saveSwitchesMockData() {
            fs.writeFile(config.featureSwitchesMockData, JSON.stringify(featureSwitchesMockData, null, '  '), 'utf8');
        }

        let featureSwitchesApi = {

            getFeatureSwitches: function(req) {
                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {
                        if (!featureSwitchesMockData) {
                            featureSwitchesMockData = loadSwitchesMockData();
                        }
                        resolve(featureSwitchesMockData);

                    } else {
                        resolve([]); // todo: call lambda
                    }
                });
            },

            createFeatureSwitch: function(req) {
                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {

                        let bodyJSON = JSON.parse(req.rawBody);
                        let feature = bodyJSON.feature;
                        feature.id = uuid.v4();
                        feature.overrides = [];

                        featureSwitchesMockData.push(feature);

                        saveSwitchesMockData();

                        resolve(feature.id);

                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            updateFeatureSwitch: function(req, featureSwitchId) {

                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {

                        let bodyJSON = JSON.parse(req.rawBody);
                        let feature = bodyJSON.feature;

                        let index = _.findIndex(featureSwitchesMockData, function(sw) {return sw.id === featureSwitchId;});

                        if (index !== -1) {
                            featureSwitchesMockData[index] = feature;
                            saveSwitchesMockData();
                        }
                        resolve();

                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            deleteFeatureSwitches: function(req, ids) {

                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {
                        _.remove(featureSwitchesMockData, function(sw) {return ids.indexOf(sw.id) !== -1;});

                        saveSwitchesMockData();

                        resolve(ids);

                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            createFeatureSwitchOverride: function(req, featureSwitchId) {

                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {

                        let bodyJSON = JSON.parse(req.rawBody);
                        let override = bodyJSON.override;

                        let featureSwitch = _.find(featureSwitchesMockData, function(sw) {return sw.id === featureSwitchId;});

                        if (featureSwitch) {
                            override.id = uuid.v4();

                            if (featureSwitch.overrides)  {
                                featureSwitch.overrides.push(override);
                            } else {
                                featureSwitch.overrides = [override];
                            }

                            saveSwitchesMockData();
                        }
                        resolve(override.id);

                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            updateFeatureSwitchOverride: function(req, featureSwitchId, overrideId) {

                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {

                        let bodyJSON = JSON.parse(req.rawBody);
                        let overrideData = bodyJSON.override;

                        let featureSwitch = _.find(featureSwitchesMockData, function(sw) {return sw.id === featureSwitchId;});

                        if (featureSwitch && overrideData) {
                            let index = _.findIndex(featureSwitch.overrides, function(override) {
                                return override.id === overrideId;
                            });

                            if (index !== -1) {
                                featureSwitch.overrides[index] = overrideData;
                                saveSwitchesMockData();
                            }
                        }
                        resolve();

                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            deleteFeatureSwitchOverrides: function(req, featureSwitchId, ids) {

                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {
                        let featureSwitch = _.find(featureSwitchesMockData, function(sw) {return sw.id === featureSwitchId;});

                        _.remove(featureSwitch.overrides, function(override) {return ids.indexOf(override.id) !== -1;});

                        saveSwitchesMockData();

                        resolve(ids);

                    } else {
                        resolve(); // todo: call lambda
                    }
                });
            },

            getFeatureSwitchStates: function(req, appId) {
                return new Promise((resolve, reject) => {
                    let states = {};

                    if (config && config.featureSwitchesMockData) {
                        if (!featureSwitchesMockData) {
                            featureSwitchesMockData = loadSwitchesMockData();
                        }
                        featureSwitchesMockData.forEach(function(featureSwitch) {
                            states[featureSwitch.name] = featureSwitch.defaultOn;
                        });
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
