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
        let sampleText1 = 'reportA';
        let sampleText2 = 'New Table';

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
            return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        /**
         * Test methods to verify all elements present / hidden in leftNav
         */
        it('Verify if leftNav collapses of clicking hamburger menu on tables page', function() {

            //Go to app page
            RequestAppsPage.get(e2eBase.getRequestAppPageEndpoint(realmName, testApp.id));

            //select table
            tableCreatePO.selectTable(testApp.tables[e2eConsts.TABLE1].name);
            reportContentPO.waitForLeftNavLoaded();

            //Verify if the leftNav is expanded
            expect(browser.isVisible('.expanded')).toBe(true);

            //Verify if the hamburger menu is clickable
            topNavPO.topNavToggleHamburgerEl.waitForVisible();
            topNavPO.topNavToggleHamburgerEl.click();

            //Verify if the leftNav is collapsed
            expect(browser.isVisible('.collapsed')).toBe(true);

        });

        it('Verify if leftNav caretUp element opens appsList and searches on reports page', function() {

            //Verify if the left nav caret up element is visible
            leftNavPO.leftNavCaretUpEl.waitForVisible();

            //Verify if the left nav caret up element is clickable
            leftNavPO.leftNavCaretUpEl.click();

            //Verify if apps list is open
            expect((browser.element('.leftNav .appsList .leftNavLabel').getAttribute('textContent').length) > 0).toBe(true);

            //Verify if the left nav search element is visible and clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            //Verify if the search box is open
            expect(browser.isVisible('.open')).toBe(true);

            //Verify if the search box is user editable
            leftNavPO.leftNavSearchInputBox.setValue(sampleText1);

            //Verify text got entered
            expect(leftNavPO.leftNavSearchInputBox.getAttribute('value')).toBe(sampleText1);

            //Verify if the clear search button is clickable
            leftNavPO.leftNavClearSearchEl.click();

            //Verify if the search box is empty after clearing
            expect(leftNavPO.leftNavSearchInputBox.getText()).toBe('');

            //Verify if the left nav search element is clickable
            leftNavPO.leftNavSearchEl.waitForVisible();
            leftNavPO.leftNavSearchEl.click();

            //Verify if the search input box is closed
            expect(browser.isVisible('.appsList .search.open')).toBe(false);

            //Verify if the left nav caret up element is clickable
            leftNavPO.leftNavCaretUpEl.click();

            //Verify if the tables list is open
            expect((browser.element('.leftNav .tablesList .leftNavLabel').getAttribute('textContent').length) > 0).toBe(true);

        });

        it('Verify the topLinks, Brand logo and mouse hover function on collapsed leftNav on reports page', function() {

            //Verify if the no.of topLinks are equal to 2 (Home, Users)
            expect(leftNavPO.leftNavTopLinks.value.length).toEqual(2);

            //Verify the text of top links to be 'Home' and 'Users' - Used HTML to get text as getText() returns empty string for <span> elements
            let innerHTML = browser.getHTML('.topLinks .leftNavLabel span', false);
            expect(innerHTML[0]).toEqual('Home');
            expect(innerHTML[1]).toEqual('Users');

            //Verify if the Brand Logo is visible at the bottom of leftNav
            leftNavPO.leftNavBrandLogo.waitForVisible();

            //Verify if the hamburger menu is clickable and collapses leftNav
            topNavPO.topNavToggleHamburgerEl.click();

            //Verify if the tables in the collapsed leftNav are mouse-hovered
            // browser.moveToObject('.transitionGroup .tablesList .link');
        });

        it('Verify if leftNav table search box opens and closes in tableLists', function() {

            //Verify if the left nav table search is visible
            leftNavPO.leftNavSearchEl.waitForVisible();

            //Verify if the search element is clickable and opens search box
            leftNavPO.leftNavSearchEl.click();

            //Verify if the search box is open
            expect(browser.isVisible('.open')).toBe(true);

            //Verify if the search box is user editable
            leftNavPO.leftNavSearchInputBox.setValue(sampleText2);

            //Verify if the clear button is clickable
            leftNavPO.leftNavClearSearchEl.click();

            //Verify if the search box is empty after clearing
            expect(leftNavPO.leftNavSearchInputBox.getText()).toBe('');

            //Verify if the search element is clickable and closes the search box
            leftNavPO.leftNavSearchEl.click();

            //Verify if the search input box is closed
            expect(browser.isVisible('.tablesHeading .search.open ')).toBe(false);
        });

        it('Verify if the reports icon is displayed and verify the name of the report loaded', function() {

            //Go to app page
            RequestAppsPage.get(e2eBase.getRequestAppPageEndpoint(realmName, testApp.id));

            //select table
            tableCreatePO.selectTable(testApp.tables[e2eConsts.TABLE1].name);
            reportContentPO.waitForLeftNavLoaded();
            
            //Verify the name of the first table in the leftNav
            let tableName = leftNavPO.leftNavTableName.getText();

            //Verify if the leftNav mini report icon is visible
            leftNavPO.leftNavMiniReportIcon.waitForVisible();

            //Verify if the leftNav mini report icon is clickable and opens new page
            leftNavPO.leftNavMiniReportIcon.click();

            // Used HTML to get text as getText() returns empty string for <span> elements
            let innerHTML = browser.getHTML('.trowserHeader .breadcrumbsContent span', false);

            //Verify if the table name is correctly displayed
            expect(innerHTML[1]).toEqual(tableName);
            expect(innerHTML[5]).toEqual('Reports');
        });

        //TODO: MC - 2799 need to be fixed for the below test to pass, Mouse hover on app icon in apps page is not displaying the app name when we have collapsed leftNav

        xit('Verify the mouse hover function on apps page collapsed leftNav', function() {

            //Open apps home page
            RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));

            //Verify if the topNav hamburger menu is visible
            topNavPO.topNavToggleHamburgerEl.waitForVisible();

            //Verify if the hamburger menu is clickable and collapses leftNav
            topNavPO.topNavToggleHamburgerEl.click();

            //Verify if the tables in the collapsed leftNav are mouse-hovered
            browser.moveToObject('.transitionGroup .appsList .link');
        });

    });
}());
