import * as types from '../actions/types';
import FeatureSwitchService from '../services/featureSwitchService';
import Promise from 'bluebird';
import {NotificationManager} from 'react-notifications';
import * as CompConsts from '../constants/componentConstants';
import Locale from '../locales/locales';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
let logger = new Logger();


const loadSwitchesSuccess = (switches) => ({
    type: types.SET_FEATURE_SWITCHES,
    switches
});


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


export const createFeatureSwitch = (id) => ({
    type: types.CREATE_FEATURE_SWITCH,
    feature: {
        id,
        defaultOn: false,
        description: 'Description',
        name: 'Feature',
        team: 'Team',
        overrides: []}
});

export const deleteFeatureSwitch = id => ({
    type: types.DELETE_FEATURE_SWITCH,
    id
});

export const editFeatureSwitch = (id, column) => ({
    type: types.EDIT_FEATURE_SWITCH,
    id,
    column
});

export const featureSwitchEdited = (id, property, value) => ({
    type: types.FEATURE_SWITCH_EDITED,
    id,
    property,
    value
});


const saveSwitchesSuccess = (switches) => ({
    type: types.SAVED_FEATURE_SWITCHES,
    switches
});

export const saveSwitches = (switches) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let promise = featureSwitchService.saveFeatureSwitches(switches);

            promise.then(response => {
                dispatch(saveSwitchesSuccess(switches));
                NotificationManager.success('Feature switches saved', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.saveFeatureSwitches:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.saveFeatureSwitches:');
                    }
                }
                reject(error);
            });
        });
    };
};


const saveOverridesSuccess = (id, overrides) => ({
    type: types.SAVED_FEATURE_SWITCH_OVERRIDES,
    id,
    overrides
});

export const saveOverrides = (id, overrides) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let promise = featureSwitchService.saveFeatureSwitchOverrides(id, overrides);

            promise.then(response => {
                dispatch(saveOverridesSuccess(id, overrides));
                NotificationManager.success('Feature switch overrides saved', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.saveFeatureSwitchOverrides:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.saveFeatureSwitchOverrides:');
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

export const setSwitchDefaultState = (id, defaultOn) => ({
    type: types.SET_FEATURE_SWITCH_DEFAULT_STATE,
    id,
    defaultOn
});

// overrides for selected feature switch

export const selectFeatureSwitchOverrides = (id) => ({
    type: types.SELECT_FEATURE_SWITCH_OVERRIDES,
    id
});

export const setOverrideState = (row, on) => ({
    type: types.SET_OVERRIDE_STATE,
    row,
    on
});

export const deleteOverrides = ids => ({
    type: types.DELETE_OVERRIDES,
    ids
});

export const editOverrideRow = (row, column) => ({
    type: types.EDIT_OVERRIDE,
    row,
    column
});


export const confirmOverrideEdit = (row, property, value) => ({
    type: types.OVERRIDE_EDITED,
    row,
    property,
    value
});


export const createOverride = () => ({
    type: types.CREATE_OVERRIDE,
    override: {
        entityType: 'realm',
        entityValue: '',
        on: false
    }
});
