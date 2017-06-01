import AppService from '../services/appService';
import RoleService from '../services/roleService';
import Promise from 'bluebird';
import * as types from '../actions/types';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

import Locale from '../../../reuse/client/src/locales/locale';

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

export const loadApp = (appId) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let logger = new Logger();
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
            );
        });
    };
};

export const assignUserToApp = (appId, userId, roleId) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let roleService = new RoleService();
            roleService.assignUserToApp(appId, userId, roleId).then(
                () => {
                    let appService = new AppService();
                    appService.getAppUsers(appId).then(
                        response => {
                            dispatch(event(types.ASSIGN_USER_TO_APP_SUCCESS, {appId:appId, appUsers:response.data}));
                            resolve();
                        },
                        error => {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'appActions.assignUserToApp_getAppUsers:');
                            // promise reject is handled by component to render appropriate messaging..
                            reject();
                        }
                    );
                },
                err => {
                    logger.parseAndLogError(LogLevel.ERROR, err.response, 'appActions.assignUserToApp:');
                    // promise reject is handled by component to render appropriate messaging..
                    reject();
                }
            );
        });
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

