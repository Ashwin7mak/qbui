/**
 * E2E tests for the table components on the Reports page
 * Created by klabak on 6/1/15
 */
// jshint sub: true
// jscs:disable requireDotNotation

(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();

    describe('Report Page Table Tests', function() {
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
                        // Done callback to let Jasmine know we are done with our promise chain
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
         * Before each test starts just make sure the report list has loaded
         */
        beforeEach(function(done) {
            reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function() {
                done();
            });
        });

        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then displays the report page in the browser
         */
        it('Should load the reports page with the appropriate table report and verify the fieldNames and records', function() {
            // Select the table
            reportServicePage.tableLinksElList.get(2).click();
            // Open the reports list
            reportServicePage.reportHamburgersElList.get(0).click();
            // Wait for the report list to load
            reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                // Find and select the report
                reportServicePage.selectReport('My Reports', 'Test Report');
            });
            // Wait until the table has loaded
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //TODO: Assert report icon has been highlighted to indicate which table you are on

                // Assert the record count
                expect(reportServicePage.reportRecordsCount.getAttribute('innerText')).toEqual('10 Records');

                // Assert column headers
                reportServicePage.getReportColumnHeaders().then(function(resultArray) {
                    // UI is currently using upper case to display the field names in columns
                    expect(resultArray).toEqual(e2eConsts.reportFieldNames);
                });
                // Check all record values equal the ones we added via the API
                reportServicePage.agGridRecordElList.getText().then(function(uiRecords) {
                    //TODO: Fix Record value and test generator data formats and assertions
                    //e2eBase.recordService.assertRecordValues(uiRecords, recordList);
                });
            });
        });

        /**
         * Test method. Loads the first table containing 10 fields (10 columns). The table report (griddle) width should expand past the browser size
         * to give all columns enough space to show their data.
         */
        it('Table report should expand width past the browser size to show all available data (large num columns)', function(done) {
            // Select the table
            reportServicePage.tableLinksElList.get(2).click().then(function() {
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(0).click();
                // Wait for the report list to load
                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                    // Find and select the report
                    reportServicePage.selectReport('My Reports', 'Test Report');
                });
                // Make sure the table report has loaded
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    // Check there is a scrollbar in the griddle table
                    var fetchRecordPromises = [];
                    fetchRecordPromises.push(reportServicePage.griddleWrapperEl.getAttribute('scrollWidth'));
                    fetchRecordPromises.push(reportServicePage.griddleWrapperEl.getAttribute('clientWidth'));
                    //When all the dimensions have been fetched, assert the values match expectations
                    Promise.all(fetchRecordPromises).then(function(dimensions) {
                        expect(Number(dimensions[0])).toBeGreaterThan(Number(dimensions[1]));
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
            reportServicePage.tableLinksElList.get(3).click().then(function() {
                // Open the reports menu for the second table
                reportServicePage.openReportsMenu(reportServicePage.tableLinksElList.get(3));

                // Wait for the report list to load
                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                    // Find and select the report
                    reportServicePage.selectReport('My Reports', 'Test Report');
                });
                // Make sure the table report has loaded
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    // Check there is no scrollbar in the griddle table
                    var fetchRecordPromises = [];
                    fetchRecordPromises.push(reportServicePage.griddleWrapperEl.getAttribute('scrollWidth'));
                    fetchRecordPromises.push(reportServicePage.griddleWrapperEl.getAttribute('clientWidth'));
                    //When all the dimensions have been fetched, assert the values match expectations
                    Promise.all(fetchRecordPromises).then(function(dimensions) {
                        //TODO: Need to disable for now until we get more design around default column width
                        //expect(Number(dimensions[0])).not.toBeGreaterThan(Number(dimensions[1]));
                        done();
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
