import constants from './constants';
import BaseService from './baseService';

class AccountUsersService extends BaseService {

    constructor() {
        super();

        //  Feature switch service API endpoints
        this.API = {
            GET_Users               : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}`
        };
    }

    getUsers() {
        const params = {};
        const url = super.constructUrl(this.API.GET_FEATURE_SWITCHES, []);

        return super.get(url, {params});
    }
}

export default AccountUsersService;
