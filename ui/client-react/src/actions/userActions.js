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

/**
 * Construct user store payload
 *
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{type: *, content: *}}
 */
function userEvent(type, content) {
    return {
        type,
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
                    dispatch(userEvent(types.SEARCH_USERS_SUCCESS, {searchedUsers: response.data}));
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
    return userEvent(types.SET_USER_ROLE_TO_ADD, {roleId: roleId});
};

/**
 * Manage the open/close state of the add user popup dialog
 *
 * @param status -- true to open; false to close
 * @returns {{type, status: *}}
 */
export const openAddUserDialog = (status) => {
    return userEvent(types.TOGGLE_ADD_USER_DIALOG, {status: status});
};

/**
 * Select 1..n user rows in user management grid
 *
 * @param selected - list of selected ids
 * @returns {{type, selectedUsers: *}}
 */
export const selectUserRows = (selected) => {
    return userEvent(types.SELECT_USER_ROWS, {selectedUsers: selected});
};

/**
 * Clear all selected user rows in user management grid
 *
 * @returns {{type, selectedUsers: *}}
 */
export const clearSelectedUserRows = () => {
    return userEvent(types.SELECT_USER_ROWS, {selectedUsers: []});
};

