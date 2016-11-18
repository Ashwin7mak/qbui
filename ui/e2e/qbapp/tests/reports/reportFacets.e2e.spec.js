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
    var ReportFacetsPage = requirePO('reportFacets');
    var ReportContentPage = requirePO('reportContent');
    var reportServicePage = new ReportServicePage();
    var reportFacetsPage = new ReportFacetsPage();
    var reportContentPage = new ReportContentPage();

    describe('Report Faceting Test Setup', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;
        var actualTableResuts = [];

        beforeAll(function(done) {
            e2eBase.fullReportsSetup(5).then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                // Gather the necessary values to make the requests via the browser
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                // Wait for the leftNav to load
                return reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    done();
                });
            });
        });

        /*
         * Facet Test Cases
         */
        describe('Report Faceting Tests', function() {

            beforeAll(function(done) {
                e2eRetry.run(function() {
                    //go to report page directly
                    e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 4);
                    reportContentPage.waitForReportContent().then(function() {
                        reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                            reportServicePage.waitForElement(reportServicePage.agGridBodyEl).then(function() {
                                // Get all records from table before filter applied
                                reportServicePage.agGridRecordElList.map(function(row) {
                                    return {
                                        'Text Field': row.all(by.className('ag-cell-no-focus')).get(1).getText(),
                                        'Checkbox Field': row.all(by.className('ag-cell-no-focus')).get(4).getText()
                                    };
                                }).then(function(results) {
                                    for (var i = 0; i < results.length; i++) {
                                        actualTableResuts.push(results[i]);
                                    }
                                    done();
                                });
                            });
                        });
                    });
                });
            });

            /**
             * Before each test starts just make sure the table list div has loaded
             */
            beforeEach(function(done) {
                // Make sure the table report has loaded
                reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function() {
                    e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, 4);
                    reportContentPage.waitForReportContent();
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
                    reportServicePage.waitForElement(reportServicePage.agGridBodyEl).then(function() {
                        reportServicePage.agGridRecordElList.map(function(row) {
                            return {
                                'Text Field': row.all(by.className('ag-cell-no-focus')).get(1).getText(),
                                'Checkbox Field': row.all(by.className('ag-cell-no-focus')).get(4).getText()
                            };
                        }).then(function(results) {
                            for (var i = 0; i < results.length; i++) {
                                expectedTableResuts.push(results[i]);
                            }
                            var found = false;
                            for (var j = 0; j < expectedTableResuts.length; j++) {
                                for (var k = 0; k < actualTableResuts.length; k++) {
                                    try {
                                        if (expectedTableResuts.length > 0 && JSON.stringify(expectedTableResuts[j]) === JSON.stringify(actualTableResuts[k])) {
                                            expect(expectedTableResuts[j]).toEqual(actualTableResuts[k]);
                                            found = true;
                                            break;
                                        }
                                    } catch (e) {
                                        found = false;
                                        throw new Error(e);
                                    }
                                }
                            }
                        });
                    });
                });
            };

            it('Verify reports toolbar', function(done) {
                reportServicePage.waitForElement(reportServicePage.reportContainerEl).then(function() {
                    // Verify the records count
                    expect(reportServicePage.reportRecordsCount.getText()).toContain('7 records');
                    // Verify display of filter search box
                    expect(reportServicePage.reportFilterSearchBox.isDisplayed()).toBeTruthy();
                    // Verify display of facets filter button
                    expect(reportFacetsPage.reportFacetFilterBtn.isDisplayed()).toBeTruthy();
                    // Verify display of facets filter carat/dropdown button
                    expect(reportFacetsPage.reportFacetFilterBtnCaret.isDisplayed()).toBeTruthy();
                    done();
                });
            });

            it('Verify facet overlay menu contents are collapsed to start with and match table column headers', function(done) {
                e2eRetry.run(function() {
                    reportServicePage.waitForElement(reportFacetsPage.reportFacetMenuContainer);
                }).then(function() {
                    // Click on facet carat
                    reportFacetsPage.reportFacetFilterBtnCaret.click().then(function() {
                        // Make sure the popup is displayed
                        reportFacetsPage.waitForElementToBeClickable(reportFacetsPage.reportFacetPopUpMenu).then(function() {
                            // Verify expand and collapse of each items in popup menu
                            reportFacetsPage.unselectedFacetGroupsElList.then(function(elements) {
                                expect(elements.length).toBe(2);
                                elements.forEach(function(menuItem) {
                                    //Verify by default group is in collapse state
                                    expect(reportFacetsPage.getFacetGroupTitle(menuItem).element(by.tagName('a')).getAttribute('class')).toMatch("collapsed");
                                });
                            });
                        }).then(function() {
                            // Assert column headers are equal to the popup facet groups
                            reportServicePage.getReportColumnHeaders().then(function(tableColHeaders) {
                                // Remove Record ID# from the array since it cannot be a facet
                                tableColHeaders.shift();
                                // Map all facet groups from the facet popup
                                reportFacetsPage.unselectedFacetGroupsElList.map(function(elm) {
                                    return elm.getText();
                                }).then(function(facetGroupNames) {
                                    // Ensure each facet group field is present on the table report
                                    facetGroupNames.forEach(function(facetGroupName) {
                                        expect(tableColHeaders).toContain(facetGroupName);
                                    });
                                }).then(function() {
                                    reportServicePage.reportRecordsCount.click().then(function() {
                                        // Needed to get around stale element error
                                        e2eBase.sleep(browser.params.smallSleep);
                                        reportFacetsPage.waitForElementToBeStale(reportFacetsPage.reportFacetPopUpMenu).then(function() {
                                            done();
                                        });
                                    });
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
                    //TODO: Negative test need to move to separate it block
                    //{
                    //    message: 'Verify no Records matching the filter',
                    //    facets: [{"group": "Checkbox Field", "ItemIndex": [1]}, {
                    //        "group": "Text Field",
                    //        "ItemIndex": [0]
                    //    }]
                    //},
                    {
                        message: 'Verify more filters - Create text facet',
                        facets: [{"group": "Text Field", "ItemIndex": [1, 5]}]
                    },
                    {
                        message: '@smoke Create text facet',
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
                    //TODO the below 3 are failing looks like a bug to me as it displays 2 NO's under checkbox
                    //{
                    //    message: 'Create CheckBox facet',
                    //    facets: [{"group": "Checkbox Field", "ItemIndex": [0]}]
                    //},
                    //{
                    //    message: 'Create Checkbox and Text facet',
                    //    facets: [{"group": "Checkbox Field", "ItemIndex": [0]}, {
                    //        "group": "Text Field",
                    //        "ItemIndex": [0, 2]
                    //    }]
                    //},
                    //{
                    //    message: 'Facet with 1 CheckBox record and 1 Empty Text',
                    //    facets: [{"group": "Checkbox Field", "ItemIndex": [0]}, {
                    //        "group": "Text Field",
                    //        "ItemIndex": [0]
                    //    }]
                    //}
                ];
            }

            // Grab a random test case from the data provider
            //var facetTestcase = facetTestCases()[Math.floor(Math.random() * facetTestCases().length)];
            facetTestCases().forEach(function(facetTestcase) {
                it('Test case: ' + facetTestcase.message, function(done) {
                    // Click on facet carat
                    reportServicePage.waitForElement(reportServicePage.agGridContainerEl).then(function() {
                        reportFacetsPage.waitForElementToBeClickable(reportFacetsPage.reportFacetFilterBtnCaret).then(function() {
                            reportFacetsPage.reportFacetFilterBtnCaret.click().then(function() {
                                // Verify the popup menu is displayed
                                reportFacetsPage.waitForElement(reportFacetsPage.reportFacetPopUpMenu).then(function() {
                                    expect(reportFacetsPage.reportFacetPopUpMenu.isDisplayed()).toBeTruthy();
                                });
                            });
                        });
                    }).then(function() {
                        for (var i = 0; i < facetTestcase.facets.length; i++) {
                            // Select facet group and items
                            reportFacetsPage.selectGroupAndFacetItems(facetTestcase.facets[i].group, facetTestcase.facets[i].ItemIndex).then(function(facetSelections) {
                                // Get facet tokens from the reports toolbar and verify against selected items on reports toolbar
                                reportFacetsPage.reportFacetNameSelections.map(function(tokenName, tokenindex) {
                                    return tokenName.getText();
                                }).then(function(selections) {
                                    // Sort each array before comparing
                                    expect(selections.sort()).toEqual(facetSelections.sort());
                                });
                            }).then(function() {
                                reportFacetsPage.waitForReportReady();
                            });
                        }
                    }).then(function() {
                        //sleep for loading of table to finish
                        e2eBase.sleep(browser.params.smallSleep);
                        reportServicePage.griddleWrapperEl.getAttribute('innerText').then(function(txt) {
                            if (txt === 'There is no data to display.') {
                                //Verify the toolbar still displays with filter button in it
                                expect(reportServicePage.reportRecordsCount.getText()).toContain('0 of 6');
                                expect(reportFacetsPage.reportFacetFilterBtn.isDisplayed()).toBeTruthy();
                                done();
                            } else if (txt !== 'There is no data to display.') {
                                for (var i = 0; i < facetTestcase.facets.length; i++) {
                                    verifyFacetTableResults(facetTestcase.facets[i].group);
                                    done();
                                }
                            }
                        });
                    });
                });
            });

            it('Verify clear all facets tokens from the popUp menu', function(done) {
                e2eRetry.run(function() {
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        reportFacetsPage.waitForElementToBeClickable(reportFacetsPage.reportFacetFilterBtnCaret).then(function() {
                            //Click on facet carat to show popup
                            reportFacetsPage.reportFacetFilterBtnCaret.click().then(function() {
                                //Verify the popup menu is displayed
                                expect(reportFacetsPage.reportFacetPopUpMenu.isDisplayed()).toBeTruthy();
                            });
                        });
                    }).then(function() {
                        //select the facet Items
                        reportFacetsPage.selectGroupAndFacetItems("Text Field", [1, 2, 3, 4]).then(function(facetSelections) {
                            //Map all facet tokens from the facet container
                            reportFacetsPage.reportFacetNameSelections.map(function(tokenName, tokenindex) {
                                return tokenName.getText();
                            }).then(function(selections) {
                                // Sort each array before comparing
                                expect(selections.sort()).toEqual(facetSelections.sort());
                            }).then(function() {
                                e2eBase.sleep(browser.params.smallSleep);
                                reportFacetsPage.waitForFacetsPopupReady().then(function() {
                                    // Finally clear all facets from popup menu
                                    reportFacetsPage.getFacetGroupElement("Text Field").then(function(facetGroupEl) {
                                        reportFacetsPage.waitForElement(facetGroupEl).then(function() {
                                            reportFacetsPage.clickClearAllFacetsIcon(facetGroupEl).then(function() {
                                                e2eBase.sleep(browser.params.smallSleep);
                                                reportFacetsPage.waitForElementToBeClickable(reportFacetsPage.reportFacetFilterBtnCaret).then(function() {
                                                    expect(reportServicePage.reportRecordsCount.getText()).toContain('6');
                                                    done();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });

            //There wont be facet filter button displayed for small breakpoint
            it('Verify clear all facets tokens from the container', function(done) {
                e2eRetry.run(function() {
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        reportFacetsPage.waitForElementToBeClickable(reportFacetsPage.reportFacetFilterBtnCaret).then(function() {
                            //Click on facet carat to show popup
                            reportFacetsPage.reportFacetFilterBtnCaret.click().then(function() {
                                //Verify the popup menu is displayed
                                expect(reportFacetsPage.reportFacetPopUpMenu.isDisplayed()).toBeTruthy();
                            });
                        });
                    }).then(function() {
                        //select the facet Items
                        reportFacetsPage.selectGroupAndFacetItems("Text Field", [1, 2, 3, 4]).then(function(facetSelections) {
                            if (breakpointSize === 'small') {
                                // Verify display of filter search box is false for small breakpoint
                                expect(reportServicePage.reportFilterSearchBox.isDisplayed()).toBeFalsy();
                                //Verify there are no facet tokens displayed in the container
                                expect(element(by.className('facetSelections')).isDisplayed()).toBeFalsy();
                                done();
                            } else {
                                //Map all facet tokens from the facet container
                                reportFacetsPage.reportFacetNameSelections.map(function(tokenName, tokenindex) {
                                    return tokenName.getText();
                                }).then(function(selections) {
                                    // Sort each array before comparing
                                    expect(selections.sort()).toEqual(facetSelections.sort());
                                }).then(function() {
                                    //remove facets by clicking on clear (X) in popup beside Text Field and verify all tokens removed
                                    return reportFacetsPage.waitForElementToBeClickable(reportFacetsPage.reportFacetFilterBtnCaret).then(function() {
                                        return e2eRetry.run(function() {
                                            reportFacetsPage.clearFacetTokensFromContainer().then(function() {
                                                expect(reportServicePage.reportRecordsCount.getText()).toContain('7');
                                                done();
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    });
                });
            });

            it('Negative test to verify a facet dropdown not displayed with report without facetsFIDS', function(done) {
                //go to report page directly
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                // Verify the facet container is not present in DOM without facets for a report.
                reportFacetsPage.waitForElementToBeStale(reportFacetsPage.reportFacetMenuContainer);
                done();
            });

            //TODO: This is not working check with Claire
            xit('Negative test to verify > 200k Text fields shows error message in facet drop down', function(done) {
                var duplicateTextFieldValue;
                reportContentPage.waitForReportContent().then(function() {
                    //Generate 201 duplicate records into table 2.
                    var duplicateRecords = [];
                    // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var table2NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE2]);
                    // Generate the record JSON objects
                    var generatedRecords = e2eBase.recordService.generateRecords(table2NonBuiltInFields, 1);
                    //Create 201 duplicate records
                    var clonedArray = JSON.parse(JSON.stringify(generatedRecords));
                    var dupRecord = clonedArray[0];
                    for (var i = 0; i < 210; i++) {
                        // Add the new record back in to create
                        duplicateRecords.push(dupRecord);
                    }

                    //get the duplicate textField value
                    dupRecord.forEach(function(field) {
                        if (field.id === 6) {
                            duplicateTextFieldValue = field.value;
                        }
                    });
                    //Add 201 duplicate records via bulk records API.
                    return e2eBase.recordService.addBulkRecords(app, app.tables[e2eConsts.TABLE2], duplicateRecords);
                }).then(function() {
                    //Create a new report to do negative testing of >200 text records
                    return e2eBase.reportService.createReportWithFacets(app.id, app.tables[e2eConsts.TABLE2].id, [6]);
                }).then(function() {
                    //load the report
                    e2eBase.reportService.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE2].id, 2);
                    reportContentPage.waitForReportContent();
                }).then(function() {
                    // expand the popup ad select group
                    reportServicePage.waitForElement(reportServicePage.reportsToolBar).then(function() {
                        reportFacetsPage.reportFacetFilterBtnCaret.click().then(function() {
                            //Verify the popup menu is displayed
                            expect(reportFacetsPage.reportFacetPopUpMenu.isDisplayed()).toBeTruthy();
                        });
                    });
                }).then(function() {
                    // Expand the Text Facet group
                    reportFacetsPage.clickFacetGroupElement("Text Field");
                }).then(function() {
                    // Verify the text shows are "too many values to use for filtering"
                    element(by.className('noOptions')).getText().then(function(text) {
                        expect(text).toEqual("Too many values to use for filtering.");
                        done();
                    });
                });
            });
        });
    });
}());
