(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var tableCreatePO = requirePO('tableCreate');
    var formsPO = requirePO('formsPage');
    let reportContentPO = requirePO('reportContent');
    let RequestAppsPage = requirePO('requestApps');
    let formBuilderPO = requirePO('formBuilder');
    let modalDialog = requirePO('/common/modalDialog');

    const NEW_PARENT_TABLE = 'newParentTable';
    const CHILD_TABLE = 'Table 1';
    const RECORD_TITLE_FIELD_NAME = '* Record title';
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const GET_ANOTHER_RECORD = 'Get another record';

    describe('Relationships - Create relationship via form builder: ', function() {
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
                //Delete API created 'Table 2' table
                return e2eBase.tableService.deleteTable(testApp.id, testApp.tables[e2eConsts.TABLE2].id);
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
            //Create new parent table

            let tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: NEW_PARENT_TABLE},
                {fieldTitle: recordNameFieldTitleText, fieldValue: NEW_PARENT_TABLE},
            ];

            //select app
            RequestAppsPage.selectApp(testApp.name);

            //Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Enter table field values
            tableFields.forEach(function(tableField) {
                //Enter field values
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Click on create table button
            modalDialog.clickOnModalDialogBtn(modalDialog.CREATE_TABLE_BTN);
            tableCreatePO.waitUntilNotificationContainerGoesAway();

            //Click OK button on create table dialogue
            modalDialog.clickOnModalDialogBtn(modalDialog.TABLE_READY_DLG_OK_BTN);

            //Verify the record title field is visible for a table created via UI.
            let fieldsOnForm = formBuilderPO.getFieldLabels();
            //Verify 1st field on the page is 'record title'
            expect(fieldsOnForm[0]).toBe(RECORD_TITLE_FIELD_NAME);

            //Click on forms save button
            formBuilderPO.save();
            //wait until save success container goes away
            tableCreatePO.waitUntilNotificationContainerGoesAway();
        });

        /**
         * Before each it block reload the 1st record of list all report in view form mode
         */
        beforeEach(function() {
            //Go to 'Table 1' 1st record in view mode
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1, 1);
            //wait until view form is visible
            return formsPO.viewFormContainerEl.waitForVisible();
        });

        //mouseMoves not working on firefox latest driver and safari. Add To Record button is at the bottom so cannot navigate to it to double click on that button
        if (browserName === 'chrome' || browserName === 'MicrosoftEdge') {
            it('Verify Add another record relationship modal dialog functionality', function() {

                let expectedTablesList = ['newParentTable'];
                let expectedFieldsList = ['Record ID#', 'Record title'];

                //Select settings -> modify this form
                formBuilderPO.open();

                //Click on add a new record button
                formBuilderPO.addNewField(GET_ANOTHER_RECORD);

                //Verify all dialog contents and functionality
                formBuilderPO.verifyGetAnotherRecordRelationshipDialog(expectedTablesList, NEW_PARENT_TABLE, CHILD_TABLE, expectedFieldsList);
            });

            it('Create relationship between 2 tables via form builder', function() {
                let allFieldsOnViewForm = [];
                //beforeEach goes to 'Table 1'
                //Select settings -> modify this form
                formBuilderPO.open();

                //Click on add a new record button
                formBuilderPO.addNewField(GET_ANOTHER_RECORD);

                //Select table from table list
                modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogTableSelectorDropDownArrow, NEW_PARENT_TABLE);

                //Click on advanced settings
                modalDialog.clickModalDialogAdvancedSettingsToggle();

                //Verify title field is automatically selected
                expect(browser.element('.modal-dialog .advancedSettings .Select-control').getAttribute('textContent')).toBe('Record title');

                //Click Add To form button
                modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);
                browser.pause(e2eConsts.shortWaitTimeMs);

                //Verify the get another record got added to the form builder
                expect(formBuilderPO.getSelectedFieldLabel().split('\n')[0]).toBe(GET_ANOTHER_RECORD + ' from ' + NEW_PARENT_TABLE);

                //Save the form builder
                formBuilderPO.save();
                //wait until save success container goes away
                tableCreatePO.waitUntilNotificationContainerGoesAway();
                //verify You land in view form
                formsPO.waitForViewFormsTableLoad();

                //Verify field got added to the view form
                formsPO.getAllFieldLabelsOnForm(formsPO.viewFormContainerEl).value.filter(function(fieldLabel) {
                    allFieldsOnViewForm.push(fieldLabel.getAttribute('textContent'));
                });
                expect(allFieldsOnViewForm.includes('Get another record from ' + NEW_PARENT_TABLE)).toBe(true);
            });

            it('Verify there is no create relationship button visible if child table has relationships to all the tables in an app', function() {
                //Select settings -> modify this form
                formBuilderPO.open();

                //Verify that the create relationship button is not visible.
                let newFieldsOnForm = formBuilderPO.getNewFieldLabels();
                expect(newFieldsOnForm.indexOf(GET_ANOTHER_RECORD) === -1).toBe(true);

                //Click on forms Cancel button
                formsPO.clickFormCancelBtn();

            });
        }

    });
}());
