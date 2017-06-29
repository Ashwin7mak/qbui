'use strict';

/**
 * This file uses the Page Object pattern to define legacy QB page for test
 */

class legacyQuickbase {

    get buttonQBUniversitybDone() {
        //* Done button on Quick Base University popup
        return browser.element('.walkme-action-done.walkme-click-and-hover');
    }

    get linkManageMyBillingAccount() {
        //* Manage my billing account link in Account Admin frame
        return browser.element('#manageMyBillingAccount');
    }

    get linkManageAllUsersInAcctAdmin() {
        //* Manage all users link in Account Admin frame
        return browser.element('.SideBarLink[id="manageUsersSidebar"] a[id="manageUsers"]');
    }

    get linkManageAllUsersInMBASummary() {
        //* Manage all users link in Manage Billing Account Summary tab, id should be added for this link
        return browser.element('.mid a[id="manageAllUsersLink"]');
    }

    /**
     * Wait for legacy Quick Base page to fully load
     */
    waitForPageToFullyLoad() {
        this.buttonQBUniversitybDone.waitForVisible();
        return this;
    }

    /**
     * Dismiss the Quick Base University popup
     */
    dismissQBUniversityPopup(){
        this.buttonQBUniversitybDone.waitForVisible();
        return this.buttonQBUniversitybDone.click();
    }

    /**
     * Get page title
     */
    getPageTitle() {
        return browser.getTitle();
    }

    /**
     * Click the Manage billing account link in the AccountAdmin frame
     */
    clickManageBillingAccountLinkInAcctAdmin() {
        this.linkManageMyBillingAccount.waitForVisible();
        return this.linkManageMyBillingAccount.click();
    }

    /**
     * Click the Manage all users link in the AccountAdmin frame
     */
    clickManageAllUsersLinkInAcctAdmin() {
        this.linkManageAllUsersInAcctAdmin.waitForVisible();
        return this.linkManageAllUsersInAcctAdmin.click();
    }

    /**
     * Click the Manage all users link in the Manage Billing Account Summary tab
     */
    clickManageAllUsersLinkInMBASummaryTab() {
        this.linkManageAllUsersInMBASummary.waitForVisible();
        return this.inkManageAllUsersInMBASummary.click();
    }

}
module.exports = new legacyQuickbase();
