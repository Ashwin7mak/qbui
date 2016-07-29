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

    describe('Report Stage Tests', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;

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
                    //go to report page directly.
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                    // Make sure the table report has loaded
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        done();
                    });
                });
            });
        });

        /**
         * Before each test starts just make sure the report has loaded
         */
        beforeEach(function(done) {
            // Wait until report loaded
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                done();
            });
        });

        /**
         * Test methods. Test that the reportStage collapses and expands
         */
        it('Should expand/collapse the reports stage', function(done) {
            if (breakpointSize !== 'small') {
                // Verify that the report Stage is expanded by default
                reportServicePage.waitForElement(reportServicePage.reportStageBtn).then(function() {
                    // Click on report Stage button to collapse the stage
                    reportServicePage.reportStageBtn.click().then(function() {
                        // Sleep needed for animation of stage
                        e2eBase.sleep(browser.params.smallSleep);
                        expect(reportServicePage.reportStageArea.getAttribute('clientHeight')).toMatch("0");
                        expect(reportServicePage.reportStageArea.getAttribute('clientWidth')).toMatch("0");
                        reportServicePage.reportStageBtn.click().then(function() {
                            // Sleep needed for animation of stage
                            e2eBase.sleep(browser.params.smallSleep);
                            expect(reportServicePage.reportStageArea.isDisplayed()).toBeTruthy();
                            done();
                        });
                    });
                });
            } else if (breakpointSize === 'small') {
                // Verify stage is present in the DOM but not displayed on small breakpoint
                expect(reportServicePage.reportStageContentEl.isPresent()).toBeTruthy();
                expect(reportServicePage.reportStageContentEl.isDisplayed()).toBeFalsy();
                done();
            }
        });

        //TODO: Add tests for stage content (specifically email link and link hover)

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
