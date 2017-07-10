const legacyHTTPClient = require('../services/legacyHTTPClient');
const utils = require('../services/utils');
const userDefVars = require('../config/userDefVars');
const sysDefVars = require('../config/sysDefVars');
const log = require('../../../server/src/logger').getLogger();

module.exports = {
    createRealm(isEnterprise) {
        //* Set path and make request
        let adminEmail = "weiRealm1@gmail.com"
        let hostname = "www";
        let app = "main";
        let action = "QBI_CreateUserAndTrialAccount";
        let body = null;
        let urlParams = "delayVerify=true&createSubDomain=true"+ "&passwd="+ userDefVars.ADMIN_PASSWORD+ "&email=" + adminEmail;
        let username = userDefVars.SUPER_ADMIN_USERNAME; //"weiRealm@gmail.com";
        let password = userDefVars.SUPER_ADMIN_PASSWORD; //"Test123!";
        let isJSON = false;
        let res_xml = [], res = [];

        return legacyHTTPClient.postRequest(hostname, app, action, body, urlParams, username, password, isJSON).then(httpResponse => {
            //* get response body in json
            if (isJSON) {
                res = httpResponse.body;
            } else {
                res = utils.parseXMLResponseToJSON(httpResponse);
            }
            console.log('response in JSON ==> ', res);
            console.log ("===> subDomain = ", utils.getJsonQdbapiData (res).subdomain);
        }).catch(function(ex) {
            log.debug(ex);
            console.log(ex);
        });

    }
}
