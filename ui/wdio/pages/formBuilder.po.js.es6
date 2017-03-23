'use strict';

let topNavPO = requirePO('topNav');
let E2EPO = requirePO('e2ePageBase');

class formBuilderPage extends E2EPO {
    // page elements
    get cancelBtn() {return browser.element('.cancelFormButton');}
    get deleteFieldIcon() {return browser.element('.deleteFieldIcon');}
    get fieldLabels() {return browser.elements('.fieldLabel');}
    get fieldPreferencesIcon() {return browser.element('.fieldPreferencesIcon');}
    get fieldTokenIcon() {return browser.element('.fieldTokenIcon');}
    get fieldTokenTitle() {return browser.element('.fieldTokenTitle');}
    findFieldByIndex(index) {return '.formElementContainer:nth-child(' + index + ')';}
    get formContainer() {return browser.element('.formContainer');}
    get success() {return browser.element('.notificationSuccess');}
    get previewContainer() {return browser.element('.previewContainer');}
    get saveBtn() {return browser.element('.saveFormButton');}
    // page methods
    dragonDrop(source, target) {
        let sourceText = browser.element(source).getText();
        // drags vert then horz to induce the preview
        // because dragAndDrop doesn't do the trick
        browser.moveToObject(source);
        browser.buttonDown();
        browser.moveToObject(target);
        browser.moveToObject(target, 0, 0); // this updates the preview
        browser.buttonUp();
        browser.waitUntil(function() {
            return sourceText === browser.element(target).getText();
        }, 5000, 'expected text to be different after 5s');
    }
    getFieldLabels() {
        let labels = [];
        let fieldLabels = this.fieldLabels;
        for (let i = 0; i < fieldLabels.value.length; i++) {
            labels.push(fieldLabels.value[i].getText());
        }
        return labels;
    }
    moveByName(source, target) {
        let labels = this.getFieldLabels();
        source = this.findFieldByIndex(labels.indexOf(source));
        target = this.findFieldByIndex(labels.indexOf(target));
        this.dragonDrop(source, target);
    }
    open() { // wait to prevent 'element not clickable'
        topNavPO.formBuilderBtn.waitForVisible();
        topNavPO.formBuilderBtn.click();
        topNavPO.modifyThisForm.click();
        return this.formContainer.waitForVisible();
    }
}
