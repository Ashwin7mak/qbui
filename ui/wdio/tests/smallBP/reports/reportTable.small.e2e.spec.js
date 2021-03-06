/**
 * E2E small breakpoint tests for the components on the Table Reports page
 *
 * Created by agade on 5/11/17.
 */
(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let newStackAuthPO = requirePO('newStackAuth');
    let reportContentPO = requirePO('reportContent');
    let formsPO = requirePO('formsPage');
    let reportTableActionsPO = requirePO('reportTableActions');

    describe('Reports - Table report tests for small breakpoint: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let RECORD_COUNT = 20;
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            return e2eBase.basicAppSetup(null, RECORD_COUNT).then(function(createdApp) {
                // Set your global objects to use in the test functions
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
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            // Load the List All report on Table 1
            reportContentPO.loadReportByIdInBrowserSB(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        /**
         * Test method. Checks to make sure the Table Actions ( Sort By, Records Count and dropdownToggle button) are visible/enabled/clickable.
         */
        it('Should load the table report actions', function() {

            // Wait for the report content to be visible
            reportContentPO.waitForReportContentSB();

            // Assert sort by / group by button is visible and enabled
            expect(reportContentPO.reportSortGrpBtnSB.isVisible()).toBe(true);
            expect(reportContentPO.reportSortGrpBtnSB.isEnabled()).toBe(true);

            // Assert records count total
            expect(reportTableActionsPO.getReportRecordsCount()).toBe(RECORD_COUNT + " records");

            // Assert dropdownToggle actionButton is visible and clickable
            expect(reportContentPO.dropdownToggleActionButtonSB.isVisible()).toBe(true);
            // click on dropdownToggle actionButton
            reportContentPO.clickDropdownToggleActionButtonSB();
            //verify add record button is visible
            browser.element('.dropdown-menu-right .menuActionButton').waitForVisible();
            expect(browser.element('.dropdown-menu-right .menuActionButton').isVisible()).toBe(true);
        });

        /**
         * verify record count and card expander button is visible/clickable
         */
        it('Should load the reports page with the appropriate table report and verify  card expander button is clickable', function() {
            // wait for the report content to be visible
            reportContentPO.waitForReportContentSB();

            // Assert records count
            let recordCount = formsPO.getRecordsCountInATable();
            expect(recordCount).toBe(RECORD_COUNT);
            //verify row card is collapsed
            expect(browser.element('.custom-row-card .expanded').isVisible()).toBe(false);

            //click row card expander button
            reportContentPO.clickCardExpanderButtonSB();

            //verify row card is exapnded
            expect(browser.element('.custom-row-card .expanded').isVisible()).toBe(true);
        });

        /**
         * Verifies add new record button is visible, enabled and clickable
         */
        it('verify add record button is visible, enabled and clickable', function() {
            // wait for the report content to be visible
            reportContentPO.waitForReportContentSB();

            //click 'add record' button
            reportContentPO.clickAddRecordBtnSB();
        });

        /**
         * swipe left on a record and verify actionIcons are visible
         */
        it('swipe left on a record', function() {
            // wait for the report content to be visible
            reportContentPO.waitForReportContentSB();

            // swipe left
            browser.swipeLeft('.flexRow .card', 100);
            //verify edit button is visible
            browser.element('.actionIcons .icon-edit').waitForVisible();
            expect(browser.element('.actionIcons .icon-edit').isVisible()).toBe(true);

        });

        /**
         * swipe right on a record and verify actionIcons are visible
         */
        it('swipe right on a record', function() {
            // wait for the report content to be visible
            reportContentPO.waitForReportContentSB();

            // swipe right
            browser.swipeRight('.flexRow .card', 100);
            //verify edit button is visible
            browser.element('.actionIcons .icon-edit').waitForVisible();
            expect(browser.element('.actionIcons .icon-edit').isVisible()).toBe(true);

        });

    });
}());

