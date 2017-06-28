module.exports = class AutomationsService {
    constructor(automationApi) {
        this.automationApi = automationApi;
    }

    * flowNameGenerator() {
        for (; ;) {
            yield 'flow_name_' + Math.random().toString(36).substring(7);
        }
    }

    /**
     * Gets the url to Application Settings - Automation page
     * @param realmName
     * @param appId
     */
    getAppAutomationsSettingsUrl(realmName, appId) {
        let appAutomationsSettingsUrl = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/settings/app/' + appId + '/automation');
        return appAutomationsSettingsUrl;
    }

    getAutomationViewUrl(realmName, appId, automationId) {
        let automationViewUrl = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/settings/app/' + appId + '/automation/' + automationId + '/view');
        return automationViewUrl;
    }

    getAutomationEditViewUrl(realmName, appId, automationId) {
        let automationEditViewUrl = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/builder/app/' + appId + '/automation/' + automationId);
        return automationEditViewUrl;
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
