/**
 * Base state setup
 */
const legacyHTTPClient = require('../services/legacyHTTPClient');
const utils = require('../services/utils');
const userDefVars = require('../config/userDefVars');
const legacyLogin = require('../services/legacyLogin');

describe('Governance - base state setup', () => {
    let res_xml = [];
    let res = [], res_data = [];

    beforeAll(() => {
        //* Set path and make request
        let hostname = "weirealm";
        let app = "main";
        let action = "API_Authenticate";
        let body = null;
        let urlParams = "";
        let username = "weiRealm@gmail.com"; //userDefVars.SUPER_ADMIN_USERNAME; //
        let password = "Test123!";           //userDefVars.SUPER_ADMIN_PASSWORD; //
        let isJSON = false;
        return legacyHTTPClient.postRequest(hostname, app, action, body, urlParams, username, password, isJSON).then(httpResponse => {
            if (isJSON) {
                res = httpResponse.body;
            } else {
                res_xml = httpResponse.body;
                console.log("response in XML ==>  ", res_xml)

                // convert xml to json
                res = utils.parseXMLResponseToJSON(httpResponse);
            }
            console.log('response in JSON ==> ', res);

            // res = JSON.parse(res);
            // res_data = res.qdbapi;
            // console.log("==> res_data action: ", res_data.action);
            console.log("==> res_data action: ", utils.getJsonQdbapiData (res).action);
        }).catch(function(error) {
            console.log('Error in httpClient:', error);
        });
    });

    beforeEach(() => {
        let signInURL = "https://weirealm.currentstack-int.quickbaserocks.com/db/main?a=signin";
        let username = "weiRealm@gmail.com";
        let password = "Test123!";
        legacyLogin.Login(signInURL, username, password);
    });
    it('test run', () => {
        console.log("==> Started...");

        expect(true).toEqual(true);
        console.log("==> Ended...");
    });
});
