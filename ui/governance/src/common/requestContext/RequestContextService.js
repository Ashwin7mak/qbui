import BaseService from '../../../../client-react/src/services/baseService';
import constants from '../../app/constants';

class RequestContextService extends BaseService {

    constructor() {
        super();
        this.API = {
            GET_CONTEXT: `${constants.BASE_GOVERNANCE_URL}/context`
        };
    }

    /**
     * Get the Account Users through the Node API for the given accountId
     */
    getRequestContext(accountId) {
        const params = {};

        if (accountId) {
            params.accountId = accountId;
        }
        const url = super.constructUrl(this.API.GET_CONTEXT, []);

        return super.get(url, {params});
    }
}

export default RequestContextService;
