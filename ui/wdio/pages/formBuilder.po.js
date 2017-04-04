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
        dragJiggleAndDrop: {
            // drags vert then jiggles horz to induce the preview
            // because dragAndDrop doesn't do the trick
            value: function(source, target) {
                let label = browser.element(source).getText();
                browser.moveToObject(source);
                browser.buttonDown();
                // jiggle on target until preview appears
                this.jiggleCursor(target, label);
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
                this.dragJiggleAndDrop(source, target);
            }
        },
        jiggleCursor: {
            value: function(target, label) {
                browser.waitUntil(function() {
                    // jiggle cursor on target until it updates with expected label
                    browser.moveToObject(target);
                    browser.moveToObject(target, 0, 0);
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
    });
}());
