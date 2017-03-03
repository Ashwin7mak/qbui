import constants from './constants';
import BaseService from './baseService';

class UserService extends BaseService {

    constructor() {
        super();

        //  User api endpoints
        this.API = {
            IS_REQ_USER_ADMIN : `${constants.BASE_URL.QUICKBASE}/${constants.TICKET}/${constants.ISREQUSERADMIN}`
        };
    }

    /**
     * check if requesting user is a  system admin
     */
    isReqUserAdmin(appId) {
        let url = super.constructUrl(this.API.IS_REQ_USER_ADMIN);
        return super.get(url);
    }
}

export default UserService;
