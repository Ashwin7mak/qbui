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
    var reportServicePage = new ReportServicePage();

    describe('Report Service E2E Tests', function() {
        var app;
        var recordList;
        var clientWidth = [e2eConsts.XLARGE_BP_WIDTH, e2eConsts.LARGE_BP_WIDTH, e2eConsts.MEDIUM_BP_WIDTH, e2eConsts.SMALL_BP_WIDTH];
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                // Gather the necessary values to make the requests via the browser
                var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                var realmId = e2eBase.recordBase.apiBase.realm.id;
                requestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                requestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));

                // Wait for the left nav to load
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
         * Before each test starts just make sure the report list has loaded
         */
        beforeEach(function(done) {
            reportServicePage.waitForElement(reportServicePage.reportsListDivEl).then(function() {
                done();
            });
        });

        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then displays the report page in the browser
         */
        it('Should load the reports page with the appropriate table report and verify the fieldNames and records', function(done) {

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

        /**
         * Test method: Test the report Stage Collapse and Expands
         */
        it('Should expand/collapse the reports stage after clicking on stage button in all breakpoints', function(done) {
            var i = 0;

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


                //Wait until report loaded
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    for (i = 0; i < clientWidth.length; i++) {
                        console.log("The reportStage executing for " + clientWidth[i] + " breakpoint");
                        e2eBase.resizeBrowser(clientWidth[i], e2eConsts.DEFAULT_HEIGHT).then(function() {
                            //Verify that the report Stage is expanded by default
                            expect(reportServicePage.reportStageLayout.isDisplayed).toBeTruthy();

                            //Click on report Stage button to collapse the stage
                            reportServicePage.reportStageBtn.click().then(function() {
                                e2eBase.sleep(1000);
                                //expect(reportServicePage.reportStageLayout.isPresent()).toBeFalsy();
                                expect(reportServicePage.reportStageLayout.getAttribute('clientHeight')).toMatch("0");
                                expect(reportServicePage.reportStageLayout.getAttribute('clientWidth')).toMatch("0");
                                reportServicePage.reportStageBtn.click().then(function() {
                                    e2eBase.sleep(1000);
                                    expect(reportServicePage.reportStageLayout.isDisplayed).toBeTruthy();

                                });
                            });
                        });
                    }

                    done();
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
