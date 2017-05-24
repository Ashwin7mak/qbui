module.exports = class AutomationsService {
    constructor(automationApi) {
        this.automationApi = automationApi;
    }

    getAutomations(appId) {
        return this.automationApi.getAppAutomations(appId);
    }

    createAutomation(appId, automation) {
        return this.automationApi.createAutomation(appId, automation);
    }
};
