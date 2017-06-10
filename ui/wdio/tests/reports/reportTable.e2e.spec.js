/**
 * E2E tests for the components on the Table Reports page
 *
 */
(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let NewStackAuthPO = requirePO('newStackAuth');
    let ReportContentPO = requirePO('reportContent');
    let FormsPO = requirePO('formsPage');
    let ReportTableActionsPO = requirePO('reportTableActions');

    describe('Reports - Table report tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let RECORD_COUNT = 5;
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
                return NewStackAuthPO.realmLogin(realmName, realmId);
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
            return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then displays the report page in the browser
         */
        it('Should load the reports page with the appropriate table report and verify the field names and records', function() {

            // Assert the record count
            var recordCount = FormsPO.getRecordsCountInATable();
            expect(recordCount).toBe(RECORD_COUNT);

            // Assert column headers from the UI report table with expected headers. Remove the record ID first element in an array since its not showing up in UI.
            expect(ReportContentPO.getReportColumnHeaders().slice(1)).toEqual(e2eConsts.reportFieldNames.slice(1));
        });

        /**
         * Test method. Checks to make sure the Table Actions (Search, Sort By, Records Count) are visible.
         *
         */
        it('Should load all the table report actions', function() {
            // Assert search box is visible
            expect(ReportTableActionsPO.reportSearchBox.isVisible()).toBe(true);

            // Assert sort by / group by button is visible
            expect(ReportTableActionsPO.reportSortAndGroupButton.isVisible()).toBe(true);

            // Assert records count total
            expect(ReportTableActionsPO.getReportRecordsCount()).toBe("5 records");
        });

        /**
         * Test method. Checks to make sure the total count of all records selected and the search, sort by, and records count
         * search, sort by, and records count are hidden.
         */
        it('Should select all records and display total', function() {
            // Select all records checkbox
            ReportTableActionsPO.selectAllRecordsCheckbox();

            // Assert Search Box is invisible
            expect(ReportTableActionsPO.reportSearchBox.isVisible()).toBe(false);

            // Assert records selected count
            expect(ReportTableActionsPO.getReportRecordsSelectedCount()).toBe("5");
        });

        /**
         * Test method. Checks to make sure the first record row is selected and the search, sort by, and records count
         * search, sort by, and records count are hidden.
         */
        it('Should select first row of records and display total', function() {
            // Select first row of records checkbox
            ReportTableActionsPO.selectRecordRowCheckbox(1);

            // Assert Search Box is invisible
            expect(ReportTableActionsPO.reportSearchBox.isVisible()).toBe(false);

            // Assert records selected count
            expect(ReportTableActionsPO.getReportRecordsSelectedCount()).toBe("1");
        });

        /**
         * Test method. Loads the first table containing 10 fields (10 columns). The table report (griddle) width should expand past the browser size
         * to give all columns enough space to show their data.
         */
        it('Table report should expand width past the browser size to show all available data (large num columns)', function() {
                // Check there is a scrollbar in the griddle table
            var fetchRecordPromises = [];
            fetchRecordPromises.push(ReportContentPO.qbGridBodyViewportEl.getAttribute('scrollWidth'));
            fetchRecordPromises.push(ReportContentPO.qbGridBodyViewportEl.getAttribute('clientWidth'));
                //When all the dimensions have been fetched, assert the values match expectations
            Promise.all(fetchRecordPromises); {
                expect(Number(fetchRecordPromises[0])).toBe(Number(fetchRecordPromises[1]));
            }
        });
    });
}());
