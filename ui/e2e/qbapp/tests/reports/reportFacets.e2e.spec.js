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
        var testEmptyRecord = '[{"id":6,"value":""},{"id":7,"value":""},{"id":8,"value":""},{"id":9,"value":""}]';

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp().then(function (appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
            }).then(function () {
                // Get the appropriate fields out of the third table
                var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[2]);
                // Generate the record JSON objects
                var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, 5);
                // Via the API create some records
                return e2eBase.recordService.addRecords(app, app.tables[2], generatedRecords).then(function () {
                    //generate 1 empty record
                    var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, 1);
                    return e2eBase.recordService.addRecords(app, app.tables[2], generatedEmptyRecords).then(function () {
                        //Create a report with facets in table 3
                        return e2eBase.reportService.createReportWithFacets(app.id, app.tables[2].id, [6, 7, 8, 9]);
                    });
                }).then(function () {
                    //// Get the appropriate fields out of the fourth table
                    var Fields = e2eBase.tableService.getNonBuiltInFields(app.tables[3]);
                    //generate 201 text records in table 4 for negative testing
                    var generated201Records = e2eBase.recordService.generateRecords(Fields, 350);
                    return e2eBase.recordService.addBulkRecords(app, app.tables[3], generated201Records).then(function () {
                        //Create a new report to do negative testing of >200 text records
                        return e2eBase.reportService.createReportWithFacets(app.id, app.tables[3].id, [6]);
                    });
                }).then(function () {
                    // Get a session ticket for that subdomain and realmId (stores it in the browser)
                    realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                    realmId = e2eBase.recordBase.apiBase.realm.id;
                    return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
                }).then(function () {
                    // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                    return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
                }).then(function () {
                    // Wait for the leftNav to load
                    return reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function () {
                        // Select the app
                        return reportServicePage.appLinksElList.get(0).click();
                        e2eBase.sleep(browser.params.smallSleep);
                    });
                }).then(function () {
                    return reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function () {
                        return reportServicePage.tableLinksElList.get(4).click();
                    });
                }).then(function () {
                    // Open the reports list
                    reportServicePage.reportHamburgersElList.get(4).click();
                    // Wait for the report list to load
                    reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function () {
                        // Find and select the report
                        reportServicePage.selectReport('My Reports', 'Report With Facets');
                        done();
                    });
                }).catch(function (error) {
                    // Global catch that will grab any errors from chain above
                    // Will appropriately fail the beforeAll method so other tests won't run
                    done.fail('Error during test setup: ' + error.message);
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

        xit('Verify facet overlay menu and menu items expand and collapse', function (done) {
            var tableHeaders = [];
            //Click on facet carat
            reportServicePage.reportFilterBtnCaret.click().then(function () {
                //Verify the popup menu is displayed
                expect(reportServicePage.reportFacetPopUpMenu.isDisplayed).toBeTruthy();
            }).then(function () {
                //verify expand and collapse of each items in an popup menu
                reportServicePage.PopUpContainerFacetGroup.then(function (elements) {
                    expect(elements.length).toBe(4);
                    elements.forEach(function (menuItem) {
                        var grpText = menuItem.getAttribute('outerText');
                        //Verify by default group is in collapse state
                        expect(menuItem.getAttribute('class')).toMatch("collapsed");
                        //Verify after clicking group item it expands
                        menuItem.click().then(function () {
                            expect(menuItem.getAttribute('class')).toMatch("");
                        });
                        //Clicking back again should collapses.
                        menuItem.click().then(function () {
                            expect(menuItem.getAttribute('class')).toMatch("collapsed");
                        });
                    });

                    // Assert column headers are equal to the popup facet groups
                    reportServicePage.getReportColumnHeaders(reportServicePage).then(function (tableColHeaders) {
                        //Map all facet groups from the facet popup
                            var popUpFacetGrps = reportServicePage.PopUpContainerFacetGroup.map(function(elm) {
                                return elm.getText();
                        });
                        //verify table column names matches with facet group menu contents in the popup.
                        for (var i=1;i<tableColHeaders.length;i++) {
                            tableHeaders.push(tableColHeaders[i]);
                        }
                        expect(tableHeaders).toEqual(popUpFacetGrps);
                    });
                });
            }).then(function () {
                //Verify overlay popup collapse at the end.
                //Click on facet carat
                reportServicePage.reportFilterBtnCaret.click().then(function () {
                    //Verify the popup menu is collapsed
                    expect(reportServicePage.reportFacetPopUpMenu.isDisplayed, "false", "Unexpected facet menu state. Should be collapsed.");
                    done();
                });
            });
        });

        it('Negative test to verify > 200k Text fields shoes error message in facet drop down', function (done) {
            //select table 4
            reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function () {
                return reportServicePage.tableLinksElList.get(5).click();
            }).then(function() {
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(6).click();
                // Wait for the report list to load
                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function () {
                    // Find and select the report
                    reportServicePage.selectReport('My Reports', 'Report With Facets');
                });
            }).then(function() {
                // expand the popup ad select group
                reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function () {
                    reportServicePage.reportFilterBtnCaret.click().then(function () {
                        //Verify the popup menu is displayed
                        expect(reportServicePage.reportFacetPopUpMenu.isDisplayed).toBeTruthy();
                    });
                });
            }).then(function() {
                // Expand the Text Facet group
                reportServicePage.PopUpContainerFacetGroup.map(function (groupName) {
                    return groupName.getText().then(function (groupText) {
                        groupName.click().then(function () {
                            expect(groupName.getAttribute('class'), '', "Facet Group is not expanded");
                        });
                    });
                });
            }).then(function() {
                // Verify the text shows are "too many values to use for filtering"
                //sleep to expand a group required as there are 2 many records
                e2eBase.sleep(browser.params.smallSleep);
                    element.all(by.className('noOptions')).map(function (groupItem) {
                        return groupItem.getText().then(function (itemText) {
                            expect(groupItem.getAttribute('outerText')).toMatch("Too many values to use for filtering.");
                            done();
                        });
                    });
            });
        });

        /**
         * Data Provider for reports and faceting results.
         */
        function facetPositiveTestCases() {
            return [
                {
                    message: 'Create text facet',
                    facets: [{"group":"Text Field", "ItemIndex":[0,4]}],
                },
                {
                    message: 'Create text facet with different Order',
                    facets: [{"group":"Text Field", "ItemIndex":[4,0]}],
                },
                {
                    message: 'Create Text and CheckBox facet',
                    facets: [{"group":"Text Field", "ItemIndex":[1]},{"group":"Checkbox Field", "ItemIndex":[1]}],

                },
                //{
                //    message: 'Facet with 1 Text record and 1 Empty Record',
                //    facetFId: [6, 12],
                //    expectedFacets: '[{"id":6,"name":"Text Field","type":"TEXT","values":["abcdef"],"hasBlanks":false},{"id":12,"name":"Empty Text Field","type":"TEXT","values":[""],"hasBlanks":true}]'
                //},
                //{
                //    message: 'Facet with just Empty Record',
                //    facetFId: [12],
                //    expectedFacets: '[{"id":12,"name":"Empty Text Field","type":"TEXT","values":[""],"hasBlanks":true}]'
                //},
                //{
                //    message: 'Create Facet with Text null and Empty Records',
                //    facetFId: [6, 11, 12],
                //    expectedFacets: '[{"id":6,"name":"Text Field","type":"TEXT","values":["abcdef"],"hasBlanks":false},{"id":11,"name":"Null Text Field","type":"TEXT","values":[""],"hasBlanks":true},{"id":12,"name":"Empty Text Field","type":"TEXT","values":[""],"hasBlanks":true}]'
                //},
            ];


        }

        facetPositiveTestCases().forEach(function(testcase) {
        it('Test case: ' + testcase.message, function(done) {
           // it('Expand Facet Group and select facet Items ,verify items have checkmark beside and also verify Facet tokens in container', function (done) {
                reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function () {
                    //Click on facet carat
                    reportServicePage.reportFilterBtnCaret.click().then(function () {
                        //Verify the popup menu is displayed
                        expect(reportServicePage.reportFacetPopUpMenu.isDisplayed).toBeTruthy();
                        //TODO verify table column names matches with menu contents after the integration part is done.
                    }).then(function () {
                        //select the facets and verift the check mark beside them
                        for(var i=0;i<testcase.facets.length;i++) {
                            reportServicePage.selectFacetItemsAndVerifyTokens(testcase.facets[i].group, testcase.facets[i].ItemIndex);
                        }
                        //collapse the popup
                        reportServicePage.reportFilterBtnCaret.click();
                    }).then(function () {
                       // reportServicePage.verifyFacetTokens([{index: 0, text: 'Types\nDesignDevelopmentTest'}, {index: 1, text: 'Flag\nYes'}]);
                        reportServicePage.verifyTableResultsWithFacet();
                        done();
                    });
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
                    reportServicePage.selectFacetItemsAndVerifyTokens("Types", ["Design", "Development", "Test"]);
                }).then(function () {
                    reportServicePage.selectFacetItemsAndVerifyTokens("Flag", ["Yes"]);
                    reportServicePage.reportFilterBtnCaret.click();
                }).then(function () {
                    //reportServicePage.verifyFacetTokens([{index: 0, text: 'Types\nDesignDevelopmentTest'}, {index: 1, text: 'Flag\nYes'}]);
                    reportServicePage.verifyTableResultsWithFacet ();
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
                    reportServicePage.selectFacetItemsAndVerifyTokens("Names", ["Aditi Goel", "Claire Martinez"]);
                }).then(function () {
                    reportServicePage.selectFacetItemsAndVerifyTokens("Flag", ["No"]);
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
