/*
 This module implements the feature switches API using a local JSON file store instead of AWS.
 */
(function() {
    'use strict';

    let fs = require('fs');
    let uuid = require('uuid');
    let httpStatusCodes = require('../../../constants/httpStatusCodes');
    let _ = require('lodash');

    module.exports = function(config) {

        let constants = require('../../../../../common/src/constants');

        let cookieUtils = require('../../../utility/cookieUtils');
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

                    if (!featureSwitchesMockData) {
                        featureSwitchesMockData = loadSwitchesMockData();
                    }
                    resolve(featureSwitchesMockData);
                });
            },

            createFeatureSwitch: function(req) {
                return new Promise((resolve, reject) => {
                    let feature = JSON.parse(req.rawBody);
                    feature.id = uuid.v4();
                    feature.overrides = [];

                    featureSwitchesMockData.push(feature);

                    saveSwitchesMockData();

                    resolve(feature);
                });
            },

            updateFeatureSwitch: function(req, featureSwitchId) {

                return new Promise((resolve, reject) => {
                    let feature = JSON.parse(req.rawBody);

                    let index = _.findIndex(featureSwitchesMockData, function(sw) {return sw.id === featureSwitchId;});

                    if (index !== -1) {
                        Object.assign(featureSwitchesMockData[index], feature);
                        saveSwitchesMockData();
                    }
                    resolve();
                });
            },

            deleteFeatureSwitches: function(req, ids) {

                return new Promise((resolve, reject) => {
                    _.remove(featureSwitchesMockData, function(sw) {return ids.indexOf(sw.id) !== -1;});

                    saveSwitchesMockData();

                    resolve(ids);
                });
            },

            createFeatureSwitchOverride: function(req, featureSwitchId) {

                return new Promise((resolve, reject) => {
                    let bodyJSON = JSON.parse(req.rawBody);
                    let override = bodyJSON;

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
                    resolve(override);
                });
            },

            updateFeatureSwitchOverride: function(req, featureSwitchId, overrideId) {

                return new Promise((resolve, reject) => {
                    let overrideData = JSON.parse(req.rawBody);

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
                });
            },

            deleteFeatureSwitchOverrides: function(req, featureSwitchId, ids) {

                return new Promise((resolve, reject) => {

                    let featureSwitch = _.find(featureSwitchesMockData, function(sw) {return sw.id === featureSwitchId;});

                    _.remove(featureSwitch.overrides, function(override) {return ids.indexOf(override.id) !== -1;});

                    saveSwitchesMockData();

                    resolve(ids);
                });
            },

            getFeatureSwitchStates: function(req, appId, realmId) {
                return new Promise((resolve, reject) => {
                    let states = {};

                    if (!featureSwitchesMockData) {
                        featureSwitchesMockData = loadSwitchesMockData();
                    }
                    featureSwitchesMockData.forEach(function(featureSwitch) {
                        states[featureSwitch.name] = featureSwitch.defaultOn;

                        if (featureSwitch.overrides) {
                            // realm overrides take precedence over default
                            featureSwitch.overrides.forEach(function(override) {
                                if (override.entityType === "realm" && parseInt(override.entityValue) === realmId) {
                                    states[featureSwitch.name] = override.on;
                                }
                            });

                            // app overrides take precedence over default and realm
                            featureSwitch.overrides.forEach(function(override) {
                                if (override.entityType === "app" && override.entityValue === appId) {
                                    states[featureSwitch.name] = override.on;
                                }
                            });
                        }
                    });

                    let switchStates = [];
                    Object.keys(states).forEach(function(key) {
                        switchStates.push({name:key, status: states[key]});
                    });
                    resolve(switchStates);
                });
            }
        };

        return featureSwitchesApi;
    };
}());
