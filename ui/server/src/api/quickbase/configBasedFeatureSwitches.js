/*
 This module implements the feature switches API using a environment specific JSON file.
 */
(function() {
    'use strict';

    let fs = require('fs');

    module.exports = function(config) {

        let constants = require('../../../../common/src/constants');

        let cookieUtils = require('../../utility/cookieUtils');
        let featureSwitchesData;

        /**
         * load feature switch configuration file
         */
        function loadSwitches() {
            return new Promise((resolve, reject) => {
                try {
                    let data = fs.readFileSync(config.featureSwitchesData, 'utf8');
                    let fsData = JSON.parse(data);
                    resolve(fsData);
                } catch (err) {
                    log.debug('Could not read feature switch configuration file for' + err);
                    reject(err);
                }
            });
        }

        let featureSwitchesApi = {
            getFeatureSwitchStates: function(req, realmId) {
                return new Promise((resolve, reject) => {
                    let states = {};

                    if (!featureSwitchesData) {
                        featureSwitchesData = loadSwitchesMockData();
                    }
                    featureSwitchesData.forEach(function(featureSwitch) {
                        states[featureSwitch.name] = featureSwitch.defaultOn;

                        if (featureSwitch.RealmsOveride) {
                            // realm overrides take precedence over default
                            featureSwitch.RealmsOveride.forEach(function(override) {
                                if (parseInt(override.realmId) === realmId) {
                                    states[featureSwitch.name] = override.overrideStateOn;
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
