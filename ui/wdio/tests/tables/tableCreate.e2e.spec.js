(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let RequestAppsPage = requirePO('requestApps');
    let tableCreatePO = requirePO('tableCreate');
    let formsPO = requirePO('formsPage');
    let RequestSessionTicketPage = requirePO('requestSessionTicket');
    let rawValueGenerator = require('../../../test_generators/rawValue.generator');
    let ReportContentPO = requirePO('reportContent');
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const descFieldTitleText = 'Description';

    describe('Tables - Create a table via builder tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
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
            RequestAppsPage.get(e2eBase.getRequestAppPageEndpoint(realmName, testApp.id));
            return browser.element('.tablesList .leftNavLink .leftNavLabel').waitForVisible();
        });

        it('Create new table', function() {
            let tableName = rawValueGenerator.generateStringWithFixLength(10);
            let tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: tableName, placeHolder: 'For example, Customers'},
                {fieldTitle: recordNameFieldTitleText, fieldValue: rawValueGenerator.generateStringWithFixLength(10), placeHolder: 'For example, customer'},
                {fieldTitle: descFieldTitleText, fieldValue: rawValueGenerator.generateStringWithFixLength(10), placeHolder: 'Text to show when hovering over the table name in the left navigation'}
            ];

            //Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Verify table elements
            tableCreatePO.verifyTable();

            //Choose an Icon from Icon picker
            let iconChoosedClassName = tableCreatePO.selectRandomIconFromIconChooser();
            //Verify the choosed icon in closed combo
            tableCreatePO.verifyIconInIconChooserCombo(iconChoosedClassName);

            //Enter table field values
            tableFields.forEach(function(tableField) {
                //verify place holders for each table field
                tableCreatePO.verifyTableFieldPlaceHolders(tableField.fieldTitle, tableField.placeHolder);
                //Enter field values
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Click on finished button and make sure it landed in edit Form container page
            tableCreatePO.clickFinishedBtn();

            //Verify the create table dialogue
            tableCreatePO.verifyNewTableCreateDialogue();

            //Click OK button on create table dialogue
            tableCreatePO.clickOkBtn();

            //Click on forms Cancel button
            formsPO.clickFormCancelBtn();

            //Select Table and make sure it lands in reports page
            tableCreatePO.selectTable(tableName);
            //parse table ID from current browser URL; we need this to hit report endpoint for the table
            let currentURL = browser.getUrl();
            let tableId = currentURL.substring(currentURL.lastIndexOf("/") + 1, currentURL.length);

            //Make sure tableHomePage is visible
            ReportContentPO.addRecordButton.waitForVisible();
            //Verify 'Add a Record' button is enabled
            expect(browser.isEnabled('.tableHomePageInitial .addRecordButton')).toBeTruthy();
            //Verify text on the addRecord button
            expect(ReportContentPO.addRecordButton.getAttribute('textContent')).toBe('Add a record');
            //Verify a few other elements on tableHomePage
            browser.element('.iconTableSturdy-Spreadsheet').waitForVisible();
            expect(browser.element('.tableHomePageInitial .h1').getAttribute('textContent')).toBe('Start using your table');
            expect(browser.element('.tableHomePageInitial .createTableLink').getAttribute('textContent')).toBe('Create another table');
            expect(browser.isEnabled('.tableHomePageInitial .createTableLink')).toBeTruthy();

            //Load a report for the table and verify report elements
            RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, tableId, 1));
            ReportContentPO.waitForLeftNavLoaded();
            browser.element('.noRowsIcon').waitForVisible();
            expect(browser.element('.recordsCount').getAttribute('textContent')).toBe('0 records');
            expect(browser.element('.noRowsText').getAttribute('textContent')).toBe('There are no ' + tableName.toLowerCase() + ' to see right now.');
        });

        it('Verify ICON chooser search', function() {

            //Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Verify iconChooser search functionality
            tableCreatePO.searchIconFromChooser('bicycle');
            let searchReturnedIcons = tableCreatePO.getAllIconsFromIconChooser;
            //Verify it returns just one
            expect(searchReturnedIcons.value.length).toBe(1);
            expect(searchReturnedIcons.getAttribute('className')).toContain('iconTableSturdy-bicycle');

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
                        {fieldTitle: descFieldTitleText, fieldValue: 'test Description'}
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
                        {fieldTitle: descFieldTitleText, fieldValue: 'test Description'}
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
                        {fieldTitle: descFieldTitleText, fieldValue: 'test Description'}
                    ],
                    tableFieldError: [
                        {fieldTitle: tableNameFieldTitleText, fieldError: 'Fill in a different value. Another table is already using this name'},
                    ]
                }
            ];
        }

        tableFieldValidationTestCases().forEach(function(testCase) {
            it('Create new table ' + testCase.message, function() {

                //Get the original count of table links in the left nav
                let originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

                //Click on new table button
                tableCreatePO.clickCreateNewTable();

                //Enter table field values
                testCase.tableFields.forEach(function(tableField) {
                    tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
                });

                //Verify validation
                testCase.tableFieldError.forEach(function(tableField) {
                    tableCreatePO.verifyTableFieldValidation(tableField.fieldTitle, tableField.fieldError);
                    //Verify create table button is not enabled since there is error in field values
                    expect(browser.isEnabled('.modal-footer .finishedButton')).toBeFalsy();
                });

                //Cancel table dialogue
                tableCreatePO.clickCancelBtn();

                //Get the new count of table links in the left nav
                let newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

                //Verify the table links NOT increased(ie table not saved)
                expect(newTableLinksCount).toBe(originalTableLinksCount);

            });
        });

        it('Verify clicking on close button closes the new table dialogue without saving the table', function() {
            let tableName = rawValueGenerator.generateStringWithFixLength(10);
            let tableFields = [
                {fieldTitle: tableNameFieldTitleText, fieldValue: tableName},
                {fieldTitle: recordNameFieldTitleText, fieldValue: rawValueGenerator.generateStringWithFixLength(10)},
                {fieldTitle: descFieldTitleText, fieldValue: rawValueGenerator.generateStringWithFixLength(10)}
            ];

            //Get the original count of table links in the left nav
            let originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Enter table field values
            tableFields.forEach(function(tableField) {
                tableCreatePO.enterTableFieldValue(tableField.fieldTitle, tableField.fieldValue);
            });

            //Click on close button on the dialogue
            tableCreatePO.clickCloseBtn();

            //Get the new count of table links in the left nav
            let newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Verify the table links NOT increased(ie table not saved)
            expect(newTableLinksCount).toBe(originalTableLinksCount);

            //Verify the new table name is not in the list of the leftNav tables
            let tableList = tableCreatePO.getAllTablesFromLeftNav();
            expect(tableList.indexOf(tableName)).toBe(-1);

        });

        it('Verify that only ADMIN can add a new table', function() {

            //get the user authentication
            RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));

            //go to apps page
            // Load the requestAppsPage (shows a list of all the apps in a realm)
            RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));

            //select the App
            RequestAppsPage.selectApp(testApp.name);

            //select the table
            tableCreatePO.selectTable(testApp.tables[e2eConsts.TABLE1].name);

            //wait until you see tableLists got loaded
            browser.element('.tablesList').waitForVisible();

            //Verify New Table button not available for user other than ADMIN
            expect(browser.isVisible('.newTable')).toBeFalsy();
        });
    });
}());
