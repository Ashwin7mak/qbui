/**
 * E2E tests for configuration based feature switches
 */

(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');

    describe('Configuration based feature switches tests: ', function() {
        let realmName;
        let realmId;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.recordBase.apiBase.initialize().then(function() {
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
         * Before All it block load the app.
         */
        beforeEach(function() {
            // go to the feature switches page
            return e2ePageBase.loadFSPageInBrowser(realmName);
        });

        //Verify feature switches heading is visible
        it('Verify feature switches heading is visible', function() {

            browser.waitForVisible('.mainContent');
            let element = browser.element('h1');
            //make sure FS heading is visible (Enabled in - '/master.featureSwitches.json')
            expect(element.isVisible()).toBe(true);
            //verify the heading text
            expect(element.getText()).toEqual('Feature Switches');
        });

        //Verify feature switches content is not visible
        it('Verify feature switches content is not visible', function() {

            browser.waitForVisible('.mainContent');
            let element = browser.element('.featureSwitchesLoader .featureSwitches');
            //make sure FS heading that belongs to the actual UI is not visible (Disabled in - '/master.featureSwitches.json')
            expect(element.isVisible()).toBe(false);
        });

    });

}());
