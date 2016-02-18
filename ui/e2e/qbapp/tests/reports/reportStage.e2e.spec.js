/**
 * E2E tests for the stage component on the Reports page
 * klabak 2/16/16
 */
// jscs:disable requireDotNotation
// jshint sub: true
(function() {
    'use strict';

    // Bluebird Promise library
    var Promise = require('bluebird');
    // Load the Page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();

    describe('Report Page Layout Tests', function() {
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
                reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    // Select the app
                    reportServicePage.appLinksElList.get(0).click();
                    // Select the table
                    reportServicePage.tableLinksElList.get(3).click();
                    // Open the reports list
                    reportServicePage.reportHamburgersElList.get(0).click();
                    // Wait for the report list to load
                    reportServicePage.waitForElement(reportServicePage.reportsListDivEl).then(function() {
                        // Select the report
                        reportServicePage.reportLinksElList.get(0).click();
                        // Make sure the table report has loaded
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            done();
                        });
                    });
                });
            });
        });

        /**
         * Test method. Test the report Stage Collapse and Expands
         */
        it('Should expand/collapse the reports stage after clicking on stage button in all breakpoints', function() {
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
            // Wait until report loaded
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                for (var i = 0; i < clientWidths.length; i++) {
                    console.log("The reportStage executing for " + clientWidths[i] + " breakpoint");
                    e2eBase.resizeBrowser(clientWidths[i], e2eConsts.DEFAULT_HEIGHT).then(function() {
                        // Verify that the report Stage is expanded by default
                        expect(reportServicePage.reportStageArea.isDisplayed).toBeTruthy();
                        // Click on report Stage button to collapse the stage
                        reportServicePage.reportStageBtn.click().then(function() {
                            e2eBase.sleep(1000);
                            expect(reportServicePage.reportStageArea.getAttribute('clientHeight')).toMatch("0");
                            expect(reportServicePage.reportStageArea.getAttribute('clientWidth')).toMatch("0");
                            reportServicePage.reportStageBtn.click().then(function() {
                                e2eBase.sleep(1000);
                                expect(reportServicePage.reportStageArea.isDisplayed).toBeTruthy();
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
