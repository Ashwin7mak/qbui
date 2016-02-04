// action creators
import * as actions from '../constants/actions';
import AppService from '../services/appService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
var logger = new Logger();

let appsActions = {

    loadApps(withTables) {

        //  promise is returned for testing
        let deferred = Promise.defer();

        this.dispatch(actions.LOAD_APPS);
        let appService = new AppService();

        appService.getApps().then(
            (response) => {
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
                            deferred.resolve();
                        },
                        (error) => {
                            logger.error('AppService getApp error:' + JSON.stringify(error));
                            this.dispatch(actions.LOAD_APPS_FAILED);
                            deferred.reject();
                        }
                    ).catch((ex) => {
                        logger.error('AppService getApp exception:' + JSON.stringify(ex));
                        this.dispatch(actions.LOAD_APPS_FAILED);
                        deferred.reject();
                    });
                } else {
                    this.dispatch(actions.LOAD_APPS_SUCCESS, response.data);
                    deferred.resolve();
                }
            },
            (error) => {
                logger.error('AppService getApps error:' + JSON.stringify(error));
                this.dispatch(actions.LOAD_APPS_FAILED);
                deferred.reject();
            }
        ).catch((ex) => {
            logger.error('AppService getApps exception:' + JSON.stringify(ex));
            this.dispatch(actions.LOAD_APPS_FAILED);
            deferred.reject();
        });

        return deferred.promise;
    },

    selectAppId(appID) {
        this.dispatch(actions.SELECT_APP, appID);
    },

    selectTableId(tblID) {
        this.dispatch(actions.SELECT_TABLE, tblID);
    }
};

export default appsActions;
