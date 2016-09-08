// action creators
import * as actions from '../constants/actions';
import AppService from '../services/appService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

var logger = new Logger();

//  Custom handling of 'possible unhandled rejection' error,  because we don't want
//  to see an exception in the console output.  The exception is thrown by bluebird
//  because the core application code has no logic implemented to handle a rejected
//  promise.  This is expected as promises are NOT implemented in the application
//  code.  Promises are returned only to support our unit tests, which are expected
//  to implement the appropriate handlers.
Promise.onPossiblyUnhandledRejection(function(err) {
    logger.debug('Bluebird Unhandled rejection', err);
});

//  Define the model object returned to the UI layer for the list of apps
//  TODO: initial implementation...still in progress..
let appsModel = {
    set: function(apps) {
        if (apps) {
            //  add a link element to each individual app
            apps.forEach((app) => {
                app.link = '/app/' + app.id;
            });
        }
        return apps;
    }
};

let appsActions = {

    loadApps(withTables) {

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
                        response.data.forEach((app) => {
                            promises.push(appService.getApp(app.id));
                        });

                        Promise.all(promises).then(
                            (apps) => {
                                //  build of list that contains the app data
                                let appList = [];
                                apps.forEach((app) => {
                                    appList.push(app.data);
                                });

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
                            logger.logException(ex);
                            this.dispatch(actions.LOAD_APPS_FAILED, 500);
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
                logger.logException(ex);
                this.dispatch(actions.LOAD_APPS_FAILED, 500);
                reject();
            });
        });
    },

    selectAppId(appId) {
        this.dispatch(actions.SELECT_APP, appId);

        let appService = new AppService();

        appService.getAppUsers(appId).then(response => {
            console.log('got users',response);
                this.dispatch(actions.LOAD_APP_USERS_SUCCESS, response.data);
            },
            error => {
                this.dispatch(actions.LOAD_APP_USERS_FAILED);
            }
        );
    },

    selectTableId(tblId) {
        this.dispatch(actions.SELECT_TABLE, tblId);
    }
};

export default appsActions;
