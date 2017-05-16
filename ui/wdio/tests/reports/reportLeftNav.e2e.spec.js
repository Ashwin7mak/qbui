/**
 * E2E tests for the topNav of the Reports page
 * cperikal 4/18/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let leftNavPO = requirePO('leftNav');
    let topNavPO = requirePO('topNav');
    let RequestAppsPage = requirePO('requestApps');

    describe('Reports Page - LeftNav Tests: ', function() {
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
        it('Verify if leftNav apps toggle is displayed and functionality', function() {

            // Step 1 - Verify if the left nav caret up element is visible
            leftNavPO.leftNavCaretUpEl.waitForVisible();

            // Step 2 - Verify if the left nav caret up element is clickable and opens apps list
            leftNavPO.leftNavCaretUpEl.click();

            // Step 3 - Verify if the left nav search element is clickable and opens search box
            leftNavPO.leftNavSearchEl.click();

            // Step 4 - Verify if the search box is user editable
            leftNavPO.leftNavSearchInputBox.setValue(sampleText1);

            // Step 5 - Verify if the clear search button is clickable
            leftNavPO.leftNavClearSearchEl.click();

            // Step 6 - Verify if the left nav search element is clickable and closes search box
            leftNavPO.leftNavSearchEl.click();

            // Step 7 - Verify if the left nav caret up element is clickable and closes apps list
            leftNavPO.leftNavCaretUpEl.click();
        });

        it('Verify the topLinks, Brand logo and mouse hover function on collapsed leftNav', function() {

            // Step 1 - Verify if the no.of topLinks are equal to 2 (Home, Users)
            expect(leftNavPO.leftNavTopLinks.value.length).toEqual(2);

            // Step 2 - Verify if the Brand Logo is visible at the bottom of leftNav
            leftNavPO.leftNavBrandLogo.waitForVisible();

            // Step 3 - Verify if the hamburger menu is clickable and collapses leftNav
            topNavPO.topNavToggleHamburgerEl.click();

            // Step 4 - Verify if the tables in the collapsed leftNav are mouse-hovered
            browser.moveToObject('.transitionGroup .tablesList .link');
        });

        it('Verify if leftNav table search is displayed and functionality', function() {

            // Step 1 - Verify if the left nav table search is visible
            leftNavPO.leftNavSearchEl.waitForVisible();

            // Step 2 - Verify if the search element is clickable and opens seach box
            leftNavPO.leftNavSearchEl.click();

            // Step 3 - Verify if the search box is user editable
            leftNavPO.leftNavSearchInputBox.setValue(sampleText2);

            // Step 4 - Verify if the clear button is clickable
            leftNavPO.leftNavClearSearchEl.click();

            // Step 5 - Verify if the search element is clickable and closes the seach box
            leftNavPO.leftNavSearchEl.click();
        });

        it('Verify if the reports icon is displayed and verify the name of the report loaded', function() {

            // Step 1 - Verify the name of the first table in the leftNav
            let tableName = leftNavPO.leftNavTableName.getText();

            // Step 2 - Verify if the leftNav mini report icon is visible
            leftNavPO.leftNavMiniReportIcon.waitForVisible();

            // Step 3 - Verify if the leftNav mini report icon is clickable and opens new page
            leftNavPO.leftNavMiniReportIcon.click();

            // Used HTML to get text as getText() returns empty string for <span> elements
            let innerHTML = browser.getHTML('.trowserHeader .breadcrumbsContent span', false);

            // Step 4 - Verify if the table name is correctly displayed
            expect(innerHTML[5]).toEqual(tableName);
            expect(innerHTML[7]).toEqual('Reports');
        });

        it('Verify leftNav New Table element and its functionality ', function() {

            // Step 1 - Verify if the new table element is visible
            leftNavPO.leftNavNewTableEl.waitForVisible();

            // Step 2 - Verify if the new table element is clickable and open new modal page
            leftNavPO.leftNavNewTableEl.click();

            // Step 3 - Verify if the new table fields are visible and equal to 3
            leftNavPO.leftNavNewTableField.waitForVisible();

            // Step 4 - Verify if the new table fields are equal to 3
            expect(leftNavPO.leftNavNewTableField.value.length).toEqual(3);

            // Step 5  - Verify if the icon chooser is visible
            leftNavPO.leftNavNewTableIconSelect.waitForVisible();

            // Step 6 - Verify if the cancel button is clickable and closes the modal page
            leftNavPO.leftNavNewTableCancelBu.click();
        });

        it('Verify the no.of tables before and after collapse are same ', function() {

            // Step 1 - Verify the no.of tables before leftNav collapse
            let noOfTablesBeforeCollapse = leftNavPO.leftNavTablesList.value.length;

            // Step 2 - Verify if the hamburger menu is clickable and collapses leftNav
            topNavPO.topNavToggleHamburgerEl.click();

            // Step 3 - Verify the no.of tables after leftNav collapse
            let noOfTablesAfterCollapse = leftNavPO.leftNavTablesList.value.length;

            // Step 4 - Verify if the no.of tables before and after leftNav collapse are equal
            expect(noOfTablesBeforeCollapse).toEqual(noOfTablesAfterCollapse);

        });

        //TODO: MC - 2799 need to be fixed for the below test to pass, Mouse hover on app icon in apps page is not displaying the app name when we have collapsed leftNav

        xit('Verify the mouse hover function on apps page collapsed leftNav', function() {

            // Step 1 - Open apps home page
            browser.call(function() {
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            });

            // Step 2 - Verify if the topNav hamburger menu is visible
            topNavPO.topNavToggleHamburgerEl.waitForVisible();

            // Step 3 - Verify if the hamburger menu is clickable and collapses leftNav
            topNavPO.topNavToggleHamburgerEl.click();

            // Step 4 - Verify if the tables in the collapsed leftNav are mouse-hovered
            browser.moveToObject('.transitionGroup .appsList .link');
        });

    });
}());
