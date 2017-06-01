import * as types from '../actions/types';
import UserService from '../services/userService';
import Promise from 'bluebird';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

/**
 * Construct app store payload
 *
 * @param appId - appId
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(type, appId, content) {
    return {
        type,
        appId: appId || null,
        content: content || null
    };
}

export const loadAppOwner = (appId, userId) => {
    //  promise is returned in support of unit testing only
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let logger = new Logger();
            logger.debug('UserActions loadAppOwner');
            if (userId) {
                let userService = new UserService();
                userService.getUser(userId).then(
                    response => {
                        dispatch(event(types.LOAD_APP_OWNER_SUCCESS, appId, response.data));
                        resolve();
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'userActions.loadAppOwner:');
                        dispatch(event(types.LOAD_APP_OWNER_ERROR, appId, error));
                        reject();
                    }
                );
            } else {
                logger.error('userService.loadAppOwner: Missing required input parameters.');
                let error = {
                    statusText:'Missing required input parameters to load app owner',
                    status:500
                };
                dispatch(event(types.LOAD_APP_OWNER_ERROR, appId, error));
                reject();
            }
        });
    };
};

/**
 * Gets a list of Realm users based on search query
 * @param searchTerm
 * @returns [] an array of users
 */
export const searchUsers = (searchTerm) => {
    //  promise is returned in support of unit testing only
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let logger = new Logger();
            let userService = new UserService();
            userService.searchUsers(searchTerm).then(
                response => {
                    dispatch(event(types.SEARCH_USERS_SUCCESS, null, response.data));
                    resolve();
                },
                (error) => {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'userActions.searchUsers:');
                    dispatch(event(types.SEARCH_USERS_FAIL));
                    reject();
                }
            );
        });
    };
};

export const setUserRoleToAdd = (roleId) => {
    return {
        type: types.SET_USER_ROLE_TO_ADD,
        roleId: roleId
    };
};

export const openAddUserDialog = (status) => {
    return {
        type: types.TOGGLE_ADD_USER_DIALOG,
        status: status
    };
};

export const selectUserRows = (selected) => {
    return {
        type: types.SELECT_USER_ROWS,
        selectedUsers: selected
    };
};

