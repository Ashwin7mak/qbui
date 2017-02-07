(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');

    // Lodash utility library
    var _ = require('lodash');
    var recordsFromAllListReport;


    var ReportSortingGroupingPage = Object.create(e2ePageBase, {
        /**
         * Function that will get all the records from the UI report table grid.
         *
         */
        getAllRecordsFromTable: {value: function() {
            var tableRecords = [];
            //get the count of records rows in a table
            var numOfRows = reportContentPO.reportDisplayedRecordCount();
            //for each record row get the cell values
            for (var i = 0; i < numOfRows; i++) {
                var cellValues = reportContentPO.getRecordValues(i);
                //we need to remove record actions like print, email etc
                cellValues.splice(0, 1);
                tableRecords.push(cellValues);
            }
            return tableRecords;
        }},

        /*
         * Function to sort Records using loDash _.orderBy
         */
        sortRecordsUsingLoDash: {value: function(recordsToSort, columnListToSort, sortOrder) {
            // sorts the list of records passed in specified sort order for a given fid.
            var sortedRecords = _.orderBy(recordsToSort, columnListToSort, sortOrder);
            return sortedRecords;
        }},

        /*
         * This function gets the value in the record parameter (array of field value pairs), where id matches the fid specified in the parameter
         * Function is a custom sort function used by lodash from within the sortRecords function
         * @Returns The value that lodash should sort on
         */
        getSortValue: {value: function(record, fid) {
            // By default returns nothing if not found
            var val = [];
            // loop through the columns (fields) in the record
            record.forEach(function(col) {
                // find the column we are sorting on and return its value
                if (col.id === fid) {
                    val.push(col.value);
                }
            });
            return val;
        }},

        /**
         * Function that will sort the records using lodash in asked order
         *@parms Fids, sortFids and sortOrder
         */
        getReportResultsAndSortFidsUsingLoDashAndVerify: {value: function(appId, tableId, reportId, Fids, sortFids, sortOrder) {
            var sortedRecords;
            var self = this;
            var sortedExpectedRecords = [];

            //report Endpoint
            var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(appId, tableId, reportId);
            //GET report results
            browser.call(function() {
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.GET).then(function(reportResult) {
                    var results = JSON.parse(reportResult.body);
                    recordsFromAllListReport = results.records;
                });
            });

            // Sort the actual records using lodash _.orderby
            sortedRecords = self.sortRecordsUsingLoDash(recordsFromAllListReport, sortFids, sortOrder);

            //extract just the FID'S(columns) asked in parameter
            sortedRecords.forEach(function(sortedRecord) {
                Fids.forEach(function(Fid) {
                    sortedExpectedRecords.push(self.getSortValue(sortedRecord, Fid));
                });
            });
            return sortedExpectedRecords;
        }},

        /**
         * Function that will verify the actual versus expected sorted records
         *@parms actualSortedResults, expectedsortedResults
         */
        verifyResults: {value: function(actualSortedResults, expectedSortedResults) {
            expect(actualSortedResults.join()).toEqual(expectedSortedResults.join());
        }},

        /*
         * Function will select the Item passed in parameter from the column header popup menu
         */
        selectItems: {value: function(itemToSelect) {
            var items = reportContentPO.qbGridContainer.elements('.dropdown-menu').elements('li').value.filter(function(elm) {
                return elm.getText() === itemToSelect;
            });

            if (items !== []) {
                items[0].element('a').click();
                //wait until report rows in table are loaded
                return reportContentPO.waitForReportContent();
            }else {
                throw new Error('Item with name ' + itemToSelect + ' not found under column header menu');
            }
        }},
        /*
         * Function will open the column headers popUp menu
         */
        openColumnHeaderMenu: {value: function(columnName) {
            //get all column headers names and filter the one we want
            var columns = browser.elements('.gridHeaderCell').value.filter(function(elm) {
                var columnHeader = elm.element('.gridHeaderLabel').getAttribute('textContent');
                return columnHeader === columnName;
            });

            if (columns !== []) {
                //Click on drop down toggle for filtered column header name
                columns[0].element('.dropdownToggle').click();
                //wait until you see drop down menu
                return columns[0].element('.dropdown-menu').waitForVisible();
            } else {
                throw new Error('Column Header with name ' + columnName + ' not found');
            }
        }},

        /*
         * Function will Expand the Column header Menu and select the Item passed in parameter
         */
        expandColumnHeaderMenuAndSelectItem: {value: function(columnName, itemToSelect) {
            //open the Column Header PopUp Menu
            this.openColumnHeaderMenu(columnName);

            //Select the sort order Item to be Ascending (eg:A to Z , small to Large, lower to highest etc)
            return this.selectItems(itemToSelect);
        }},

        /*
         * Function will Expand the Column header Menu and select the Item passed in parameter
         */
        expandColumnHeaderMenuAndVerifySelectedItem: {value: function(columnName, itemToVerifySelected) {
            //open the Column Header PopUp Menu
            this.openColumnHeaderMenu(columnName);

            //Verify the sort order Item and checkmark beside it
            return this.verifyItemSelected(itemToVerifySelected);
        }},

        /*
         * Function will select the Item passed in parameter from the column header popup menu
         */
        verifyItemSelected: {value: function(itemToVerify) {
            var items = reportContentPO.qbGridContainer.elements('.dropdown-menu').elements('li').value.filter(function(elm) {
                return elm.getText() === itemToVerify;
            });

            if (items !== []) {
                //verify the check mark beside the item selected
                expect(items[0].element('.iconTableUISturdy-check').isVisible()).toBeTruthy();
            }else {
                throw new Error('Item with name ' + itemToVerify + ' not found under column header menu');
            }
        }},
    });
    module.exports = ReportSortingGroupingPage;
}());
