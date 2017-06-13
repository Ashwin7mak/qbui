/**
 * This file uses the Page Object pattern to define the User Management page object for tests
 *
 */
(function() {
    'use strict';
    // Import the base page object
    let e2ePageBase = requirePO('./e2ePageBase');
    let formsPO = requirePO('formsPage');


    let UsersTablePage = Object.create(e2ePageBase, {


        // List of all field column headers
        userHeaderElList: {get: function() {return browser.elements('.userManagementReport .qbGrid .qbHeader .qbHeaderCell');}},

        // App Role Name
        appRolesPodName: {get: function() {return browser.elements('.appRolesPod .appRolesPodName');}},

        // App Role Count
        appRolesPodCount: {get: function() {return browser.elements('.appRolesPod .appRolesPodCount');}},

        // Add new user button
        newUserBtn: {get: function() {return browser.element('.iconActionButton.addRecord');}},

        // Add user button
        addUserBtn: {get: function() {return browser.element('.buttons .finishedButton.btn.btn-primary');}},

        // Search for a new user search container
        searchNewUser: {get: function() {return browser.element('.modal-dialog .Select-multi-value-wrapper');}},

        // Select user role container
        userRoleSelection: {get: function() {return browser.element('.assignRole .Select-arrow-zone');}},

        // Select user option
        userSelectSearch: {get: function() {return browser.element('.Select-input .Select-value-label span');}},

        // Add new user menu
        userAddSearcMenu: {get: function() {return browser.element('.modal-dialog .Select-menu-outer');}},


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
         * Helper function that will get all of the field column headers from the user management report. Returns an array of strings.
         */
        getUserColumnHeaders: {value: function() {
            var colHeaders = [];
            for (var i = 1; i < this.userHeaderElList.value.length; i++) {colHeaders.push(this.userHeaderElList.value[i].getAttribute('innerText'));}
            return colHeaders;
        }},

        /**
         * Method to search for a user.
         *@param searchUser name
         */
        selecthUser: {value: function(searchUser) {

            //Wait until you see open User search
            this.searchNewUser.waitForVisible();

            //Click in search
            this.searchNewUser.click();

            //Enter search value
            return browser.keys(searchUser);
        }},
    });
    module.exports = UsersTablePage;
}());
