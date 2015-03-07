(function () {
    'use strict';

    var request = require("request");

    module.exports = function (app, config) {

        //  request helper class
        var requestHelper = require('../api/quickbase/requestHelper')(config);

        //  TODO: need to figure out the routing..swagger doc vs 'real' api data call vs other.
        //  TODO: .right now we are routing through this one definition...
        //  TODO: ..may want to refine...as it's probably a bit too broad...tbd
        app.route('/api/*').all(function (req, res) {
            //  log some route info and set the request options
            requestHelper.logRoute(req);
            var opts = requestHelper.setOptions(req);

            //  send the request
            //  TODO: NEED TO HANDLE ERRORS..expected(server 401,404) and unexpected(server 500).
            request(opts)
                .on('response', function (response) {
                    console.log("status code: " + response.statusCode);
                })
                .pipe(res);
        });

    };

}());
