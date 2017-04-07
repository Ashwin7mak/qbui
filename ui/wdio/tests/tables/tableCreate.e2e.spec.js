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


    describe('Create table tests : ', function() {
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
            //load the tables page
            RequestAppsPage.get(e2eBase.getRequestTableEndpoint(realmName, testApp.id, testApp.tables[0].id));
            return tableCreatePO.newTableBtn.waitForVisible();
        });

        it('Create new table', function() {
            var tableName = rawValueGenerator.generateStringWithFixLength(10);
            var tableFields = [
                {fieldTitle: '* Table Name', fieldValue: tableName, placeHolder: 'For example, Customers'},
                {fieldTitle: '* A record in the table is called', fieldValue: rawValueGenerator.generateStringWithFixLength(10), placeHolder: 'For example, customer'},
                {fieldTitle: 'Description', fieldValue: rawValueGenerator.generateStringWithFixLength(50), placeHolder: 'Text to show when hovering over the table name in the left navigation'}
            ];

            //Step 1 - get the original count of table links in the left nav
            var originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Step 2 - Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Step 3 - Verify table elements
            tableCreatePO.verifyTable();

            //Step 4 - Choose an Icon from Icon picker
            var iconChoosedClassName = tableCreatePO.selectRandomIconFromIconChooser();
            //Verify the choosed icon in closed combo
            tableCreatePO.verifyIconInIconChooserCombo(iconChoosedClassName);

            //Step 5 - Enter table field values
            tableFields.forEach(function(tableField) {
                //verify place holders for each table field
                tableCreatePO.verifyTableFieldPlaceHolders(tableField.fieldTitle, tableField.placeHolder);
                //Enter field values
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Step 6 - Verify iconChooser search functionality
            tableCreatePO.searchIconFromChooser('bicycle');
            var searchReturnedIcons = tableCreatePO.getAllIconsFromIconChooser;
            //Verify it returns just one
            expect(searchReturnedIcons.value.length).toBe(1);
            expect(searchReturnedIcons.getAttribute('className')).toBe('qbIcon iconTableSturdy-bicycle');

            //Step 7 - Click next field and verify it landed in drag fields page
            tableCreatePO.clickNextBtn();

            //Step 8 - Click on finished button and make sure it landed in edit Form container page
            tableCreatePO.clickFinishedBtn();

            //Step 9 - Click on forms Cancel button
            formsPO.clickFormCancelBtn();
            tableCreatePO.newTableBtn.waitForVisible();


            //Step 10 - Get the new count of table links in the left nav
            var newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Step 11 - Verify the table links count got increased by 1
            expect(newTableLinksCount).toBe(originalTableLinksCount + 1);

            //Step 12 - Select Table and make sure it lands in reports page
            tableCreatePO.selectTable(tableName);
        });

        /**
         * Data provider for table field validation testCases.
         */
        function tableFieldValidationTestCases() {
            return [
                {
                    message: 'with empty table name',
                    tableFields: [
                        {fieldTitle: '* Table Name', fieldValue: '\uE00D  ', fieldError: 'Fill in the table name'},
                        {fieldTitle: 'Description', fieldValue: 'test Description'}
                    ]
                },
                {
                    message: 'with empty required fields',
                    tableFields: [
                        {fieldTitle: '* Table Name', fieldValue: '\uE00D  ', fieldError: 'Fill in the table name'},
                        {fieldTitle: '* A record in the table is called', fieldValue: '\uE00D  ', fieldError: 'Fill in the record name'},
                        {fieldTitle: 'Description', fieldValue: 'test Description'}
                    ]
                },
                {
                    message: 'with duplicate table name',
                    tableFields: [
                        {fieldTitle: '* Table Name', fieldValue: 'Table 1', fieldError: 'Fill in a different value. Another table is already using this name'},
                        {fieldTitle: '* A record in the table is called', fieldValue: 'Table 1'},
                        {fieldTitle: 'Description', fieldValue: 'test Description'}
                    ]
                },
            ];
        }

        tableFieldValidationTestCases().forEach(function(testCase) {
            it('Create new table ' + testCase.message, function() {

                //Step 1 - get the original count of table links in the left nav
                tableCreatePO.newTableBtn.waitForVisible();
                var originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

                //Step 2 - Click on new table button
                tableCreatePO.clickCreateNewTable();

                //Step 3 - Enter table field values and verify validation
                testCase.tableFields.forEach(function(tableField) {
                    tableCreatePO.enterInvalidInputAndVerifyTableFieldValidation(tableField.fieldTitle, tableField.fieldValue, tableField.fieldError);

                    //Verify next button is not enabled since there is error in field values
                    expect(browser.isEnabled('.modal-footer .nextButton')).toBeFalsy();
                });

                //Step 4 - Cancel table dialogue
                tableCreatePO.clickCancelBtn();

                //Step 5 - Get the new count of table links in the left nav
                var newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

                //Step 6 - Verify the table links NOT increased(ie table not saved)
                expect(newTableLinksCount).toBe(originalTableLinksCount);

            });
        });

        it('Verify clicking on Previous button brings to previous page', function() {
            var tableName = rawValueGenerator.generateStringWithFixLength(10);
            var tableFields = [
                {fieldTitle: '* Table Name', fieldValue: tableName},
                {
                    fieldTitle: '* A record in the table is called',
                    fieldValue: rawValueGenerator.generateStringWithFixLength(10)
                }
            ];

            //Step 1 - get the original count of table links in the left nav
            tableCreatePO.newTableBtn.waitForVisible();
            var originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Step 2 - Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Step 3 - Enter table field values
            tableFields.forEach(function(tableField) {
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Step 4 - Click next field and verify it landed in drag fields page
            tableCreatePO.clickNextBtn();

            //Step 5 - Click on previous button on the dialogue
            tableCreatePO.clickPreviousBtn();

            //Step 6 - Verify Next button enabled
            expect(browser.isEnabled('.modal-footer .nextButton')).toBeTruthy();

            //Step 7 - Cancel table dialogue
            tableCreatePO.clickCancelBtn();

        });

        it('Verify clicking on close button closes the new table dialogue without saving the table', function() {
            var tableName = rawValueGenerator.generateStringWithFixLength(10);
            var tableFields = [
                {fieldTitle: '* Table Name', fieldValue: tableName},
                {fieldTitle: '* A record in the table is called', fieldValue: rawValueGenerator.generateStringWithFixLength(10)},
                {fieldTitle: 'Description', fieldValue: rawValueGenerator.generateStringWithFixLength(50)}
            ];

            //Step 1 - get the original count of table links in the left nav
            tableCreatePO.newTableBtn.waitForVisible();
            var originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Step 2 - Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Step 3 - Enter table field values
            tableFields.forEach(function(tableField) {
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Step 4 - Click next field and verify it landed in drag fields page
            tableCreatePO.clickNextBtn();

            //Step 5 - Click on close button on the dialogue
            tableCreatePO.clickCloseBtn();

            //Step 6 - Get the new count of table links in the left nav
            var newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Step 7 - Verify the table links NOT increased(ie table not saved)
            expect(newTableLinksCount).toBe(originalTableLinksCount);

            //Step 8 - Verify the new table name is not in the list of the leftNav tables
            var tableList = tableCreatePO.getAllTablesFromLeftNav();
            expect(tableList.indexOf(tableName)).toBe(-1);

        });

        it('Verify that only ADMIN can add a new table', function() {
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

            //Verify New Table button not available for user other than ADMIN
            expect(browser.isVisible('.newTable')).toBeFalsy();

        });

    });
}());
