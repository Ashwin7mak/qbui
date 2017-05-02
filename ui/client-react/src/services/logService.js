import constants from './constants';
import BaseService from './baseService';

class LogService extends BaseService {

    constructor() {
        super();

        //  Log service API endpoints
        this.API = {
            LOG     : `${constants.BASE_URL.QBUI}/${constants.LOG}`
        };
    }

    /**
     * Log a message on the node server
     *
     * @param message - message object that contains the log level and message
     *    {
     *       level: level.bunyanLevel,
     *       msg: msg
     *    };
     * @returns promise
     */
    log(message) {
        return super.post(this.API.LOG, message);
    }

}

export default LogService;
