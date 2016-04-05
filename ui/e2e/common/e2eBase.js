/**
 * e2e base module that initializes the domain service modules as well as the base class defined in the server layer
 * Currently recordApi.base.js is the server module which communicates with the Java API.
 * This module needs to be 'required' by all Protractor tests (make sure to run the initialize function and set the baseUrl).
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    module.exports = function(config) {
        var recordBase = require('../../server/api/test/recordApi.base.js')(config);
        var e2eUtils = require('./e2eUtils.js');
        var appService = require('./services/appService.js');
        var recordService = require('./services/recordService.js');
        var tableService = require('./services/tableService.js');
        var reportService = require('./services/reportService.js');
        var e2eBase = {
            // Delegate to recordBase to initialize
            recordBase: recordBase,
            // Create a realm
            setUp: function() {
                this.setBaseUrl(browser.baseUrl);
                // Define the window size
                e2eBase.resizeBrowser(e2eConsts.LARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT);
                this.initialize();
            },
            initialize: function() {
                recordBase.initialize();
            },
            // Set the baseUrl we want to use to reach out for testing
            setBaseUrl: function(baseUrlConfig) {
                recordBase.setBaseUrl(baseUrlConfig);
            },
            // Initialize the service modules to use the same base class
            appService: appService(recordBase),
            recordService: recordService(recordBase),
            tableService: tableService(),
            reportService: reportService(recordBase),
            // Initialize the utils class
            e2eUtils: e2eUtils(),
            // Common variables
            ticketEndpoint: recordBase.apiBase.resolveTicketEndpoint(),
            // Checks for any JS errors in the browser, resets the browser window size and cleans up the test realm and app
            cleanup: function(done) {
                //Checks for any JS errors in the browser console
                //browser.manage().logs().get('browser').then(function(browserLog) {
                //    // TODO: Errors in the console need to fix
                //    //expect(browserLog.length).toEqual(0);
                //    if (browserLog.length) {
                //        console.error('Browser console had errors: ' + JSON.stringify(browserLog));
                //    }
                //});
                //Cleanup the realm and app
                e2eBase.recordBase.apiBase.cleanup().then(function() {
                    done();
                });
            },
            // Helper method to get the proper URL for loading the dashboard page containing a list of apps and tables for a realm
            getRequestAppsPageEndpoint: function(realmName) {
                var requestAppsPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/apps/');
                return requestAppsPageEndPoint;
            },
            // Helper method to get the proper URL for loading the reports page for particular app and particular table for a realm
            getRequestReportsPageEndpoint: function(realmName, appId, tableId, reportId) {
                var requestReportsPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/app/' + appId + '/table/' + tableId + '/report/' + reportId + '');
                return requestReportsPageEndPoint;
            },
            // Get the proper URL for loading the session ticket page in the browser
            getSessionTicketRequestEndpoint: function(realmName, realmId, ticketEndpoint) {
                var sessionTicketRequestEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, ticketEndpoint + realmId);
                return sessionTicketRequestEndPoint;
            },
            // Resize the browser window to the given pixel width and height. Returns a promise
            resizeBrowser: function(width, height) {
                var deferred = Promise.pending();
                browser.driver.manage().window().getSize().then(function(dimension) {
                    // Currently our breakpoints only change when browser width is changed so don't need to check height (yet)
                    if (dimension.width === width) {
                        // Do nothing because we are already at the current width
                        deferred.resolve();
                    } else {
                        // Resize browser if not at same width
                        browser.driver.manage().window().setSize(width, height).then(function() {
                            e2eBase.sleep(browser.params.smallSleep).then(function() {
                                deferred.resolve();
                            });
                        });
                    }
                });
                return deferred.promise;
            },
            // Setup method that generates an application, table, report and a specified number of records
            basicSetup: function(tableToFieldToFieldTypeMap, numberOfRecords) {
                var createdApp;
                e2eBase.setUp();
                var deferred = Promise.pending();
                // Generate the app JSON object
                var generatedApp = e2eBase.appService.generateAppFromMap(tableToFieldToFieldTypeMap);
                // Create the app via the API
                e2eBase.appService.createApp(generatedApp).then(function(app) {
                    createdApp = app;
                    // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[0]);
                    // Generate the record JSON objects
                    var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, numberOfRecords);
                    // Via the API create the records, a new report, then run the report.
                    return e2eBase.recordService.addRecords(createdApp, createdApp.tables[0], generatedRecords);
                }).then(function() {
                    //TODO: Creating / running a report can be run async so break it out of this chain into a separate function
                    return e2eBase.reportService.createReport(createdApp.id, createdApp.tables[0].id);
                }).then(function(reportId) {
                    return e2eBase.reportService.runReport(createdApp.id, createdApp.tables[0].id, reportId);
                }).then(function(reportRecords) {
                    // Return back the created app and records
                    // Pass it back in an array as promise.resolve can only send back one object
                    var appAndRecords = [createdApp, reportRecords];
                    deferred.resolve(appAndRecords);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            // Setup method for the reports spec files. Creates the table / field mapping to be generated by basicSetup
            reportsBasicSetUp: function() {
                var deferred = Promise.pending();
                var app;
                var recordList;
                // Create the table schema (map object) to pass into the app generator
                var tableToFieldToFieldTypeMap = {};
                tableToFieldToFieldTypeMap['table 1'] = {};
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[1]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TEXT
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[2]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.NUMERIC
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[3]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.CURRENCY
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[4]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.PERCENT
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[5]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.RATING
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[6]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[7]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE_TIME
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[8]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TIME_OF_DAY
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[9]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DURATION
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[10]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.CHECKBOX
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[11]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.PHONE_NUMBER
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[12]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.EMAIL_ADDRESS
                };
                tableToFieldToFieldTypeMap['table 1'][e2eConsts.reportFieldNames[13]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.URL
                };
                tableToFieldToFieldTypeMap['table 2'] = {};
                tableToFieldToFieldTypeMap['table 2'][e2eConsts.reportFieldNames[2]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TEXT
                };
                tableToFieldToFieldTypeMap['table 2'][e2eConsts.reportFieldNames[6]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE
                };
                tableToFieldToFieldTypeMap['table 2'][e2eConsts.reportFieldNames[12]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.PHONE_NUMBER
                };
                tableToFieldToFieldTypeMap['table 3'] = {};
                tableToFieldToFieldTypeMap['table 3'][e2eConsts.reportFieldNames[1]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TEXT
                };
                tableToFieldToFieldTypeMap['table 3'][e2eConsts.reportFieldNames[6]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE
                };
                tableToFieldToFieldTypeMap['table 3'][e2eConsts.reportFieldNames[7]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE_TIME
                };
                tableToFieldToFieldTypeMap['table 3'][e2eConsts.reportFieldNames[10]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.CHECKBOX
                };
                tableToFieldToFieldTypeMap['table 4'] = {};
                tableToFieldToFieldTypeMap['table 4'][e2eConsts.reportFieldNames[1]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TEXT
                };
                // Call the basic app setup function
                e2eBase.basicSetup(tableToFieldToFieldTypeMap, 10).then(function(results) {
                    // Set your global objects to use in the test functions
                    app = results[0];
                    recordList = results[1];
                    // Return back the created app and records
                    // Pass it back in an array as promise.resolve can only send back one object
                    var appAndRecords = [app, recordList, e2eConsts.reportFieldNames];
                    deferred.resolve(appAndRecords);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            // Helper method to sleep a specified number of seconds
            sleep: function(ms) {
                var deferred = Promise.pending();
                try {
                    browser.driver.sleep(ms);
                    deferred.resolve();
                } catch (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                }
                return deferred.promise;
            }
        };
        return e2eBase;
    };
}());
