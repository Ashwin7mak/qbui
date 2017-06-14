/**
 * E2E tests for the tableHomePage
 * Created by agade on 3/31/17.
 */
(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let RequestAppsPage = requirePO('requestApps');
    let ReportContentPO = requirePO('reportContent');
    let newStackAuthPO = requirePO('newStackAuth');
    let tableCreatePO = requirePO('tableCreate');

    describe('Tables - Table homepage tests: ', function() {
        let realmName;
        let realmId;
        let app;
        let userId;
        let numOfRecords = 5;

        let viewerReportId = 1;
        let participantReportId = 2;
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
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
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

        /**
         * Function that creates JSON for roleId reportId map for custdefaulthomepage POST
         */
        function createRoleReportMapJSON(roleId, report_Id) {
            let jsonStr = '{"' + roleId + '":"' + report_Id + '"}';
            return JSON.parse(jsonStr);
        }

        /**
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            // Auth into the new stack as an admin
            return newStackAuthPO.realmLogin(realmName, realmId);
        });

        /**
         * Data Provider for table homepage for various user roles
         */
        function reportHomePageTestCases() {
            return [
                {
                    message: 'Viewer Role',
                    roleId: e2eConsts.VIEWER_ROLEID,
                    reportId: viewerReportId,
                    reportTitle: 'Viewer Report'
                },
                {
                    message: 'Participant Role',
                    roleId: e2eConsts.PARTICIPANT_ROLEID,
                    reportId: participantReportId,
                    reportTitle: 'Participant Report'
                },
                {
                    message: 'Admin Role',
                    roleId: e2eConsts.ADMIN_ROLEID,
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
                    });
                });

                browser.call(function() {
                    //Add user to an appRole
                    return e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, testcase.roleId, [userId]);
                });

                browser.call(function() {
                    //POST custdefaulthomepage for a table
                    return e2eBase.recordBase.apiBase.setCustDefaultTableHomePageForRole(app.id, app.tables[0].id, createRoleReportMapJSON(testcase.roleId, testcase.reportId));
                });

                // Auth into the new stack as an admin
                newStackAuthPO.nonAdminRealmLogin(realmName, realmId, userId);

                //go to app via url
                e2ePageBase.loadAppByIdInBrowser(realmName, app.id);

                //Select table Table 1
                e2ePageBase.loadTableByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id);

                //Assert report title to be expected
                browser.element('.tableHomepageStageHeadline').waitForVisible();
                expect(browser.element('.tableHomepageStageHeadline').getAttribute('textContent')).toBe('table 1 Home');

                //Expand the stage
                browser.element('button.toggleStage').click();
                browser.element('.stage-showHide-content').waitForVisible();

                //Assert description of the stage
                expect(browser.element('.stage-showHide-content').getAttribute('textContent')).toBe(testcase.reportTitle);

                //Assert record count displayed is correct
                browser.element('.recordsCount').waitForVisible();
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
                });
            });

            browser.call(function() {
                //Add user to the admin appRole
                return e2eBase.recordBase.apiBase.assignUsersToAppRole(app.id, e2eConsts.ADMIN_ROLEID, [userId]);
            });

            // Auth into the new stack as an admin
            newStackAuthPO.nonAdminRealmLogin(realmName, realmId, userId);

            //test that admin have access to admin report
            //Load the admin report
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, adminReportId);

            //Assert report title to be expected
            browser.element('.stageHeadline').waitForVisible();
            expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe('Admin Report');

            //test that admin have access to participant report
            //Load the participant report
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, participantReportId);

            //Assert report title to be expected
            browser.element('.stageHeadline').waitForVisible();
            expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe('Participant Report');

            //test that admin have access to viewer report
            //Load the viewer report
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, viewerReportId);

            //Assert report title to be expected
            browser.element('.stageHeadline').waitForVisible();
            expect(browser.element('.stageHeadline').getAttribute('textContent')).toBe('Viewer Report');
        });
    });
}());
