'use strict';
let topNavPO = requirePO('topNav');
let reportContentPO = requirePO('reportContent');

class formBuilderPage {

    get cancelBtn() {
        // CANCEL (form) button in footer bar
        return browser.element('.alternativeTrowserFooterButton');
    }

    get clearSearch() {
        // CLEAR (X) button in the SEARCH (new fields) textbox (left panel)
        return browser.element('.clearSearch .searchIcon');
    }

    get deleteFieldIcon() {
        // REMOVE (field from form) icon (when a field is selected or highlighted)
        return browser.element('.deleteFieldIcon');
    }

    get fieldProperty_Name() {
        // NAME textfield in the FIELD PROPERTIES panel (when a field is selected)
        return browser.element('.textPropertyContainer input[type="text"]');
    }

    get fieldProperty_Required() {
        // REQUIRED ('Must be filled in') checkbox in the FIELD PROPERTIES panel (when a field is selected)
        return browser.element('.checkboxPropertyContainer .checkbox');
    }

    get fieldPropertiesTitle() {
        // TITLE in the FIELD PROPERTIES panel (when a field is selected)
        return browser.element('.fieldPropertiesTitle');
    }

    get fieldTokenDragging() {
        // the token which appears when dragging a field to another position
        return browser.element('.fieldTokenDragging');
    }

    get fieldTokenTitle() {
        // the label of the first NEW FIELD token
        return browser.element('.fieldTokenTitle');
    }

    get firstField() {
        // the first field (wait for it after open)
        return browser.element('.field');
    }

    get formBuilderContainer() {
        // the whole form builder page (all 3 panels)
        return browser.element('.formBuilderContainer');
    }

    get listOfElementsItemGroup() {
        // The FIRST group in the list of NEW FIELDs (left panel)
        return browser.element('.listOfElementsItemGroup');
    }

    get listOfElementsItem() {
        // The FIRST field in the list of NEW FIELDs (left panel)
        return browser.element('.listOfElementsItem');
    }

    get modalDismiss() {
        // DON'T SAVE button in the SAVE CHANGES? dlg
        return browser.element('.modal-dialog .middleButton');
    }

    get requiredCheckboxChecked() {
        // The MUST BE FILLED IN checkbox in its CHECKED state
        return browser.element('.checkboxPropertyContainer .checkbox:checked');
    }

    get requiredCheckboxNotChecked() {
        // The MUST BE FILLED IN checkbox in its UNCHECKED state
        return browser.element('.checkboxPropertyContainer .checkbox:not(:checked)');
    }

    get saveBtn() {
        // SAVE (form) button in footer bar
        return browser.element('.mainTrowserFooterButton');
    }

    get saveOrCancelFooter() {
        // footer bar (container for SAVE & CANCEL buttons)
        return browser.element('.saveOrCancelFooter');
    }

    get searchInput() {
        // SEARCH textbox in the NEW FIELDS panel
        return browser.element('.searchInput');
    }

    get selectedField() {
        // The selected field in the form builder
        return browser.element('.formElementContainer .selectedFormElement');
    }

    get success() {
        // FORM SUCCESSFULLY SAVED growl msg
        return browser.element('.notification-success');
    }

    cancel() {
        // Clicks on CANCEL in the form builder and waits for the next page to render
        this.cancelBtn.click();
        this.dirtyForm_Dismiss();
        browser.waitForExist('.leftNavLabel');
        browser.waitForText('.leftNavLabel');
        browser.pause(e2eConsts.shortWaitTimeMs);
        return this;
    }

    dirtyForm_Dismiss() {
        try { // browser's LEAVE THIS PAGE? dlg
            browser.alertDismiss();
        } catch (err) {
            browser.logger.info('no alert after CANCEL');
        }
        try { // modal SAVE CHANGES? dlg
            this.modalDismiss.click();
            if (this.modalDismiss.isExisting()) {
                browser.logger.info("first click on DON'T SAVE didn't do the trick; trying again");
                this.modalDismiss.click();
            }
        } catch (err) {
            browser.logger.info('no modal after CANCEL');
        }
        return this;
    }

    getFieldLocator(index) {
        // Returns a locator string for a specific field in the form builder
        return '.formElementContainer:nth-child(' + index + ')';
    }

    getFieldLabels() {
         // Gets the list of field labels from the form builder
        let fields = browser.elements('.field');
        try {
            return fields.value.map(function(field) {
                let label = field.element('.fieldLabel').getText();
                if (label === '') {
                    // checkbox labels are in a different child
                    label = field.element('.label').getText();
                }
                return label;
            });
        } catch (err) {
            return this.getFieldLabels();
        }
    }

    getNewFieldLabels() {
        // Gets the list of field labels from the NEW FIELD panel
        let labelEls = browser.elements('.rc-tabs-tabpane-active .listOfElementsItem');
        return labelEls.value.map(function(labelEl) {
            return labelEl.getText();
        });
    }

    getSelectedFieldLabel() {
        // Finds the parent of '.selectedFormElement' & returns its text
        return this.selectedField.element('./..').getText();
    }

    moveByName(source, target) {
        // Clicks on the specified source field label and drags it to the specified target field label
        let labels = this.getFieldLabels();
        // convert the source & target label strings to actual elements
        // add 1 to index because indexOf is zero-based whereas getFieldLocator is one-based
        source = this.getFieldLocator(labels.indexOf(source) + 1);
        target = this.getFieldLocator(labels.indexOf(target) + 1);
        return this.slowDragAndDrop(source, target);
    }

    open() {
        // Invokes the form builder from the VIEW RECORD page
        this.openMenu();
        topNavPO.modifyThisForm.click();
        this.firstField.waitForExist();
        return this;
    }

    openMenu() {
        // Clicks on the 'gear' button to invoke the SETTINGS menu
        // todo: move this (and open?) to topNavPO?
        reportContentPO.reportTitle.waitForExist();
        reportContentPO.reportTitle.waitForVisible();
        topNavPO.settingsBtn.waitForExist();
        try {
            topNavPO.settingsBtn.click();
            this.firstField.waitForExist();
        } catch (err) {
            // wait & try again to avoid 'other element would receive the click...."
            // which is presumably due to the SAVE SUCCESSFUL growl msg
            // which I understand we're not supposed to wait for due to sauce issues
            browser.pause(e2eConsts.shortWaitTimeMs);
            this.openMenu();
        }
    }

    removeField(index) {
        // Removes the specified field by clicking on its DELETE icon
        let fieldLocator = this.getFieldLocator(index);
        let field = browser.element(fieldLocator);
        let deletedFieldName = field.getText();
        let deleteIcon = field.element('.deleteFieldIcon .qbIcon');
        // hover over the field & wait for delete icon visibility
        browser.moveToObject(fieldLocator + ' .fieldLabel');
        deleteIcon.waitForVisible();
        // click to remove the field from the form
        deleteIcon.click();
        return deletedFieldName;
    }

    save() {
        // Clicks on the SAVE button in the form builder and waits for the next page to appear
        this.saveBtn.click();
        browser.waitForExist('.leftNavLabel');
        browser.waitForText('.leftNavLabel');
        return this;
    }

    search(text) {
        // Types the specified text into the SEARCH textfield (or clicks on CLEAR if text is not specified) and waits for search results
        if (text) {
            this.searchInput.setValue(text);
        } else {
            this.clearSearch.click();
        }
        // wait for groups to appear or disappear
        // depending on whether we searched or cleared
        this.listOfElementsItemGroup.waitForExist(null, (text !== null));
        browser.pause(e2eConsts.shortWaitTimeMs);
        return this.getNewFieldLabels();
    }

    selectFieldByIndex(index) {
        // Selects the field at the specified index and verifies that it is reflected in the properties panel
        let field = this.getFieldLocator(index);
        // can't click on label because another element would receive the click
        browser.moveToObject(field, 5, 5);
        browser.buttonDown();
        browser.buttonUp();
        // MC-2858: Edge: FIELD PROPERTIES doesn't render until second click to select field
        browser.buttonDown();
        browser.buttonUp();
        this.fieldProperty_Name.waitForExist(); // assume it didn't exist, i.e. nothing was previously selected
        return this.fieldProperty_Name.getText();
    }

    setViewportSize(size, resizeViewport) {
        try {
            browser.setViewportSize(size, resizeViewport);
        } catch (err) {
            // hoping to avoid "Failed: A window size operation failed because the window is not currently available"
            setViewPortSize(size, resizeViewport);
        }
    }

    slowDragAndDrop(source, target) {
        // Clicks on the specified source field and drags it to the specified target field
        let label = browser.element(source).getText();
        browser.moveToObject(source);
        browser.buttonDown();
        browser.pause(e2eConsts.shortWaitTimeMs);
        // move to target & jiggle
        browser.moveToObject(target);
        browser.moveToObject(target, 5, 5);
        // release button
        browser.buttonUp();
        // Chrome needs a click to release mouse btn - why?
        browser.element(target).click();
        // wait for the target label to reflect the swap
        browser.waitUntil(function() {
            return browser.element(target).getText() === label;
        }, e2eConsts.mediumWaitTimeMs, 'Expected target label to match source label after swap');
        return this.getFieldLabels();
    }

    KB_cancel() {
        // Types ESC multiple times to return to the VIEW RECORD form.  Assumes that a field is selected & has focus.
        // This s/b smarter/able to handle other initial states (e.g. when no field has focus)
        browser.keys([
            'Escape', // deselect field
            'Escape', // defocus field
            'Escape' // close page
        ]);
        return this.dirtyForm_Dismiss();
    }

    KB_focusField(index) {
        // focus field via keyboard
        this.KB_focusForm();
        // focus field at specified index using tab key
        for (let i = 0; i < index; i++) {
            browser.keys(['Tab']);
        }
        return this;
    }

    KB_focusForm() {
        // focus form via keyboard
        this.searchInput.click();
        browser.keys(['Tab', 'Enter']);
        return this;
    }

    KB_moveField(sourceIndex, targetIndex) {
        // move field via keyboard
        let originalOrder = this.getFieldLabels();
        this.KB_selectField(sourceIndex);
        let sourceField = this.getSelectedFieldLabel();
        browser.keys(['Shift']);
        let arrowKey = sourceIndex < targetIndex ? 'ArrowDown' : 'ArrowUp';
        let distance = Math.abs(sourceIndex - targetIndex);
        for (let i = 0; i < distance; i++) {
            browser.keys([arrowKey]); // up or down
        }
        browser.keys(['Shift']); // release modifier key
        let revisedOrder = this.getFieldLabels();
        expect(originalOrder).not.toEqual(revisedOrder);
        expect(revisedOrder[targetIndex - 1]).toEqual(sourceField);
        return revisedOrder;
    }

    KB_removeFieldViaBackspace(index) {
        // remove field via backspace key via keyboard
        let deletedField = this.KB_selectField(index);
        this.selectedField.keys(['Shift', 'Backspace', 'Shift']);
        // wait for field to disappear (tricky since other field may replace it)
        browser.pause(e2eConsts.shortWaitTimeMs);
        expect(this.getFieldLabels()).not.toContain(deletedField);
        return deletedField;
    }

    KB_removeFieldViaIcon(index) {
        // remove field via icon via keyboard
        let deletedField = this.KB_selectField(index);
        // select & press DELETE icon
        browser.keys(['Tab', 'Enter']);
        // wait for field to disappear (tricky since other field may replace it)
        browser.pause(e2eConsts.shortWaitTimeMs);
        expect(this.getFieldLabels()).not.toContain(deletedField);
        return deletedField;
    }

    KB_save(index) {
        // save form via keyboard
        //browser.keys(['Command', 's', 'Command']);
        // cmd above doesn't work on EDGE...
        // todo: figure out this problem; not reproducible manually
        this.save();
        return this;
    }

    KB_selectField(index) {
        // select the specified field via keyboard
        this.KB_focusField(index);
        browser.keys(['Enter']); // select field
        this.selectedField.waitForExist();
        return this.getSelectedFieldLabel();
    }
}
module.exports = new formBuilderPage();
