(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var tableCreatePO = requirePO('tableCreate');
    var formsPO = requirePO('formsPage');
    let reportContentPO = requirePO('reportContent');
    let leftNavPO = requirePO('leftNav');
    let formBuilderPO = requirePO('formBuilder');
    let modalDialog = requirePO('/common/modalDialog');

    const NEW_PARENT_TABLE = 'newParentTable';
    const PARENT_TABLE_WITHOUT_TITLE_FIELD = 'Parent Table A';
    const CHILD_TABLE = 'Table 1';
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const RECORD_TITLE_FIELD_NAME = '* Record title';
    const GET_ANOTHER_RECORD = 'Get another record';

    describe('Relationships - Create relationship: ', function() {
        var realmName;
        var realmId;
        var testApp;

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
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        /**
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            //Step 1 - Go to report (LIST all report)
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1, 1);
            //wait until view form is visible
            return formsPO.viewFormContainerEl.waitForVisible();
        });

        it('Create table via UI and verify title field shows up', function() {
            let tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: NEW_PARENT_TABLE},
                {fieldTitle: recordNameFieldTitleText, fieldValue: NEW_PARENT_TABLE},
            ];

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

            //Click OK button on create table dialogue
            modalDialog.clickOnModalDialogBtn(modalDialog.TABLE_READY_DLG_OK_BTN);

            //Verify the record title field is visible for a table created via UI.
            let fieldsOnForm = formBuilderPO.getFieldLabels();
            expect(fieldsOnForm[0]).toBe(RECORD_TITLE_FIELD_NAME);

            //Click on forms Cancel button
            formsPO.clickFormCancelBtn();

            //create records in the new table created
            browser.call(function() {
                // Generate and add records to each table (include a dupe and an empty record)
                return e2eBase.recordService.addRecordsToTable(testApp, 0, 5, false, false);
            });
        })

        it('Verify Add another record relationship modal dialog functionality', function(){
            let expectedTablesList = [ 'Table 2', 'Parent Table A', 'Child Table A', 'newParentTable' ];
            let expectedFieldsList = [ 'Record ID#', 'Record title' ];

            //Select settings -> modify this form
            formBuilderPO.open();

            //Click on add a new record button
            formBuilderPO.addNewFieldToFormByDoubleClicking(GET_ANOTHER_RECORD);

            //Verify all dialog contents and functionality
            formBuilderPO.verifyGetAnotherRecordRelationshipDialog(expectedTablesList, NEW_PARENT_TABLE, CHILD_TABLE, expectedFieldsList);
        })

        it('Create relationship between 2 tables via form builder', function() {
            //beforeEach goes to 'Table 1'
            //Select settings -> modify this form
            formBuilderPO.open();

            //Click on add a new record button
            formBuilderPO.addNewFieldToFormByDoubleClicking(GET_ANOTHER_RECORD);

            //Select table from table list
            modalDialog.clickOnModalDialogDropDownArrow()
            modalDialog.selectItemFromModalDialogDropDownList(NEW_PARENT_TABLE);

            //Click on advanced settings
            modalDialog.clickModalDialogAdvancedSettingsToggle();

            //Verify title field is automatically selected


            //Click Add To form button
            modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);
            browser.pause(e2eConsts.shortWaitTimeMs);

            //Verify the get another record got added to the form builder
            expect(formBuilderPO.getSelectedFieldLabel().split('\n')[0]).toBe('Get another record from '+NEW_PARENT_TABLE);

            //Save the form builder
            formBuilderPO.save();
            browser.pause(e2eConsts.longWaitTimeMs);

        })


    });
}());