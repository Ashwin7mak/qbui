/**
 * E2E tests for the Report layout
 * based on reportService created by klabak on 6/1/15,
 * cmartinez2 6/21/15
 */
// jscs:disable requireDotNotation
// jshint sub: true
(function() {
    'use strict';

    //Bluebird Promise library
    var promise = require('bluebird');
    var reportServicePage = new ReportServicePage();

    describe('Report Page Layout Tests', function() {
        //var widthTest = 1025;
        //var heightTest = 1440;
        var app;
        var recordList;

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                //Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                //Get the appropriate fields out of the second table
                var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[1]);
                //Generate the record JSON objects
                var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, 10);
                //Via the API create the records, a new report
                //This is a promise chain since we need these actions to happen sequentially
                e2eBase.recordService.addRecords(app, app.tables[1], generatedRecords).then(function() {
                    e2eBase.reportService.createReport(app.id, app.tables[1].id).then(function() {
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
                                e2eBase.sleep(1000);
                                done();
                        });
                    });
                });
            });
        });

        /**
         * Before each test starts just make sure the table list div has loaded
         */
        beforeEach(function(done){
            reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function(){
                done();
            });
        });

        /**
         * Test method. Tests the app toggle widget.
         */
        it('Apps toggle should show / hide App Dashboard Links and Search widget', function(done){
            reportServicePage.tableLinksElList.then(function(links){
                // Check we have the base links and two table links present
                expect(links.length).toBe(5);
                // Check that the app search widget is hidden
                expect(reportServicePage.searchAppsDivEl.isPresent()).toBeFalsy();
                reportServicePage.clickAppToggle();
                // Check that the app search widget is visible
                expect(reportServicePage.searchAppsDivEl.isPresent()).toBeTruthy();
                reportServicePage.clickAppToggle().then(function() {
                    done();
                });
            });
        });


        /**
        * Test method. Loads the first table containing 10 fields (10 columns). The table report (griddle) width should expand past the browser size
        * to give all columns enough space to show their data.
        */
        it('Table report should expand width past the browser size to show all available data (large num columns)', function(done) {
            // Select the table
            reportServicePage.tableLinksElList.get(3).click().then(function(){
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(0).click();
                // Select the report
                reportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    // Check there is a scrollbar in the griddle table
                    var fetchRecordPromises = [];
                    fetchRecordPromises.push(reportServicePage.loadedContentEl.getAttribute('scrollWidth'));
                    fetchRecordPromises.push(reportServicePage.loadedContentEl.getAttribute('clientWidth'));
                    //When all the dimensions have been fetched, assert the values match expectations
                    promise.all(fetchRecordPromises).then(function(dimensions) {
                        expect(Number(dimensions[0])).toBeGreaterThan(Number(dimensions[1]));
                        reportServicePage.reportsBackLinkEl.click();
                        done();
                    });
                });
            });
        });

        /**
        * Test method. Loads the second table containing 3 fields (3 columns). The table report (griddle) width should expand
        * it's columns to fill the available space (and not show a scrollbar).
        */
        it('Table report should expand width to take up available space (small num of columns)', function(done) {
            // Select the table
            reportServicePage.tableLinksElList.get(4).click().then(function(){
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(1).click();
                // Select the report
                reportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    // Check there is no scrollbar in the griddle table
                    var fetchRecordPromises = [];
                    fetchRecordPromises.push(reportServicePage.loadedContentEl.getAttribute('scrollWidth'));
                    fetchRecordPromises.push(reportServicePage.loadedContentEl.getAttribute('clientWidth'));
                    //When all the dimensions have been fetched, assert the values match expectations
                    promise.all(fetchRecordPromises).then(function(dimensions) {
                        expect(Number(dimensions[0])).not.toBeGreaterThan(Number(dimensions[1]));
                        reportServicePage.reportsBackLinkEl.click();
                        done();
                    });
                });
            });
        });

        //TODO: Should use a data provider here see recordApi.currency.integration.spec.js for an example
        /**
        * Test method. The left hand nav should shrink responsively across the 4 breakpoints as the browser is re-sized
        */
        it('Left hand nav should shrink responsively', function(done) {
            // Select the table
            reportServicePage.tableLinksElList.get(3).click().then(function(){
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(0).click();
                // Select the report
                reportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    // Resize browser at different widths to check responsiveness
                    e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.XLARGE_BP_WIDTH).then(function() {
                        reportServicePage.assertNavProperties('xlarge', true, '399');
                    }).then(function() {
                        e2eBase.resizeBrowser(e2eConsts.LARGE_BP_WIDTH, e2eConsts.XLARGE_BP_WIDTH).then(function() {
                            reportServicePage.assertNavProperties('large', true, '299');
                        }).then(function() {
                            e2eBase.resizeBrowser(e2eConsts.MEDIUM_BP_WIDTH, e2eConsts.XLARGE_BP_WIDTH).then(function() {
                                reportServicePage.assertNavProperties('medium', true, '199');
                            }).then(function() {
                                e2eBase.resizeBrowser(e2eConsts.SMALL_BP_WIDTH, e2eConsts.XLARGE_BP_WIDTH).then(function() {
                                    reportServicePage.assertNavProperties('small', false, '0');
                                    e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                                        reportServicePage.reportsBackLinkEl.click();
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        //TODO: Should use a data provider here see recordApi.currency.integration.spec.js for an example
        /**
         * Test method. The left hand nav should expand responsively across the 4 breakpoints as the browser is re-sized
         */
        it('Left hand nav should expand responsively', function(done) {
            // Select the table
            reportServicePage.tableLinksElList.get(3).click().then(function(){
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(0).click();
                // Select the report
                reportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    // Resize browser at different widths to check responsiveness
                    e2eBase.resizeBrowser(e2eConsts.SMALL_BP_WIDTH, e2eConsts.XLARGE_BP_WIDTH).then(function() {
                        reportServicePage.assertNavProperties('small', false, '0');
                    }).then(function() {
                        e2eBase.resizeBrowser(e2eConsts.MEDIUM_BP_WIDTH, e2eConsts.XLARGE_BP_WIDTH).then(function() {
                            reportServicePage.assertNavProperties('medium', true, '199');
                        }).then(function() {
                            e2eBase.resizeBrowser(e2eConsts.LARGE_BP_WIDTH, e2eConsts.XLARGE_BP_WIDTH).then(function() {
                                reportServicePage.assertNavProperties('large', true, '299');
                            }).then(function() {
                                e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.XLARGE_BP_WIDTH).then(function() {
                                    reportServicePage.assertNavProperties('xlarge', true, '399');
                                    reportServicePage.reportsBackLinkEl.click();
                                    done();
                                });
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
