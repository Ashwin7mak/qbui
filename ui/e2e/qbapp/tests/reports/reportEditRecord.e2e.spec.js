/**
 * E2E tests for Editing Records In-line via the Table Report page
 * Created by klabak on 6/1/15
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

    describe('Report Page Edit Record Tests', function() {
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
            done();
        });

        /**
         * Test Method.
         */
        it('In-line edit menu should have three actions (save, save and add new, cancel)', function(done) {
            // Open the in-line edit menu for the first record in the report
            reportContentPO.openRecordEditMenu(0).then(function() {
                // Check the edit buttons
                reportContentPO.agGridEditRecordButtons.then(function(buttons) {
                    expect(buttons.length).toBe(3);
                });
            });
            // Close the edit menu
            reportContentPO.clickEditMenuCancelButton().then(function() {
                done();
            });
        });

        /**
         * Test Method. Record in-line editing test on a report.
         */
        it('Should allow you to in-line edit multiple fields in a report record', function(done) {
            var textToEnter = 'My new text';
            var dateToEnter = '03-11-1985';
            var dateToExpect = '03-12-1985';

            // Open the in-line edit menu for the first record in the report
            reportContentPO.openRecordEditMenu(0);

            // Edit the Text Field
            reportContentPO.editTextField(0, textToEnter);

            // Edit the Date Field
            // Set the value of the input box so the calendar widget will be set
            reportContentPO.editDateField(0, dateToEnter);
            // Open the calendar widget
            reportContentPO.openDateFieldCalWidget(0).then(function(dateFieldCell) {
                // Advance the date ahead 1 day
                reportContentPO.advanceCurrentlySelectedDate(dateFieldCell);
            });

            // Save the edit
            reportContentPO.clickEditMenuSaveButton();

            // Reload the report after saving
            e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            // Check that the edit persisted on the report
            reportContentPO.getRecordValues(0).then(function(fieldValues) {
                expect(fieldValues[1]).toBe(textToEnter);
                expect(fieldValues[6]).toBe(dateToExpect);
                done();
            });
        });

        /**
         * Test Method. Tests in-line editing with Pagination.
         */
        it('Should allow you to in-line edit a record on the second page', function(done) {
            var textToEnter = 'My new text on page 2';
            // Go to the second page of records
            reportPagingPO.clickPagingNavButton(reportPagingPO.pagingToolbarNextButton);

            // Open the in-line edit menu for the first record on that page
            reportContentPO.openRecordEditMenu(0);

            // Edit the Text Field
            reportContentPO.editTextField(0, textToEnter);

            // Save the edit
            reportContentPO.clickEditMenuSaveButton();

            // Check that the edit persisted on the report
            reportContentPO.getRecordValues(0).then(function(fieldValues) {
                expect(fieldValues[1]).toBe(textToEnter);
            });

            // Go back to the first page of records
            reportPagingPO.clickPagingNavButton(reportPagingPO.pagingToolbarPrevButton).then(function() {
                done();
            });
        });

        /**
         * Test Method. Cancel button test for in-line editing.
         */
        it('Cancel button should not save edit updates to a record', function(done) {
            var originalText;
            var textToEnter = 'My new text 2';

            // Get the original value of the text field on the second record
            reportContentPO.getRecordValues(1).then(function(fieldValues) {
                originalText = fieldValues[1];
            });

            // Open the in-line edit menu for the second record
            reportContentPO.openRecordEditMenu(1);

            // Edit the Text Field
            reportContentPO.editTextField(0, textToEnter);

            // Click the cancel button
            reportContentPO.clickEditMenuCancelButton();

            // Check that the edit was not persisted on report
            reportContentPO.getRecordValues(1).then(function(fieldValues) {
                expect(fieldValues[1]).toBe(originalText);
                done();
            });
        });

        /**
         * Negative Test Method. Reload page test for in-line editing.
         */
        it('Reloading the page while editing should not save updates to a record', function(done) {
            var originalText;
            var textToEnter = 'My new text 3';

            // Get the original value of the text field on the second record
            reportContentPO.getRecordValues(2).then(function(fieldValues) {
                originalText = fieldValues[1];
            });

            // Open the in-line edit menu for the third record on that page
            reportContentPO.openRecordEditMenu(2);

            // Edit the Text Field
            reportContentPO.editTextField(0, textToEnter);

            // Reload the report before saving
            e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            // Check that the edit was not persisted on report
            reportContentPO.getRecordValues(2).then(function(fieldValues) {
                expect(fieldValues[1]).toBe(originalText);
                done();
            });
        });

        //TODO: Required field test, Need to extend setup data for this

        //TODO: Invalid input value tests (text in a date field)

        //TODO: Check that record ID isn't editable

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
