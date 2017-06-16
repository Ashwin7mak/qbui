import AppService from '../services/appService';
import Promise from 'bluebird';
import * as types from '../actions/types';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

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
            let logger = new Logger();
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

/**
 * Calls the API to load the app. In most cases, you want to use the `loadApp` action above.
 * This action is used to load apps in other actions, when having the app data is a pre-requisite for later actions.
 * @param dispatch
 * @param appId
 * @returns {bluebird}
 */
export const loadAppData = (dispatch, appId) => {
    return new Promise((resolve, reject) => {
        let logger = new Logger();
        logger.debug('AppActions loadApp');
        dispatch(event(types.LOAD_APP, {appId}));

        let appService = new AppService();
        appService.getAppComponents(appId).then(
            response => {
                dispatch(event(types.LOAD_APP_SUCCESS, response.data));
                resolve(response.data);
            },
            error => {
                logger.parseAndLogError(LogLevel.ERROR, error.response, 'appActions.loadApp:');
                dispatch(event(types.LOAD_APP_ERROR, error));
                reject();
            }
        );
    });
};

export const loadApp = (appId) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return loadAppData(dispatch, appId);
    };
};

export const clearSelectedApp = () => {
    return event(types.CLEAR_SELECTED_APP);
};

export const selectAppTable = (appId, tblId) => {
    return event(types.SELECT_APP_TABLE, {appId, tblId});
};

export const clearSelectedAppTable = () => {
    return event(types.CLEAR_SELECTED_APP_TABLE);
};

export const toggleAddToAppSuccessDialog = (isOpen, email) => {
    return event(types.TOGGLE_ADD_TO_APP_SUCCESS_DIALOG, {isOpen, email});
};

export const updateAppTableProperties = (appId, tblId, tableInfo) => {
    return event(types.UPDATE_APP_TABLE_PROPS, {appId, tblId, tableInfo});
};

export const toggleChangeUserRoleDialog = (isOpen) => {
    return event(types.TOGGLE_CHANGE_USER_ROLE, {isOpen});
};
