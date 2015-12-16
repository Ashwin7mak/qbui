import constants from './constants';
import BaseService from './baseService';

class LogService extends BaseService {

    constructor() {
        super();
    }

    /**
     * Log the message
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @returns {*}
     */
    log(message) {
        return super.post(constants.LOG, message);
    }

}

export default LogService;
