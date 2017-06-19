(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let reportContentPO = requirePO('reportContent');
    let formBuilderPO = requirePO('formBuilder');
    let formsPO = requirePO('formsPage');

    let realmName;
    let realmId;
    let testApp;

    describe('Form Builder Tests: keyboard tests, pos/neg pairs', function() {
        if (browserName === 'chrome' || browserName === 'MicrosoftEdge') {
            beforeAll(function() {
                /**
                 * Setup method. Creates test app then authenticates into the new stack
                 */
                browser.logger.info('beforeAll spec function - Generating test data and logging in');
                return e2eBase.basicAppSetup().then(function(createdApp) {
                    // Set your global objects to use in the test functions
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

            beforeEach(function() {
                // clean up any 'mess' (e.g. resized window, buttonDown) which might have been left by a previously failed test
                try {
                    browser.windowHandleMaximize();
                    browser.buttonUp();
                } catch (err) {
                    browser.logger.info(err.toString());
                }
                // view first record of first report
                reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1, 1);
                //wait until view form is visible
                return formsPO.viewFormContainerEl.waitForVisible();
            });

            beforeEach(function() {
                // invoke form builder
                formBuilderPO.open();
            });

            afterEach(function() {
                formBuilderPO.cancel();
            });

            // pos/neg pairs

            xit('remove the selected field with BACKSPACE & verify presence after CANCEL', function() {
                // MC-3053: regression: keyboard shortcut for delete field (shift-backspace) has no effect
                let removedField = formBuilderPO.KB_removeFieldViaBackspace(1);
                // cancel & reopen
                let newFields = formBuilderPO.cancel().open().getFieldLabels();
                expect(newFields).toContain(removedField);
            });
            xit('remove the selected field with BACKSPACE & verify absence after SAVE', function() {
                // MC-3053: regression: keyboard shortcut for delete field (shift-backspace) has no effect
                let removedField = formBuilderPO.KB_removeFieldViaBackspace(1);
                // save & reopen
                let newFields = formBuilderPO.save().open().getFieldLabels();
                expect(newFields).not.toContain(removedField);
            });

            it('move a field via keyboard & verify original order after CANCEL', function() {
                let originalOrder = formBuilderPO.getFieldLabels();
                formBuilderPO.KB_moveField(1, 2);
                formBuilderPO.KB_cancel();
                let newFields = formBuilderPO.open().getFieldLabels();
                expect(newFields).toEqual(originalOrder);
            });
            it('move a field via keyboard & verify revised order after SAVE', function() {
                let revisedOrder = formBuilderPO.KB_moveField(1, 2);
                formBuilderPO.KB_save();
                let newFields = formBuilderPO.open().getFieldLabels();
                expect(newFields).toEqual(revisedOrder);
            });

            it('remove a field via keyboard & verify presence after CANCEL', function() {
                let deletedField = formBuilderPO.KB_removeFieldViaIcon(1);
                // cancel & reopen
                let newFields = formBuilderPO.cancel().open().getFieldLabels();
                expect(newFields).toContain(deletedField);
            });
            it('remove a field via keyboard & verify absence after SAVE', function() {
                let deletedField = formBuilderPO.KB_removeFieldViaIcon(1);
                // save & reopen
                let newFields = formBuilderPO.save().open().getFieldLabels();
                expect(newFields).not.toContain(deletedField);
            });
        }
    });
}());
