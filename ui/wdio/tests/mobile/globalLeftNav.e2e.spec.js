/**
 * E2E tests for the topNav of the Reports page
 * cperikal 5/22/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let topNavPO = requirePO('topNav');
    let e2ePageBase = requirePO('e2ePageBase');
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

        it('Apps Page - Verify search box, buttons, brand logo and leftNav collapse', function() {

            // Open App homepage
            e2ePageBase.navigateTo(e2eBase.getRequestAppsPageEndpoint(realmName, testApp.id));

            // Verify if the leftNav is closed
            expect(browser.isVisible('.leftNav.closed.expanded')).toBe(true);

            // Verify if the topNav hamburger menu is visible and clickable
            topNavPO.topNavToggleHamburgerEl.waitForVisible();
            topNavPO.topNavToggleHamburgerEl.click();

            // Verify if the leftNav is opened
            expect(browser.isVisible('.leftNav.open.expanded')).toBe(true);

            // Verify if apps list is open
            expect((leftNavPO.leftNavAppsList.getAttribute('textContent').length) > 0).toBe(true);

            // Verify if the left nav search element is visible and clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            // Verify if the search box is open
            // Did not use page object here as it returns an error saying "Element is not currently visible and may not be manipulated"
            expect(browser.isVisible('.transitionGroup .search .searchInput ')).toBe(true);

            // Verify if the search box is user editable
            leftNavPO.leftNavSearchInputBox.setValue(sampleText);

            // Verify text got entered
            expect(leftNavPO.leftNavSearchInputBox.getAttribute('value')).toBe(sampleText);

            // Verify if the clear search button is clickable
            leftNavPO.leftNavClearSearchEl.click();

            // Verify if the search box is empty after clearing
            expect(leftNavPO.leftNavSearchInputBox.getText()).toBe('');

            // Verify if the left nav search element is clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            // Verify if the search input box is closed
            expect(browser.isVisible('.transitionGroup .search .searchInput ')).toBe(false);

            // Verify the names of global actions links
            // Used HTML to get text as getText() returns empty string for <span> elements
            let innerHTML = browser.getHTML('.globalActionsList .navLabel span', false);
            expect(innerHTML[0]).toEqual('Feedback');
            expect(innerHTML[1]).toEqual('User');
            expect(innerHTML[2]).toEqual('Help');

            // Verify if the Brand Logo is visible at the bottom of leftNav
            expect(leftNavPO.leftNavBrandLogo.isVisible()).toBe(true);
        });

        it('Tables Page - Verify the topLink element names, search box and leftNav collapse', function() {

            // Open table home page
            e2ePageBase.navigateTo(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 0));

            // Verify if the leftNav is closed
            expect(browser.isVisible('.leftNav.closed.expanded')).toBe(true);

            // Verify if the topNav hamburger menu is clickable
            // Did not use page object here as it returns an error saying "Element is not currently visible and may not be manipulated"
            browser.click('.smallHeader .left .iconUISturdy-hamburger');

            // Verify if the leftNav is opened
            expect(browser.isVisible('.leftNav.open.expanded')).toBe(true);

            // Verify if the tables list is open
            expect((leftNavPO.leftNavTableName.getAttribute('textContent').length) > 0).toBe(true);

            // Verify the names of topLink elements
            // Used HTML to get text as getText() returns empty string for <span> elements
            let innerHTML = browser.getHTML('.topLinks .leftNavLabel span', false);
            expect(innerHTML[0]).toEqual('Home');
            expect(innerHTML[1]).toEqual('Users');

            // Verify if the left nav search element is visible and clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            // Verify if the search box is open
            expect(browser.isVisible('.transitionGroup .search .searchInput ')).toBe(true);

            // Verify if the left nav search element is clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            // Verify if the search input box is closed
            expect(browser.isVisible('.transitionGroup .search .searchInput ')).toBe(false);

        });

        it('Reports Page - Verify if leftNav collapses and caret up element', function() {

            // Open report page
            e2ePageBase.navigateTo(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1));

            // Verify if the leftNav is closed
            expect(browser.isVisible('.leftNav.closed.expanded')).toBe(true);

            // Verify if the topNav hamburger menu is clickable
            // Did not use page object here as it returns an error saying "Element is not currently visible and may not be manipulated"
            browser.click('.smallHeader .left .iconUISturdy-hamburger');

            // Verify if the leftNav is opened
            expect(browser.isVisible('.leftNav.open.expanded')).toBe(true);

            // Verify if the left nav caret up element is visible
            leftNavPO.leftNavCaretUpEl.waitForVisible();

            // Verify if the left nav caret up element is clickable
            leftNavPO.leftNavCaretUpEl.click();

            // Verify if apps list is open
            expect((leftNavPO.leftNavAppsList.getAttribute('textContent').length) > 0).toBe(true);

            // Verify if the left nav caret up element is visible
            leftNavPO.leftNavCaretUpEl.waitForVisible();

            // Verify if the left nav caret up element is clickable
            leftNavPO.leftNavCaretUpEl.click();

            // Verify if the tables list is open
            expect((leftNavPO.leftNavTableName.getAttribute('textContent').length) > 0).toBe(true);

        });
    });
}());
