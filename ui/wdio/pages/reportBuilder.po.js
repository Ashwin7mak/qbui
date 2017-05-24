'use strict';
let topNavPO = requirePO('topNav');
let reportContentPO = requirePO('reportContent');
let oneSecond = 1000; // millis
let fiveSeconds = 5 * oneSecond;

class reportBuilderPage {

    get cancelBtn() {
        // CANCEL (form) button in footer bar
        return browser.element('.alternativeTrowserFooterButton');
    }

    get saveBtn() {
        // SAVE (form) button in footer bar
        return browser.element('.mainTrowserFooterButton');
    }
    get saveOrCancelFooter() {
        // footer bar (container for SAVE & CANCEL buttons)
        return browser.element('.saveOrCancelFooter');
    }
    //
    cancel() {
        // Clicks on CANCEL in the form builder and waits for the next page to render
        this.cancelBtn.click();
        // do we have a method to wait for spinner?
        browser.pause(fiveSeconds);
        return this;
    }
    get reportBuilderContainer() { 
        // the whole form builder page (all 3 panels) 
        return browser.element('.reportBuilderContainer'); 
         }

    open() {
        // Invokes the form builder from the VIEW RECORD page
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
        // Clicks on the SAVE button in the form builder and waits for the next page to appear
        this.saveBtn.click();
        // wait for spinner?
        browser.pause(fiveSeconds);
        return this;
    }

}
module.exports = new reportBuilderPage();
