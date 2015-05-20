(function () {
    'use strict';
    var request = require("request");
    var consts = require('../api/constants');
    var errors = require('../components/errors');

    module.exports = function (app, config) {

        //  request helper class
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
                        console.error("ERROR " + JSON.stringify(error));
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

        //Route for returning swagger api page
        app.route(['/api']).get(
            function(req, res) {
                requestHelper.logRoute(req);
                // TODO: make sure version matches valid version param
                var opts = requestHelper.setOptions(req);
                opts.headers[consts.CONTENT_TYPE] = consts.TEXT_HTML;
                request({
                    url: config.javaHost,
                    headers :{ accept:consts.TEXT_HTML }
                })
                .on('error', function(error) {
                    console.error("api ERROR " + JSON.stringify(error));
                })
                .pipe(res);
            }
        );

        //Route for returning swagger assets
        app.route(['/api/resources/*', '/api/images/*', '/api/documentation/*']).get(
            function(req, res) {
                requestHelper.logRoute(req);
                // TODO: make sure version matches valid version param
                var opts = requestHelper.setOptions(req);
                opts.headers[consts.CONTENT_TYPE] = consts.TEXT_HTML;
                var hostPath = config.javaHost.replace('/api','');
                request({
                    url: hostPath + req.originalUrl,
                    headers :req.headers
                })
                    .on('error', function(error) {
                        console.error("api " + this.href + " ERROR " + JSON.stringify(error));
                    })
                    .pipe(res);
            }
        );

        // url from swagger api xhr
        app.route([
                '/api/api/:version/apps*',
                '/api/api/:version/db*',
                '/api/api/:version/fields*',
                '/api/api/:version/health*',
                '/api/api/:version/pdb*',
                '/api/api/:version/records*',
                '/api/api/:version/relationships*',
                '/api/api/:version/reports*',
                '/api/api/:version/roles*',
                '/api/api/:version/tables*',
                '/api/api/:version/users*']
        ).all(function (req, res) {
                //  log some route info and set the request options
                requestHelper.logRoute(req);
                var opts = requestHelper.setOptions(req);
                var hostPath = config.javaHost.replace('/api','');
                opts.url = hostPath + req.originalUrl;

                //  send the request
                //  TODO: NEED TO HANDLE ERRORS..expected(server 401,404) and unexpected(server 500).
                request(opts)
                    .on('response', function (response) {
                        console.info("api  " + response.req.path + " reply status code: " + response.statusCode);
                    })
                    .on('error', function(error) {
                        console.error("api ERROR " + JSON.stringify(error));
                    })
                    .pipe(res);
            });

        // api resources available to outside
        app.route([
                '/api/:version/apps*',
                '/api/:version/db*',
                '/api/:version/fields*',
                '/api/:version/health*',
                '/api/:version/pdb*',
                '/api/:version/records*',
                '/api/:version/relationships*',
                '/api/:version/reports*',
                '/api/:version/roles*',
                '/api/:version/tables*',
                '/api/:version/users*']
        ).all(function (req, res) {
            //  log some route info and set the request options
            requestHelper.logRoute(req);
            var opts = requestHelper.setOptions(req);

            // return json unless xml id requested
            opts.headers.accept = consts.APPLICATION_JSON;

            //  send the request
            //  TODO: NEED TO HANDLE ERRORS..expected(server 401,404) and unexpected(server 500).
            request(opts)
                .on('response', function (response) {
                    console.info("api  " + response.req.path + " reply status code: " + response.statusCode);
                })
                .pipe(res);
        });


        //Disable proxying of realm and ticket requests via the node webserver
        app.route(['/api/:version/realms*', '/api/:version/ticket*']).all(
            function(req, res) {
                requestHelper.logRoute(req);
                res.status(404);
                res.render('404');
            }
        );

    };

}());
