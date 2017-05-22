/**
 * E2E tests for the topNav of the Reports page
 * cperikal 5/22/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let topNavPO = requirePO('topNav');
    let RequestAppsPage = requirePO('requestApps');
    let leftNavPO = requirePO('leftNav');

    describe('Global - LeftNav Tests: ', function() {
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

        it('Verify search box, buttons, brand logo and leftNav collapse on Apps Page', function() {

            // Step 1 - Open apps home page
            browser.call(function() {
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            });

            // Step 2 - Verify if the leftNav is closed
            expect(browser.isVisible('.closed.expanded')).toBeTruthy();

            // Step 3 - Verify if the topNav hamburger menu is visible
            topNavPO.topNavToggleHamburgerEl.waitForVisible();

            // Step 4 - Verify if the hamburger menu is clickable
            topNavPO.topNavToggleHamburgerEl.click();

            // Step 5 - Verify if the leftNav is collapsed
            expect(browser.isVisible('.open.expanded')).toBeTruthy();

            // Step 6 - Verify if apps list is open
            expect((browser.element('.leftNav .appsList .leftNavLabel').getAttribute('textContent').length) > 0).toBeTruthy();

            // Step 7 - Verify if the left nav search element is visible and clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            // Step 8 - Verify if the search box is open
            expect(browser.isVisible('.open')).toBeTruthy();

            // Step 9 - Verify if the search box is user editable
            leftNavPO.leftNavSearchInputBox.setValue(sampleText1);

            // Step 10 - Verify text got entered
            expect(leftNavPO.leftNavSearchInputBox.getAttribute('value')).toBe(sampleText);

            // Step 11 - Verify if the clear search button is clickable
            leftNavPO.leftNavClearSearchEl.click();

            // Step 12 - Verify if the search box is empty after clearing
            expect(leftNavPO.leftNavSearchInputBox.getText()).toBe('');

            // Step 13 - Verify if the left nav search element is clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            // Step 14 - Verify if the search input box is closed
            expect(browser.isVisible('.appsList .search.open')).toBeFalsy();

            // Step 15 - Verify the names of global actions links
            let innerHTML = browser.getHTML('.globalActionsList .navLabel span', false);
            expect(innerHTML[0]).toEqual('Feedback');
            expect(innerHTML[1]).toEqual('User');
            expect(innerHTML[2]).toEqual('Help');

            // Step 16 - Verify if the Brand Logo is visible at the bottom of leftNav
            leftNavPO.leftNavBrandLogo.waitForVisible();
        });

        it('Verify the topLink element names, search box and leftNav collapse on tables page', function() {

            // Step 1 - Open tables home page
            browser.call(function() {
                return RequestAppsPage.get(e2eBase.getRequestTableEndpoint(realmName, testApp.id, testApp.tables[0].id));
            });

            // Step 2 - Verify if the leftNav is closed
            expect(browser.isVisible('.closed.expanded')).toBeTruthy();

            // Step 2 - Verify if the topNav hamburger menu is clickable
            browser.click('.smallHeader .left .iconUISturdy-hamburger');

            // Step 3 - Verify if the leftNav is opened
            expect(browser.isVisible('.open.expanded')).toBeTruthy();

            // Step 4 - Verify if the tables list is open
            expect((browser.element('.leftNav .tablesList .leftNavLabel').getAttribute('textContent').length) > 0).toBeTruthy();

            // Step 5 - Verify the names of topLink elements
            let innerHTML = browser.getHTML('.topLinks .leftNavLabel span', false);
            expect(innerHTML[0]).toEqual('Home');
            expect(innerHTML[1]).toEqual('Users');

            // Step 6 - Verify if the left nav search element is visible and clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            // Step 7 - Verify if the search box is open
            expect(browser.isVisible('.open')).toBeTruthy();

            // Step 8 - Verify if the left nav search element is clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            // Step 9 - Verify if the search input box is closed
            expect(browser.isVisible('.appsList .search.open')).toBeFalsy();

        });

        it('Verify if leftNav collapses and caret up element on reports page', function() {

            // Step 1 - Open reports page
            browser.call(function() {
                return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, testApp.tables[0].id, 1));
            });

            // Step 2 - Verify if the leftNav is closed
            expect(browser.isVisible('.closed.expanded')).toBeTruthy();

            // Step 3 - Verify if the topNav hamburger menu is clickable
            browser.click('.smallHeader .left .iconUISturdy-hamburger');

            // Step 3 - Verify if the leftNav is opened
            expect(browser.isVisible('.open.expanded')).toBeTruthy();

            // Step 4 - Verify if the left nav caret up element is visible
            leftNavPO.leftNavCaretUpEl.waitForVisible();

            // Step 5 - Verify if the left nav caret up element is clickable
            leftNavPO.leftNavCaretUpEl.click();

            // Step 6 - Verify if apps list is open
            expect((browser.element('.leftNav .appsList .leftNavLabel').getAttribute('textContent').length) > 0).toBeTruthy();

            // Step 7 - Verify if the left nav caret up element is visible
            leftNavPO.leftNavCaretUpEl.waitForVisible();

            // Step 8 - Verify if the left nav caret up element is clickable
            leftNavPO.leftNavCaretUpEl.click();

            // Step 9 - Verify if the tables list is open
            expect((browser.element('.leftNav .tablesList .leftNavLabel').getAttribute('textContent').length) > 0).toBeTruthy();

        });
    });
}());
