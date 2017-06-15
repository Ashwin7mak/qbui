(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let tableCreatePO = requirePO('tableCreate');
    let formsPO = requirePO('formsPage');
    let formBuilderPO = requirePO('formBuilder');
    let modalDialog = requirePO('/common/modalDialog');
    let RequestAppsPage = requirePO('requestApps');
    let rawValueGenerator = require('../../../test_generators/rawValue.generator');
    let ReportContentPO = requirePO('reportContent');
    const tableNameFieldTitleText = '* Table name';
    const recordNameFieldTitleText = '* A record in the table is called';
    const descFieldTitleText = 'Description';
    const RECORD_TITLE_FIELD_NAME = '* Record title';


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
            return e2ePageBase.loadAppByIdInBrowser(realmName, testApp.id);
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
            modalDialog.clickOnModalDialogBtn(modalDialog.CREATE_TABLE_BTN);
            tableCreatePO.waitUntilNotificationContainerGoesAway();

            //Verify the create table dialogue
            tableCreatePO.verifyNewTableCreateDialogue();

            //Click OK button on create table dialogue
            modalDialog.clickOnModalDialogBtn(modalDialog.TABLE_READY_DLG_OK_BTN);

            //Verify the record title field is visible for a table created via UI.
            let fieldsOnForm = formBuilderPO.getFieldLabels();
            //Verify 1st field on the page is 'record title'
            expect(fieldsOnForm[0]).toBe(RECORD_TITLE_FIELD_NAME);

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
            expect(browser.isEnabled('.tableHomePageInitial .addRecordButton')).toBe(true);
            //Verify text on the addRecord button
            expect(ReportContentPO.addRecordButton.getAttribute('textContent')).toBe('Add a record');
            //Verify a few other elements on tableHomePage
            browser.element('.iconTableSturdy-Spreadsheet').waitForVisible();
            expect(browser.element('.tableHomePageInitial .h1').getAttribute('textContent')).toBe('Start using your table');
            expect(browser.element('.tableHomePageInitial .createTableLink').getAttribute('textContent')).toBe('Create another table');
            expect(browser.isEnabled('.tableHomePageInitial .createTableLink')).toBe(true);

            //Load a report for the table and verify report elements
            e2ePageBase.navigateTo(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, tableId, 1));
            ReportContentPO.waitForLeftNavLoaded();
            browser.element('.noRowsIcon').waitForVisible();
            expect(browser.element('.recordsCount').getAttribute('textContent')).toBe('0 records');
            expect(browser.element('.noRowsText').getAttribute('textContent')).toBe('There are no ' + tableName.toLowerCase() + ' to see right now.');
        });

        it('Verify ICON chooser search', function() {

            //Click on new table button
            tableCreatePO.clickCreateNewTable();

            //Enter table name
            tableCreatePO.enterTableFieldValue(tableNameFieldTitleText, 'searchIcon');

            //Verify iconChooser search functionality
            tableCreatePO.searchIconFromChooser('bicycle');
            let searchReturnedIcons = tableCreatePO.getAllIconsFromIconChooser;
            //Verify it returns just one
            expect(searchReturnedIcons.value.length).toBe(1);
            expect(searchReturnedIcons.getAttribute('className')).toContain('iconTableSturdy-bicycle');

            //close the table dialogue
            tableCreatePO.clickCloseBtn();

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

            //get user authentication
            e2ePageBase.getUserAuthentication(realmName, realmId, userId);

            // Load the app in the realm
            e2ePageBase.loadAppsInBrowser(realmName);

            //Select app
            RequestAppsPage.selectApp(testApp.name);

            //Select table to delete ('Table 1' here) and make sure it lands in reports page
            tableCreatePO.selectTable('Table 1');
            // wait for the report content to be visible
            ReportContentPO.waitForReportContent();

            //Verify New Table button not available for user other than ADMIN
            expect(browser.isVisible('.newItem')).toBe(false);
        });
    });
}());
