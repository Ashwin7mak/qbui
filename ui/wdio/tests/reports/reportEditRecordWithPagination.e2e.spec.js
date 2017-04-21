/**
 * E2E test for Editing Records In-line with Pagination via the Table Report page
 * Separte spec file to avoid timeout due to the number of records needed to navigate to second page
 * Created by slakhan on 4/20/17.
 */
(function() {
    'use strict';
    //Load the page Objects
    var e2ePageBase = requirePO('./e2ePageBase');
    var NewStackAuthPO = requirePO('./newStackAuth');
    var ReportContentPO = requirePO('./reportContent');
    var ReportInLineEditPO = requirePO('./reportInLineEdit');
    var ReportPagingPO = requirePO('./reportPaging');


    describe('Reports - In-line Edit Record Tests: ', function() {
        var realmName;
        var realmId;
        var testApp;
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // // No need to call done() anymore
            return e2eBase.basicAppSetup(null, e2eConsts.MAX_PAGING_SIZE + 10).then(function(createdApp) {
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
         * Before each test starts just make sure the report has loaded with records visible
         */
        beforeEach(function() {
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            return ReportContentPO.waitForReportContent();
        });

/**
 * Test Method - In-line edit menu should have three actions
 */
        /**
         * Test Method. Tests in-line editing with Pagination.
         */
        it('Should allow you to in-line edit a record on the second page', function() {
            //Variable declarations
            var textToEnter = 'My new text on page 2';
            var successMessage = 'Record saved';

            // Steps 1- Go to the second page of records
            ReportPagingPO.clickPagingNavButton(ReportPagingPO.pagingToolbarNextButton);

            // Step 2 - Open the in-line edit menu for the first record on that page
            ReportInLineEditPO.openRecordEditMenu(0);

            // Step 3 - Edit the Text Field
            ReportInLineEditPO.editTextField(0, textToEnter);

            // Step 4 - Save the edit
            ReportInLineEditPO.clickSaveChangesButton();
            // browser.waitForText(textToEnter);
            expect(browser.isVisible('.qbRow.editing .saveRecord')).toBeFalsy();
            expect(browser.isVisible('.qbRow.editing .cancelSelection')).toBeFalsy();
            expect(browser.isVisible('.qbRow.editing .addRecord')).toBeFalsy();

            // Step 5 - Check for the success message 'Record added'
            //TODO: See if we can handle this a different way so it will work 100%. Would like to have this assertion
            //ReportInLineEditPO.assertSuccessMessage(successMessage);

            // Step 6 - Check that the edit persisted on the report
            var recordValues = ReportContentPO.getRecordValues(0);
            expect(recordValues[1]).toBe(textToEnter);

            // Step 7 - Go back to the first page of records
            ReportPagingPO.clickPagingNavButton(ReportPagingPO.pagingToolbarPrevButton);
        });
    });
}());
