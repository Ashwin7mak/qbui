/**
 * E2E tests for the topNav of the Reports page
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

    describe('Report Page Top Nav Tests', function() {
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
         * Test methods to verify all elements present / hidden in topNav depending on breakpoint
         */
        e2eConsts.NavDimensionsDataProvider().forEach(function(testcase) {
            it('Verify topNav hamburger toggle displayed on breakpoint: ' + testcase.breakpointSize, function() {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    // Verify hamburger toggle displayed in topNav and no text associated for that icon.
                    reportServicePage.waitForElement(reportServicePage.topNavDivEl).then(function() {
                        // Verify hamburger toggle is displayed in topNav
                        reportServicePage.isElementDisplayed(reportServicePage.topNavToggleHamburgerEl);
                        // Verify no text displayed beside hamburger link in topNav
                        expect(reportServicePage.topNavToggleHamburgerEl.getText()).toBeFalsy();
                    });
                });
            });

            it('Verify topNav harmony icons displayed on breakpoint: ' + testcase.breakpointSize, function() {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    // Verify harmony icons display in topNav and no text associated to them.
                    reportServicePage.waitForElement(reportServicePage.topNavDivEl).then(function() {
                        reportServicePage.topNavHarButtonsListEl.then(function(buttons) {
                            // Verify only two Harmony icons are displayed
                            expect(buttons.length).toBe(2);
                            for (var i = 0; i < buttons.length; i++) {
                                // Verify Harmony Icons displayed in topNav
                                reportServicePage.isElementDisplayed(buttons[i]);
                                // Verify no text displayed beside Harmony Icons in topNav
                                expect(buttons[i].getText()).toBeFalsy();
                            }
                        });
                    });
                });

            });

            it('Verify topNav global icons displayed/not displayed and verify text on breakpoint: ' + testcase.breakpointSize, function() {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    reportServicePage.waitForElement(reportServicePage.topNavDivEl).then(function() {
                        reportServicePage.topNavGlobalActionsListEl.then(function(navActions) {
                            expect(navActions.length).toBe(3);
                            if (testcase.browserWidth === e2eConsts.XLARGE_BP_WIDTH ||
                                testcase.browserWidth === e2eConsts.LARGE_BP_WIDTH ||
                                testcase.browserWidth === e2eConsts.MEDIUM_BP_WIDTH) {
                                // Verify global action icons is displayed in topNav
                                reportServicePage.assertGlobalActsDisplayedInTopNav();
                                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavUserGlobActEl).getText()).toBe('User');
                                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavHelpGlobActEl).getText()).toBe('Help');
                                // Assert actions are not in the leftNav
                                reportServicePage.assertGlobalActsNotDisplayedInLeftNav();
                            }
                            if (testcase.browserWidth === e2eConsts.SMALL_BP_WIDTH) {
                                // Assert actions have moved to leftNav
                                reportServicePage.assertGlobalActsDisplayedInLeftNav();
                                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.leftNavUserGlobActEl).getText()).toBe('User');
                                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.leftNavHelpGlobActEl).getText()).toBe('Help');
                                // Verify global action icons are not displayed in topNav
                                reportServicePage.assertGlobalActsNotDisplayedInTopNav();
                            }
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
