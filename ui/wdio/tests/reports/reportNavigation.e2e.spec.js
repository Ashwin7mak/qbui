(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBasePO = requirePO('e2ePageBase');
    let reportContentPO = requirePO('reportContent');
    let reportNavPO = requirePO('reportNavigation');
    let reportSortPO = requirePO('reportSortingGrouping');
    var tableCreatePO = requirePO('tableCreate');

    describe('Reports - Navigation tests: ', function() {
        let testApp;
        let realmName;
        let realmId;
        let recOffset = 5; // create this many more or less records than MAX_PAGING_SIZE

        beforeAll(function() {
            /**
             * Setup method. Generates JSON for an app, a table, a set of records and a report.
             * Then creates them via the REST API.
             */
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            return e2eBase.basicAppSetup(null, e2eConsts.MAX_PAGING_SIZE - recOffset).then(function(createdApp) {
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                // create a report with fewer than the minimum number of records required for navigation
                let table2NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(testApp.tables[e2eConsts.TABLE2]);
                let generatedRecords = e2eBase.recordService.generateRecords(table2NonBuiltInFields, recOffset * 2);
                return e2eBase.recordService.addBulkRecords(testApp, testApp.tables[e2eConsts.TABLE2], generatedRecords);
            }).then(function() {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                throw new Error('Error during test setup beforeAll: ' + error.message);
            });
        });

        /**
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            // Load the requestAppPage (shows a list of all the tables associated with an app in a realm)
            return e2ePageBase.loadAppByIdInBrowser(realmName, testApp.id);
        });

        it('Verify navigation in multi-page report', function() {

            //Select table 2
            tableCreatePO.selectTable('Table 2');
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            // verify nav details on FIRST page
            reportSortPO.sortByRecordID();
            let rows = reportContentPO.getAllRows.value;

            // verify max # records are displayed
            expect(rows.length).toBe(e2eConsts.MAX_PAGING_SIZE);

            // verify ID of first record
            let expectedID = 1;
            expect(parseInt(rows[0].getAttribute('id'))).toBe(expectedID);

            // verify ID of all records on first page
            for (let i = 0; i < e2eConsts.MAX_PAGING_SIZE; i++) {
                expect(parseInt(rows[i].getAttribute('id'))).toBe(i + 1);
            }

            // verify navigation components
            let expectedRowRange = '1 - ' + e2eConsts.MAX_PAGING_SIZE.toString();
            expect(reportNavPO.rowNumbers.getText()).toBe('1 - ' + e2eConsts.MAX_PAGING_SIZE.toString());
            expect(e2ePageBasePO.isDisabled(reportNavPO.nextPageButton)).toBe(false);
            expect(e2ePageBasePO.isDisabled(reportNavPO.prevPageButton)).toBe(true);

            // Verify nav details on NEXT page
            reportContentPO.clickAndWaitForGrid(reportNavPO.nextPageButton);
            rows = reportContentPO.getAllRows.value;
            // verify expected # of records is displayed
            expect(rows.length).toBe(recOffset - 1); // not sure why there's 1 less record than expected

            // verify ID of first record
            expectedID = e2eConsts.MAX_PAGING_SIZE;
            expect(parseInt(rows[0].getAttribute('id'))).toBe(expectedID + 1);

            // verify ID of last record
            expectedID += recOffset;
            expect(parseInt(rows[rows.length - 1].getAttribute('id'))).toBe(expectedID - 1);

            // verify navigation components
            expectedRowRange =
                (e2eConsts.MAX_PAGING_SIZE + 1).toString() + ' - ' +
                (e2eConsts.MAX_PAGING_SIZE + recOffset - 1).toString();
            expect(reportNavPO.rowNumbers.getText()).toBe(expectedRowRange);
            expect(e2ePageBasePO.isDisabled(reportNavPO.nextPageButton)).toBe(true);
            expect(e2ePageBasePO.isDisabled(reportNavPO.prevPageButton)).toBe(false);

            // Verify nav details on PREVIOUS (original) page
            reportContentPO.clickAndWaitForGrid(reportNavPO.prevPageButton);
            rows = reportContentPO.getAllRows.value;

            // verify expected # of records is displayed
            expect(rows.length).toBe(e2eConsts.MAX_PAGING_SIZE);

            // verify ID of first record
            expectedID = 1;
            expect(parseInt(rows[0].getAttribute('id'))).toBe(expectedID);

            // verify ID of last record
            expectedID = e2eConsts.MAX_PAGING_SIZE;
            expect(parseInt(rows[rows.length - 1].getAttribute('id'))).toBe(expectedID);

            // verify navigation components
            expectedRowRange = '1 - ' + e2eConsts.MAX_PAGING_SIZE.toString();
            expect(reportNavPO.rowNumbers.getText()).toBe(expectedRowRange);
            expect(e2ePageBasePO.isDisabled(reportNavPO.nextPageButton)).toBe(false);
            expect(e2ePageBasePO.isDisabled(reportNavPO.prevPageButton)).toBe(true);
        });

        it('Verify lack of navigation in single-page report', function() {
            tableCreatePO.selectTable('Table 1');
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            // verify navigation components
            let expectedRecordCount = (e2eConsts.MAX_PAGING_SIZE - recOffset).toString() + ' records';
            expect(reportNavPO.recordsCount.getText()).toBe(expectedRecordCount);
            expect(reportNavPO.reportNavigation.isExisting()).toBe(false);
        });

// TODO: create (replace) a test to verify pagination for report with facets defined - once new faceting is (re)implemented?

        // TODO: Disabled Due to timeout on SauceLab, left in here in case records reqiured to trigger pagination is reduced (MC-2327)
        xit('Verify change of navigability after search', function() {
            // open a multi-page report
            e2ePageBasePO.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE2].id, 1);
            // get the value from the first cell in the first row
            let row = reportContentPO.getRecordRowElement(0);
            let cell = reportContentPO.getRecordRowCells(row).value[1]; // 0 is the 'More...' menu
            let value = reportContentPO.getRecordCellValue(cell);
            // search for that value, should return 2-3 matches w/default data
            reportContentPO.reportFilterSearchBox.setValue(value);
            reportContentPO.waitForReportContent();
            // verify expected results
            expect(browser.waitForExist('.reportNavigation')).toBe(true);
            expect(browser.isEnabled('.reportNavigation')).toBe(true);
        });
    });
}());
