/**
 * E2E tests for the Report layout
 * based on reportService created by klabak on 6/1/15,
 * cmartinez2 6/21/15
 */
// jscs:disable requireDotNotation
// jshint sub: true
(function() {
    'use strict';
    //Require the e2e base class and constants modules
    var e2eBase = require('../../common/e2eBase.js')();
    var consts = require('../../../server/api/constants.js');
    //Require the generator modules in the Server layer
    var appGenerator = require('../../../test_generators/app.generator.js');
    //Bluebird Promise library
    var promise = require('bluebird');
    describe('Report Layout Tests', function() {
        var setupDone = false;
        var cleanupDone = false;
        var app;
        var recordList;
        var widthTests = [1024, 640, 1280];
        var heightTests = 2024;
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
                //Create the table schema (map object) to pass into the app generator
                var tableToFieldToFieldTypeMap = {};
                tableToFieldToFieldTypeMap['table 1'] = {};
                tableToFieldToFieldTypeMap['table 1']['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
                tableToFieldToFieldTypeMap['table 1']['Rating Field'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.RATING
                };
                tableToFieldToFieldTypeMap['table 1']['Phone Number Field'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.PHONE_NUMBER
                };
                tableToFieldToFieldTypeMap['table 1']['Numeric'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
                tableToFieldToFieldTypeMap['table 1']['Currency'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.CURRENCY
                };
                tableToFieldToFieldTypeMap['table 1']['Percent'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};
                tableToFieldToFieldTypeMap['table 1']['Url'] = {fieldType: consts.SCALAR, dataType: consts.URL};
                tableToFieldToFieldTypeMap['table 1']['Duration'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.DURATION
                };
                tableToFieldToFieldTypeMap['table 1']['Email'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.EMAIL_ADDRESS
                };
                tableToFieldToFieldTypeMap['table 1']['Rating'] = {fieldType: consts.SCALAR, dataType: consts.RATING};
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
        // TODO: Move these two functions into the PO
        function getDimensions(reportServicePage) {
            return {
                windowSize        : browser.manage().window().getSize(),
                mainSize          : reportServicePage.mainContent.getSize(),
                mainLoc           : reportServicePage.mainContent.getLocation(),
                tableContainerSize: reportServicePage.tableContainer.getSize(),
                tableContainerLoc : reportServicePage.tableContainer.getLocation(),
                lastColumnSize    : reportServicePage.lastColumn.getSize(),
                lastColumnLoc     : reportServicePage.lastColumn.getLocation()
            };
        }
        function validateGridDimensions(result) {
            var leftPadding = 10;
            var allowedVariance = 25;
            var pointOfLastColumn = result.lastColumnLoc.x + leftPadding + result.lastColumnSize.width;
            var pointOfMainContent = result.mainLoc.x + result.mainSize.width;
            var endsDiff = Math.abs(pointOfMainContent - pointOfLastColumn);
            expect(endsDiff).toBeLessThan(allowedVariance);
        }
        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then runs / displays the report in the browser
         */
        it('Should have liquid size behavior on the grid Report page', function() {
            //Check that your setup completed properly
            //Newer versions of Jasmine allow you to fail fast if your setup fails
            expect(app).not.toBe(null);
            expect(recordList).not.toBe(null);
            //Load the page objects
            var requestReportPage = require('./requestReport.po.js');
            var reportServicePage = require('./reportService.po.js');
            //Gather the necessary values to make the requests via the browser
            var ticketEndpoint = e2eBase.recordBase.apiBase.resolveTicketEndpoint();
            var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            var realmId = e2eBase.recordBase.apiBase.realm.id;
            var tableId = app.tables[0].id;
            //Define the window size
            browser.driver.manage().window().setSize(widthTests[0], heightTests);
            //Get a session ticket for that subdomain and realmId (stores it in the browser)
            var sessionTicketRequest = e2eBase.recordBase.apiBase.generateFullRequest(realmName, ticketEndpoint + realmId);
            //This is a Non-Angular page, need to set this otherwise Protractor will wait forever for Angular to load
            browser.ignoreSynchronization = true;
            browser.get(sessionTicketRequest);
            browser.ignoreSynchronization = false;
            //Load the requestReportPage
            var requestReportPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbapp#//');
            browser.get(requestReportPageEndPoint);
            //Check that we have a report for our created table
            expect(requestReportPage.firstReportLinkEl.getText()).toContain(tableId);
            requestReportPage.firstReportLinkEl.click();
            //Assert columns fill width
            promise.props(getDimensions(reportServicePage)).then(validateGridDimensions).then(function() {
                //Resize window smaller and recheck
                browser.driver.manage().window().setSize(widthTests[1], heightTests).then(function() {
                    browser.driver.sleep(40000);
                    promise.props(getDimensions(reportServicePage)).then(validateGridDimensions).then(function() {
                        //Resize window larger and recheck
                        browser.driver.manage().window().setSize(widthTests[2], heightTests).then(function() {
                            browser.driver.sleep(5000);
                            promise.props(getDimensions(reportServicePage)).then(validateGridDimensions);
                        });
                    });
                });
            });
        });
        /**
         * Cleanup the test realm after all tests in the block. Same hack as in the setup method so it only runs once
         */
        afterEach(function(done) {
            //Checks for any JS errors in the browser console
            browser.manage().logs().get('browser').then(function(browserLog) {
                expect(browserLog.length).toEqual(0);
                if (browserLog.length) {
                    console.error('browser log: ' + JSON.stringify(browserLog));
                }
            });
            if (!cleanupDone) {
                browser.driver.manage().window().maximize();
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