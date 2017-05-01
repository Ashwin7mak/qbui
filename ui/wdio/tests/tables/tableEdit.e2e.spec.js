(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var RequestAppsPage = requirePO('requestApps');
    var tableCreatePO = requirePO('tableCreate');
    var formsPO = requirePO('formsPage');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var rawValueGenerator = require('../../../test_generators/rawValue.generator');
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';

    describe('Tables - Edit a table via builder tests: ', function() {
        var realmName;
        var realmId;
        var testApp;
        var existingTableName = 'Table 2';

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
            // Load the List All report on Table 1
            return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        it('Add a new table and then edit that table', function() {
            if (browserName !== 'MicrosoftEdge') {
                //****************
                //*Add a table
                //***************
                var tableName = rawValueGenerator.generateStringWithFixLength(5);
                var tableRecord = rawValueGenerator.generateStringWithFixLength(10);
                var tableDescription = rawValueGenerator.generateStringWithFixLength(10);
                var tableFields = [
                    {fieldTitle: tableNameFieldTitleText, fieldValue: tableName},
                    {fieldTitle: recordNameFieldTitleText, fieldValue: tableRecord},
                    {fieldTitle: 'Description', fieldValue: tableDescription}
                ];
                var newTableFields = [
                    {fieldTitle: tableNameFieldTitleText, fieldValue: 'New ' + tableName},
                    {fieldTitle: recordNameFieldTitleText, fieldValue: 'New ' + tableRecord},
                    {fieldTitle: 'Description', fieldValue: 'New ' + tableDescription}
                ];

                //Step 1 - Click on new table button
                tableCreatePO.clickCreateNewTable();

                //Step 2 - Choose an Icon from Icon picker
                var iconChoosedClassName = tableCreatePO.selectRandomIconFromIconChooser();
                //Verify the choosed icon in closed combo
                tableCreatePO.verifyIconInIconChooserCombo(iconChoosedClassName);

                //Step 3 - Enter table field values
                tableFields.forEach(function(tableField) {
                    //Enter field values
                    tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
                });

                //Step 4 - Click on finished button and make sure it landed in edit Form container page
                tableCreatePO.clickFinishedBtn();

                //Step 5 - Click OK button on create table dialogue
                tableCreatePO.clickOkBtn();

                //Step 6- Click on forms Cancel button
                formsPO.clickFormCancelBtn();
                tableCreatePO.newTableBtn.waitForVisible();

                //****************
                //*Verify the table field values created above in Edit mode
                //***************
                //Step 7 - Select Table and make sure it lands in reports page
                tableCreatePO.selectTable(tableName);

                //Step 8 - Click on edit table settings and properties link under global actions gear
                tableCreatePO.clickOnModifyTableSettingsLink();

                //Step 9 - Verify the created table field values in Edit mode.
                //Verify field values that were added while create
                tableFields.forEach(function(tableField) {
                    //Enter field values
                    tableCreatePO.verifyTableFieldValues(tableField.fieldTitle, tableField.fieldValue);
                });
                //verify icon chooser shows up the value selected
                expect(browser.element('.showAllToggle .qbIcon').getAttribute('className')).toContain(iconChoosedClassName);

                //****************
                //*Edit the newely added table with new values
                //***************
                //Step 10 - Select the new icon from icon chooser
                var newIconChoosedClassName = tableCreatePO.selectRandomIconFromIconChooser();
                //Verify the choosed icon in closed combo
                tableCreatePO.verifyIconInIconChooserCombo(newIconChoosedClassName);

                //Step 11 - Enter table invalid field values
                newTableFields.forEach(function(tableField) {
                    tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
                });

                //Step 12 - Click on apply button in edit table mode
                tableCreatePO.clickOnEditTableApplyBtn();

                //Step 13 - Verify new table field values
                newTableFields.forEach(function(tableField) {
                    //Enter field values
                    tableCreatePO.verifyTableFieldValues(tableField.fieldTitle, tableField.fieldValue);
                });
                expect(browser.element('.showAllToggle .qbIcon').getAttribute('className')).toContain(newIconChoosedClassName);

                //Step 14 - Verify table link with new edited table name shows on left Nav . Make sure the table name is updated to new name
                expect(browser.element('.standardLeftNav .contextHeaderTitle').getAttribute('textContent')).toContain('New ' + tableName);

            }
        });

        it('Edit existing table', function() {
            if (browserName !== 'MicrosoftEdge') {
                var tableName = rawValueGenerator.generateStringWithFixLength(5) + ' modified tableName';
                var tableRecord = rawValueGenerator.generateStringWithFixLength(10) + ' updated record a';

                var tableFields = [
                    {fieldTitle: tableNameFieldTitleText, fieldValue: tableName},
                    {fieldTitle: recordNameFieldTitleText, fieldValue: tableRecord}
                ];

                //Step 1 - Click on existing table 'Table 2'
                tableCreatePO.selectTable(existingTableName);

                //Step 2 - Click on edit table settings and properties link of an existing table 'Table 2' under global actions gear
                tableCreatePO.clickOnModifyTableSettingsLink();

                //Step 3 - Select the new icon from icon chooser
                var newIconChoosedClassName = tableCreatePO.selectRandomIconFromIconChooser();

                //Step 4 - Enter new table field values
                tableFields.forEach(function(tableField) {
                    tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
                });

                //Step 5 - Click on apply button in edit table mode
                tableCreatePO.clickOnEditTableApplyBtn();

                //Step 6 - Click on back to apps page link
                tableCreatePO.clickBackToAppsLink();

                //Step 7 - Select Table and make sure it lands in reports page
                tableCreatePO.selectTable(tableName);

                //Step 8 - Click on edit table settings and properties link under global actions gear
                tableCreatePO.clickOnModifyTableSettingsLink();

                //Step 9 - Verify new edited values
                tableFields.forEach(function(tableField) {
                    //Enter field values
                    tableCreatePO.verifyTableFieldValues(tableField.fieldTitle, tableField.fieldValue);
                });

                tableCreatePO.verifyIconInIconChooserCombo(newIconChoosedClassName);
            }
        });

        it('Verify Reset functionality in edit table mode', function() {
            var tableName = rawValueGenerator.generateStringWithFixLength(5);
            var tableRecord = rawValueGenerator.generateStringWithFixLength(10);
            var tableDescription = rawValueGenerator.generateStringWithFixLength(10);
            var tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: tableName},
                {fieldTitle: recordNameFieldTitleText, fieldValue: tableRecord},
                {fieldTitle: 'Description', fieldValue: tableDescription}
            ];
            var originalFieldValues;
            var newFieldValues;

            //Step 1 - Click on existing table 'Table 1'
            tableCreatePO.selectTable('Table 1');

            //Step 2 - Click on edit table settings and properties link of an existing table 'Table 1' under global actions gear
            tableCreatePO.clickOnModifyTableSettingsLink();

            //Step 3 - Get all original field values from table builder
            originalFieldValues = tableCreatePO.getAllTableFieldValues();

            //Step 4 - Select the new icon from icon chooser
            tableCreatePO.selectRandomIconFromIconChooser();

            //Step 5 - Enter new table field values
            tableFields.forEach(function(tableField) {
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Step 6 - Click on apply button in edit table mode
            tableCreatePO.clickOnEditTableResetBtn();

            //Step 7 - Click on back to apps page link
            tableCreatePO.clickBackToAppsLink();

            //Step 8 - Select Table and make sure it lands in reports page
            tableCreatePO.selectTable('Table 1');

            //Step 9 - Click on edit table settings and properties link of an existing table 'Table 1' under global actions gear
            tableCreatePO.clickOnModifyTableSettingsLink();

            //Step 10 - Verify new edited values
            newFieldValues = tableCreatePO.getAllTableFieldValues();

            //Step 11 - Verify originalFieldNames and newFieldsNames are same
            expect(originalFieldValues).toEqual(newFieldValues);
        });

        /**
         * Data provider for table field validation testCases.
         */
        function tableFieldValidationTestCases() {
            return [
                {
                    message: 'with empty table name',
                    tableFields: [
                        {fieldTitle: tableNameFieldTitleText, fieldValue: ' '},
                        {fieldTitle: 'Description', fieldValue: 'test Description'}
                    ],
                    tableFieldError: [
                        {fieldTitle: tableNameFieldTitleText, fieldError: 'Fill in the table name'},
                    ]
                },
                {
                    message: 'with empty required fields',
                    tableFields: [
                        {fieldTitle: tableNameFieldTitleText, fieldValue: ' '},
                        {fieldTitle: recordNameFieldTitleText, fieldValue: ' '},
                        {fieldTitle: 'Description', fieldValue: 'test Description'}
                    ],
                    tableFieldError: [
                        {fieldTitle: tableNameFieldTitleText, fieldError: 'Fill in the table name'},
                        {fieldTitle: recordNameFieldTitleText, fieldError: 'Fill in the record name'}
                    ]
                },
                {
                    message: 'with duplicate table name',
                    tableFields: [
                        {fieldTitle: tableNameFieldTitleText, fieldValue: 'Table 1'},
                        {fieldTitle: recordNameFieldTitleText, fieldValue: 'Table 1'},
                        {fieldTitle: 'Description', fieldValue: 'test Description'}
                    ],
                    tableFieldError: [
                        {fieldTitle: tableNameFieldTitleText, fieldError: 'Fill in a different value. Another table is already using this name'},
                    ]
                },
            ];
        }

        tableFieldValidationTestCases().forEach(function(testCase) {
            it('Verify Edit table Validation ' + testCase.message, function() {

                //Step 1 - Click on existing table 'Table 1'
                tableCreatePO.selectTable('Table 1');

                //Step 2 - Select the table properties of settings of table 1 from global actions gear
                tableCreatePO.clickOnModifyTableSettingsLink();

                //Step 3 - Enter table field values
                testCase.tableFields.forEach(function(tableField) {
                    tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
                });

                //Step 4 - Verify validation
                testCase.tableFieldError.forEach(function(tableField) {
                    tableCreatePO.verifyTableFieldValidation(tableField.fieldTitle, tableField.fieldError);
                    //Verify Apply button is enabled
                    expect(browser.isEnabled('.tableInfoButtons.open .primaryButton')).toBeTruthy();
                    //Verify Reset button is enabled
                    expect(browser.isEnabled('.tableInfoButtons.open .secondaryButton')).toBeTruthy();
                });

                //Step 5 - Verify table link with table name shows on left Nav . Make sure the table name is not updated, it is still 'Table 2'
                expect(browser.element('.standardLeftNav .contextHeaderTitle').getAttribute('textContent')).toContain('Table 1');

                //Step 6 - Verify 'Back to app' link shows up in the left Nav
                expect(browser.element('.standardLeftNav .navItemContent').getAttribute('textContent')).toContain('Back to app');

                //Step 7 - Verify bck to app link is enabled
                expect(browser.isEnabled('.standardLeftNav .navItemContent')).toBeTruthy();
            });
        });

        it('Verify that only ADMIN can edit a new table', function() {
            var userId;

            //Create a user
            browser.call(function() {
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                });
            });

            //Add user to participant appRole
            browser.call(function() {
                return e2eBase.recordBase.apiBase.assignUsersToAppRole(testApp.id, "11", [userId]);
            });

            //get the user authentication
            browser.call(function() {
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
            });

            //Go to Tables Page
            RequestAppsPage.get(e2eBase.getRequestTableEndpoint(realmName, testApp.id, testApp.tables[0].id));

            //Verify edit settings button not available for user other than ADMIN
            expect(browser.isVisible('.iconUISturdy-settings')).toBeFalsy();
        });
    });
}());
