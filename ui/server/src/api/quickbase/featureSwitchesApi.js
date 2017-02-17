/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let fs = require('fs');
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

        let featureSwitchesMockData;

        function loadSwitchesMockData() {

            let data = fs.readFileSync(config.featureSwitchesMockData, 'utf8');
            return JSON.parse(data);
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
                        resolve([]); // todo
                    }
                });
            },

            saveFeatureSwitches: function(req) {
                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {

                        let bodyJSON = JSON.parse(req.rawBody);
                        featureSwitchesMockData = bodyJSON.switches;
                        resolve();

                    } else {
                        resolve(); // todo
                    }
                });
            },

            saveFeatureSwitchExceptions: function(req, featureSwitchId) {

                return new Promise((resolve, reject) => {
                    if (config && config.featureSwitchesMockData) {

                        let bodyJSON = JSON.parse(req.rawBody);
                        let exceptions = bodyJSON.exceptions;

                        let featureSwitch = _.find(featureSwitchesMockData, function(sw) {return sw.id === featureSwitchId;});

                        if (featureSwitch) {
                            featureSwitch.exceptions = exceptions;
                        }
                        resolve();

                    } else {
                        resolve(); // todo
                    }
                });
            },

            getFeatureSwitchStates: function(req, realmId, appId) {
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
                        // todo
                    }

                    resolve(states);
                });
            }
        };

        return featureSwitchesApi;
    };
}());
