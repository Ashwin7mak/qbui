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
    var newStackAuthPage = new NewStackAuthPage();
    var reportServicePage = new ReportServicePage();
    var reportContentPage = new ReportContentPage();

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
        /**
         * Before each test starts just make sure the report has loaded with records visible
         */
        beforeEach(function(done) {
            e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            reportContentPage.waitForReportContent();
            done();
        });

        /**
         * Test Method.
         */
        it('In-line edit menu should have three actions (save, save and add new, cancel)', function(done) {
            // Open the in-line edit menu for the first record in the report
            reportContentPage.openRecordEditMenu(0).then(function() {
                // Check the edit buttons
                reportContentPage.agGridEditRecordButtons.then(function(buttons) {
                    expect(buttons.length).toBe(3);
                    done();
                });
            });
        });

        /**
         * Test Method.
         */
        it('Should allow you to in-line edit a record in the report', function(done) {
            var textToEnter = 'My new text';
            var dateToEnter = '03-11-1985';
            var dateToExpect = '03-12-1985';
            // Open the in-line edit menu for the first record in the report
            reportContentPage.openRecordEditMenu(0).then(function() {
                //TODO: Figure out the type of field and edit accordingly
                // Edit the Text Field
                reportContentPage.getRecordRowInputCells().then(function(inputCells) {
                    var textFieldInput = inputCells[0];
                    textFieldInput.clear().then(function() {
                        textFieldInput.sendKeys(textToEnter);
                    });
                });
            }).then(function() {
                //Scroll to Date Time Field (so we know Date Field is visible on the page)
                reportContentPage.getDateTimeFieldInputCells().then(function(dateTimeInputCells) {
                    var dateTimeFieldCell = dateTimeInputCells[0];
                    browser.executeScript("arguments[0].scrollIntoView();", dateTimeFieldCell.getWebElement());
                });
            }).then(function() {
                // Edit the Date Field
                reportContentPage.getDateFieldInputCells().then(function(inputCells) {
                    var dateFieldCell = inputCells[0];
                    // Set the value of the input box so the calendar widget will be set
                    reportContentPage.getDateFieldInputBoxEl(dateFieldCell).clear();
                    reportContentPage.getDateFieldInputBoxEl(dateFieldCell).sendKeys(dateToEnter);
                    // Open the calendar widget
                    reportContentPage.getDateFieldCalendarIconEl(dateFieldCell).click();
                    // Advance the date ahead 1 day
                    reportContentPage.advanceCurrentlySelectedDate(dateFieldCell);
                });
            }).then(function() {
                // Save the edit
                reportContentPage.clickSaveButtonForEditMenu();
                // Check that the edit notification is displayed
                reportContentPage.waitForElement(reportContentPage.editSuccessPopup);
                // Check that the edit menu is no longer displayed
                reportContentPage.waitForElementToBeInvisible(reportContentPage.agGridEditRecordMenu);
            }).then(function() {
                // Wait for the report to update
                reportContentPage.waitForReportContent();
                // Check that the edit persisted on the report
                reportContentPage.getRecordValues(0).then(function(fieldValues) {
                    expect(fieldValues[1]).toBe(textToEnter);
                    expect(fieldValues[6]).toBe(dateToExpect);
                    done();
                });
            });
        });

        //TODO: Edit record on second page

        //TODO: Bulk update on multiple records

        //TODO: Cancel button test

        //TODO: Reload report while editing test

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
