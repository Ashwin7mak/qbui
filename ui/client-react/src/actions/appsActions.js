// action creators
import * as actions from '../constants/actions';
import AppService from '../services/appService';
import RoleService from '../services/roleService';
import UserService from '../services/userService';
import Promise from 'bluebird';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import appsModel from '../models/appsModel';

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
     * Retrieve an app that is fully hydrated (with table properties).
     *
     * @returns Promise
     */
    loadHydratedApp(appId) {
        let logger = new Logger();
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            this.dispatch(actions.LOAD_APP);
            let appService = new AppService();

            appService.getHydratedApp(appId).then(
                response => {
                    logger.debug('AppService getHydratedApp success');
                    let model = appsModel.set([response.data]);
                    this.dispatch(actions.LOAD_APP_SUCCESS, model[0]);
                    resolve();
                },
                error => {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'appService.getHydratedApp:');
                    this.dispatch(actions.LOAD_APP_FAILED, error.response.status);
                    reject();
                }
            ).catch(ex => {
                // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                logger.logException(ex);
                reject();
            });
        });
    },

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
            // fetch the app users list if we don't have it already
            //if (appId && appId !== this.selectedAppId) {
            if (appId) {
                this.dispatch(actions.LOAD_APPS);
                let appService = new AppService();

                let promises = [appService.getAppUsers(appId), appService.getHydratedApp(appId)];
                //if (hydrateApp) {
                //promises.push(appService.getHydratedApp(appId));
                //}
                Promise.all(promises).then(response => {
                    this.selectedAppId = appId;
                    let model = appsModel.set([response[1].data]);
                    this.dispatch(actions.LOAD_APP_USERS_SUCCESS, {users: response[0].data, hydratedApp: model[0]});
                    resolve();
                //}
                //appService.getAppUsers(appId).then(response => {
                //    this.selectedAppId = appId;
                //    this.dispatch(actions.LOAD_APP_USERS_SUCCESS, response.data);
                //    resolve();
                }, () => {
                    this.dispatch(actions.LOAD_APP_USERS_FAILED);
                    reject();
                });
            } else {
                this.dispatch(actions.SELECT_APP, appId);
                resolve();
            }
        });
    },

    /**
     * Retrieve a list of roles for this app.
     *
     * @param appId
     * @returns Promise
     */
    loadAppRoles(appId) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            let roleService = new RoleService();
            // fetch the app roles list if we don't have it already
            if (!this.appRoles || this.appRoles.length === 0) {
                roleService.getAppRoles(appId).then(response => {
                    this.dispatch(actions.LOAD_APP_ROLES_SUCCESS, response.data);
                    resolve();
                }, () => {
                    this.dispatch(actions.LOAD_APP_ROLES_FAILED);
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
    }
};

export default appsActions;
