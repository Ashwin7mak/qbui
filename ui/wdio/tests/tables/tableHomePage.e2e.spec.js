/**
 * E2E tests for the tableHomePage
 * Created by agade on 3/31/17.
 */


(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let RequestAppsPage = requirePO('requestApps');
    let RequestSessionTicketPage = requirePO('requestSessionTicket');
    let ReportContentPO = requirePO('reportContent');

    describe('Reports - Table Home Page Tests', function() {
        let realmName;
        let realmId;
        let app;
        let userId;
        let numOfRecords = 5;

        let viewerRoleId = 10;
        let viewerReportId = 1;
        let participantRoleId = 11;
        let participantReportId = 2;
        let adminRoleId = 12;
        let adminReportId = 3;

        let tableToFieldToFieldTypeMap = {};
        tableToFieldToFieldTypeMap['table 1'] = {};
        tableToFieldToFieldTypeMap['table 1']['User Name'] = {fieldType: consts.SCALAR, dataType: consts.USER};
        tableToFieldToFieldTypeMap['table 1']['Project Phase'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
        tableToFieldToFieldTypeMap['table 1']['Task Name'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
        tableToFieldToFieldTypeMap['table 1']['Start Date'] = {fieldType: consts.SCALAR, dataType: consts.DATE};
        tableToFieldToFieldTypeMap['table 1']['Finish Date'] = {fieldType: consts.SCALAR, dataType: consts.DATE};
        tableToFieldToFieldTypeMap['table 1']['Duration Taken'] = {fieldType: consts.SCALAR, dataType: consts.DURATION};
        tableToFieldToFieldTypeMap['table 1']['% Completed'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and multiple reports.
         * Then create them via the REST API.
         */
        beforeAll(function() {
            //Create an app, table and reports
            return e2eBase.createAppWithEmptyRecordsInTable(tableToFieldToFieldTypeMap).then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords;
                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                let table1NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[0]);
                // Generate the record JSON objects
                let table1GeneratedRecords = e2eBase.recordService.generateRecords(table1NonBuiltInFields, 6);
                //add records to the table
                e2eBase.recordService.addRecords(app, app.tables[0], table1GeneratedRecords);
            }).then(function() {
                let report1 = {
                    name: 'Viewer Report',
                    description: 'Viewer Report',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null
                };
                //report endpoint
                let reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                //Create a viewer report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, report1);
            }).then(function() {
                let report2 = {
                    name: 'Participant Report',
                    description: 'Participant Report',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null
                };
                //report endpoint
                let reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                //Create a participant report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, report2);
            }).then(function() {
                let report3 = {
                    name: 'Admin Report',
                    description: 'Admin Report',
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null
                };
                //report endpoint
                let reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                //Create an Admin report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, report3);
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
            let jsonStr = '{"' + roleId + '":"' + report_Id + '"}';
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
                    roleId: adminRoleId,
                    reportId: adminReportId,
                    reportTitle: 'Admin Report'
                },
            ];
        }

        /**
         * Tests for default table home page UI.The test creates user and add user to app role and assign the report to appRole.
         * Authenticate the created User and verify that the user is able access the assigned report
         */
        reportHomePageTestCases().forEach(function(testcase) {
            it('Verify default table home page for ' + testcase.message, function() {
                browser.call(function() {
                    //Create a user
                    return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                        //parse user ID
                        userId = JSON.parse(userResponse.body).id;

                        //Add user to an appRole
                        e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, testcase.roleId, [userId]);

                        //POST custdefaulthomepage for a table
                        e2eBase.recordBase.apiBase.setCustDefaultTableHomePageForRole(app.id, app.tables[0].id, createRoleReportMapJSON(testcase.roleId, testcase.reportId));

                        //get the user authentication
                        return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
                    });
                });

                //Load the table to verify THP
                RequestAppsPage.get(e2eBase.getRequestTableEndpoint(realmName, app.id, app.tables[0].id));
                // wait for the report content to be visible
                ReportContentPO.waitForReportContent();

                //Assert report title to be expected
                expect(browser.element('.tableHomepageStageHeadline').getAttribute('textContent')).toBe('table 1 Home');

                //Expand the stage
                browser.element('.iconUISturdy-caret-down').click();
                browser.element('.stage-showHide-content').waitForVisible();

                //Assert description of the stage
                expect(browser.element('.stage-showHide-content').getAttribute('textContent')).toBe(testcase.reportTitle);

                //Assert record count displayed is correct
                expect(browser.element('.recordsCount').getAttribute('textContent')).toBe(numOfRecords + ' records');
            });
        });

        /**
         * Positive test to verify that admin has access to all the reports
         */
        it('Positive test to verify that admin has access to all the reports', function() {

            browser.call(function() {
                //Create a user
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    //parse user ID
                    userId = JSON.parse(userResponse.body).id;

                    //Add user to the admin appRole
                    e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, adminRoleId, [userId]);

                    //get the user authentication
                    return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
                });
            });

            //test that admin have access to admin report
            //Load the admin report
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, adminReportId));
            // wait for the report content to be visible
            ReportContentPO.waitForReportContent();
            //Assert report title to be expected
            expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe('Admin Report');

            //test that admin have access to participant report
            //Load the participant report
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, participantReportId));
            // wait for the report content to be visible
            ReportContentPO.waitForReportContent();
            //Assert report title to be expected
            expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe('Participant Report');

            //test that admin have access to viewer report
            //Load the viewer report
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, viewerReportId));
            // wait for the report content to be visible
            ReportContentPO.waitForReportContent();
            //Assert report title to be expected
            expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe('Viewer Report');
        });


    });

}());
