'use strict';
let topNavPO = requirePO('topNav');
let tableCreatePO = requirePO('tableCreate');
let formsPO = requirePO('formsPage');
let modalDialog = requirePO('/common/modalDialog');
let loadingSpinner = requirePO('/common/loadingSpinner');
let notificationContainer = requirePO('/common/notificationContainer');

let tab_Field = ".rc-tabs-tabpane-active .listOfElementsItem";

class formBuilderPage {

    get activePanel() {
        // The active FIELDS panel
        return browser.element(".tabbedSideNav .rc-tabs-tabpane-active");
    }

    get cancelBtn() {
        // CANCEL (form) button in footer bar
        return browser.element('.alternativeTrowserFooterButton');
    }

    get clearSearch() {
        // CLEAR (X) button in the SEARCH (new fields) textbox (left panel)
        return browser.element('.clearSearch .searchIcon');
    }

    get emptySearchResult() {
        // the text in the fields panel when the search term returns no results
        // e.g. 'No fields matched "<searchterm>"
        return browser.element('.emptySearchResult');
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

    get fieldDragging() {
        // the highlighted field when hovering over a drop target
        return this.formElementContainer.element('.dragging');
    }

    get fieldTokenCollapsed() {
        // the token which appears when dragging a field to another position
        return browser.element('.fieldTokenCollapsed');
    }

    get fieldTokenTitle() {
        // the label of the first NEW or EXISTING field token (left panel)
        return browser.element('.rc-tabs-tabpane-active .fieldTokenTitle');
    }

    get firstField() {
        // the first FormElementContainer on the form
        return browser.element('.formElementContainer');
    }

    get firstNewFieldGroup() {
        // The FIRST group in the list of NEW FIELDs (left panel)
        return browser.element('.rc-tabs-tabpane-active .listOfElementsItemGroup');
    }

    get firstFieldToken() {
        // The FIRST field in the list of NEW or EXISTING fields (left panel)
        return browser.element(tab_Field);
    }

    get formBuilderContainer() {
        // the whole form builder page (all 3 panels)
        return browser.element('.formBuilderContainer');
    }

    get formElementContainer() {
        // the whole form builder page (all 3 panels)
        return this.formBuilderContainer.element('.formElementContainer');
    }

    get modalDismiss() {
        // The DON'T SAVE button in the SAVE CHANGES dialog
        return browser.element('.modal-dialog .middleButton');
    }

    get multiChoiceEditor() {
        // The multiline choice editor in the FIELD PROPERTIES panel
        return browser.element('.multiChoicePropertyContainer textarea');
    }

    get qbPanelHeader() {
        // a wrapper for the FORM TITLE
        return browser.element('.qbPanelHeader');
    }

    get requiredCheckbox() {
        // The MUST BE FILLED IN checkbox
        return browser.element('//div[@class="checkboxPropertyContainer"]//label[text()="Must be filled in"]/..');
    }

    get requiredCheckboxChecked() {
        // The MUST BE FILLED IN checkbox in its CHECKED state
        // this hack (separate checked/unchecked elements) was the only working solution for EDGE :-(
        return this.requiredCheckbox.element('input:checked');
    }

    get requiredCheckboxNotChecked() {
        // The MUST BE FILLED IN checkbox in its UNCHECKED state
        // this hack (separate checked/unchecked elements) was the only working solution for EDGE :-(
        return this.requiredCheckbox.element('input:not(:checked)');
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
        // SEARCH textbox in the FIELDS panel
        return browser.element('.rc-tabs-tabpane-active .searchInput');
    }

    get selectedField() {
        // The selected field in the form builder
        return browser.element('.formElementContainer .selectedFormElement');
    }

    get success() {
        // FORM SUCCESSFULLY SAVED growl msg
        return browser.element('.notification-success');
    }

    get tabbedSideNav() {
        // parent of the tabbed field lists in leftNav
        return browser.element('.tabbedSideNav div div');
    }

    get tab_Existing() {
        // The EXISTING tab in leftNav
        // ask Brandon to add a descriptive class name or id!
        return browser.element(".tabbedSideNav div div div:nth-child(3) div");
    }

    get tab_Active() {
        // The active FIELDS tab - needs a better locator
        return browser.element(".tabbedSideNav .rc-tabs-tab-active");
    }

    get tab_Bar() {
        // The EXISTING FIELDS tab - needs a better locator
        return browser.element(".tabbedSideNav div div div:nth-child(1)");
    }

    get tab_New() {
        // The NEW FIELDS tab - needs a better locator
        return browser.element(".tabbedSideNav div div div:nth-child(2) div");
    }

    get title() {
        // The name of the form, as displayed at the top of the form builder
        return browser.element('.formContainer .qbPanelHeaderTitleText');
    }

    get tooltip() {
        // The tooltip which appears when you hover over a NEW or EXISTING field in the left panel
        return browser.element('.tooltip');
    }

    get uniqueCheckbox() {
        // The MUST BE UNIQUE checkbox
        return browser.element('//div[@class="checkboxPropertyContainer"]//label[text()="Must be unique"]/..');
    }

    get uniqueCheckboxChecked() {
        // The MUST BE UNIQUE checkbox in its CHECKED state
        // this hack (separate checked/unchecked elements) was the only working solution for EDGE :-(
        return this.uniqueCheckbox.element('input:checked');
    }

    get uniqueCheckboxNotChecked() {
        // The MUST BE UNIQUE checkbox in its UNCHECKED state
        // this hack (separate checked/unchecked elements) was the only working solution for EDGE :-(
        return this.uniqueCheckbox.element('input:not(:checked)');
    }

    get toggleStageCaretDown() {
        //Stage toggle to expand
        return browser.element('.toggleStage .iconUISturdy-caret-down');
    }

    get formStageTitleFieldDropDown() {
        //Stage toggle to expand
        return browser.element('.formStage .titleField');
    }

    // methods

    addNewField(label) {
        browser.element('//div[@class="fieldTokenTitle" and text()="' + label + '"]').click();
        return loadingSpinner.waitUntilLoadingSpinnerGoesAway();
    }

    addFirstField() {
        this.firstFieldToken.click();
        return loadingSpinner.waitUntilLoadingSpinnerGoesAway();
    }

    cancel() {
        // Clicks on CANCEL in the form builder and waits for the next page to render
        this.cancelBtn.waitForVisible();
        this.cancelBtn.click();
        while (this.formBuilderContainer.isExisting()) {
            this.dirtyForm_Dismiss();
        }
        loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        return this;
    }

    dirtyForm_Dismiss() {
        try { // browser's LEAVE THIS PAGE? dlg
            browser.alertDismiss();
        } catch (err) {
            browser.pause(0);
        }
        try { // modal SAVE CHANGES dlg
            this.modalDismiss.click();
            if (this.modalDismiss.isExisting()) {
                this.modalDismiss.click();
            }
        } catch (err) {
            browser.pause(0);
        }
        loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        formsPO.viewFormContainerEl.waitForExist();
        browser.pause(e2eConsts.shortWaitTimeMs);
        return this;
    }

    dragNewFieldOntoForm(source, target) {
        // Clicks on the specified new field token and drags it to the specified target field
        let sourceLabel = source.getText();
        source.moveToObject();
        // wait a bit for the tile to be ready to be dragged
        this.tooltip.waitForVisible();
        browser.buttonDown();
        // drag to target, wait & jiggle
        target.element('.fieldLabel').moveToObject();
        browser.pause(1000);
        target.moveToObject();
        // release button
        browser.buttonUp();
        this.fieldDragging.waitForExist(null, true);
        return this.getFieldLabels();
    }

    getExistingFieldLabels() {
        // Gets the list of field labels from the EXISTING FIELD panel
        // Note: Returning an empty array here when the list DNE to facilitate more meaningful error messaging;
        // If you expect the list to be empty (i.e. the list DOES NOT exist) but it's not (i.e. the list DOES exist),
        // this lets the message include the contents of the unexpectedly present list.
        return this.firstFieldToken.isExisting() ? this.getNewFieldLabels() : [];
    }

    getFieldLocator(index) {
        // Returns a locator string for a specific field in the form builder
        return '.formElementContainer:nth-child(' + index + ')';
    }

    getFieldLabels() {
        // Gets the list of field labels from the form builder
        this.firstField.waitForVisible();
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

    getFieldToken(label) {
        // Returns the field token (left panel) with the specified label
        return browser.element('//div[@class="fieldTokenTitle" and text()="' + label + '"]');
    }

    getNewFieldLabels() {
        // Gets the list of field labels from the NEW FIELD panel
        this.firstFieldToken.waitForVisible();
        let labelEls = browser.elements(tab_Field);
        return labelEls.value.map(function(labelEl) {
            return labelEl.getText();
        });
    }

    getSelectedFieldLabel() {
        // Finds the parent of '.selectedFormElement' & returns its text
        return this.selectedField.element('./..').getText();
    }

    getRequiredCheckboxState() {
        // gets checked status of the MUST BE FILLED IN checkbox
        return this.requiredCheckboxChecked.isVisible();
    }

    getUniqueCheckboxState() {
        // gets checked status of the MUST BE FILLED IN checkbox
        return this.uniqueCheckboxChecked.isVisible();
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
        topNavPO.modifyThisForm.waitForVisible();
        topNavPO.modifyThisForm.click();
        loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        this.tab_Active.waitForVisible();
        expect(this.tab_Active.getText()).toBe("New");
        return this;
    }

    openMenu() {
        // Clicks on the 'gear' button to invoke the SETTINGS menu
        try {
            //Click settings Icon
            topNavPO.settingsBtn.waitForVisible();
            return topNavPO.settingsBtn.click();
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
        browser.pause(e2eConsts.shortWaitTimeMs);
        return deletedFieldName;
    }

    save() {
        // Clicks on the SAVE button in the form builder and waits for the next page to appear
        this.saveBtn.click();
        loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        //wait until save success container goes away
        notificationContainer.waitUntilNotificationContainerGoesAway();
        return this;
    }

    search(text) {
        // Types the specified text into the SEARCH textfield (or clicks on CLEAR if text is not specified) and waits for search results
        if (text !== null) {
            this.searchInput.setValue(text);
        } else {
            this.clearSearch.click();
        }
        // wait for groups to appear or disappear depending on whether we searched or cleared
        this.firstNewFieldGroup.waitForVisible(null, (text !== null));
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
        this.fieldProperty_Name.waitForVisible(); // assume it didn't exist, i.e. nothing was previously selected
        return this.fieldProperty_Name.getText();
    }

    setRequiredCheckboxState(state) {
        // Clicks on the MUST BE FILLED IN checkbox IF NECESSARY to make the checked state match the specified value
        if (state !== this.getRequiredCheckboxState()) {
            this.requiredCheckbox.click();
        }
        return this;
    }

    setUniqueCheckboxState(state) {
        // Clicks on the MUST BE UNIQUE checkbox IF NECESSARY to make the checked state match the specified value
        if (state !== this.getUniqueCheckboxState()) {
            this.uniqueCheckbox.click();
        }
        return this;
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

    stripAsterisk(label) {
        // strips the leading '* ' from a field label if necessary
        return label.replace('* ', '');
    }

    KB_cancel() {
        // Types ESC multiple times to return to the VIEW RECORD form.  Assumes that a field is selected & has focus.
        // This s/b smarter/able to handle other initial states (e.g. when no field has focus)
        browser.keys([
            'Escape', // deselect field
            'Escape', // defocus field
            'Escape' // close page
        ]);
        while (!formsPO.viewFormContainerEl.isExisting()) {
            this.dirtyForm_Dismiss();
        }
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

    KB_save() {
        // save form via keyboard
        if (browserName === 'MicrosoftEdge') {
            // COMMAND key w/EDGE works locally but not in sauce...?
            browser.keys(['Control', 's', 'Control']);
        } else {
            browser.keys(['Command', 's', 'Command']);
        }
        formsPO.viewFormContainerEl.waitForExist();
        loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        return this;
    }

    KB_selectField(index) {
        // select the specified field via keyboard
        this.KB_focusField(index);
        browser.keys(['Enter']); // select field
        this.selectedField.waitForExist();
        return this.getSelectedFieldLabel();
    }

    verifyFormBuilderStageTitleFieldDropDown(expectedDropDownList) {
        this.firstField.waitForVisible();
        //expand the stage
        if (this.toggleStageCaretDown.isVisible()) {
            this.toggleStageCaretDown.click();
            //wait for container to slide down
            browser.pause(e2eConsts.shortWaitTimeMs);
        }

        //Click on titleField
        this.formStageTitleFieldDropDown.click();
        //get list of fields from drop down options
        let dropDownListLabels = modalDialog.allDropDownListOptions;
        //Verify the dropDown list
        expect(expectedDropDownList).toEqual(dropDownListLabels);
        //collapse the dropdown
        return browser.element('.Select-value-label').click();
    }

}
module.exports = new formBuilderPage();
