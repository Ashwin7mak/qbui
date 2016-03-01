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
                    // sleep
                    e2eBase.sleep(browser.params.smallSleep);
                    // Select the app
                    reportServicePage.appLinksElList.get(0).click();
                    // Select the table
                    reportServicePage.tableLinksElList.get(3).click();
                    // Open the reports list
                    reportServicePage.reportHamburgersElList.get(0).click();
                    // Wait for the report list to load
                    reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                        // Find and select the report
                        reportServicePage.selectReport('My Reports', 'Test Report');
                        // Make sure the table report has loaded
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            done();
                        });
                    });
                });
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

        xit('Verify reports toolbar', function(done) {
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

        xit('Verify facet overlay menu and menu items expand and collapse', function(done) {
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
                    var textEl = menuItem.element(by.className('facetName')).getAttribute('outerText');
                    //Verify by default it is in collapse state
                    expect(menuItem.getAttribute('className'), "collapsed", "Facet Name "+ textEl +" should be in collapsed state.");
                    //Verify after clicking menu item it expands
                    menuItem.click();
                    expect(menuItem.getAttribute('className'), "","Facet Name "+ textEl +" should be in expanded state after clicking on menu item..");
                    //Clicking back again collapses.
                    menuItem.click();
                    expect(menuItem.getAttribute('className'), "collapsed", "Facet Name "+ textEl +" should be in collapsed state after clicking twice");
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

        xit('Verify selected facet Items got checked in facet popup', function(done) {
            reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function () {
                //Click on facet carat
                reportServicePage.reportFilterBtnCaret.click().then(function () {
                    //Verify the popup menu is displayed
                    return expect(reportServicePage.reportFacetPopUpMenu.isDisplayed).toBeTruthy();
                    //TODO verify table column names matches with menu contents after the integration part is done.
                }).then(function () {
                    //select the facet Items
                    return reportServicePage.selectFacetAndVerifyChecked("Status", ["Blocked", "Completed"]);
                });
                done();
            });
        });

        xit('Selected Facet Name and Facet Items and verify Facet tokens ', function(done) {
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
                    reportServicePage.selectFacetAndVerifyChecked("Flag", ["True"]);
                    reportServicePage.reportFilterBtnCaret.click();
                }).then(function () {
                    reportServicePage.verifyFacetTokens([{index: 0, text: 'Types\nDesignDevelopmentTest'}, {index: 1, text: 'Flag\nTrue'}]);
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
                    reportServicePage.selectFacetAndVerifyChecked("Types", ["Design", "Development", "Test"]);
                }).then(function () {
                    reportServicePage.selectFacetAndVerifyChecked("Flag", ["True"]);
                    reportServicePage.reportFilterBtnCaret.click();
                }).then(function () {
                    //remove facets by clicking on clear (X) in facet selection in the tokens and verify tokens got removed
                    reportServicePage.clearFacetTokens(["Design", "Test", "True"]);
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
