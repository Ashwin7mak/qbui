// action creators
import * as actions from '../constants/actions';
import AppService from '../services/appService';
import Promise from 'bluebird';
import _ from 'lodash';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import constants from '../../../common/src/constants';

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

//  Define the model object returned to the UI layer for the list of apps
//  TODO: initial implementation...still in progress..
let appsModel = {
    set(apps) {
        if (apps) {
            //  add a link element to each individual app
            apps.forEach((app) => {
                app.link = '/qbase/app/' + app.id;
            });
        }
        return apps;
    }
};

let appsActions = {

    /**
     * Return which stack (mercury or classic) the application is configured to be viewed.
     * @param appId
     * @returns Promise
     */
    getApplicationStack(appId) {
        let logger = new Logger();
        return new Promise((resolve, reject) => {
            if (appId) {
                //TODO dispatch event
                let appService = new AppService();

                appService.getApplicationStack(appId).then(
                    (response) => {
                        logger.debug('ApplicationService getApplicationStack success:' + JSON.stringify(response));
                        //TODO dispatch success event
                        resolve();
                    },
                    (error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'ApplicationService.getApplicationStack:');
                        //TODO dispatch failure event
                        reject();
                    }
                ).catch((ex) => {
                    // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                    logger.logException(ex);
                    reject();
                });
            } else {
                logger.error('ApplicationService.getApplicationStack: Missing required appId input parameter.');
                //TODO: dispatch error event
                reject();
            }
        });
    },

    /**
     * Set the stack(mercury or classic) where the application is to be viewed.
     *
     * @param appId
     * @param openInV3
     * @returns Promise
     */
    setApplicationStack(appId, openInV3) {
        let logger = new Logger();
        return new Promise((resolve, reject) => {
            if (appId && _.isBoolean(openInV3)) {
                logger.debug('Setting application stack preference. AppId:' + appId + '; openInV3:' + openInV3);

                //TODO dispatch event
                let appService = new AppService();

                let params = {};
                params[constants.REQUEST_PARAMETER.OPEN_IN_V3] = openInV3;

                this.dispatch(actions.SET_APP_STACK);
                appService.setApplicationStack(appId, params).then(
                    (response) => {
                        logger.debug('ApplicationService setApplicationStack success:' + JSON.stringify(response));
                        this.dispatch(actions.SET_APP_STACK_SUCCESS, {appId, openInV3});
                        resolve();
                    },
                    (error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'ApplicationService.setApplicationStack:');
                        this.dispatch(actions.SET_APP_STACK_FAILED);
                        reject();
                    }
                ).catch((ex) => {
                    // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                    logger.logException(ex);
                    reject();
                });
            } else {
                logger.error('ApplicationService.getApplicationStack: Missing required method parameters. AppId:' + appId + ' ;openInV3:' + openInV3);
                //TODO: dispatch error event
                reject();
            }
        });
    },

    /**
     * Retrieve a list of applications for this user.
     *
     * @param withTables - no table information is returned with each app unless
     * explicitly requested to do so.
     * @returns Promise
     */
    loadApps(withTables) {
        let logger = new Logger();
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            this.dispatch(actions.LOAD_APPS);
            let appService = new AppService();

            //  fetch the list of apps that this user can view
            appService.getApps().then(
                response => {
                    logger.debug('AppService getApps success:' + JSON.stringify(response));

                    if (withTables === true) {
                        //  The tables fetched from getApps are lazily loaded, so we need to
                        //  fetch each app explicitly to ensure the app object returned to the client
                        //  is fully hydrated.
                        //  TODO: potential for a large volume of async calls...
                        //  TODO: move the loop to the NODE layer.
                        let promises = [];
                        if (response.data && Array.isArray(response.data)) {
                            response.data.forEach((app) => {
                                promises.push(appService.getApp(app.id));
                            });
                        }

                        Promise.all(promises).then(
                            (apps) => {
                                //  build of list that contains the app data
                                let appList = [];
                                if (apps && Array.isArray(apps)) {
                                    apps.forEach((app) => {
                                        appList.push(app.data);
                                    });
                                }

                                var model = appsModel.set(appList);
                                this.dispatch(actions.LOAD_APPS_SUCCESS, model);
                                resolve();
                            },
                            (error) => {
                                //  axios upgraded to error.response object in 0.13.x
                                logger.parseAndLogError(LogLevel.ERROR, error.response, 'appService.getApp:');
                                this.dispatch(actions.LOAD_APPS_FAILED, error.response.status);
                                reject();
                            }
                        ).catch((ex) => {
                            // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                            logger.logException(ex);
                            reject();
                        });

                    } else {
                        var model = appsModel.set(response.data);
                        this.dispatch(actions.LOAD_APPS_SUCCESS, model);
                        resolve();
                    }
                },
                error => {
                    //  axios upgraded to error.response object in 0.13.x
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
        this.dispatch(actions.SELECT_APP, appId);

        let appService = new AppService();

        // fetch the app users list if we don't have it already

        if (appId !== this.selectedAppId) {
            appService.getAppUsers(appId).then(response => {
                this.selectedAppId = appId;
                this.dispatch(actions.LOAD_APP_USERS_SUCCESS, response.data);
            }, () => {
                this.dispatch(actions.LOAD_APP_USERS_FAILED);
            });
        }
    },

    selectTableId(tblId) {
        this.dispatch(actions.SELECT_TABLE, tblId);
    }
};

export default appsActions;
