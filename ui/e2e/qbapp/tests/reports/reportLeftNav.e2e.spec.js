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
                    reportServicePage.appLinksElList.get(0).click();
                    // Open the reports list
                    reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function() {
                        reportServicePage.reportHamburgersElList.get(0).click();
                    });
                    // Wait for the report list to load
                    reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                        // Find and select the report
                        reportServicePage.selectReport('My Reports', 'Test Report');
                    });
                    // Make sure the table report has loaded
                    reportServicePage.waitForElement(reportServicePage.reportContainerEl).then(function() {
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

        describe('Responsiveness Test Cases', function() {
            e2eConsts.NavDimensionsDataProvider().forEach(function(testcase) {
                /**
                 * Test method. The leftNav should shrink responsively across the 4 breakpoints as the browser is re-sized
                 */
                it('LeftNav should shrink responsively from xlarge to small breakpoints.', function(done) {
                    // Resize browser at different widths to check responsiveness
                    e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                        if (testcase.breakpointSize === 'small') {
                            reportServicePage.assertNavProperties(testcase.breakpointSize, false, '0');
                            // Open the leftNav
                            reportServicePage.openLeftNav().then(function() {
                                reportServicePage.assertNavProperties(testcase.breakpointSize, true, testcase.offsetWidth).then(function() {
                                    done();
                                });
                            });
                        } else {
                            // Assert leftNav properties
                            reportServicePage.assertNavProperties(testcase.breakpointSize, true, testcase.offsetWidth).then(function() {
                                done();
                            });
                        }
                    });
                });
            });

            // Reverse the dataprovider to execute from small to xlarge
            var reverseArray = e2eConsts.NavDimensionsDataProvider().reverse();
            reverseArray.forEach(function(testcase) {
                /**
                 * Test method. The leftNav should expand responsively across the 4 breakpoints as the browser is re-sized
                 */
                it('LeftNav should expand responsively from small to xlarge breakpoints', function(done) {
                    e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                        if (testcase.breakpointSize === 'small') {
                            // Open the leftNav
                            reportServicePage.openLeftNav().then(function() {
                                // leftNav will be shown due to previous test (we want this state to be sticky)
                                reportServicePage.assertNavProperties(testcase.breakpointSize, true, testcase.offsetWidth).then(function() {
                                    done();
                                });
                            });
                        } else {
                            // Assert leftNav properties
                            reportServicePage.assertNavProperties(testcase.breakpointSize, true, testcase.offsetWidth).then(function() {
                                done();
                            });
                        }
                    });
                });
            });
        });

        e2eConsts.NavDimensionsDataProvider().forEach(function(testcase) {
            describe('Functional test cases: ' + testcase.breakpointSize + ' breakpoint', function() {
                beforeAll(function(done) {
                    // Resize the browser once per provider loop and then run all the tests below
                    e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                        done();
                    });
                });

                /**
                 * Test method. Tests the app toggle widget.
                 */
                it('LeftNav Apps toggle should show / hide App Dashboard Links and Search widget', function(done) {
                    if (testcase.breakpointSize === 'small') {
                        // Open the leftNav on small size
                        reportServicePage.navMenuEl.isDisplayed().then(function(displayed) {
                            if (!displayed) {
                                reportServicePage.clickReportHeaderHamburger();
                            }
                        });
                    }
                    reportServicePage.tableLinksElList.then(function(tableLinks) {
                        // Assert the home and user top links are present
                        reportServicePage.topLinksElList.then(function(topLinks) {
                            expect(topLinks.length).toBe(2);
                        });
                        // Check we have four table links present
                        expect(tableLinks.length).toBe(4);
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
                        reportServicePage.clickAppToggle().then(function() {
                            done();
                        });
                    });
                });

                /**
                 * Test method.Verify The elements present in leftNav across the 4 breakpoints as the browser is re-sized
                 */
                it('Verify leftNav has 2 base links and 4 table links', function(done) {
                    // On small the leftNav will be hidden on the app dashboard by default
                    if (testcase.breakpointSize === 'small') {
                        // Open the leftNav on small size
                        reportServicePage.navMenuEl.isDisplayed().then(function(displayed) {
                            if (!displayed) {
                                reportServicePage.clickReportHeaderHamburger();
                            }
                        });
                    }
                    reportServicePage.waitForElement(reportServicePage.navMenuEl).then(function() {
                        reportServicePage.tableLinksElList.then(function(links) {
                            // Assert the home and user top links are present
                            reportServicePage.topLinksElList.then(function(topLinks) {
                                expect(topLinks.length).toBe(2);
                            });
                            // Check we have the four table links present on left Nav
                            expect(links.length).toBe(4);
                            for (var i = 0; i < links.length; i++) {
                                expect(links[i].isDisplayed()).toBe(true);
                                done();
                            }
                        });
                    });
                });

                /**
                 * Test method.Verify The elements present in leftNav across the 4 breakpoints as the browser is re-sized
                 */
                it('Verify leftNav can load the reportsMenu when collapsed', function(done) {
                    //TODO: SafariDriver does not currently have an implementation for the mouseMove hover action (haven't found a workaround), need to skip this test if running Safari
                    if (browserName !== 'safari' && testcase.breakpointSize !== 'small') {
                        try {
                            // Collapse the leftNav
                            reportServicePage.waitForElementToBeClickable(reportServicePage.topNavToggleHamburgerEl).then(function() {
                                reportServicePage.topNavToggleHamburgerEl.click();
                                // Hover over the table link icon in leftNav
                                browser.actions().mouseMove(reportServicePage.tableLinksElList.get(0)).perform();
                                // Open the reportsMenu
                                reportServicePage.openReportsMenu(reportServicePage.tableLinksElList.get(0));
                                // Load report
                                // Wait for the report list to load
                                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                                    // Find and select the report
                                    reportServicePage.selectReport('My Reports', 'Test Report');
                                    done();
                                });
                            });
                        } catch (e) {
                            throw new Error(e);
                        } finally {
                            // Expand the leftNav
                            reportServicePage.waitForElementToBeClickable(reportServicePage.topNavToggleHamburgerEl).then(function() {
                                reportServicePage.topNavToggleHamburgerEl.click();
                            //    // Go back to the table homepage
                            //    reportServicePage.tableLinksElList.get(3).click();
                                done();
                            });
                        }
                    } else {
                        done();
                    }
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
