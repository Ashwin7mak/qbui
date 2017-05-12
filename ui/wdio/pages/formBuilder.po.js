'use strict';
let topNavPO = requirePO('topNav');
let oneSecond = 1000; // millis
let fiveSeconds = 5 * oneSecond;

class formBuilderPage {

    get cancelBtn() {
        // CANCEL (form) button in footer bar
        return browser.element('.cancelFormButton');
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
        return browser.element('.saveFormButton');
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
        return this;
    }

    getFieldLocator(index) {
        // Returns a locator string for a specific field in the form builder
        return '.formElementContainer:nth-child(' + index + ')';
    }

    getFieldLabels() {
         // Gets the list of field labels from the form builder
        this.waitForReady();
        this.firstField.waitForExist();
        let fields = browser.elements('.field');
        return fields.value.map(function(field) {
            let label = field.element('.fieldLabel').getText();
            if (label === '') {
                // checkbox labels are in a different child
                label = field.element('.label').getText();
            }
            return label;
        });
    }

    getNewFieldLabels() {
        // Gets the list of field labels from the NEW FIELD panel
        let labelEls = browser.elements('.listOfElementsItem');
        return labelEls.value.map(function(labelEl) {
            return labelEl.getText();
        });
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
        topNavPO.modifyThisForm.waitForExist();
        topNavPO.modifyThisForm.click();
        this.firstField.waitForExist();
        return this.getFieldLabels(); // better than pause?
    }

    openMenu() {
        // Clicks on the 'gear' button to invoke the SETTINGS menu
        // todo: move this (and open?) to topNavPO?
        topNavPO.formBuilderBtn.waitForExist();
        try {
            topNavPO.formBuilderBtn.click();
        } catch (err) {
            // wait & try again to avoid 'other element would receive the click...."
            // which is presumably due to the SAVE SUCCESSFUL growl msg
            // which I understand we're not supposed to wait for due to sauce issues
            browser.pause(oneSecond);
            this.openMenu();
        }
    }

    removeField(index) {
        // Removes the specified field by clicking on its DELETE icon
        let fieldLocator = this.getFieldLocator(index);
        let field = browser.element(fieldLocator);
        let deletedFieldName = field.getText();
        browser.moveToObject(fieldLocator + ' .fieldLabel');
        browser.pause(oneSecond);
        field.element('.deleteFieldIcon').click();
        browser.pause(oneSecond);
        return deletedFieldName;
    }

    save() {
        // Clicks on the SAVE button in the form builder and waits for the next page to appear
        this.saveBtn.click();
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
        // todo: write waitForNewLabels() (see waitForLabels) to avoid pause
        browser.pause(fiveSeconds);
        return this.getNewFieldLabels();
    }

    selectFieldByIndex(index) {
        // Selects the field at the specified index and verifies that it is reflected in the properties panel
        let field = this.getFieldLocator(index);
        // this click shouldn't be necessary, but it helps w/Edge?  todo: Reverify...
        browser.element(field).click();
        browser.moveToObject(field, 5, 5);
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
            browser.pause(oneSecond);
            setViewPortSize(size);
        }
    }

    slowDragAndDrop(source, target) {
        // Clicks on the specified source field and drags it to the specified target field
        let label = browser.element(source).getText();
        browser.moveToObject(source, 5, 5);
        browser.buttonDown();
        browser.pause(oneSecond);
        // move to target & wait until preview appears
        //this.slowDrag(target, label);
        browser.moveToObject(target);
        // release button
        browser.buttonUp();
        browser.pause(fiveSeconds);
        return this.getFieldLabels();
    }

    waitForLabels(numLabels) {
        // get the field list & wait to be sure it's not 'polluted' due to DOM still settling after other activity
        // (i.e. contains an unexpected array like ['Must be filled in', ...] after moving or adding fields)
        let newFields = this.getFieldLabels();
        while (newFields.length !== numLabels) {
            browser.logger.info('waiting for new field count (' + newFields + ') to be ' + numLabels);
            browser.pause(this.oneSecond);
            newFields = this.getFieldLabels();
        }
        return newFields;
    }

    waitForReady() {
        browser.waitUntil(function() {
            return browser.execute('return document.readyState').value === 'complete';
        }, this.fiveSeconds, 'Document not ready');
    }

    KB_cancel() {
        // Types ESC multiple times to return to the VIEW RECORD form.  Assumes that a field is selected & has focus.
        // This s/b smarter/able to handle other initial states (e.g. when no field has focus)
        browser.keys(['Escape']); // deselect field
        browser.pause(oneSecond);
        browser.keys(['Escape']); // defocus field
        browser.pause(oneSecond); // without delays, sometimes it gets stuck here (with builder focused)
        browser.keys(['Escape']); // close page
        return this;
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
        let sourceField = this.selectedField.getText();
        browser.keys(['Shift']);
        let arrowKey = sourceIndex < targetIndex ? 'ArrowDown' : 'ArrowUp';
        let distance = Math.abs(sourceIndex - targetIndex);
        for (let i = 0; i < distance; i++) {
            browser.keys([arrowKey]); // up or down
        }
        browser.keys(['Shift']); // release modifier key
        browser.pause(fiveSeconds);
        let revisedOrder = this.getFieldLabels();
        expect(originalOrder).not.toEqual(revisedOrder);
        expect(revisedOrder[targetIndex - 1]).toEqual(sourceField);
        return revisedOrder;
    }

    KB_removeFieldViaBackspace(index) {
        // remove field via backspace key via keyboard
        let deletedField = this.KB_selectField(index);
        this.selectedField.keys(['Shift', 'Backspace', 'Shift']);
        browser.pause(fiveSeconds);
        expect(this.getFieldLabels()).not.toContain(deletedField);
        return deletedField;
    }

    KB_removeFieldViaIcon(index) {
        // remove field via icon via keyboard
        let deletedField = this.KB_selectField(index);
        // select & press DELETE icon
        browser.keys(['Tab', 'Enter']);
        expect(this.getFieldLabels()).not.toContain(deletedField);
        return deletedField;
    }

    KB_save(index) {
        // save form via keyboard
        //browser.keys(['Command', 's', 'Command']);
        // cmd above doesn't work on EDGE...
        // todo: figure out this problem; not reproducible manually
        this.save();
        // wait for view record form
        browser.pause(fiveSeconds);
        return this;
    }

    KB_selectField(index) {
        // select the specified field via keyboard
        this.KB_focusField(index);
        browser.pause(oneSecond);
        browser.keys(['Enter']); // select field
        this.selectedField.waitForExist();
        return this.selectedField.getText();
    }
}
module.exports = new formBuilderPage();
