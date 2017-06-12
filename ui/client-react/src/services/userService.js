import constants from './constants';
import BaseService from './baseService';

class UserService extends BaseService {

    constructor() {
        super();

        //  User api endpoints
        this.API = {
            GET_REQ_USER : `${constants.BASE_URL.QBUI}/${constants.USERS}/${constants.REQUSER}`,
            GET_USER : `${constants.BASE_URL.PROXY}/${constants.USERS}/{0}`,
            SEARCH_USERS : `${constants.BASE_URL.PROXY}/${constants.USERS}/${constants.SEARCH}/?value={0}`
        };
    }

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
     * Return list of users based on the search term
     * =
     * @param searchTerm
     * @returns {*}
     */
    searchUsers(searchTerm) {
        let url = super.constructUrl(this.API.SEARCH_USERS, [searchTerm]);
        return super.get(url);
    }
}

export default UserService;
