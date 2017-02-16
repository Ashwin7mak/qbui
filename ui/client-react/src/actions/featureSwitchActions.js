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
    feature: { id, defaultOn: false, description: 'Description', exceptions: [], name: 'Feature', team: 'Team' }
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


export const saveExceptions = (id, exceptions) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let promise = featureSwitchService.saveFeatureSwitchExceptions(id, exceptions);

            promise.then(response => {
                dispatch(saveExceptionsSuccess(switches));
                NotificationManager.success('Feature switch exceptions Saved', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.saveFeatureSwitchExceptions:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.saveFeatureSwitchExceptions:');
                    }
                }
                reject(error);
            });
        });
    };
};
const saveExceptionsSuccess = (exceptions) => ({
    type: types.SAVED_FEATURE_SWITCH_EXCEPTIONS,
    exceptions
});

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

// exceptions for selected feature switch

export const selectFeatureSwitchExceptions = (id) => ({
    type: types.SELECT_FEATURE_SWITCH_EXCEPTIONS,
    id
});

export const setExceptionState = (row, on) => ({
    type: types.SET_EXCEPTION_STATE,
    row,
    on
});

export const deleteException = id => ({
    type: types.DELETE_EXCEPTION,
    id
});

export const editExceptionRow = (row, column) => ({
    type: types.EDIT_EXCEPTION,
    row,
    column
});


export const confirmExceptionEdit = (row, property, value) => ({
    type: types.EXCEPTION_EDITED,
    row,
    property,
    value
});


export const createException = () => ({
    type: types.CREATE_EXCEPTION,
    exception: { entityType: 'realm', entityValue: '',  on: false }
});
