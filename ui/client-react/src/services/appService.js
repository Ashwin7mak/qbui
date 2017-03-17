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
            CREATE_TABLE_COMPONENTS      : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/${constants.TABLECOMPONENTS}`
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
        //let url = super.constructUrl(this.API.CREATE_TABLE_COMPONENTS, [appId]);
        //return super.post(url, {name: "name", description: "desc", tableIcon: "icon", tableNoun: "noun"});
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
}

export default AppService;
