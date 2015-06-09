(function () {
    'use strict';
    var request = require('request');

    module.exports = function (app, config) {

        //  request helper class
        var env = app.get('env');
        var requestHelper = require('../api/quickbase/requestHelper')(config);
        var recordsApi = require('../api/quickbase/recordsApi')(config);

        //Route for returning a single record
        app.route('/api/:version/apps/:appId/tables/:tableId/records/:recordId').get(
            function(req, res) {
                requestHelper.logRoute(req);
                recordsApi.fetchSingleRecordAndFields(req)
                    .then(function(response) {
                        res.send(response);
                    })
                    .catch(function(error) {
                        console.log('ERROR ' + JSON.stringify(error));
                        requestHelper.copyHeadersToResponse(res, error.headers);
                        res.status(error.statusCode)
                            .send(error.body);
                    });
            }
        );

        //Route for returning an array of records
        app.route('/api/:version/apps/:appId/tables/:tableId/records').get(
            function(req, res) {
                requestHelper.logRoute(req);
                recordsApi.fetchRecordsAndFields(req)
                    .then(function(response) {
                        res.send(response);
                    })
                    .catch(function(error) {
                        requestHelper.copyHeadersToResponse(res, error.headers);
                        res.status(error.statusCode)
                            .send(error.body);
                    });
            }
        );

        //Route for returning a report
        app.route('/api/:version/apps/:appId/tables/:tableId/reports/:reportId/results').get(
            function(req, res) {
                requestHelper.logRoute(req);
                recordsApi.fetchRecordsAndFields(req)
                    .then(function(response) {
                        res.send(response);
                    })
                    .catch(function(error) {
                        requestHelper.copyHeadersToResponse(res, error.headers);
                        res.status(error.statusCode)
                            .send(error.body);
                    });
            }
        );

        //Disable proxying of realm and ticket requests via the node webserver for non-local and test environment
        if ('local' !== env && 'test' !== env) {
            app.route(['/api/:version/realms*', '/api/:version/ticket*']).all(
                function (req, res) {
                    requestHelper.logRoute(req);
                    res.status(404).send();
                }
            );
        }

        //  TODO: need to figure out the routing..swagger doc vs 'real' api data call vs other.
        //  TODO: .right now we are routing through this one definition...
        //  TODO: ..may want to refine...as it's probably a bit too broad...tbd
        app.route('/api/*').all(function (req, res) {
            //  log some route info and set the request options
            requestHelper.logRoute(req);
            var opts = requestHelper.setOptions(req);

            //  send the request
            request(opts)
                .on('response', function (response) {
                    console.log('status code: ' + response.statusCode);
                })
                .pipe(res);
        });

    };

}());
