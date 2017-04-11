/**
 * E2E tests for the tableHomePage
 * Created by agade on 3/31/17.
 */


(function() {
    'use strict';

    //Load the page Objects
    var e2ePageBase = requirePO('e2ePageBase');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportContentPO = require('../../pages/reportContent.po');

    describe('Report Table Home Page Tests', function() {
        var realmName;
        var realmId;
        var app;
        var userId;
        var numOfRecords = 5;

        var viewerRoleId = 10;
        var viewerReportId = 2;
        var participantRoleId = 11;
        var participantReportId = 3;
        var adminRoleId = 12;
        var adminReportId = 4;

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and multiple reports.
         * Then create them via the REST API.
         */
        beforeAll(function() {
            //Create an app, table and reports
            return e2eBase.basicAppSetup(null, numOfRecords).then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords;
            }).then(function() {
                var report1 = {
                    name: 'Viewer Report',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null
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
                    query: null
                };
                //report endpoint
                var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                //Create a participant report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, report2);
            }).then(function() {
                var report3 = {
                    name: 'Admin Report',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null
                };
                //report endpoint
                var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                //Create an Admin report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, report3);
            }).then(function() {
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        beforeEach(function() {
            //Set the session back to ADMIN
            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            realmId = e2eBase.recordBase.apiBase.realm.id;
            // Auth into the new stack
            return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
        });


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
                    roleId: viewerRoleId,
                    reportId: viewerReportId,
                    reportTitle: 'Viewer Report'
                },
                {
                    message: 'Participant Role',
                    roleId: participantRoleId,
                    reportId: participantReportId,
                    reportTitle: 'Participant Report'
                },
                {
                    message: 'Admin Role',
                    roleId: participantRoleId,
                    reportId: participantReportId,
                    reportTitle: 'Admin Report'
                }
            ];
        }

        /**
         * Tests for default table home page UI.The test creates user and add user to app role and assign the report to appRole.
         * Authenticate the created User and verify that the user is able access the assigned report
         */
        reportHomePageTestCases().forEach(function(testcase) {
            it('Verify default table home page for ' + testcase.message, function() {
                //Create a user
                browser.call(function() {
                    return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                        //parse user ID
                        userId = JSON.parse(userResponse.body).id;

                        //Add user to an appRole
                        e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, testcase.roleId, [userId]);

                        //POST custdefaulthomepage for a table
                        e2eBase.recordBase.apiBase.setCustDefaultTableHomePageForRole(app.id, app.tables[0].id, createRoleReportMapJSON(testcase.roleId, testcase.reportId));

                        //get the user authentication
                        RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
                    });

                    //Load the report for given user
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[0].id, testcase.reportId));

                    // wait for the report content to be visible
                    ReportContentPO.waitForReportContent();

                    //Assert report title to be expected
                    expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe(testcase.reportTitle);

                    //Assert the number of records
                    expect(ReportContentPO.reportDisplayedRecordCount()).toBe(numOfRecords);

                    //Assert record count displayed is correct
                    expect(browser.element('.recordsCount').getAttribute('textContent')).toBe(numOfRecords + ' records');
                });

            });
        });

        /**
         * Negative test to verify that the personal reports for a user cannot be accessed by other users.
         */
        it('Negative test to verify personal reports not accessible by other users', function() {

            //Create a user
            browser.call(function() {
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    //parse user ID
                    userId = JSON.parse(userResponse.body).id;

                    //Adding user to the participant appRole
                    e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, participantRoleId, [userId]);

                    //get the user authentication
                    RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));

                    //try to load the report of admin user
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, adminReportId));
                });

                // Make sure the report not loaded and gives unAuthorized error
                expect(RequestSessionTicketPage.ticketResponseBodyEl.getText()).toEqual(e2eConsts.invalidCredentials);
            });
        });

        /**
         * Positive test to verify that admin has access to all the reports
         */
        it('Positive test to verify that admin has access to all the reports', function() {

            //Create a user
            browser.call(function() {
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    //parse user ID
                    userId = JSON.parse(userResponse.body).id;

                    //Add user to the admin appRole
                    e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, adminRoleId, [userId]);

                    //get the user authentication
                    RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
                });
                //next - make sure admin have access to all the reports

                //test that admin have access to admin report
                //Load the report for admin user
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, adminReportId));
                // wait for the report content to be visible
                ReportContentPO.waitForReportContent();
                //Assert report title to be expected
                expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe('Admin Report');

                //test that admin have access to participant report
                //Load the report for participant user
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, participantReportId));
                // wait for the report content to be visible
                ReportContentPO.waitForReportContent();
                //Assert report title to be expected
                expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe('Participant Report');

                //test that admin have access to viewer report
                //Load the report for viewer user
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, viewerReportId));
                // wait for the report content to be visible
                ReportContentPO.waitForReportContent();
                //Assert report title to be expected
                expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe('Viewer Report');
            });
        });


    });

}());
