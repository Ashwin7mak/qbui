(function() {
    'use strict';
    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');
    let loadingSpinner = requirePO('/common/loadingSpinner');

    // Lodash utility library
    var _ = require('lodash');
    var recordsFromAllListReport;

    var ReportSortingGroupingPage = Object.create(e2ePageBase, {
        //report sort Grp button on reports page
        reportSortGrpBtnOnReportsPage : {get: function() {return browser.element('.sortButton');}},
        //sort group container
        sortGroupDlg : {get: function() {return browser.element('.settingsDialog');}},
        //sort group button in the dialogue
        sortGroupDlgBtn : {get: function() {return this.sortGroupDlg.element('.sortButtonSpan');}},
        //sort Grp dialogue close button
        sortGroupDlgCloseBtn : {get: function() {return this.sortGroupDlg.element('.overlayRight .iconUISturdy-close');}},
        //sort grp dialogue apply button
        sortGroupDlgApplyBtn : {get: function() {return this.sortGroupDlg.element('.dialogBottom .apply');}},
        //sort grp dialogue apply button
        sortGroupDlgResetBtn : {get: function() {return this.sortGroupDlg.element('.dialogBottom .reset');}},

        //GroupBy container
        groupBySettings : {get: function() {return browser.element('.groupBySettings .fieldSelectorContainer');}},

        //sort by container
        sortBySettings : {get: function() {return browser.element('.sortBySettings .fieldSelectorContainer');}},

        //fields Panel
        fieldsPanel : {get: function() {return browser.element('.fieldsPanel');}},
        //field panel title
        fieldsPanelTitle : {get: function() {return this.fieldsPanel.element('.fieldPanelHeader span span');}},
        //panel cancel
        fieldsPanelCancel: {get: function() {return this.fieldsPanel.element('.cancel');}},
        //record Id in field panels
        recordID: {get: function() {return browser.element('//span[@class="fieldName" and text()="Record ID#"]');}},

        /**
         * Method to Select record ID# from field panels
         */
        sortByRecordID: {value: function() {
            this.reportSortGrpBtnOnReportsPage.waitForVisible();
            this.reportSortGrpBtnOnReportsPage.click();
            this.sortBySettings.waitForVisible();
            this.clickInEmptyFieldInSortGrpDlg(this.sortBySettings, 'Choose a field to sort by');
            this.ClickMoreFieldsLinkInFieldsPanel();
            // this.recordID.waitForExist();
            if (browserName === 'safari') {
                browser.execute(function() {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 2
                    });
                    document.getElementsByClassName('list-group')[0].getElementsByClassName('notInReport')[1].dispatchEvent(event);
                });
            } else {
                this.recordID.click();
            }
            return reportContentPO.clickAndWaitForGrid(this.sortGroupDlgApplyBtn);
        }},

        /**
         * Method to click sort/Grp button in reports page.
         */
        clickSortGroupIconOnReportsPage : {value: function() {
            //wait until you see sort/grp button
            this.reportSortGrpBtnOnReportsPage.waitForVisible();
            //click on srtGrp button on reports page
            this.reportSortGrpBtnOnReportsPage.click();
            //wait until you see sort/grp container
            this.sortBySettings.waitForVisible();
            //TODO Need this sometimes getting stale element
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /**
         * Method to click Apply button on the Srt/Grp Container.
         */
        clickContainerApplyBtn : {value: function() {
            //wait until you see apply btn
            this.sortGroupDlgApplyBtn.waitForVisible();
            //click on apply btn
            this.sortGroupDlgApplyBtn.click();
            return loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        }},

        /**
         * Method to click Reset button on the Srt/Grp Container.
         */
        clickContainerResetBtn : {value: function() {
            //wait until you see apply btn
            this.sortGroupDlgResetBtn.waitForVisible();
            //click on apply btn
            this.sortGroupDlgResetBtn.click();
            return loadingSpinner.waitUntilLoadingSpinnerGoesAway();
        }},

        /**
         * Method to click Close button on the Srt/Grp Container.
         */
        clickContainerCloseBtn : {value: function() {
            //wait until you see apply btn
            this.sortGroupDlgCloseBtn.waitForVisible();
            //click on apply btn
            return this.sortGroupDlgCloseBtn.click();
        }},

        /**
         * Method to click in empty field of the specified container.
         * @param containerName (ie group or sort setting)
         * @param containerPanelTitle (ie group or sort fields panel title)
         */
        clickInEmptyFieldInSortGrpDlg : {value: function(containerName, containerPanelTitle) {
            containerName.waitForVisible();
            containerName.element('.empty').waitForVisible();
            containerName.element('.empty').click();
            //Verify fields panel dialogue
            return this.verifyFieldPanelDlg(containerPanelTitle);
        }},

        /*
         * Function to select sort/Grp By Items
         * @param containerName (ie group or sort setting)
         * @param containerPanelTitle (ie group or sort fields panel title)
         * @param fieldNameToSelect
         */
        selectFieldsInSrtGrpDlg : {value: function(containerName, fieldPanelTitle, fieldNameToSelect) {
            containerName.waitForVisible();
            //Click on empty field
            this.clickInEmptyFieldInSortGrpDlg(containerName, fieldPanelTitle);
            //select the field Items
            return this.selectFieldsFromFieldsPanel(fieldNameToSelect);
        }},

        /**
         * Method to get all nonEmpty fields of the specified container.
         * @param containerName (ie group or sort setting)
         */
        getAllNonEmptyFieldValues : {value: function(containerName) {
            var results = [];
            containerName.waitForVisible();
            containerName.elements('.notEmpty .fieldName').value.map(function(field) {
                results.push(field.getAttribute('textContent'));
            });
            return results;
        }},

        /*
         * Method to verify nonEmpty fields and their actions in specified container
         * @param containerName (ie group or sort setting)
         * @param fieldsToVerify (Array of fields to verify)
         */
        verifyNonEmptyFieldsInSortGrpDlg : {value: function(containerName, fieldsToVerify) {
            var results = [];
            containerName.waitForVisible();
            //Filter all nonEmpty fields in specified container
            containerName.elements('.notEmpty').value.map(function(fields) {
                results.push(fields);
            });

            if (results !== []) {
                //for each nonEmpty field
                results.forEach(function(result) {
                    //verify the delete button visible beside the field
                    result.element('.fieldDeleteIcon').waitForVisible();

                    //verify the sort order button visible beside the field
                    //TODO disable the below as it is bug MC-1515. Right now sort Order is not displayed in the UI.
                    //result.element('.sortOrderIcon').waitForVisible();

                    //Verify the prefix is 'By' for first field and 'then by' for remaining fields
                    if (result.index === 0) {
                        expect(result.element('.prefix').getAttribute('textContent')).toBe('by');
                    } else {
                        expect(result.element('.prefix').getAttribute('textContent')).toBe('then by');
                    }
                });

                var nonEmptyFields = this.getAllNonEmptyFieldValues(containerName);
                //Verify the field Names
                expect(nonEmptyFields).toEqual(fieldsToVerify);

            } else {
                browser.logger.error('There are no nonEmpty fields filtered for container ' + containerName);
                throw new Error('Cannot verify actions for fields ' + fieldsToVerify);
            }
        }},

        /*
         * Method to delete fields in specified container
         * @param containerName (ie group or sort setting)
         */
        deleteAllFieldsFromSrtGrpDlg : {value: function(containerName) {
            var results = [];
            containerName.waitForVisible();
            //Filter nonEmpty fields to match with fieldToDelete
            containerName.elements('.notEmpty').value.map(function(field) {
                results.push(field);
            });

            //if filtered elements not empty
            if (results !== []) {
                results.forEach(function(result) {
                    //wait for delete button to be visible
                    result.element('.fieldDeleteIcon').waitForVisible();
                    //click on delete button
                    result.element('.fieldDeleteIcon').click();
                    //Need this to wait for rendering
                    return browser.pause(e2eConsts.shortWaitTimeMs);
                });
            } else {
                browser.logger.error('There are no nonEmpty fields for container ' + containerName);
                throw new Error('There are no fields in sort/grp container to delete');
            }
        }},

        /*
         * Method to delete fields in specified container
         * @param containerName (ie group or sort setting)
         * @param fieldToDelete
         */
        deleteFieldsFromSrtGrpDlg : {value: function(containerName, fieldToDelete) {
            containerName.waitForVisible();
            //Filter nonEmpty fields to match with fieldToDelete
            var results = containerName.elements('.notEmpty').value.filter(function(field) {
                return field.element('.fieldName').getAttribute('textContent') === fieldToDelete;
            });

            //if filtered elements not empty
            if (results !== []) {
                //wait for delete button to be visible
                results[0].element('.fieldDeleteIcon').waitForVisible();
                //click on delete button
                results[0].element('.fieldDeleteIcon').click();
                //Need this to wait for rendering
                return browser.pause(e2eConsts.shortWaitTimeMs);
            } else {
                browser.logger.error('The field with name ' + fieldToDelete + ' is not found for container ' + containerName);
                throw new Error('Cannot delete value for field ' + fieldToDelete);
            }
        }},

        /*
         * Method to sort fields in sort container
         * @param fieldToSort
         */
        sortFieldsFromSrtGrpDlg : {value: function(fieldToSort, sortOrder) {
            this.sortBySettings.waitForVisible();
            //Filter nonEmpty fields to match with fieldToSort
            var results = this.sortBySettings.elements('.notEmpty').value.filter(function(field) {
                return field.element('.fieldName').getAttribute('textContent') === fieldToSort;
            });

            //if filtered elements not empty
            if (results !== []) {
                //wait for sort button to be visible
                results[0].element('.sortOrderIcon').waitForVisible();
                //click on sort button
                if (sortOrder === 'desc') {
                    results[0].element('.sortOrderIcon').click();
                    //Need this to wait for rendering
                    return browser.pause(e2eConsts.shortWaitTimeMs);
                }
            } else {
                browser.logger.error('The field with name ' + fieldToSort + ' is not found for container ' + this.sortBySettings);
                throw new Error('Cannot sort value for field ' + fieldToSort);
            }
        }},

        /*
         * Method to verify field Panel
         * @title
         */
        verifyFieldPanelDlg : {value: function(title) {
            //wait until you see field panel
            this.fieldsPanel.waitForVisible();
            //Verify cancel button is enabled
            return expect(browser.isEnabled('.fieldsPanel .cancel')).toBe(true);
            //TODO Element fieldsPanelTitle not getting identified
            //Verify the title of the field panel
            //expect(this.fieldsPanelTitle.getAttribute('textContent')).toBe(title);
        }},

        /*
         * Method to click on more Fields link in the fields panel
         */
        ClickMoreFieldsLinkInFieldsPanel : {value: function() {
            this.fieldsPanel.waitForVisible();
            //TODO Scroll function disabled until it is fixed to work in Safari(mobile): MC-2598
            //this.fieldsPanel.element('.list-group .moreFields').scroll();
            //Click on more fields using JS click since scroll is not working on safari
            if (browserName === 'safari') {
                browser.execute(function() {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 2
                    });
                    document.getElementsByClassName('list-group')[0].getElementsByClassName('moreFields')[0].dispatchEvent(event);
                });
            } else {
                //scroll to an element
                this.fieldsPanel.element('.list-group .moreFields').scroll();
                //Click on more fields
                this.fieldsPanel.element('.list-group .moreFields').click();
            }
            ////Need this to wait for more fields to load
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /*
         * Method to click on specified fields in the fields panel
         * @param fieldItemToSelect
         */
        selectFieldsFromFieldsPanel : {value: function(fieldItemToSelect) {
            //wait until you see field panel
            this.fieldsPanel.waitForVisible();
            //filter field Items from fields Panel
            var results = browser.elements('.list-group .fieldName').value.filter(function(field) {
                return field.getAttribute('textContent') === fieldItemToSelect;
            });

            if (results !== []) {
                //Click on filtered field name
                results[0].click();
                this.groupBySettings.waitForVisible();
                //Need this to wait for container to slide away
                return browser.pause(e2eConsts.shortWaitTimeMs);
            }
        }},

        /*
         * Method to get all fields in fields panel
         */
        getAllFieldsFromFieldPanelValues : {value: function() {
            var results = [];
            //wait until you see field panel
            this.fieldsPanel.element('.list-group .fieldName').waitForVisible();
            //get all fieldNames from the panel
            this.fieldsPanel.elements('.list-group .fieldName').value.map(function(field) {
                results.push(field.getAttribute('textContent'));
            });
            return results;
        }},

        /**
         * Method to click Panel Cancel button on the fields panel.
         */
        clickPanelCancelBtn : {value: function() {
            //wait until you see apply btn
            this.fieldsPanelCancel.waitForVisible();
            //click on apply btn
            return this.fieldsPanelCancel.click();
        }},

        /**
         * Method to get all headers and grouped records from the report table
         */
        getGroupedTableRows : {value: function() {
            var groupHeaders = [];
            var recordRows;
            browser.element('.groupHeader').waitForVisible();
            //get all group headers
            this.getAllGroupHeadersList.value.filter(function(header) {
                return groupHeaders.push(header.getAttribute('textContent'));
            });

            //get all rows in the table
            recordRows = reportContentPO.getAllRecordsFromTable();

            return [groupHeaders, recordRows];
        }},

        /*
         * The below are for Group Sort Via Column Header
         */

        /**
         * Returns all group headers
         * @returns Array of group headers
         */
        getAllGroupHeadersList: {get: function() {
            return browser.elements('.groupHeader');
        }},

        /*
         * Function to sort Records using loDash _.orderBy
         * @param recordsToSort
         * @param columnListToSort
         * @param sortOrder
         */
        sortRecordsUsingLoDash: {value: function(recordsToSort, columnListToSort, sortOrder) {
            // sorts the list of records passed in specified sort order for a given fid.
            return _.orderBy(recordsToSort, columnListToSort, sortOrder);
        }},

        /*
         * This function gets the value in the record parameter (array of field value pairs), where id matches the fid specified in the parameter
         * Function is a custom sort function used by lodash from within the sortRecords function
         * @param record
         * @param fid
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
            var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsResultsEndpoint(appId, tableId, reportId);
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
         * Function that will group and sort the records using lodash in asked order
         *@parms Fids, sortFids and sortOrder
         */
        SortAndGroupFidsUsingLoDash: {value: function(records, sortFids, sortOrder, groupFids) {
            var sortedAPIRecords;
            var sortedObjects = [];
            var groupedAPIRecords;
            var self = this;

            var groupedExpectedRecords = [];

            //sort the records first
            sortedAPIRecords = self.sortRecordsUsingLoDash(records, sortFids, sortOrder);

            // Reduce the records to single object for grouping
            sortedAPIRecords.forEach(function(sortedRecord) {
                var obj = _.reduce(sortedRecord, function(t, i) {
                    t[i.id] = i.value;
                    return t;
                }, {});
                sortedObjects.push(obj);
            });

            //Group by groupFid
            groupedAPIRecords = _.groupBy(sortedObjects, groupFids);

            //Seperate out Keys(which are headers in UI) from an object
            var headers = Object.keys(groupedAPIRecords);

            //Seperate out Values(which are records in UI) from an object
            var vals = _.values(groupedAPIRecords);

            //For each of record Value object return just values (this is to match with UI)
            vals.forEach(function(recordValue) {
                recordValue.forEach(function(record) {
                    //remove the grouped FID from the records object since UI removes the grouped FID
                    record = _.omit(record, groupFids);
                    groupedExpectedRecords.push(_.values(record));
                });
            });
            return [headers, groupedExpectedRecords];
        }},

        /**
         * Function that will verify the actual versus expected sorted records
         *@parms actualSortedResults, expectedsortedResults
         */
        verifySortedResults: {value: function(actualSortedResults, expectedSortedResults) {
            expect(actualSortedResults.join()).toEqual(expectedSortedResults.join());
        }},

        /*
         * Function will select the Item passed in parameter from the column header popup menu
         */
        selectColumnHeaderMenuItem: {value: function(itemToSelect) {
            var items = reportContentPO.qbGridContainer.element('.dropdown.open .dropdown-menu').elements('li').value.filter(function(elm) {
                return elm.getAttribute('textContent') === itemToSelect;
            });

            if (items !== []) {
                items[0].element('a').waitForVisible();
                items[0].element('a').click();
                loadingSpinner.waitUntilLoadingSpinnerGoesAway();
                //wait until report rows in table are loaded
                return reportContentPO.waitForReportContent();
            } else {
                browser.logger.error('Item with name ' + itemToSelect + ' not found under column header menu');
                throw new Error('Item with name ' + itemToSelect + ' not found under column header menu');
            }
        }},
        /*
         * Function will open the column headers popUp menu
         * @param columnName
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
                browser.logger.error('Column Header with name ' + columnName + ' not found');
                throw new Error('Column Header with name ' + columnName + ' not found');
            }
        }},

        /*
         * Function will Expand the Column header Menu and select the Item passed in parameter
         * @params columnName, itemToSelect
         */
        expandColumnHeaderMenuAndSelectItem: {value: function(columnName, itemToSelect) {
            //open the Column Header PopUp Menu
            this.openColumnHeaderMenu(columnName);

            //Select the sort order Item to be Ascending (eg:A to Z , small to Large, lower to highest etc)
            return this.selectColumnHeaderMenuItem(itemToSelect);
        }},

        /*
         * Function will Expand the Column header Menu and select the Item passed in parameter
         * @params columnName, itemToVerifySelected
         */
        expandColumnHeaderMenuAndVerifySelectedItem: {value: function(columnName, itemToVerifySelected) {
            //open the Column Header PopUp Menu
            this.openColumnHeaderMenu(columnName);

            //Verify the sort order Item and checkmark beside it
            return this.verifyColumnHeaderMenuItemSelected(itemToVerifySelected);
        }},

        /*
         * Function will select the Item passed in parameter from the column header popup menu
         * @param itemToVerify
         */
        verifyColumnHeaderMenuItemSelected: {value: function(itemToVerify) {
            var items = reportContentPO.qbGridContainer.elements('.dropdown-menu').elements('li').value.filter(function(elm) {
                return elm.getText() === itemToVerify;
            });

            if (items !== []) {
                //verify the check mark beside the item selected
                expect(items[0].element('.iconUISturdy-checkmarkincircle-outline').isVisible()).toBe(true);
            } else {
                browser.logger.error('Item with name ' + itemToVerify + ' not found under column header menu');
                throw new Error('Item with name ' + itemToVerify + ' not found under column header menu');
            }
        }},
    });
    module.exports = ReportSortingGroupingPage;
}());
