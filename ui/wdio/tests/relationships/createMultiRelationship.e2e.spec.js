(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let tableCreatePO = requirePO('tableCreate');
    let formsPO = requirePO('formsPage');
    let reportContentPO = requirePO('reportContent');
    let notificationContainer = requirePO('/common/notificationContainer');
    let relationshipsPO = requirePO('relationshipsPage');
    let formBuilderPO = requirePO('formBuilder');
    let modalDialog = requirePO('/common/modalDialog');
    let rawValueGenerator = require('../../../test_generators/rawValue.generator');

    let PARENT_TABLE;
    const GET_ANOTHER_RECORD = 'Get another record';
    let parentPickerTitleFieldValue = 'testTextValue';
    const TITLE_FIELD = 'Record title';
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const descFieldTitleText = 'Description';

    describe('Relationships - Create multiple relationship Tests :', function() {
        // This app has 2 parent tables and 1 child table. A relationship already exists via API.
        let realmName;
        let realmId;
        let testApp;
        let parentTableRecordValues = [];

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup(null, 5).then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                //Delete API created 'Table 1' table
                return e2eBase.tableService.deleteTable(testApp.id, testApp.tables[e2eConsts.TABLE1].id);
            }).then(function() {
                //Delete API created 'Table 2' table
                return e2eBase.tableService.deleteTable(testApp.id, testApp.tables[e2eConsts.TABLE2].id);
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
            PARENT_TABLE = rawValueGenerator.generateStringWithFixLength(5);
            let tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: PARENT_TABLE},
                {fieldTitle: recordNameFieldTitleText, fieldValue: rawValueGenerator.generateStringWithFixLength(5)},
                {fieldTitle: descFieldTitleText, fieldValue: rawValueGenerator.generateStringWithFixLength(5)}
            ];
            //Create a new parent table and single record into new table
            let formBuilderFields = ['Number'];
            let fieldTypes = ['allTextFields', 'allNumericFields', 'allDateFields'];

            //go to appId page
            e2ePageBase.loadAppByIdInBrowser(realmName, testApp.id);

            //create table via UI
            //Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Enter table field values
            tableFields.forEach(function(tableField) {
                //Enter field values
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Click on finished button and make sure it landed in edit Form container page
            modalDialog.clickOnModalDialogBtn(modalDialog.CREATE_TABLE_BTN);
            tableCreatePO.waitUntilNotificationContainerGoesAway();

            //Verify the create table dialogue
            tableCreatePO.verifyNewTableCreateDialogue();

            //Click OK button on create table dialogue
            modalDialog.clickOnModalDialogBtn(modalDialog.TABLE_READY_DLG_OK_BTN);

            //Add fields to the form
            formBuilderFields.forEach(function(formBuilderField) {
                formBuilderPO.addNewFieldToFormByDoubleClicking(formBuilderField);
            });

            //Click on forms save button
            formBuilderPO.save();
            //wait until save success container goes away
            tableCreatePO.waitUntilNotificationContainerGoesAway();

            //Click on Add Record Button on the report Stage
            reportContentPO.clickAddRecordBtnOnStage();

            //enter form values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Click Save on the form
            formsPO.clickFormSaveBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            parentTableRecordValues = browser.elements('.cellWrapper').getAttribute('textContent');

            return PARENT_TABLE;
        });

        /**
         * Before each it block reload the 1st record of list all report in view form mode
         */
        beforeEach(function() {
            //Load the child table 'Child Table A' -> record 1 in view mode
            return reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE4].id, 1, 1);
        });

        it('Verify able to create relationship even tough single relationship exists to 1 of the parent table', function() {
            //Select settings -> modify this form
            formBuilderPO.open();

            //Verify that the create relationship button is not visible.
            let newFieldsOnForm = formBuilderPO.getNewFieldLabels();
            expect(newFieldsOnForm.indexOf(GET_ANOTHER_RECORD) > -1).toBe(true);

            //Click on forms Cancel button
            formsPO.clickFormCancelBtn();

        });

        it('App has 2 parent tables and 1 child table - Create multi relationship)', function() {
            //create relationship between parent and child table.
            //NOTE: I am not selecting any field here because 'titleField' should be selected as default
            relationshipsPO.createRelationshipToParentTable(PARENT_TABLE, '');

            //Select record from parent picker
            //click on the edit pencil on the child record
            formsPO.clickRecordEditPencilInViewForm();
            //Select titleField value from parent picker
            relationshipsPO.selectFromParentPicker(parentPickerTitleFieldValue);
            //Click Save on the form
            formsPO.clickFormSaveBtn();
            //wait until save success container goes away
            notificationContainer.waitUntilNotificationContainerGoesAway();


            //TODO because of MC-1912 we need to reload page here to verify the results
            browser.refresh();
            //verify You land in view form since you edited a record from View form after saving
            formsPO.waitForViewFormsTableLoad();

            //Verify the relationship by clicking on get another record from parent link in view record mode.
            //Clicking on relationship link will open a drawer and verify the record is equal to the parent record I selected.
            relationshipsPO.verifyParentRecordRelationship(parentTableRecordValues);
        });

        it('Verify when relationship exists between child table and 2 parent tables in an app unable to create new relationship', function() {
            //Select settings -> modify this form
            formBuilderPO.open();

            //Verify that the create relationship button is not visible.
            let newFieldsOnForm = formBuilderPO.getNewFieldLabels();
            expect(newFieldsOnForm.indexOf(GET_ANOTHER_RECORD) === -1).toBe(true);

            //Click on forms Cancel button
            formsPO.clickFormCancelBtn();
        });
    });
}());
