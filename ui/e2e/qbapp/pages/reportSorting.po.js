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
                var scrollToElm1 = filteredColumn[0].scrollIntoView;
                e2ePageBase.waitForElementToBeClickable(filteredColumn[0]).then(function() {
                    return filteredColumn[0].click();
                }).then(function() {
                    var scrollToElm2 = filteredColumn[0].element(by.className('ag-header-cell-menu-button')).scrollIntoView;
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
                        return reportServicePage.waitForElement(reportServicePage.reportRecordsCount).then(function() {
                            // Get all records from table before filter applied
                            return reportServicePage.agGridRecordElList.map(function(row) {
                                return row.all(by.className('ag-cell-no-focus')).get(columnId).getText();
                            }).then(function(results) {
                                return results;
                            });
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
         * Function will Expand the Column header Menu and select the Item passed in parameter
         */
        this.expandColumnHeaderMenuAndSelectItem = function(columnName, itemToSelect) {
            var self = this;
            return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //open the Column Header PopUp Menu
                return self.openColumnHeaderMenu(columnName);
            }).then(function() {
                return reportServicePage.waitForElement(element(by.className('ag-menu-list'))).then(function() {
                    //Select the sort order Item to be Ascending (eg:A to Z , small to Large, lower to highest etc)
                    return self.selectItems(itemToSelect);
                });
            });
        };

        /*
         * Function to verify ascending of column Records
         */
        this.verifyAscending = function(columnName, actualColumnRecords, sortedColumnRecords) {
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                //Finally verify both the arrays
                if (columnName.includes("Numeric Field")) {
                    actualColumnRecords.sort(function(a, b) {return (a) - (b);});
                } else if (columnName.includes("Numeric Currency Field")) {
                    actualColumnRecords.sort(function(a, b) {return (a.substring(1)) - (b.substring(1));});
                } else if (columnName.includes("Numeric Percent Field")) {
                    actualColumnRecords.sort(function(a, b) {return (a.substring(0, a.length - 1)) - (b.substring(0, b.length - 1));});
                } else if (columnName.includes("Duration Field")) {
                    actualColumnRecords.sort(function(a, b) {return (a.substring(0, a.length - 6)) - (b.substring(0, b.length - 6));});
                } else if (columnName.includes("Date Field")) {
                    //remove null first before sorting
                    var index = actualColumnRecords.indexOf('');
                    actualColumnRecords.splice(index, 1);
                    //sort the array to ascending
                    actualColumnRecords.sort(function(a, b) {return new Date(a) - new Date(b);});
                    //add the null bck
                    actualColumnRecords.unshift('');
                } else if (columnName.includes("Date Time Field")) {
                    //remove null
                    var index1 = actualColumnRecords.indexOf('');
                    actualColumnRecords.splice(index1, 1);
                    //sort
                    actualColumnRecords.sort(function(a, b) {return new Date(a).getTime() - new Date(b).getTime();});
                    //add null bck
                    actualColumnRecords.unshift('');
                } else {
                    actualColumnRecords.sort();
                }
                expect(JSON.stringify(actualColumnRecords)).toEqual(JSON.stringify(sortedColumnRecords));
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
                if (columnName.includes("Numeric Field")) {
                    actualColumnRecords.sort(function(a, b) {return (b) - (a);});
                } else if (columnName.includes("Numeric Currency Field")) {
                    actualColumnRecords.sort(function(a, b) {return (b.substring(1)) - (a.substring(1));});
                } else if (columnName.includes("Numeric Percent Field")) {
                    actualColumnRecords.sort(function(a, b) {return (b.substring(0, b.length - 1)) - (a.substring(0, a.length - 1));});
                } else if (columnName.includes("Duration Field")) {
                    actualColumnRecords.sort(function(a, b) {return (b.substring(0, b.length - 6)) - (a.substring(0, a.length - 6));});
                } else if (columnName.includes("Date Field")) {
                    //remove null
                    var index = actualColumnRecords.indexOf('');
                    actualColumnRecords.splice(index, 1);
                    //sort the array to ascending
                    actualColumnRecords.sort(function(a, b) {return new Date(a) - new Date(b);});
                    //reverse the array and add null bck
                    actualColumnRecords.reverse();
                    actualColumnRecords.push('');
                } else if (columnName.includes("Date Time Field")) {
                    //remove null
                    var index2 = actualColumnRecords.indexOf('');
                    actualColumnRecords.splice(index2, 1);
                    //sort the array to ascending
                    actualColumnRecords.sort(function(a, b) {return new Date(a).getTime() - new Date(b).getTime();});
                    //reverse and add null bck
                    actualColumnRecords.reverse();
                    actualColumnRecords.push('');
                } else {
                    actualColumnRecords.sort().reverse();
                }
                expect(JSON.stringify(actualColumnRecords)).toEqual(JSON.stringify(sortedColumnRecords));
            }).then(function() {
                //finally clean both arrays
                actualColumnRecords = [];
                sortedColumnRecords = [];
            });
        };

    };
    ReportSortingPage.prototype = e2ePageBase;
    module.exports = ReportSortingPage;
}());
