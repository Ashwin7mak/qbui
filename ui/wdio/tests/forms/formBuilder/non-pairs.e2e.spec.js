(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let reportContentPO = requirePO('reportContent');
    let formBuilderPO = requirePO('formBuilder');
    let topNavPO = requirePO('topNav');
    let formsPO = requirePO('formsPage');
    let modalDialog = requirePO('/common/modalDialog');
    let loadingSpinner = requirePO('/common/loadingSpinner');
    let notificationContainer = requirePO('/common/notificationContainer');

    let realmName;
    let realmId;
    let testApp;

    describe('Form Builder Tests: one-offs (chrome, edge)', function() {
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
                return reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1, 1);
            });

            beforeEach(function() {
                // invoke form builder
                formBuilderPO.open();
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


            xit('add a new field & verify that it does not appear in the existing fields list', function() {
                // MC-3100: New fields appear immediately in Existing field tab
                // open existing fields tab
                formBuilderPO.tab_Existing.click();
                // verify that the existing fields list is empty
                expect(formBuilderPO.getExistingFieldLabels()).toEqual([]);
                // open new fields tab
                formBuilderPO.tab_New.click();
                // add new field
                formBuilderPO.firstNewFieldToken.click();
                // open existing fields tab
                formBuilderPO.tab_Existing.click();
                // verify that the existing fields list is empty
                expect(formBuilderPO.getExistingFieldLabels()).toEqual([]);
            });

            xit('remove field & verify that # of fields in existing tab label increments.  & v.v.', function() {
                // MC-3102: The tab button for Existing should show a count of existing fields
                // open existing fields tab
                formBuilderPO.tab_Existing.click();
                // verify that the existing fields list is empty
                expect(formBuilderPO.getExistingFieldLabels()).toEqual([]);
                // verify that '0' appears in the tab label?

                // remove the first field
                formBuilderPO.removeField(1);
                // verify that '1' appears in the tab label?

                // add the first existing field (the one we just removed)
                formBuilderPO.tab_firstField.click();
                // verify that '0' appears in the tab label?
            });

            // one-offs
            it('select a field, add a new field, verify new field is added directly below selection', function() {
                // store the list of fields before adding
                let origFields = formBuilderPO.getFieldLabels();
                let newField = formBuilderPO.firstNewFieldToken;
                let newFieldLabel = newField.getText();
                expect(origFields[1]).not.toBe(newFieldLabel);
                // select a field
                formBuilderPO.selectFieldByIndex(1);
                // add the first new field item to the form
                newField.click();
                browser.pause(e2eConsts.shortWaitTimeMs);
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
                browser.moveToObject(target);
                // verify drag token label (which won't ever feature a 'required' asterisk)
                formBuilderPO.fieldTokenDragging.waitForExist();
                expect(formBuilderPO.fieldTokenDragging.getText()).toEqual(label.replace('* ', ''));
                // drag back to source & drop
                browser.pause(e2eConsts.shortWaitTimeMs);
                browser.moveToObject(source);
                browser.buttonUp();
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
                formBuilderPO.firstNewFieldGroup.waitForExist();
                // search for label of first new field token & expect a single match in search results
                expect(formBuilderPO.search(label).length).toBe(1);
                // expect that label to match the search term
                expect(formBuilderPO.fieldTokenTitle.getText()).toBe(label);
                // remove the search term & verify original field list is restored
                expect(formBuilderPO.search(null)).toEqual(newFields);
            });

            //TODO this test fails when shrinking on window not able to hit on dont save button while leaving page
            xit('drags a field outside of viewport & verifies autoscroll', function() {
                let numFields = formBuilderPO.getFieldLabels().length;
                let firstFieldLocator = formBuilderPO.getFieldLocator(1);
                let firstField = browser.element(firstFieldLocator);
                let lastField = browser.element(formBuilderPO.getFieldLocator(numFields));
                let firstFieldSize = firstField.getElementSize();
                let firstFieldXLoc = firstField.getLocation('x');
                // shrink the window to cause last element to not be visible and make autoscroll faster
                let browserSize = browser.windowHandleSize();
                formBuilderPO.setViewportSize({
                    width: browserSize.value.width,
                    height: firstFieldSize.height * 4
                }, true);
                expect(lastField.isVisibleWithinViewport()).toBe(false);
                // move cursor to container & press MB1
                formBuilderPO.formBuilderContainer.moveToObject();
                browser.buttonDown();
                // browser.logger.info('Initiating autoscroll DOWN');
                while (firstField.isVisibleWithinViewport()) {
                    browser.moveTo(null, 0, 2);
                }
                // browser.logger.info('Autoscrolling DOWN');
                while (!lastField.isVisibleWithinViewport()) {
                    browser.pause(1000);
                }

                browser.buttonUp();
                browser.buttonDown();

                // browser.logger.info('Initiating autoscroll UP');
                while (lastField.isVisibleWithinViewport()) {
                    browser.moveTo(null, 0, -2);
                }
                // browser.logger.info('Autoscrolling UP');
                while (!firstField.isVisibleWithinViewport()) {
                    browser.pause(1000);
                }
                browser.buttonUp();
            });

            it('basic UI validation', function() {
                // wait for the form name to exist
                formBuilderPO.title.waitForExist();
                // verify the page name in the (purple) topNav bar
                expect(topNavPO.title.getText()).toBe('Modify form');
                // go back to view record form
                formBuilderPO.cancel();
                // Open settings menu item
                formBuilderPO.openMenu();
                // verify the text of the invoking menu item
                expect(topNavPO.modifyThisForm.getAttribute('textContent')).toBe('Modify this form');
                // Click again on setting icon to dismiss the menu
                topNavPO.settingsBtn.click();
                // verify that the menu option no longer exists
                topNavPO.modifyThisForm.waitForVisible(null, true);
                // verify that the form container no longer exists
                formBuilderPO.formBuilderContainer.waitForExist(null, true);
                // get back to form builder so afterEach doesn't fail on Cancel
                formBuilderPO.open();
            });

            it('remove existing field & re-add it, verify field presence (or not) of field in existing field list at each step', function() {
                // open existing fields tab
                formBuilderPO.tab_Existing.click();
                // store the name of the first field on the form
                let firstField = formBuilderPO.getFieldLabels()[0];
                // verify that the existing fields list is empty
                formBuilderPO.tab_firstField.waitForExist(null, true);
                // remove the first field
                formBuilderPO.removeField(1);
                // verify that the removed field now appears in the existing fields list
                expect(formBuilderPO.getNewFieldLabels()).toContain(firstField);
                // add the first existing field (the one we just removed)
                formBuilderPO.tab_firstField.click();
                // verify that the existing fields list is empty
                formBuilderPO.tab_firstField.waitForExist(null, true);
                // verify that the SECOND field in the form is now the former FIRST field
                // (because the removal of the first field left the second field selected
                // so 'new' field additions go below that selection)
                expect(formBuilderPO.getFieldLabels()[1]).toBe(firstField);
            });

            it('remove existing field, save & reopen form, verify that field persists in existing field list', function() {
                // store the name of the first field on the form
                let firstField = formBuilderPO.getFieldLabels()[0];
                // remove the first field
                formBuilderPO.removeField(1);
                // save & reopen
                formBuilderPO.save();
                //wait until save success container goes away
                notificationContainer.waitUntilNotificationContainerGoesAway();
                formBuilderPO.open();
                // open existing fields tab
                formBuilderPO.tab_Existing.click();
                // verify that the removed field still appears in the existing fields list
                expect(formBuilderPO.getNewFieldLabels()).toContain(firstField);
            });

            it('select existing fields tab, then collapse & expand left panel & verify that the existing tab is still selected', function() {
                // unfortunately there's no convenient way to verify that the inkbar is under the active tab
                // MC-3101: The tab button for New is selected after Fields panel is collapsed and expanded
                // open existing fields tab
                formBuilderPO.tab_Existing.click();
                // collapse left panel
                topNavPO.topNavToggleHamburgerEl.click();
                // expand left panel
                topNavPO.topNavToggleHamburgerEl.click();
                // verify existing fields tab is still selected
                expect(formBuilderPO.tab_Active.getText()).toBe("Existing");
            });

            it('add a new field from the collapsed NEW FIELDS panel', function() {
                // verify that there are initially no collapsed field tokens
                formBuilderPO.fieldTokenCollapsed.waitForExist(null, true);
                // verify that (hopefully) the last existing field on the form
                // doesn't have the same name as the first item in the NEW FIELDS list
                let fields = formBuilderPO.getFieldLabels();
                let newField = formBuilderPO.firstNewFieldToken.getText();
                expect(fields[fields.length - 1]).not.toBe(newField);
                // set the expected result after adding new field
                fields.push(newField);
                // click on hamburger to collapse field panel
                topNavPO.topNavToggleHamburgerEl.click();
                // click on a collapsed new field token to add a new field
                formBuilderPO.fieldTokenCollapsed.click();
                // verify that the new field appears at the end of the revised fields list
                expect(formBuilderPO.getFieldLabels()).toEqual(fields);
            });

            it('drag a new field onto the form & verify that it is inserted into that position on the form', function() {
                let newField = formBuilderPO.fieldTokenTitle.getText();
                let fields = formBuilderPO.getFieldLabels();
                // verify (hope) that the first field label (where new field will be inserted) doesn't already match new field label
                expect(fields[0]).not.toEqual(newField);
                // drag first new field token onto first field on form
                let newFields = formBuilderPO.dragNewFieldOntoForm(formBuilderPO.firstNewFieldToken, formBuilderPO.firstField);
                // verify that the new field is inserted below the existing one it was dragged to
                fields.splice(0, 0, newField);
                expect(newFields).toEqual(fields);
            });

            it('cancel & save via dlg, verify view form & save', function() {
                // add the first new field item to the form
                formBuilderPO.firstNewFieldToken.click();
                // store the current field labels
                let revisedLabels = formBuilderPO.getFieldLabels();
                // click on CANCEL in the modified form
                formBuilderPO.cancelBtn.click();
                // click on SAVE in the SAVE CHANGES dlg
                modalDialog.clickOnModalDialogBtn("Save");
                // wait for the view record form to load
                formsPO.viewFormContainerEl.waitForVisible();
                // reopen the form builder
                formBuilderPO.open();
                // verify that the new field was saved
                expect(formBuilderPO.getFieldLabels()).toEqual(revisedLabels);
            });

            it('cancel & stay via dlg, verify stay & no save', function() {
                // add the first new field item to the form
                let originalLabels = formBuilderPO.getFieldLabels();
                // add a new field to the form
                formBuilderPO.firstNewFieldToken.click();
                // click on CANCEL in the modified form
                formBuilderPO.cancelBtn.click();
                // click on STAY in the SAVE CHANGES dlg
                modalDialog.clickOnModalDialogBtn("Stay and keep working");
                // wait for modal dlg to disappear
                modalDialog.modalDialog.waitForExist(null, true);
                // click on CANCEL in the modified form
                formBuilderPO.cancelBtn.click();
                // click on DON'T SAVE in the SAVE CHANGES dlg
                modalDialog.clickOnModalDialogBtn("Don't save");
                // wait for the view record form to load
                formsPO.viewFormContainerEl.waitForVisible();
                // reopen the form builder
                formBuilderPO.open();
                // verify that the new field was saved
                expect(formBuilderPO.getFieldLabels()).toEqual(originalLabels);
            });

            it('cancel w/o changes, verify view form & lack of confirmation/browser alert', function() {
                // click on CANCEL in the modified form
                formBuilderPO.cancelBtn.click();
                // re-open the vorm builder (which would be impossible if a modal dlg or alert were displayed
                formBuilderPO.open();
            });

            it('reload page with changes, verify presence of browser alert', function() {
                // formBuilderPO.firstNewFieldToken.waitForVisible()
                formBuilderPO.firstNewFieldToken.click();
                // wait for selected field visibility (nothing was selected previously)
                formBuilderPO.selectedField.waitForVisible();
                // reload page AFTER change
                browser.url(browser.getUrl());
                // implicit verification: this line will fail if an alert is NOT present
                browser.alertDismiss();
            });

            it('verify presence of all expected tokens & groups in new fields panel', function() {
                // build an array of groups, each being an array of items within that group
                // and compare that to the expected array
                expect(
                    formBuilderPO.activePanel.elements('.listOfElementsItemGroup').value.map(function(group) {
                        return group.elements('.listOfElementsItem').value.map(function(item) {
                            return item.getText();
                        });
                    })).toEqual([
                    ['Text', 'Choice list'],
                    ['Number', 'Currency', 'Percentage'],
                    ['Date', 'Time stamp', 'Time of day', 'Duration'],
                    ['Checkbox', 'User', 'URL', 'Email', 'Phone'],
                    ['Get another record']]
                );
            });
        }
    });
}());
