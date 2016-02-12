/**
 * E2E tests for the Report Service
 * Created by klabak on 6/1/15.
 */
// jshint sub: true
// jscs:disable requireDotNotation

(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportServicePage = new ReportServicePage();

    describe('Report Service E2E Tests', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;
        var clientWidths = [e2eConsts.XLARGE_BP_WIDTH, e2eConsts.LARGE_BP_WIDTH, e2eConsts.MEDIUM_BP_WIDTH, e2eConsts.SMALL_BP_WIDTH];
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                // Gather the necessary values to make the requests via the browser
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));

                // Wait for the leftNav to load
                ReportServicePage.waitForElement(ReportServicePage.appsListDivEl).then(function() {
                    // Select the app
                    ReportServicePage.appLinksElList.get(0).click();
                    // Select the table
                    ReportServicePage.tableLinksElList.get(3).click();
                    // Open the reports list
                    ReportServicePage.reportHamburgersElList.get(0).click();
                    // Wait for the report list to load
                    ReportServicePage.waitForElement(ReportServicePage.reportsListDivEl).then(function() {
                        // Select the report
                        ReportServicePage.reportLinksElList.get(0).click();
                        // Make sure the table report has loaded
                        ReportServicePage.waitForElement(ReportServicePage.loadedContentEl).then(function() {
                            done();
                        });
                    });
                });
            });
        });

        /**
         * Before each test starts just make sure the report list has loaded
         */
        beforeEach(function(done) {
            ReportServicePage.waitForElement(ReportServicePage.reportsListDivEl).then(function() {
                done();
            });
        });

        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then displays the report page in the browser
         */
        it('Should load the reports page with the appropriate table report and verify the fieldNames and records', function() {
            // Assert report name
            ReportServicePage.reportLinksElList.then(function(links) {
                links[0].getText().then(function(text) {
                    expect(text).toEqual('Test Report');
                });
            });
            // Select the report
            ReportServicePage.reportLinksElList.then(function(links) {
                links[0].click();
            });
            // Wait until the table has loaded
            ReportServicePage.waitForElement(ReportServicePage.loadedContentEl).then(function() {
                // Assert column headers
                ReportServicePage.getReportColumnHeaders(ReportServicePage).then(function(resultArray) {
                    // UI is currently using upper case to display the field names in columns
                    expect(resultArray).toEqual(e2eConsts.reportFieldNames);
                });
                // Check all record values equal the ones we added via the API
                ReportServicePage.griddleRecordElList.getText().then(function(uiRecords) {
                    e2eBase.recordService.assertRecordValues(uiRecords, recordList);
                });
            });
        });

        /**
         * Test method. Test the report Stage Collapse and Expands
         */
        it('Should expand/collapse the reports stage after clicking on stage button in all breakpoints', function() {
            // Assert report name
            ReportServicePage.reportLinksElList.then(function(links) {
                links[0].getText().then(function(text) {
                    expect(text).toEqual('Test Report');
                });
            });
            // Select the report
            ReportServicePage.reportLinksElList.then(function(links) {
                links[0].click();
            });
            // Wait until report loaded
            ReportServicePage.waitForElement(ReportServicePage.loadedContentEl).then(function() {
                for (var i = 0; i < clientWidths.length; i++) {
                    console.log("The reportStage executing for " + clientWidths[i] + " breakpoint");
                    e2eBase.resizeBrowser(clientWidths[i], e2eConsts.DEFAULT_HEIGHT).then(function() {
                        // Verify that the report Stage is expanded by default
                        expect(ReportServicePage.reportStageArea.isDisplayed).toBeTruthy();
                        // Click on report Stage button to collapse the stage
                        ReportServicePage.reportStageBtn.click().then(function() {
                            e2eBase.sleep(1000);
                            expect(ReportServicePage.reportStageArea.getAttribute('clientHeight')).toMatch("0");
                            expect(ReportServicePage.reportStageArea.getAttribute('clientWidth')).toMatch("0");
                            ReportServicePage.reportStageBtn.click().then(function() {
                                e2eBase.sleep(1000);
                                expect(ReportServicePage.reportStageArea.isDisplayed).toBeTruthy();
                            });
                        });
                    });
                }
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
