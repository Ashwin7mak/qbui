import constants from './constants';
import BaseService from './baseService';

class AppService extends BaseService {

    constructor() {
        super();

        //  App Service API endpoints
        this.API = {
            GET_APP     : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}`,
            GET_APPS    : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}`
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
     * Return all QuickBase apps
     *
     * @returns promise
     */
    getApps() {
        return super.get(this.API.GET_APPS);
    }

}

export default AppService;
