/**
 * E2E tests for the Report layout
 * based on reportService created by klabak on 6/1/15,
 * cmartinez2 6/21/15
 */
// jscs:disable requireDotNotation
// jshint sub: true
(function() {
    'use strict';

    // In order to manage the async nature of Protractor with a non-Angular page use the ExpectedConditions feature
    var EC = protractor.ExpectedConditions;
    //Require the e2e base class and constants modules
    var e2eBase = require('../../common/e2eBase.js')();
    var consts = require('../../../server/api/constants.js');
    //Bluebird Promise library
    var promise = require('bluebird');
    //Load the page objects
    var requestSessionTicketPage = require('./requestSessionTicket.po.js');
    var requestAppsPage = require('./requestApps.po.js');
    var ReportServicePage = require('./reportService.po.js');
    var reportServicePage = new ReportServicePage();

    describe('Report Page Layout Tests', function() {
        var widthTest = 1024;
        var heightTest = 2024;
        e2eBase.setBaseUrl(browser.baseUrl);
        e2eBase.initialize();
        var app;

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved
         */
        beforeAll(function(done) {
            //Create the table schema (map object) to pass into the app generator
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Rating Field'] = {fieldType: consts.SCALAR, dataType : consts.RATING};
            tableToFieldToFieldTypeMap['table 1']['Phone Number Field'] = {fieldType: consts.SCALAR, dataType : consts.PHONE_NUMBER};
            tableToFieldToFieldTypeMap['table 1']['Numeric'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
            tableToFieldToFieldTypeMap['table 1']['Currency'] = {fieldType: consts.SCALAR, dataType : consts.CURRENCY};
            tableToFieldToFieldTypeMap['table 1']['Percent'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};
            tableToFieldToFieldTypeMap['table 1']['Url'] = {fieldType: consts.SCALAR, dataType: consts.URL};
            tableToFieldToFieldTypeMap['table 1']['Duration'] = {fieldType: consts.SCALAR, dataType : consts.DURATION};
            tableToFieldToFieldTypeMap['table 1']['Email'] = {fieldType: consts.SCALAR, dataType : consts.EMAIL_ADDRESS};
            tableToFieldToFieldTypeMap['table 1']['Rating 2'] = {fieldType: consts.SCALAR, dataType: consts.RATING};
            tableToFieldToFieldTypeMap['table 2'] = {};
            tableToFieldToFieldTypeMap['table 2']['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 2']['Rating Field'] = {fieldType: consts.SCALAR, dataType : consts.RATING};
            tableToFieldToFieldTypeMap['table 2']['Phone Number Field'] = {fieldType: consts.SCALAR, dataType : consts.PHONE_NUMBER};
            //Call the basic app setup function
            e2eBase.basicSetup(tableToFieldToFieldTypeMap, 10).then(function(results) {
                //Set your global objects to use in the test functions
                app = results[0];
                //Check that your setup completed properly
                //There's no fail fast option using beforeAll yet in Jasmine to prevent other tests from running
                //This will fail the test if setup did not complete properly so at least it doesn't run
                if (!app) {
                    done.fail('test app / recordList was not created properly during setup');
                }

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
                        // Define the window size
                        e2eBase.resizeBrowser(widthTest, heightTest);
                        // Wait for the left nav to load
                        reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                            // Select the app
                            reportServicePage.appLinksElList.get(0).click();
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
                    // Sleep for animation
                    e2eBase.sleep(2000);
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
                    // Sleep for animation
                    e2eBase.sleep(2000);
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
                    e2eBase.resizeBrowser(1500, 600).then(function() {
                        reportServicePage.assertNavProperties('xlarge', true, '399');
                    }).then(function() {
                        e2eBase.resizeBrowser(1280, 600).then(function() {
                            reportServicePage.assertNavProperties('large', true, '299');
                        }).then(function() {
                            e2eBase.resizeBrowser(1024, 600).then(function() {
                                reportServicePage.assertNavProperties('medium', true, '199');
                            }).then(function() {
                                e2eBase.resizeBrowser(640, 600).then(function() {
                                    reportServicePage.assertNavProperties('small', false, '0');
                                }).then(function() {
                                    // Reset the browser for other tests
                                    e2eBase.resizeBrowser(widthTest, heightTest);
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
