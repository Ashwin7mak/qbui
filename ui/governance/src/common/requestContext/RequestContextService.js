import BaseService from "../../../../client-react/src/services/baseService";
import constants from "../../app/constants";

class RequestContextService extends BaseService {

    constructor() {
        super();
        this.API = {
            GET_CONTEXT: `${constants.BASE_GOVERNANCE_URL}/context`
        };
    }

    /**
     * Get the Request Context through the Node API for the given accountId
     * Expects to get the state of the realm and the user
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
