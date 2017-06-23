/*
 This module implements the feature switches API using a environment specific JSON file.
 */
(function() {

    module.exports = function(config) {

        let constants = require('../../../../common/src/constants');

        let configBasedFeatureSwitchesApi = {
            getFeatureSwitchStates: function(req, realmId) {
                return new Promise((resolve, reject) => {
                    /** Reading master configuration file and loading the feature switch states.
                     * If override for the realm is specified- the state specified in the override takes precedence
                     * If master override is set to true in the config file, then all feature switches are enabled.
                     */

                    this.loadConfigFile('../../config/environment/featureSwitch/master.featureSwitches.json').then(
                        (featureSwitchesData) => {
                            let states = {};
                            featureSwitchesData.forEach(function(featureSwitch) {
                                states[featureSwitch.name] = featureSwitch.defaultOn;

                                if (config.masterOverrideTurnFeaturesOn) {
                                    states[featureSwitch.name] = true;
                                } else if (featureSwitch.RealmsOveride) {
                                    // realm overrides take precedence over default
                                    featureSwitch.RealmsOveride.forEach(function(override) {
                                        if (parseInt(override.realmId) === parseInt(realmId)) {
                                            states[featureSwitch.name] = override.overrideStateOn;
                                        }
                                    });
                                }
                            });
                            /** Reading env specific configuration file and loading the feature switch states.
                             * If override for the realm is specified- the state specified in the override takes precedence
                             * If master override is set to true in the config file, then all feature switches are enabled.
                             */
                            if (config.featureSwitchConfigOverride) {
                                this.loadConfigFile(config.featureSwitchConfigOverride).then(
                                    (overrideConfigData) => {
                                        overrideConfigData.forEach(function(switchOverride) {
                                            states[switchOverride.name] = switchOverride.defaultOn;

                                            if (config.masterOverrideTurnFeaturesOn) {
                                                states[switchOverride.name] = true;
                                            } else if (switchOverride.RealmsOveride) {
                                                // realm overrides take precedence over default
                                                switchOverride.RealmsOveride.forEach(function(realmOverride) {
                                                    if (parseInt(realmOverride.realmId) === parseInt(realmId)) {
                                                        states[switchOverride.name] = realmOverride.overrideStateOn;
                                                    }
                                                });
                                            }
                                        });
                                        resolve(this.transformFSStateForClient(states));
                                    },
                                    () => {
                                        resolve(this.transformFSStateForClient(states));
                                    }
                                );
                            } else {
                                resolve(this.transformFSStateForClient(states));
                            }
                        }, (error)=>    {
                        log.info('Could not read master feature switch configuration file: ' + JsonfilePath +
                                ' due to: ' + error);
                        resolve(error);
                    });
                });
            },

            /**
             * load feature switch configuration override file
             */
            loadConfigFile: function(JsonfilePath) {
                return new Promise((resolve, reject) => {
                    try {
                        let overrideConfigData = require(JsonfilePath);
                        if (overrideConfigData && Array.isArray(overrideConfigData)) {
                            resolve(overrideConfigData);
                        } else {
                            resolve([]);
                        }

                    } catch (err) {
                        log.info('Could not read feature switch configuration file: ' + JsonfilePath +
                        ' due to: ' + err);
                        resolve(err);
                    }
                });
            },

            transformFSStateForClient: function(states) {
                let switchStates = [];
                Object.keys(states).forEach(function(key) {
                    switchStates.push({name:key, status: states[key]});
                });
                return switchStates;
            }
        };



        return configBasedFeatureSwitchesApi;
    };
}());
