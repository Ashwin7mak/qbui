/**
 * Created by msyed on 3/30/17.
 */
import constants from './constants';
import BaseService from './baseService';
import * as query from '../constants/query';
import Promise from 'bluebird';
import axios from 'axios';

class AutomationService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_AUTOMATIONS  : `${constants.BASE_URL.AUTOMATION}/${constants.AUTOMATION_API}/${constants.APPS}/{0}/${constants.AUTOMATION_FLOWS}/`,
            AUTOMATION_INVOKE  : `${constants.BASE_URL.AUTOMATION}/${constants.AUTOMATION_INVOKE}/${constants.APPS}/{0}/api/{1}`
        };
    }

    /**
     * Call the automation endpoint to get a list of all the automations available for a given app
     *
     * @param appId
     * @returns promise
     */
    getAutomations(appId) {
        let url = super.constructUrl(this.API.GET_AUTOMATIONS, [appId]);
        return super.get(url);
    }

    invokeAutomation(appId, wfId, payload)  {
        let url = super.constructUrl(this.API.AUTOMATION_INVOKE, [appId, wfId]);
        return super.post(url, payload, {});

    }
}
export default AutomationService;
