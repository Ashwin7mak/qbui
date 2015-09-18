/**
 * Report service module which contains methods for generating app JSON objects and interacting with the Node server layer
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    module.exports = function(recordBase) {
        var reportService = {
            /**
             * Generates a report and creates it in a table via the API. Not supplying a query string
             * will generate a 'list all' report. Returns a promise.
             */
            // TODO: QBSE-13518 Write a report generator in the test_generators package
            createReport: function(app) {
                var deferred = promise.pending();
                var reportJSON = {
                    name      : 'Test Report',
                    type      : 'TABLE',
                    ownerId   : '10000',
                    hideReport: false
                    //"query": "{'3'.EX.'1'}"
                };
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);

                // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
                recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
                    //console.log('Report create result');
                    var parsed = JSON.parse(result.body);
                    var id = parsed.id;
                    deferred.resolve(id);
                }).catch(function(error) {
                    console.log(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            /**
             * Helper function that will run an existing report in a table via the API. Returns a promise.
             */
            runReport: function(app, reportId) {
                var deferred = promise.pending();
                var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id, reportId);
                var runReportEndpoint = reportsEndpoint + '/results';
                recordBase.apiBase.executeRequest(runReportEndpoint, 'GET').then(function(result) {
                    //console.log('Report create result');
                    var responseBody = JSON.parse(result.body);
                    //console.log(parsed);
                    deferred.resolve(responseBody.records);
                }).catch(function(error) {
                    console.log(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        };
        return reportService;
    };
}());