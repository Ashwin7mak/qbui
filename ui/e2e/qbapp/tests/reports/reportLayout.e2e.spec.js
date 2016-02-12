/**
 * E2E tests for the Report layout
 * based on reportService created by klabak on 6/1/15,
 * cmartinez2 6/21/15
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
    var ReportServicePage = new ReportServicePage();

    describe('Report Page Layout Tests', function() {
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
                return ReportServicePage.waitForElement(ReportServicePage.appsListDivEl).then(function() {
                    // Select the app
                    return ReportServicePage.appLinksElList.get(0).click().then(function() {
                        e2eBase.sleep(1000).then(function() {
                            //Done callback to let Jasmine know we are done with our promise chain
                            done();
                        });
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
            ReportServicePage.waitForElement(ReportServicePage.tablesListDivEl).then(function() {
                done();
            });
        });

        /**
         * Test method. Tests the app toggle widget.
         */
        it('LeftNav Apps toggle should show / hide App Dashboard Links and Search widget', function() {
            ReportServicePage.tableLinksElList.then(function(links) {
                // Check we have the base links and two table links present
                expect(links.length).toBe(5);
                // Check that the app search widget is hidden
                expect(ReportServicePage.searchAppsDivEl.isPresent()).toBeFalsy();
                ReportServicePage.clickAppToggle();
                // Check that the app search widget is visible
                expect(ReportServicePage.searchAppsDivEl.isPresent()).toBeTruthy();
                ReportServicePage.clickAppToggle();
            });
        });

        /**
         * Test method. Loads the first table containing 10 fields (10 columns). The table report (griddle) width should expand past the browser size
         * to give all columns enough space to show their data.
         */
        it('Table report should expand width past the browser size to show all available data (large num columns)', function() {
            // Select the table
            ReportServicePage.tableLinksElList.get(3).click().then(function() {
                // Open the reports list
                ReportServicePage.reportHamburgersElList.get(0).click();
                // Select the report
                ReportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                ReportServicePage.waitForElement(ReportServicePage.loadedContentEl).then(function() {
                    // Check there is a scrollbar in the griddle table
                    var fetchRecordPromises = [];
                    fetchRecordPromises.push(ReportServicePage.loadedContentEl.getAttribute('scrollWidth'));
                    fetchRecordPromises.push(ReportServicePage.loadedContentEl.getAttribute('clientWidth'));
                    //When all the dimensions have been fetched, assert the values match expectations
                    Promise.all(fetchRecordPromises).then(function(dimensions) {
                        expect(Number(dimensions[0])).toBeGreaterThan(Number(dimensions[1]));
                        ReportServicePage.reportsBackLinkEl.click();
                    });
                });
            });
        });

        /**
         * Test method. Loads the second table containing 3 fields (3 columns). The table report (griddle) width should expand
         * it's columns to fill the available space (and not show a scrollbar).
         */
        it('Table report should expand width to take up available space (small num of columns)', function() {
            // Select the table
            ReportServicePage.tableLinksElList.get(4).click().then(function() {
                // Open the reports list
                ReportServicePage.reportHamburgersElList.get(1).click();
                // Select the report
                ReportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                ReportServicePage.waitForElement(ReportServicePage.loadedContentEl).then(function() {
                    // Check there is no scrollbar in the griddle table
                    var fetchRecordPromises = [];
                    fetchRecordPromises.push(ReportServicePage.loadedContentEl.getAttribute('scrollWidth'));
                    fetchRecordPromises.push(ReportServicePage.loadedContentEl.getAttribute('clientWidth'));
                    //When all the dimensions have been fetched, assert the values match expectations
                    Promise.all(fetchRecordPromises).then(function(dimensions) {
                        expect(Number(dimensions[0])).not.toBeGreaterThan(Number(dimensions[1]));
                        ReportServicePage.reportsBackLinkEl.click();
                    });
                });
            });
        });

        /**
         * Data Provider for the different breakpoints. Also contains the state of the leftNav at each size for assertion
         */
        function NavDimensionsDataProvider() {
            return [
                {
                    browserWidth: e2eConsts.XLARGE_BP_WIDTH,
                    breakpointSize: 'xlarge',
                    open: true,
                    clientWidth: '399'
                },
                {
                    browserWidth: e2eConsts.LARGE_BP_WIDTH,
                    breakpointSize: 'large',
                    open: true,
                    clientWidth: '299'
                },
                {
                    browserWidth: e2eConsts.MEDIUM_BP_WIDTH,
                    breakpointSize: 'medium',
                    open: true,
                    clientWidth: '199'
                },
                {
                    browserWidth: e2eConsts.SMALL_BP_WIDTH,
                    breakpointSize: 'small',
                    open: false,
                    clientWidth: '39'
                }
            ];
        }

        /**
         * Test method. The leftNav should shrink responsively across the 4 breakpoints as the browser is re-sized
         */
        it('LeftNav should shrink responsively from xlarge to small breakpoints', function() {
            // Select the table
            ReportServicePage.tableLinksElList.get(3).click().then(function() {
                // Open the reports list
                ReportServicePage.reportHamburgersElList.get(0).click();
                // Select the report
                ReportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                ReportServicePage.waitForElement(ReportServicePage.loadedContentEl).then(function() {
                    NavDimensionsDataProvider().forEach(function(testcase) {
                        // Resize browser at different widths to check responsiveness
                        e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                            ReportServicePage.assertNavProperties(testcase.breakpointSize, testcase.open, testcase.clientWidth);
                        });
                    });
                    // Reset back to xlarge
                    e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT);
                    ReportServicePage.reportsBackLinkEl.click();
                });
            });
        });

        /**
         * Test method. The leftNav should expand responsively across the 4 breakpoints as the browser is re-sized
         */
        it('LeftNav should expand responsively from small to xlarge breakpoints', function() {
            // Select the table
            ReportServicePage.tableLinksElList.get(3).click().then(function() {
                // Open the reports list
                ReportServicePage.reportHamburgersElList.get(0).click();
                // Select the report
                ReportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                ReportServicePage.waitForElement(ReportServicePage.loadedContentEl).then(function() {
                    // Reverse the dataprovider to execute from small to xlarge
                    var reverseArray = NavDimensionsDataProvider().reverse();
                    reverseArray.forEach(function(testcase) {
                        // Resize browser at different widths to check responsiveness
                        e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                            ReportServicePage.assertNavProperties(testcase.breakpointSize, testcase.open, testcase.clientWidth);
                        });
                    });
                });
            });
        });

        /**
         * Test method.Verify The elements present in leftNav across the 4 breakpoints as the browser is re-sized
         */
        it('Verify leftNav has 3 base links and 2 table links from xlarge to small breakpoints', function() {
            NavDimensionsDataProvider().forEach(function(testcase) {
                // Resize browser at different widths
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function(tableLinksElList) {
                    (ReportServicePage.tableLinksElList).then(function(links) {
                        // Check we have the 3 base links and two table links present on left Nav
                        expect(links.length).toBe(5);
                        for (var i = 0; i < links.length; i++) {
                            expect(links[i].isDisplayed()).toBe(true);
                            // Verify elements present on leftNav with right dimensions
                            ReportServicePage.isElementInLeftNav(links[i], testcase.clientWidth);
                        }
                    });
                });
            });
        });

        /**
         * Test method to verify all elements present in topNav
         */
        it('Verify topNav elements display/not display depending on different breakpoints', function() {
            NavDimensionsDataProvider().forEach(function(testcase) {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    // Verify Icon link display in topNav and  no text associated for that icon.
                    ReportServicePage.waitForElement(ReportServicePage.topNavLeftDivEl).then(function() {
                        // Verify icon link is displayed in topNav
                        ReportServicePage.isElementInTopNav(ReportServicePage.topNavToggleHamburgerEl);
                        // Verify no text displayed beside icon link in topNav
                        expect(ReportServicePage.topNavToggleHamburgerEl.getText()).toBeFalsy();
                    });
                    // Verify harmony icons display in topNav and no text associated to them.
                    ReportServicePage.waitForElement(ReportServicePage.topNavCenterDivEl).then(function() {
                        for (var i = 0; i < ReportServicePage.topNavHarButtonsListEl.length; i++) {
                            // Verify Harmony Icons displayed in topNav
                            ReportServicePage.isElementInTopNav(ReportServicePage.topNavHarButtonsListEl[i]);
                            // Verify no text displayed beside Harmony Icons in topNav
                            expect(ReportServicePage.topNavHarButtonsListEl[i].getText()).toBeFalsy();
                        }
                    });
                    // Verify right global icons display in topNav and verify text display depending on breakpoint.
                    ReportServicePage.waitForElement(ReportServicePage.topNavRightDivEl).then(function() {
                        ReportServicePage.topNavGlobalActionsListEl.then(function(navActions) {
                            expect(navActions.length).toBe(2);
                            for (var i = 0; i < navActions.length; i++) {
                                var textEl = navActions[i].all(by.tagName('span')).last();
                                if (testcase.clientWidth === e2eConsts.XLARGE_BP_WIDTH || testcase.clientWidth === e2eConsts.LARGE_BP_WIDTH) {
                                    // Verify global action icons is displayed in topNav
                                    ReportServicePage.isElementInTopNav(textEl);
                                    expect(ReportServicePage.getGlobalNavTextEl(ReportServicePage.topNavUserGlobActEl).getText()).toBe('User');
                                    expect(ReportServicePage.getGlobalNavTextEl(ReportServicePage.topNavHelpGlobActEl).getText()).toBe('Help');
                                }
                                if (testcase.clientWidth === e2eConsts.MEDIUM_BP_WIDTH || testcase.clientWidth === e2eConsts.SMALL_BP_WIDTH) {
                                    // Verify global action icons is not displayed in topNav
                                    ReportServicePage.isElementInTopNav(textEl);
                                }
                            }
                        });
                    });
                    // Verify the drop down toggle icon present on all breakpoints
                    ReportServicePage.waitForElement(ReportServicePage.topNavCenterDivEl).then(function() {
                        // Verify  drop down toggle icon is displayed on topNav
                        ReportServicePage.isElementInTopNav(ReportServicePage.topNavDropdownEl);
                        // Verify no text displayed beside  drop down toggle
                        expect(ReportServicePage.topNavDropdownEl.getText()).toBeFalsy();
                    });
                });
            });
        });

        /**
         * Layout test. Verify topNav is displayed above the report stage
         */
        NavDimensionsDataProvider().forEach(function(testcase) {
            it(testcase.breakpointSize + ': verify topNav is on top of report stage', function() {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    ReportServicePage.isElementOnTop(ReportServicePage.topNavDivEl, ReportServicePage.reportStageContentEl);
                });
            });
        });

        /**
         * Layout test. Verify stage is displayed above the report actions container
         */
        NavDimensionsDataProvider().forEach(function(testcase) {
            it(testcase.breakpointSize + ': verify report Stage Layout container is on top of table actions container', function() {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    ReportServicePage.isElementOnTop(ReportServicePage.reportStageContentEl, ReportServicePage.tableActionsContainerEl);
                });
            });
        });

        /**
         * Layout test. Verify report actions are displayed above the report content
         */
        NavDimensionsDataProvider().forEach(function(testcase) {
            it(testcase.breakpointSize + ': verify table actions Layout container is on top of report griddle container', function() {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    ReportServicePage.isElementOnTop(ReportServicePage.tableActionsContainerEl, ReportServicePage.griddleContainerEl);
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
