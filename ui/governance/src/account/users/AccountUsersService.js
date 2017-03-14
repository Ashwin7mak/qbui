import BaseService from '../../../../client-react/src/services/baseService';
import constants from '../../app/constants';

class AccountUsersService extends BaseService {

    constructor() {
        super();
        this.API = {
            GET_USERS               : `${constants.BASE_GOVERNANCE_URL}/{0}/${constants.USERS}`
        };
    }

    getAccountUsers(accountId) {
        const params = {};
        const url = super.constructUrl(this.API.GET_USERS, [accountId]);

        return super.get(url, {params});
    }
}

export default AccountUsersService;

