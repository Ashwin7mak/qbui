import * as types from '../actions/types';
import FeatureSwitchService from '../services/featureSwitchService';
import Promise from 'bluebird';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
let logger = new Logger();

const loadSwitchesSuccess = (switches) => {
    return {
        type: types.SET_FEATURE_SWITCHES,
        switches
    };
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


const saveSwitchesSuccess = (switches) => {
    return {
        type: types.SAVED_FEATURE_SWITCHES,
        switches
    };
};

export const saveSwitches = (switches) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            let featureSwitchService = new FeatureSwitchService();

            let promise = featureSwitchService.saveFeatureSwitches(switches);

            promise.then(response => {
                dispatch(saveSwitchesSuccess(switches));

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

const loadStatesSuccess = (states) => {
    return {
        type: types.SET_FEATURE_SWITCH_STATES,
        states
    };
};
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

