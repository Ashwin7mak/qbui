import constants from './constants';
import BaseService from './baseService';

class AppService extends BaseService {

    constructor() {
        super();
    }

    /**
     * Return an QuickBase App
     *
     * @param appId
     * @returns {*}
     */
    getApp(appId) {
        return super.get(constants.APPS + '/' + appId);
    }

    /**
     * Return all QuickBase apps for the authenticated user
     *
     * @returns {*}
     */
    getApps() {
        return super.get(constants.APPS);
    }

}

export default AppService;
