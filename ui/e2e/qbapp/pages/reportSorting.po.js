(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = require('./../../common/e2ePageBase');
    var ReportServicePage = requirePO('reportService');
    var reportServicePage = new ReportServicePage();


    var ReportSortingPage = function() {

        // Report sorting grouping Menu Container
        this.reportSortingGroupingContainer = element(by.className('sortAndGroupContainer'));
        // Report sorting grouping button
        this.reportSortAndGroupBtn = this.reportSortingGroupingContainer.element(by.className('sortAndGroupButton '));
        //sorting/grouping popup
        this.reportSortAndGroupDialogue = this.reportSortingGroupingContainer.element(by.id('sortAndGroupDialog'));
        //Apply button
        this.sortAndGrpDialogueApplyBtn = this.reportSortAndGroupDialogue.element(by.className('apply'));
        //resest button
        this.sortAndGrpDialogueResetBtn = this.reportSortAndGroupDialogue.all(by.className('reset')).first();
        //sorting/grouping popup title
        this.reportSortAndGroupTitle = this.reportSortingGroupingContainer.all(by.className('overlayTitle')).first();
        //sorting/grouping close button
        this.reportSortAndGroupCloseBtn = this.reportSortingGroupingContainer.all(by.className('overlayRight')).first();

        //group By settings
        this.reportGroupByContainer = this.reportSortingGroupingContainer.element(by.className('groupBySettings'));
        //group field selector container
        this.groupByFieldSelectorCnt = this.reportGroupByContainer.element(by.className('fieldSelectorContainer'));
        //group By title
        this.reportGroupByContainerTitle = this.reportGroupByContainer.element(by.className('title'));
        //group by field Selector
        this.reportGroupByFieldSelector = this.reportGroupByContainer.element(by.className('empty'));
        //field prefix
        this.GroupByFieldPrefix = this.reportGroupByFieldSelector.element(by.className('prefix'));
        //group by Open
        this.reportGroupByIcon = this.reportGroupByFieldSelector.element(by.className('groupFieldOpen'));
        //field Name
        this.reportGroupByFieldName = this.reportGroupByFieldSelector.element(by.className('fieldName'));
        //field delete button
        this.groupByFieldDeleteBtn = this.reportGroupByFieldSelector.element(by.className('groupFieldDelete'));
        //field sort Order button
        this.groupBySortOrderBtn = this.reportGroupByFieldSelector.element(by.className('sortOrderIcon'));

        //field panel
        this.GroupByFieldPanel = this.reportSortAndGroupDialogue.element(by.className('panel-body'));
        //Field panel header
        this.GroupByFieldPanelHeader = this.GroupByFieldPanel.element(by.className('fieldPanelHeader'));
        //cancel button in field panel
        this.GroupByCancelBtn = this.GroupByFieldPanel.element(by.className('cancel'));



        //sort By settings
        this.reportSortByContainer = this.reportSortingGroupingContainer.element(by.className('sortBySettings'));
        //group By title
        this.reportSortByContainerTitle = this.reportSortByContainer.element(by.className('title'));

        ////sort by field Selector
        //this.reportSortByFieldSelector = this.reportSortByContainer.element(by.className('fieldSelector'));
        //field choice
        this.reportSortByFieldSelector = this.reportSortByContainer.element(by.className('empty'));
        //field prefix
        this.SortByFieldPrefix = this.reportSortByFieldSelector.element(by.className('prefix'));
        //sort by Open
        this.reportSortByIcon = this.reportSortByFieldSelector.element(by.className('groupFieldOpenIcon'));
        //field name
        this.reportSortByFieldName = this.reportSortByFieldSelector.element(by.className('fieldName'));
        //Sort order Icon
        this.reportSortOrderIcon = this.reportSortByFieldSelector.element(by.className('sortOrderIcon'));
        //Sort Field Delete Icon
        this.sortBySortFieldDeleteIcon = this.reportSortByFieldSelector.element(by.className('groupFieldDeleteIcon'));

        //field panel
        this.SortByFieldPanel = this.reportSortAndGroupDialogue.element(by.className('panel-body'));
        //Field panel header
        this.SortByFieldPanelHeader = this.SortByFieldPanel.element(by.className('fieldPanelHeader'));
        //cancel button in field panel
        this.SortByCancelBtn = this.SortByFieldPanel.element(by.className('cancel'));
        //GroupBy list items
        this.SortByListItem = this.SortByFieldPanel.all(by.className('list-group'));

        //small breakpoint Apply button
        //top
        this.sortAndGrpDialogueTopSB = this.reportSortAndGroupDialogue.element(by.className('dialogTop'));
        //dialogContent
        this.sortAndGrpDialogueContentSB = this.reportSortAndGroupDialogue.element(by.className('dialogContent'));
        //dialogue Bottom
        this.sortAndGrpDialogueBottomSB = this.reportSortAndGroupDialogue.element(by.className('dialogBand'));

        this.sortAndGrpDialogueSBApplyBtn = this.sortAndGrpDialogueTopSB.element(by.className('btn'));
        //reset button
        this.sortAndGrpDialogueSBRestBtn = this.sortAndGrpDialogueBottomSB.element(by.className('reset'));


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
                    return reportServicePage.waitForElement(reportServicePage.reportRecordsCount);
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

        /*
         * Function to select group By Items
         */
        this.selectGroupByItems = function(itemsToSelect) {
            var self = this;
            return reportServicePage.waitForElement(self.reportGroupByContainer).then(function() {
                //Verify title of sortBy
                expect(self.reportGroupByContainerTitle.getText()).toEqual('Group');
                //Click on field selector
                return e2ePageBase.waitForElementToBeClickable(self.reportGroupByIcon).then(function() {
                    return self.reportGroupByIcon.click().then(function() {
                        return reportServicePage.waitForElement(self.GroupByFieldPanel).then(function() {
                            //verify the title of groupBy list
                            expect(self.GroupByFieldPanelHeader.getText()).toEqual('Cancel\nChoose Field for grouping');
                            //select the groupBy item
                            var items = self.GroupByFieldPanel.all(by.className('list-group-item'));
                            return items.filter(function(elm) {
                                return elm.getText().then(function(text) {
                                    return text === itemsToSelect;
                                });
                            }).then(function(filteredElement) {
                                if (itemsToSelect === 'more fields...') {
                                    // Click on more fields link
                                    e2ePageBase.waitForElementToBeClickable(self.GroupByFieldPanel.element(by.className('moreFields'))).then(function() {
                                        return self.GroupByFieldPanel.element(by.className('moreFields')).click().then(function() {
                                            // Sleep needed for animation of drop down
                                            e2eBase.sleep(browser.params.smallSleep);
                                            //Click cancel button and verify the panel not displayed
                                            return self.GroupByCancelBtn.click().then(function() {
                                                expect(self.reportSortAndGroupTitle.getAttribute('innerText')).toEqual('Sort & Group');
                                            });
                                        });
                                    });
                                } else {
                                    e2ePageBase.waitForElementToBeClickable(filteredElement[0]).then(function() {
                                        return filteredElement[0].click();
                                    });
                                }
                            });
                        });
                    });
                });
            });
        };

        /*
         * Function to verify group By Items selected in popUp
         */
        this.verifySelectedGroupByFields = function(fieldsToVerify) {
            var self = this;
            self.reportGroupByContainer.all(by.className('notEmpty')).map(function(elm, index) {
                //verify the delete button and sortOrder button
                expect(elm.element(by.className('groupFieldDeleteIcon')).isDisplayed()).toBeTruthy();
                expect(elm.element(by.className('sortOrderIcon')).isDisplayed()).toBeTruthy();

                //verify the prefix
                if (index === 0) {
                    expect(elm.element(by.className('prefix')).getText()).toEqual('by');
                } else {
                    expect(elm.element(by.className('prefix')).getText()).toEqual('then by');
                }

                //verify the field Name
                elm.element(by.className('fieldName')).getText().then(function(selectedFieldText) {
                    expect(selectedFieldText).toEqual(fieldsToVerify[index]);
                });

            });
        };

        /*
         * Select sortByIcon in groupBy
         */
        this.selectSortByIconInGroupBy = function(fieldIndex, sortorder) {
            var self = this;
            return reportServicePage.waitForElement(self.reportGroupByContainer).then(function() {
                self.reportGroupByContainer.all(by.className('notEmpty')).then(function(items) {
                    if (items.length > 0) {
                        for (var i = 0; i < items.length; i++) {
                            if (sortorder === 'asc') { //if ascending don't click the icon
                                reportServicePage.waitForElement(items[fieldIndex].element(by.className('up')));
                            }
                            if (sortorder === 'desc') { //if descending
                                return items[fieldIndex].element(by.className('sortOrderIcon')).click().then(function() {
                                    //TODO: Figure out how to handle with sleeps (waiting for element to be stale doesn't seem to work)
                                    e2eBase.sleep(browser.params.smallSleep);
                                    //reportServicePage.waitForElement(items[fieldIndex].element(by.className('down')));
                                });
                            }
                        }
                    }
                });
            });
        };

        /*
         * Delete sortBy fields
         */
        this.deleteFieldsInGroupBy = function(fieldIndex, fieldName) {
            var self = this;
            return reportServicePage.waitForElement(self.reportGroupByContainer).then(function() {
                self.reportGroupByContainer.all(by.className('notEmpty')).then(function(items) {
                    if (items.length > 0) {
                        for (var i = 0; i < items.length; i++) {
                            return items[fieldIndex].element(by.className('groupFieldDelete')).click();
                        }
                    }
                }).then(function() {
                    //verify fields got deleted
                    self.reportGroupByContainer.all(by.className('notEmpty')).then(function(items2) {
                        if (items2.length > 0) {
                            for (var j = 0; j < items2.length; j++) {
                                items2[j].element(by.className('fieldName')).getText().then(function(text) {
                                    return text !== fieldName;
                                });
                            }
                        }
                    });
                });
            });
        };

        /*
         * Function to select sort By Items
         */
        this.selectSortByItems = function(itemsToSelect) {
            var self = this;
            return reportServicePage.waitForElement(self.reportSortByContainer).then(function() {
                //Verify title of sortBy
                expect(self.reportSortByContainerTitle.getText()).toEqual('Sort');
                //Click on field selector
                return e2ePageBase.waitForElementToBeClickable(self.reportSortByIcon).then(function() {
                    return self.reportSortByIcon.click().then(function() {
                        return reportServicePage.waitForElement(self.SortByFieldPanel).then(function() {
                            //verify the title of groupBy list
                            expect(self.SortByFieldPanelHeader.getText()).toEqual('Cancel\nChoose Field for sorting');
                            //select the groupBy item
                            var items = self.SortByFieldPanel.all(by.className('list-group-item'));
                            return items.filter(function(elm) {
                                return elm.getText().then(function(text) {
                                    return text === itemsToSelect;
                                });
                            }).then(function(filteredElement) {
                                e2ePageBase.waitForElementToBeClickable(filteredElement[0]).then(function() {
                                    return filteredElement[0].click();
                                });
                            });
                        });
                    });
                });
            });
        };

        /*
         * Function to verify sort By Items selected in popUp
         */
        this.verifySelectedSortByFields = function(fieldsToVerify) {
            var self = this;
            self.reportSortByContainer.all(by.className('notEmpty')).map(function(elm, index) {
                //verify the delete button and sortOrder button
                expect(elm.element(by.className('groupFieldDeleteIcon')).isDisplayed()).toBeTruthy();
                expect(elm.element(by.className('sortOrderIcon')).isDisplayed()).toBeTruthy();

                //verify the prefix
                if (index === 0) {
                    expect(elm.element(by.className('prefix')).getText()).toEqual('by');
                } else {
                    expect(elm.element(by.className('prefix')).getText()).toEqual('then by');
                }

                //verify the field Name
                elm.element(by.className('fieldName')).getText().then(function(selectedFieldText) {
                    expect(selectedFieldText).toEqual(fieldsToVerify[index]);
                });
            });
        };

        /*
         * Select sortByIcon in sortBy
         */
        this.selectSortByIconInSortBy = function(fieldIndex, sortorder) {
            var self = this;
            return reportServicePage.waitForElement(self.reportGroupByContainer).then(function() {
                self.reportSortByContainer.all(by.className('notEmpty')).then(function(items) {
                    if (items.length > 0) {
                        for (var i = 0; i < items.length; i++) {
                            if (sortorder === 'asc') {
                                //don't click on anything
                                reportServicePage.waitForElement(items[fieldIndex].element(by.className('down')));
                                //return items[fieldIndex].element(by.className('sortOrderIcon')).click().then(function() {
                                //    //TODO: Figure out how to handle with sleeps (waiting for element to be stale doesn't seem to work)
                                //    e2eBase.sleep(browser.params.smallSleep);
                                //    //reportServicePage.waitForElement(items[fieldIndex].element(by.className('down')));
                                //});
                            } else if (sortorder === 'desc') {
                                return items[fieldIndex].element(by.className('sortOrderIcon')).click().then(function() {
                                    //TODO: Figure out how to handle with sleeps (waiting for element to be stale doesn't seem to work)
                                    e2eBase.sleep(browser.params.smallSleep);
                                    //reportServicePage.waitForElement(items[fieldIndex].element(by.className('up')));
                                });
                            }
                        }
                    }
                });
            });
        };

        /*
         * Delete sortBy fields
         */
        this.deleteFieldsInSortBy = function(fieldIndex, fieldName) {
            var self = this;
            return reportServicePage.waitForElement(self.reportSortByContainer).then(function() {
                self.reportSortByContainer.all(by.className('notEmpty')).then(function(items) {
                    if (items.length > 0) {
                        for (var i = 0; i < items.length; i++) {
                            return items[fieldIndex].element(by.className('groupFieldDelete')).click();
                        }
                    }
                }).then(function() {
                    //verify fields got deleted
                    self.reportSortByContainer.all(by.className('notEmpty')).then(function(items2) {
                        if (items2.length > 0) {
                            for (var j = 0; j < items2.length; j++) {
                                items2[j].element(by.className('fieldName')).getText().then(function(text) {
                                    return text !== fieldName;
                                });
                            }
                        }
                    });
                });
            });
        };

        /*
         * Verify Reset functionality
         */

        this.verifyGrpSortPopUpReset = function() {
            var self = this;
            reportServicePage.waitForElementToBeClickable(self.reportSortAndGroupBtn).then(function() {
                return self.reportSortAndGroupBtn.click();
            }).then(function() {
                // Sleep needed for animation of drop down
                e2eBase.sleep(browser.params.smallSleep);
                //hit Reset
                return self.sortAndGrpDialogueResetBtn.click();
            }).then(function() {
                reportServicePage.waitForElement(reportServicePage.loadedContentEl);
                //verify all cleared after reset
                return self.reportSortAndGroupBtn.click().then(function() {
                    //verify all cleared in grpBy
                    return self.reportGroupByContainer.all(by.className('notEmpty')).then(function(grpItems) {
                        expect(grpItems.length).toBe(0);
                    }).then(function() {
                        //verify all cleared in sortBy
                        return self.reportSortByContainer.all(by.className('notEmpty')).then(function(sortItems) {
                            expect(sortItems.length).toBe(0);
                        }).then(function() {
                            //collapse the popup by clicking on X on popup
                            return self.reportSortAndGroupCloseBtn.click().then(function() {
                                reportServicePage.reportFilterSearchBox.click();
                                return reportServicePage.waitForElementToBeClickable(self.reportSortAndGroupBtn);
                            });
                        });
                    });
                });
            });
        };


    };
    ReportSortingPage.prototype = e2ePageBase;
    module.exports = ReportSortingPage;
}());
