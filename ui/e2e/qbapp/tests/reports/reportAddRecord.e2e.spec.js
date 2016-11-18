/**
 * E2E tests for Inline 'Save and Add new Row' Button Test on Reports page.
 * Created by aagrawal on 10/29/2016
 */
(function() {
    'use strict';
    //Load the page Objects
    var NewStackAuthPO = requirePO('newStackAuth');
    var ReportContentPO = requirePO('reportContent');
    var ReportPagingPO = requirePO('reportPaging');
    var newStackAuthPO = new NewStackAuthPO();
    var reportContentPO = new ReportContentPO();
    var reportPagingPO = new ReportPagingPO();

    describe('Report Page Inline Save and Add new Row Button Test --', function() {
        var realmName;
        var realmId;
        var testApp;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function(done) {
            e2eRetry.run(function() {
                e2eBase.defaultAppSetup().then(function(createdApp) {
                    // Set your global objects to use in the test functions
                    testApp = createdApp;
                    realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                    realmId = e2eBase.recordBase.apiBase.realm.id;
                    // Auth into the new stack
                    newStackAuthPO.realmLogin(realmName, realmId);
                    e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1).then(function() {
                        done();
                    });
                }).catch(function(error) {
                    // Global catch that will grab any errors from chain above
                    // Will appropriately fail the beforeAll method so other tests won't run
                    done.fail('Error during test setup beforeAll: ' + error.message);
                });
            });

        });

        /**
         * Before each test starts just make sure the report has loaded with records visible
         */
        beforeEach(function(done) {
            e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            reportContentPO.waitForReportContent();
            done();
        });

        /**
         * Test Method.
         */
        it('Click Save and Add a New Row Button, Add a new Row, \n  See that the new row is added at the last page)', function(done) {

            var textToEnter = 'SaveAndAddANewRow';
            var dateToEnter = '03-11-1985';
            var dateToExpect = '03-12-1985';
            var successMessage = 'Record added';

            // Step 1- Click on any row to get inline edit Menu and then 'Save and Add a New Row' button
            reportContentPO.openRecordEditMenu(3);
            reportContentPO.clickInlineMenuSaveAddNewRowBtn();

            // Step 2 - Add new row - Text field, date field
            reportContentPO.editTextField(0, textToEnter);
            reportContentPO.editDateField(0, dateToEnter);

            // Step 3 - Open the calendar widget and Advance the date ahead 1 day
            reportContentPO.openDateFieldCalWidget(0).then(function(dateFieldCell) {
                reportContentPO.advanceCurrentlySelectedDate(dateFieldCell);
            });

            // Step 4 - Save the new added row
            reportContentPO.clickInlineMenuSaveAddNewRowBtn();

            //Step 5 - Check for the success message
            reportContentPO.assertSuccessMessage(successMessage);

            // Step 5 - Reload the report after saving row as the row is added at the last page
            e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            reportContentPO.waitForReportContent();

            //Step 6 - Goto the second page to check that the record is added at the last row
            reportPagingPO.clickPagingNavButton(reportPagingPO.pagingToolbarNextButton);
            reportContentPO.reportRowCount().then(function(countRows) {
                reportContentPO.getRecordValues(countRows - 1).then(function(fieldValues) {
                    expect(fieldValues[1]).toBe(textToEnter);
                    expect(fieldValues[6]).toBe(dateToExpect);
                });
            });
            done();
        });
    });
}());
