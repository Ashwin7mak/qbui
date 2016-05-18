(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportSortingPage = requirePO('reportSorting');
    var ReportFacetsPage = requirePO('reportFacets');
    var reportServicePage = new ReportServicePage();
    var reportSortingPage = new ReportSortingPage();
    var reportFacetsPage = new ReportFacetsPage();

    describe('Report Grouping and Sorting Via Icon Tests', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;
        var groupedTableResults = [];

        var durationMax = '9223372036854775807';
        var durationMin = '-9223372036854775807';

        var user1 = {
            id: null,
            firstName: 'Chris',
            lastName: 'Baker',
            screenName: 'Chris_Baker@example.com',
            email: 'Chris_Baker@example.com',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer: 'blue',
            password: 'quickbase'
        };
        var user2 = {
            id: null,
            firstName: 'Chris',
            lastName: 'Baker',
            screenName: 'Gregory_Baxter@example.com',
            email: 'Gregory_Baxter@example.com',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer: 'blue',
            password: 'quickbase'
        };
        var user3 = {
            id: null,
            firstName: 'Angela',
            lastName: 'Leon',
            screenName: 'Angela_Leon@example.com',
            email: 'Angela_Leon@example.com',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer: 'blue',
            password: 'quickbase'
        };
        var user4 = {
            id: null,
            firstName: 'Jon',
            lastName: 'Neil',
            screenName: 'Jon_Neil@example.com',
            email: 'Jon_Neil@example.com',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer: 'blue',
            password: 'quickbase'
        };

        beforeAll(function(done) {
            var testRecord1;
            var testRecord2;
            var testRecord3;
            var testRecord4;

            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['User Name'] = {fieldType: consts.SCALAR, dataType: consts.USER};
            tableToFieldToFieldTypeMap['table 1']['Project Phase'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Task Name'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Start Date'] = {fieldType: consts.SCALAR, dataType: consts.DATE};
            tableToFieldToFieldTypeMap['table 1']['Finish Date'] = {fieldType: consts.SCALAR, dataType: consts.DATE};
            tableToFieldToFieldTypeMap['table 1']['Duration Taken'] = {fieldType: consts.SCALAR, dataType: consts.DURATION};
            tableToFieldToFieldTypeMap['table 1']['% Completed'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};

            e2eBase.basicSetup(tableToFieldToFieldTypeMap, 0).then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];

                //create records with 4 different user fields
                e2eBase.recordBase.apiBase.createSpecificUser(user1).then(function(userResponse) {
                    testRecord1 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Development'}, {'id': 8, 'value': 'Upgrade DBMS'}, {'id': 9, 'value': '2009-03-19'}, {'id': 10, 'value': '2009-04-28'}, {'id': 11, 'value': 1234456}, {'id': 12, 'value': 99}]];
                    return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord1);
                });
                e2eBase.recordBase.apiBase.createSpecificUser(user2).then(function(userResponse) {
                    testRecord2 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Planning'}, {'id': 8, 'value': 'Server purchase'}, {'id': 9, 'value': '2009-03-16'}, {'id': 10, 'value': '2009-04-10'}, {'id': 11, 'value': +durationMax}, {'id': 12, 'value': 100}]];
                    return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord2);
                });
                e2eBase.recordBase.apiBase.createSpecificUser(user3).then(function(userResponse) {
                    testRecord3 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Planning'}, {'id': 8, 'value': 'Workstation purchase'}, {'id': 9, 'value': '2009-03-21'}, {'id': 10, 'value': '2009-04-10'}, {'id': 11, 'value': +durationMin}, {'id': 12, 'value': 99}]];
                    return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord3);
                });
                e2eBase.recordBase.apiBase.createSpecificUser(user4).then(function(userResponse) {
                    testRecord4 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Development'}, {'id': 8, 'value': 'Install latest software'}, {'id': 9, 'value': '2009-03-31'}, {'id': 10, 'value': '2009-04-28'}, {'id': 11, 'value': +durationMin}, {'id': 12, 'value': 100}]];
                    return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord4);
                });
            }).then(function() {
                //Create a report with sorting and grouping (Sort startDate asc)
                return e2eBase.reportService.createReportWithFids(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10, 11, 12]);
            }).then(function() {
                //Create a report with sorting and grouping (Sort startDate asc and group by User Name)
                return e2eBase.reportService.createReportWithSortAndGroup(app.id, app.tables[e2eConsts.TABLE1].id, ["-9", "6:V"]);
            }).then(function() {
                //Create a report with facets [text field and checkbox field]
                return e2eBase.reportService.createReportWithFidsAndFacetsAndSortLists(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10, 11, 12], [7, 8], ["6:V", "7:V", "12:V", "9", "-11"]);
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
                reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    done();
                });
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                done.fail('Error during test setup beforeAll: ' + error.message);
            });
        });

        /*
         * Funstion to get the sorted/grouped table results
         * @Param:groupArrayLength (no of group fields)
         */
        var verifyTableResults = function(groupOnlySort, expectedResults) {
            // Get all records from table after grp/sort
            reportServicePage.waitForElement(reportServicePage.agGridContainerEl).then(function() {
                reportServicePage.agGridRecordElList.map(function(row) {
                    return row.getText().then(function(text) {
                        groupedTableResults.push([text.replace(/\n/g, ",")]);
                    });
                });
            }).then(function() {
                if (groupOnlySort === true) {
                    console.log("the grouped results are: " + groupedTableResults);
                    //sort the arrays and compare
                    expect(groupedTableResults.sort()).toEqual(expectedResults.sort());
                } else {
                    //the arrays are already sorted
                    //verify the sorting/grouping results with expected
                    expect(groupedTableResults).toEqual(expectedResults);
                }
            }).then(function() {
                //clean up the array
                groupedTableResults = [];
            });
        };

        /*
         * XLARGE BREAKPOINT - Grouping/Sorting Via PopUp Test Cases using No-Facets No-Groups/Sorts Yes-Fids setup in reports
         */
        describe('XLARGE: Report Settings: No-Facets No-Groups/Sorts Yes-Fids', function() {

            beforeAll(function(done) {
                e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    done();
                });
            });

            beforeEach(function(done) {
                //go to report page directly
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '2'));
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    reportServicePage.waitForElement(reportSortingPage.reportSortingGroupingContainer);
                    done();
                });
            });

            /**
             * Data Provider for sortBy/GrpBy.
             */
            function TestCases() {
                return [
                    {
                        message: 'Sort Only By Start Date',
                        groupBy: [],
                        sortBy: ['Start Date'],
                        flag: 'sortOnly',
                        expectedTableResults: [
                            ['Chris Baker,Planning,Server purchase,3/16/2009,4/10/2009,-15250284452.47152052910053 weeks,100.00000000000000%'],
                            ['Chris Baker,Development,Upgrade DBMS,3/19/2009,4/28/2009,0.0020410978836 weeks,99.00000000000000%'],
                            ['Angela Leon,Planning,Workstation purchase,3/21/2009,4/10/2009,15250284452.47152052910053 weeks,99.00000000000000%'],
                            ['Jon Neil,Development,Install latest software,3/31/2009,4/28/2009,15250284452.47152052910053 weeks,100.00000000000000%']
                        ]
                    },
                    {
                        message: 'Group Only By User Field',
                        groupBy: ['User Name'],
                        sortBy: [],
                        flag: 'groupOnly',
                        expectedTableResults: [
                            ['Chris Baker'],
                            ['Development,Upgrade DBMS,3/19/2009,4/28/2009,0.0020410978836 weeks,99.00000000000000%'],
                            ['Planning,Server purchase,3/16/2009,4/10/2009,-15250284452.47152052910053 weeks,100.00000000000000%'],
                            ['Jon Neil'],
                            ['Development,Install latest software,3/31/2009,4/28/2009,15250284452.47152052910053 weeks,100.00000000000000%'],
                            ['Angela Leon'],
                            ['Planning,Workstation purchase,3/21/2009,4/10/2009,15250284452.47152052910053 weeks,99.00000000000000%']
                        ]
                    },
                    {
                        message: 'GroupBy Text field(Project Phase) and SortBy Numeric(% Completed) ',
                        groupBy: ['Project Phase'],
                        sortBy: ['% Completed'],
                        flag: 'sortAndGrp',
                        expectedTableResults: [
                            ['Development'],
                            ['Chris Baker,Upgrade DBMS,3/19/2009,4/28/2009,0.0020410978836 weeks,99.00000000000000%'],
                            ['Jon Neil,Install latest software,3/31/2009,4/28/2009,15250284452.47152052910053 weeks,100.00000000000000%'],
                            ['Planning'],
                            ['Angela Leon,Workstation purchase,3/21/2009,4/10/2009,15250284452.47152052910053 weeks,99.00000000000000%'],
                            ['Chris Baker,Server purchase,3/16/2009,4/10/2009,-15250284452.47152052910053 weeks,100.00000000000000%']
                        ]
                    },
                    {
                        message: 'GroupBy Duration field and user field  and SortBy Numeric(% Completed) and Text field(Project Phase)',
                        groupBy: ["Project Phase", "% Completed"],
                        sortBy: ["Duration Taken", "Start Date"],
                        flag: 'sortAndGrp',
                        expectedTableResults: [
                            ['Development'],
                            ['99.00000000000000%'],
                            ['Chris Baker,Upgrade DBMS,3/19/2009,4/28/2009,0.0020410978836 weeks'],
                            ['100.00000000000000%'],
                            ['Jon Neil,Install latest software,3/31/2009,4/28/2009,15250284452.47152052910053 weeks'],
                            ['Planning'],
                            ['100.00000000000000%'],
                            ['Chris Baker,Server purchase,3/16/2009,4/10/2009,-15250284452.47152052910053 weeks'],
                            ['99.00000000000000%'],
                            ['Angela Leon,Workstation purchase,3/21/2009,4/10/2009,15250284452.47152052910053 weeks']
                        ]
                    }

                ];
            }

            TestCases().forEach(function(testCase) {
                it('' + testCase.message, function(done) {
                    reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                        //click on sort/grp Icon
                        reportSortingPage.clickSortAndGroupIcon();
                    }).then(function() {
                        //Verify the title
                        expect(reportSortingPage.reportSortAndGroupTitle.getAttribute('innerText')).toEqual('Sort & Group');
                        //Verify title of groupBy
                        expect(reportSortingPage.reportGroupByContainerTitle.getText()).toEqual('Group');
                    }).then(function() {
                        //Select group By items
                        for (var i = 0; i < testCase.groupBy.length; i++) {
                            reportSortingPage.selectGroupByItems(testCase.groupBy[i]);
                        }
                    }).then(function() {
                        //Select sort By items
                        for (var i = 0; i < testCase.sortBy.length; i++) {
                            reportSortingPage.selectSortByItems(testCase.sortBy[i]);
                        }
                    }).then(function() {
                        //verify the grpBy fields
                        //verify the field name, delete button, sort button and prefix
                        reportSortingPage.verifySelectedGroupByFields(testCase.groupBy);
                    }).then(function() {
                        //Verify the sortBy fields
                        //verify the field name, delete button, sort button and prefix
                        reportSortingPage.verifySelectedSortByFields(testCase.sortBy);
                    }).then(function() {
                        //Click apply button
                        reportSortingPage.clickApply();
                    }).then(function() {
                        //verify the sorting/grouping results with expected
                        if (testCase.flag.includes("groupOnly")) {
                            verifyTableResults(true, testCase.expectedTableResults);
                        } else {
                            // Verify table results with expected
                            verifyTableResults(false, testCase.expectedTableResults);
                        }
                        done();
                    });
                });
            });

            it('Verify you can add not more than 3 fields in GrpBy and not more than 5 in SortBy', function(done) {
                var grpFields = ["Project Phase", "% Completed", "more fields...", "Date Created"];
                var sortFields = ["Start Date", "Finish Date", "Duration Taken", "Task Name", "User Name"];
                reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                    //click on sort/grp Icon
                    reportSortingPage.clickSortAndGroupIcon();
                }).then(function() {
                    //Select group By items
                    for (var i = 0; i < grpFields.length; i++) {
                        reportSortingPage.selectGroupByItems(grpFields[i]);
                    }
                }).then(function() {
                    //Select sort By items
                    for (var i = 0; i < sortFields.length; i++) {
                        reportSortingPage.selectSortByItems(sortFields[i]);
                    }
                }).then(function() {
                    //Verify no more fields can be added after 3 fields in GrpBy
                    reportSortingPage.reportGroupByContainer.all(by.className('empty')).then(function(grpItems) {
                        expect(grpItems.length).toBe(0);
                    });
                }).then(function() {
                    //Verify no more fields can be added after 3 fields in sortBy
                    reportSortingPage.reportSortByContainer.all(by.className('empty')).then(function(sortItems) {
                        expect(sortItems.length).toBe(0);
                        done();
                    });
                });
            });
        }); //XLARGE describe block

        /*
         * LARGE BREAKPOINT - Grouping/Sorting Via PopUp Test Cases using No-Facets No-Groups/Sorts Yes-Fids setup in reports
         */
        describe('LARGE : Report Settings : No-Facets No-Groups/Sorts Yes-Fids ', function() {
            beforeAll(function(done) {
                e2eBase.resizeBrowser(e2eConsts.LARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    done();
                });
            });

            beforeEach(function(done) {
                //go to report page directly
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '2'));
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    reportServicePage.waitForElement(reportSortingPage.reportSortingGroupingContainer);
                    done();
                });
            });

            /**
             * Data Provider for reports and faceting results.
             */
            function sortIconTestCases() {
                return [
                    {
                        message: 'SortBy field with descending via sortOrderIcon',
                        groupBy: [],
                        sortBy: ['Start Date'],
                        sortOrderIconInGrpBy: [],
                        sortOrderIconInSortBy: [{fieldIndex:0, sortOrder:'desc'}],
                        expectedTableResults: [
                            ['Jon Neil,Development,Install latest software,3/31/2009,4/28/2009,15250284452.47152052910053 weeks,100.00000000000000%'],
                            ['Angela Leon,Planning,Workstation purchase,3/21/2009,4/10/2009,15250284452.47152052910053 weeks,99.00000000000000%'],
                            ['Chris Baker,Development,Upgrade DBMS,3/19/2009,4/28/2009,0.0020410978836 weeks,99.00000000000000%'],
                            ['Chris Baker,Planning,Server purchase,3/16/2009,4/10/2009,-15250284452.47152052910053 weeks,100.00000000000000%'],
                        ]
                    },
                    {
                        message: 'GroupBy field with descending via sortOrderIcon',
                        groupBy: ['% Completed'],
                        sortBy: ['Start Date'],
                        sortOrderIconInGrpBy: [{fieldIndex:0, sortOrder:'desc'}],
                        sortOrderIconInSortBy: [{fieldIndex:0, sortOrder:'desc'}],
                        expectedTableResults: [
                            ['100.00000000000000%'],
                            ['Jon Neil,Development,Install latest software,3/31/2009,4/28/2009,15250284452.47152052910053 weeks'],
                            ['Chris Baker,Planning,Server purchase,3/16/2009,4/10/2009,-15250284452.47152052910053 weeks'],
                            ['99.00000000000000%'],
                            ['Angela Leon,Planning,Workstation purchase,3/21/2009,4/10/2009,15250284452.47152052910053 weeks'],
                            ['Chris Baker,Development,Upgrade DBMS,3/19/2009,4/28/2009,0.0020410978836 weeks']
                        ]
                    },
                    {
                        message: 'SortBy field with descending and GroupBy with ascending via sortOrderIcon',
                        groupBy: ['Project Phase'],
                        sortBy: ['Start Date', '% Completed'],
                        sortOrderIconInGrpBy: [{fieldIndex:0, sortOrder:'desc'}],
                        sortOrderIconInSortBy: [{fieldIndex:1, sortOrder:'desc'}],
                        expectedTableResults: [
                            ['Planning'],
                            ['Chris Baker,Server purchase,3/16/2009,4/10/2009,-15250284452.47152052910053 weeks,100.00000000000000%'],
                            ['Angela Leon,Workstation purchase,3/21/2009,4/10/2009,15250284452.47152052910053 weeks,99.00000000000000%'],
                            ['Development'],
                            ['Chris Baker,Upgrade DBMS,3/19/2009,4/28/2009,0.0020410978836 weeks,99.00000000000000%'],
                            ['Jon Neil,Install latest software,3/31/2009,4/28/2009,15250284452.47152052910053 weeks,100.00000000000000%']
                        ]
                    },
                ];
            }

            sortIconTestCases().forEach(function(testCase) {
                it('' + testCase.message, function(done) {
                    reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                        //click on sort/grp Icon
                        reportSortingPage.clickSortAndGroupIcon();
                    }).then(function() {
                        //Select group By items
                        for (var i = 0; i < testCase.groupBy.length; i++) {
                            reportSortingPage.selectGroupByItems(testCase.groupBy[i]);
                        }
                    }).then(function() {
                        //Select sort By items
                        for (var i = 0; i < testCase.sortBy.length; i++) {
                            reportSortingPage.selectSortByItems(testCase.sortBy[i]);
                        }
                    }).then(function() {
                        for (var i = 0; i < testCase.sortOrderIconInGrpBy.length; i++) {
                            // Click on sortOrderIcon in GroupBy Fields
                            reportSortingPage.selectSortByIconInGroupBy(testCase.sortOrderIconInGrpBy[i].fieldIndex, testCase.sortOrderIconInGrpBy[i].sortOrder);
                        }
                    }).then(function() {
                        for (var j = 0; j < testCase.sortOrderIconInSortBy.length; j++) {
                            //Click on sortOrderIcon in SortBy Fields
                            reportSortingPage.selectSortByIconInSortBy(testCase.sortOrderIconInSortBy[j].fieldIndex, testCase.sortOrderIconInSortBy[j].sortOrder);
                        }
                    }).then(function() {
                        //Click apply button
                        reportSortingPage.clickApply();
                    }).then(function() {
                        //verify the sorting/grouping results with expected
                        verifyTableResults(false, testCase.expectedTableResults);
                        done();
                    });
                });
            });

            it('Report Settings: with sortLists no Facets : Verify the Sort & Group popup respects the report settings', function(done) {
                //go to report with sortLists page directly
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '3'));
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    //Verify that popup respects the sortList set in report while loading
                    reportServicePage.waitForElement(reportSortingPage.reportSortingGroupingContainer).then(function() {
                        reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                            //click on sort/grp Icon
                            reportSortingPage.clickSortAndGroupIcon();
                        }).then(function() {
                            //Verify GrpBy has UserName and is in ascending Order
                            reportSortingPage.reportGroupByContainer.all(by.className('notEmpty')).map(function(elm, index) {
                                //verify the sortOrder is ascending
                                expect(elm.element(by.className('sortOrderIcon')).getAttribute('className')).toEqual('action sortOrderIcon up');
                                //verify the field Name is 'User Name
                                elm.element(by.className('fieldName')).getText().then(function(selectedFieldText) {
                                    expect(selectedFieldText).toEqual('User Name');
                                });
                            });
                        }).then(function() {
                            //Verify SryBy has StartDate and is in descending Order
                            reportSortingPage.reportSortByContainer.all(by.className('notEmpty')).map(function(elm, index) {
                                //verify the sortOrder is ascending
                                expect(elm.element(by.className('sortOrderIcon')).getAttribute('className')).toEqual('action sortOrderIcon down');
                                //verify the field Name is 'User Name
                                elm.element(by.className('fieldName')).getText().then(function(selectedFieldText) {
                                    expect(selectedFieldText).toEqual('Start Date');
                                    done();
                                });
                            });
                        });
                    });
                });
            });


        }); //large breakpoints describe block end

        /*
         * MEDIUM BREAKPOINT - Use Report with facets - deleteIcon Via PopUp Test Cases
         */

        describe('MEDIUM: Report Settings: with Facets and sortLists: ', function() {

            beforeAll(function(done) {
                e2eBase.resizeBrowser(e2eConsts.MEDIUM_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    done();
                });
            });

            beforeEach(function(done) {
                //go to report with facets page directly
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '4'));
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    reportServicePage.waitForElement(reportSortingPage.reportSortingGroupingContainer);
                    done();
                });
            });

            xit('Verify the popUp respects report settings', function(done) { //TODO Don is fixing on sorting inside grouping.
                var expectedTableResultsAfterFilter = [
                    ['Chris Baker'],
                    ['Development'],
                    ['99.00000000000000%'],
                    ['Upgrade DBMS,3/19/2009,4/28/2009,0.0020410978836 weeks'],
                    ['Jon Neil'],
                    ['Development'],
                    ['100.00000000000000%'],
                    ['Install latest software,3/31/2009,4/28/2009,15250284452.47152052910053 weeks']
                ];

                reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                    //click on sort/grp Icon
                    reportSortingPage.clickSortAndGroupIcon();
                }).then(function() {
                    //verify the sort and grp fields
                    //verify the field name, delete button, sort button and prefix
                    reportSortingPage.verifySelectedGroupByFields(['User Name', 'Project Phase', '% Completed']);
                }).then(function() {
                    //verify the field name, delete button, sort button and prefix
                    reportSortingPage.verifySelectedSortByFields(['Start Date', 'Duration Taken']);
                }).then(function() {
                    //close the sort/Grp popUp
                    reportSortingPage.reportSortAndGroupCloseBtn.click();
                }).then(function() {
                    //verify facet Items
                    // Click on facet carat
                    reportFacetsPage.reportFacetFilterBtnCaret.click().then(function() {
                        //Verify the popup menu is displayed
                        expect(reportFacetsPage.reportFacetPopUpMenu.isDisplayed()).toBeTruthy();
                    });
                }).then(function() {
                    reportFacetsPage.unselectedFacetGroupsElList.map(function(elm) {
                        return elm.getText();
                    }).then(function(expectedFacets) {
                        expect(expectedFacets).toEqual(['Project Phase', 'Task Name']);

                    }).then(function() {
                        //apply the filter and verify the results
                        reportFacetsPage.selectGroupAndFacetItems("Project Phase", [0]).then(function() {
                            //click outside to collapse the popup.
                            reportServicePage.reportFilterSearchBox.click().then(function() {
                                //sleep for loading of table to finish
                                e2eBase.sleep(browser.params.smallSleep);
                                //verify the filtered results (filter by Project Phase - > Development)
                                //passing group by length is 0 to below method because I am deleting all grp by fields in this testcase
                                verifyTableResults(false, expectedTableResultsAfterFilter);
                                done();
                            });
                        });
                    });
                });
            });

            /**
             * Data Provider for delete Icon Tests
             */
            function deleteIconTestCases() {
                return [
                    {
                        message: 'Delete Sort and Grp Fields via DeleteIcon',
                        groupBy: ['User Name', 'Project Phase', '% Completed'],
                        sortBy: ['Start Date', 'Duration Taken'],
                        deleteIconInGrpBy: [{fieldIndex: 2}, {fieldIndex: 1}, {fieldIndex: 0}],
                        deleteIconInSortBy: [{fieldIndex: 1}],
                        expectedTableResultsAfterDelete: [
                            ['Chris Baker,Planning,Server purchase,3/16/2009,4/10/2009,-15250284452.47152052910053 weeks,100.00000000000000%'],
                            ['Chris Baker,Development,Upgrade DBMS,3/19/2009,4/28/2009,0.0020410978836 weeks,99.00000000000000%'],
                            ['Angela Leon,Planning,Workstation purchase,3/21/2009,4/10/2009,15250284452.47152052910053 weeks,99.00000000000000%'],
                            ['Jon Neil,Development,Install latest software,3/31/2009,4/28/2009,15250284452.47152052910053 weeks,100.00000000000000%']
                        ]
                    },
                ];
            }

            deleteIconTestCases().forEach(function(testCase) {
                it('' + testCase.message, function(done) {
                    reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                        //click on sort/grp Icon
                        reportSortingPage.clickSortAndGroupIcon();
                    }).then(function() {
                        //delete fields in Grp By
                        for (var i = 0; i < testCase.deleteIconInGrpBy.length; i++) {
                            reportSortingPage.deleteFieldsInGroupBy(testCase.deleteIconInGrpBy[i].fieldIndex, testCase.groupBy);
                        }
                    }).then(function() {
                        //delete fields in sort By
                        for (var j = 0; j < testCase.deleteIconInSortBy.length; j++) {
                            reportSortingPage.deleteFieldsInSortBy(testCase.deleteIconInSortBy[j].fieldIndex, testCase.sortBy);
                        }
                    }).then(function() {
                        //Click apply button
                        reportSortingPage.clickApply();
                    }).then(function() {
                        // Verify table results with expected
                        //passing group by length is 0 to below method because I am deleting all grp by fields in this testcase
                        verifyTableResults(false, testCase.expectedTableResultsAfterDelete);
                    }).then(function() {
                        reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                            //click on sort/grp Icon
                            reportSortingPage.clickSortAndGroupIcon();
                        }).then(function() {
                            //Verify that you can add back the deleted field
                            reportSortingPage.selectGroupByItems("User Name");
                            done();
                        });
                    });
                });
            });
        }); //medium breakpoints describe block end

        /*
         * SMALL BREAKPOINT - Use Reports without facets or sortLists
         */

        describe('SMALL: Report Settings: No Facets No sortLists', function() {

            beforeAll(function(done) {
                e2eBase.resizeBrowser(e2eConsts.SMALL_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    //go to report page directly
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '1'));
                    done();
                });
            });

            beforeEach(function(done) {
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    reportServicePage.waitForElement(reportSortingPage.reportSortingGroupingContainer);
                    done();
                });
            });


            it('Verify Apply and Reset button locations ', function(done) {
                reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                    //click on sort/grp Icon
                    reportSortingPage.reportSortAndGroupBtn.click().then(function() {
                        // Sleep needed for animation of drop down
                        e2eBase.sleep(browser.params.smallSleep);
                        reportServicePage.waitForElement(reportSortingPage.sortAndGrpDialogueSBApplyBtn);
                    }).then(function() {
                        //Verify apply button on top
                        expect(reportSortingPage.sortAndGrpDialogueSBApplyBtn.getAttribute('scrollTop')).toEqual('0');
                        expect(reportSortingPage.sortAndGrpDialogueSBApplyBtn.getAttribute('clientTop')).toEqual('0');
                        //Verify Reset is at the bottom.
                        expect(reportSortingPage.sortAndGrpDialogueSBRestBtn.getAttribute('clientTop')).toEqual('0');
                        expect(reportSortingPage.sortAndGrpDialogueSBRestBtn.getAttribute('clientLeft')).toEqual('0');
                    }).then(function() {
                        //close the popup
                        reportSortingPage.reportSortAndGroupSBCloseBtn.click().then(function() {
                            reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn);
                            done();
                        });
                    });
                });
            });

            /**
             * Data Provider for more Fields Tests
             */
            function moreFieldsTestCases() {
                return [
                    {
                        message: 'Select more Fields link and select items below that',
                        groupBy: ['more fields...', 'Date Created'],
                        sortBy: ['Date Modified', 'Last Modified By']
                    },
                ];
            }

            moreFieldsTestCases().forEach(function(testCase) {
                it('Verify clicking on more fields link in GrpBy and sortBy', function(done) {
                    reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                        //click on sort/grp Icon
                        reportSortingPage.reportSortAndGroupBtn.click().then(function() {
                            // Sleep needed for animation of drop down
                            e2eBase.sleep(browser.params.smallSleep);
                            reportServicePage.waitForElement(reportSortingPage.sortAndGrpDialogueSBApplyBtn);
                        }).then(function() {
                            for (var i = 0; i < testCase.groupBy.length; i++) {
                                reportSortingPage.selectGroupByItems(testCase.groupBy[i]);
                            }
                        }).then(function() {
                            reportSortingPage.verifySelectedGroupByFields(['Date Created']);
                        }).then(function() {
                            for (var j = 0; j < testCase.sortBy.length; j++) {
                                //select sortBy fields
                                reportSortingPage.selectSortByItems(testCase.sortBy[j]);
                            }
                        }).then(function() {
                            //verify sortBy fields
                            reportSortingPage.verifySelectedSortByFields(testCase.sortBy);
                        }).then(function() {
                            //hit Reset
                            reportSortingPage.sortAndGrpDialogueSBRestBtn.click();
                            reportServicePage.waitForElement(reportServicePage.loadedContentEl);
                        }).then(function() {
                            reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                                //verify all cleared after reset
                                //click on sort/grp Icon
                                reportSortingPage.reportSortAndGroupBtn.click();
                                e2eBase.sleep(browser.params.smallSleep);
                                reportServicePage.waitForElement(reportSortingPage.sortAndGrpDialogueSBApplyBtn);
                            });
                        }).then(function() {
                            //verify all cleared in grpBy
                            reportSortingPage.reportGroupByContainer.all(by.className('notEmpty')).then(function(grpItems) {
                                expect(grpItems.length).toBe(0);
                            });
                        }).then(function() {
                            //verify all cleared in sortBy
                            reportSortingPage.reportSortByContainer.all(by.className('notEmpty')).then(function(sortItems) {
                                expect(sortItems.length).toBe(0);
                            });
                        }).then(function() {
                            //finally close the popup
                            reportSortingPage.reportSortAndGroupSBCloseBtn.click();
                            done();
                        });
                    });
                });
            });
        }); //small breakpoints describe block end.

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });

    }); //topmost setup describe block
}());
