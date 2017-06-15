/**
 * E2E tests for the global LeftNav
 * cperikal 5/16/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let leftNavPO = requirePO('leftNav');
    let topNavPO = requirePO('topNav');
    let RequestAppsPage = requirePO('requestApps');
    var tableCreatePO = requirePO('tableCreate');
    let reportContentPO = requirePO('reportContent');
    var e2ePageBase = requirePO('e2ePageBase');

    describe('Global - LeftNav Tests: ', function() {
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

        it('Verify leftNav in apps page', function() {

            //Verify topLinks (Home, user) dosen't show up
            expect(browser.element('.topLinks .iconUISturdy-home').isExisting()).toBe(false);
            expect(browser.element('.topLinks .iconUISturdy-users').isExisting()).toBe(false);

            //verify apps heading
            expect(browser.element('.appsList .heading').getAttribute('textContent')).toBe('Apps');

            //Verify if the left nav search element is visible and clickable
            leftNavPO.clickLeftNavSearch();

            //Verify if the search box is open
            expect(browser.element('.search.open .searchInput').getAttribute('placeholder')).toBe('Search apps...');

        });

        /**
         * Test methods to verify all elements present / hidden in leftNav
         */
        it('Verify if leftNav collapses by clicking on hamburger menu', function() {

            //select App
            RequestAppsPage.selectApp(testApp.name);

            //Verify if the leftNav is expanded
            expect(browser.isVisible('.leftNav.expanded')).toBe(true);

            //Verify if the hamburger menu is clickable
            topNavPO.topNavToggleHamburgerEl.waitForVisible();
            topNavPO.topNavToggleHamburgerEl.click();

            //Verify if the leftNav is collapsed
            expect(browser.isVisible('.leftNav.collapsed')).toBe(true);

        });

        it('Verify if leftNav appsToggleIcon caretUp element opens appsList and clicking again caretDown opens up tables list', function() {

            //select App
            RequestAppsPage.selectApp(testApp.name);

            //Click on appLists carat
            leftNavPO.clickLeftNavAppListCarat();

            //Verify if apps list is open
            expect((browser.element('.leftNav .appsList .leftNavLabel').getAttribute('textContent').length) > 0).toBe(true);

            //Click on appLists carat
            leftNavPO.clickLeftNavAppListCarat();

            //Verify if the tables list is open
            expect((browser.element('.leftNav .tablesList .leftNavLabel').getAttribute('textContent').length) > 0).toBe(true);

        });

        it('Verify search functionality in leftNav', function() {

            //select App
            RequestAppsPage.selectApp(testApp.name);

            //Verify if the left nav search element is visible and clickable
            leftNavPO.clickLeftNavSearch();

            //Verify if the search box is open
            expect(browser.element('.search.open .searchInput').getAttribute('placeholder')).toBe('Search tables...');

            //Verify if the search box is user editable
            leftNavPO.leftNavSearchInputBox.setValue('Table 1');

            //Verify text got entered
            expect(leftNavPO.leftNavSearchInputBox.getAttribute('value')).toBe('Table 1');

            //Verify it returned just 1 result
            expect(browser.element('.leftNav .tablesList .leftNavLabel').getAttribute('textContent')).toBe('Table 1');

            //Verify if the clear search button is clickable
            leftNavPO.leftNavClearSearchEl.click();

            //Verify if the search box is empty after clearing
            expect(leftNavPO.leftNavSearchInputBox.getText()).toBe('');

            //Verify it returned all tables after clearing search
            expect(browser.elements('.leftNav .tablesList .leftNavLabel').value.length).toBe(5);

            //Verify if the left nav search element is clickable
            leftNavPO.clickLeftNavSearch();

            //Verify if the search input box is closed
            expect(browser.isVisible('.search.open .searchInputBox')).toBe(false);

        });

        it('Verify the topLinks, Brand logo and mouse hover function on collapsed leftNav', function() {

            //select App
            RequestAppsPage.selectApp(testApp.name);

            //Verify if the no.of topLinks are equal to 2 (Home, Users)
            expect(leftNavPO.leftNavTopLinks.value.length).toEqual(2);

            //Verify the text of top links to be 'Home' and 'Users' - Used HTML to get text as getText() returns empty string for <span> elements
            leftNavPO.verifyTopLinksInLeftNav();

            //Verify if the Brand Logo is visible at the bottom of leftNav
            leftNavPO.leftNavBrandLogo.waitForVisible();

            //Verify if the hamburger menu is clickable and collapses leftNav
            topNavPO.topNavToggleHamburgerEl.click();

            //Verify if the tables in the collapsed leftNav are mouse-hovered
            // browser.moveToObject('.transitionGroup .tablesList .link');
        });

        it('Verify leftNav in tables page', function() {
            //select App
            RequestAppsPage.selectApp(testApp.name);

            //select table
            tableCreatePO.selectTable('Table 1');

            //Verify the text of top links to be 'Home' and 'Users' - Used HTML to get text as getText() returns empty string for <span> elements
            leftNavPO.verifyTopLinksInLeftNav();

            //verify tables heading
            expect(browser.element('.tablesHeading .heading').getAttribute('textContent')).toBe('Tables');

            //Verify tables search is enabled
            expect(browser.element('.tablesHeading .iconUISturdy-search').isEnabled()).toBe(true);

            //Verify new Table button displays in leftNav
            expect(browser.element('.newItemButton .newItem').isEnabled()).toBe(true);
        });

        it('Verify going to reports via left nav and verify left Nav in reports page', function() {
            //select App
            RequestAppsPage.selectApp(testApp.name);

            //select 1st report
            reportContentPO.selectReport('Table 1', 0);

            //Verify the text of top links to be 'Home' and 'Users' - Used HTML to get text as getText() returns empty string for <span> elements
            leftNavPO.verifyTopLinksInLeftNav();

            //verify tables heading
            expect(browser.element('.tablesHeading .heading').getAttribute('textContent')).toBe('Tables');

            //Verify tables search is enabled
            expect(browser.element('.tablesHeading .iconUISturdy-search').isEnabled()).toBe(true);

            //Verify new Table button displays in leftNav
            expect(browser.element('.newItemButton .newItem').isEnabled()).toBe(true);

        });

        //TODO: MC - 2799 need to be fixed for the below test to pass, Mouse hover on app icon in apps page is not displaying the app name when we have collapsed leftNav

        xit('Verify the mouse hover function on apps page collapsed leftNav', function() {

            //Open apps home page
            e2ePageBase.navigateTo(e2eBase.getRequestAppsPageEndpoint(realmName));

            //Verify if the topNav hamburger menu is visible
            topNavPO.topNavToggleHamburgerEl.waitForVisible();

            //Verify if the hamburger menu is clickable and collapses leftNav
            topNavPO.topNavToggleHamburgerEl.click();

            //Verify if the tables in the collapsed leftNav are mouse-hovered
            browser.moveToObject('.transitionGroup .appsList .link');
        });

    });
}());
