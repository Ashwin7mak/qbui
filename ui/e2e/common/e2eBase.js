/**
 * Integration base module that defines common locators / actions / functions to be used by all Protractor tests
 * Created by klabak on 4/15/15.
 */

(function() {
    'use strict';
    // Bluebird Promise library
    var promise = require('bluebird');
    // Node.js assert library
    //var assert = require('assert');
    module.exports = function(config) {
        var recordBase = require('../../server/api/test/recordApi.base.js')(config);
        var appService = require('./appService.js');
        var recordService = require('./recordService.js');
        var tableService = require('./tableService.js');
        var init;
        if (config !== undefined) {
            init = recordBase.initialize();
        }
        var e2eBase = {
            recordBase : recordBase,
            //delegate to recordBase to initialize
            initialize: function() {
                init = recordBase.initialize();
            },
            //set the baseUrl we want to use to reach out for testing
            setBaseUrl: function(baseUrlConfig) {
                recordBase.setBaseUrl(baseUrlConfig);
            },
            // Initialize the service modules to use the same base class
            appService : appService(recordBase),
            recordService : recordService(recordBase),
            tableService : tableService(recordBase),
            /**
             * Generates a report and creates it in a table via the API. Returns a promise.
             */
            // TODO: QBSE-13518 Write a report generator
            createReport: function(app) {
                var deferred = promise.pending();
                var reportJSON = {
                    name      : 'Test Report',
                    type      : 'TABLE',
                    ownerId   : '10000',
                    hideReport: false
                    //"query": "{'3'.EX.'1'}"
                };
                var reportsEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);

                // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
                e2eBase.recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
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
             * Helper function that will run an existing report in a table. Returns a promise.
             */
            runReport: function(app, reportId) {
                var deferred = promise.pending();
                var reportsEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id, reportId);
                var runReportEndpoint = reportsEndpoint + '/results';
                e2eBase.recordBase.apiBase.executeRequest(runReportEndpoint, 'GET').then(function(result) {
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
        return e2eBase;
    };
}());