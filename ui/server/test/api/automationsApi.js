module.exports = class AutomationsApi {
    constructor(apiBase) {
        this.apiBase = apiBase;
        this.constsants = require('../../../common/src/constants');
        this.json = require('json-bignum');
        this.logger = require('../../src/logger').getLogger();
    }

    getAppAutomations(appId) {
        this.apiBase.executeRequestToPath('/we/api/v1/apps/' + appId + '/workflow/flows/', this.constsants.GET).then(function(requestResponse) {
            let automations = JSON.parse(requestResponse.body);
            return automations;
        });
    }

    createAutomation(appId, automation) {
        this.apiBase.executeRequestToPath('/we/api/v1/apps/' + appId + '/workflow/flows/', this.constsants.POST, automation).then(function(requestResponse) {
            let createdAutomation = JSON.parse(requestResponse.body);
            return createdAutomation;
        });
    }
};
