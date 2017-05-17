(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let reportContentPO = requirePO('reportContent');
    let formBuilderPO = requirePO('formBuilder');

    let realmName;
    let realmId;
    let testApp;

    describe('Form Builder Tests: ', function() {
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
                browser.pause(1); // catch can't be empty
            }
            // open first table
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            // edit first record
            reportContentPO.clickOnRecordInReportTable(0);
            // invoke form builder
            formBuilderPO.waitForReady();
            browser.pause(fiveSeconds);
            return formBuilderPO.open();
        });

        afterEach(function() {
            formBuilderPO.cancel();
        });

        // disabled
        xit('select a field via KB, add a new field via KB, verify new field is added directly below selection', function() {
            //TODO: disabled pending MC-1424: Keyboard Nav for Adding New Field & ESC key enhancements
            let selectedField = formBuilderPO.KB_selectField(2);
            browser.keys([
                'Escape', // deselect field
                'Escape', // focus form builder
                'Shift', 'Tab', // focus NEW FIELD panel
                'Shift'] // release mod key
            );
            // verify that the field is still selected
            expect(formBuilderPO.getSelectedFieldLabel()).toEqual(selectedField);
            // TODO: select/add a new field via keyboard & verify that is inserted directly below the selected field
        });

        xit('check the REQUIRED checkbox, cancel & verify not checked', function() {
            //TODO: disabled pending MC-2164: REQUIRED checkbox needs a reliable way to automate click & query
            let originalFields = formBuilderPO.getFieldLabels();
            browser.moveToObject(formBuilderPO.getFieldLocator(1) + ' .draggableField', 1, 1);
            browser.buttonDown();
            browser.buttonUp();
            // verify initial state of checkbox
            // I had to define separate elements for checked & non-checked states, which is not ideal
            formBuilderPO.fieldProperty_Required.waitForExist();
            expect(formBuilderPO.requiredCheckboxChecked.isExisting()).toBe(false);
            expect(formBuilderPO.requiredCheckboxNotChecked.isExisting()).toBe(true);
            // revise the REQUIRED property (i.e. click the checkbox to make it checked)
            formBuilderPO.fieldProperty_Required.click();
            // this line fails even though the checkbox has been checked, so I logged the issue & disabled the test
            formBuilderPO.requiredCheckboxChecked.waitForExist();
            // cancel & reopen
            formBuilderPO.cancel().open();
            // verify REQUIRED checkbox is not checked
            expect(formBuilderPO.requiredCheckboxChecked.isExisting()).toBe(false);
        });

        xit('check the REQUIRED checkbox, save & verify checked', function() {
            //TODO: MC-2164: REQUIRED checkbox needs a reliable way to automate click & query
        });

        // one-offs
        it('select a field, add a new field, verify new field is added directly below selection', function() {
            // store the list of fields before adding
            let origFields = formBuilderPO.getFieldLabels();
            let newField = formBuilderPO.listOfElementsItem;
            let newFieldLabel = newField.getText();
            expect(origFields[1]).not.toBe(newFieldLabel);
            // select a field
            formBuilderPO.selectFieldByIndex(1);
            // add the first new field item to the form
            newField.click();
            browser.pause(formBuilderPO.oneSecond);
            // verify that the new row has the expected label
            expect(formBuilderPO.getFieldLabels()[1]).toBe(newFieldLabel);
        });

        it('drag a field onto another without dropping, then drag back to original field, release & verify no change', function() {
            // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
            let label = origFields[0];
            // drag 1st field onto 2nd
            let source = formBuilderPO.getFieldLocator(1);
            let target = formBuilderPO.getFieldLocator(2);
            // drag source to target without dropping
            browser.moveToObject(source);
            browser.buttonDown();
            browser.pause(formBuilderPO.oneSecond);
            browser.moveToObject(target);
            // verify drag token label (which won't ever feature a 'required' asterisk)
            formBuilderPO.fieldTokenDragging.waitForExist();
            expect(formBuilderPO.fieldTokenDragging.getText()).toEqual(label.replace('* ', ''));
            // drag back to source & drop
            browser.pause(formBuilderPO.oneSecond);
            browser.moveToObject(source + ' .fieldLabel', 5, 5);
            browser.pause(formBuilderPO.oneSecond);
            browser.buttonUp();
            browser.buttonDown();
            browser.buttonUp();
            browser.pause(formBuilderPO.fiveSeconds);
            expect(formBuilderPO.getFieldLabels()).toEqual(origFields);
        });

        it('drag/drop a field to another by name & verify move', function() {
            // this isn't a real test yet, but rather a POC for name-based field reference; this technique
            // will come in handy later when we start creating fields on the fly, renaming fields, etc.

            // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
            // drag the 1st field below the 2nd one
            let movedFields = formBuilderPO.moveByName(origFields[0], origFields[1]);
            // verify that the first 2 items have changed position
            expect(movedFields[0]).toBe(origFields[1]);
            expect(movedFields[1]).toBe(origFields[0]);
        });

        it('search for fields in the new field picker', function() {
            let newFields = formBuilderPO.getNewFieldLabels();
            let label = formBuilderPO.fieldTokenTitle.getText();
            // verify expected initial state (presence of groups)
            // because we're about to verify that it changes
            formBuilderPO.listOfElementsItemGroup.waitForExist();
            // search for label of first new field token
            formBuilderPO.search(label);
            // expect a single match in search results
            expect(formBuilderPO.getNewFieldLabels().length).toBe(1);
            // expect that label to match the search term
            expect(formBuilderPO.fieldTokenTitle.getText()).toBe(label);
            // remove the search term & verify original field list is restored
            expect(formBuilderPO.search(null)).toEqual(newFields);
        });

        it('drags a field outside of viewport & verifies autoscroll', function() {
            let numFields = formBuilderPO.getFieldLabels().length;
            let firstFieldLocator = formBuilderPO.getFieldLocator(1);
            let firstField = browser.element(firstFieldLocator);
            let lastField = browser.element(formBuilderPO.getFieldLocator(numFields));
            let firstFieldSize = firstField.getElementSize();
            let firstFieldXLoc = firstField.getLocation('x');
            // shrink the window to cause last element to not be visible and make autoscroll faster
            let browserSize = browser.windowHandleSize();
            formBuilderPO.setViewportSize({width: browserSize.value.width, height: firstFieldSize.height * 4}, true);
            expect(lastField.isVisibleWithinViewport()).toBe(false);
            // move cursor to first field & press MB1
            //            firstField.click(); // shouldn't be necessary... but edge tends to hang here
            browser.moveToObject(firstFieldLocator);
            browser.buttonDown();
            // drag DOWN down until autoscroll begins
            browser.logger.info('Initiating autoscroll DOWN');
            while (firstFieldXLoc === firstField.getLocation('x') &&
            firstField.isVisibleWithinViewport()) {//WithinViewport()) {
                browser.moveTo(null, 0, 2);
            }
            // wait for autoscroll to reach the bottom
            browser.logger.info('Autoscrolling DOWN');
            while (!firstFieldXLoc === firstField.getLocation('x')) {
                firstFieldXLoc = firstField.getLocation('x');
                browser.pause(formBuilderPO.oneSecond);
            }
            // drag UP until autoscroll begins
            browser.logger.info('Initiating autoscroll UP');
            while (firstFieldXLoc === firstField.getLocation('x') &&
            lastField.isVisibleWithinViewport()) {
                browser.moveTo(null, 0, -2);
            }
            // wait for first field to become visible
            browser.logger.info('Autoscrolling UP');
            while (!firstFieldXLoc === firstField.getLocation('x')) {
                firstFieldXLoc = firstField.getLocation('x');
                browser.pause(formBuilderPO.oneSecond);
            }
            // release button
            browser.buttonUp();
        });

        // pos/neg pairs
        it('rename a field, verify no revision after CANCEL', function() {
            let originalFields = formBuilderPO.getFieldLabels();
            formBuilderPO.selectFieldByIndex(1);
            // revise the field name
            let testString = 'testString';
            formBuilderPO.fieldProperty_Name.setValue(testString);
            browser.pause(5000);
            //  verify that the field label was revised
            let existingFields = formBuilderPO.getFieldLabels();
            expect(existingFields[0]).toEqual(testString);
            // cancel & reopen
            formBuilderPO.cancel().open();
            // verify field name is not revised
            expect(formBuilderPO.getFieldLabels()).toEqual(originalFields);
        });
        it('rename a field, verify revision after SAVE', function() {
            formBuilderPO.selectFieldByIndex(1);
            // revise the field name
            let testString = 'testString';
            formBuilderPO.fieldProperty_Name.setValue(testString);
            browser.pause(5000);
            //  verify that the field label was revised
            let existingFields = formBuilderPO.getFieldLabels();
            expect(existingFields[0]).toEqual(testString);
            // save & reopen
            formBuilderPO.save().open();
            // verify field name is revised
            expect(formBuilderPO.getFieldLabels()).toEqual(existingFields);
        });

        it('remove a field with mouse & verify presence after CANCEL', function() {
            // store the list of fields before deletion
            let firstField = formBuilderPO.getFieldLabels()[0];
            // delete the first field
            formBuilderPO.removeField(1);
            // verify that the first item is removed
            expect(formBuilderPO.getFieldLabels().indexOf(firstField)).toEqual(-1);
            // cancel & reopen
            formBuilderPO.cancel().open();
            // verify that the first item has been restored
            expect(formBuilderPO.getFieldLabels().indexOf(firstField)).toEqual(0);
        });
        it('remove a field with mouse & verify absence after SAVE', function() {
            // store the list of fields before deletion
            let firstField = formBuilderPO.getFieldLabels()[0];
            // delete the first field
            formBuilderPO.removeField(1);
            // verify that the first item is removed
            expect(formBuilderPO.getFieldLabels()).not.toContain(firstField);
            // save & reopen
            formBuilderPO.save().open();
            // verify that the first item is still gone
            expect(formBuilderPO.getFieldLabels()).not.toContain(firstField);
        });

        it('remove the selected field with BACKSPACE & verify presence after CANCEL', function() {
            let removedField = formBuilderPO.KB_removeFieldViaBackspace(1);
            // cancel & reopen
            formBuilderPO.cancel().open();
            expect(formBuilderPO.getFieldLabels()).toContain(removedField);
        });
        it('remove the selected field with BACKSPACE & verify absence after SAVE', function() {
            let removedField = formBuilderPO.KB_removeFieldViaBackspace(1);
            // save & reopen
            formBuilderPO.save().open();
            expect(formBuilderPO.getFieldLabels()).not.toContain(removedField);
        });

        it('move a field via keyboard & verify original order after CANCEL', function() {
            let originalOrder = formBuilderPO.getFieldLabels();
            formBuilderPO.KB_moveField(1, 2);
            formBuilderPO.KB_cancel();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toEqual(originalOrder);
        });
        it('move a field via keyboard & verify revised order after SAVE', function() {
            let revisedOrder = formBuilderPO.KB_moveField(1, 2);
            formBuilderPO.KB_save();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toEqual(revisedOrder);
        });

        it('add a new field to bottom of form & verify absence after CANCEL', function() {
            let existingFields = formBuilderPO.getFieldLabels();
            let newField = formBuilderPO.listOfElementsItem;
            // verify that (hopefully) the last existing field on the form
            // doesn't have the same name as the first item in the NEW FIELDS list
            expect(existingFields[existingFields.length - 1]).not.toBe(newField.getText());
            // add the first new field item to the form
            newField.click();
            browser.pause(5000);
            // verify that the new field appears at the end of the revised fields list
            let originalFields = existingFields.slice();
            existingFields.push(newField.getText());
            expect(formBuilderPO.getFieldLabels()).toEqual(existingFields);
            // cancel & reopen
            formBuilderPO.cancel().open();
            // verify new field is not present
            expect(formBuilderPO.getFieldLabels()).toEqual(originalFields);
        });
        it('add a new field to bottom of form & verify presence after SAVE', function() {
            let existingFields = formBuilderPO.getFieldLabels();
            let newField = formBuilderPO.listOfElementsItem;
            // verify that (hopefully) the last existing field on the form
            // doesn't have the same name as the first item in the NEW FIELDS list
            expect(existingFields[existingFields.length - 1]).not.toBe(newField);
            // add the first new field item to the form
            newField.click();
            browser.pause(5000);
            // verify that the new field appears at the end of the revised fields list
            existingFields.push(newField.getText());
            expect(formBuilderPO.getFieldLabels()).toEqual(existingFields);
            // save & reopen
            formBuilderPO.save().open();
            // verify new field is present
            expect(formBuilderPO.getFieldLabels()).toEqual(existingFields);
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
            formBuilderPO.cancel().open();
            // verify lack of persistence
            expect(formBuilderPO.getFieldLabels()).toEqual(origFields);
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
            formBuilderPO.save().open();
            // verify persistence
            expect(formBuilderPO.getFieldLabels()).toEqual(movedFields);
        });

        it('remove a field via keyboard & verify presence after CANCEL', function() {
            let deletedField = formBuilderPO.KB_removeFieldViaIcon(1);
            // cancel & reopen
            formBuilderPO.cancel().open();
            expect(formBuilderPO.getFieldLabels()).toContain(deletedField);
        });
        it('remove a field via keyboard & verify absence after SAVE', function() {
            let deletedField = formBuilderPO.KB_removeFieldViaIcon(1);
            // save & reopen
            formBuilderPO.save().open();
            expect(formBuilderPO.getFieldLabels()).not.toContain(deletedField);
        });

    });
}());
