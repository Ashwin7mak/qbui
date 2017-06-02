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

    get headerMenu() {
        // header menu in each column header cell
        return browser.element('.headerMenu');
    }

    get hideMenuOption() {
        // hide option from header menu
        return browser.element('.hideColumnText');
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

    /**
     * Enters into builder mode.
     */
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

    /**
     * Checks to see if you are in report builder.
     */
    reportBuilderContainerIsExisting() {
        // Returns true if reportBuilderContainer is found on the browser. Else, it returns false
        let reportBuilderContainerIsExisting = browser.isExisting('.reportBuilderContainer');
        browser.pause(fiveSeconds);
        return reportBuilderContainerIsExisting;
    }

    /**
     * Returns a list of header names for a report.
     */
    getHeaderLabels() {
        let labels = browser.elements('.gridHeaderLabel');
        return labels.value.map(label => {
            return label.getText();
        });
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

    clickHeaderMenu() {
        this.headerMenu.click();
        browser.pause(fiveSeconds);
        return this;
    }

    clickHideMenuOption() {
        this.hideMenuOption.click();
        browser.pause(fiveSeconds);
        return this;
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
