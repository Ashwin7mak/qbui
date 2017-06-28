'use strict';

class legacyQuickbase {

    get buttonQBUniversitybDone() {
        //* Done button on Quick Base University popup
        browser.element('.walkme-action-done.walkme-click-and-hover').waitForVisible();
        return browser.element('.walkme-action-done.walkme-click-and-hover');
    }

    get linkManageMyBillingAccount() {
        //* Manage my billing account link in Account Admin frame
        browser.element('#manageMyBillingAccount').waitForVisible();
        return browser.element('#manageMyBillingAccount');
    }

    get linkManageAllUsersInAcctAdmin() {
        //* Manage all users link in Account Admin frame
        browser.element('.SideBarLink[id="manageUsersSidebar"] a[id="manageUsers"]').waitForVisible();
        return browser.element('.SideBarLink[id="manageUsersSidebar"] a[id="manageUsers"]');
    }

    get linkManageAllUsersInMBASummary() {
        //* Manage all users link in Manage Billing Account Summary tab, id should be added for this link
        browser.element('.mid a[id="manageAllUsersLink"]').waitForVisible();
        return browser.element('.mid a[id="manageAllUsersLink"]');
    }

    /**
     * Wait for legacy Quick Base page to fully load
     */
    waitForPageToFullyLoad(){
        this.buttonQBUniversitybDone.waitForVisible();
    }

    /**
     * Dismiss the Quick Base University popup
     */
    dismissQBUniversityPopup(){
        this.buttonQBUniversitybDone.click();
    }

    /**
     * Get page title
     */
    getPageTitle() {
        var title = browser.getTitle();
        console.log("==> Quickbase home page title is: " + title);
        return title
    }

    /**
     * Click the Manage billing account link in the AccountAdmin frame
     */
    clickManageBillingAccountLinkInAcctAdmin() {
        this.linkManageMyBillingAccount.click();
    }

    /**
     * Click the Manage all users link in the AccountAdmin frame
     */
    clickManageAllUsersLinkInAcctAdmin() {
        this.linkManageAllUsersInAcctAdmin.click();
    }

    /**
     * Click the Manage all users link in the Manage Billing Account Summary tab
     */
    clickManageAllUsersLinkInMBASummaryTab() {
        this.inkManageAllUsersInMBASummary.click();
    }

}
module.exports = new legacyQuickbase();
