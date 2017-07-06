/**
 * E2E tests of governance user
 */

(function() {
    'use strict';

    describe('Governance - user tests', () => {
        let legacyLoginPO = requirePO('legacyLogin');
        let legacyQuickbasePO = requirePO('legacyQuickbase');
        let qbGridPO = requirePO('qbGrid');
        let topNavPO = requirePO('topNav');
        let searchUser = "weiliqb@gmail.com";
        let elem = "";

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(()=> {
            browser.logger.info('beforeAll spec function - setup base test state for the test suite');
            // return e2eBase.basicAppSetup(null, RECORD_COUNT).then(function(createdApp) {
            //     // Set your global objects to use in the test functions
            //     testApp = createdApp;
            //     realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            //     realmId = e2eBase.recordBase.apiBase.realm.id;
            // }).then(function() {
            //     // Auth into the new stack
            //     return NewStackAuthPO.realmLogin(realmName, realmId);
            // }).catch(function(error) {
            //     // Global catch that will grab any errors from chain above
            //     // Will appropriately fail the beforeAll method so other tests won't run
            //     browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
            //     return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            // });
            /**
             * This will be moved to a another file after we finalize how to do legacyBaseState
             * and pass arguments
             */
            //* Load login page
            // browser.url('https://weirealm.currentstack-int.quickbaserocks.com/db/main?a=signin');
            legacyLoginPO.invoke('https://brian.quickbase.com/db/main?a=signin');

            //* Login user
            legacyLoginPO.signInUser("weiliqb@gmail.com", "Test123!");

            //* Wait for current stack page to fully load
            legacyQuickbasePO.waitForPageToFullyLoad();

            //* Dismiss Quick Base University
            legacyQuickbasePO.dismissQBUniversityPopup();
            //* Click the Manage all users link in Account Admin frame
            browser.element('.SideBarLink[id="manageUsersSidebar"] a[id="manageUsers"]').click();
            //* Switch to governance tab
            browser.switchTab(tabIds[1]);
        });

        /**
         * Before each it block reload governance page
         */
        beforeEach(()=> {
            // //* Click the Manage all users link in Account Admin frame
            // browser.element('.SideBarLink[id="manageUsersSidebar"] a[id="manageUsers"]').click();
            // //* Switch to governance tab
            // browser.switchTab(tabIds[1]);
        });


        it('Validate governance page name', ()=> {

            console.log("==> Governance page title is: " + browser.getTitle());
            console.log("==> Governance page tabId is: " + browser.getCurrentTabId());
            browser.pause(2000);

            //* Get column header counts and first column name
            console.log ("==> in qbGrid: column counts are: " + qbGridPO.getColumnCount());
            elem = browser.element('.qbHeader .qbHeaderCell:nth-child(1)');
            console.log ("==> Column header getText is: " + elem.getText());

            //* Enter searching string
            qbGridPO.setSearchString(searchUser);
            browser.pause(2000);

            //* Get grid cell text
            console.log ("==> in qbGrid: row count is: " + qbGridPO.getRowCount());
            elem = browser.element('.qbTbody .qbRow:nth-child(2) .qbCell:nth-child(3)');
            console.log ("==> cell getText is: " + elem.getText());

            // Logout from governance page
            topNavPO.usersButton.waitForVisible();
            topNavPO.usersButton.click();
            browser.pause(2000);

            topNavPO.signOutButton.waitForVisible();
            topNavPO.signOutButton.click();

            browser.pause(2000);

        });
    });

})();