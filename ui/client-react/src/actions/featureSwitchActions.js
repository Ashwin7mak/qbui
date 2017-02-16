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


export const createRow = (id) => ({
    type: types.CREATE_ROW,
    feature: { id, defaultOn: false, description: 'Description', exceptions: [], name: 'Feature', team: 'Team' }
});

export const deleteRow = id => ({
    type: types.DELETE_ROW,
    id
});

export const editRow = (id, column) => ({
    type: types.EDIT_ROW,
    id,
    column
});

export const confirmEdit = (id, property, value) => ({
    type: types.CONFIRM_EDIT,
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
                NotificationManager.success('Feature Switches Saved', Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
                resolve();
            }).catch(error => {

                if (error.response) {
                    if (error.response.status === 403) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'featureSwitchService.saveSwitches:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'featureSwitchService.saveSwitches:');
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
    type: types.SET_SWITCH_DEFAULT_STATE,
    id,
    defaultOn
});

// exceptions for selected feature switch

export const editExceptions = (id) => ({
    type: types.EDIT_EXCEPTIONS,
    id
});

export const setExceptionState = (row, on) => ({
    type: types.SET_EXCEPTION_STATE,
    row,
    on
});

export const editExceptionRow = (row, column) => ({
    type: types.EDIT_EXCEPTION_ROW,
    row,
    column
});


export const confirmExceptionEdit = (row, property, value) => ({
    type: types.CONFIRM_EXCEPTION_EDIT,
    row,
    property,
    value
})
