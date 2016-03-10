/**
 * E2E tests for the leftNav of the Reports page
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

    describe('Report Page Left Nav Tests', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;

        /**
         * Setup method. Calls reportsBasicSetup which will generate two tables, a set of records and a report for each.
         * Then creates them via the JAVA REST API.
         * In setup have to specify the done() callback at the end of the promise chain to let Jasmine know we are finished with async calls.
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Get the appropriate fields out of the second table
                var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[1]);
                // Generate the record JSON objects
                var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, 10);
                // Via the API create some records
                return e2eBase.recordService.addRecords(app, app.tables[1], generatedRecords);
            }).then(function() {
                //Create a new report
                return e2eBase.reportService.createReport(app.id, app.tables[1].id);
            }).then(function() {
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                // Wait for the leftNav to load
                return reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    // Select the app
                    return reportServicePage.appLinksElList.get(0).click().then(function() {
                        //Done callback to let Jasmine know we are done with our promise chain
                        done();
                    });
                });
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                done.fail('Error during test setup: ' + error.message);
            });
        });

        /**
         * Before each test starts just make sure the table list div has loaded
         */
        beforeEach(function(done) {
            reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function() {
                done();
            });
        });

        /**
         * Test method. Tests the app toggle widget.
         */
        it('LeftNav Apps toggle should show / hide App Dashboard Links and Search widget', function() {
            reportServicePage.tableLinksElList.then(function(links) {
                // Check we have the base links and two table links present
                expect(links.length).toBe(4);
                reportServicePage.clickAppToggle();
                // Check that the app search widget is hidden
                expect(reportServicePage.searchAppsDivEl.isDisplayed()).toBeFalsy();
                // Open the search apps widget
                reportServicePage.clickAppSearchToggle();
                // Check that the app search widget is visible
                expect(reportServicePage.searchAppsDivEl.isPresent()).toBeTruthy();
                // Close the search apps widget
                reportServicePage.clickAppSearchToggle();
                // Check that the app search widget is visible
                expect(reportServicePage.searchAppsDivEl.isDisplayed()).toBeFalsy();
                // Go back to the table list
                reportServicePage.clickAppToggle();
            });
        });


        e2eConsts.NavDimensionsDataProvider().forEach(function(testcase) {
            /**
             * Test method. The leftNav should shrink responsively across the 4 breakpoints as the browser is re-sized
             */
            it('LeftNav should shrink responsively from xlarge to small breakpoints', function() {
                // Resize browser at different widths to check responsiveness
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    // Select the table
                    reportServicePage.tableLinksElList.get(3).click().then(function() {
                        // Open the reports list
                        reportServicePage.reportHamburgersElList.get(0).click();
                        // Wait for the report list to load
                        reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                            // Find and select the report
                            reportServicePage.selectReport('My Reports', 'Test Report');
                        });
                        // Make sure the table report has loaded
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            reportServicePage.assertNavProperties(testcase.breakpointSize, testcase.open, testcase.offsetWidth);
                        });
                    });
                });
            });

            /**
             * Test method.Verify The elements present in leftNav across the 4 breakpoints as the browser is re-sized
             */
            it('Verify leftNav has 3 base links and 2 table links from xlarge to small breakpoints', function() {
                // Resize browser at different widths
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function(tableLinksElList) {
                    (reportServicePage.tableLinksElList).then(function(links) {
                        // Check we have the 3 base links and two table links present on left Nav
                        expect(links.length).toBe(4);
                        for (var i = 0; i < links.length; i++) {
                            expect(links[i].isDisplayed()).toBe(true);
                        }
                    });
                });
            });

            /**
             * Test method.Verify The elements present in leftNav across the 4 breakpoints as the browser is re-sized
             */
            it('Verify leftNav can load the reportsMenu when collapsed', function() {
                //TODO: SafariDriver does not currently have an implementation for the mouseMove hover action (haven't found a workaround), need to skip this test if running Safari
                if (browser.browserName !== 'safari') {
                    try {
                        // Collapse the leftNav
                        reportServicePage.waitForElement(reportServicePage.topNavToggleHamburgerEl).then(function() {
                            reportServicePage.topNavToggleHamburgerEl.click();
                            // Resize browser at different widths
                            e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function(tableLinksElList) {
                                // Hover over the table link icon in leftNav
                                browser.actions().mouseMove(reportServicePage.tableLinksElList.get(3)).perform();
                                // Open the reportsMenu
                                reportServicePage.openReportsMenu(reportServicePage.tableLinksElList.get(3));
                                // Load report
                                // Wait for the report list to load
                                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                                    // Find and select the report
                                    reportServicePage.selectReport('My Reports', 'Test Report');
                                });
                            });
                        });
                    } catch (e) {
                        throw new Error(e);
                    } finally {
                        // Expand the leftNav
                        reportServicePage.waitForElement(reportServicePage.topNavToggleHamburgerEl).then(function() {
                            reportServicePage.topNavToggleHamburgerEl.click();
                        });
                    }
                }
            });
        });

        // Reverse the dataprovider to execute from small to xlarge
        var reverseArray = e2eConsts.NavDimensionsDataProvider().reverse();
        reverseArray.forEach(function(testcase) {
            /**
             * Test method. The leftNav should expand responsively across the 4 breakpoints as the browser is re-sized
             */
            it('LeftNav should expand responsively from small to xlarge breakpoints', function() {
                e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    // Select the table
                    reportServicePage.tableLinksElList.get(3).click().then(function() {
                        // Open the reports list
                        reportServicePage.reportHamburgersElList.get(0).click();
                        // Wait for the report list to load
                        reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                            // Find and select the report
                            reportServicePage.selectReport('My Reports', 'Test Report');
                        });
                        // Make sure the table report has loaded
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            // Resize browser at different widths to check responsiveness
                            e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                                reportServicePage.assertNavProperties(testcase.breakpointSize, testcase.open, testcase.offsetWidth);
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
