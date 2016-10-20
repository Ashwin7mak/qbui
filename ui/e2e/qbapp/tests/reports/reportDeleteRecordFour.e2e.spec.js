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
        beforeAll(function (done) {
            e2eRetry.run(function () {
                e2eBase.defaultAppSetup().then(function (createdApp) {
                    // Set your global objects to use in the test functions
                    testApp = createdApp;
                    realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                    realmId = e2eBase.recordBase.apiBase.realm.id;
                    // Auth into the new stack
                    newStackAuthPage.realmLogin(realmName, realmId);
                    e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
                    done();
                }).catch(function (error) {
                    // Global catch that will grab any errors from chain above
                    // Will appropriately fail the beforeAll method so other tests won't run
                    done.fail('Error during test setup beforeAll: ' + error.message);
                });
            });

        });

        describe('Single Record Delete Tests', function () {

            var deletedRecord;
            /**
             * Before each test starts just make sure the report has loaded with records visible
             */
            beforeAll(function (done) {
                e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
                reportContentPage.waitForReportContent();

                //Getting deleted Record
                reportContentPage.getRecordValues(0).then(function (fieldValues) {
                    deletedRecord = fieldValues;
                });

                done();
            });


            /**
             * Test Method.
             */
            it('Delete a Record and check for the success message', function (done) {

                var recordCountBefore;
                var deletedRecord;
                var recordCountAfter;

                //Getting record count before Delete
                //  recordCountBefore = reportContentPage.getRecordCountFromPaginationNumber();
                //
                // recordCountBefore = reportServicePage.reportRecordsCount.getText();


                // reportServicePage.reportRecordsCount.getText().then(function (text) {
                //     recordCountBefore = text;
                //     console.log("the records count is: " + recordCountBefore);
                // });


                // //Getting account to be deleted
                // reportContentPage.getRecordValues(0).then(function (fieldValues) {
                //     deletedRecord = fieldValues;
                // });

                // Step 1: Selecting the first record for the deletion and checking for the success messages
                reportContentPage.recordCheckBoxes.first().click();
                reportContentPage.clickOnDeleteIconAndCheckForSuccessMessageWindow("1 Records deleted");
                done();
            });

            // Step 2. Checking for the deleted record on the first page
            it('Checking for the deleted record on the first page', function (done) {

                reportContentPage.checkForTheDeletedRecordOnTheCurrentPage(deletedRecord);
                done();
            });


            // Step 3. Checking for the recordCount that it has reduced after deletion
            it('Checking for the recordCount that it has reduced after deletion', function (done) {
                expect(reportServicePage.reportRecordsCount.getText()).toContain("26 records");
                //reportContentPage.checkForRecordCountReducedAfterDeletion(recordCountBefore);
                done();
            });


            // Step 4. Checking for the deleted record on the 2nd page page
            it('Checking for the deleted record on the 2nd page page', function (done) {
                reportPagingPage.pagingToolbarNextButton.click(); //Click on the next page button
                reportContentPage.waitForReportContent();//Wait for the content to load
                reportContentPage.checkForTheDeletedRecordOnTheCurrentPage(deletedRecord);
                done();
            });
            // Step 5. Checking for the delete functionality on the second page
            it('Checking for the delete functionality on the second page', function (done) {
                reportContentPage.recordCheckBoxes.first().click();
                reportContentPage.clickOnDeleteIconAndCheckForSuccessMessageWindow("1 Records deleted");
                done();
            });

        });

        /**
             * After all tests are done, run the cleanup function in the base class
             */
            afterAll(function (done) {
                e2eBase.cleanup(done);
            });
        });

}());
