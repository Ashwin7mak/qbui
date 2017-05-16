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
            APP_ROLE_USERS      : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.ROLES}/{1}/${constants.USERS}`,
            GET_ALL_USERS       : `${constants.BASE_URL.PROXY}/${constants.USERS}/${constants.SEARCH}/?value={0}`,
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
     * unassign users from app role
     * @param appId
     * @param roleId
     */
    unassignUsersFromRole(appId, roleId, userIds) {

        let url = super.constructUrl(this.API.APP_ROLE_USERS, [appId, roleId]);

        return super.delete(url, {data: userIds});
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

    /**
     * gets all users based on the search term
     * @param searchTerm
     * @returns {*}
     */
    getAllUsers(searchTerm) {
        let url = super.constructUrl(this.API.GET_ALL_USERS, [searchTerm]);
        return super.get(url);
    }

    /**
     * Adds a User to an App
     * @param appId
     * @param userInfo
     * @returns {*}
     */
    assignUserToApp(appId, userId, roleId) {
        let url = super.constructUrl(this.API.APP_ROLE_USERS, [appId, roleId]);
        let userIds = [];
        userIds.push(userId);
        return super.post(url, userIds);
    }
}

export default RoleService;
