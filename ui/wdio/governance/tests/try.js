/**
 * Base state setup
 */

(function () {
    'use strict';
    var request = require('request');
    var promise = require('bluebird');

    //
    function HTTPClient() {
        // post req
        var path = "https://postman-echo.com/post"
        var method = "post"
        var body = "post call"
        var headers = {
            'Content-Type': 'application/plain'
        }

        // get req
        // var path = "https://www.cnn.com"
        // var method = "get"
        // var body = "get call"
        // var headers = {
        //     'Content-Type': 'application/plain'
        // }
        let opts = {
            url: path,
            method: method,
            body: body,
            headers: headers
        };

        console.log('===> S2: in promise ***');
        request(opts, function(error, response) {
            // let statusCode = response && response.statusCode;
            console.log('===> S3: in request ***');

            console.log('****error:', error); // Print the error if one occurred
            console.log('****statusCode:', response.statusCode); // Print the response status code if a response was received
            console.log('******body:', response.body); // Print the HTML for the Google homepage.
        });
    }

    describe('Governance - base state setup', function() {
        it('test http client', function() {
            console.log("==> Started...");


            // HTTPClient();
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

            // json to xml
            // var xml = parser.toXml(json);
            // console.log("back to xml -> %s", xml)


            console.log("==> Ended...");

        });
    });

})();