(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let newStackAuthPO = requirePO('newStackAuth');
    let reportContentPO = requirePO('reportContent');
    let modalDialog = requirePO('/common/modalDialog');
    let reportNavPO = requirePO('reportNavigation');
    let tableCreatePO = requirePO('tableCreate');

    describe('Reports - Delete record tests: ', function() {
        var realmName;
        var realmId;
        var testApp;
        let numRows = 5;
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup(null, numRows).then(function(createdApp) {
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        describe('Single Record Delete Tests', function() {

            var deletedRecord;
            var rowToBeDeleted = 2;
            var successMessage = "1 Records deleted";
            var reportCount = numRows;

            /**
             * Before each it block reload the list all report (can be used as a way to reset state between tests)
             */
            beforeEach(function() {
                // Load the List All report on Table 1
                return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            });



            /**
             * Test Method- By clicking on the checkbox
             */
            it('Delete a Record and check for the success message', function() {

                //Step 0: Get the row data for the delete verification
                deletedRecord = reportContentPO.getRecordValues(rowToBeDeleted);
                expect(reportNavPO.recordsCount.getText()).toEqual(reportCount + " records");

                //Select the checkbox and click on delete icon
                reportContentPO.selectRowAndClickDeleteIcon(rowToBeDeleted);

                //Click on Delete. Need to use JS click because sometimes this button is not getting clicked intermittently
                browser.execute(function() {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 2
                    });
                    document.getElementsByClassName('modal-content')[0].getElementsByClassName('modal-footer')[0].querySelector('.primaryButton').dispatchEvent(event);
                });

                // Step 3: Check for the deleted record on the first page
                reportContentPO.checkForTheAbsenceDeletedRecordOnTheCurrentPage(deletedRecord);

                // Step 4: Check if the record count is reduced or not after the deletion
                expect(reportNavPO.recordsCount.getText()).toEqual(reportCount - 1 + " records") ;

            });

            /**
             * Test Method- By clicking on the DropDown Menu
             */
            it('Not to delete a Record and check for the record ', function() {

                //Step 0: Get the row data for the delete verification
                deletedRecord = reportContentPO.getRecordValues(rowToBeDeleted);
                expect(reportNavPO.recordsCount.getText()).toEqual(reportCount - 1 + " records");

                // Step 1: Select the DropDown menu and clicking on delete icon
                reportContentPO.dropDownIcon.waitForVisible();
                reportContentPO.dropDownIcon.click();
                reportContentPO.dropDownDeleteIcon.waitForVisible();
                reportContentPO.dropDownDeleteIcon.click();

                // Step 2: Click on delete button from the dialogue box
                modalDialog.clickOnModalDialogBtn(modalDialog.DONT_DELETE_BTN);
                modalDialog.waitUntilModalDialogSlideAway();

                // Step 3: Check for the deleted record on the first page
                reportContentPO.checkForThePresenceDeletedRecordOnTheCurrentPage(deletedRecord);
            });
        });
    });
}());

