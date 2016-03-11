// action creators
import * as actions from '../constants/actions';
import AppService from '../services/appService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
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

let appsActions = {

    loadApps(withTables) {

        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            this.dispatch(actions.LOAD_APPS);
            let appService = new AppService();

            appService.getApps().then(
                response => {
                    logger.debug('AppService getApps success:' + JSON.stringify(response));

                    if (withTables) {
                        let promises = [];
                        response.data.forEach((app) => {
                            promises.push(appService.getApp(app.id));
                        });

                        Promise.all(promises).then(
                            (apps) => {
                                let appLinkList = [];
                                apps.forEach((app) => {
                                    app.data.link = '/app/' + app.data.id;
                                    appLinkList.push(app.data);
                                });
                                this.dispatch(actions.LOAD_APPS_SUCCESS, appLinkList);
                                resolve();
                            },
                            (error) => {
                                logger.error('AppService getApp error:', error);
                                this.dispatch(actions.LOAD_APPS_FAILED);
                                reject();
                            }
                        ).catch((ex) => {
                            logger.error('AppService getApp exception:', ex);
                            this.dispatch(actions.LOAD_APPS_FAILED);
                            reject();
                        });
                    } else {
                        this.dispatch(actions.LOAD_APPS_SUCCESS, response.data);
                        resolve();
                    }
                },
                error => {
                    logger.error('AppService getApps error:', error);
                    this.dispatch(actions.LOAD_APPS_FAILED);
                    reject();
                }
            ).catch(ex => {
                logger.error('AppService getApps exception:', ex);
                this.dispatch(actions.LOAD_APPS_FAILED);
                reject();
            });
        });
    },

    selectAppId(appID) {
        this.dispatch(actions.SELECT_APP, appID);
    },

    selectTableId(tblID) {
        this.dispatch(actions.SELECT_TABLE, tblID);
    }
};

export default appsActions;
