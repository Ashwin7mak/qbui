/**
 * This file uses the Page Object pattern to define the User Management page object for tests
 *
 */
(function() {
    'use strict';
    // Import the base page object
    let e2ePageBase = requirePO('./e2ePageBase');
    let modalDialog = requirePO('/common/modalDialog');
    let UsersTablePage = Object.create(e2ePageBase, {


        // List of all field column headers
        userHeaderElList: {get: function() {return browser.elements('.userManagementReport .qbGrid .qbHeader .qbHeaderCell');}},

        // App Role Name
        appRolesPodName: {get: function() {return browser.elements('.appRolesPod .appRolesPodName');}},

        // App Role Count
        appRolesPodCount: {get: function() {return browser.elements('.appRolesPod .appRolesPodCount');}},

        // Add new user button
        newUserBtn: {get: function() {return browser.element('.iconActionButton.addRecord');}},

        // Add new user clear searchbox entry
        userAddSearchBoxClear: {get: function() {return browser.element('.Select-clear');}},

        // User Stage
        userStageContainerEl: {get: function() {return browser.element('.layout-stage');}},
        userStageBtn: {get: function() {return browser.element('.toggleStage');}},
        userStageArea: {get: function() {return browser.element('.collapsedContent');}},
        userStageContentEl: {get: function() {return browser.element('.stage-showHide-content');}},
        userStageContent: {get: function() {return browser.element('.appUsersManagementContent');}},

        // Send invite email button
        userSendInviteEmail: {get: function() {return browser.element('.disabled.qbIcon.iconUISturdy-mail');}},

        // Export users button
        userExportCSV: {get: function() {return browser.element('.disabled.qbIcon.iconUISturdy-download-cloud');}},

        // Change user role settings
        userChangeRole : {get: function() {return browser.element('.disabled.qbIcon.iconUISturdy-settings');}},

        // Remove user button on user report
        userRemoveIcon: {get: function() {return browser.element('.qbIcon.iconUISturdy-errorincircle-fill');}},

        // User action icon elements
        userActionsListUlEl: {get: function() {return browser.element('.reportActionsBlock .actionIcons');}},

        // User action icons element link
        userActionsListEl: {get: function() {return this.userActionsListUlEl.elements('.iconLink');}},

        // User email elements
        userEmailUlEl: {get: function() {return browser.element('.qbCell .urlField');}},

        // User email field in user table
        userEmailLink: {get: function() {return browser.element('.qbCell.urlField .link');}},

        /**
         * Function to click on user Remove Icon
         */
        clickUserRemoveIcon: {
            value: function() {
                //wait for user remove icon
                this.userRemoveIcon.waitForVisible();
                //click on the user remove icon
                return this.userRemoveIcon.click();
            }
        },

        /**
         * Function to click on user Stage
         */
        clickUserStage: {
            value: function() {
                //wait for user stage
                this.userStageBtn.waitForVisible();
                //click on the user stage
                return this.userStageBtn.click();
            }
        },

        /**
         * Helper function that will get all of the field column headers from the user management report. Returns an array of strings.
         */
        getUserColumnHeaders: {value: function() {
            var colHeaders = [];
            for (var i = 1; i < this.userHeaderElList.value.length; i++) {colHeaders.push(this.userHeaderElList.value[i].getAttribute('innerText'));}
            return colHeaders;
        }},

        /**
         * Helper function to add user and role to app
         */
        addUserToApp: {value: function(user) {

            // Click on add a new user button
            UsersTablePage.newUserBtn.click();
            // Search for known user
            modalDialog.selectUser(user);
            // Select user
            modalDialog.modalDialogUserAddSearchMenu.click();
            // Need some time for Add user button switch from disabled to active
            browser.pause(e2eConsts.shortWaitTimeMs);
            // Click add user
            modalDialog.clickOnModalDialogBtn(modalDialog.ADD_USER_BTN);
            browser.pause(e2eConsts.shortWaitTimeMs);
            // Click Copy link to Share with User
            expect(modalDialog.modalDialogCopyBtn.isExisting()).toBe(true);
            // Click Email to Share with User
            expect(modalDialog.modalDialogMailBtn.isExisting()).toBe(true);
            expect(modalDialog.modalDialogTitle).toContain("Your app has");
            // Click to close the Share with User modal
            modalDialog.modalDialogCloseBtn.click();
        }},
        /**
         * Helper function to add user and role to app
         */
        addUserAndRoleToApp: {value: function(user, role) {

            // Click on add a new user button
            UsersTablePage.newUserBtn.click();
            // Search for user
            modalDialog.selectUser(user);
            // Select user
            modalDialog.modalDialogUserAddSearchMenu.click();
            // Select role
            modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogRoleSelectorDropDownArrow, role);
            // Need some time for Add user button switch from disabled to active
            browser.pause(e2eConsts.shortWaitTimeMs);
            // Click add user
            modalDialog.clickOnModalDialogBtn(modalDialog.ADD_USER_BTN);
            browser.pause(e2eConsts.shortWaitTimeMs);
            // Click Copy link to Share with User
            expect(modalDialog.modalDialogCopyBtn.isExisting()).toBe(true);
            // Click Email to Share with User
            expect(modalDialog.modalDialogMailBtn.isExisting()).toBe(true);
            expect(modalDialog.modalDialogTitle).toContain("Your app has");
            // Click No Thanks to Share with User
            modalDialog.clickOnModalDialogBtn(modalDialog.NO_THANKS_BTN);
        }},

    });
    module.exports = UsersTablePage;
}());
