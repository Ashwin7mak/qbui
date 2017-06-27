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

    describe('Form Builder Tests: non-keyboard tests, pos/neg pairs ( (chrome, edge))', function() {
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
                return formBuilderPO.open();
            });

            afterEach(function() {
                return formBuilderPO.cancel();
            });

            // pos/neg pairs

            // MC-2164: REQUIRED checkbox needs a reliable way to automate click & query    formBuilderPO.selectFieldByIndex(1);
            xit('check the UNIQUE checkbox, cancel & verify not checked', function() {
                // revise the UNIQUE property (i.e. click the unchecked checkbox to check it)
                formBuilderPO.setUniqueCheckboxState(true);
                // cancel, reopen, reselect
                formBuilderPO.cancel().open().selectFieldByIndex(1);
                // verify UNIQUE checkbox IS NOT checked
                expect(formBuilderPO.getUniqueCheckboxState()).toBe(false);
            });
            // MC-2164: REQUIRED checkbox needs a reliable way to automate click & query    formBuilderPO.selectFieldByIndex(1);
            xit('check the UNIQUE checkbox, save & verify checked', function() {
                formBuilderPO.selectFieldByIndex(1);
                // revise the UNIQUE property (i.e. click the unchecked checkbox to check it)
                formBuilderPO.setUniqueCheckboxState(true);
                // save, reopen, reselect
                formBuilderPO.save().open().selectFieldByIndex(1);
                // verify UNIQUE checkbox IS checked
                expect(formBuilderPO.getUniqueCheckboxState()).toBe(true);
            });

            // MC-2164: REQUIRED checkbox needs a reliable way to automate click & query    formBuilderPO.selectFieldByIndex(1);
            xit('check the REQUIRED checkbox, cancel & verify not checked', function() {
                formBuilderPO.selectFieldByIndex(1);
                // revise the REQUIRED property (i.e. click the unchecked checkbox to check it)
                formBuilderPO.setRequiredCheckboxState(formBuilderPO.requiredCheckbox, true);
                // cancel, reopen, reselect
                formBuilderPO.cancel().open().selectFieldByIndex(1);
                // verify REQUIRED checkbox IS NOT checked
                expect(formBuilderPO.getRequiredCheckboxState()).toBe(false);
            });
            // MC-2164: REQUIRED checkbox needs a reliable way to automate click & query    formBuilderPO.selectFieldByIndex(1);
            xit('check the REQUIRED checkbox, save & verify checked', function() {
                formBuilderPO.selectFieldByIndex(1);
                // revise the REQUIRED property (i.e. click the unchecked checkbox to check it)
                formBuilderPO.setRequiredCheckboxState(true);
                // save, reopen, reselect
                formBuilderPO.save().open().selectFieldByIndex(1);
                // verify REQUIRED checkbox IS checked
                expect(formBuilderPO.getRequiredCheckboxState()).toBe(true);
            });
 /*

            it('rename a field, verify no revision after CANCEL', function() {
                let originalFields = formBuilderPO.getFieldLabels();
                formBuilderPO.selectFieldByIndex(1);
                // revise the field name
                let testString = 'testString';
                formBuilderPO.fieldProperty_Name.setValue(testString);
                //  verify that the field label was revised
                let existingFields = formBuilderPO.getFieldLabels();
                expect(existingFields[0]).toEqual(testString);
                // cancel & reopen
                let newFields = formBuilderPO.cancel().open().getFieldLabels();
                // verify field name is not revised
                expect(newFields).toEqual(originalFields);
            });
            it('rename a field, verify revision after SAVE', function() {
                formBuilderPO.selectFieldByIndex(1);
                // revise the field name
                let testString = 'testString';
                formBuilderPO.fieldProperty_Name.setValue(testString);
                //  verify that the field label was revised
                let existingFields = formBuilderPO.getFieldLabels();
                expect(existingFields[0]).toEqual(testString);
                // save & reopen
                let newFields = formBuilderPO.save().open().getFieldLabels();
                // verify field name is revised
                expect(newFields).toEqual(existingFields);
            });

            it('remove a field with mouse & verify presence after CANCEL', function() {
                // store the list of fields before deletion
                let firstField = formBuilderPO.getFieldLabels()[0];
                // delete the first field
                formBuilderPO.removeField(1);
                // verify that the first item is removed
                expect(formBuilderPO.getFieldLabels().indexOf(firstField)).toEqual(-1);
                // cancel & reopen
                let newFields = formBuilderPO.cancel().open().getFieldLabels();
                // verify that the first item has been restored
                expect(newFields.indexOf(firstField)).toEqual(0);
            });
            it('remove a field with mouse & verify absence after SAVE', function() {
                // store the list of fields before deletion
                let firstField = formBuilderPO.getFieldLabels()[0];
                // delete the first field
                formBuilderPO.removeField(1);
                // verify that the first item is removed
                expect(formBuilderPO.getFieldLabels()).not.toContain(firstField);
                // save & reopen
                let newFields = formBuilderPO.save().open().getFieldLabels();
                // verify that the first item is still gone
                expect(newFields).not.toContain(firstField);
            });

            it('add a new field to bottom of form & verify absence after CANCEL', function() {
                let existingFields = formBuilderPO.getFieldLabels();
                let newField = formBuilderPO.firstFieldToken;
                // verify that (hopefully) the last existing field on the form
                // doesn't have the same name as the first item in the NEW FIELDS list
                expect(existingFields[existingFields.length - 1]).not.toBe(newField.getText());
                // add the first new field item to the form
                newField.click();
                // verify that the new field appears at the end of the revised fields list
                let originalFields = existingFields.slice();
                existingFields.push(newField.getText());
                expect(formBuilderPO.getFieldLabels()).toEqual(existingFields);
                // cancel & reopen
                let newFields = formBuilderPO.cancel().open().getFieldLabels();
                // verify new field is not present
                expect(newFields).toEqual(originalFields);
            });
            it('add a new field to bottom of form & verify presence after SAVE', function() {
                let existingFields = formBuilderPO.getFieldLabels();
                let newField = formBuilderPO.firstFieldToken;
                // verify that (hopefully) the last existing field on the form
                // doesn't have the same name as the first item in the NEW FIELDS list
                expect(existingFields[existingFields.length - 1]).not.toBe(newField);
                // add the first new field item to the form
                newField.click();
                browser.pause(e2eConsts.shortWaitTimeMs);
                // verify that the new field appears at the end of the revised fields list
                existingFields.push(newField.getText());
                expect(formBuilderPO.getFieldLabels()).toEqual(existingFields);
                // save & reopen
                let newFields = formBuilderPO.save().open().getFieldLabels();
                // verify new field is present
                expect(newFields).toEqual(existingFields);
            });

            it('move a field via drag/drop & verify original order after CANCEL', function() {
                // store the list of fields before moving
                let origFields = formBuilderPO.getFieldLabels();
                // drag the 1st field below the 2nd one
                let source = formBuilderPO.getFieldLocator(1);
                let target = formBuilderPO.getFieldLocator(2);
                let movedFields = formBuilderPO.slowDragAndDrop(source, target);
                // verify that the first 2 items have changed position
                expect(movedFields[0]).toBe(origFields[1]);
                expect(movedFields[1]).toBe(origFields[0]);
                // cancel & reopen
                let newFields = formBuilderPO.cancel().open().getFieldLabels();
                // verify lack of persistence
                expect(newFields).toEqual(origFields);
            });
            it('move a field via drag/drop & verify revised order after SAVE', function() {
                // store the list of fields before moving
                let origFields = formBuilderPO.getFieldLabels();
                // drag the 1st field below the 2nd one
                let source = formBuilderPO.getFieldLocator(1);
                let target = formBuilderPO.getFieldLocator(2);
                let movedFields = formBuilderPO.slowDragAndDrop(source, target);
                // verify that the first 2 items have changed position
                expect(movedFields[0]).toBe(origFields[1]);
                expect(movedFields[1]).toBe(origFields[0]);
                // save & reopen
                let newFields = formBuilderPO.save().open().getFieldLabels();
                // verify persistence
                expect(newFields).toEqual(movedFields);
            });
            */
        }
    });
}());
