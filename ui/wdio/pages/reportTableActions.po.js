/**
 * This file uses the Page Object pattern to define locators for viewing report toolbar content
 *
 */
(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = requirePO('./e2ePageBase');

    var ReportTableActionsPage = Object.create(e2ePageBase, {

        // Filter search box on table report
        reportSearchBox: {get: function() {return browser.element('.filterSearchBoxContainer .searchInput');}},

        // Sorting and group by button on table report
        reportSortAndGroupButton: {get: function() {return browswer.element('.sortButton.qbIcon.iconTableUISturdy-sort-az');}},

        // Records count on table report
        reportRecordsCount: {get: function() {return browser.element('.rightReportToolbar .recordsCount span');}},

        // All records checkbox on table report
        reportSelectAllCheckbox: {get: function() {return browser.element('.selectAllCheckbox');}},

        // Records row checkbox on table report
        reportSelectRowCheckbox: {get: function() {return browser.elements('input.selectRowCheckbox');}},

        // Records selected count label on table report
        reportSelectedRowLabel: {get: function() {return browser.element('.selectedRowsLabel');}},

        // Records edit icon on table report
        reportEdit: {get: function() {return browser.element('.qbIcon.iconTableUISturdy-edit');}},

        // Records print icon on table report
        reportPrint: {get: function() {return browser.element('.qbIcon.iconTableUISturdy-print');}},

        // Records mail icon on table report
        reportEmail: {get: function() {return browser.element('.qbIcon.iconTableUISturdy-mail');}},

        // Records copy icon on table report
        reportCopy: {get: function() {return browser.element('.qbIcon.iconTableUISturdy-duplicate');}},

        // Records delete icon on table report
        reportDelete: {get: function() {return browser.element('.qbIcon.iconTableUISturdy-delete');}},

        /**
         * Returns report record count text
         */
        getReportRecordsCount: {value: function() {
            return (this.reportRecordsCount.getText());
        }},

        /**
         * Returns report records selected count
         */
        getReportRecordsSelectedCount: {value: function() {
            return (this.reportSelectedRowLabel.getText());
        }},

        /**
         * Select all records checkbox
         */
        selectAllRecordsCheckbox : {value: function() {
            return (this.reportSelectAllCheckbox.click());
        }},

        /**
         * Select a record row checkbox
         */
        selectRecordRowCheckbox : {value: function(recordRowIndex) {
            //get all checkboxes in the report table first column
            var getAllCheckBoxs = this.reportSelectRowCheckbox.value.filter(function(checkbox) {
                return checkbox.index === recordRowIndex;
            });

            if (getAllCheckBoxs !== []) {
                getAllCheckBoxs[0].click();
            } else {
                throw new Error('Checkbox not found at row ' + recordRowIndex);
            }
        }},
    });

    module.exports = ReportTableActionsPage;
}());
