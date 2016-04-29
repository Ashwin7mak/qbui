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

        /**
         * Data Provider for reports grouping testCases.
         * ['Record ID#', 'User Name Field', 'Text Field', 'Date Field', 'Duration Field',
         'Numeric Field'],
         */
        function groupingTestCases() {
            return [
                //TODO - User field Asc and Desc item text needs to be fixed in UI to A to Z instead of Group lowest to highest.
                {
                    message: 'User Field',
                    ColumnName: 'User Name',
                    ColumnId: 2,
                    GroupAscItemText: 'Group lowest to highest',
                    GroupDescItemText: 'Group highest to lowest',
                    //expected results should be empty since there are no 2 user names in common to group by
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
                    message: 'Text Field',
                    ColumnName: 'Project Phase',
                    ColumnId: 3,
                    GroupAscItemText: 'Group A to Z',
                    GroupDescItemText: 'Group Z to A',
                    expectedTableResults: [
                        ['', '', '', '', '', ''],
                        ['Jon Neil', 'Install latest software', '3/31/2009', '4/28/2009', '15250284452.47152052910053 weeks', '100.00000000000000%'],
                        ['Chris Baker', 'Upgrade DBMS', '3/19/2009', '4/28/2009', '0.0020410978836 weeks', '99.00000000000000%'],
                        ['', '', '', '', '', ''],
                        ['Chris Baker', 'Server purchase', '3/16/2009', '4/10/2009', '-15250284452.47152052910053 weeks', '100.00000000000000%'],
                        ['Angela Leon', 'Workstation purchase', '3/21/2009', '4/10/2009', '15250284452.47152052910053 weeks', '99.00000000000000%']
                    ]
                },
                {
                    message: 'Date Field',
                    ColumnName: 'Start Date',
                    ColumnId: 5,
                    GroupAscItemText: 'Group oldest to newest',
                    GroupDescItemText: 'Group newest to oldest',
                    expectedTableResults: [
                        ['', '', '', '', '', ''],
                        ['', '', '', '', '', ''],
                        ['', '', '', '', '', ''],
                        ['', '', '', '', '', ''],
                        ['Angela Leon', 'Planning', 'Workstation purchase', '4/10/2009', '15250284452.47152052910053 weeks', '99.00000000000000%'],
                        ['Chris Baker', 'Development', 'Upgrade DBMS', '4/28/2009', '0.0020410978836 weeks', '99.00000000000000%'],
                        ['Chris Baker', 'Planning', 'Server purchase', '4/10/2009', '-15250284452.47152052910053 weeks', '100.00000000000000%'],
                        ['Jon Neil', 'Development', 'Install latest software', '4/28/2009', '15250284452.47152052910053 weeks', '100.00000000000000%']
                    ]
                },
                //TODO - Duration not working confirmed with aditi that its not implemented.
                //{
                //    message: 'Duration Field',
                //    ColumnName: 'Duration Taken',
                //    ColumnId: 7,
                //    GroupAscItemText: 'Group lowest to highest',
                //    GroupDescItemText: 'Group highest to lowest',
                //    expectedTableResults: [
                //        ['', '', '', '', '', '']
                //    ]
                //},
                {
                    message: 'Number Field',
                    ColumnName: '% Completed',
                    ColumnId: 8,
                    GroupAscItemText: 'Group lowest to highest',
                    GroupDescItemText: 'Group highest to lowest',
                    expectedTableResults: [
                        ['', '', '', '', '', ''],
                        ['', '', '', '', '', ''],
                        ['Angela Leon', 'Planning', 'Workstation purchase', '3/21/2009', '4/10/2009', '15250284452.47152052910053 weeks'],
                        ['Chris Baker', 'Development', 'Upgrade DBMS', '3/19/2009', '4/28/2009', '0.0020410978836 weeks'],
                        ['Chris Baker', 'Planning', 'Server purchase', '3/16/2009', '4/10/2009', '-15250284452.47152052910053 weeks'],
                        ['Jon Neil', 'Development', 'Install latest software', '3/31/2009', '4/28/2009', '15250284452.47152052910053 weeks']]
                },
            ];
        }

        describe('Report Grouping Tests without Facets', function() {
            /*
             * Ascending Testcases
             */
            groupingTestCases().forEach(function(groupingTestcase) {
                it('Ascending : Group ' + groupingTestcase.message, function(done) {
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '1'));
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        //expand column header menu and select the Item
                        reportSortingPage.expandColumnHeaderMenuAndSelectItem(groupingTestcase.ColumnName, groupingTestcase.GroupAscItemText);
                    }).then(function() {
                        // Get all records from table before filter applied
                        reportServicePage.agGridRecordElList.map(function(row) {
                            //only 7 rows because the grouped row will be removed in the UI
                            return [
                                row.all(by.className('ag-cell-no-focus')).get(2).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(3).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(4).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(5).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(6).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(7).getText(),
                            ];
                        }).then(function(groupingTableResults) {
                            console.log("the results are: " + groupingTableResults);
                            //finally verify both the arrays
                            expect(groupingTableResults.sort()).toEqual(groupingTestcase.expectedTableResults.sort());
                            done();
                        });
                    });
                });
            });

            /*
             * Descending Testcases
             */
            groupingTestCases().forEach(function(groupingTestcase) {
                it('Descending : Group ' + groupingTestcase.message, function(done) {
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '1'));
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        //expand column header menu and select the Item
                        reportSortingPage.expandColumnHeaderMenuAndSelectItem(groupingTestcase.ColumnName, groupingTestcase.GroupDescItemText);
                    }).then(function() {
                        // Get all records from table before filter applied
                        reportServicePage.agGridRecordElList.map(function(row) {
                            //only 7 rows because the grouped row will be removed in the UI
                            return [
                                row.all(by.className('ag-cell-no-focus')).get(2).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(3).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(4).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(5).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(6).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(7).getText(),
                            ];
                        }).then(function(groupingTableResults) {
                            console.log("the results are: " + groupingTableResults);
                            //finally verify both the arrays
                            expect(groupingTableResults.sort()).toEqual(groupingTestcase.expectedTableResults.sort());
                            done();
                        });
                    });
                });
            });

        });

        describe('Report Grouping Tests with Facets', function() {
            /*
             * Ascending Testcases
             */
            groupingTestCases().forEach(function(groupingTestcase) {
                it('Ascending : Group ' + groupingTestcase.message, function(done) {
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '2'));
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        //expand column header menu and select the Item
                        reportSortingPage.expandColumnHeaderMenuAndSelectItem(groupingTestcase.ColumnName, groupingTestcase.GroupAscItemText);
                    }).then(function() {
                        // Get all records from table before filter applied
                        reportServicePage.agGridRecordElList.map(function(row) {
                            //only 7 rows because the grouped row will be removed in the UI
                            return [
                                row.all(by.className('ag-cell-no-focus')).get(2).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(3).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(4).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(5).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(6).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(7).getText(),
                            ];
                        }).then(function(groupingTableResults) {
                            console.log("the results are: " + groupingTableResults);
                            //finally verify both the arrays
                            expect(groupingTableResults.sort()).toEqual(groupingTestcase.expectedTableResults.sort());
                            done();
                        });
                    });
                });
            });

            /*
             * Descending Testcases
             */
            groupingTestCases().forEach(function(groupingTestcase) {
                it('Descending : Group ' + groupingTestcase.message, function(done) {
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '2'));
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        //expand column header menu and select the Item
                        reportSortingPage.expandColumnHeaderMenuAndSelectItem(groupingTestcase.ColumnName, groupingTestcase.GroupDescItemText);
                    }).then(function() {
                        // Get all records from table before filter applied
                        reportServicePage.agGridRecordElList.map(function(row) {
                            //only 7 rows because the grouped row will be removed in the UI
                            return [
                                row.all(by.className('ag-cell-no-focus')).get(2).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(3).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(4).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(5).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(6).getText(),
                                row.all(by.className('ag-cell-no-focus')).get(7).getText(),
                            ];
                        }).then(function(groupingTableResults) {
                            console.log("the results are: " + groupingTableResults);
                            //finally verify both the arrays
                            expect(groupingTableResults.sort()).toEqual(groupingTestcase.expectedTableResults.sort());
                            done();
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
