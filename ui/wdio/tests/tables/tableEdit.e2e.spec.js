(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var tableCreatePO = requirePO('tableCreate');
    var formsPO = requirePO('formsPage');
    let ReportContentPO = requirePO('reportContent');
    let modalDialog = requirePO('/common/modalDialog');
    let RequestAppsPage = requirePO('requestApps');
    var rawValueGenerator = require('../../../test_generators/rawValue.generator');
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const descFieldTitleText = 'Description';

    describe('Tables - Edit a table via builder tests: ', function() {
        var realmName;
        var realmId;
        var testApp;
        var existingTableName = 'Table 2';
        let userId;

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
            }).then(function() {
                // Create a user
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                });
            }).then(function() {
                // Add user to participant appRole
                return e2eBase.recordBase.apiBase.assignUsersToAppRole(testApp.id, e2eConsts.PARTICIPANT_ROLEID, [userId]);
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

        it('Edit existing table', function() {
            var tableName = rawValueGenerator.generateStringWithFixLength(5) + ' modified tableName';
            var tableRecord = rawValueGenerator.generateStringWithFixLength(10) + ' updated record a';

            var tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: tableName},
                {fieldTitle: recordNameFieldTitleText, fieldValue: tableRecord}
            ];

            //Click on existing table 'Table 2'
            tableCreatePO.selectTable(existingTableName);

            //Click on edit table settings and properties link of an existing table 'Table 2' under global actions gear
            tableCreatePO.clickOnModifyTableSettingsLink();

            //Select the new icon from icon chooser
            var newIconChoosedClassName = tableCreatePO.selectRandomIconFromIconChooser();

            //Enter new table field values
            tableFields.forEach(function(tableField) {
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Click on apply button in edit table mode
            tableCreatePO.clickOnEditTableApplyBtn();

            //Click on back to apps page link
            tableCreatePO.clickBackToAppsLink();

            //Select Table and make sure it lands in reports page
            tableCreatePO.selectTable(tableName);

            //Click on edit table settings and properties link under global actions gear
            tableCreatePO.clickOnModifyTableSettingsLink();

            //Verify new edited values
            tableFields.forEach(function(tableField) {
                //Enter field values
                tableCreatePO.verifyTableFieldValues(tableField.fieldTitle, tableField.fieldValue);
            });

            tableCreatePO.verifyIconInIconChooserCombo(newIconChoosedClassName);
        });

        it('Verify Reset functionality in edit table mode', function() {
            var tableName = rawValueGenerator.generateStringWithFixLength(5);
            var tableRecord = rawValueGenerator.generateStringWithFixLength(10);
            var tableDescription = rawValueGenerator.generateStringWithFixLength(10);
            var tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: tableName},
                {fieldTitle: recordNameFieldTitleText, fieldValue: tableRecord},
                {fieldTitle: descFieldTitleText, fieldValue: tableDescription}
            ];
            var originalFieldValues;
            var newFieldValues;

            //Click on existing table 'Table 1'
            tableCreatePO.selectTable('Table 1');

            //Click on edit table settings and properties link of an existing table 'Table 1' under global actions gear
            tableCreatePO.clickOnModifyTableSettingsLink();

            //Get all original field values from table builder
            originalFieldValues = tableCreatePO.getAllTableFieldValues();

            //Select the new icon from icon chooser
            tableCreatePO.selectRandomIconFromIconChooser();

            //Enter new table field values
            tableFields.forEach(function(tableField) {
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Click on apply button in edit table mode
            tableCreatePO.clickOnEditTableResetBtn();

            //Click on back to apps page link
            tableCreatePO.clickBackToAppsLink();

            //Select Table and make sure it lands in reports page
            tableCreatePO.selectTable('Table 1');

            //Click on edit table settings and properties link of an existing table 'Table 1' under global actions gear
            tableCreatePO.clickOnModifyTableSettingsLink();

            //Verify new edited values
            newFieldValues = tableCreatePO.getAllTableFieldValues();

            //Verify originalFieldNames and newFieldsNames are same
            expect(originalFieldValues).toEqual(newFieldValues);
        });

        it('Verify that only ADMIN can edit a new table', function() {
            //get user authentication and go to apps page
            newStackAuthPO.nonAdminRealmLogin(realmName, realmId, userId);

            //Select app
            RequestAppsPage.selectApp(testApp.name);

            //Select table Table 1
            e2ePageBase.loadTableByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id);

            //Verify settings icon not available for user other than ADMIN
            expect(browser.isExisting('.topNav .iconUISturdy-settings')).toBe(false);
            expect(browser.isVisible('.topNav .iconUISturdy-settings')).toBe(false);
        });
    });
}());
