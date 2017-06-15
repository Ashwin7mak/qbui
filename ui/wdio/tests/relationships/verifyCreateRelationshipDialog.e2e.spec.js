(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let tableCreatePO = requirePO('tableCreate');
    let reportContentPO = requirePO('reportContent');
    let notificationContainer = requirePO('/common/notificationContainer');
    let relationshipsPO = requirePO('relationshipsPage');
    let formBuilderPO = requirePO('formBuilder');
    let modalDialog = requirePO('/common/modalDialog');
    let formsPO = requirePO('formsPage');
    let rawValueGenerator = require('../../../test_generators/rawValue.generator');

    let parentTable;
    let newFieldsOnForm;
    const SELECT_RECORD_ID_AS_FIELD = 'Record ID#';
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const descFieldTitleText = 'Description';
    const PARENT_TABLE2 = 'Table 2';

    describe('Relationships - Verify create relationship dialog Tests :', function() {
        let realmName;
        let realmId;
        let testApp;

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
                //Delete API created 'Parent Table A' table
                return e2eBase.tableService.deleteTable(testApp.id, testApp.tables[e2eConsts.TABLE3].id);
            }).then(function() {
                //Delete API created 'Child Table A' table
                return e2eBase.tableService.deleteTable(testApp.id, testApp.tables[e2eConsts.TABLE4].id);
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
            parentTable = rawValueGenerator.generateStringWithFixLength(5);
            let tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: parentTable},
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

            return parentTable;
        });

        /**
         * Before each it block reload the 1st record of list all report in view form mode
         */
        beforeEach(function() {
            //Load the child table 'Table 1' -> record 1 in view mode
            return reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1, 1);
        });

//mouseMoves not working on firefox latest driver and safari. Add To Record button is at the bottom so cannot navigate to it to double click on that button
        if (browserName === 'chrome' || browserName === 'MicrosoftEdge') {
            it('Verify cancel dialog and reAdd 2 fields then delete a field and add field again flow. This also includes verifying default fields and changing defaults. )', function() {
                let expectedTableList1 = ['Table 2', parentTable];
                let expectedTableList2 = ['Table 2'];

                //Select settings -> modify this form
                formBuilderPO.open();

                //Click on add a new record button
                formBuilderPO.addNewFieldToFormByDoubleClicking(e2eConsts.GET_ANOTHER_RECORD);

                //Verify 'RECORD TITLE' is selected as default and select parent table PARENT_TABLE
                relationshipsPO.verifyTablesAndFieldsFromCreateRelationshipDialog(expectedTableList1, parentTable, '');

                //Cancel the create relationship dialog
                modalDialog.clickOnModalDialogBtn(modalDialog.CANCEL_BTN);
                modalDialog.waitUntilModalDialogSlideAway();

                //Add a new record button again since its canceled above
                formBuilderPO.addNewFieldToFormByDoubleClicking(e2eConsts.GET_ANOTHER_RECORD);

                //select parent table PARENT_TABLE and Change the default 'RECORD TITLE' to 'RECORD ID'
                relationshipsPO.verifyTablesAndFieldsFromCreateRelationshipDialog(expectedTableList1, parentTable, SELECT_RECORD_ID_AS_FIELD);

                //Add to form now
                modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);

                //Verify the get another record got added to the form builder
                expect(formBuilderPO.getSelectedFieldLabel().split('\n')[0]).toBe(e2eConsts.GET_ANOTHER_RECORD + ' from ' + parentTable);

                //Should still see Add a new record button since you can add relationship to another parent table. So add again
                formBuilderPO.addNewFieldToFormByDoubleClicking(e2eConsts.GET_ANOTHER_RECORD);

                //Verify 'RECORD ID#' is selected as default and select parent table Table 2
                relationshipsPO.verifyTablesAndFieldsFromCreateRelationshipDialog(expectedTableList2, PARENT_TABLE2, '');

                //Add to form now
                modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);

                //Verify the get another record got added to the form builder
                expect(formBuilderPO.getSelectedFieldLabel().split('\n')[0]).toBe(e2eConsts.GET_ANOTHER_RECORD + ' from ' + PARENT_TABLE2);

                //Verify that the create relationship button is not visible since the child table has relationships to all tables in an app.
                newFieldsOnForm = formBuilderPO.getNewFieldLabels();
                expect(newFieldsOnForm.indexOf(e2eConsts.GET_ANOTHER_RECORD) === -1).toBe(true);

                //Remove a field
                let fieldsOnForm = formBuilderPO.getFieldLabels().value.length;
                formBuilderPO.removeField(fieldsOnForm - 1);

                //Verify add another record button becomes available since relationship got deleted
                newFieldsOnForm = formBuilderPO.getNewFieldLabels();
                expect(newFieldsOnForm.indexOf(e2eConsts.GET_ANOTHER_RECORD) === -1).toBe(true);

                //add back the relationship and save
                relationshipsPO.verifyTablesAndFieldsFromCreateRelationshipDialog(expectedTableList2, PARENT_TABLE2, '');

                //Add to form now
                modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);

                //Save form
                //Save the form builder
                formBuilderPO.save();
                //wait until save success container goes away
                notificationContainer.waitUntilNotificationContainerGoesAway();
                //verify You land in view form
                formsPO.waitForViewFormsTableLoad();
            });
        }

    });
}());
