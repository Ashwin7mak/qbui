/**
 * E2E tests for Adding a Record via Inline 'Save and Add New Row' Button on Reports page.
 * Created by aagrawal on 10/29/2016
 */
(function() {
    'use strict';

    //Load the page Objects
    var e2ePageBase = require('../../pages/qbGride2ePageBase.po');
    var NewStackAuthPO = require('../../pages/newStackAuth.po');
    var ReportContentPO = require('../../pages/qbGridReportContent.po');
    var ReportInLineEditPO = require('../../pages/qbGridReportInLineEdit.po');
    var ReportPagingPO = require('../../pages/qbGridReportPaging.po');

    describe('Reports Page - Add Record Tests', function() {
        var realmName;
        var realmId;
        var testApp;
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup().then(function(createdApp) {
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
                Promise.reject(new Error('Error during test setup beforeAll: ' + error.message));
            });
        });

        /**
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            // browser.url('http://02oi0no2rlhrkbkp8qo3z8raygecxih3.localhost:9000/api/api/v1/ticket?uid=10000&realmId=11995685');
            // return browser.url('http://02oi0no2rlhrkbkp8qo3z8raygecxih3.localhost:9000/qbase/app/0mqctfaaaaab/table/0mqctfaaaaac/report/1');
            // Load the List All report on Table 1
            return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

        });

        fit('Click Save and Add a New Record Button, Add a new Record, Assert record is added to the last page', function() {
            browser.logger.info('it spec function - Running the test');
            var textToEnter = 'SaveAndAddANewRow';
            var numToEnter = 20;
            var dateToEnter = '03-11-1985';
            var dateToExpect = '03-12-1985';
            var successMessage = 'Record added';
            // Step 1- Double click on a record to enter inline edit mode and then 'Save and Add a New Row' button
            ReportInLineEditPO.openRecordEditMenu(3);
            ReportInLineEditPO.clickSaveAddNewRowButton();

            // Step 2 - Add new row - Text field, num field, date field
            ReportInLineEditPO.editTextField(0, textToEnter);
            ReportInLineEditPO.editNumericField(0, numToEnter);
            ReportInLineEditPO.editNumericField(1, numToEnter);
            ReportInLineEditPO.editNumericField(2, numToEnter);
            ReportInLineEditPO.editNumericField(3, numToEnter);
            ReportInLineEditPO.editDateField(0, dateToEnter);
            ReportInLineEditPO.editDateField(1, dateToEnter);

            // Step 3 - Open the calendar widget and Advance the date ahead 1 day
            if (browserName !== 'safari') {
                ReportInLineEditPO.openDateFieldCalWidget(0);
                ReportInLineEditPO.advanceCurrentlySelectedDate(0);
            }

            // Step 4 - Save the new added row
            ReportInLineEditPO.clickSaveChangesButton();
            expect(browser.isVisible('.qb.editing .saveRecord')).toBeFalsy();
            expect(browser.isVisible('.qb.editing .cancelSelection')).toBeFalsy();
            expect(browser.isVisible('.qb.editing .addRecord')).toBeFalsy();

            // Step 5 - Check for the success message 'Record added'
            //TODO: See if we can handle this a different way so it will work 100%. Would like to have this assertion
            //ReportInLineEditPO.assertSuccessMessage(successMessage);

            // Step 6 - Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            // Step 7 - Go to the second page to check that the record is added at the last row (due to sorting)
            ReportPagingPO.clickPagingNavButton(ReportPagingPO.pagingToolbarNextButton);

            // Step 8 - Check the record values
            var numOfRows = ReportContentPO.reportDisplayedRecordCount();
            browser.logger.info('This will show up in the log output under an Info tag! ', numOfRows);
            var recordValues = ReportContentPO.getRecordValues(numOfRows - 1);
            expect(recordValues[1]).toBe(textToEnter);

            if (browserName !== 'safari') {
                expect(recordValues[6]).toBe(dateToExpect);
            } else {
                expect(recordValues[6]).toBe(dateToEnter);
            }

        });
    });
}());
