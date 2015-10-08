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
    var requestAppsPage = require('./requestApps.po.js');
    var reportServicePage = require('./reportService.po.js');
    describe('Report Layout Tests', function() {
        var app;
        var widthTests = [1024, 640, 1280];
        var heightTests = 2024;
        e2eBase.setBaseUrl(browser.baseUrl);
        e2eBase.initialize();
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved
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
            //Call the basic app setup function
            e2eBase.basicSetup(tableToFieldToFieldTypeMap, 10).then(function(results) {
                //Set your global objects to use in the test functions
                app = results[0];
                //Finished with the promise chain so call done here
                done();
            });
        });
        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then runs / displays the report in the browser
         */
        it('Should have liquid size behavior on the grid Report page', function(done) {
            //Check that your setup completed properly
            //There's no fail fast option using beforeAll yet in Jasmine to prevent other tests from running
            //This will fail the test if setup did not complete properly so at least it doesn't run
            if (!app) {
                done.fail('test app / recordList was not created properly during setup');
            }
            //Gather the necessary values to make the requests via the browser
            var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            var realmId = e2eBase.recordBase.apiBase.realm.id;
            var tableId = app.tables[0].id;
            //Get a session ticket for that subdomain and realmId (stores it in the browser)
            requestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            //Load the requestAppsPage (shows a list of all the apps and tables in a realm)
            requestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            //Assert that we have a report for our created table
            expect(requestAppsPage.firstReportLinkEl.getText()).toContain(tableId);
            //Select the report to load it in the browser
            requestAppsPage.firstReportLinkEl.click();
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