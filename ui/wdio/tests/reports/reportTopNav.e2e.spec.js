/**
 * E2E tests for the topNav of the Reports page
 * cperikal 4/18/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let TopNavPO = requirePO('topNav');

    describe('Reports - TopNav tests: ', function() {
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

        beforeEach(function() {
            return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        /**
         * Test methods to verify all elements present / hidden in topNav depending on breakpoint
         */
        it('Verify topNav hamburger toggle displayed', function() {
            // Step1: Verify hamburger toggle is displayed in topNav
            TopNavPO.topNavToggleHamburgerEl.waitForVisible();
            // Step2: Verify no text displayed beside hamburger link in topNav
            expect(TopNavPO.topNavToggleHamburgerEl.getText()).toBeFalsy();
        });

        it('Verify topNav harmony icons displayed', function() {
            //Step1: Verify the no.of harmony buttons
            expect(TopNavPO.topNavHarButtonsListEl.value.length).toEqual(2);
            //Step2: Verify if the harmony icons to be visible
            TopNavPO.topNavCenterDivEl.waitForVisible();
            // Step3: Verify the text for harmony buttons
            expect(TopNavPO.topNavCenterDivEl.getText()).toBeFalsy();
        });

        it('Verify topNav global icons displayed/not displayed', function() {
            //Step1: Verify if the global icons are displayed
            TopNavPO.topNavGlobalActDivEl.waitForVisible();
            //Step2: Verify the no.of global action icons
            expect(TopNavPO.topNavGlobalActionsListEl.value.length).toBe(3);
        });
    });
}());

