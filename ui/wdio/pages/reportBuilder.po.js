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

    clickCancel() {
        // Clicks on CANCEL in the report builder and waits for the next page to render
        this.cancelButton.click();
        browser.pause(fiveSeconds);
        this.dirtyForm_Dismiss();
        browser.pause(fiveSeconds);
        return this;
    }

    get fieldToken() {
        // the field token from hidden fields
        return browser.element('.fieldToken');
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
        // Clicks on the SAVE button in the report builder and waits for the next page to appear
        this.saveButton.click();
        browser.pause(fiveSeconds);
        return this;
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

    addColumnFromFieldsList() {
        // Clicks on one of the hidden fields after entering builder mode
        this.fieldToken.click();
        browser.pause(fiveSeconds);
        return this;
    }

    headerMenuClick() {
        this.qbGidHeaderMenu.click();
        browser.pause(fiveSeconds);
        return this;
    }

    addColumnBeforeClick() {
        this.addColumnBeforeText.click();
        browser.pause(fiveSeconds);
        return this;
    }

    addColumnAfterClick() {
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

    reportBuilderContainerIsExisting() {
        // Returns true if reportBuilderContainer is found on the browser. Else, it returns false
        let reportBuilderContainerIsExisting = browser.isExisting('.reportBuilderContainer');
        browser.pause(fiveSeconds);
        return reportBuilderContainerIsExisting;
    }
}
module.exports = new reportBuilderPage();
