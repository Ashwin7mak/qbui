/**
 * This file uses the Page Object pattern to define locators for viewing report record content in agGrid
 *
 * Created by klabak on 11/23/16
 */
(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = require('./e2ePageBase.po');

    var ReportContentPage = Object.create(e2ePageBase, {

        //TODO: Will need to extend these locators when we show multiple reports on a page
        // Report Container (encapsulates both the report toolbar and the report itself)
        reportContainerEl: {get: function() {return browser.element('.reportContainer');}},

        // Report content div containing column headers and the report content in agGrid
        reportContentEl: {get: function() {return this.reportContainerEl.element('.reportContent');}},

        // agGrid contains both the column headers and the record content in agGrid
        agGridContainerEl: {get: function() {return this.reportContentEl.element('.agGrid');}},

        // Contains the entire set of column headers for the grid (the select all column and the field column headers)
        agGridHeaderEl: {get: function() {return this.agGridContainerEl.element('.ag-header');}},
        // Container for just the field column headers
        agGridHeaderContainerEl: {get: function() {return this.agGridHeaderEl.element('.ag-header-container');}},
        // List of all field column headers from agGrid
        agGridColHeaderElList: {get: function() {return this.agGridHeaderContainerEl.elements('.ag-header-cell.gridHeaderCell');}},

        // agGrid is divided up into two columns: one is the actions column (pinned on the left) and the second is the record data
        agGridBodyEl: {get: function() {return this.agGridContainerEl.element('.ag-body');}},

        // Container for each records action column
        agGridLeftColsContainerEl: {get: function() {return this.agGridBodyEl.element('.ag-pinned-left-cols-container');}},
        // this will get you every row of the actions column
        agGridRowActionsElList: {get: function() {return this.agGridLeftColsContainerEl.elements('.ag-row');}},
        // This is shorthand for the above (works in chrome dev console): $$('.ag-pinned-left-cols-container .ag-row')
        // Use the space to specify a sub element, join the two if it is a subclass

        // agGrid body-container which contains the actual record rows
        agGridBodyContainer: {get: function() {return this.agGridBodyEl.element('.ag-body-container');}},
        // this will get you every record element on the grid
        agGridRecordElList: {get: function() {return this.agGridBodyContainer.elements('.ag-row');}},

        /**
         * Helper function that will get all of the field column headers from the report. Returns an array of strings.
         */
        getReportColumnHeaders: {value: function() {
            var colHeaders = [];
            for (var i = 0; i < this.agGridColHeaderElList.value.length; i++) {
                colHeaders.push(this.agGridColHeaderElList.value[i].getAttribute('innerText'));
            }
            return colHeaders;
        }},

        /**
         * Returns a recordRowElement from the table based on the supplied index
         * @param recordIndex
         * @returns Resolved record row element at specified index
         */
        getRecordRowElement: {value: function(recordIndex) {
            return this.agGridRecordElList.value[recordIndex];
        }},

        /**
         * Given a record element that is being viewed in agGrid, return the cell elements for that row
         * @param recordRowElement
         * @returns a list of record cell elements
         */
        getRecordRowCells: {value: function(recordRowElement) {
            return recordRowElement.elements('.ag-cell-no-focus');
        }},

        /**
         * Given a record element that is being viewed in agGrid, return the value of that cell
         * @param recordCellElement
         * @returns the value of a record cell element
         */
        getRecordCellValue: {value: function(recordCellElement) {
            // If cell element is a checkbox field do special handling to get the value
            if (recordCellElement.isExisting('.checkbox') === true) {
                // Check for a specific element in the DOM which only shows if the checkbox field is selected
                return recordCellElement.isExisting('.checkbox .checked');
            } else {
                // Otherwise just grab the innerText value
                return recordCellElement.getAttribute('innerText');
            }
        }},

        /**
         * Get a record row element that is being viewed in agGrid (based on recordIndex), return the value of the specified cell index
         * If no cell index defined, function will return all values from all the cells
         * @param recordIndex
         * @param recordCellIndex
         * @returns either an array of cell values (as strings) or one value of a cell
         */
        getRecordValues: {value: function(recordIndex, recordCellIndex) {
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

        /**
         * Helper function to format record values returned a record cell element
         * @param rawRecordValue
         * @returns formatted value as a string
         */
        formatRecordValue: {value: function(rawRecordValue) {
            if (typeof rawRecordValue === 'boolean') {
                // Handle the checkbox field
                return rawRecordValue.toString();
            } else {
                // Remove whitespace and any newline characters
                return rawRecordValue.trim();
            }
        }},

        /**
         * Count the number of records showing on the report page
         * @returns the number of displayed records on the report
         */
        reportDisplayedRecordCount: {value: function() {
            this.agGridRecordElList.waitForVisible();
            return this.agGridRecordElList.value.length;
        }}

        //TODO: Will have to see if we actually need this going forward
        ///**
        // * Helper method to ensure the report has been properly loaded with records. Will throw an error if no records are in the report.
        // * @returns A promise that will resolve after waiting for the report records to be displayed
        // */
        //this.waitForReportContent = function() {
        //    var self = this;
        //    // First wait for the containers
        //    return e2ePageBase.waitForElements(self.reportContainerEl, self.reportContentEl).then(function() {
        //        // Then wait for records to be shown in the grid
        //        return e2ePageBase.waitForElement(self.agGridBodyViewportEl);
        //    }).catch(function(e) {
        //        // If we had issues send and error up the chain
        //        return Promise.reject(new Error('Error waiting for reportContent (are there records showing on the report?): ' + e.message));
        //    });
        //};

        /// Checking for the deleted record on the first page
        //this.checkForTheDeletedRecordOnTheCurrentPage = function(deletedRecord) {
        //    var self = this;
        //    self.agGridRecordElList.then(function(recordsNo) {
        //
        //        for (var i = 0; i < recordsNo.length; i++) {
        //            self.getRecordValues(i).then(function(fieldValues) {
        //                expect(deletedRecord).not.toEqual(fieldValues);
        //            });
        //        }
        //    });
        //
        //};
        //
        ////Record Row to be selected:
        //reportRowSelected: { value: function(recordRow) {
        //    this.recordCheckBoxes.get(recordRow).click();
        //} },
    });

    module.exports = ReportContentPage;
}());
