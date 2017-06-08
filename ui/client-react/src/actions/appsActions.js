// action creators
import * as actions from '../constants/actions';
import AppService from '../services/appService';
import RoleService from '../services/roleService';
import UserService from '../services/userService';
import Promise from 'bluebird';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import appsModel from '../models/appsModel';
import Locale from '../../../reuse/client/src/locales/locale';
import * as types from '../actions/types';

//  Custom handling of 'possible unhandled rejection' error,  because we don't want
//  to see an exception in the console output.  The exception is thrown by bluebird
//  because the core application code has no logic implemented to handle a rejected
//  promise.  This is expected as promises are NOT implemented in the application
//  code.  Promises are returned only to support our unit tests, which are expected
//  to implement the appropriate handlers.
Promise.onPossiblyUnhandledRejection(function(err) {
    let logger = new Logger();
    logger.debug('Bluebird Unhandled rejection', err);
});


let appsActions = {

    /**
     * Retrieve a list of applications for this user.
     *
     * @param hydrate
     * @returns Promise
     */
    loadApps(hydrate) {
        let logger = new Logger();
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            this.dispatch(actions.LOAD_APPS);
            let appService = new AppService();

            //  fetch the list of apps that this user can view.  If hydrate == true, then a
            //  fully initialized table object is returned for each table in the app.  If
            //  hydrate !== true, then just a list of table ids is returned.
            appService.getApps(hydrate).then(
                response => {
                    logger.debug('AppService getApps success');
                    // TODO: move model reference into store when migrate to redux
                    let model = appsModel.set(response.data);
                    this.dispatch(actions.LOAD_APPS_SUCCESS, model);
                    resolve();
                },
                error => {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'appService.getApps:');
                    this.dispatch(actions.LOAD_APPS_FAILED, error.response.status);
                    reject();
                }
            ).catch(ex => {
                // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                logger.logException(ex);
                reject();
            });
        });
    },

    selectAppId(appId) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            //  display select app event; note appId can be null
            this.dispatch(actions.SELECT_APP, appId);

            if (appId) {
                let appService = new AppService();
                appService.getAppComponents(appId).then(response => {
                    let users = response.data.users;
                    // TODO: move model reference into store when migrate to redux
                    let model = appsModel.set([response.data.app]);
                    this.dispatch(actions.SELECT_APP_SUCCESS, {users: users, app: model[0]});
                    resolve();
                }, () => {
                    this.dispatch(actions.SELECT_APP_FAILED);
                    reject();
                });
            } else {
                resolve();
            }
        });
    },

    loadAppOwner(userId) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            let userService = new UserService();
            userService.getUser(userId).then(response => {
                this.dispatch(actions.LOAD_APP_OWNER_SUCCESS, response.data);
                resolve();
            }, () => {
                this.dispatch(actions.LOAD_APP_OWNER_FAILED);
                reject();
            });
        });
    },

    selectTableId(tblId) {
        this.dispatch(actions.SELECT_TABLE, tblId);
    },

    updateTableProps(tableId, tableInfo) {
        this.dispatch(actions.UPDATED_TABLE_PROPS, {tableId: tableId, tableInfo: tableInfo});
    },

    selectUsersRows(selectedRows) {
        this.dispatch(actions.SELECT_USERS_DETAILS, selectedRows);
    },

    unassignUsers(appId, roleId, userIds) {
        let logger = new Logger();
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {

            let roleService = new RoleService();

            // Unassign users service call
            roleService.unassignUsersFromRole(appId, roleId, userIds).then(response => {
                logger.debug('RoleService unassignUsers success');
                    // after success
                this.dispatch(actions.UNASSIGN_USERS_SUCCESS, {appId: appId, roleId: roleId, userIds:userIds});
                resolve();
            }, (error) => {
                this.dispatch(actions.UNASSIGN_USERS_FAILED);
                reject();
            });

        });
    },

	/**
     * Gets a list of Realm users based on search query
	 * @param searchTerm
     * @returns [] an array of users
	 */
    searchRealmUsers(searchTerm) {
        return new Promise((resolve, reject) => {
            let roleService = new RoleService();
            roleService.searchRealmUsers(searchTerm).then(response => {
                this.dispatch(actions.SEARCH_ALL_USERS_SUCCESS, response.data);
                resolve();
            }, () => {
                this.dispatch(actions.SEARCH_ALL_USERS_FAILED);
                reject();
            });
        });
    },

	/**
     * this function should be utilized to dispatch actions for updates made to App users
	 * (such as remove user from app) to ensure integrity of backend and frontend data at eveny instance
	 * @param appId
     * @returns []
	 */
    getAppUsers(appId) {
        return new Promise((resolve, reject) => {
            let appService = new AppService();
            appService.getAppUsers(appId).then(response2 => {
                this.dispatch(actions.GET_APP_USERS_SUCCESS, {appUsers: response2.data});
                resolve();
            }, () => {
                this.dispatch(actions.GET_APP_USERS_FAILED);
                reject();
            });
        });
    },

	/**
     * Assigns a user with a role to an app
	 * @param appId
	 * @param userId
	 * @param roleId
     * @returns []
	 */
    assignUserToApp(appId, userId, roleId) {
        return new Promise((resolve, reject) => {
            let roleService = new RoleService();
            roleService.assignUserToApp(appId, userId, roleId).then(response => {
                this.dispatch(actions.ASSIGN_USERS_TO_APP_SUCCESS, {userId, roleId});
                // would prefer to use the abstracted appsActions.getAppUsers function but calling
                // it doesnt dispatch the action GET_APP_USERS_SUCCESS
                let appService = new AppService();
                appService.getAppUsers(appId).then(payload => {
                    const msg = `${Locale.getMessage('app.users.userAdded')} 1 ${Locale.getMessage('app.users.singular')}`;
                    this.dispatch(actions.GET_APP_USERS_SUCCESS, {appUsers: payload.data, userId: userId, msg});
                    resolve();
                }, () => {
                    this.dispatch(actions.GET_APP_USERS_FAILED);
                    reject();
                });
                resolve();
            }, () => {
                this.dispatch(actions.ADD_USER_FAILED);
                reject();
            });
        });
    },

    setUserRoleToAdd(roleId) {
        this.dispatch(actions.SET_USER_ROLE_TO_ADD_TO_APP, roleId);
    },

    openAddUserDialog(status) {
        this.dispatch(actions.TOGGLE_ADD_USER_TO_APP_DIALOG, status);
    },
};

/**
 * Toggle Add to app success dialog
 * @param boolean status
 * @param string email
 * @returns void
 */
export const toggleAddToAppSuccessDialog = (isOpen, email) => ({
    type: types.TOGGLE_ADD_TO_APP_SUCCESS_DIALOG, isOpen, email
});

export default appsActions;
