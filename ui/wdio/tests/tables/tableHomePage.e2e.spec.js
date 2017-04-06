/**
 * E2E tests for the tableHomePage
 * Created by agade on 3/31/17.
 */


(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var RequestAppsPage = requirePO('requestApps');
    var tableCreatePO = requirePO('tableCreate');
    var formsPO = requirePO('formsPage');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var rawValueGenerator = require('../../../test_generators/rawValue.generator');
    var ReportContentPO = require('../../pages/reportContent.po')

    describe('Report Table Home Page Tests', function() {
        var realmName;
        var realmId;
        var app;
        var userId;

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and multiple reports.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */
        beforeAll(function() {
            //Create a app, table and report
            return e2eBase.basicAppSetup(null, 5).then(function(appAndRecords) {
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
                    roleId: 10,
                    reportId: 2,
                    reportTitle: 'Table 1 | Viewer Report'
                },
                {
                    message: 'Participant Role',
                    roleId: 11,
                    reportId: 3,
                    reportTitle: 'Table 1 | Participant Report'
                },
                {
                    message: 'Admin Role',
                    roleId: 12,
                    reportId: 4,
                    reportTitle: 'Table 1 | Admin Report'
                }
            ];
        }

        /**
         * Tests for default table home page UI.The test creates user and add user to app role and assign the report to appRole.
         * Authenticate the created User and verify the default table home page displays the report set or not.
         */
        reportHomePageTestCases().forEach(function(testcase) {
            it('Verify default table home page for ' + testcase.message, function() {
                //Create a user
                browser.call(function() {
                    return e2eBase.recordBase.apiBase.createUser().then(function (userResponse) {

                        userId = JSON.parse(userResponse.body).id;

                        //Add user to an appRole
                        e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, testcase.roleId, [userId]);
                    });
                });

                //POST custdefaulthomepage for a table
                browser.call(function() {
                    return e2eBase.recordBase.apiBase.setCustDefaultTableHomePageForRole(app.id, app.tables[0].id, createRoleReportMapJSON(testcase.roleId, testcase.reportId))
                });

                //get the user authentication
                browser.call(function() {
                    return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
                });

                //Load the table for that user
                RequestAppsPage.get(e2eBase.getRequestTableEndpoint(e2eBase.recordBase.apiBase.realm.subdomain, app.id, app.tables[0].id));

                // wait for the report content to be visible
                ReportContentPO.waitForReportContent();

                //Assert tableHomepageStageHeadline *make sure testing right thing here
               // expect(browser.element('.tableHomepageStageHeadline').getAttribute('textContent')).toBe(testcase.reportTitle);
                expect(browser.element('.tableHomepageStageHeadline').getAttribute('textContent')).toBe('Table 1 Home');

                //Assert number of records
                expect(ReportContentPO.reportDisplayedRecordCount()).toBe(5);
                //Assert record count displayed is correct
                expect(browser.element('.recordsCount').getAttribute('textContent')).toBe('5 records');

            });
        });

        /**
         * Negative test to verify the personal reports for a user cannot be accessed by others.
         */
        it('Negative test to verify personal reports not accessable by other users', function() {
            //Create a user
            browser.call(function() {
                return e2eBase.recordBase.apiBase.createUser().then(function (userResponse) {
                    userId = JSON.parse(userResponse.body).id;

                    //Add user to participant appRole
                    e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, "11", [userId]);
                });
            });

            //get the user authentication
            browser.call(function() {
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
            });
            //go to report page directly to load personal report(report 1 which is Test Report).
            browser.call(function() {
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            });

            // Make sure the report not loaded and gives unAuthorized error
            expect(RequestSessionTicketPage.ticketResponseBodyEl.getText()).toEqual(e2eConsts.invalidCredentials);

        });


    });

}());