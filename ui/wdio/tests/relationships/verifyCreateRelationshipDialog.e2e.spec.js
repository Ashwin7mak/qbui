
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
let topNavPO = requirePO('topNav');

let parentTable;
let newFieldsOnForm;
const SELECT_RECORD_ID_AS_FIELD = 'Record ID#';
const RECORD_TITLE = 'Record title';
const RECORD_ID = 'Record ID#';
const tableNameFieldTitleText = '* Table name';
const recordNameFieldTitleText = '* A record in the table is called';
const descFieldTitleText = 'Description';
const PARENT_TABLE2 = 'Table 2';

describe('Relationships - Verify create relationship dialog Tests :', function() {
    let realmName;
    let realmId;
    let testApp;
    if (browserName === 'chrome' || browserName === 'MicrosoftEdge') {
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function () {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            var generatedApp = e2eBase.appService.generateAppFromMap(e2eConsts.basicTableMap());
            // Create the app via the API
            return e2eBase.appService.createApp(generatedApp).then(function (createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function () {
                //Add records into table 1
                return e2eBase.recordService.addRecordsToTable(testApp, 0, 10, false, false);
            }).then(function () {
                //Add records into table 2
                return e2eBase.recordService.addRecordsToTable(testApp, 1, 10, false, false);
            }).then(function () {
                //Create a form for each table
                return e2eBase.formService.createDefaultForms(testApp);
            }).then(function () {
                // Create a Table 1 report
                return e2eBase.reportService.createCustomReport(testApp.id, testApp.tables[0].id, 'Table 1 Report', null, null, null, null);
            }).then(function () {
                // Create a Table 2 report
                return e2eBase.reportService.createCustomReport(testApp.id, testApp.tables[1].id, 'Table 2 Report', null, null, null, null);
            }).then(function () {
                // Generate and add the default set of Users to the app
                return e2eBase.userService.addDefaultUserListToApp(testApp.id);
            }).then(function () {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function (error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        beforeAll(function () {
            parentTable = rawValueGenerator.generateStringWithFixLength(5);
            let tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: parentTable},
                {
                    fieldTitle: recordNameFieldTitleText,
                    fieldValue: rawValueGenerator.generateStringWithFixLength(5)
                },
                {fieldTitle: descFieldTitleText, fieldValue: rawValueGenerator.generateStringWithFixLength(5)}
            ];
            //Create a new parent table and single record into new table
            let formBuilderFields = ['Number'];

            //go to appId page
            e2ePageBase.loadAppByIdInBrowser(realmName, testApp.id);

            //create table via UI
            //Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Enter table field values
            tableFields.forEach(function (tableField) {
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
            modalDialog.waitUntilModalDialogSlideAway();

            //Add fields to the form
            formBuilderFields.forEach(function (formBuilderField) {
                formBuilderPO.addNewField(formBuilderField);
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
        beforeEach(function () {
            //Load the child table 'Table 1' -> record 1 in view mode
            return reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1, 1);
        });

        it('Verify cancel dialog and reAdd 2 fields then delete a field and add field again flow. This also includes verifying default fields and changing defaults.', function () {
            let expectedTableList1 = ['Table 2', parentTable];
            let expectedTableList2 = ['Table 2'];

            //Select settings -> modify this form
            topNavPO.clickOnModifyFormLink();

            //Click on add a new record button
            formBuilderPO.addNewField(e2eConsts.GET_ANOTHER_RECORD);

            //Verify 'RECORD TITLE' is selected as default and select parent table PARENT_TABLE
            relationshipsPO.verifyTablesAndFieldsFromCreateRelationshipDialog(expectedTableList1, parentTable, '', RECORD_TITLE);

            //Cancel the create relationship dialog
            modalDialog.clickOnModalDialogBtn(modalDialog.CANCEL_BTN);
            modalDialog.waitUntilModalDialogSlideAway();

            //Add a new record button again since its canceled above
            formBuilderPO.addNewField(e2eConsts.GET_ANOTHER_RECORD);

            //select parent table PARENT_TABLE and Change the default 'RECORD TITLE' to 'RECORD ID'
            relationshipsPO.verifyTablesAndFieldsFromCreateRelationshipDialog(expectedTableList1, parentTable, SELECT_RECORD_ID_AS_FIELD, '');

            //Add to form now
            modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);
            modalDialog.waitUntilModalDialogSlideAway();

            //Verify the get another record got added to the form builder
            expect(formBuilderPO.getSelectedFieldLabel().split('\n')[0]).toBe(e2eConsts.GET_ANOTHER_RECORD + ' from ' + parentTable);

            //Should still see Add a new record button since you can add relationship to another parent table. So add again
            formBuilderPO.addNewField(e2eConsts.GET_ANOTHER_RECORD);

            //Verify 'RECORD ID#' is selected as default and select parent table Table 2
            relationshipsPO.verifyTablesAndFieldsFromCreateRelationshipDialog(expectedTableList2, PARENT_TABLE2, '', RECORD_ID);

            //Add to form now
            modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);
            modalDialog.waitUntilModalDialogSlideAway();

            //Verify the get another record got added to the form builder
            expect(formBuilderPO.getSelectedFieldLabel().split('\n')[0]).toBe(e2eConsts.GET_ANOTHER_RECORD + ' from ' + PARENT_TABLE2);

            //Verify that the create relationship button is not visible since the child table has relationships to all tables in an app.
            newFieldsOnForm = formBuilderPO.getNewFieldLabels();
            expect(newFieldsOnForm.includes(e2eConsts.GET_ANOTHER_RECORD)).toBe(false);

            //Remove a field
            let fieldsOnForm = formBuilderPO.getFieldLabels();
            formBuilderPO.removeField(fieldsOnForm.length);

            //Verify add another record button becomes available since relationship got deleted
            newFieldsOnForm = formBuilderPO.getNewFieldLabels();
            expect(newFieldsOnForm.includes(e2eConsts.GET_ANOTHER_RECORD)).toBe(true);

            //add back the relationship which we removed and save
            formBuilderPO.addNewField(e2eConsts.GET_ANOTHER_RECORD);
            //Select table from table list of add a record dialog
            modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogTableSelectorDropDownArrow, PARENT_TABLE2);

            //Add to form now
            modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);
            modalDialog.waitUntilModalDialogSlideAway();

            //Verify the get another record got added back to the form builder
            expect(formBuilderPO.getSelectedFieldLabel().split('\n')[0]).toBe(e2eConsts.GET_ANOTHER_RECORD + ' from ' + PARENT_TABLE2);

            //Save form
            //Save the form builder
            formBuilderPO.save();
            //wait until save success container goes away
            notificationContainer.waitUntilNotificationContainerGoesAway();
            //verify You land in view form
            formsPO.waitForViewFormsTableLoad();

            //Finally verify on view form you see 2 parent pickers
            let fieldsOnViewForm = formsPO.getAllFieldsInViewForm();
            expect(fieldsOnViewForm.includes(e2eConsts.GET_ANOTHER_RECORD + ' from ' + parentTable)).toBe(true);
            expect(fieldsOnViewForm.includes(e2eConsts.GET_ANOTHER_RECORD + ' from ' + PARENT_TABLE2)).toBe(true);

        });
    }
});
