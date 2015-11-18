/**
 * E2E tests for the Report Service
 * Created by klabak on 6/1/15.
 */
// jshint sub: true
// jscs:disable requireDotNotation

(function() {
    'use strict';
    // In order to manage the async nature of Protractor with a non-Angular page use the ExpectedConditions feature
    var EC = protractor.ExpectedConditions;
    //Require the e2e base class and constants modules
    var e2eBase = require('../../common/e2eBase.js')();
    var consts = require('../../../server/api/constants.js');
    //Load the page objects
    var requestSessionTicketPage = require('./requestSessionTicket.po.js');
    var requestAppsPage = require('./requestApps.po.js');
    var ReportServicePage = require('./reportService.po.js');
    describe('Report Service E2E Tests', function() {
        var app;
        var recordList;
        e2eBase.setBaseUrl(browser.baseUrl);
        e2eBase.initialize();
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved
         */
        beforeAll(function(done) {
            // Create the table schema (map object) to pass into the app generator
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['Text Field'] = {fieldType: consts.SCALAR, dataType : consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Numeric Field'] = {fieldType: consts.SCALAR, dataType : consts.NUMERIC};
            tableToFieldToFieldTypeMap['table 1']['Phone Number Field'] = {fieldType: consts.SCALAR, dataType : consts.PHONE_NUMBER};
            //Call the basic app setup function
            e2eBase.basicSetup(tableToFieldToFieldTypeMap, 10).then(function(results) {
                //Set your global objects to use in the test functions
                app = results[0];
                recordList = results[1];
                //Finished with the promise chain so call done here
                done();
            });
        });
        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then displays the report page in the browser
         */
        it('Should load the reports page with the appropriate table report', function(done) {
            // Check that your setup completed properly (no fail fast option in beforeAll yet in Jasmine)
            // This will fast fail the test if setup did not complete properly
            if (!app || !recordList) {
                done.fail('test app / recordList was not created properly during setup');
            }
            // Gather the necessary values to make the requests via the browser
            var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            var realmId = e2eBase.recordBase.apiBase.realm.id;
            var tableId = app.tables[0].id;
            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            requestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            browser.wait(EC.visibilityOf(requestSessionTicketPage.ticketResponseBodyEl), 5000);
            // Load the requestAppsPage (shows a list of all apps and tables in a realm)
            requestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            // Wait until the page has loaded (blocking wait)
            browser.wait(EC.visibilityOf(requestAppsPage.tablesDivEl), 5000);
            // Check that we have a report for our created table
            expect(requestAppsPage.tableLinksElList.get(0).getText()).toContain(tableId);
            requestAppsPage.tableLinksElList.get(0).click();
            // Now on the reportServicePage (shows the nav with a list of reports you can load)
            // Wait until the nav has loaded
            var reportServicePage = new ReportServicePage();
            browser.wait(EC.visibilityOf(reportServicePage.navStackedEl), 5000);
            // Assert report name
            var reportName = 'Test Report';
            reportServicePage.navLinksElList.then(function(links) {
                links[1].getText(function(text) {
                    expect(text).toEqual(reportName + ' Report');
                });
            });
            // Select the report
            reportServicePage.navLinksElList.then(function(links) {
                links[1].click();
            });
            // Wait until the table has loaded
            browser.wait(EC.visibilityOf(reportServicePage.griddleContainerEl), 5000);
            // Assert column headers
            var fieldNames = ['Record ID#', 'Text Field', 'Numeric Field', 'Phone Number Field'];
            reportServicePage.getReportColumnHeaders(reportServicePage).then(function(resultArray) {
                // UI is currently using upper case to display the field names in columns
                //var upperFieldNames = e2eBase.e2eUtils.stringArrayToUpperCase(fieldNames);
                expect(resultArray).toEqual(fieldNames);
            });
            // Check all record values equal the ones we added via the API
            reportServicePage.griddleRecordElList.getText().then(function(uiRecords) {
                e2eBase.recordService.assertRecordValues(uiRecords, recordList);
                done();
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
