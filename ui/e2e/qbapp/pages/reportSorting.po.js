(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = require('./../../common/e2ePageBase');
    var ReportServicePage = requirePO('reportService');
    var reportServicePage = new ReportServicePage();


    var ReportSortingPage = function() {

        /*
         * Function will open the column headers popUp menu
         */
        this.openColumnHeaderMenu = function(columnName) {
            var columns = reportServicePage.agGridColHeaderElList;
            return columns.filter(function(elm) {
                return elm.getAttribute('innerText').then(function(text) {
                    var columnHeader = text.replace(/(\r\n|\n|\r)/gm, '');
                    return columnHeader === columnName;
                });
            }).then(function(filteredColumn) {
                e2ePageBase.waitForElementToBeClickable(filteredColumn[0]).then(function() {
                    return filteredColumn[0].click();
                }).then(function() {
                    e2ePageBase.waitForElementToBeClickable(filteredColumn[0].element(by.className('ag-header-cell-menu-button'))).then(function() {
                        return filteredColumn[0].element(by.className('ag-header-cell-menu-button')).click();
                    });
                }).then(function() {
                    // Verify the popup menu is displayed
                    return e2ePageBase.waitForElement(element(by.className('ag-menu-list'))).then(function() {
                        return expect(element(by.className('ag-menu-list')).isDisplayed()).toBeTruthy();
                    });
                });
            });
        };

        /*
         * Function to get all records for a table column
         */
        this.getColumnRecords = function(columnId) {
            var actualTableResults = [];
            return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                return reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                    return reportServicePage.waitForElement(reportServicePage.agGridBodyEl).then(function() {
                        // Get all records from table before filter applied
                        return reportServicePage.agGridRecordElList.map(function(row) {
                            return row.all(by.className('ag-cell-no-focus')).get(columnId).getText();
                        }).then(function(results) {
                            return results;
                        });
                    });
                });
            });

        };

        /*
         * Function will select the Item passed in parameter from the column header popup menu
         */
        this.selectItems = function(itemToSelect) {
            var items = reportServicePage.agGridContainerEl.all(by.className('ag-menu-option'));
            return items.filter(function(elm) {
                return elm.element(by.className('ag-menu-option-text')).getText().then(function(text) {
                    return text === itemToSelect;
                });
            }).then(function(filteredElement) {
                filteredElement[0].click().then(function() {
                    return reportServicePage.waitForElement(reportServicePage.reportRecordsCount).then(function() {
                        return expect(reportServicePage.reportRecordsCount.getAttribute('innerText')).toEqual('11 Records');
                    });
                });
            });

        };

        /*
         * Function to verify ascending of column Records
         */
        this.verifyAscending = function(columnName, actualColumnRecords, sortedColumnRecords) {
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //Finally verify both the arrays
                if (columnName.includes("Numeric")) {
                    expect(actualColumnRecords.sort(function(a, b) {return a - b;})).toEqual(sortedColumnRecords);
                } else if (columnName.includes("Text")) {
                    console.log("the actual after sorting are: " + actualColumnRecords.sort());
                    console.log("The sorted are: " + sortedColumnRecords);
                    expect(actualColumnRecords.sort()).toEqual(sortedColumnRecords);
                } else if (columnName.includes("Date")) {
                    console.log("the actual after sorting are: " + actualColumnRecords.sort(function(a, b) {return new Date(a).getTime() - new Date(b).getTime();}));
                    console.log("The sorted are: " + sortedColumnRecords);
                    expect(actualColumnRecords.sort(function(a, b) {return new Date(a).getTime() - new Date(b).getTime();})).toEqual(sortedColumnRecords);
                }
            }).then(function() {
                //finally clean both arrays
                actualColumnRecords = [];
                sortedColumnRecords = [];
            });
        };

        /*
         * Function to verify descending of column Records
         */
        this.verifyDescending = function(columnName, actualColumnRecords, sortedColumnRecords) {
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //Finally verify both the arrays
                if (columnName.includes("Numeric")) {
                    console.log("the actual after sorting are: " + actualColumnRecords.sort(function(a, b) {return a - b;}).reverse());
                    console.log("The sorted are: " + sortedColumnRecords);
                    expect(actualColumnRecords.sort(function(a, b) {return a - b;}).reverse()).toEqual(sortedColumnRecords);
                } else if (columnName.includes("Text")) {
                    console.log("the actual after sorting are: " + actualColumnRecords.sort().reverse());
                    console.log("The sorted are: " + sortedColumnRecords);
                    expect(actualColumnRecords.sort().reverse()).toEqual(sortedColumnRecords);
                } else if (columnName.includes("Date")) {
                    console.log("the actual after sorting are: " + actualColumnRecords.sort(function(a, b) {return new Date(a).getTime() - new Date(b).getTime();}).reverse());
                    console.log("The sorted are: " + sortedColumnRecords);
                    expect(actualColumnRecords.sort(function(a, b) {return new Date(a).getTime() - new Date(b).getTime();}).reverse()).toEqual(sortedColumnRecords);
                }
            });
        };


    };
    ReportSortingPage.prototype = e2ePageBase;
    module.exports = ReportSortingPage;
}());
