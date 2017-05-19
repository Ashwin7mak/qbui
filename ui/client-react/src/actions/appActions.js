import AppService from '../services/appService';
import Promise from 'bluebird';
import * as types from '../actions/types';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

let logger = new Logger();

/**
 * Construct apps store redux store payload
 *
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(type, content) {
    return {
        type: type,
        content: content || null
    };
}

export const loadApps = () => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            logger.debug('AppActions loadApps');
            dispatch(event(types.LOAD_APPS));

            let appService = new AppService();
            appService.getApps().then(
                response => {
                    dispatch(event(types.LOAD_APPS_SUCCESS, response.data));
                    resolve();
                },
                error => {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'appActions.loadApps:');
                    dispatch(event(types.LOAD_APPS_ERROR, error));
                    reject();
                }
            );
        });
    };
};

export const loadApp = (appId) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            logger.debug('AppActions loadApp');
            dispatch(event(types.LOAD_APP, appId));

            let appService = new AppService();
            appService.getAppComponents(appId).then(
                response => {
                    dispatch(event(types.LOAD_APP_SUCCESS, response.data));
                    resolve();
                },
                error => {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'appActions.loadApp:');
                    dispatch(event(types.LOAD_APP_ERROR, error));
                    reject();
                }
            ).catch(ex => {
                // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                logger.logException(ex);
                reject();
            });
        });
    };
};

export const clearSelectedApp = () => {
    return (dispatch) => {
        dispatch(event(types.CLEAR_APP));
    };
};

export const selectAppTable = (appId, tableId) => {
    return (dispatch) => {
        dispatch(event(types.SELECT_APP_TABLE, {appId, tableId}));
    };
};

export const clearSelectedAppTable = () => {
    return (dispatch) => {
        dispatch(event(types.CLEAR_APP_TABLE));
    };
};

