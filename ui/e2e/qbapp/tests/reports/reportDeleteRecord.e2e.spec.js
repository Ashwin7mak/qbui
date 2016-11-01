/**
 * E2E tests for Editing Records In-line via the Table Report page
 * Created by klabak on 6/1/15
 */
(function() {
    'use strict';

    //Load the page Objects
    var NewStackAuthPage = requirePO('newStackAuth');
    var ReportServicePage = requirePO('reportService');
    var ReportContentPage = requirePO('reportContent');
    var ReportPagingPage = requirePO('reportPaging');

    var newStackAuthPage = new NewStackAuthPage();
    var reportServicePage = new ReportServicePage();
    var reportContentPage = new ReportContentPage();
    var reportPagingPage = new ReportPagingPage();

    describe('Delete Report SetUp', function() {
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
                    newStackAuthPage.realmLogin(realmName, realmId);
                    e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
                    done();
                }).catch(function(error) {
                    // Global catch that will grab any errors from chain above
                    // Will appropriately fail the beforeAll method so other tests won't run
                    done.fail('Error during test setup beforeAll: ' + error.message);
                });
            });

        });

        describe('Single Record Delete Tests', function() {

            var deletedRecord;
            var rowToBeDeleted = 2;
            var successMessage = "1 Records deleted";
            var reportCount = "26 records";
            /**
             * Before each test starts just make sure the report has loaded with records visible
             */
            beforeAll(function(done) {
                e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
                reportContentPage.waitForReportContent();

                //Getting deleted Record
                reportContentPage.getRecordValues(rowToBeDeleted).then(function(fieldValues) {
                    deletedRecord = fieldValues;
                });

                done();
            });

            beforeEach(function(done) {
                e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
                reportContentPage.waitForReportContent();
                done();
            });

            /**
             * Test Method.
             */
            it('Delete a Record and check for the success message', function(done) {

                // Step 1: Selecting the first record for the deletion and checking for the success messages
                reportContentPage.reportRowSelected(rowToBeDeleted);
                reportContentPage.clickSelectedRecordDeleteIcon();
                reportContentPage.assertSuccessMessage(successMessage);
                reportContentPage.waitForReportContent();

                // Step 2. Checking for the deleted record on the first page
                reportContentPage.checkForTheDeletedRecordOnTheCurrentPage(deletedRecord);

                // Step 3. Checking for the recordCount that it has reduced after deletion
                expect(reportServicePage.reportRecordsCount.getText()).toContain(reportCount);

                // Step 4.  Checking for the deleted record on the 2nd page page
                reportPagingPage.pagingToolbarNextButton.click(); //Click on the next page button
                reportContentPage.waitForReportContent();//Wait for the content to load
                reportContentPage.checkForTheDeletedRecordOnTheCurrentPage(deletedRecord);
                done();
            });


            it('Checking for the deleted functionality on the 2nd page page', function(done) {

                // Step 5. Checking for the delete functionality on the second page
                reportPagingPage.pagingToolbarNextButton.click();
                reportContentPage.waitForReportContent();
                reportContentPage.reportRowSelected(rowToBeDeleted);
                reportContentPage.clickSelectedRecordDeleteIcon();
                reportContentPage.assertSuccessMessage(successMessage);
                reportContentPage.waitForReportContent();
                done();
            });

        });

        //Todo: Add bulk delete test

        /* After all tests are done, run the cleanup function in the base class */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });

}());
