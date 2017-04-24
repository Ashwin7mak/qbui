/**
 * E2E tests for the App User Management table
 *
 */
(function() {
    'use strict';

    //Load the page Objects
    var NewStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var RequestAppsPage = requirePO('requestApps');
    var UsersTablePage = requirePO('usersTable');

    describe('Users - Application User Management Table Tests', function() {
        var realmName;
        var realmId;
        var testApp;
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
            return UsersTablePage.newUserBtn.waitForVisible();
        });

        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then displays the Users table in the browser
         */
        it('Should load the user table and verify the field names', function() {
            expect(UsersTablePage.getUserColumnHeaders()).toEqual(e2eConsts.userTableFieldNames);
        });

        /**
         * Test methods. Test that the user Stage expands/collapses.
         */
        it('Should expand the reports stage', function() {
            // Click on user Stage button to expand the stage
            UsersTablePage.userStageBtn.click();
            // Wait for the Stage area content to display
            UsersTablePage.userStageContent.waitForVisible();
            browser.pause(e2eConsts.shortWaitTimeMs);
            // Click on the user Stage button to collapse the stage
            UsersTablePage.userStageBtn.click();
            browser.pause(e2eConsts.shortWaitTimeMs);
            expect(UsersTablePage.userStageArea.getAttribute('clientHeight')).toMatch('0');
            expect(UsersTablePage.userStageArea.getAttribute('clientWidth')).toMatch('0');
        });
    });
}());
