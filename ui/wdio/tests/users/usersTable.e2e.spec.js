/**
 * E2E tests for the App User Management table
 */
(function() {
    'use strict';

    //Load the page Objects
    let NewStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let UsersTablePage = requirePO('usersTable');
    let ReportTableActionsPO = requirePO('reportTableActions');

    describe('Users - Application user management table tests: ', function() {
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
            return e2ePageBase.loadUsersInAnAppInBrowser(realmName, testApp.id);
        });

        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then displays the Users table in the browser
         */
        it('Should load the user table and verify the field names', function() {
            expect(UsersTablePage.getUserColumnHeaders()).toEqual(e2eConsts.userTableFieldNames);
        });

        /**
         * Test method. Test that the user Stage expands/collapses.
         */
        it('Should expand and collapse the user page stage', function() {
            // Click on user Stage button to expand the stage
            UsersTablePage.userStageBtn.click();
            // Wait for the Stage area content to display
            UsersTablePage.userStageContent.waitForVisible();
            browser.pause(e2eConsts.shortWaitTimeMs);
            // Verify the app owner name is linked
            expect(browser.isEnabled('.appOwnerName')).toBe(true);
            // Click on the user Stage button to collapse the stage
            UsersTablePage.userStageBtn.click();
            browser.pause(e2eConsts.shortWaitTimeMs);
            expect(UsersTablePage.userStageArea.getAttribute('clientHeight')).toMatch('0');
            expect(UsersTablePage.userStageArea.getAttribute('clientWidth')).toMatch('0');
        });

        /**
         * Test method. Checks to make sure the first user row is selected, user count is correct
         */
        it('Should select first row of users and display total with action icons', function() {
            // Select first row of records checkbox
            ReportTableActionsPO.selectRecordRowCheckbox(1);
            // Assert user selected count
            expect(ReportTableActionsPO.getReportRecordsSelectedCount()).toBe("1");
            // Verify the number of user action icons
            expect(UsersTablePage.userActionsListEl.value.length).toBe(4);
        });

        /**
         * Test method. Checks to make sure the check all users is selected and unselected
         */
        it('Should select all users, unselect one user, verify unchecked', function() {
            // Select all records checkbox
            ReportTableActionsPO.selectAllRecordsCheckbox();
            expect(ReportTableActionsPO.reportSelectAllCheckbox.isSelected()).toBe(true);
            // Assert user selected count
            expect(ReportTableActionsPO.getReportRecordsSelectedCount()).toBe("6");
            // Select first user row
            ReportTableActionsPO.selectRecordRowCheckbox(1);
            // Assert select all users is unchecked
            expect(ReportTableActionsPO.reportSelectAllCheckbox.isSelected()).toBe(false);
            // Assert user selected count
            expect(ReportTableActionsPO.getReportRecordsSelectedCount()).toBe("5");
        });

        /**
         * Test method. Checks to make sure user emails are linked
         */
        it('Should verify all the users emails are linked', function() {
            // Verify the user emails are linked
            expect(UsersTablePage.userEmailUlEl.isExisting()).toBe(true);
        });
    });
}());
