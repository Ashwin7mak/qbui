module.exports = class AutomationsApi {
    constructor(apiBase) {
        this.apiBase = apiBase;
        this.constsants = require('../../../common/src/constants');
    }

    /**
     * Gets the automations for application
     * @param appId application id
     * @return the list of automations for application
     */
    getAppAutomations(appId) {
        return this.apiBase.executeRequestToPath('/we/api/v1/apps/' + appId + '/workflow/flows/', this.constsants.GET).then(function(requestResponse) {
            let automations = JSON.parse(requestResponse.body);
            return automations;
        }).catch(function(error) {
            browser.logger.error('Error in getAppAutomations function:' + JSON.stringify(error));
            return Promise.reject(error);
        });
    }

    /**
     * Creates an automation for application
     * @param appId application id
     * @param automation    automation to create
     * @return created automation
     */
    createAutomation(appId, automation) {
        return this.apiBase.executeRequestToPath('/we/api/v1/apps/' + appId + '/workflow/flows/', this.constsants.POST, automation).then(function(requestResponse) {
            let createdAutomation = JSON.parse(requestResponse.body);
            return createdAutomation;
        }).catch(function(error) {
            browser.logger.error('Error in createAutomation function:' + JSON.stringify(error));
            return Promise.reject(error);
        });
    }
};
