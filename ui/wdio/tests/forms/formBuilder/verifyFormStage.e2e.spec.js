(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let loadingSpinner = requirePO('/common/loadingSpinner');
    let notificationContainer = requirePO('/common/notificationContainer');
    let formBuilderPO = requirePO('formBuilder');
    let topNavPO = requirePO('topNav');
    let reportContentPO = requirePO('reportContent');
    let tableCreatePO = requirePO('tableCreate');
    let rawValueGenerator = require('../../../../test_generators/rawValue.generator');
    let modalDialog = requirePO('/common/modalDialog');
    var formsPO = requirePO('formsPage');
    let _ = require('lodash');

    describe('Form Builder Stage Tests: ', function() {
        const tableNameFieldTitleText = '* Table name';
        const recordNameFieldTitleText = '* A record in the table is called';
        let realmName;
        let realmId;
        let testApp;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
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
         * Before each it block reload the 1st record of list all report in view form mode
         */
        beforeEach(function() {
            //Load the child table 'table 2' -> random record in view mode
            return reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1, 1);
        });


        it('Verify titleField drop down for table created via core with customfields', function() {
            let expectedDropDownFields = e2eConsts.reportFieldNames;
            expectedDropDownFields.push('Default to Table 1 + ID');

            //Select settings -> modify this form
            topNavPO.clickOnModifyFormLink();

            //Verify the titleField dropDown contents
            formBuilderPO.verifyFormBuilderStageTitleFieldDropDown(expectedDropDownFields);
        });

        it('Verify titleField drop down for table created via UI', function() {
            let tableName = rawValueGenerator.generateStringWithFixLength(5);
            let tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: tableName},
                {fieldTitle: recordNameFieldTitleText, fieldValue: tableName},
            ];
            let expectedDropDownFields = ['Record ID#', 'Record title', 'Text', 'Date', 'Default to ' + tableName + ' + ID'];

            //Create table via UI
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

            //Verify the titleField dropDown contents on the form stage
            formBuilderPO.verifyFormBuilderStageTitleFieldDropDown(expectedDropDownFields);
        });

        it('Edit the titleField dropdown value and verify it got saved', function() {
            let randomField = _.sample(e2eConsts.reportFieldNames);

            //Select settings -> modify this form
            topNavPO.clickOnModifyFormLink();

            //Click on titleField dropdown
            formBuilderPO.formStageTitleFieldDropDown.click();

            //select the random field
            formsPO.selectFromList(randomField);

            //Click on Save
            formBuilderPO.save();

            //Verify the field got saved in table
            //Select table
            tableCreatePO.selectTable('Table 1');

            //go to the table settings page for the table
            topNavPO.clickOnTableSettingsLink();
            //verify the selected value
            let pickerfield = browser.element('.recordTitleFieldSelect');
            expect(pickerfield.element('.Select-value-label').getText()).toEqual(randomField);
        });

    });
}());
