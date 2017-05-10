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
        newUserBtn: {get: function() {return browser.element('.iconActionButton.disabled.addRecord');}},

        // User Stage
        userStageContainerEl: {get: function() {return browser.element('.layout-stage');}},
        userStageBtn: {get: function() {return browser.element('.toggleStage');}},
        userStageArea: {get: function() {return browser.element('.collapsedContent');}},
        userStageContentEl: {get: function() {return browser.element('.stage-showHide-content');}},
        userStageContent: {get: function() {return browser.element('.appUsersManagementContent');}},

        /**
         * Helper function that will get all of the field column headers from the user management report. Returns an array of strings.
         */
        getUserColumnHeaders: {value: function() {
            var colHeaders = [];
            for (var i = 1; i < this.userHeaderElList.value.length; i++) {colHeaders.push(this.userHeaderElList.value[i].getAttribute('innerText'));}
            return colHeaders;
        }},
    });

    module.exports = UsersTablePage;
}());
