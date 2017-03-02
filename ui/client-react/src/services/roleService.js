/**
 * Created by rbeyer on 2/18/17.
 */
import constants from './constants';
import BaseService from './baseService';

class RoleService extends BaseService {

    constructor() {
        super();

        //  App Service API endpoints
        this.API = {
            GET_APP_ROLES           : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.ROLES}`
        };
    }

    /**
     * get roles for app
     * @param appId
     */
    getAppRoles(appId) {
        let url = super.constructUrl(this.API.GET_APP_ROLES, [appId]);
        return super.get(url);
    }
}

export default RoleService;
