import constants from './constants';
import BaseService from './baseService';
import * as query from '../constants/query';
import Promise from 'bluebird';

class AppService extends BaseService {

    constructor() {
        super();

        //  App Service API endpoints
        this.API = {
            GET_APP           : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}`,
            GET_APP_USERS     : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.USERS}`,
            GET_APPS          : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}`,
            APPLICATION_STACK : `${constants.BASE_URL.LEGACY}/${constants.APPS}/{0}/${constants.STACK}`
        };
    }

    /**
     * Return a QuickBase App
     *
     * @param appId
     * @returns promise
     */
    getApp(appId) {
        let url = super.constructUrl(this.API.GET_APP, [appId]);
        return super.get(url);
    }

    /**
     * get users for app (mocked for now)
     * @param appId
     */
    getAppUsers(appId) {
        let url = super.constructUrl(this.API.GET_APP_USERS, [appId]);
        return super.get(url);
    }

    /**
     * Return all QuickBase apps
     *
     * @param hydrate
     * @returns promise
     */
    getApps(hydrate) {
        //  should the information returned for each table be the table id
        //  only or a fully hydrated table object.
        let params = {};
        if (hydrate) {
            params[query.HYDRATE] = '1';
        }
        return super.get(this.API.GET_APPS, {params:params});
    }

    /**
     * Return the stack where the application should be shown
     *
     * @param appId
     * @returns promise
     */
    getApplicationStack(appId) {
        let url = super.constructUrl(this.API.APPLICATION_STACK, [appId]);
        return super.get(url);
    }

    /**
     * Set the stack where the application should be shown
     *
     * @param appId
     * @param openInMercury
     * @returns promise
     */
    setApplicationStack(appId, params) {
        let url = super.constructUrl(this.API.APPLICATION_STACK, [appId]);
        return super.post(url, params);
    }

}

export default AppService;
