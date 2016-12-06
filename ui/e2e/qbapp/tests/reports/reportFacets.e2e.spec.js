/**
 * E2E Faceting tests for the report on the Reports page
 * Created by lkamineni on 21/02/16
 */

(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var reportServicePage = new ReportServicePage();
    var RequestAppsPage = requirePO('requestApps');
    var ReportFacetsPage = requirePO('reportFacets');
    var reportFacetsPage = new ReportFacetsPage();
    var ReportContentPage = requirePO('reportContent');
    var reportContentPage = new ReportContentPage();
    var NewStackAuthPO = requirePO('newStackAuth');
    var newStackAuthPO = new NewStackAuthPO();

    describe('Report Faceting Test Setup', function() {
        var realmName;
        var realmId;
        var testApp;

        beforeAll(function(done) {
            e2eBase.fullReportsSetup(5).then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                testApp = appAndRecords[0];
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                // Auth into the new stack
                newStackAuthPO.realmLogin(realmName, realmId);
            }).then(function() {
                // Go to report directly
                e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 4);
                reportContentPage.waitForReportContent().then(function() {
                    done();
                });
            });
        });

        /*
         * Facet Test Cases
         */
        describe('Report Faceting Tests', function() {
            /**
             * Before each test starts just make sure the table list div has loaded
             */
            beforeEach(function(done) {
                //go to report page directly
                e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 4);
                reportContentPage.waitForReportContent().then(function() {
                    done();
                });
            });

            /**
             * Determine if an array contains one or more items from another array.
             * @param {array} haystack the array to search.
             * @param {array} arr the array providing items to check for in the haystack.
             * @return {boolean} true|false if haystack contains at least one item from arr.
             */
            var findOne = function(haystack, arr) {
                return arr.some(function(v) {
                    return haystack.indexOf(v) >= 0;
                });
            };

            /**
             * Function that will verify the filtered rows are contained in actual record list.
             * @param facets Group
             */
            var verifyFacetRecordResults = function(facetSelections) {
                // Get the number of records being displayed
                return reportServicePage.agGridRecordElList.then(function(records) {
                    // Loop through each record and check their field values for one of the facet selections
                    for (var i = 0; i < records.length; i++) {
                        reportContentPage.getRecordValues(i).then(function(values) {
                            var result = findOne(values, facetSelections);
                            expect(result).toBe(true);
                        });
                    }
                });
            };

            it('Verify reports toolbar', function(done) {
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
                    //TODO: PO Functions aren't handling this properly
                    //{
                    //    message: 'Verify more filters - Create text facet',
                    //    facets: [{"group": "Text Field", "ItemIndex": [1, 5]}]
                    //},
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
                    //TODO: Need to handle multiple facet groups in test case below
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

            facetTestCases().forEach(function(facetTestcase) {
                it('Test case: ' + facetTestcase.message, function(done) {
                    reportFacetsPage.waitForElementToBeClickable(reportFacetsPage.reportFacetFilterBtnCaret).then(function() {
                        // Click on facet carat
                        return reportFacetsPage.reportFacetFilterBtnCaret.click();
                    }).then(function() {
                        // Verify the popup menu is displayed
                        return reportFacetsPage.waitForElement(reportFacetsPage.reportFacetPopUpMenu);
                    }).then(function() {
                        // Select facet group and items
                        return reportFacetsPage.selectGroupAndFacetItems(facetTestcase.facets[0].group, facetTestcase.facets[0].ItemIndex);
                    }).then(function(facetSelections) {
                        // Get facet tokens from the reports toolbar
                        return reportFacetsPage.reportFacetNameSelections.map(function(tokenName, tokenindex) {
                            return tokenName.getText();
                        }).then(function(facetTokens) {
                            // Sort each array before then check facet tokens match the facet selections from the popup
                            //TODO for edge the facet tokens shows one after the other with return character at the end
                            expect(facetTokens.sort()).toEqual(facetSelections.sort());
                            return facetSelections;
                        });
                    }).then(function(facetSelections) {
                        // Check that the records displayed have fields containing values of one of the selected facet items
                        return verifyFacetRecordResults(facetSelections);
                    }).then(function() {
                        done();
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
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, "1"));
                // Verify the facet container is not present in DOM without facets for a report.
                reportFacetsPage.waitForElementToBeStale(reportFacetsPage.reportFacetMenuContainer);
                done();
            });

            //TODO: Write a negative test that no records are shown if none match selected facets
            //reportServicePage.griddleWrapperEl.getAttribute('innerText').then(function(txt) {
            //  if (txt === 'There is no data to display.') {
            //Verify the toolbar still displays with filter button in it
            //  expect(reportServicePage.reportRecordsCount.getText()).toContain('0 of 6');
            //  expect(reportFacetsPage.reportFacetFilterBtn.isDisplayed()).toBeTruthy();
            //});

            //TODO: This is not working check with Claire
            xit('Negative test to verify > 200k Text fields shows error message in facet drop down', function(done) {
                var duplicateTextFieldValue;
                reportContentPage.waitForReportContent().then(function() {
                    //Generate 201 duplicate records into table 2.
                    var duplicateRecords = [];
                    // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var table2NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(testApp.tables[e2eConsts.TABLE2]);
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
                    return e2eBase.recordService.addBulkRecords(testApp, testApp.tables[e2eConsts.TABLE2], duplicateRecords);
                }).then(function() {
                    //Create a new report to do negative testing of >200 text records
                    return e2eBase.reportService.createReportWithFacets(testApp.id, testApp.tables[e2eConsts.TABLE2].id, [6]);
                }).then(function() {
                    //load the report
                    e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE2].id, 2);
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
