import constants from './constants';
import BaseService from './baseService';

class AutomationService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_AUTOMATIONS  : `${constants.BASE_URL.AUTOMATION}/${constants.AUTOMATION.API}/${constants.APPS}/{0}/${constants.AUTOMATION.FLOWS}/`,
            GET_AUTOMATION  : `${constants.BASE_URL.AUTOMATION}/${constants.AUTOMATION.API}/${constants.APPS}/{0}/${constants.AUTOMATION.FLOWS}/{1}`,
            SAVE_AUTOMATION  : `${constants.BASE_URL.AUTOMATION}/${constants.AUTOMATION.API}/${constants.APPS}/{0}/${constants.AUTOMATION.FLOWS}/{1}`,
            AUTOMATION_INVOKE  : `${constants.BASE_URL.AUTOMATION}/${constants.AUTOMATION.INVOKE}/${constants.APPS}/{0}/api/{1}`
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

    getAutomation(appId, automationId) {
        let url = super.constructUrl(this.API.GET_AUTOMATION, [appId, automationId]);
        return super.get(url);
    }

    saveAutomation(appId, automationId, automation) {
        let url = super.constructUrl(this.API.SAVE_AUTOMATION, [appId, automationId]);
        return super.put(url, automation);
    }

    invokeAutomation(appId, wfId, payload)  {
        let url = super.constructUrl(this.API.AUTOMATION_INVOKE, [appId, wfId]);

        return super.post(url, payload || {}, {});


    }
}
export default AutomationService;
