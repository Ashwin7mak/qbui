/**
 * Base state setup
 */

(function () {
    'use strict';
    var request = require('request');
    var promise = require('bluebird');
    const legacyHTTPClient = require('../services/legacyHTTPClient');
    const utils = require('../services/utils');

    //
    function HTTPClient() {
        let res_xml = [];
        let res = [], res_data = [];
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
            var res_data = res.qdbapi;
            console.log("==> res_data action: ", res_data.action);
        }).catch(function(error) {
            console.log('Error in httpClient:', error);
        });
    }

    describe('Governance - base state setup', function() {
        it('test http client', function() {
            console.log("==> Started...");


            HTTPClient();
            var parser = require('xml2json');
            var response = '        <?xml version="1.0" ?>          ' +
                '<qdbapi><action>API_Authenticate</action>' +
                '<errcode>           0</errcode><errtext>No error</errtext> ' +
                '<ticket>   8_bmxa6wnnm_b3fjft_uyp_a_bjqdjhkdi9icsgciuc9ukbz29b7cbjwz4isjnr24mc63khy56e5cz5   </ticket>    ' +
                '<userid>59942065.cbu6</userid>     </qdbapi>';

            // var xml = "<foo attr=\"value\">bar</foo>";
            console.log("response in XML -> %s", response)

            // xml to json
            // var json = parser.toJson(response_xml.trim());
            response = parser.toJson(response.trim());
            console.log("response in JSON -> %s", response);
            var string = '{"Name":{"firstName":"James", "lastName":"Wang"}}';
            var ob = JSON.parse(response);
            var head_ob = ob.qdbapi;
            console.log("==> FFFFF..", head_ob.action);



            // var res = response.split(":");
            // console.log("11111 %s", res[0]);
            // console.log("11111 %s", res[1]);

            // json to xml
            // var xml = parser.toXml(json);
            // console.log("back to xml -> %s", xml)


            console.log("==> Ended...");

        });
    });

})();