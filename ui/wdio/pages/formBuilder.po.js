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
        fieldLabels: {
            get: function() {
                return browser.elements('.fieldLabel');
            }
        },
        fieldLocator: {
            value: function(index) {
                return '.sectionRow:nth-child(' + index + ')';
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
        formContainer: {
            get: function() {
                return browser.element('.formContainer');
            }
        },
        open: {
            value: function() {
                topNavPO.formBuilderBtn.waitForVisible(); // prevent 'element not clickable'
                topNavPO.formBuilderBtn.click();
                topNavPO.modifyThisForm.click();
                return this.formContainer.waitForVisible();
            }
        },
        getFieldLabels: {
            value: function() {
                let labels = [];
                for (let i = 0; i < this.fieldLabels.value.length; i++) {
                    labels.push(this.fieldLabels.value[i].getText());
                }
                return labels;
            }
        },
        moveByName: {
            value: function(source, target) {
                let labels = this.getFieldLabels();
                source = this.fieldLocator(labels.indexOf(source));
                target = this.fieldLocator(labels.indexOf(target));
                browser.dragAndDrop(source, target);
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
