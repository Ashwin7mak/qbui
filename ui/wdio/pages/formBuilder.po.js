(function() {
    'use strict';

    let topNavPO = requirePO('topNav');

    module.exports = Object.create(e2ePageBase, {
        // should everything here be sorted alphabetically, or logically instead?
        cancelBtn: {
            get: function() {
                return browser.element('.cancelFormButton');
            }
        },
        deleteFieldIcon: {
            get: function() {
                return browser.element('.deleteFieldIcon');
            }
        },
        dragonDrop: {
            // drags vert then horz to induce the preview
            // because dragAndDrop doesn't do the trick
            value: function(source, target) {
                let sourceText = browser.element(source).getText();
                browser.moveToObject(source);
                browser.buttonDown();
                browser.moveToObject(target);
                browser.moveToObject(target, 0, 0); // this updates the preview
                browser.buttonUp();
                browser.waitUntil(function() {
                    return sourceText === browser.element(target).getText();
                }, 5000, 'expected text to be different after 5s');
            }
        },
        fieldLabels: {
            get: function() {
                return browser.elements('.fieldLabel');
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
        getFieldLabels: {
            value: function() {
                let labels = [];
                let fieldLabels = this.fieldLabels;
                for (let i = 0; i < fieldLabels.value.length; i++) {
                    labels.push(fieldLabels.value[i].getText());
                }
                return labels;
            }
        },
        moveByName: {
            value: function(source, target) {
                let labels = this.getFieldLabels();
                source = this.findFieldByIndex(labels.indexOf(source));
                target = this.findFieldByIndex(labels.indexOf(target));
                this.dragonDrop(source, target);
            }
        },
        open: {
            value: function() {
                // wait to prevent 'element not clickable'
                topNavPO.formBuilderBtn.waitForVisible();
                topNavPO.formBuilderBtn.click();
                topNavPO.modifyThisForm.click();
                return this.formContainer.waitForVisible();
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
    });
}());
