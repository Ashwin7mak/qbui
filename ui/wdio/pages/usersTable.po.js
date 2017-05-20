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

        // All users checkbox on user table
        userSelectAllCheckbox: {get: function() {return browser.element('.selectAllCheckbox');}},

        // Records row checkbox on user table
        userSelectRowCheckbox: {get: function() {return browser.elements('.selectRowCheckbox');}},

        // Users selected count label on user table
        userSelectedRowLabel: {get: function() {return browser.element('.selectedRowsLabel');}},

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
         * Returns total users selected count
         */
        getUserSelectedCount: {value: function() {
            return (this.userSelectedRowLabel.getText());
        }},

        /**
         * Helper method to ensure the user report has been properly loaded with records. Will throw an error if no users are in the report.
         * @returns A promise that will resolve after waiting for the report records to be displayed
         */
        waitForUserReportContent: {value: function() {
            // wait until you see .qbTbody
            browser.element('.qbTbody').waitForVisible();
            return browser.element('.qbRow').waitForVisible();
        }},

        getUserRowElement: {value: function(recordIndex) {
            return this.getAllRows.value[recordIndex];
        }},

        /**
         * Returns users selected count
         */
        getUsersSelectedCount: {value: function() {
            return (this.userSelectedRowLabel.getText());
        }},

        /**
         * Select a user row checkbox
         */
        selectUserRowCheckbox : {value: function(recordRowIndex) {
            //get all checkboxes in the report table first column
            var getAllCheckBoxs = this.userSelectRowCheckbox.value.filter(function(checkbox) {
                return checkbox.index === recordRowIndex;
            });

            if (getAllCheckBoxs !== []) {
                getAllCheckBoxs[0].click();
            } else {
                throw new Error('Checkbox not found at row ' + recordRowIndex);
            }
        }},

        /**
         * Select all users checkbox
         */
        selectAllUsersCheckbox : {value: function() {
            return (this.userSelectAllCheckbox.click());
        }},

        /**
         * Get a record row element that is being viewed in qbGrid (based on recordIndex), return the value of the specified cell index
         * If no cell index defined, function will return all values from all the cells
         * @param recordIndex
         * @param recordCellIndex
         * @returns either an array of cell values (as strings) or one value of a cell
         */
        getUserValues: {value: function(recordIndex, recordCellIndex) {
            this.waitForUserReportContent();
            var recordRowElement = this.getRecordRowElement(recordIndex);
            var recordRowCells = this.getRecordRowCells(recordRowElement);
            // Return all record values if no cell number supplied
            if (typeof recordCellIndex === 'undefined') {
                var cellValues = [];
                for (var i = 0; i < recordRowCells.value.length; i++) {
                    var cellValue = this.getRecordCellValue(recordRowCells.value[i]);
                    cellValues.push(cellValue);
                }
                // Do post processing
                for (var j = 0; j < cellValues.length; j++) {
                    cellValues[j] = this.formatRecordValue(cellValues[j]);
                }
                return cellValues;
            } else {
                // Get the value for a specific cell number
                var cellValue2 = this.getRecordCellValue(recordRowCells.value[recordCellIndex]);
                // Do post processing
                return this.formatRecordValue(cellValue2);
            }
        }},
    });

    module.exports = UsersTablePage;
}());
