'use strict';
let topNavPO = requirePO('topNav');
let reportContentPO = requirePO('reportContent');
let oneSecond = 1000; // millis
let fiveSeconds = 5 * oneSecond;

class reportBuilderPage {

    get cancelBtn() {
        // CANCEL (report) button in footer bar
        return browser.element('.alternativeTrowserFooterButton');
    }

    get saveOrCancelFooter() {
        // footer bar (container for SAVE & CANCEL buttons)
        return browser.element('.saveOrCancelFooter');
    }
    //
    cancel() {
        // Clicks on CANCEL in the report builder and waits for the next page to render
        this.cancelBtn.click();
        browser.pause(fiveSeconds);
        return this;
    }
    get reportBuilderContainer() { 
        // the whole report builder page
        return browser.element('.reportBuilderContainer'); 
         }

    get fieldToken() {
        // the field token from hidden fields
        return browser.element('.fieldToken');
    }

    get qbGidHeaderMenu() {
        // the field token from hidden fields
        return browser.element('.headerMenu');
    }

    get addColumnBeforeText() {
        return browser.element('.addColumnBeforeText');
    }

    get addColumnAfterText() {
        return browser.element('.addColumnAfterText');
    }

    open() {
        // Invokes the report builder from the VIEW REPORT page
        reportContentPO.settingsIcon.waitForVisible();
        browser.pause(fiveSeconds);
        reportContentPO.settingsIcon.click();
        topNavPO.modifyThisForm.waitForExist(fiveSeconds);
        topNavPO.modifyThisForm.click();
        this.reportBuilderContainer.waitForVisible();
        browser.pause(fiveSeconds);
        return this;
    }
    save() {
        // Clicks on the SAVE button in the report builder and waits for the next page to appear
        this.saveBtn.click();
        browser.pause(fiveSeconds);
        return this;
    }

    addRecord() {
        // Clicks on one of the hidden fields after entering builder mode, which adds column at the first index
        this.fieldToken.click();
        browser.pause(fiveSeconds);
        return this;
    }

    headerMenu() {
        this.qbGidHeaderMenu.click();
        browser.pause(fiveSeconds);
        return this;
    }

    addColumnBefore() {
        this.addColumnBeforeText.click();
        browser.pause(fiveSeconds);
        return this;
    }

    addColumnAfter() {
        this.addColumnAfterText.click();
        browser.pause(fiveSeconds);
        return this;
    }

    getColumnLabels() {
        // Gets the list of field labels from the form builder
        let labelEls = browser.elements('.qbHeaderCell');
        return labelEls.value.map(function(labelEl) {
            let label = labelEl.element('.gridHeaderLabel').getText();
            return label;
        });
    }

}
module.exports = new reportBuilderPage();
