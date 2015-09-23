/**
 * E2E tests for the Report Service
 * Created by klabak on 6/1/15.
 */
// jshint sub: true
// jscs:disable requireDotNotation

(function() {
    'use strict';
    //Require the e2e base class and constants modules
    var e2eBase = require('../../common/e2eBase.js')();
    var consts = require('../../../server/api/constants.js');
    //Require the generator modules in the Server layer
    var appGenerator = require('../../../test_generators/app.generator.js');
    //Bluebird Promise library
    var promise = require('bluebird');
    describe('Report Service E2E Tests', function() {
        var setupDone = false;
        var cleanupDone = false;
        var app;
        var recordList;
        e2eBase.setBaseUrl(browser.baseUrl);
        e2eBase.initialize();
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         *
         * We want this method to act like a beforeSuite hence the use of setupDone (beforeSuite has been added in newer versions of Jasmine).
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved (should be fixed in newest version)
         */
        beforeEach(function(done) {
            if (!setupDone) {
                // Create the table schema (map object) to pass into the app generator
                var tableToFieldToFieldTypeMap = {};
                tableToFieldToFieldTypeMap['table 1'] = {};
                tableToFieldToFieldTypeMap['table 1']['Text Field'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.TEXT
                };
                tableToFieldToFieldTypeMap['table 1']['Numeric Field'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.NUMERIC
                };
                tableToFieldToFieldTypeMap['table 1']['Phone Number Field'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.PHONE_NUMBER
                };
                //Generate the app JSON object
                var generatedApp = appGenerator.generateAppWithTablesFromMap(tableToFieldToFieldTypeMap);
                //Create the app via the API
                e2eBase.appService.createApp(generatedApp).then(function(createdApp) {
                    //Set your global app object to use in the actual test method
                    app = createdApp;
                    //Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[0]);
                    //Generate the record JSON objects
                    var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, 10);
                    //Via the API create the records, a new report, then run the report.
                    //This is a promise chain since we need these actions to happen sequentially
                    e2eBase.recordService.addRecords(createdApp, createdApp.tables[0], generatedRecords).then(function() {
                        e2eBase.reportService.createReport(app).then(function(reportId) {
                            e2eBase.reportService.runReport(app, reportId).then(function(reportRecords) {
                                //console.log('Here are the records returned from your API report:');
                                //console.log(reportRecords);
                                recordList = reportRecords;
                                //Setup complete so set the global var so we don't run setup again
                                setupDone = true;
                                //End of the promise chain so call done here so Protractor can stop waiting;
                                done();
                            }).catch(function(error) {
                                console.log(JSON.stringify(error));
                                promise.delayed(30).then(function() {
                                    done();
                                });
                                throw new Error('Error during test setup:' + error);
                            });
                        });
                    });
                });
            } else {
                done();
            }
        });
        //TODO: Move this function into the PO
        /**
         * Helper function that will get all of the field column headers from the report. Returns an array of strings.
         */
        function getReportColumnHeaders(reportServicePage) {
            var deferred = promise.pending();
            reportServicePage.columnHeaderElList.then(function(elements) {
                var fetchTextPromises = [];
                for (var i = 0; i < elements.length; i++) {
                    fetchTextPromises.push(elements[i].getAttribute('innerText'));
                }
                Promise.all(fetchTextPromises).then(function(colHeaders) {
                    var fieldColHeaders = [];
                    colHeaders.forEach(function(headerText) {
                        // The getText call above is returning the text value with a new line char on the end, need to remove it
                        var subText = headerText.replace(/(\r\n|\n|\r)/gm, '');
                        fieldColHeaders.push(subText.trim());
                    });
                    deferred.resolve(fieldColHeaders);
                });
            });
            return deferred.promise;
        }
        //// TODO: Move into e2eUtils class
        ///**
        // * Helper function that will convert an array of strings to uppercase
        // */
        //function stringArrayToUpperCase(array) {
        //    var upperArray = [];
        //    array.forEach(function(lowerString) {
        //        var res = lowerString.toUpperCase();
        //        upperArray.push(res);
        //    });
        //    return upperArray;
        //}
        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then runs / displays the report page in the browser
         */
        it('Should load the reports page with the appropriate table report', function() {
            // Check that your setup completed properly
            // Newer versions of Jasmine allow you to fail fast if your setup fails
            expect(app).not.toBe(null);
            expect(recordList).not.toBe(null);
            // Load the page objects
            var requestReportPage = require('./requestReport.po.js');
            var reportServicePage = require('./reportService.po.js');
            // Gather the necessary values to make the requests via the browser
            var ticketEndpoint = e2eBase.recordBase.apiBase.resolveTicketEndpoint();
            var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            var realmId = e2eBase.recordBase.apiBase.realm.id;
            //var appId = app.id;
            var tableId = app.tables[0].id;
            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            var sessionTicketRequest = e2eBase.recordBase.apiBase.generateFullRequest(realmName, ticketEndpoint + realmId);
            // This is a Non-Angular page, need to set this otherwise Protractor will wait forever for Angular to load
            browser.ignoreSynchronization = true;
            browser.get(sessionTicketRequest);
            browser.ignoreSynchronization = false;
            // Load the requestReportPage
            var requestReportPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbapp#//');
            browser.get(requestReportPageEndPoint);
            browser.driver.sleep(2000);
            // Check that we have a report for our created table
            expect(requestReportPage.firstReportLinkEl.getText()).toContain(tableId);
            requestReportPage.firstReportLinkEl.click();
            // Now on the Reports Service page
            browser.driver.sleep(10000);
            // Assert report name
            var reportName = 'Test Report';
            reportServicePage.reportTitleEl.getText(function(text) {
                expect(text).toEqual(reportName + ' Report');
            });
            // Assert column headers
            var fieldNames = ['Record ID#', 'Text Field', 'Numeric Field', 'Phone Number Field'];
            getReportColumnHeaders(reportServicePage).then(function(resultArray) {
                // UI is currently using upper case to display the field names in columns
                var upperFieldNames = e2eBase.e2eUtils.stringArrayToUpperCase(fieldNames);
                expect(resultArray).toEqual(upperFieldNames);
            });
            // Check all record values equal the ones we added via the API
            reportServicePage.recordElList.getText().then(function(uiRecords) {
                e2eBase.recordService.assertRecordValues(uiRecords, recordList);
            });
        });
        /**
         * Cleanup the test realm after all tests in the block. Same hack as in the setup method so it only runs once
         */
        afterEach(function(done) {
            // Checks for any JS errors in the browser console
            browser.manage().logs().get('browser').then(function(browserLog) {
                expect(browserLog.length).toEqual(0);
                if (browserLog.length) {
                    console.error('browser log: ' + JSON.stringify(browserLog));
                }
            });
            // Cleanup the realm when finished
            if (!cleanupDone) {
                e2eBase.recordBase.apiBase.cleanup().then(function() {
                    cleanupDone = false;
                    done();
                });
            } else {
                done();
            }
        });
    });
}());