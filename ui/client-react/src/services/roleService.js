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
            GET_APP_ROLES       : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.ROLES}`,
            APP_ROLE_USERS      : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.ROLES}/{1}/${constants.USERS}`
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

    /**
     * remove users from app role
     * @param appId
     * @param roleId
     */
    removeUsersFromRole(appId, roleId) {
        let url = super.constructUrl(this.API.APP_ROLE_USERS, [appId, roleId]);
        return super.delete(url);
    }

    /**
     * assign users to an app role
     * @param appId
     * @param roleId
     */
    assignUsersToRole(appId, roleId) {
        let url = super.constructUrl(this.API.APP_ROLE_USERS, [appId, roleId]);
        return super.post(url);
    }
}

export default RoleService;
