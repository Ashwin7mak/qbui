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
        centerActions: {
            get: function() {
                return browser.element('.centerActions');
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
        // methods
        delete: {
            value: function(index) {
                let field = this.findFieldByIndex(index);
                browser.element(field).element('.deleteFieldIcon').click();
                browser.pause(5000);
            }
        },
        dragonDrop: {
            // drags vert then jiggles horz to induce the preview
            // because dragAndDrop doesn't do the trick
            value: function(source, target) {
                let label = browser.element(source).getText();
                browser.moveToObject(source);
                browser.buttonDown();
                this.moveCursorTo(target, label);
                browser.buttonUp();
                browser.pause(5000);
            }
        },
        getFieldLabels: {
            value: function() {
                let label = "";
                let labels = [];
                let labelEls = browser.elements('.fieldLabel');
                labelEls.value.filter(function(labelEl) {
                    label = labelEl.getText();
                    if (label === "") { // checkbox label is deeper in DOM
                        label = labelEl.element('.label').getText();
                    }
                    return labels.push(label);
                });
                return labels;
            }
        },
        moveByName: {
            value: function(source, target) {
                let labels = this.getFieldLabels();
                source = this.findFieldByIndex(labels.indexOf(source) + 1);
                target = this.findFieldByIndex(labels.indexOf(target) + 1);
                this.dragonDrop(source, target);
            }
        },
        moveCursorTo: {
            value: function(target, label) {
                browser.waitUntil(function() {
                    // jiggle cursor on target until it updates with expected label
                    browser.c(target);
                    browser.moveToObject(target, 0, 0); // this updates the preview
                    return label === browser.element(target).getText();
                }, 5000, 'expected target preview to display source label after dragging');

            }
        },
        open: {
            value: function() {
                // wait to prevent 'element not clickable'
                topNavPO.formBuilderBtn.waitForVisible();
                // Failed: unknown error: Element <div class="dropdownToggle globalActionLink formBuilder dropdown btn-group">...</div> is not clickable at point (850, 21). Other element would receive the click: <span>...</span>
                browser.pause(5000);
                topNavPO.formBuilderBtn.click();
                topNavPO.modifyThisForm.click();
                browser.pause(5000);
                return this.formContainer.waitForVisible();
            }
        },
    });
}());
