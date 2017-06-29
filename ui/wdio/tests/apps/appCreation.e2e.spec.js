/**
 * E2E tests for the newApp
 * cperikal 5/16/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let appsPagePO = requirePO('appsPage');
    let loadingSpinner = requirePO('/common/loadingSpinner');

    describe('New App - App Creation Tests: ', function() {
        let realmName;
        let realmId;
        let testApp;

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

        beforeEach(function() {
            //Navigate to apps page in an realm
            return e2ePageBase.loadAppsInBrowser(realmName);
        });

        it('Create new app and verify it is created', function() {
            appsPagePO.createNewAppAndVerify();
        });

        it('Verify cancel app button', function() {
            appsPagePO.verifyCancelButton();
        });

        it('Verify close app button', function() {
            appsPagePO.verifyCloseButton();
        });

        it('Verify clicking on an app opens its respective tables home page', function() {
            appsPagePO.verifyClickingAppOpensItsTableHomepage();
        });
    });
}());
