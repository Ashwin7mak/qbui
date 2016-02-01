// action creators
import * as actions from '../constants/actions';

import AppService from '../services/appService';
import Logger from '../utils/logger';
var logger = new Logger();
import Promise from 'bluebird';

let appsActions = {

    loadApps(withTables) {

        this.dispatch(actions.LOAD_APPS);
        let appService = new AppService();

        appService.getApps().then(
            (response) => {
                logger.debug('AppService getApps success:' + JSON.stringify(response));

                if (withTables) {
                    let promises = [];
                    let apps = [];
                    response.data.forEach((app) => {
                        let promise = appService.getApp(app.id);
                        promises.push(promise);
                        promise.then(
                            (a) => {
                                a.data.link = '/app/' + a.data.id;
                                apps.push(a.data);
                            });
                    });

                    Promise.all(promises).then(
                        () => {
                            this.dispatch(actions.LOAD_APPS_SUCCESS, apps);
                        },
                        (error) => {
                            logger.debug('AppService getApp error:' + JSON.stringify(error));
                            this.dispatch(actions.LOAD_APPS_FAILED);
                        }
                    );
                } else {
                    this.dispatch(actions.LOAD_APPS_SUCCESS, response.data);
                }
            },
            (error) => {
                logger.debug('AppService getApps error:' + JSON.stringify(error));
                this.dispatch(actions.LOAD_APPS_FAILED);
            }
        ).catch((ex) => {
            logger.debug('AppService getApps exception:' + JSON.stringify(ex));
            this.dispatch(actions.LOAD_APPS_FAILED);
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
