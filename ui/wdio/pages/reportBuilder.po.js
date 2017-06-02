'use strict';
let topNavPO = requirePO('topNav');
let reportContentPO = requirePO('reportContent');
let oneSecond = 1000; // millis
let fiveSeconds = 5 * oneSecond;

class reportBuilderPage {

    get cancelButton() {
        // CANCEL (report) button in footer bar
        return browser.element('.alternativeTrowserFooterButton');
    }

    get saveButton() {
        // SAVE (report) button in footer bar
        return browser.element('.mainTrowserFooterButton');
    }

    get saveOrCancelFooter() {
        // footer bar (container for SAVE & CANCEL buttons)
        return browser.element('.saveOrCancelFooter');
    }

    get reportBuilderContainer() {
        // the whole report builder page
        return browser.element('.reportBuilderContainer');
    }

    get saveChangesBeforeLeavingStayButton() {
        // STAY option in the Save Changes Before Leaving modal
        return browser.element('.leftButton');
    }

    get saveChangesBeforeLeavingDontSaveButton() {
        // CANCEL option in the Save Changes Before Leaving modal
        return browser.element('.middleButton');
    }

    get saveChangesBeforeLeavingSaveButton() {
        // SAVE option in the Save Changes Before Leaving modal
        return browser.element('.primaryButton');
    }
    clickCancel() {
        // Clicks on CANCEL in the report builder and waits for the next page to render
        this.cancelButton.click();
        browser.pause(fiveSeconds);
        return this;
    }

    clickSave() {
        // Clicks on the SAVE button in the report builder and waits for the next page to appear
        this.saveButton.click();
        browser.pause(fiveSeconds);
        return this;
    }

    enterBuilderMode() {
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

    getColumnLabels() {
        // Gets the list of column labels from the report builder
        let labelEls = browser.elements('.qbHeaderCell');
        return labelEls.value.map(function(labelEl) {
            let label = labelEl.element('.gridHeaderLabel').getText();
            return label;
        });
    }

    getReportLocator(index) {
        // Returns a locator string for a specific column in the report builder
        return '.qbHeaderCell:nth-child(' + index + ')';
    }

    reportBuilderContainerIsExisting() {
        // Returns true if reportBuilderContainer is found on the browser. Else, it returns false
        let reportBuilderContainerIsExisting = browser.isExisting('.reportBuilderContainer');
        browser.pause(fiveSeconds);
        return reportBuilderContainerIsExisting;
    }
    clickSaveChangesBeforeLeavingStayButton() {
        this.saveChangesBeforeLeavingStayButton.click();
        browser.pause(fiveSeconds);
        return this;
    }

    clickSaveChangesBeforeLeavingDontSaveButton() {
        this.saveChangesBeforeLeavingDontSaveButton.click();
        browser.pause(fiveSeconds);
        return this;
    }

    clickSaveChangesBeforeLeavingSaveButton() {
        this.saveChangesBeforeLeavingSaveButton.click();
        browser.pause(fiveSeconds);
        return this;
    }


}
module.exports = new reportBuilderPage();
