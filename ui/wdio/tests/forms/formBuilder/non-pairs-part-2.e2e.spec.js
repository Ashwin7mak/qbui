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

            // one-offs

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

            it('cancel & save via confirmation dialog, verify view form & save', function() {
                // add the first new field item to the form
                formBuilderPO.firstFieldToken.click();
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
                formBuilderPO.firstFieldToken.click();
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
                // re-open the form builder (which would be impossible if a modal dlg or alert were displayed
                formBuilderPO.open();
            });

            it('reload page with changes, verify presence of browser alert', function() {
                // add a new field
                formBuilderPO.firstFieldToken.click();
                // wait for selected field visibility (nothing was selected previously)
                formBuilderPO.selectedField.waitForVisible();
                // wait a bit because Edge won't generate an alert otherwise...
                browser.pause(e2eConsts.shortWaitTimeMs);
                // reload page AFTER change
                // browser.url(browser.getUrl());
                browser.reload();
                browser.pause(e2eConsts.shortWaitTimeMs); // give alert time to appear (slow on Edge)
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

            it('verify search in fields panel only returns results from active panel', function() {
                // click on the EXISTING (fields) tab
                formBuilderPO.tab_Existing.click();
                // make sure that the existing fields list is empty
                while (formBuilderPO.firstFieldToken.isExisting()) {
                    formBuilderPO.addFirstField();
                }
                // select the first field on the form
                formBuilderPO.selectFieldByIndex(1);
                // rename the field to something which includes a NEW field name
                let newLabel = 'Text';
                let existingLabel = 'test' + newLabel;
                formBuilderPO.fieldProperty_Name.setValue(existingLabel);
                browser.pause(e2eConsts.shortWaitTimeMs);
                // remove the field we just renamed
                formBuilderPO.removeField(1);
                // search for the text which matches both new & existing fields
                expect(formBuilderPO.search(newLabel).length).toBe(1);
                //  results to only contain existing fields
                expect(formBuilderPO.fieldTokenTitle.getText()).toBe(existingLabel);
                // trying to avoid failure of subsequent click Chrome/SauceLabs (click selects field but doesn't add it)
                formBuilderPO.searchInput.keys("Tab");
                // add the field we just removed
                formBuilderPO.addFirstField();
                // wait for the NO MATCH text to appear
                formBuilderPO.emptySearchResult.waitForExist();
                // verify the NO MATCH text
                expect(formBuilderPO.emptySearchResult.getText()).toBe('No fields match "' + newLabel + '"');
                // click on the NEW tab
                formBuilderPO.tab_New.click();
                // wait for the first field token to appear
                formBuilderPO.firstFieldToken.waitForExist();
                // verify that the search field is empty
                expect(formBuilderPO.searchInput.getAttribute("value")).toBe('');
                // click on the EXISTING tab
                formBuilderPO.tab_Existing.click();
                // wait for the first field token to disappear
                formBuilderPO.firstFieldToken.waitForExist(null, true);
                // verify that the previous EXISTING search term is still present
                expect(formBuilderPO.searchInput.getAttribute("value")).toBe(newLabel);
            });

            it('save new multichoice option & verify persistence', function() {
                formBuilderPO.dragNewFieldOntoForm(
                    formBuilderPO.getFieldToken('Choice list'),
                    formBuilderPO.firstField);
                // move cursor to end of text in editor & add new option
                let testOption = "test option";
                formBuilderPO.multiChoiceEditor.click();
                formBuilderPO.multiChoiceEditor.keys(["Command", "ArrowUp", "Command", testOption, "Enter"]);
                // save, reopen, select first field
                formBuilderPO.save().open().selectFieldByIndex(1);
                let options = formBuilderPO.multiChoiceEditor.getText();
                expect(options.startssWith(testOption)).toBe(true, options + 'didn\'t start with ' + testOption);
            });

            // todo: it('automatic numbering', function() {
            // MC-3611: QE: add test(s) for automatic numbering of duplicate field names
            // });

            // todo: https://quickbase.atlassian.net/browse/MC-3503
            // MC3503_Fix_bug_where_new_fields_appear_in_existing_fields_list

        }
    });
}());
