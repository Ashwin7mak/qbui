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
    //Bluebird Promise library
    var promise = require('bluebird');
    //Load the page objects
    var requestSessionTicketPage = require('./requestSessionTicket.po.js');
    var requestReportPage = require('./requestReport.po.js');
    var reportServicePage = require('./reportService.po.js');
    describe('Report Layout Tests', function() {
        var app;
        var recordList;
        var widthTests = [1024, 640, 1280];
        var heightTests = 2024;
        e2eBase.setBaseUrl(browser.baseUrl);
        e2eBase.initialize();
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved (should be fixed in newest version)
         */
        beforeAll(function(done) {
            //Create the table schema (map object) to pass into the app generator
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Rating Field'] = {fieldType: consts.SCALAR, dataType : consts.RATING};
            tableToFieldToFieldTypeMap['table 1']['Phone Number Field'] = {fieldType: consts.SCALAR, dataType : consts.PHONE_NUMBER};
            tableToFieldToFieldTypeMap['table 1']['Numeric'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
            tableToFieldToFieldTypeMap['table 1']['Currency'] = {fieldType: consts.SCALAR, dataType : consts.CURRENCY};
            tableToFieldToFieldTypeMap['table 1']['Percent'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};
            tableToFieldToFieldTypeMap['table 1']['Url'] = {fieldType: consts.SCALAR, dataType: consts.URL};
            tableToFieldToFieldTypeMap['table 1']['Duration'] = {fieldType: consts.SCALAR, dataType : consts.DURATION};
            tableToFieldToFieldTypeMap['table 1']['Email'] = {fieldType: consts.SCALAR, dataType : consts.EMAIL_ADDRESS};
            tableToFieldToFieldTypeMap['table 1']['Rating'] = {fieldType: consts.SCALAR, dataType: consts.RATING};
            //Generate the app JSON object
            var generatedApp = e2eBase.appService.generateAppFromMap(tableToFieldToFieldTypeMap);
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
                            //End of the promise chain so call done here so Protractor can stop waiting;
                            done();
                        }).catch(function(error) {
                            console.error(JSON.stringify(error));
                            throw new Error('Error during test setup:' + error);
                        });
                    });
                });
            });
        });
        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then runs / displays the report in the browser
         */
        it('Should have liquid size behavior on the grid Report page', function(done) {
            //Check that your setup completed properly (no fail fast option in beforeAll yet in Jasmine)
            //This will fast fail the test if setup did not complete properly
            if (!app || !recordList) {
                done.fail('test app / recordList was not created properly during setup');
            }
            //Gather the necessary values to make the requests via the browser
            var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            var realmId = e2eBase.recordBase.apiBase.realm.id;
            var tableId = app.tables[0].id;
            //Get a session ticket for that subdomain and realmId (stores it in the browser)
            requestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            //Load the requestReportPage (shows a list of all the reports for an app)
            requestReportPage.get(e2eBase.getRequestReportPageEndpoint(realmName));
            //Assert that we have a report for our created table
            expect(requestReportPage.firstReportLinkEl.getText()).toContain(tableId);
            //Select the report to load it in the browser
            requestReportPage.firstReportLinkEl.click();
            //Define the window size
            e2eBase.resizeBrowser(widthTests[0], heightTests);
            //Assert columns fill width
            promise.props(reportServicePage.getDimensions()).then(function(result) {
                reportServicePage.validateGridDimensions(result);
            }).then(function() {
                //Resize window smaller and recheck
                e2eBase.resizeBrowser(widthTests[1], heightTests).then(function() {
                    e2eBase.sleep(browser.params.largeSleep);
                    promise.props(reportServicePage.getDimensions()).then(function(result) {
                        reportServicePage.validateGridDimensions(result);
                    }).then(function() {
                        //Resize window larger and recheck
                        e2eBase.resizeBrowser(widthTests[2], heightTests).then(function() {
                            e2eBase.sleep(browser.params.mediumSleep);
                            promise.props(reportServicePage.getDimensions(reportServicePage)).then(function(result) {
                                reportServicePage.validateGridDimensions(result);
                                done();
                            });
                        });
                    });
                });
            });
        });
        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());