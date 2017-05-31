(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let RequestAppsPage = requirePO('requestApps');
    let tableCreatePO = requirePO('tableCreate');
    let formsPO = requirePO('formsPage');
    let RequestSessionTicketPage = requirePO('requestSessionTicket');
    let leftNavPO = requirePO('leftNav');
    let rawValueGenerator = require('../../../test_generators/rawValue.generator');
    let ReportContentPO = requirePO('reportContent');
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const descFieldTitleText = 'Description';

    describe('Tables - Create table validation tests: ', function() {
        let realmName;
        let realmId;
        let testApp;

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
            e2ePageBase.navigateTo(e2eBase.getRequestAppPageEndpoint(realmName, testApp.id));
            //wait until loading screen disappear in leftnav
            return leftNavPO.waitUntilSpinnerGoesAwayInLeftNav();
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
                    expect(browser.isEnabled('.modal-footer .finishedButton')).toBe(false);
                });

                //Cancel table dialogue
                tableCreatePO.clickCancelBtn();

                //Get the new count of table links in the left nav
                let newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

                //Verify the table links NOT increased(ie table not saved)
                expect(newTableLinksCount).toBe(originalTableLinksCount);

            });
        });
    });
}());
