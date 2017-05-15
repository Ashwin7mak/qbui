import constants from './constants';
import BaseService from './baseService';

class UserService extends BaseService {

    constructor() {
        super();

        //  User api endpoints
        this.API = {
            GET_REQ_USER : `${constants.BASE_URL.QBUI}/${constants.USERS}/${constants.REQUSER}`,
            GET_USER : `${constants.BASE_URL.PROXY}/${constants.USERS}/{0}`,
            GET_ALL_USERS : `${constants.BASE_URL.PROXY}/${constants.USERS}/${constants.SEARCH}/?value={0}`,
            ADD_USER : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.USERS}/{1}/${constants.ROLES}`,
        };
    }

    // POST /api/v1/apps/{appId}/users/{userId}/roles

    /**
     * check if requesting user is a  system admin
     */
    getRequestUser() {
        let url = super.constructUrl(this.API.GET_REQ_USER);
        return super.get(url);
    }

    /**
     * get a user by userId
     */
    getUser(userId) {
        let url = super.constructUrl(this.API.GET_USER, [userId]);
        return super.get(url);
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
    addUser(appId, userInfo) {
        let url = super.constructUrl(this.API.ADD_USER, [appId, userInfo.userId]);
        const roleId = userInfo.roleId;
        console.log(typeof roleId)
        return super.post(url, {data: roleId});
    }
}

export default UserService;
