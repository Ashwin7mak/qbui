import constants from './constants';
import BaseService from './baseService';

class UserService extends BaseService {

    constructor() {
        super();

        //  User api endpoints
        this.API = {
            GET_REQ_USER : `${constants.BASE_URL.QUICKBASE}/${constants.USERS}/${constants.REQUSER}`
        };
    }

    /**
     * check if requesting user is a  system admin
     */
    getRequestUser() {
        let url = super.constructUrl(this.API.GET_REQ_USER);
        return super.get(url);
    }
}

export default UserService;
