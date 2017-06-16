/**
 * E2E tests for the topNav of the Reports page
 * cperikal 5/11/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let TopNavPO = requirePO('topNav');
    let reportContentPO = requirePO('reportContent');
    let e2ePageBase = requirePO('e2ePageBase');

    describe('Global - TopNav Tests: ', function() {
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

        /**
         * Test methods to verify all elements present / hidden in topNav on small breakpoint
         */

        it('App homepage - Visibility of topNav', function() {

            // Open App homepage
            e2ePageBase.navigateTo(e2eBase.getRequestAppsPageEndpoint(realmName, testApp.id));

            // Verify if the hamburger menu is displayed
            expect(TopNavPO.topNavToggleHamburgerEl.isVisible()).toBe(true);

            // Verify global icons are not displayed as they are displayed in large breakpoint
            expect(TopNavPO.topNavGlobalActDivEl.isVisible()).toBe(false);
            expect(reportContentPO.settingsIcon.isVisible()).toBe(false);
        });

        it('Table homepage - Verify topNav hamburger toggle and search button is displayed', function() {

            // Open table home page
            e2ePageBase.navigateTo(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 0));

            // Verify the title on topNav in tables page
            expect(TopNavPO.topNavTitleEl.getText()).toBe('Table 1');

            // Verify hamburger toggle to be visible in topNav
            expect(TopNavPO.topNavToggleHamburgerEl.isExisting()).toBe(true);

            // Verify no text displayed beside hamburger link in topNav
            expect(TopNavPO.topNavToggleHamburgerEl.getText()).toBe('');

            // Verify search button to be visible in topNav
            expect(TopNavPO.topNavSmallSearchEl.isExisting()).toBe(true);

            // Verify no text displayed beside search button in topNav
            expect(TopNavPO.topNavSmallSearchEl.getText()).toBe('');
        });

        it('Report Page - Verify topNav hamburger toggle and search button is displayed', function() {

            // Open report page
            e2ePageBase.navigateTo(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1));

            // Verify the title on topNav in report page
            expect(TopNavPO.topNavTitleEl.getText()).toBe('List All Report');

            // Verify hamburger toggle to be visible in topNav
            expect(TopNavPO.topNavToggleHamburgerEl.isExisting()).toBe(true);

            // Verify no text displayed beside hamburger link in topNav
            expect(TopNavPO.topNavToggleHamburgerEl.getText()).toBe('');

            // Verify search button to be visible in topNav
            expect(TopNavPO.topNavSmallSearchEl.isExisting()).toBe(true);

            // Verify no text displayed beside search button in topNav
            expect(TopNavPO.topNavSmallSearchEl.getText()).toBe('');
        });

        it('Report Page - Verify the text to enter in search box and clear button', function() {

            // Open report homepage
            e2ePageBase.navigateTo(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1));

            // Verify search button to be visible in topNav
            expect(TopNavPO.topNavSmallSearchEl.isVisible()).toBe(true);

            // Click on the search button
            TopNavPO.topNavSmallSearchEl.click();

            // Verify if the search box is open
            // Did not use page object here as it returns an error saying "Element is not currently visible and may not be manipulated"
            expect(browser.isVisible('.smallHeader.searching.reportHeader')).toBe(true);
            expect(browser.element('.smallHeader .center .searchInput').getAttribute('placeholder')).toBe('Search these records');

            // Enter text in the search box
            TopNavPO.topNavSearchBoxEl.setValue(sampleText);

            // Verify if the clear button is visible
            expect(TopNavPO.topNavClearSearchEl.isVisible()).toBe(true);

            // Click on the mini clear button
            TopNavPO.topNavClearSearchEl.click();

            // Verify the text is cleared
            expect(TopNavPO.topNavSearchBoxEl.getText()).toBe('');

            // Verify cancel button to be visible in topNav
            expect(TopNavPO.topNavCancelEl.isVisible()).toBe(true);

            // Click on the cancel button
            TopNavPO.topNavCancelEl.click();

            // Verify if the search box is closed
            expect(browser.isVisible('.smallHeader.searching.reportHeader')).toBe(false);
        });
    });
}());

