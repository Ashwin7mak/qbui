/**
 * E2E Faceting tests for the report on the Reports page
 * Created by lkamineni on 21/02/16
 */

(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();

    describe('Report Faceting Tests', function() {
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
                    return reportServicePage.appLinksElList.get(0).click();
                });
            }).then(function() {
                return reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function() {
                    // Select the table
                    return reportServicePage.tableLinksElList.get(3).click();
                });
            }).then(function() {
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(0).click();
                // Wait for the report list to load
                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                    // Find and select the report
                    reportServicePage.selectReport('My Reports', 'Test Report');
                    done();
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
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                done();
            });
        });

        it('Verify reports toolbar', function(done) {
            reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function() {
                //verify the records count
                expect(reportServicePage.reportRecordsCount.getAttribute('innerText'), "10 Records", "Unexpected count of records.");
                // Verify display of filter search box
                expect(reportServicePage.reportFilterSearchBox.isDisplayed).toBeTruthy();
                //verify display of facet buttons
                //verify display of filter button
                expect(reportServicePage.reportFilterBtn.isDisplayed).toBeTruthy();
                //verify display of filter carat/dropdown button
                expect(reportServicePage.reportFilterBtnCaret.isDisplayed).toBeTruthy();
                done();
            });
        });

        it('Verify facet overlay menu and menu items expand and collapse', function(done) {
            //Click on facet carat
            reportServicePage.reportFilterBtnCaret.click().then(function() {
                //Verify the popup menu is displayed
                expect(reportServicePage.reportFacetPopUpMenu.isDisplayed).toBeTruthy();
                //TODO verify table column names matches with menu contents after the integration part is done.
            });
            //verify expand and collapse of each items in an menu
            reportServicePage.PopUpContainerFacetGroup.then(function(elements) {
                expect(elements.length).toBe(5);
                elements.forEach(function(menuItem){
                    //Verify by default group is in collapse state
                    expect(menuItem.getAttribute('class')).toMatch("collapsed");
                    //Verify after clicking group item it expands
                    menuItem.click().then (function() {
                        expect(menuItem.getAttribute('class')).toMatch("");
                    });
                    //Clicking back again should collapses.
                    menuItem.click().then (function() {
                        expect(menuItem.getAttribute('class')).toMatch("collapsed");
                    });
                });

            }).then(function() {
                //Verify overlay popup collapse at the end.
                //Click on facet carat
                reportServicePage.reportFilterBtnCaret.click().then(function() {
                    //Verify the popup menu is collapsed
                    expect(reportServicePage.reportFacetPopUpMenu.isDisplayed, "false", "Unexpected facet menu state. Should be collapsed.");
                    done();
                });
            });
        });

        it('Expand Facet Group and select facet Items ,verify items have checkmark beside and also verify Facet tokens in container', function(done) {
            reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function () {
                //Click on facet carat
                reportServicePage.reportFilterBtnCaret.click().then(function () {
                    //Verify the popup menu is displayed
                    expect(reportServicePage.reportFacetPopUpMenu.isDisplayed).toBeTruthy();
                    //TODO verify table column names matches with menu contents after the integration part is done.
                }).then(function () {
                    //select the facet Items
                    reportServicePage.selectFacetAndVerifyChecked("Types", ["Design", "Development", "Test"]);
                }).then(function () {
                    reportServicePage.selectFacetAndVerifyChecked("Flag", ["Yes"]);
                    reportServicePage.reportFilterBtnCaret.click();
                }).then(function () {
                    reportServicePage.verifyFacetTokens([{index: 0, text: 'Types\nDesignDevelopmentTest'}, {index: 1, text: 'Flag\nYes'}]);
                    done();
                });
            });
        });

        it('Verify clear facets selections from the facet token container', function(done) {
            reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function () {
                //Click on facet carat
                reportServicePage.reportFilterBtnCaret.click().then(function () {
                    //Verify the popup menu is displayed
                    expect(reportServicePage.reportFacetPopUpMenu.isDisplayed).toBeTruthy();
                    //TODO verify table column names matches with menu contents after the integration part is done.
                }).then(function () {
                    //select the facet Items
                    reportServicePage.selectFacetAndVerifyChecked("Names", ["Aditi Goel", "Claire Martinez"]);
                }).then(function () {
                    reportServicePage.selectFacetAndVerifyChecked("Flag", ["No"]);
                    reportServicePage.reportFilterBtnCaret.click();
                }).then(function () {
                    //remove facets by clicking on clear (X) in facet selection in the tokens and verify tokens got removed
                    reportServicePage.clearFacetTokens(["Aditi Goel", "No"]);
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
