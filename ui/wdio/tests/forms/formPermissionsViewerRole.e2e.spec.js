/**
 * Created by skamineni on 11/3/16.
 */
(function() {
    'use strict';
    //Load the page Objects
    var e2ePageBase = requirePO('e2ePageBase');
    var formsPO = requirePO('formsPage');
    var reportContentPO = requirePO('reportContent');

    describe('Form Viewer Permission Tests: ', function() {

        var realmName;
        var realmId;
        var testApp;
        var userId;
        var reportId;
        var roleId = 10;
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
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 6, false, false);
            }).then(function() {
                //Modify the field rights for Numeric Currency Field (readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 16, false, false);
            }).then(function() {
                //Modify the field rights for Numeric Percent Field (readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 17, false, false);
            }).then(function() {
                //Modify the field rights for Numeric Rating Field (readAccess and modify access set to false)
                return e2eBase.roleService.createFieldRightsForAppRole(appId, roleId, tableId, 18, false, false);
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

        it('Verify not able to see any text fields on the View and Edit forms', function() {
            var expectedFieldsWhichHasNoFieldRights = ['Text Field', 'Phone Number Field', 'Email Address Field', 'URL Field'];

            //Step 1 - get user authentication
            formsPO.getUserAuthentication(realmName, realmId, userId);

            //Step 2 - Open the report
            e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

            //Step 3 - Open a record
            reportContentPO.openRecordInViewMode(realmName, appId, tableId, reportId, 2);

            //Step 4 - Verify cannot see any text fields on the form in view mode as readaccess set to false
            formsPO.verifyFieldsNotPresentOnForm(formsPO.viewFormContainerEl, expectedFieldsWhichHasNoFieldRights);

            //Step 5 - go to edit mode by clicking on Add record button on stage
            reportContentPO.clickAddRecordBtnOnStage();

            //Step 6 - Verify cannot see any text fields on the form in edit mode as modify access set to false
            formsPO.verifyFieldsNotPresentOnForm(formsPO.editFormContainerEl, expectedFieldsWhichHasNoFieldRights);
        });

        it('Verify cannot add a record into table as tableRights canadd set to false', function() {
            var origRecordCount;

            //all required fields on form
            var fieldTypes = ['allNumericFields', 'allDurationFields'];

            //Step 1 - get user authentication
            formsPO.getUserAuthentication(realmName, realmId, userId);

            //Step 2 - Open the report
            e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

            //Step 3 - Get the original records count in a report
            origRecordCount = formsPO.getRecordsCountInATable();

            //Step 4 - Click on Add Record Button on the report Stage
            reportContentPO.clickAddRecordBtnOnStage();

            //Step 5 - enter form values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Step 6 - Click Save on the form
            formsPO.clickFormSaveBtn();

            //Step 7 - close the dirty form
            formsPO.closeSaveChangesDialogue();

            // Step 8 - Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            // Step 9 - Verify the records count not increased i.e not authorized to add a record
            expect(formsPO.getRecordsCountInATable()).toBe(origRecordCount);

        });

        it('Verify cannot edit a record since table rights canModify set to "NONE', function() {
            //all required fields on form
            var fieldTypes = ['allNumericFields', 'allDurationFields'];
            var origRecordCount;

            //Step 1 - get user authentication
            formsPO.getUserAuthentication(realmName, realmId, userId);

            //Step 2 - Open the report
            e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

            //Step 3 - Get the original records count in a report
            origRecordCount = formsPO.getRecordsCountInATable();

            //Step 3 - Click on 2nd record edit pencil
            reportContentPO.clickRecordEditPencilInRecordActions(1);

            //Step 4 - enter form values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Step 5 - Click Save on the form
            formsPO.clickFormSaveBtn();

            //Step 7 - close the dirty form
            formsPO.closeSaveChangesDialogue();

            // Step 8 - Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            //Step 9 - Get the record values
            var recordValues = reportContentPO.getRecordValues(1);

            //verify the array dosen't contain edited numeric field
            expect(recordValues.indexOf("33.33")).toBe(-1);

        });

        //TODO verify cannot delete a record when no permission.

    });
}());
