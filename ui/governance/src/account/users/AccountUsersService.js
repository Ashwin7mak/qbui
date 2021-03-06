import BaseService from "../../../../client-react/src/services/baseService";
import constants from "../../app/constants";

class AccountUsersService extends BaseService {

    constructor() {
        super();
        this.API = {
            GET_USERS               : `${constants.BASE_GOVERNANCE_URL}/{0}/${constants.USERS}`,
            GET_CONTEXT             : `${constants.BASE_GOVERNANCE_URL}/{0}/${constants.CONTEXT}`
        };
    }

    /**
     * Get the Account Users through the Node API for the given accountId
     */
    getAccountUsers(accountId) {
        const params = {};
        const url = super.constructUrl(this.API.GET_USERS, [accountId]);

        return super.get(url, {params});
    }
}

export default AccountUsersService;

