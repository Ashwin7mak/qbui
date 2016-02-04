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
    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var requestAppsPage = requirePO('requestApps');
    var requestSessionTicketPage = requirePO('requestSessionTicket');

    describe('Report Service E2E Tests', function() {
        var app;
        var recordList;
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
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
            // Load the requestAppsPage (shows a list of all apps and tables in a realm)
            requestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));

            // Now on the reportServicePage (shows the nav with a list of reports you can load)
            // Wait until the nav has loaded
            var reportServicePage = new ReportServicePage();
            reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                // Select the app
                reportServicePage.appLinksElList.get(0).click();
                // Select the table
                reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function() {
                    reportServicePage.tableLinksElList.get(3).click();
                    // Open the reports list for that table
                    reportServicePage.reportHamburgersElList.get(0).click();
                    reportServicePage.waitForElement(reportServicePage.reportsListDivEl).then(function() {
                        // Assert report name
                        reportServicePage.reportLinksElList.then(function(links) {
                            links[0].getText().then(function(text) {
                                expect(text).toEqual('Test Report');
                            });
                        });

                        // Select the report
                        reportServicePage.reportLinksElList.then(function(links) {
                            links[0].click();
                        });

                        // Wait until the table has loaded
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            // Assert column headers
                            reportServicePage.getReportColumnHeaders(reportServicePage).then(function(resultArray) {
                                // UI is currently using upper case to display the field names in columns
                                //var upperFieldNames = e2eBase.e2eUtils.stringArrayToUpperCase(fieldNames);
                                expect(resultArray).toEqual(e2eConsts.reportFieldNames);
                            });
                            // Check all record values equal the ones we added via the API
                            reportServicePage.griddleRecordElList.getText().then(function(uiRecords) {
                                e2eBase.recordService.assertRecordValues(uiRecords, recordList);
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
