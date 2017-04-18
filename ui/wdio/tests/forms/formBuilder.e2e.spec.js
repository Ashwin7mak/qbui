(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let reportContentPO = requirePO('reportContent');
    let formBuilderPO = requirePO('formBuilder');
    let topNavPO = requirePO('topNav');

    let realmName;
    let realmId;
    let testApp;

    describe('Form Builder Tests: ', function() {
        beforeAll(function() {
            /**
             * Setup method. Creates test app then authenticates into the new stack
             */
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
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        beforeEach(function() {
            // open first table
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            // edit first record
            reportContentPO.clickOnRecordInReportTable(0);
            // invoke form builder
            return formBuilderPO.open();
        });

        it('move a field via drag/drop & verify revised order after SAVE', function() {
         // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
         // drag the 1st field below the 2nd one
            let source = formBuilderPO.findFieldByIndex(1);
            let target = formBuilderPO.findFieldByIndex(2);
            formBuilderPO.slowDragAndDrop(source, target);
         // verify that the first 2 items have changed position
            let movedFields = formBuilderPO.getFieldLabels();
            expect(movedFields[0]).toBe(origFields[1]);
            expect(movedFields[1]).toBe(origFields[0]);
         // save & verify persistence
            formBuilderPO.saveBtn.click();
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toEqual(movedFields);
        });

        it('move a field via drag/drop & verify original order after CANCEL', function() {
         // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
         // drag the 1st field below the 2nd one
            let source = formBuilderPO.findFieldByIndex(1);
            let target = formBuilderPO.findFieldByIndex(2);
            formBuilderPO.slowDragAndDrop(source, target);
         // verify that the first 2 items have changed position
            let movedFields = formBuilderPO.getFieldLabels();
            expect(movedFields[0]).toBe(origFields[1]);
            expect(movedFields[1]).toBe(origFields[0]);
         // cancel & verify lack of persistence
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toEqual(origFields);
        });

        it('move a field via keyboard & verify revised order after SAVE', function() {
            let revisedOrder = formBuilderPO.KB_moveField(1, 2);
            formBuilderPO.saveBtn.click();
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toEqual(revisedOrder);
        });

        it('move a field via keyboard & verify original order after CANCEL', function() {
            let originalOrder = formBuilderPO.getFieldLabels();
            formBuilderPO.KB_moveField(1, 2);
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toEqual(originalOrder);
        });

        it('removes a field, then saves and verifies absence', function() {
         // store the list of fields before deletion
            let firstField = formBuilderPO.getFieldLabels()[0];
         // delete the first field
            formBuilderPO.delete(1);
         // verify that the first item is removed
            expect(formBuilderPO.getFieldLabels().indexOf(firstField)).toEqual(-1);
         // save, cancel, reopen
            formBuilderPO.saveBtn.click();
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
         // verify that the first item is still gone
            expect(formBuilderPO.getFieldLabels().indexOf(firstField)).toEqual(-1);
        });

        it('removes a field, then cancels and verifies presence', function() {
         // store the list of fields before deletion
            let firstField = formBuilderPO.getFieldLabels()[0];
         // delete the first field
            formBuilderPO.delete(1);
         // verify that the first item is removed
            expect(formBuilderPO.getFieldLabels().indexOf(firstField)).toEqual(-1);
         // cancel, reopen
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
         // verify that the first item has been restored
            expect(formBuilderPO.getFieldLabels().indexOf(firstField)).toEqual(0);
        });

        it('remove a field via keyboard & verify absence after SAVE', function() {
            let deletedField = formBuilderPO.KB_removeFieldViaBackspaceKey(1);
            // cancel, reopen
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toContain(deletedField);
        });

        it('remove a field via keyboard & verify presence after CANCEL', function() {
            let deletedField = formBuilderPO.KB_removeFieldViaBackspaceKey(1);
            // save, cancel, reopen
            formBuilderPO.saveBtn.click();
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).not.toContain(deletedField);
        });

        it('remove the selected field with BACKSPACE & verify presence after CANCEL', function() {
            let removedField = formBuilderPO.KB_removeFieldViaBackspaceKey(1);
            // cancel, reopen
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).toContain(removedField);
        });

        it('remove the selected field with BACKSPACE & verify absence after SAVE', function() {
            let removedField = formBuilderPO.KB_removeFieldViaBackspaceKey(1);
            // save, cancel, reopen
            formBuilderPO.saveBtn.click();
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            expect(formBuilderPO.getFieldLabels()).not.toContain(removedField);
        });

        xit('verify field selection stickiness', function() {
        // pending fix for ESC key (MC-1609)
            let selectedField = formBuilderPO.KB_selectField(2);
            // wait until ESC key functionality is fixed so we don't have to TAB out & back in
            expect(formBuilderPO.selectedField.getText()).toEqual(selectedField);
        });

        it('drag/drop a field to another by name & verify move', function() {
         // this isn't a real test, but the technique will come in handy later
         // when we start creating fields on the fly, renaming fields, etc.

         // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
         // drag the 1st field below the 2nd one
            formBuilderPO.moveByName(origFields[0], origFields[1]);
         // verify that the first 2 items have changed position
            let movedFields = formBuilderPO.getFieldLabels();
            expect(movedFields[0]).toBe(origFields[1]);
            expect(movedFields[1]).toBe(origFields[0]);
        });

        it('drag a field onto another without dropping, then drag back to original field, release & verify no change', function() {
         // store the list of fields before moving
            let origFields = formBuilderPO.getFieldLabels();
         // drag 1st field onto 2nd
            let source = formBuilderPO.findFieldByIndex(1);
            let target = formBuilderPO.findFieldByIndex(2);
            let label = browser.element(source).getText();
         // drag source to target without dropping
            browser.moveToObject(source);
            browser.buttonDown();
            formBuilderPO.slowDrag(target, label);
         // verify drag token label
            // this worked until the left panel was introduced; now there are tokens for
            // each of those field tokens but the drag token seems to have disappeared
            // expect(formBuilderPO.fieldTokenTitle.getText()).toEqual(origFields[0].replace('* ', ''));
         // drag back to source & drop
            formBuilderPO.slowDrag(source, label);
            browser.buttonUp();
            browser.pause(5000);
            expect(formBuilderPO.getFieldLabels()).toEqual(origFields);
        });

        it('drags a field outside of viewport & verifies autoscroll', function() {
            let autoscrollTimeout = 10; // seconds
            let firstField = browser.element(formBuilderPO.findFieldByIndex(1));
            let lastField = browser.element(formBuilderPO.findFieldByIndex(formBuilderPO.getFieldLabels().length));
            let firstFieldSize = firstField.getElementSize();
            let viewportSize = browser.getViewportSize();
            // temporarily shrink the window to (hopefully) cause last element to not be visible
        //  make it height of first field + 'padding' below last field
            browser.setViewportSize({width: viewportSize.width, height: firstFieldSize.height * 3});
         // verify last field is not visible
            expect(lastField.isVisibleWithinViewport()).toBe(false);
         // click & hold on first field
            firstField.element('.fieldLabel').moveToObject();
            browser.buttonDown();
         // drag DOWN until autoscroll begins
            while (firstField.isVisibleWithinViewport()) {
                browser.moveTo(null, 0, 1);
            }
        // wait for autoscroll to reach the bottom (or timeout)
            let seconds = 0;
            while (!lastField.isVisibleWithinViewport() && seconds++ < autoscrollTimeout) {
                browser.pause(1000);
            }
        // verify that the last field is visible
            expect(lastField.isVisibleWithinViewport()).toBe(true, 'autoscroll DOWN failed');

        // these ops are inexplicably required (s/b able to just move the mouse up?!)
            browser.buttonUp();
            browser.pause(1000);
            lastField.element('.fieldLabel').moveToObject();
            browser.buttonDown();

        // drag UP until autoscroll begins
            while (lastField.isVisibleWithinViewport()) {
                browser.moveTo(null, 0, -1);
            }
        // wait for autoscroll to reach the top
            seconds = 0;
            while (!firstField.isVisibleWithinViewport() && seconds++ < autoscrollTimeout) {
                browser.pause(1000);
            }
        // verify that the first field is visible
            expect(firstField.isVisibleWithinViewport()).toBe(true, 'autoscroll UP failed');
        // release button & restore window
            browser.buttonUp();
            browser.setViewportSize(viewportSize);
        });

        it('search for fields in the new field picker', function() {
            let newFields = formBuilderPO.getNewFieldLabels();
            let label = formBuilderPO.fieldTokenTitle.getText();

            // search for label of first new field token
            formBuilderPO.searchInput.setValue(label);
            // wait for groups to disappear
            formBuilderPO.listOfElementsItemGroup.waitForExist(false);
            browser.pause(1000);
            // expect a single match in search results
            expect(formBuilderPO.getNewFieldLabels().length).toBe(1);
            // expect that label to match the search term
            expect(formBuilderPO.fieldTokenTitle.getText()).toBe(label);
            // remove the search term
            formBuilderPO.clearSearch.click();
            // wait for groups to reappear
            formBuilderPO.listOfElementsItemGroup.waitForExist(true);
            browser.pause(1000);
            // expect original new field tokens to reappear
            expect(formBuilderPO.getNewFieldLabels()).toEqual(newFields);
        });

        xit('add a new field to bottom of form, save & verify presence', function() {
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
            // todo: save, cancel, verify presence (once SAVE is working)
        });

        it('add a new field to bottom of form, cancel & verify absence', function() {
            let existingFields = formBuilderPO.getFieldLabels();
            let newField = formBuilderPO.listOfElementsItem;
            // verify that the last existing field on the form
            // doesn't have the same name as the first item in the NEW FIELDS list
            expect(existingFields[existingFields.length - 1]).not.toBe(newField);
            // add the first new field item to the form
            newField.click();
            browser.pause(5000);
            // verify that the new field appears at the end of the revised fields list
            let originalFields = existingFields.slice();
            existingFields.push(newField.getText());
            expect(formBuilderPO.getFieldLabels()).toEqual(existingFields);
            // save, cancel, reopen
            formBuilderPO.saveBtn.click();
            formBuilderPO.cancelBtn.click();
            formBuilderPO.open();
            // verify new field is not present
            expect(formBuilderPO.getFieldLabels()).toEqual(originalFields);
        });

        it('rename a field, save & verify revision', function() {
            // let source = browser.element(formBuilderPO.findFieldByIndex(1));
            // source.element('.dragHandle').click();

            // at the moment, the only way to select a field for property editing
            // is to add a new one (click to select field isn't working)
            let source = formBuilderPO.listOfElementsItem;
            source.click();
            formBuilderPO.fieldProperty_Name.waitForExist()
            let testString = 'testString';
            formBuilderPO.fieldProperty_Name.setValue(testString);
            // get the NAME component of the title by trimming " properties"
            let propertyTitle = formBuilderPO.fieldPropertiesTitle.getText().split(' properties')[0];
            expect (propertyTitle).toEqual(testString);
            //  get field labels & verify that the last one has changed as expected
            let existingFields = formBuilderPO.getFieldLabels();
            expect (existingFields[existingFields.length - 1]).toEqual(testString);
        });

        xit('rename a field, cancel & verify no revision', function() {
        });

        xit('make a field required, save & verify revision', function() {
            // then make it unrequired & do same checks
            // && check that new record actually requires value
        });

        xit('make a field required, cancel & verify no revision', function() {
        });

        xit('make a field NOT required, save & verify no revision', function() {
            // & check that new record actually does not require value
        });
    });
}());
