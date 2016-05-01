(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportSortingPage = requirePO('reportSorting');
    var reportServicePage = new ReportServicePage();
    var reportSortingPage = new ReportSortingPage();
    //include underScore js
    var _ = require('underscore');

    describe('Report Grouping and Sorting SetUp', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;

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

            }).then(function(testRecord) {
                //Create a report with facets [text field and checkbox field]
                return e2eBase.reportService.createReportWithFacets(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7]);
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
         * Grouping/Sorting Test Cases
         */
        describe('Report Grouping and Sorting Tests via PopUp', function() {

            /**
             * Before each test starts just make sure the table list div has loaded
             */
            beforeEach(function(done) {
                    //go to report page directly. Adding this extra step to avoid any leftover errors at the end of each test and also to avoid stale element error.
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '1'));
                reportServicePage.waitForElement(reportServicePage.loadedContentEl);
                done();
            });

            /**
             * Data Provider for reports and faceting results.
             */
            function TestCases() {
                return [
                    {
                        message: 'Only Sort By Date(Start Date)',
                        groupBy: [],
                        sortBy: ['Start Date'],
                        flag: 'sortOnly',
                        expectedTableResults: [
                            ['Chris Baker', 'Planning', 'Server purchase', '3/16/2009', '4/10/2009', '-15250284452.47152052910053 weeks', '100.00000000000000%'],
                            ['Chris Baker', 'Development', 'Upgrade DBMS', '3/19/2009', '4/28/2009', '0.0020410978836 weeks', '99.00000000000000%'],
                            ['Angela Leon', 'Planning', 'Workstation purchase', '3/21/2009', '4/10/2009', '15250284452.47152052910053 weeks', '99.00000000000000%'],
                            ['Jon Neil', 'Development', 'Install latest software', '3/31/2009', '4/28/2009', '15250284452.47152052910053 weeks', '100.00000000000000%']
                        ]
                    },
                    {
                        message: 'Only Group By User Field(User Name)',
                        groupBy: ['User Name'],
                        sortBy: [],
                        flag: 'groupOnly',
                        expectedTableResults: [
                            ['', '', '', '', '', ''],
                            ['', '', '', '', '', ''],
                            ['', '', '', '', '', ''],
                            ['Development', 'Install latest software', '3/31/2009', '4/28/2009', '15250284452.47152052910053 weeks', '100.00000000000000%'],
                            ['Development', 'Upgrade DBMS', '3/19/2009', '4/28/2009', '0.0020410978836 weeks', '99.00000000000000%'],
                            ['Planning', 'Server purchase', '3/16/2009', '4/10/2009', '-15250284452.47152052910053 weeks', '100.00000000000000%'],
                            ['Planning', 'Workstation purchase', '3/21/2009', '4/10/2009', '15250284452.47152052910053 weeks', '99.00000000000000%']
                        ]
                    },
                    {
                        message: 'Single Field - GroupBy Text field(Project Phase) and SortBy Numeric(% Completed) ',
                        groupBy: ['Project Phase'],
                        sortBy: ['% Completed'],
                        flag: 'sortAndGrp',
                        expectedTableResults: [
                            ['', '', '', '', '', ''],
                            ['Chris Baker', 'Upgrade DBMS', '3/19/2009', '4/28/2009', '0.0020410978836 weeks', '99.00000000000000%'],
                            ['Jon Neil', 'Install latest software', '3/31/2009', '4/28/2009', '15250284452.47152052910053 weeks', '100.00000000000000%'],
                            ['', '', '', '', '', ''],
                            ['Angela Leon', 'Workstation purchase', '3/21/2009', '4/10/2009', '15250284452.47152052910053 weeks', '99.00000000000000%'],
                            ['Chris Baker', 'Server purchase', '3/16/2009', '4/10/2009', '-15250284452.47152052910053 weeks', '100.00000000000000%']
                        ]
                    },
                    {
                        message: 'Multiple Fields - GroupBy Duration field and user field  and SortBy Numeric(% Completed) and Text field(Project Phase)',
                        groupBy: ["Project Phase", "% Completed"],
                        sortBy: ["Duration Taken", "Start Date"],
                        flag: 'sortAndGrp',
                        expectedTableResults: [
                            ['', '', '', '', '', ''],
                            ['', '', '', '', '', ''],
                            ['Chris Baker', 'Upgrade DBMS', '3/19/2009', '4/28/2009', '0.0020410978836 weeks', ''],
                            ['', '', '', '', '', ''],
                            ['Jon Neil', 'Install latest software', '3/31/2009', '4/28/2009', '15250284452.47152052910053 weeks', ''],
                            ['', '', '', '', '', ''],
                            ['', '', '', '', '', ''],
                            ['Chris Baker', 'Server purchase', '3/16/2009', '4/10/2009', '-15250284452.47152052910053 weeks', ''],
                            ['', '', '', '', '', ''],
                            ['Angela Leon', 'Workstation purchase', '3/21/2009', '4/10/2009', '15250284452.47152052910053 weeks', '']
                        ]
                    }

                ];
            }

            TestCases().forEach(function(testCase) {
                it('' + testCase.message, function(done) {
                    //go to report page directly
                    reportServicePage.waitForElement(reportSortingPage.reportSortingGroupingContainer).then(function() {
                        reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                            reportSortingPage.reportSortAndGroupBtn.click();
                            // Sleep needed for animation of drop down
                            e2eBase.sleep(browser.params.smallSleep);
                            //Verify grouping/sorting popOver
                            reportServicePage.waitForElement(reportSortingPage.sortAndGrpDialogueResetBtn).then(function() {
                                //Verify the title
                                expect(reportSortingPage.reportSortAndGroupTitle.getAttribute('innerText')).toEqual('Sort & Group');
                                //Verify title of groupBy
                                expect(reportSortingPage.reportGroupByContainerTitle.getText()).toEqual('Group');
                            }).then(function() {
                                //Select group By items
                                for (var i = 0; i < testCase.groupBy.length; i++) {
                                    reportSortingPage.selectGroupByItems(testCase.groupBy[i]);
                                }
                                //verify the field name, delete button, sort button and prefix
                                reportSortingPage.verifySelectedGroupByFields(testCase.groupBy);

                            }).then(function() {
                                //Select sort By items
                                for (var i = 0; i < testCase.sortBy.length; i++) {
                                    reportSortingPage.selectSortByItems(testCase.sortBy[i]);
                                }
                                //verify the field name, delete button, sort button and prefix
                                reportSortingPage.verifySelectedSortByFields(testCase.sortBy);
                            }).then(function() {
                                //Click apply button
                                reportSortingPage.sortAndGrpDialogueApplyBtn.click();
                                reportServicePage.waitForElement(reportServicePage.loadedContentEl);
                            }).then(function() {
                                // Get all records from table before filter applied
                                reportServicePage.agGridRecordElList.map(function(row) {
                                    if (testCase.flag.includes("sortOnly")) {
                                        //return all 8 columns
                                        return [
                                            row.all(by.className('ag-cell-no-focus')).get(2).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(3).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(4).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(5).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(6).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(7).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(8).getText()
                                        ];
                                    } else {
                                        //return only 7 rows because the grouped row will be removed in the UI
                                        return [
                                            row.all(by.className('ag-cell-no-focus')).get(2).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(3).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(4).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(5).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(6).getText(),
                                            row.all(by.className('ag-cell-no-focus')).get(7).getText()
                                        ];
                                    }
                                }).then(function(groupingSortingTableResults) {
                                    console.log("the results are: " + groupingSortingTableResults);
                                    //verify the sorting/grouping results with expected
                                    if (testCase.flag.includes("sortOnly") || testCase.flag.includes("sortAndGrp")) {
                                        //results are already sorted
                                        expect(groupingSortingTableResults).toEqual(testCase.expectedTableResults);
                                    }
                                    if (testCase.flag.includes("groupOnly")) {
                                        //for group only they are not sorted
                                        expect(groupingSortingTableResults.sort()).toEqual(testCase.expectedTableResults.sort());
                                    }
                                    done();
                                });
                            });
                        });
                    });
                });
            });


        }); //test cases describe block
        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    }); //topmost setup describe block
}());
