/*
 This module implements the feature switches API using a environment specific JSON file.
 */
(function() {
    'use strict';

    module.exports = function(config) {

        let constants = require('../../../../common/src/constants');

        let cookieUtils = require('../../utility/cookieUtils');
        let featureSwitchesData = require('../../config/environment/featureSwitch/master.featureSwitches.json');

        /**
         * load feature switch configuration file
         */
        function loadEnvSpecificOverride() {
            return new Promise((resolve, reject) => {
                try {
                    let overrideConfigData = require(config.featureSwitchConfigOverride);
                    resolve(overrideConfigData);
                } catch (err) {
                    log.info('Could not read override feature switch configuration file: ' + config.featureSwitchConfigOverride +
                             ' due to: ' + err);
                    reject(err);
                }
            });
        }

        let configBasedFeatureSwitchesApi = {
            getFeatureSwitchStates: function(req, realmId) {
                return new Promise((resolve, reject) => {
                    let states = {};

                    featureSwitchesData.forEach(function(featureSwitch) {
                        states[featureSwitch.name] = featureSwitch.defaultOn;

                        if (config.masterOverrideTurnFeaturesOn) {
                            states[featureSwitch.name] = true;
                        } else if (featureSwitch.RealmsOveride) {
                            // realm overrides take precedence over default
                            featureSwitch.RealmsOveride.forEach(function(override) {
                                if (parseInt(override.realmId) === realmId) {
                                    states[featureSwitch.name] = override.overrideStateOn;
                                }
                            });
                        }
                    });

                    if (config.featureSwitchConfigOverride) {
                        loadEnvSpecificOverride().then(
                            (overrideConfigData) => {
                                overrideConfigData.forEach(function(switchOverride) {
                                    states[switchOverride.name] = switchOverride.defaultOn;


                                    if (config.masterOverrideTurnFeaturesOn) {
                                        states[switchOverride.name] = true;
                                    } else if (switchOverride.RealmsOveride) {
                                        // realm overrides take precedence over default
                                        switchOverride.RealmsOveride.forEach(function(realmOverride) {
                                            if (parseInt(realmOverride.realmId) === realmId) {
                                                states[switchOverride.name] = realmOverride.overrideStateOn;
                                            }
                                        });
                                    }
                                });
                            }
                        );
                    }

                    let switchStates = [];
                    Object.keys(states).forEach(function(key) {
                        switchStates.push({name:key, status: states[key]});
                    });
                    resolve(switchStates);
                });
            }
        };

        return configBasedFeatureSwitchesApi;
    };
}());
