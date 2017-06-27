
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
let topNavPO = requirePO('topNav');

let parentTable;
let parentPickerTitleFieldValue = 'testTextValue';
let childTableRecordId = rawValueGenerator.generateInt(1, 5);
const tableNameFieldTitleText = '* Table name';
const recordNameFieldTitleText = '* A record in the table is called';
const descFieldTitleText = 'Description';

describe('Relationships - Create multiple relationship Tests :', function() {
    // This app has 2 parent tables and 1 child table. A relationship already exists via API.
    //***** These tests don't run in safari browser as 'scrollIntoView' is not supported by safari.
    //
    let realmName;
    let realmId;
    let testApp;
    let expectedParentTableRecordValues;
    let expectedChildTableRecordValues;
    if (browserName !== 'safari') {
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
                return e2eBase.recordService.addRecordsToTable(testApp, 0, 10, false, false);
            }).then(function() {
                //Add records into table 2
                return e2eBase.recordService.addRecordsToTable(testApp, 1, 10, false, false);
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
                //Create one to one relationship between Table 1 and Table 2
                return e2eBase.relationshipService.createOneToOneRelationship(testApp, testApp.tables[0], testApp.tables[1], 7);
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
                {
                    fieldTitle: recordNameFieldTitleText,
                    fieldValue: rawValueGenerator.generateStringWithFixLength(5)
                },
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
            modalDialog.waitUntilModalDialogSlideAway();

            //Add fields to the form
            formBuilderFields.forEach(function(formBuilderField) {
                formBuilderPO.addNewField(formBuilderField);
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

            //Get record values of child Table
            expectedParentTableRecordValues = reportContentPO.getRecordValues(0);
            expectedParentTableRecordValues.shift();

            return parentTable;
        });

        /**
         * Before each it block reload the 1st record of list all report in view form mode
         */
        beforeEach(function() {
            //Load the child table 'table 2' -> random record in view mode
            return reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1, childTableRecordId);
        });
        it('Verify create relationship button is visible even tough single relationship exists to 1 of the parent table', function() {
            //Select settings -> modify this form
            topNavPO.clickOnModifyFormLink();

            //Verify that the create relationship button is visible since app has 3 tables and relationship exists between only 2 tables
            let newFieldsOnForm = formBuilderPO.getNewFieldLabels();
            expect(newFieldsOnForm.includes(e2eConsts.GET_ANOTHER_RECORD)).toBe(true);

            //Click on forms Cancel button
            formsPO.clickFormCancelBtn();

        });

        it('App with only 3 tables - Create multi relationship', function() {

            //Get child record first Value
            expectedChildTableRecordValues = browser.element('.cellWrapper').getAttribute('textContent');

            //create relationship between parent and child table.
            //NOTE: I am not selecting any field here because 'titleField' should be selected as default
            relationshipsPO.createRelationshipToParentTable(parentTable, '', parentPickerTitleFieldValue, expectedParentTableRecordValues, expectedChildTableRecordValues);
        });

        it('Verify when relationship exists between child table and 2 parent tables in an app unable to create new relationship', function() {
            //Select settings -> modify this form
            topNavPO.clickOnModifyFormLink();

            //Verify that the create relationship button is not visible.
            let newFieldsOnForm = formBuilderPO.getNewFieldLabels();
            expect(newFieldsOnForm.includes(e2eConsts.GET_ANOTHER_RECORD)).toBe(false);

            //Click on forms Cancel button
            formsPO.clickFormCancelBtn();
        });
    }

});

