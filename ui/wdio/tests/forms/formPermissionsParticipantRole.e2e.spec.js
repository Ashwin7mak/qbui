/**
 * Created by skamineni on 11/3/16.
 */
(function() {
    'use strict';

    //Load the page Objects
    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');
    var formsPO = requirePO('formsPage');

    describe('Forms Participant User Permission Tests: ', function() {

        var realmName;
        var realmId;
        var testApp;
        var userId;
        var reportId;
        var roleId = 11;
        var appId;
        var tableId;


        beforeAll(function() {
            //App basic setUp
            return e2eBase.basicAppSetup().then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                appId = testApp.id;
                tableId = testApp.tables[0].id;
            }).then(function() {
                //report JSON
                var reportJSON = {
                    name: 'Test Roles Report',
                    type: 'TABLE',
                    tableId: testApp.tables[0].id,
                    query: null
                };
                //report endpoint
                var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(appId, tableId);

                //Create a report
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportJSON).then(function(repResponse) {
                    var r = JSON.parse(repResponse.body);
                    reportId = r.id;
                    console.log("the reportId is : " + reportId);
                });
            }).then(function() {
                //create user
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                });
            }).then(function() {
                return e2eBase.recordBase.apiBase.assignUsersToAppRole(appId, roleId, [userId]);
            }).then(function() {
                //POST custdefaulthomepage for a table
                return e2eBase.recordBase.apiBase.setCustDefaultTableHomePageForRole(appId, tableId, e2eBase.roleService.createRoleReportMapJSON(roleId, reportId));
            }).then(function() {
                //Modify the field rights for numeric field (readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 7, false, false);
            }).then(function() {
                //Modify the field rights for Numeric Currency Field (readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 8, false, false);
            }).then(function() {
                //Modify the field rights for Numeric Percent Field (readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 9, false, false);
            }).then(function() {
                //Modify the field rights for Numeric Rating Field (readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 10, false, false);
            }).then(function() {
                //Modify the field rights for Duration Field (readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 14, false, false);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                throw new Error('Error during test setup beforeAll: ' + error.message);
            });
        });


        beforeEach(function() {
            //Set the session back to ADMIN
            // Auth into the new stack
            realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            realmId = e2eBase.recordBase.apiBase.realm.id;
            return formsPO.getUserAuthentication(realmName, realmId, e2eConsts.ADMIN_USERID);
        });

        it('Verify fieldRights - View Form and Edit form dont have access to all numeric fields', function() {
            var expectedNumericFieldsWhichHasNoFieldRights = ['Numeric Field', 'Numeric Currency Field', 'Numeric Percent Field', 'Numeric Rating Field', 'Duration Field'];

            //Step 1 - get user authentication
            formsPO.getUserAuthentication(realmName, realmId, userId);

            //Step 2 - Open the report
            e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

            //Step 3 - Open a record
            formsPO.openRecordInViewMode(2);

            //Step 4 - Verify cannot see any text fields on the form in view mode as readaccess set to false
            formsPO.verifyFieldsNotPresentOnForm(formsPO.viewFormContainerEl, expectedNumericFieldsWhichHasNoFieldRights);

            //Step 5 - go to edit mode by clicking on Add record button on stage
            formsPO.clickAddRecordBtnOnStage();

            //Step 6 - Verify cannot see any text fields on the form in edit mode as modify access set to false
            formsPO.verifyFieldsNotPresentOnForm(formsPO.editFormContainerEl, expectedNumericFieldsWhichHasNoFieldRights);
        });


        it('Verify can add a record since table rights canAdd set to true and no fieldRights to Numeric fields', function() {
            var origRecordCount;
            //all required fields on form
            var fieldTypes = ['allPhoneFields', 'allEmailFields', 'allUrlFields'];
            if (browser === 'firefox') {
                //TODO need to investigate why this test fails only sometimes on firefox on sauceLabs. Save is just spinning and not returning back.
            } else {
                //Step 1 - get user authentication
                formsPO.getUserAuthentication(realmName, realmId, userId);

                //Step 2 - Open the report
                e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

                //Step 3 - Get the original records count in a report
                origRecordCount = formsPO.getRecordsCountInATable();

                //Step 4 - Click on Add Record Button on the report Stage
                formsPO.clickAddRecordBtnOnStage();

                //Step 5 - enter form values
                fieldTypes.forEach(function(fieldType) {
                    formsPO.enterFormValues(fieldType);
                });

                //Step 6 - Click Save on the form
                formsPO.clickFormSaveBtn();
                //wait until report rows in table are loaded
                reportContentPO.waitForReportContent();

                // Step 7 - Reload the report after saving row as the row is added at the last page
                e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

                // Step 8 - Verify the records count got increased by 1
                expect(formsPO.getRecordsCountInATable()).toBe(origRecordCount + 1);
            }
        });

        it('Verify can edit a record since table rights canModify set to "ALL_RECORDS', function(done) {
            var origRecordCount;
            //all required fields on form
            var fieldTypes = ['allTextFields', 'allPhoneFields', 'allEmailFields', 'allUrlFields'];

            //Step 1 - get user authentication
            formsPO.getUserAuthentication(realmName, realmId, userId);

            //Step 2 - Open the report
            e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

            //Step 3 - Get the original records count in a report
            origRecordCount = formsPO.getRecordsCountInATable();

            //Step 4 - Click on 5th record edit pencil
            formsPO.clickRecordEditPencilInRecordActions(5);

            //Step 5 - Edit values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Step 6 - Click Save on the form
            formsPO.clickFormSaveBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 7 - Verify record edited with expected values
            var recordValues = reportContentPO.getRecordValues(5);
            expect(recordValues[1]).toBe('test@gmail.com');
            expect(recordValues[2]).toBe('http://www.yahoo.com');

            // Step 8 - Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

            // Step 9 - Verify the records count not increased
            expect(formsPO.getRecordsCountInATable()).toBe(origRecordCount);

        });

    });
}());
