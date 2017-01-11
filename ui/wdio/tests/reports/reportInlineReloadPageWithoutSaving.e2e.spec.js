/**
 * E2E tests for Editing Records In-line via the Table Report page
 * Created by klabak on 6/1/15
 */
(function() {
    'use strict';
    //Load the page Objects
    var e2ePageBase = require('../../pages/e2ePageBase.po');
    var NewStackAuthPO = require('../../pages/newStackAuth.po');
    var ReportContentPO = require('../../pages/reportContent.po');
    var ReportInLineEditPO = require('../../pages/reportInLineEdit.po');
    var ReportPagingPO = require('../../pages/reportPaging.po');

    describe('Report Page Inline Edit Without Saving Record Tests', function() {
        var realmName;
        var realmId;
        var testApp;
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
         * Before each test starts just make sure the report has loaded with records visible
         */
        beforeEach(function() {
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            return ReportContentPO.waitForReportContent();

        });


        /**
         * Negative Test Method. Reload page test for in-line editing.
         */
        it('Reloading the page while editing should not save updates to a record', function(done) {
            if (browserName === 'chrome' || browserName === 'firefox') {
                var textToEnter = 'My new text 3';

                // Get the original value of the text field on the second record
                var fieldValues = ReportContentPO.getRecordValues(2);
                var originalText = fieldValues[1];

                // Step 1 - Open the in-line edit menu for the third record on that page
                ReportInLineEditPO.openRecordEditMenu(2);

                // Step 2 - Edit the Text Field
                ReportInLineEditPO.editTextField(0, textToEnter);

                //Todo - For Safari alert tried these
                //browser.execute("window.onbeforeunload = function(){ return null;}");
                // browser.execute("window.onbeforeunload = function(e){};");

                //Step 3 - Refresh the browser
                browser.refresh();

                //Step 4 - handle Alert chrome
                if (browser.alertText()) {
                    browser.alertAccept();

                }

                //Step 5 - Check that the edit was not persisted on report
                var expectedValues = ReportContentPO.getRecordValues(2);
                expect(expectedValues[1]).toBe(originalText);
            }
        });


        //TODO: Required field test, Need to extend setup data for this

        //TODO: Invalid input value tests (text in a date field)

        //TODO: Check that record ID isn't editable
    });
}());
