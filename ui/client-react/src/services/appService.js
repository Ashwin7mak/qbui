import constants from './constants';
import BaseService from './baseService';
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
     * @returns promise
     */
    getApps() {
        return super.get(this.API.GET_APPS);
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
    setApplicationStack(appId, openInMercury) {
        let url = super.constructUrl(this.API.APPLICATION_STACK, [appId]);
        return super.post(url, {openInMercury:openInMercury || false});
    }

}

export default AppService;
