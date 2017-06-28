(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let tableCreatePO = requirePO('tableCreate');
    let reportContentPO = requirePO('reportContent');
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    let modalDialog = requirePO('/common/modalDialog');

    describe('Tables - Edit table validation tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let existingTableName = 'Table 2';

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
         * Before All it block load the app.
         */
        beforeEach(function() {
            // Load the requestAppPage (shows a list of all the tables associated with an app in a realm)
            return e2ePageBase.loadAppByIdInBrowser(realmName, testApp.id);
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
                        {fieldTitle: recordNameFieldTitleText, fieldValue: 'Table 1'},
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
                    ],
                    tableFieldError: [
                        {fieldTitle: tableNameFieldTitleText, fieldError: 'Fill in a different value. Another table is already using this name'},
                    ]
                }
            ];
        }

        tableFieldValidationTestCases().forEach(function(testCase) {
            xit('Edit table ' + testCase.message, function() {

                //Select table Table 2
                tableCreatePO.selectTable('Table 2');
                reportContentPO.waitForReportContent();

                //Select the table properties of settings of table 1 from global actions gear
                tableCreatePO.clickOnModifyTableSettingsLink();

                //Enter table field values
                testCase.tableFields.forEach(function(tableField) {
                    tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
                });

                //Verify validation
                testCase.tableFieldError.forEach(function(tableField) {
                    tableCreatePO.verifyTableFieldValidation(tableField.fieldTitle, tableField.fieldError);
                });

                //Verify table link with table name shows on left Nav . Make sure the table name is not updated, it is still 'Table 2'
                expect(browser.element('.standardLeftNav .navHeaderTitle').getAttribute('textContent')).toContain(existingTableName);

                //Click on reset button in edit table mode
                tableCreatePO.clickOnEditTableResetBtn();

                //Click on back to apps page link
                tableCreatePO.clickBackToAppsLink();

            });
        });

        /**
         * Data provider for table field validation testCases.
         */
        function recordTitleFieldPickerTestCases() {
            let aTextField = {name:'Text',
                type:'SCALAR',
                datatypeAttributes:{
                    type:'TEXT'
                }};
            return [
                {
                    message: 'with just built in fields; expect record Id to be the only field on list',
                    table: {name: "Table for TitlePicker 1"},
                    expectedDefaultSelection: "Default to Table for TitlePicker 1 + ID",
                    uiTable: false
                },
                {
                    message: 'with a couple of custom fields; expect record Id + other fields to show on list',
                    table: {name: "Table for TitlePicker 2", fields: [aTextField, aTextField]},
                    expectedDefaultSelection: "Default to Table for TitlePicker 2 + ID",
                    uiTable: false
                },
                {
                    message: 'with record title field; expect record title field selected',
                    table: {name: "Table for TitlePicker 3"},
                    expectedDefaultSelection: "Record title",
                    uiTable: true
                }
            ];
        }

        recordTitleFieldPickerTestCases().forEach(function(testCase) {
            it('Edit table ' + testCase.message, function() {

                //create the table with the specific fields
                let createTablePromise = testCase.uiTable ? e2eBase.tableService.createTableInUI(testApp.id, testCase.table) : e2eBase.tableService.createTableInCore(testApp.id, testCase.table);

                //Load app into the Browser
                e2ePageBase.loadAppByIdInBrowser(realmName, testApp.id);

                tableCreatePO.verifyEditTableTitleFieldDropDown(testApp, testCase.table, testCase.expectedDefaultSelection);
            });
        });
    });
}());
