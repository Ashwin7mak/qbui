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
        var actualTableResuts = [];

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */
        beforeAll(function(done) {
            var nonBuiltInFields;
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Get the appropriate fields out of the third table
                nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[2]);
                // Generate the record JSON objects
                var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, 5);
                // Via the API create some records
                return e2eBase.recordService.addRecords(app, app.tables[2], generatedRecords);
            }).then(function() {
                // Get the appropriate fields out of the third table
                nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[2]);
                //generate 1 empty record
                var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, 1);
                return e2eBase.recordService.addRecords(app, app.tables[2], generatedEmptyRecords);
            }).then(function() {
                //Create a report with facets in table 3
                return e2eBase.reportService.createReportWithFacets(app.id, app.tables[2].id, [6, 7, 8, 9]);
            }).then(function() {
                // Get the appropriate fields out of the fourth table
                var Fields = e2eBase.tableService.getNonBuiltInFields(app.tables[3]);
                //TODO: Need to re-enable this once bulk records is fixed
                // Generate greater than 201 text records in table 4 for negative testing
                //var generated201Records = e2eBase.recordService.generateRecords(Fields, 300);
                //return e2eBase.recordService.addBulkRecords(app, app.tables[3], generated201Records);
            }).then(function() {
                //TODO: Need to re-enable this once bulk records is fixed
                //Create a new report to do negative testing of >200 text records
                //return e2eBase.reportService.createReportWithFacets(app.id, app.tables[3].id, [6]);
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
                    return reportServicePage.tableLinksElList.get(4).click();
                });
            }).then(function() {
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(4).click();
                // Wait for the report list to load
                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                    // Find and select the report
                    return reportServicePage.selectReport('My Reports', 'Report With Facets');
                });
            }).then(function() {
                reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                    reportServicePage.waitForElement(reportServicePage.agGridBodyEl).then(function() {
                        // Get all records from table before filter applied
                        reportServicePage.agGridRecordElList.map(function(row) {
                            return {
                                'Text Field': row.all(by.className('ag-cell-no-focus')).get(2).getText(),
                                'Checkbox Field': row.all(by.className('ag-cell-no-focus')).get(5).getText()
                            };
                        }).then(function(results) {
                            for (var i = 0; i < results.length; i++) {
                                actualTableResuts.push(results[i]);
                            }
                            done();
                        });
                    })
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
            // Make sure the table report has loaded
            reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function() {
                done();
            });
        });

        /**
         * Function that will verify the filtered rows are contained in actual record list.
         * @param facets Group
         */
        var verifyFacetTableResults = function(facetGroup) {
            var expectedTableResuts = [];
            reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                reportServicePage.waitForElement(reportServicePage.agGridContainerEl).then(function() {
                    reportServicePage.agGridRecordElList.map(function(row) {
                        return {
                            'Text Field': row.all(by.className('ag-cell-no-focus')).get(2).getText(),
                            'Checkbox Field': row.all(by.className('ag-cell-no-focus')).get(5).getText()
                        };
                    }).then(function(results) {
                        for (var i = 0; i < results.length; i++) {
                            expectedTableResuts.push(results[i]);
                        }
                        var found = false;
                        for (var j = 0; j < expectedTableResuts.length; j++) {
                            for (var k = 0; k < actualTableResuts.length; k++) {
                                if (expectedTableResuts.length > 0 && JSON.stringify(expectedTableResuts[j]) === JSON.stringify(actualTableResuts[k])) {
                                    expect(expectedTableResuts[j]).toEqual(actualTableResuts[k]);
                                    found = true;
                                    break;
                                }
                                found = false;
                            }
                        }
                    });
                });
            });
        };

        it('Verify reports toolbar', function(done) {
            //verify the records count
            expect(reportServicePage.reportRecordsCount.getAttribute('innerText')).toEqual('6 Records');
            // Verify display of filter search box
            expect(reportServicePage.reportFilterSearchBox.isDisplayed()).toBeTruthy();
            //verify display of filter button
            expect(reportServicePage.reportFilterBtn.isDisplayed()).toBeTruthy();
            //verify display of filter carat/dropdown button
            expect(reportServicePage.reportFilterBtnCaret.isDisplayed()).toBeTruthy();
            done();
        });

        it('Verify facet overlay menu contents are collapsed to start with and matches with table column headers', function(done) {
            //Click on facet carat
            reportServicePage.reportFilterBtnCaret.click().then(function() {
                //Verify the popup menu is displayed
                expect(reportServicePage.reportFacetPopUpMenu.isDisplayed()).toBeTruthy();
            }).then(function() {
                //verify expand and collapse of each items in an popup menu
                reportServicePage.unselectedFacetGroupsElList.then(function(elements) {
                    expect(elements.length).toBe(2);
                    elements.forEach(function(menuItem) {
                        //Verify by default group is in collapse state
                        expect(reportServicePage.getFacetGroupTitle(menuItem).element(by.tagName('a')).getAttribute('class')).toMatch("collapsed");
                    });
                }).then(function() {
                    // Assert column headers are equal to the popup facet groups
                    reportServicePage.getReportColumnHeaders(reportServicePage).then(function(tableColHeaders) {
                        // Remove Record ID# from the array since it cannot be a facet
                        tableColHeaders.shift();
                        // Map all facet groups from the facet popup
                        reportServicePage.unselectedFacetGroupsElList.map(function(elm) {
                            return elm.getText();
                        }).then(function(facetGroupNames) {
                            // Ensure each facet group field is present on the table report
                            facetGroupNames.forEach(function(facetGroupName) {
                                expect(tableColHeaders).toContain(facetGroupName);
                            });
                            // Click out of the facet popup and ensure it closes
                            reportServicePage.reportRecordsCount.click().then(function() {
                                // Animation of the popup disappearing
                                e2eBase.sleep(browser.params.smallSleep);
                                // Check that the popup is removed
                                expect(reportServicePage.reportFacetPopUpMenu.isPresent()).toBeFalsy();
                                done();
                            });
                        });
                    });
                });
            });
        });

        /**
         * Data Provider for reports and faceting results.
         */
        function facetTestCases() {
            return [
                {
                    message: 'Verify more filters - Create text facet',
                    facets: [{"group": "Text Field", "ItemIndex": [1, 5]}]
                },
                {
                    message: 'Create text facet',
                    facets: [{"group": "Text Field", "ItemIndex": [1, 3, 4]}]
                },
                {
                    message: 'Create text facet with different Order and verify facet tokens',
                    facets: [{"group": "Text Field", "ItemIndex": [4, 3, 1]}]
                },
                {
                    message: 'Facet with 1 Text record and 1 Empty Record',
                    facets: [{"group": "Text Field", "ItemIndex": [0, 2]}]
                },
                {
                    message: 'Facet with just Empty Record',
                    facets: [{"group": "Text Field", "ItemIndex": [0]}]
                },
                {
                    message: 'Create CheckBox facet',
                    facets: [{"group": "Checkbox Field", "ItemIndex": [0]}]
                },
                {
                    message: 'Create Checkbox and Text facet',
                    facets: [{"group": "Checkbox Field", "ItemIndex": [0]}, {
                        "group": "Text Field",
                        "ItemIndex": [0, 2]
                    }]
                },
                {
                    message: 'Facet with 1 CheckBox record and 1 Empty Text',
                    facets: [{"group": "Checkbox Field", "ItemIndex": [0]}, {"group": "Text Field", "ItemIndex": [0]}]
                }
            ];
        }

        facetTestCases().forEach(function(testcase) {
            it('Test case: ' + testcase.message, function(done) {
                // Click on facet carat
                reportServicePage.waitForElementToBeClickable(reportServicePage.reportFilterBtnCaret).then(function() {
                    reportServicePage.reportFilterBtnCaret.click();
                    // Verify the popup menu is displayed
                    reportServicePage.waitForElement(reportServicePage.reportFacetPopUpMenu).then(function() {
                        expect(reportServicePage.reportFacetPopUpMenu.isDisplayed()).toBeTruthy();
                    });
                }).then(function() {
                    for (var i = 0; i < testcase.facets.length; i++) {
                        // Select facet group and items
                        reportServicePage.selectGroupAndFacetItems(testcase.facets[i].group, testcase.facets[i].ItemIndex).then(function(facetSelections) {
                            // Get facet tokens from the reports toolbar and verify against selected items on reports toolbar
                            reportServicePage.reportFacetNameSelections.map(function(tokenName, tokenindex) {
                                return tokenName.getText();
                            }).then(function(selections) {
                                // Sort each array before comparing
                                expect(selections.sort()).toEqual(facetSelections.sort());
                            });
                        });
                    }
                }).then(function() {
                    for (var i = 0; i < testcase.facets.length; i++) {
                        verifyFacetTableResults(testcase.facets[i].group);
                    }
                }).then(function() {
                    // Finally clear all facets from popup menu
                    for (var j = 0; j < testcase.facets.length; j++) {
                        reportServicePage.getFacetGroupElement(testcase.facets[j].group).then(function(facetGroupEl) {
                            reportServicePage.waitForElementToBeClickable(facetGroupEl).then(function() {
                                reportServicePage.clickClearAllFacetsIcon(facetGroupEl);
                            });
                        });
                    }
                }).then(function() {
                    // Collapse the popup menu
                    reportServicePage.waitForElementToBeClickable(reportServicePage.reportFilterBtnCaret).then(function() {
                        reportServicePage.reportFilterBtnCaret.click().then(function() {
                            done();
                        });
                    });
                });
            });
        });

        it('Verify clear all facets tokens from the container', function (done) {
            reportServicePage.waitForElementToBeClickable(reportServicePage.reportFilterBtnCaret).then(function() {
                //Click on facet carat to show popup
                reportServicePage.reportFilterBtnCaret.click().then(function() {
                    //Verify the popup menu is displayed
                    expect(reportServicePage.reportFacetPopUpMenu.isDisplayed()).toBeTruthy();
                }).then(function () {
                    //select the facet Items
                    reportServicePage.selectGroupAndFacetItems("Text Field", [1, 2, 3, 4]).then(function(facetSelections) {
                        //Map all facet tokens from the facet container
                        reportServicePage.reportFacetNameSelections.map(function(tokenName, tokenindex) {
                            return tokenName.getText();
                        }).then(function(selections) {
                            // Sort each array before comparing
                            expect(selections.sort()).toEqual(facetSelections.sort());
                        });
                    });
                }).then(function() {
                    //remove facets by clicking on clear (X) in popup beside Text Field and verify all tokens removed
                    reportServicePage.waitForElementToBeClickable(reportServicePage.reportFilterBtnCaret).then(function() {
                        reportServicePage.reportFilterBtnCaret.click().then(function() {
                            reportServicePage.clearFacetTokensFromContainer().then(function() {
                                expect(reportServicePage.reportRecordsCount.getAttribute('innerText')).toEqual('6 Records');
                                done();
                            });
                        });
                    });
                });
            });
        });

        it('Negative test to verify a facet dropdown has No Values with report without facetsFIDS', function(done) {
            // Select table 1 which has report without facetFIDS
            reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function() {
                return reportServicePage.tableLinksElList.get(3).click();
            }).then(function() {
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(0).click();
                // Wait for the report list to load
                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                    // Find and select the report
                    reportServicePage.selectReport('My Reports', 'Test Report');
                });
            }).then(function() {
                // Expand the popup and select group
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    // Verify the facet container is not present in DOM without facets for a report.
                    expect(reportServicePage.reportFacetMenuContainer.isPresent()).toBeFalsy();
                    done();
                });
            });

        });

        //TODO: Negative test for when your facet selections return no results

        //TODO: This should be enabled when bulkRecords is fixed
        xit('Negative test to verify > 200k Text fields shows error message in facet drop down', function(done) {
            //select table 4
            reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function() {
                return reportServicePage.tableLinksElList.get(5).click();
            }).then(function() {
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(6).click();
                // Wait for the report list to load
                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                    // Find and select the report
                    reportServicePage.selectReport('My Reports', 'Report With Facets');
                });
            }).then(function() {
                // expand the popup ad select group
                reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function() {
                    reportServicePage.reportFilterBtnCaret.click().then(function() {
                        //Verify the popup menu is displayed
                        expect(reportServicePage.reportFacetPopUpMenu.isDisplayed()).toBeTruthy();
                    });
                });
            }).then(function() {
                // Expand the Text Facet group
                reportServicePage.PopUpContainerFacetGroup.map(function(groupName) {
                    return groupName.getText().then(function(groupText) {
                        groupName.click().then(function() {
                            expect(groupName.getAttribute('class'), '', "Facet Group is not expanded");
                        });
                    });
                });
            }).then(function() {
                // Verify the text shows are "too many values to use for filtering"
                //sleep to expand a group required as there are 2 many records
                e2eBase.sleep(browser.params.smallSleep);
                element(by.className('noOptions')).getText().then(function(text) {
                    expect(text).toEqual("Too many values to use for filtering.");
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
