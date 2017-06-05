(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var tableCreatePO = requirePO('tableCreate');
    var formsPO = requirePO('formsPage');
    let ReportContentPO = requirePO('reportContent');
    let leftNavPO = requirePO('leftNav');
    var rawValueGenerator = require('../../../test_generators/rawValue.generator');
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const descFieldTitleText = 'Description';

    describe('Tables - Edit Table validation tests: ', function() {
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
                        {fieldTitle: recordNameFieldTitleText, fieldValue: 'Table 1'}
                    ],
                    tableFieldError: [
                        {fieldTitle: tableNameFieldTitleText, fieldError: 'Fill in the table name'},
                    ]
                },
                {
                    message: 'with empty required fields',
                    tableFields: [
                        {fieldTitle: tableNameFieldTitleText, fieldValue: ' '},
                        {fieldTitle: recordNameFieldTitleText, fieldValue: ' '}
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
                        {fieldTitle: recordNameFieldTitleText, fieldValue: 'Table 1'}
                    ],
                    tableFieldError: [
                        {fieldTitle: tableNameFieldTitleText, fieldError: 'Fill in a different value. Another table is already using this name'},
                    ]
                },
            ];
        }

        //TODO disabling this test and fix it tomorrow so it wont block master e2e failure
        tableFieldValidationTestCases().forEach(function(testCase) {
            it('Verify Edit table Validation ' + testCase.message, function() {

                //Click on existing table named 'Table 2'
                tableCreatePO.selectTable(existingTableName);

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

                //Verify Apply button is disabled
                expect(browser.isEnabled('.tableInfoButtons.open .primaryButton')).toBe(false);
                //Verify Reset button is enabled
                expect(browser.isEnabled('.tableInfoButtons.open .secondaryButton')).toBe(true);

                //Verify table link with table name shows on left Nav . Make sure the table name is not updated, it is still 'Table 2'
                expect(browser.element('.standardLeftNav .contextHeaderTitle').getAttribute('textContent')).toContain(existingTableName);

                //Verify 'Back to app' link shows up in the left Nav
                expect(browser.element('.standardLeftNav .navItemContent').getAttribute('textContent')).toContain('Back to app');

                //Verify bck to app link is enabled
                expect(browser.isEnabled('.standardLeftNav .navItemContent')).toBe(true);

                //Click on reset at the end
                tableCreatePO.clickOnEditTableResetBtn();

            });
        });
    });
}());
