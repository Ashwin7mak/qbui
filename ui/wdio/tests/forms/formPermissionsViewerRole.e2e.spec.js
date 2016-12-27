/**
 * Created by skamineni on 11/3/16.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');
    var formsPO = requirePO('formsPage');
    var ReportInLineEditPO = requirePO('reportInLineEdit');

    describe('Form Viewer Permission Tests: ', function() {

        var realmName;
        var realmId;
        var testApp;
        var userId;
        var reportId;
        var roleId = 10;
        var ADMIN_USERID = 10000;
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
                Promise.reject(new Error('Error during test setup beforeAll: ' + error.message));
            });
        });


        beforeEach(function() {
            //Set the session back to ADMIN
            // Auth into the new stack
            realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            realmId = e2eBase.recordBase.apiBase.realm.id;
            return formsPO.getUserAuthentication(realmName, realmId, ADMIN_USERID);
        });

        it('Verify not able to see any text fields on the View and Edit forms', function() {
            var expectedFieldsWhichHasNoFieldRights = ['Text Field', 'Phone Number Field', 'Email Address Field', 'URL Field'];

            //Step 1 - get user authentication
            formsPO.getUserAuthentication(realmName, realmId, userId);

            //Step 2 - Open the report
            e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

            //Step 3 - Open a record
            formsPO.openRecordInViewMode(2);

            //Step 4 - Verify cannot see any text fields on the form in view mode as readaccess set to false
            formsPO.verifyFieldsNotPresentOnForm(formsPO.viewFormContainerEl, expectedFieldsWhichHasNoFieldRights);

            //Step 5 - go to edit mode by clicking on Add record button on stage
            formsPO.clickAddRecordBtnOnStage();

            //Step 6 - Verify cannot see any text fields on the form in edit mode as modify access set to false
            formsPO.verifyFieldsNotPresentOnForm(formsPO.editFormContainerEl, expectedFieldsWhichHasNoFieldRights);
        });

        it('Verify cannot add a record into table as tableRights canadd set to false', function() {
            //all required fields on form
            var fieldTypes = ['allNumericFields', 'allDurationFields'];

            //Step 1 - get user authentication
            formsPO.getUserAuthentication(realmName, realmId, userId);

            //Step 2 - Open the report
            e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

            //Step 3 - Click on Add Record Button on the report Stage
            formsPO.clickAddRecordBtnOnStage();

            //Step 4 - enter form values
            for (var i = 0; i < fieldTypes.length; i++) {
                formsPO.enterFormValues(fieldTypes[i]);
            }

            //Step 5 - Click Save on the form
            formsPO.clickFormSaveBtn();

            //Step 6 - Verify record has no permission message shows up.
            formsPO.assertNotificationMessage("You are not authorized to create or access this record");

            //Step 7 - close the dirty form without saving
            formsPO.closeSaveChangesDialogue();
        });

        it('Verify cannot edit a record since table rights canModify set to "NONE', function() {
            //all required fields on form
            var fieldTypes = ['allNumericFields', 'allDurationFields'];

            //Step 1 - get user authentication
            formsPO.getUserAuthentication(realmName, realmId, userId);

            //Step 2 - Open the report
            e2ePageBase.loadReportByIdInBrowser(realmName, appId, tableId, reportId);

            //Step 3 - Click on 2nd record edit pencil
            formsPO.clickRecordEditPencilInRecordActions(1);

            //Step 4 - enter form values
            for (var i = 0; i < fieldTypes.length; i++) {
                formsPO.enterFormValues(fieldTypes[i]);
            }

            //Step 5 - Click Save on the form
            formsPO.clickFormSaveBtn();

            //Step 6 - Verify record has no permission message shows up.
            formsPO.assertNotificationMessage("Record not saved");
            //TODO enable when MB-1488 is fixed enable below and remove above message
            //formsPO.assertNotificationMessage("You are not authorized to create or access this record");

            //Step 7 - close the dirty form without saving
            formsPO.closeSaveChangesDialogue();
        });

        //TODO verify cannot delete a record when no permission.

    });
}());
