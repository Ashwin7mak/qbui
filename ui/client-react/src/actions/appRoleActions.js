import * as types from '../actions/types';
import AppService from '../services/appService';
import RoleService from '../services/roleService';
import Promise from 'bluebird';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

/**
 * Construct appRole store payload
 *
 * @param appId - appId for fields
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(appId, type, content) {
    return {
        appId,
        type,
        content: content || null
    };
}

export const loadAppRoles = (appId) => {
    return (dispatch) => {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            let logger = new Logger();
            if (appId) {
                dispatch(event(appId, types.LOAD_APP_ROLES));
                let roleService = new RoleService();
                // fetch the app roles list if we don't have it already
                roleService.getAppRoles(appId).then(
                    (response) => {
                        dispatch(event(appId, types.LOAD_APP_ROLES_SUCCESS, {roles: response.data}));
                        resolve();
                    },
                    (errorResponse) => {
                        let error = errorResponse.response;
                        logger.parseAndLogError(LogLevel.ERROR, error, 'roleService.loadAppRoles:');
                        dispatch(event(appId, types.LOAD_APP_ROLES_FAILED, {error: error}));
                        reject();
                    }
                );
            } else {
                logger.error('roleService.loadAppRoles: Missing required input parameters.');
                let error = {
                    statusText:'Missing required input parameters to load app roles',
                    status:500
                };
                dispatch(event(appId, types.LOAD_APP_ROLES_FAILED, {error: error}));
                reject();
            }
        });
    };
};

export const assignUsersToAppRole = (appId, roleId, userIds) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let logger = new Logger();
            let roleService = new RoleService();
            roleService.assignUsersToAppRole(appId, roleId, userIds).then(
                () => {
                    let appService = new AppService();
                    appService.getAppUsers(appId).then(
                        (response) => {
                            dispatch(event(appId, types.ASSIGN_USERS_TO_APP_ROLE, {appUsers:response.data}));
                            resolve();
                        },
                        (error) => {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'appActions.assignUsersToAppRole_getAppUsers:');
                            // promise reject is handled by component to render appropriate messaging..
                            reject();
                        }
                    );
                },
                err => {
                    logger.parseAndLogError(LogLevel.ERROR, err.response, 'appActions.assignUsersToAppRole:');
                    // promise reject is handled by component to render appropriate messaging..
                    reject();
                }
            );
        });
    };
};

export const assignUserToAppRole = (appId, roleId, userId) => {
    return assignUsersToAppRole(appId, roleId, [userId]);
};

export const removeUsersFromAppRole = (appId, roleId, userDetails) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let logger = new Logger();
            let roleService = new RoleService();
            let usersByRole = {};
            // get userDetails from [{id: '1', roleId: '2'}] into {<roleId>:[<userIds>]}
            // so we make calls per role rather that per userId which is way lesser
            userDetails.map((userDetail)=>{
                if (usersByRole[userDetail.roleId]) {
                    usersByRole[userDetail.roleId].push(userDetail.id);
                } else {
                    usersByRole[userDetail.roleId] = [userDetail.id];
                }
            });
            _.forEach(usersByRole, (userIds, usersRoleId)=> {
                roleService.removeUsersFromAppRole(appId, usersRoleId, userIds).then(() => {
                    logger.debug('RoleService removeUsersFromAppRole success');
                    dispatch(event(appId, types.REMOVE_USERS_FROM_APP_ROLE, {
                        roleId: usersRoleId,
                        userIds: userIds
                    }));
                    resolve(userDetails);
                }, (error) => {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'appActions.removeUsersFromAppRole:');
                    reject();
                }
				);
            });
        });
    };
};
