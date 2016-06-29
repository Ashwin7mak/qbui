(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();

    describe('Report Table Home Page Tests', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;
        var userId;
        var ADMIN_USER_ID = "10000";

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and multiple reports.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */
        beforeAll(function(done) {
            //Create a app, table and report
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
            }).then(function() {
                var report1 = {
                    name: 'Viewer Report',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null,
                };
                //report endpoint
                var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                //Create a viewer report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, report1);
            }).then(function() {
                var report2 = {
                    name: 'Participant Report',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null,
                };
                //report endpoint
                var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                //Create a viewer report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, report2);
            }).then(function() {
                var report3 = {
                    name: 'Admin Report',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null,
                };
                //report endpoint
                var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                //Create a viewer report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, report3);
            }).then(function() {
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(e2eBase.recordBase.apiBase.realm.subdomain));
            }).then(function() {
                // Wait for the leftNav to load
                return reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    // Select the app
                    return reportServicePage.appLinksElList.get(0).click().then(function() {
                        //wait for table lists
                        reportServicePage.waitForElement(reportServicePage.tablesListDivEl);
                        //Done callback to let Jasmine know we are done with our promise chain
                        done();
                    });
                });
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                done.fail('Error during test setup: ' + error.message);
            });
        });

        beforeEach(function(done) {
            //Set the session back to ADMIN
            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            realmId = e2eBase.recordBase.apiBase.realm.id;
            //get the Admin authentication
            RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            done();
        });

        /**
         * Function to verify default table home page report's title and column headers.
         */
        var verifyTableLoad = function(reportTitle) {
            // Wait until the table has loaded
            reportServicePage.waitForElement(reportServicePage.reportContainerEl).then(function() {
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    //Assert report heading
                    expect(reportServicePage.stageHeadLine.getAttribute('innerText')).toEqual(reportTitle);
                    // Assert the record count
                    expect(reportServicePage.reportRecordsCount.getAttribute('innerText')).toBe('10 Records');

                    //verify that the table report loaded by verifying the column headers
                    reportServicePage.getReportColumnHeaders().then(function(tableColHeaders) {
                        expect(tableColHeaders).toEqual(e2eConsts.reportFieldNames);
                    });
                });
            });
        };

        /**
         * Function that creates JSON for roleId reportId map for custdefaulthomepage POST
         */
        function createRoleReportMapJSON(roleId, report_Id) {
            var jsonStr = '{"' + roleId + '":"' + report_Id + '"}';
            return JSON.parse(jsonStr);
        }

        /**
         * Data Provider for table homepage for various user roles
         */
        function reportHomePageTestCases() {
            return [
                {
                    message: 'Viewer Role',
                    roleId: 10,
                    reportId: 2,
                    reportTitle: 'Table 1\n|\nViewer Report\n'
                },
                {
                    message: 'Participant Role',
                    roleId: 11,
                    reportId: 3,
                    reportTitle: 'Table 1\n|\nParticipant Report\n'
                },
                {
                    message: 'Admin Role',
                    roleId: 12,
                    reportId: 4,
                    reportTitle: 'Table 1\n|\nAdmin Report\n'
                }
            ];
        }

        /**
         * Tests for default table home page UI.The test creates user and add user to app role and assign the report to appRole.
         * Authenticate the created User and verify the default table home page displays the report set or not.
         */
        reportHomePageTestCases().forEach(function(testcase) {
            it('Verify default table home page for ' + testcase.message, function(done) {
                //create user
                e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                    //add user to appRole
                    e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, testcase.roleId, [userId]).then(function(userRoleResponse) {
                        //POST custdefaulthomepage for a table
                        e2eBase.recordBase.apiBase.setCustDefaultTableHomePageForRole(app.id, app.tables[0].id, createRoleReportMapJSON(testcase.roleId, testcase.reportId)).then(function() {
                            // Get a session ticket for that subdomain and realmId (stores it in the browser)
                            realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                            realmId = e2eBase.recordBase.apiBase.realm.id;
                            //get the user authentication
                            return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
                        }).then(function() {
                            //load the table home page
                            return RequestAppsPage.get(e2eBase.getRequestTableHomePageEndpoint(e2eBase.recordBase.apiBase.realm.subdomain, app.id, app.tables[0].id));
                        }).then(function() {
                            return reportServicePage.waitForElement(reportServicePage.reportStageContentEl).then(function() {
                                //Assert report stage heading
                                expect(reportServicePage.stageHeadLine.getAttribute('innerText')).toEqual(testcase.reportTitle);
                            }).then(function() {
                                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                                    e2eBase.sleep(browser.params.smallSleep);
                                    // Assert the record count
                                    expect(reportServicePage.reportRecordsCount.getAttribute('innerText')).toBe('10 Records');
                                    //verify that the table report loaded by verifying the column headers
                                    reportServicePage.getReportColumnHeaders().then(function(tableColHeaders) {
                                        expect(tableColHeaders).toEqual(e2eConsts.reportFieldNames);
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
         * Negative test to verify the personal reports for a user cannot be accessed by others.
         */
        it('Negative test to verify personal reports not accessable by other users', function(done) {
            e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                userId = JSON.parse(userResponse.body).id;
                //add user to participant appRole
                e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, "11", [userId]).then(function(userRoleResponse) {
                    // Get a session ticket for that subdomain and realmId (stores it in the browser)
                    realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                    realmId = e2eBase.recordBase.apiBase.realm.id;
                    //get the user authentication
                    RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
                }).then(function() {
                    //go to report page directly to load personal report(report 1 which is Test Report).
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                }).then(function() {
                    // Make sure the report not loaded and gives unAuthorized error
                    expect(RequestSessionTicketPage.ticketResponseBodyEl.getText()).toEqual(e2eConsts.invalidCredentials);
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
