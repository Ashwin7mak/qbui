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

    get modalDismiss() {
        // DON'T SAVE button in the SAVE CHANGES? dlg
        return browser.element('.modal-dialog .middleButton');
    }

    get fieldToken() {
        // the field token from hidden fields
        return browser.element('.fieldToken');
    }

    get headerMenu() {
        // header menu in each column header cell
        return browser.element('.headerMenu');
    }

    get hideMenuOption() {
        // hide option from header menu
        return browser.element('.hideColumnText');
    }

    get addColumnAfterMenuOption() {
        // add column after option from header menu
        return browser.element('.addColumnAfterText');
    }

    get addColumnBeforeMenuOption() {
        // add column before option from header menu
        return browser.element('.addColumnBeforeText');
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

    /**
     * Gets the header cell of a specified index.
     * @param index
     */
    getReportLocator(index) {
        // Returns a locator string for a specific column in the report builder
        return '.qbHeaderCell:nth-child(' + index + ')';
    }

    getReportContainer() {
        // Returns true if reportBuilderContainer is found on the browser. Else, it returns false
        let reportContainerIsExisting = browser.waitForExist('.reportContainer');
        return reportContainerIsExisting;
    }

    clickCancel() {
        this.cancelButton.waitForVisible();
        // Clicks on CANCEL in the report builder and waits for the next page to render
        this.cancelButton.click();
        this.dirtyForm_Dismiss();
        return this;
    }

    dirtyForm_Dismiss() {
        try { // browser's LEAVE THIS PAGE? dlg
            browser.alertDismiss();
        } catch (err) {
            browser.pause(0);
        }
        try { // modal SAVE CHANGES? dlg
            this.modalDismiss.click();
            if (this.modalDismiss.isExisting()) {
                this.modalDismiss.click();
            }
        } catch (err) {
            browser.pause(0);
        }
        return this;
    }

    clickSave() {
        this.saveButton.waitForVisible();
        // Clicks on the SAVE button in the report builder and waits for the next page to appear
        return this.saveButton.click();
    }

    clickFieldToken() {
        this.fieldToken.waitForVisible();
        return this.fieldToken.click();
    }

    clickHeaderMenu() {
        this.headerMenu.waitForVisible();
        return this.headerMenu.click();
    }

    clickHideMenuOption() {
        this.hideMenuOption.waitForVisible();
        return this.hideMenuOption.click();
    }

    clickAddColumnBeforeMenuOption() {
        this.addColumnBeforeMenuOption.waitForVisible();
        return this.addColumnBeforeMenuOption.click();
    }

    clickAddColumnAfterMenuOption() {
        this.addColumnAfterMenuOption.waitForVisible();
        return this.addColumnAfterMenuOption.click();
    }

    /**
     * Enters into builder mode.
     */
    enterBuilderMode() {
        // Invokes the report builder from the VIEW REPORT page
        reportContentPO.settingsIcon.waitForVisible();
        reportContentPO.settingsIcon.click();
        topNavPO.modifyThisForm.waitForExist(fiveSeconds);
        topNavPO.modifyThisForm.click();
        this.reportBuilderContainer.waitForVisible();
        return this;
    }

    /**
     * Checks to see if you are in report builder.
     */
    reportBuilderContainerIsExisting() {
        // Returns true if reportBuilderContainer is found on the browser. Else, it returns false
        let reportBuilderContainerIsExisting = browser.isExisting('.reportBuilderContainer');
        return reportBuilderContainerIsExisting;
    }

}
module.exports = new reportBuilderPage();
