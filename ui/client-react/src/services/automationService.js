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
            AUTOMATION_INVOKE  : `${constants.BASE_URL.AUTOMATION}/${constants.APPS}/{0}/api/{1}`
        };
    }

    invokeAutomation(appId, wfId, payload)  {
        let url = super.constructUrl(this.API.AUTOMATION_INVOKE, [appId, wfId]);
        return super.post(url, payload, {});

    }
}
export default AutomationService;
