/**
 * E2E tests for remove users from application
 */
(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let NewStackAuthPO = requirePO('newStackAuth');
    let RequestAppsPage = requirePO('requestApps');
    let UsersTablePage = requirePO('usersTable');
    let ReportContentPO = requirePO('reportContent');
    let ReportTableActionsPO = requirePO('reportTableActions');

    describe('Users - Remove user(s) tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            return e2eBase.basicAppSetup().then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return NewStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        /**
         * Before each it block reload the user table (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            //load the users page
            RequestAppsPage.get(e2eBase.getRequestUsersEndpoint(realmName, testApp.id));
            //wait until user table rows are loaded
            ReportContentPO.waitForReportContent();
            //Wait until you see newUser button
            return UsersTablePage.newUserBtn.waitForVisible();
        });

        /**
         * Selects a single user, clicks remove and checks the user count.
         */
        it('Should select remove a single user and check for the success message', function() {

            // Step 1: Select the checkbox and click on delete icon
            ReportTableActionsPO.selectRecordRowCheckbox(1);
            UsersTablePage.userRemoveIcon.click();

            // Step 2: Click on delete button from the dialogue box
            UsersTablePage.clickUserRemoveButton();

            // Step 3: Check for the deleted record
            ReportTableActionsPO.selectAllRecordsCheckbox();
            expect(ReportTableActionsPO.getReportRecordsSelectedCount()).toBe("5");
        });

        /**
         * Selects a single user, clicks remove, cancels, and checks the user count.
         */
        it('Should select remove a single user and cancel ', function() {

            // Step 1: Select the checkbox and click on delete icon
            ReportTableActionsPO.selectRecordRowCheckbox(1);
            UsersTablePage.userRemoveIcon.click();

            // Step 2: Click on cancel button from the dialogue box
            UsersTablePage.clickUserCancelRemoveButton();

            // Step 3: Check for the deleted record
            ReportTableActionsPO.selectAllRecordsCheckbox();
            expect(ReportTableActionsPO.getReportRecordsSelectedCount()).toBe("5");
        });
    });
}());
