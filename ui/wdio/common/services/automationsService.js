module.exports = class AutomationsService {
    constructor(automationApi) {
        this.automationApi = automationApi;
    }

    /**
     * Gets the automations for application
     * @param appId application id
     * @return the list of automations for application
     */
    getAutomations(appId) {
        return this.automationApi.getAppAutomations(appId);
    }

    /**
     * Creates an automation for application
     * @param appId application id
     * @param automation    automation to create
     * @return created automation
     */
    createAutomation(appId, automation) {
        return this.automationApi.createAutomation(appId, automation);
    }
};
