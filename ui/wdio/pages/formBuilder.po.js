(function() {
    'use strict';

    let topNavPO = requirePO('topNav');
    module.exports = Object.create(e2ePageBase, {
        // elements
        cancelBtn: {
            get: function() {
                return browser.element('.cancelFormButton');
            }
        },
        centerActionsOnFooter: {
            get: function() {
                return browser.element('.saveOrCancelFooter .centerActions');
            }
        },
        deleteFieldIcon: {
            get: function() {
                return browser.element('.deleteFieldIcon');
            }
        },
        fieldPreferencesIcon: {
            get: function() {
                return browser.element('.fieldPreferencesIcon');
            }
        },
        fieldTokenIcon: {
            get: function() {
                return browser.element('.fieldTokenIcon');
            }
        },
        fieldTokenTitle: {
            get: function() {
                return browser.element('.fieldTokenTitle');
            }
        },
        findFieldByIndex: { // doesn't actually FIND anything...
            value: function(index) {
                return '.formElementContainer:nth-child(' + index + ')';
            }
        },
        formBuilderContainer: {
            get: function() {
                return browser.element('.formBuilderContainer');
            }
        },
        formContainer: {
            get: function() {
                return browser.element('.formContainer');
            }
        },
        previewContainer: {
            get: function() {
                return browser.element('.previewContainer');
            }
        },
        saveBtn: {
            get: function() {
                return browser.element('.saveFormButton');
            }
        },
        selectedField: {
            get: function() {
                return browser.element('.selectedFormElement');
            }
        },
        success: {
            get: function() {
                return browser.element('.notification-success');
            }
        },
        // methods
        delete: {
            value: function(index) {
                let field = this.findFieldByIndex(index);
                browser.element(field).element('.deleteFieldIcon').click();
                browser.pause(5000);
            }
        },
        slowDragAndDrop: {
            // pauses after clicking on source because dragAndDrop fails
            value: function(source, target) {
                let label = browser.element(source).getText();
                browser.moveToObject(source);
                browser.buttonDown();
                // jiggle on target until preview appears
                this.slowDrag(target, label);
                browser.buttonUp();
                browser.pause(5000);
            }
        },
        getFieldLabels: {
            value: function() {
                let labelEls = browser.elements('.fieldLabel');

                return labelEls.value.map(function(labelEl) {
                    let label = labelEl.getText();
                    if (label === '') { // checkbox label is deeper in DOM
                        label = labelEl.element('.label').getText();
                    }
                    return label;
                });
            }
        },
        moveByName: {
            value: function(source, target) {
                let labels = this.getFieldLabels();
                // add 1 to index because indexOf is zero-based
                // whereas findFieldByIndex is one-based
                source = this.findFieldByIndex(labels.indexOf(source) + 1);
                target = this.findFieldByIndex(labels.indexOf(target) + 1);
                this.slowDragAndDrop(source, target);
            }
        },
        slowDrag: { // apologies to Scott Joplin
            value: function(target, label) {
                browser.waitUntil(function() {
                    // pause (after caller just pressed keyDown), then move
                    // cursor to target and wait until it updates with expected label
                    browser.pause(1000);
                    browser.moveToObject(target);
                    return label === browser.element(target).getText();
                }, 5000, 'expected target preview to display source label after dragging');
            }
        },
        open: {
            value: function() {
                // wait to prevent 'element not clickable'
                topNavPO.formBuilderBtn.waitForVisible();
                // wait a bit longer to avoid 'Element not clickable' error
                browser.pause(5000);
                topNavPO.formBuilderBtn.click();
                topNavPO.modifyThisForm.click();
                browser.pause(5000);
                return this.formContainer.waitForVisible();
            }
        },
        KB_focusField: {
            value: function(index) {
                this.KB_focusForm();
                // focus field at specified index using tab key
                for (let i = 0; i < index; i++) {
                    browser.keys(['Tab']);
                }
            }
        },
        KB_focusForm: {
            value: function() {
                // assumes that the page has just been invoked & nothing has focus
                return browser.keys([
                    'Tab', // hamburger
                    'Tab', // User
                    'Tab', // Filter
                    'Tab', // formSection
                    'Enter']); // redirect input to form/fields
            }
        },
        KB_moveField: {
            value: function(source, target) {
                let originalOrder = this.getFieldLabels();
                this.KB_selectField(source);
                let sourceField = this.selectedField.getText();
                browser.keys(['Shift']);
                let arrowKey = source < target ? 'ArrowDown' : 'ArrowUp';
                let distance = Math.abs(source - target);
                for (let i = 0; i < distance; i++) {
                    browser.keys([arrowKey]); // up or down
                }
                browser.keys(['Shift']); // release modifier key
                browser.pause(5000);
                let revisedOrder = this.getFieldLabels();
                expect(originalOrder).not.toEqual(revisedOrder);
                expect(revisedOrder[target - 1]).toEqual(sourceField);
                return revisedOrder;
            }
        },
        KB_removeFieldViaIcon: {
            value: function(index) {
                this.KB_selectField(index);
                let deletedField = this.selectedField.getText();
                browser.keys(['Tab', 'Enter']); // select & press DELETE icon
                browser.pause(5000);
                expect(this.getFieldLabels()).not.toContain(deletedField);
                return deletedField;
            }
        },
        KB_removeFieldViaBackspaceKey: {
            value: function(index) {
                this.KB_selectField(index); // field doesn't need to be selected
                let deletedField = this.selectedField.getText();
                this.selectedField.keys(['Backspace']); // press DELETE key
                browser.pause(5000);
                expect(this.getFieldLabels()).not.toContain(deletedField);
                return deletedField;
            }
        },
        KB_selectField: {
            value: function(index) {
                this.KB_focusField(index);
                browser.keys(['Enter']); // select field
                browser.pause(5000);
                return this.selectedField.getText();
            }
        },
    });
}());
