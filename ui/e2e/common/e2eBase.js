/**
 * e2e base module that initializes the domain service modules as well as the base class defined in the server layer
 * Currently recordApi.base.js is the server module which communicates with the Java API.
 * This module needs to be 'required' by all Protractor tests (make sure to run the initialize function and set the baseUrl).
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    module.exports = function(config) {
        var recordBase = require('../../server/api/test/recordApi.base.js')(config);
        var e2eUtils = require('./e2eUtils.js');
        var appService = require('./services/appService.js');
        var recordService = require('./services/recordService.js');
        var tableService = require('./services/tableService.js');
        var reportService = require('./services/reportService.js');
        var e2eBase = {
            //Delegate to recordBase to initialize
            recordBase : recordBase,
            initialize : function() {
                recordBase.initialize();
            },
            //Set the baseUrl we want to use to reach out for testing
            setBaseUrl : function(baseUrlConfig) {
                recordBase.setBaseUrl(baseUrlConfig);
            },
            //Initialize the service modules to use the same base class
            appService : appService(recordBase),
            recordService : recordService(recordBase),
            tableService : tableService(),
            reportService : reportService(recordBase),
            //Initialize the utils class
            e2eUtils : e2eUtils(),
            //Common variables
            ticketEndpoint : recordBase.apiBase.resolveTicketEndpoint(),
            //Checks for any JS errors in the browser, resets the browser window size and cleans up the test realm and app
            cleanup : function(done) {
                //Checks for any JS errors in the browser console
                //browser.manage().logs().get('browser').then(function(browserLog) {
                //    // TODO: Errors in the console need to fix
                //    //expect(browserLog.length).toEqual(0);
                //    if (browserLog.length) {
                //        console.error('Browser console had errors: ' + JSON.stringify(browserLog));
                //    }
                //});
                //Reset the browser size (note this doesn't work for Chrome on Mac OSX, a known bug - it will only max height)
                //browser.driver.manage().window().maximize();
                //Cleanup the realm and app
                e2eBase.recordBase.apiBase.cleanup().then(function() {
                    done();
                });
            },
            //Helper method to get the proper URL for loading the dashboard page containing a list of apps and tables for a realm
            getRequestAppsPageEndpoint : function(realmName) {
                var requestAppsPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/apps/');
                return requestAppsPageEndPoint;
            },
            //Get the proper URL for loading the session ticket page in the browser
            getSessionTicketRequestEndpoint : function(realmName, realmId, ticketEndpoint) {
                var sessionTicketRequestEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, ticketEndpoint + realmId);
                return sessionTicketRequestEndPoint;
            },
            //Resize the browser window to the given pixel width and height. Returns a promise
            resizeBrowser : function(width, height) {
                var deferred = promise.pending();
                browser.driver.manage().window().setSize(width, height).then(function() {
                    deferred.resolve();
                });
                return deferred.promise;
            },
            basicSetup : function(tableToFieldToFieldTypeMap, numberOfRecords) {
                var deferred = promise.pending();
                //Generate the app JSON object
                var generatedApp = e2eBase.appService.generateAppFromMap(tableToFieldToFieldTypeMap);
                //Create the app via the API
                e2eBase.appService.createApp(generatedApp).then(function(createdApp) {
                    //Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[0]);
                    //Generate the record JSON objects
                    var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, numberOfRecords);
                    //Via the API create the records, a new report, then run the report.
                    //This is a promise chain since we need these actions to happen sequentially
                    e2eBase.recordService.addRecords(createdApp, createdApp.tables[0], generatedRecords).then(function() {
                        e2eBase.reportService.createReport(createdApp.id, createdApp.tables[0].id).then(function(reportId) {
                            e2eBase.reportService.runReport(createdApp.id, createdApp.tables[0].id, reportId).then(function(reportRecords) {
                                //Return back the created app and records
                                //Pass it back in an array as promise.resolve can only send back one object
                                var appAndRecords = [createdApp, reportRecords];
                                deferred.resolve(appAndRecords);
                            }).catch(function(error) {
                                console.error(JSON.stringify(error));
                                deferred.reject(error);
                            });
                        });
                    });
                });
                return deferred.promise;
            },
            //Helper method to sleep a specified number of seconds
            sleep : function(ms) {
                browser.driver.sleep(ms);
            }
        };
        return e2eBase;
    };
}());
