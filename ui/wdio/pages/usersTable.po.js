/**
 * This file uses the Page Object pattern to define the User Management page object for tests
 *
 */
(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = requirePO('./e2ePageBase');

    var UsersTablePage = Object.create(e2ePageBase, {

        // Container for just the field column headers
        userContainerEl: {get: function() {return browser.elements('.userManagementReport .qbGrid .qbHeader');}},

        // List of all field column headers
        userHeaderElList: {get: function() {return browser.elements('.userManagementReport .qbGrid .qbHeader .qbHeaderCell');}},

        // App Role Name
        appRolesPodName: {get: function() {return browser.elements('.appRolesPod .appRolesPodName');}},

        // App Role Count
        appRolesPodCount: {get: function() {return browser.elements('.appRolesPod .appRolesPodCount');}},

        // Add new user button
        newUserBtn: {get: function() {return browser.element('.iconActionButton.addRecord');}},

        // Add new user search container
        userAddNewSearch: {get: function() {return browser.element('.selectUser.panel-items');}},

        // Add new user searchbox
        userAddSearchBox: {value: function() {return browser.element('.Select-placeholder');}},

        // Add new user search select arrow
        userAddSearchBoxSelect: {get: function() {return browser.element('.Select-arrow-zone .Select-arrow');}},

        // Add new user clear searchbox entry
        userAddSearchBoxClear: {get: function() {return browser.element('.Select-clear');}},

        userSelectRole: {get: function() {return browser.element('.Select-value span')}},

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

        // Remove user button in modal
        userRemoveButton: {get: function() {return browser.element('.modal-dialog .primaryButton');}},

        // Cancel remove user button in modal
        userCancelButton: {get: function() {return browser.element('.modal-dialog .secondaryButton');}},

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
         * Method to click on user remove button.
         */
        clickUserRemoveButton : {value: function() {
            //Wait until remove button visible
            this.userRemoveButton.waitForVisible();
            //Click on remove button
            this.userRemoveButton.click();
            //Need this to wait for container to slide away
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /**
         * Method to click on cancel remove user button.
         */
        clickUserCancelRemoveButton : {value: function() {
            //Wait until remove button visible
            this.userCancelButton.waitForVisible();
            //Click on remove button
            this.userCancelButton.click();
            //Need this to wait for container to slide away
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},


        /**
         * Method to search and select user from the user search
         *@param searchUser name
         */
        selectUserFromSearch: {value: function(searchUser) {

            //Wait until you see open User search
            this.userAddNewSearch.waitForVisible();

            //Click in search
            this.userAddSearchBox.click();

            //Enter search value
            return this.userAddSearchBox.setValue(searchUser);
        }},



        /**
         * Find and click in the searchbox for user search
         */
        clickUserSearchbox: {value: function() {
            var userSearchBoxEl = this.userAddSearchBox();
            userSearchBoxEl.waitForVisible();
            try {
                userSearchBoxEl.click();
                // By setting the true flag it will do the inverse of the function (in this case wait for it to be invisible)
                browser.waitForVisible(cancelRecordInlineEdit, e2eConsts.mediumWaitTimeMs, true);
            } catch (err) {
                browser.logger.info("Caught an error clicking in the searchbox - Trying again with JS. \n Error " + err.toString());
                // Catch an error from above and then retry
                // Single click via raw javascript
                browser.execute(function() {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 1
                    });
                    document.querySelector('.Select-placeholder').dispatchEvent(event);
                });
                browser.waitForVisible('.Select.Select--single.is-focused.is-open.is-searchable', e2eConsts.mediumWaitTimeMs, true);
            }
        }},



    });

    module.exports = UsersTablePage;
}());
