(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let formsPO = requirePO('formsPage');
    let reportContentPO = requirePO('reportContent');
    let notificationContainer = requirePO('/common/notificationContainer');
    let relationshipsPO = requirePO('relationshipsPage');
    let formBuilderPO = requirePO('formBuilder');
    let rawValueGenerator = require('../../../test_generators/rawValue.generator');

    let parentTableRecordValues;
    let childTableRecordValues;
    const PARENT_TABLE = 'Table 1';
    let randomTable_1RecordId = rawValueGenerator.generateInt(1, 10);
    let randomTable_2RecordId = rawValueGenerator.generateInt(1, 10);

    describe('Relationships - Create single relationship Tests :', function() {
        let realmName;
        let realmId;
        let testApp;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            var generatedApp = e2eBase.appService.generateAppFromMap(e2eConsts.basicTableMap());
            // Create the app via the API
            return e2eBase.appService.createApp(generatedApp).then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                //Add records into table 1
                return e2eBase.recordService.addRecordsToTable(testApp, 0, 10, true, true);
            }).then(function() {
                //Add records into table 2
                return e2eBase.recordService.addRecordsToTable(testApp, 1, 10, true, true);
            }).then(function() {
                //Create a form for each table
                return e2eBase.formService.createDefaultForms(testApp);
            }).then(function() {
                // Create a Table 1 report
                return e2eBase.reportService.createCustomReport(testApp.id, testApp.tables[0].id, 'Table 1 Report', null, null, null, null);
            }).then(function() {
                // Create a Table 2 report
                return e2eBase.reportService.createCustomReport(testApp.id, testApp.tables[1].id, 'Table 2 Report', null, null, null, null);
            }).then(function() {
                // Generate and add the default set of Users to the app
                return e2eBase.userService.addDefaultUserListToApp(testApp.id);
            }).then(function() {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        beforeAll(function() {
            //Load the child table 'table 2' report
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE2].id, 1);
            childTableRecordValues = reportContentPO.getRecordValues(randomTable_2RecordId - 1, 1);

            //Load the random record of the parent table ie 'Table 1' and get the values of the record for verification of relation at the end
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1, randomTable_1RecordId);
            parentTableRecordValues = formsPO.getRecordValuesInViewForm('.viewForm');
        });

        /**
         * Before each it block reload the 1st record of list all report in view form mode
         */
        beforeEach(function() {
            //Load the child table 'table 2' -> random record in view mode
            return reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE2].id, 1, randomTable_2RecordId);
        });

        //mouseMoves not working on firefox latest driver and safari. Add To Record button is at the bottom so cannot navigate to it to double click on that button
        if (browserName === 'chrome' || browserName === 'MicrosoftEdge') {

            it('App has just 2 tables - Create relationship between 2 tables(none of the table has title field)- recordId selected as default in create relationship dialog', function() {

                //create relationship between parent and child table
                //NOTE: I am not selecting any field here because 'Record ID' should be selected as default
                relationshipsPO.createRelationshipToParentTable(PARENT_TABLE, '');

                //Select record from parent picker
                //click on the edit pencil on the child record
                formsPO.clickRecordEditPencilInViewForm();

                //TODO editing any field on form complains phone no not in right format. So editing phone no.I think there is a bug on this need to confirm .
                formsPO.enterFormValues('allPhoneFields');
                //Select record Id 2 from parent picker
                relationshipsPO.selectFromParentPicker(randomTable_1RecordId);

                //Click Save on the form
                formsPO.clickFormSaveBtn();

                //wait until save success container goes away
                notificationContainer.waitUntilNotificationContainerGoesAway();
                //verify You land in view form since you edited a record from View form after saving
                formsPO.waitForViewFormsTableLoad();

                //Verify the relationship by clicking on get another record from parent link in view record mode.
                //Clicking on relationship link will open a drawer and verify the record is equal to the parent record I selected and also verify childEmbbeded report
                relationshipsPO.verifyParentRecordRelationship(parentTableRecordValues, childTableRecordValues);

            });

            it('Verify when relationship exists between 2 tables in an app unable to create one', function() {
                //Select settings -> modify this form
                formBuilderPO.open();

                //Verify that the create relationship button is not visible.
                let newFieldsOnForm = formBuilderPO.getNewFieldLabels();
                expect(newFieldsOnForm.indexOf(e2eConsts.GET_ANOTHER_RECORD) === -1).toBe(true);

                //Click on forms Cancel button
                formsPO.clickFormCancelBtn();
            });
        }

    });
}());
