import BaseService from '../../../../client-react/src/services/baseService';
import constants from '../../app/constants';

class AccountUsersService extends BaseService {

    constructor() {
        super();
        this.API = {
            GET_USERS               : `${constants.BASE_GOVERNANCE_URL}/${constants.USERS}`
        };
    }

    getAccountUsers() {
        const params = {};
        const url = super.constructUrl(this.API.GET_USERS, []);

        return super.get(url, {params});
    }
}

export default AccountUsersService;

