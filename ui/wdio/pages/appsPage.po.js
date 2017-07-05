'use strict';
let e2ePageBase = requirePO('e2ePageBase');
let loadingSpinner = requirePO('/common/loadingSpinner');
let leftNavPO = requirePO('leftNav');

class appsPage {

    get newAppButton() {
        // new app button on the left nav
        return browser.element(".leftNav .newApp .newItem");
    }

    get appNameField() {
        // app name field in modal box
        return browser.element(".modal-body .sections .dialogFieldInput");
    }

    get firstAppOnAppsList() {
        // first app on the list
        return browser.element(".appsList .link .leftNavLink .leftNavLabel");
    }

    get createAppButton() {
        // create app button on modal
        return browser.element(".modal-footer .buttons .finishedButton");
    }

    get closeAppButton() {
        // close button on the modal
        return browser.element(".modal-content .multiStepDialogRightIcons .iconUISturdy-close");
    }

    get cancelAppButton() {
        // cancel button on the modal
        return browser.element(".modal-footer .buttons .cancelButton");
    }

    get headlineOnTablesHomepage() {
        // get the headline on the tables homepage
        return browser.element('.mainContent .layout-stage .appHeadLine');
    }

    getLeftNavAppsList() {
        // list of apps in the left nav
        return browser.elements('.appsList .link .leftNavLink .leftNavLabel');
    }

    //verify cancel button works
    verifyCancelButton() {
        // wait for the newAppButton to be visible and click
        this.newAppButton.waitForVisible();
        this.newAppButton.click();
        // Verify modal-dialog box opens
        expect(browser.isVisible('.modal-open')).toBe(true);
        // wait for the cancelAppButton to be visible and click
        this.cancelAppButton.waitForVisible();
        this.cancelAppButton.click();
        loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        //Verify modal-dialog box closes
        expect(browser.isVisible('.modal-open')).toBe(false);
        return this;
    }

    //verify close button works
    verifyCloseButton() {
        // wait for the newAppButton to be visible and click
        this.newAppButton.waitForVisible();
        this.newAppButton.click();
        //Verify modal-dialog box opens
        expect(browser.isVisible('.modal-open')).toBe(true);
        // wait for the closeAppButton to be visible and click
        this.closeAppButton.waitForVisible();
        this.closeAppButton.click();
        loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        //Verify modal-dialog box closes
        expect(browser.isVisible('.modal-open')).toBe(false);
        return this;
    }

    // Create and verify new app
    createNewAppAndVerify() {
        // get the length of the appsList before creating a new app
        let appsCount = this.getLeftNavAppsList().value.length;
        // wait for the newAppButton to be visible and click
        this.newAppButton.waitForVisible();
        this.newAppButton.click();
        //Verify modal-dialog box opens
        expect(browser.isExisting('.modal-body')).toBe(true);
        // name the app
        this.appNameField.keys("Test App");
        // wait for the createAppButton to be visible and click
        this.createAppButton.waitForVisible();
        this.createAppButton.click();
        loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        // get the length of the appsList after creating a new app and expect the length to increase by 1
        leftNavPO.leftNavCaretUpEl.click();
        let newAppsCount = this.getLeftNavAppsList().value.length;
        expect(newAppsCount).toBe(appsCount + 1);
        return this;
    }

    // Verify clicking on an app opens its respective tables home page
    verifyClickingAppOpensItsTableHomepage() {
        // get the name of the first app on the list
        let appName = this.firstAppOnAppsList.getText();
        // wait till the app is visible and click
        this.firstAppOnAppsList.waitForVisible();
        this.firstAppOnAppsList.click();
        loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        // verify it lands on its respective tables homepage
        expect(this.headlineOnTablesHomepage.getText()).toBe('Welcome to ' + appName);
        return this;
    }
}
module.exports = new appsPage();
