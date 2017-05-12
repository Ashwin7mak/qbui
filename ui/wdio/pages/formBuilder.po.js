'use strict';
let topNavPO = requirePO('topNav');
let oneSecond = 1000; // millis
let fiveSeconds = 5 * oneSecond;

class formBuilderPage {

    get cancelBtn() {
        // CANCEL (form) button in footer bar
        return browser.element('.mainTrowserFooterButton');
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
        return browser.element('.selectedFormElement');
    }
    get success() {
        // FORM SUCCESSFULLY SAVED growl msg
        return browser.element('.notification-success');
    }

    getFieldLocator(index) {
        // Returns a locator string for a specific field in the form builder
        return '.formElementContainer:nth-child(' + index + ')';
    }
    cancel() {
        // Clicks on CANCEL in the form builder and waits for the next page to render
        this.cancelBtn.click();
        // do we have a method to wait for spinner?
        browser.pause(fiveSeconds);
        return this;
    }
    removeField(index) {
        // Removes a specific field in the form builder by clicking on its DELETE icon
        let field = browser.element(this.getFieldLocator(index));
        field.element('.deleteFieldIcon').click();
        field.waitForExist(fiveSeconds, false);
        browser.pause(fiveSeconds);
        return this;
    }
    getFieldLabels() {
        // Gets the list of field labels from the form builder
        let labelEls = browser.elements('.field');
        return labelEls.value.map(function(labelEl) {
            let label = labelEl.element('.fieldLabel').getText();
            if (label === '') { // checkbox labels are in a child
                label = labelEl.element('.label').getText();
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
        // Clicks on the field with the specified (source) label and drags it to the field with the specified (target) label
        let labels = this.getFieldLabels();
        // convert the source & target label strings to actual elements
        // add 1 to index because indexOf is zero-based whereas getFieldLocator is one-based
        source = this.getFieldLocator(labels.indexOf(source) + 1);
        target = this.getFieldLocator(labels.indexOf(target) + 1);
        this.slowDragAndDrop(source, target);
        return this;
    }
    open() {
        // Invokes the form builder from the VIEW RECORD page
        topNavPO.settingsButton.waitForVisible();
        browser.pause(fiveSeconds);
        topNavPO.settingsButton.click();
        topNavPO.modifyThisForm.waitForExist(fiveSeconds);
        topNavPO.modifyThisForm.click();
        this.formBuilderContainer.waitForVisible();
        browser.pause(fiveSeconds);
        return this;
    }
    save() {
        // Clicks on the SAVE button in the form builder and waits for the next page to appear
        this.saveBtn.click();
        // wait for spinner?
        browser.pause(fiveSeconds);
        return this;
    }
    search(text) {
        // Types the specified text into the SEARCH textfield (or clicks on CLEAR if text is not specified) and waits for search results
        let oldResults = this.getNewFieldLabels();
        let newResults = oldResults;
        if (text) {
            this.searchInput.setValue(text);
        } else {
            this.clearSearch.click();
        }
        // wait for the results to change
        while (JSON.stringify(oldResults) === JSON.stringify(newResults)) {
            newResults = this.getNewFieldLabels();
            browser.pause(oneSecond);
        }
        return newResults;
    }
    selectFieldByIndex(index) {
        // Selects the field at the specified index and verifies that it is reflected in the properties panel
        // Clicks in the upper left corner because clicking in the middle might hit the textfield or other control
        // & not select the field
        browser.moveToObject(this.getFieldLocator(index) + ' .draggableField', 1, 1).buttonDown().buttonUp();
        this.fieldProperty_Name.waitForExist();
        return this.fieldProperty_Name.getText();
    }
    slowDrag(target, label) {
        // Moves the cursor to specified target field and waits until target displays the the specified label
        browser.waitUntil(function() {
            // assuming that browser.buttonDown was just executed by the caller,
            // pause to initiate drag (which is one reason why we can't just call dragAndDrop)
            browser.pause(oneSecond);
            browser.moveToObject(target);
            return label === browser.element(target).getText();
        }, 10000, 'expected target preview to display source label after dragging');
        return this;
    }
    slowDragAndDrop(source, target) {
        // Clicks on the specified source field and drags it to the specified target field
        let label = browser.element(source).getText();
        browser.moveToObject(source);
        browser.buttonDown();
        // move to target & wait until preview appears
        this.slowDrag(target, label);
        // release button
        browser.buttonUp();
        // pause to terminate drag (which is one reason why we can't just call dragAndDrop)
        browser.pause(fiveSeconds);
        return this;
    }

    KB_cancel() {
        // Types ESC multiple times to return to the VIEW RECORD form.  Assumes that a field is selected & has focus.
        // This s/b smarter/able to handle other initial states (e.g. when no field has focus)
        browser.keys([
            'Escape', // deselect field
            'Escape', // defocus field
            'Escape']); // close page
        // wait for view record form
        browser.pause(fiveSeconds);
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
        // assumes that the page has just been invoked & nothing has focus
        browser.keys([
            'Tab', // hamburger
            'Tab', // User
            'Tab', // Filter
            'Tab', // formSection
            'Enter']); // redirect input to form/fields
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
    KB_removeFieldViaIcon(index) {
        // remove field via icon via keyboard
        this.KB_selectField(index);
        let deletedField = this.selectedField.getText();
        browser.keys(['Tab', 'Enter']); // select & press DELETE icon
        browser.pause(fiveSeconds);
        expect(this.getFieldLabels()).not.toContain(deletedField);
        return deletedField;
    }
    KB_removeFieldViaBackspace(index) {
        // remove field via backspace key via keyboard
        this.KB_selectField(index); // field doesn't need to be selected
        let deletedField = this.selectedField.getText();
        this.selectedField.keys(['Shift', 'Backspace', 'Shift']);
        browser.pause(fiveSeconds);
        expect(this.getFieldLabels()).not.toContain(deletedField);
        return deletedField;
    }
    KB_save(index) {
        // save form via keyboard
        browser.keys(['Command', 's', 'Command']);
        // wait for view record form
        browser.pause(fiveSeconds);
        return this;
    }
    KB_selectField(index) {
        // select field via keyboard
        this.KB_focusField(index);
        browser.keys(['Enter']); // select field
        browser.pause(fiveSeconds);
        return this.selectedField.getText();
    }
}
module.exports = new formBuilderPage();
