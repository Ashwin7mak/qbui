(function () {
    'use strict';
    var request = require('request');
    var log = require('../logger').getLogger(module.filename);

    module.exports = function (app, config) {

        //  request helper class
        var env = app.get('env');
        var requestHelper = require('../api/quickbase/requestHelper')(config);
        var recordsApi = require('../api/quickbase/recordsApi')(config);

        //Route for returning a single record
        app.route('/api/:version/apps/:appId/tables/:tableId/records/:recordId').get(
            function(req, res) {
                //  log some route info and set the request options
                log.logRequest(req);

                recordsApi.fetchSingleRecordAndFields(req)
                    .then(function(response) {
                        log.logResponse(response);
                        res.send(response);
                    })
                    .catch(function(error) {
                        log.error('ERROR: ' + JSON.stringify(error));
                        requestHelper.copyHeadersToResponse(res, error.headers);
                        res.status(error.statusCode)
                            .send(error.body);
                    });
            }
        );

        //Route for returning an array of records
        app.route('/api/:version/apps/:appId/tables/:tableId/records').get(
            function(req, res) {
                //  log some route info and set the request options
                log.logRequest(req);

                recordsApi.fetchRecordsAndFields(req)
                    .then(function(response) {
                        log.logResponse(response);
                        res.send(response);
                    })
                    .catch(function(error) {
                        log.error('ERROR: ' + JSON.stringify(error));
                        requestHelper.copyHeadersToResponse(res, error.headers);
                        res.status(error.statusCode)
                            .send(error.body);
                    });
            }
        );

        //Route for returning a report
        app.route('/api/:version/apps/:appId/tables/:tableId/reports/:reportId/results').get(
            function(req, res) {
                //  log some route info and set the request options
                log.logRequest(req);

                recordsApi.fetchRecordsAndFields(req)
                    .then(function(response) {
                        log.logResponse(response);
                        res.send(response);
                    })
                    .catch(function(error) {
                        log.error('ERROR: ' + JSON.stringify(error));
                        requestHelper.copyHeadersToResponse(res, error.headers);
                        res.status(error.statusCode)
                            .send(error.body);
                    });
            }
        );

        //Disable proxying of realm and ticket requests via the node webserver for non-local and test environment
        if ('local' !== env && 'test' !== env) {
            log.info('Disabling realm and ticket endpoint access for this run-time environment!');
            app.route(['/api/:version/realms*', '/api/:version/ticket*']).all(
                function (req, res) {
                    log.logRequest(req);
                    res.status(404).send();
                }
            );
        }

        //Route for returning swagger api documentation
        app.route(['/api', '/api/resources/*', '/api/images/*', '/api/documentation/*']).get(
            function(req, res) {
                //  log some route info and set the request options
                log.logRequest(req);

                var opts = requestHelper.setOptions(req);
                var url = config.javaHost + req.url;
                opts.url = url;

                request(opts)
                    .on('error', function(error) {
                        log.error('Swagger API ERROR ' + JSON.stringify(error));
                    })
                    .pipe(res);
            }
         );

        //  Route to return API calls
        app.route('/api/*').all(
            function (req, res) {
                //  log some route info and set the request options
                log.logRequest(req);

                var opts = requestHelper.setOptions(req);

                request(opts)
                    .on('response', function (response) {
                        log.info('API response: ' + response.statusCode + ' - ' + req.method + ' ' + req.path);
                    })
                    .on('error', function (error) {
                        log.error('API ERROR ' + JSON.stringify(error));
                    })
                    .pipe(res);
            }
        );

    };

}());
