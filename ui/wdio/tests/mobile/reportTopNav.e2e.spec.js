/**
 * E2E tests for the topNav of the Reports page
 * cperikal 5/11/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let TopNavPO = requirePO('topNav');
    let RequestAppsPage = requirePO('requestApps');
    let reportContentPO = requirePO('reportContent');

    describe('Reports Page - TopNav Tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let sampleText = 'reportA';
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            return e2eBase.basicAppSetup(null, 5).then(function(createdApp) {
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

        beforeAll(function() {
            reportContentPO.loadReportByIdInBrowserSB(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        /**
         * Test methods to verify all elements present / hidden in topNav depending on breakpoint
         */

        it('Report Page - Verify topNav hamburger toggle and search button is displayed', function() {

            // Step 1: Verify hamburger toggle to exist in topNav
            TopNavPO.topNavToggleHamburgerEl.waitForExist();

            // Step 2: Verify no text displayed beside hamburger link in topNav
            expect(TopNavPO.topNavToggleHamburgerEl.getText()).toBeFalsy();

            // Step 3: Verify search button to exist in topNav
            TopNavPO.topNavSmallSearchEl.waitForExist();

            // Step 4: Verify no text displayed beside search button in topNav
            expect(TopNavPO.topNavSmallSearchEl.getText()).toBeFalsy();

            // Step 5: Verify the title on topNav in report page
            expect(TopNavPO.topNavTitleEl.getText()).toBe('List All Report');
        });

        it('Report Page - Verify the text to enter in search box and clear button', function() {

            // Step 1: Verify search button to exist in topNav
            TopNavPO.topNavSmallSearchEl.waitForExist();

            // TopNavPO.topNavSmallSearchEl.touch(); //An unknown server-side error occurred while processing the command. Original error: Error converting element ID for using in WD atoms: 5277
            // Step 2: Click on the search button
            TopNavPO.topNavSmallSearchEl.click();

            // Step 3: Enter text in the search box
            TopNavPO.topNavSearchBoxEl.setValue(sampleText);

            // Step 4: Click on the mini clear button
            TopNavPO.topNavClearSearchEl.click();

            // Step 5: Verify cancel button to exist in topNav
            TopNavPO.topNavCancelEl.waitForExist();

            // Step 6: Click on the cancel button
            TopNavPO.topNavCancelEl.click();
        });

        it('Home Page - Verify topNav harmony icons are not displayed', function() {

            //Step 1: Open apps home page
            browser.call(function() {
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            });

            // Step 2: Verify hamburger toggle to exist in topNav
            TopNavPO.topNavToggleHamburgerEl.waitForExist();

            // Step 3: Verify no text displayed beside hamburger link in topNav
            expect(TopNavPO.topNavToggleHamburgerEl.getText()).toBeFalsy();

            // Step 4: Verify the no.of harmony buttons to be 0 in mobile as there are 2 in web app
            expect(TopNavPO.topNavHarButtonsListEl.value.length).toEqual(0);
        });
    });
}());

