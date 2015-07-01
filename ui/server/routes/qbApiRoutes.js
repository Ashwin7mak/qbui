
(function () {
    'use strict';
    var request = require('request');
    var log = require('../logger').getLogger(module.filename);

    module.exports = function (app, config) {

        //  request helper class
        var env = app.get('env');
        var requestHelper = require('../api/quickbase/requestHelper')(config);
        var recordsApi = require('../api/quickbase/recordsApi')(config);

        /**
         * This helper method takes the request url produced and replaces the single /api with /api/api.
         *
         * @param req
         */
        function getOptionsForRequest(req){
            var opts = requestHelper.setOptions(req);
            var url = config.javaHost + req.url;
            if(url.search('/api/api') === -1) {
                opts.url = url.replace('/api', '/api/api');
            }

            return opts;
        };

        /**
         * This helper method takes the request url produced and replaces the single /api with /api/api on the original
         * request
         *
         * @param req
         */
        function modifyRequestPathForApi(req){
            var originalUrl = req.url;
            if(originalUrl.search('/api/api') === -1) {
                req.url = originalUrl.replace('/api', '/api/api');
            }
        }

        //Route for returning a single record
        app.route('/api/api/:version/apps/:appId/tables/:tableId/records/:recordId').get(
            function(req, res) {
                //  log some route info and set the request options
                log.logRequest(req);

                modifyRequestPathForApi(req);

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
        app.route('/api/api/:version/apps/:appId/tables/:tableId/records').get(
            function(req, res) {
                //  log some route info and set the request options
                log.logRequest(req);

                modifyRequestPathForApi(req);

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
        app.route('/api/api/:version/apps/:appId/tables/:tableId/reports/:reportId/results').get(
            function(req, res) {
                //  log some route info and set the request options
                log.logRequest(req);

                modifyRequestPathForApi(req);

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

                var opts = getOptionsForRequest(req);

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
