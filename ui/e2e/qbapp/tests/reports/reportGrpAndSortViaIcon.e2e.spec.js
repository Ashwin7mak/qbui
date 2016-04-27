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
            firstName: 'Gregory',
            lastName: 'Baxter',
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
                    testRecord3 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Planning'}, {'id': 8, 'value': 'Workstation purchase'}, {'id': 9, 'value': '2009-03-21'}, {'id': 10, 'value': '2009-04-10'}, {'id': 11, 'value': +durationMin}, {'id': 12, 'value': 0.74765432}]];
                    return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord3);
                });
                e2eBase.recordBase.apiBase.createSpecificUser(user4).then(function(userResponse) {
                    testRecord4 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Development'}, {'id': 8, 'value': 'Install latest software'}, {'id': 9, 'value': '2009-03-31'}, {'id': 10, 'value': '2009-04-28'}, {'id': 11, 'value': 0.345678}, {'id': 12, 'value': 100}]];
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
        describe('Report Grouping and Sorting Tests', function() {
            var tableResultsBeforeSortOrGrp = [];
            var tableResultsAfterSortOrGrp = [];

            beforeAll(function(done) {
                //go to report page directly
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '1'));
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                        reportServicePage.waitForElement(reportServicePage.agGridBodyEl).then(function() {
                            // Get all records from table before filter applied
                            reportServicePage.agGridRecordElList.map(function(row) {
                                return {
                                    'User Name': row.all(by.className('ag-cell-no-focus')).get(2).getText(),
                                    'Project Phase': row.all(by.className('ag-cell-no-focus')).get(3).getText(),
                                    'Task Name': row.all(by.className('ag-cell-no-focus')).get(4).getText(),
                                    'Start Date': row.all(by.className('ag-cell-no-focus')).get(5).getText(),
                                    'Finish Date': row.all(by.className('ag-cell-no-focus')).get(6).getText(),
                                    'Duration Taken': row.all(by.className('ag-cell-no-focus')).get(7).getText(),
                                    '% Completed': row.all(by.className('ag-cell-no-focus')).get(8).getText()
                                };
                            }).then(function(results) {
                                for (var i = 0; i < results.length; i++) {
                                    tableResultsBeforeSortOrGrp.push(results[i]);
                                }
                                console.log("the actual table results are: " + JSON.stringify(tableResultsBeforeSortOrGrp));
                                done();
                            });
                        });
                    });
                });
            });

            /**
             * Data Provider for reports and faceting results.
             */
            function TestCases() {
                return [
                    {
                        message: 'GroupBy Text field and SortBy User Field',
                        groupBy: ['Project Phase'],
                        sortBy: ['User Name']
                    },
                    {
                        message: 'GroupBy Text and Date fields then SortBy Date field',
                        groupBy: ['Project Phase', 'Start Date'],
                        sortBy: ['Start Date']
                    },
                    {
                        message: 'GroupBy Numeric and Duration fields then sort by Duration and Text fields',
                        groupBy: ['% Completed', 'Duration Taken'],
                        sortBy: ['Duration Taken', 'Project Phase']
                    },
                    {
                        message: 'GroupBy Date field and Sort by User and Numeric field',
                        groupBy: ['Finish Date'],
                        sortBy: ['User Name', '% Completed']
                    }
                ];
            }

            TestCases().forEach(function(testCase) {
                it('' + testCase.message, function(done) {
                    var groupResults = [];
                    var sortResults = [];
                    //RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '1'));
                    reportServicePage.waitForElement(reportSortingPage.reportSortingGroupingContainer).then(function() {
                        reportServicePage.waitForElementToBeClickable(reportSortingPage.reportSortAndGroupBtn).then(function() {
                            reportSortingPage.reportSortAndGroupBtn.click().then(function() {
                                //Verify grouping/sorting popOver
                                expect(reportSortingPage.reportSortAndGroupDialogue.isDisplayed()).toBeTruthy();
                                //Verify the title
                                expect(reportSortingPage.reportSortAndGroupTitle.getAttribute('innerText')).toEqual('Sort & Group');
                                //Verify title of groupBy
                                expect(reportSortingPage.reportGroupByContainerTitle.getText()).toEqual('Group');
                                //Verify prefix of field choice
                                expect(reportSortingPage.GroupByFieldPrefix.getText()).toEqual('by');
                                //Verify title of sortBy
                                expect(reportSortingPage.reportSortByContainerTitle.getText()).toEqual('Sort');
                                //Verify prefix of field choice
                                expect(reportSortingPage.SortByFieldPrefix.getText()).toEqual('by');
                            }).then(function() {
                                //Select sort By items
                                for (var j = 0; j < testCase.sortBy.length; j++) {
                                    reportSortingPage.selectSortByItems(testCase.sortBy[j]);
                                    //sort by the actual results array
                                    sortResults = _.sortBy(tableResultsBeforeSortOrGrp, testCase.sortBy[j].toString());
                                    console.log("The actual results array after sorting is: " + JSON.stringify(sortResults));
                                }
                            }).then(function() {
                                //Select group By items
                                for (var i = 0; i < testCase.groupBy.length; i++) {
                                    reportSortingPage.selectGroupByItems(testCase.groupBy[i]);
                                    //take the sorted results and group them
                                    groupResults = _.groupBy(sortResults, testCase.groupBy[i].toString());
                                    console.log("The actual results array after grouping is: " + JSON.stringify(groupResults));
                                }
                            }).then(function() {
                                //Click reset button
                                reportSortingPage.sortAndGrpDialogueResetBtn.click();
                                //Close the popup
                                reportSortingPage.reportSortAndGroupCloseBtn.click();

                                //Just to shift focus
                                reportServicePage.reportRecordsCount.click();
                                //clean the array
                                groupResults = [];
                                sortResults = [];
                                done();
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
