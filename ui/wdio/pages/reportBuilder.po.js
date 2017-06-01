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

    get saveButton() {
        return browser.element('.mainTrowserFooterButton');
    }

    get saveOrCancelFooter() {
        // footer bar (container for SAVE & CANCEL buttons)
        return browser.element('.saveOrCancelFooter');
    }

    get headerMenu() {
        return browser.element('.headerMenu');
    }

    get hideMenuOption() {
        return browser.element('.hideColumnText');
    }

    get saveChangesBeforeLeavingStayButton() {
        return browser.element('.leftButton');
    }

    get saveChangesBeforeLeavingDontSaveButton() {
        return browser.element('.middleButton');
    }

    get saveChangesBeforeLeavingSaveButton() {
        return browser.element('.primaryButton');
    }

    getHeaderLabels() {
        let labels = browser.elements('.gridHeaderLabel');
        return labels.value.map(label => {
            return label.getText();
        });
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

    clickSave() {
        this.saveButton.click();
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

}
module.exports = new reportBuilderPage();
