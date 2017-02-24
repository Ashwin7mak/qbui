import * as types from '../actions/types';
import FeatureSwitchService from '../services/featureSwitchService';
import Promise from 'bluebird';
import {NotificationManager} from 'react-notifications';
import * as CompConsts from '../constants/componentConstants';
import * as FeatureSwitchConsts from '../constants/featureSwitchConstants';
import Locale from '../locales/locales';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import _ from 'lodash';

let logger = new Logger();

const loadSwitchesSuccess = (switches) => ({
    type: types.SET_FEATURE_SWITCHES,
    switches
});

const getFeatureSwitchPersistProps = (featureSwitch) => {
    return _.pick(featureSwitch, [
        FeatureSwitchConsts.FEATURE_ID_KEY,
        FeatureSwitchConsts.FEATURE_NAME_KEY,
        FeatureSwitchConsts.FEATURE_TEAM_KEY,
        FeatureSwitchConsts.FEATURE_DESCRIPTION_KEY,
        FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY_KEY]);
};

const getOverridePersistProps = (featureSwitch) => {
    return _.pick(featureSwitch, [
        FeatureSwitchConsts.FEATURE_OVERRIDE_ID_KEY,
        FeatureSwitchConsts.FEATURE_OVERRIDE_TYPE_KEY,
        FeatureSwitchConsts.FEATURE_OVERRIDE_VALUE_KEY_KEY,
        FeatureSwitchConsts.FEATURE_OVERRIDE_ON_KEY]);
};

export const getSwitches = () => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let promise = featureSwitchService.getFeatureSwitches();

            promise.then(response => {
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

export const createdFeatureSwitch = (feature) => ({
    type: types.CREATED_FEATURE_SWITCH,
    feature: feature
});

export const createFeatureSwitch = (name) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let feature = {};
            feature[FeatureSwitchConsts.FEATURE_NAME_KEY] = name;
            feature[FeatureSwitchConsts.FEATURE_DESCRIPTION_KEY] = 'Description';
            feature[FeatureSwitchConsts.FEATURE_DEFAULT_ON_KEY] = false;
            feature[FeatureSwitchConsts.FEATURE_TEAM_KEY] = 'Team';

            let promise = featureSwitchService.createFeatureSwitch(feature);

            promise.then(response => {
                feature.id = response.data; // save the generated ID
                feature.overrides = [];
                dispatch(createdFeatureSwitch(feature));
                NotificationManager.success('Feature switch created', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
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

export const featureSwitchesDeleted = ids => ({
    type: types.FEATURE_SWITCHES_DELETED,
    ids
});

export const deleteFeatureSwitches = ids => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let promise = featureSwitchService.deleteFeatureSwitches(ids);

            promise.then(response => {
                dispatch(featureSwitchesDeleted(ids));
                NotificationManager.success('Feature switch(es) deleted', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
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


export const editFeatureSwitch = (id, column) => ({
    type: types.EDIT_FEATURE_SWITCH,
    id,
    column
});

export const featureSwitchUpdated = (id, property, value) => ({
    type: types.FEATURE_SWITCH_UPDATED,
    id,
    property,
    value
});

export const updateFeatureSwitch = (id, featureSwitch, property, value) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let edited = getFeatureSwitchPersistProps(featureSwitch);

            // update edited property
            edited[property] = value;

            let promise = featureSwitchService.updateFeatureSwitch(edited);

            promise.then(response => {
                dispatch(featureSwitchUpdated(id, property, value));
                NotificationManager.success('Feature switch updated', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
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


// overrides for selected feature switch

export const selectFeatureSwitchOverrides = (id) => ({
    type: types.SELECT_FEATURE_SWITCH_OVERRIDES,
    id
});

export const createdOverride = (override) => ({
    type: types.CREATED_OVERRIDE,
    override
});

export const createOverride = (switchId) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let override = {
                entityType: 'realm',
                entityValue: '',
                on: false
            };

            let promise = featureSwitchService.createOverride(switchId, override);

            promise.then(response => {
                override.id = response.data; // save the generated ID

                dispatch(createdOverride(override));
                NotificationManager.success('Feature switch override created', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
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

export const editOverride = (id, column) => ({
    type: types.EDIT_OVERRIDE,
    id,
    column
});


export const overrideUpdated = (id, property, value) => ({
    type: types.OVERRIDE_UPDATED,
    id,
    property,
    value
});

export const updateOverride = (featureSwitchId, id, override, property, value) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let edited = getOverridePersistProps(override);

            // update edited property
            edited[property] = value;

            let promise = featureSwitchService.updateOverride(featureSwitchId, id, edited);

            promise.then(response => {
                dispatch(overrideUpdated(id, property, value));
                NotificationManager.success('Override updated', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
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

export const overridesDeleted = ids => ({
    type: types.OVERRIDES_DELETED,
    ids
});

export const deleteOverrides = (switchId, ids) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let promise = featureSwitchService.deleteOverrides(switchId, ids);

            promise.then(response => {
                dispatch(overridesDeleted(ids));
                NotificationManager.success('Feature switch override(s) deleted', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
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

const loadStatesSuccess = (states) => ({
    type: types.SET_FEATURE_SWITCH_STATES,
    states
});

export const getStates = () => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let promise = featureSwitchService.getFeatureSwitchStates();

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
