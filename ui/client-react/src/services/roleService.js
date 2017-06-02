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
            GET_APP_ROLES       : `${constants.BASE_URL.QBUI}/${constants.APPS}/{0}/${constants.ROLES}`,
            APP_ROLE_USERS      : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.ROLES}/{1}/${constants.USERS}`
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
     * @param userIds - list of user ids
     */
    removeUsersFromAppRole(appId, roleId, userIds) {
        let url = super.constructUrl(this.API.APP_ROLE_USERS, [appId, roleId]);
        return super.delete(url, {data: userIds});
    }

    /**
     * Assign an app role to a list of users
     * @param appId
     * @param roleId
     * @param userIds - list of userids
     * @returns {*}
     */
    assignUsersToAppRole(appId, roleId, userIds) {
        let url = super.constructUrl(this.API.APP_ROLE_USERS, [appId, roleId]);
        return super.post(url, userIds);
    }
}

export default RoleService;
