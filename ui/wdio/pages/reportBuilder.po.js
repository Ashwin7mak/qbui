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

}
module.exports = new reportBuilderPage();
