// feature switch action creators

import FeatureSwitchService from '../services/featureSwitchService';
import Promise from 'bluebird';
import * as types from '../actions/types';
import * as FeatureSwitchConsts from '../constants/featureSwitchConstants';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import Locale from '../locales/locales';
import _ from 'lodash';

const logger = new Logger();

/**
 * get feature switch to send to server (omit props like 'editing')
 * @param featureSwitch
 * @returns a copy of featureSwitch containing only the props we want to persist
 */
const getFeatureSwitchPersistProps = (featureSwitch) => {
    return _.pick(featureSwitch, [
        FeatureSwitchConsts.FEATURE_ID_KEY,
        FeatureSwitchConsts.FEATURE_NAME_KEY,
        FeatureSwitchConsts.FEATURE_TEAM_KEY,
        FeatureSwitchConsts.FEATURE_DESCRIPTION_KEY,
        FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY]);
};

/**
 * get override to send to server (omit props like 'editing')
 * @param override
 * @returns {*}
 */
const getOverridePersistProps = (override) => {
    return _.pick(override, [
        FeatureSwitchConsts.OVERRIDE_ID_KEY,
        FeatureSwitchConsts.OVERRIDE_TYPE_KEY,
        FeatureSwitchConsts.OVERRIDE_VALUE_KEY,
        FeatureSwitchConsts.OVERRIDE_ON_KEY]);
};

// add loaded switches to store
const loadSwitchesSuccess = (switches) => ({
    type: types.SET_FEATURE_SWITCHES,
    switches
});

/**
 * get all feature switches and overrides for admin UI
 *
 * @returns {function(*=)}
 */
export const getSwitches = () => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            const featureSwitchService = new FeatureSwitchService();

            const promise = featureSwitchService.getFeatureSwitches();

            promise.then(response => {
                // we have the switches, update the redux store

                dispatch(loadSwitchesSuccess(response.data));

                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.getFeatureSwitches:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.getFeatureSwitches:');
                    }
                }
                reject(error);
            });
        });
    };
};

// add new feature switch to store
export const createdFeatureSwitch = (feature) => ({
    type: types.CREATED_FEATURE_SWITCH,
    feature: feature
});

/**
 * create a new feature switch
 * @param name
 * @returns {function(*=)}
 */
export const createFeatureSwitch = (name) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            const featureSwitchService = new FeatureSwitchService();

            const feature = {};

            // set feature default values
            feature[FeatureSwitchConsts.FEATURE_NAME_KEY] = name;
            feature[FeatureSwitchConsts.FEATURE_DESCRIPTION_KEY] = Locale.getMessage("featureSwitchAdmin.description");
            feature[FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY] = false;
            feature[FeatureSwitchConsts.FEATURE_TEAM_KEY] = Locale.getMessage("featureSwitchAdmin.teamName");

            const promise = featureSwitchService.createFeatureSwitch(feature);

            promise.then(response => {
                // save the generated ID and set an empty override list
                feature.id = response.data;
                feature.overrides = [];
                dispatch(createdFeatureSwitch(feature));
                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.createFeatureSwitch:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.createFeatureSwitch:');
                    }
                }
                reject(error);
            });
        });
    };
};

// remove deleted features from store
export const featureSwitchesDeleted = ids => ({
    type: types.FEATURE_SWITCHES_DELETED,
    ids
});

/**
 * delete feature switches
 * @param ids array of feature switch IDs
 * @returns {function(*=)}
 */
export const deleteFeatureSwitches = ids => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            const featureSwitchService = new FeatureSwitchService();

            const promise = featureSwitchService.deleteFeatureSwitches(ids);

            promise.then(() => {
                dispatch(featureSwitchesDeleted(ids));

                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.deleteFeatureSwitches:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.deleteFeatureSwitches:');
                    }
                }
                reject(error);
            });
        });
    };
};


// start editing a feature switch from react-edit plugin
export const editFeatureSwitch = (id, column) => ({
    type: types.EDIT_FEATURE_SWITCH,
    id,
    column
});

// update existing feature switch in store
export const featureSwitchUpdated = (id, property, value) => ({
    type: types.FEATURE_SWITCH_UPDATED,
    id,
    property,
    value
});

/**
 * update existing feature switch
 * @param id feature switch ID
 * @param featureSwitch feature switch object
 * @param property changed property name
 * @param value changed property value
 * @returns {function(*=)}
 */
export const updateFeatureSwitch = (id, featureSwitch, property, value) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            const featureSwitchService = new FeatureSwitchService();

            const edited = getFeatureSwitchPersistProps(featureSwitch);

            // update the edited property
            edited[property] = value;

            const promise = featureSwitchService.updateFeatureSwitch(edited);

            promise.then(response => {
                dispatch(featureSwitchUpdated(id, property, value));

                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.editFeatureSwitch:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.editFeatureSwitch:');
                    }
                }
                reject(error);
            });
        });
    };
};


// select the overrides for a given feature switch
export const selectFeatureSwitchOverrides = (id) => ({
    type: types.SELECT_FEATURE_SWITCH_OVERRIDES,
    id
});

// add new override to store
export const createdOverride = (override) => ({
    type: types.CREATED_OVERRIDE,
    override
});

/**
 * create a new override for a feature switch
 * @param switchId
 * @returns {function(*=)}
 */
export const createOverride = (switchId) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            const featureSwitchService = new FeatureSwitchService();

            const override = {
                entityType: 'realm',
                entityValue: '',
                on: false
            };
            // set override default values
            override[FeatureSwitchConsts.OVERRIDE_TYPE_KEY] = "realm";
            override[FeatureSwitchConsts.OVERRIDE_VALUE_KEY] = "";
            override[FeatureSwitchConsts.OVERRIDE_ON_KEY] = false;

            const promise = featureSwitchService.createOverride(switchId, override);

            promise.then(response => {
                override.id = response.data; // save the generated ID

                dispatch(createdOverride(override));

                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.createdOverride:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.createdOverride:');
                    }
                }
                reject(error);
            });
        });
    };
};

// start editing an override from react-edit plugin
export const editOverride = (id, column) => ({
    type: types.EDIT_OVERRIDE,
    id,
    column
});

// update existing override in store
export const overrideUpdated = (id, property, value) => ({
    type: types.OVERRIDE_UPDATED,
    id,
    property,
    value
});

/**
 * update existing override
 * @param featureSwitchId
 * @param id
 * @param override override object being edited
 * @param property property being changed (entityType, entityValue, etc.)
 * @param value new value for property
 * @returns {function(*=)}
 */
export const updateOverride = (featureSwitchId, id, override, property, value) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            const featureSwitchService = new FeatureSwitchService();

            const edited = getOverridePersistProps(override);

            // update edited property
            edited[property] = value;

            const promise = featureSwitchService.updateOverride(featureSwitchId, id, edited);

            promise.then(response => {
                dispatch(overrideUpdated(id, property, value));

                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.updateOverride:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.updateOverride:');
                    }
                }
                reject(error);
            });
        });
    };
};

// remove overrides from store
export const overridesDeleted = ids => ({
    type: types.OVERRIDES_DELETED,
    ids
});

/**
 * delete overrides for a feature switch
 * @param switchId
 * @param ids array of override IDs
 * @returns {function(*=)}
 */
export const deleteOverrides = (switchId, ids) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            const featureSwitchService = new FeatureSwitchService();

            const promise = featureSwitchService.deleteOverrides(switchId, ids);

            promise.then(response => {
                dispatch(overridesDeleted(ids));

                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.deleteOverrides:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.deleteOverrides:');
                    }
                }
                reject(error);
            });
        });
    };
};

// set feature states in store
const loadStatesSuccess = (states) => ({
    type: types.SET_FEATURE_SWITCH_STATES,
    states
});

/**
 * get feature states
 * @returns {function(*=)}
 */
export const getStates = (appId = null) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            const featureSwitchService = new FeatureSwitchService();

            const promise = featureSwitchService.getFeatureSwitchStates(appId);

            promise.then(response => {
                dispatch(loadStatesSuccess(response.data));

                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.getFeatureSwitchStates:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.getFeatureSwitchStates:');
                    }
                }
                reject(error);
            });
        });
    };
};
