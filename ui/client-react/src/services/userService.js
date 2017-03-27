import constants from './constants';
import BaseService from './baseService';

class UserService extends BaseService {

    constructor() {
        super();

        //  User api endpoints
        this.API = {
            GET_REQ_USER : `${constants.BASE_URL.QUICKBASE}/${constants.USERS}/${constants.REQUSER}`,
            GET_USER : `${constants.BASE_URL.QUICKBASE}/${constants.USERS}/{0}`
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
}

export default UserService;
