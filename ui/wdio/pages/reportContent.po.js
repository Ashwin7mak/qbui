/**
 * This file uses the Page Object pattern to define locators for viewing report record content in qbGrid
 *
 * Created by klabak on 11/23/16
 */
(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = requirePO('e2ePageBase');
    var formsPO = requirePO('formsPage');
    var tablesPO = requirePO('tableCreate');
    let loadingSpinner = requirePO('/common/loadingSpinner');
    const sText = 'testTextValue';
    const sNumeric = 1;
    var ReportContentPage = Object.create(e2ePageBase, {
        // This gives you all the record checkboxes of the report page
        recordCheckBoxes: {
            get: function() {
                let checkBoxes = browser.elements('.selectRowCheckbox');
                //shift() is used to remove the first item in the array
                checkBoxes.value.splice(0, 1);
                return checkBoxes;
            }},
        deleteIcon: {get: function() {return browser.element('.icon-delete span');}},
        reportTitle: {get: function() {return browser.element('.formContainer .qbPanelHeaderTitleText');}},
        tableBody: {get: function() {return browser.element('.qbTbody');}},
        reportsToolBar : {get: function() {return browser.element('.reportToolbar');}},
        addRecordButton : {get: function() {return browser.element('.tableHomePageInitial .addRecordButton');}},
        settingsIconName : {get: function() {return '.qbIcon.iconUISturdy-settings';}},
        settingsIcon: {get: function() {return browser.element(this.settingsIconName);}},
        modifyTableSettings: {get: function() {return browser.element('.modifyTableSettings');}},
        tableHomepageLink: {get: function() {return browser.element('.tableHomepageLink');}},

        reportFilterSearchBox : {get: function() {
            return this.reportsToolBar.element('.searchInput');
        }},
        reportSearchEnterValues: {value: function(field) {
            //Check for the visibility of search box
            this.reportFilterSearchBox.waitForVisible();
            //Enter the value in the search box
            this.reportFilterSearchBox.setValue(field);
            this.waitForReportContent();
            //Needs this for the Dom to stabilize after loading the searched data
            browser.pause(e2eConsts.shortWaitTimeMs);
        }},
        clearSearch: {get: function() {return this.reportsToolBar.element('.clearSearch .searchIcon');}},
        clickAndWaitForGrid: {value: function(button) {
            button.click();
            this.qbGridContainer.waitForVisible();
        }},
        //Record add button on stage
        addRecordBtnOnStage : {get: function() {
            browser.element('.layout-stage .pageActions .addRecord').waitForVisible();
            return browser.element('.layout-stage .pageActions .addRecord');
        }},

        //edit pencil in report actions tool bar
        editPencilBtnOnReportActions : {get: function() {return browser.element('.reportActions .actionIcons .iconUISturdy-edit');}},

        //edit pencil in record actions
        editPencilBtnInRecordActions : {get: function() {return browser.elements('.recordActions .iconActionButton.edit');}},

        //TODO: Will need to extend these locators when we show multiple reports on a page
        // Report Container (encapsulates both the report toolbar and the report itself)
        reportContainerEl: {get: function() {
            browser.element('.reportContainer').waitForVisible();
            return browser.element('.reportContainer');
        }},

        // Title for report (found in the stage)
        stageTableHomepageTitleEl: {get: function() {return this.reportContainerEl.element('.tableHomepageStageHeadline');}},

        //Drop down menu actions icon
        dropDownIcon : {get: function() {return browser.element('.actionsCol .iconUISturdy-fries');}},
        dropDownDeleteIcon: {get: function() {return browser.element('.dropdown-menu .delete');}},

        reportToolsAndContentEl: {get: function() {return this.reportContainerEl.element('.reportToolsAndContentContainer');}},

        loadedContentEl : {get: function() {
            this.reportToolsAndContentEl.element('.loadedContent').waitForVisible();
            var elems = this.reportToolsAndContentEl.elements('.loadedContent');
            return elems.value[0];
        }},

        // Report content div containing column headers and the report content in qbGrid
        reportContentEl: {get: function() {
            this.reportContainerEl.element('.reportContent').waitForVisible();
            return this.reportContainerEl.element('.reportContent');
        }},

        // qbGrid contains both the column headers and the record content in qbGrid
        qbGridContainer: {get: function() {
            this.reportContentEl.element('.qbGrid').waitForVisible();
            return this.reportContentEl.element('.qbGrid');
        }},

        // Contains the entire set of column headers for the grid (the select all column and the field column headers)
        qbGridHeaderEl: {get: function() {return this.qbGridContainer.element('.qbHeaderCell');}},

        // Container for just the field column headers
        qbGridHeaderContainerEl: {get: function() {return this.qbGridHeaderEl.element('.qbHeader');}},

        // List of all field column headers from qbGrid
        qbGridColHeaderElList: {get: function() {return browser.elements('.qbHeaderCell');}},

        qbGridBodyViewportEl : {get: function() {return browser.element('.qbTbody');}},

        // Container for each records action column
        qbGridLeftColsContainerEl: {get: function() {return this.qbGridBodyViewportEl.element('.qbCell.stickyCell');}},

        // this will get you every row of the actions column
        qbGridRowActionsElList: {get: function() {return this.qbGridLeftColsContainerEl.elements('.qbRow');}},

        /**
         * Helper method to ensure the report has been properly loaded with records. Will throw an error if no records are in the report.
         * @returns A promise that will resolve after waiting for the report records to be displayed
         */
        waitForReportContent: {value: function() {
            // wait until you see .qbTbody
            browser.element('.qbTbody').waitForVisible();
            return browser.element('.qbRow').waitForVisible();
        }},

        /**
         * Helper method to ensure the leftNav has been properly loaded with tables Links with text.
         * @returns A promise that will resolve after waiting for the leftNav to be displayed
         */
        waitForLeftNavLoaded : {value: function() {
            //wait for apps Toggle area
            browser.element('.appsToggleArea').waitForExist();
            browser.element('.appsToggleArea').waitForVisible();
            //wait for table headings area
            browser.element('.tablesHeadingAndList .tablesHeading').waitForVisible();
            //wait until you see tables leftNav links labels
            browser.element('.tablesHeadingAndList .tablesList .leftNavLink').waitForVisible();
            //wait until text is shown up on leftNavLinks.Selected table is not loaded until all table properties are available
            return browser.waitForText('.tablesList .link', e2eConsts.mediumWaitTimeMs);
        }},
        getReportListUlEl: {
            get: function() {
                browser.element('.qbPanelBody .reportItems .reportLink').waitForVisible();
                return browser.elements('.qbPanelBody .reportItems .reportLink');
            }
        },
        /**
         * Helper function that will get all of the field column headers from the report. Returns an array of strings.
         */
        getReportColumnHeaders: {value: function() {
            var colHeaders = [];
            for (var i = 0; i < this.qbGridColHeaderElList.value.length; i++) {
                colHeaders.push(this.qbGridColHeaderElList.value[i].getAttribute('innerText').replace(/\w\S*/g,
                    function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}));
            }
            return colHeaders;
        }},

        /**
         * Returns a recordRowElement from the table based on the supplied index
         * @param recordIndex
         * @returns Resolved record row element at specified index
         */
        getAllRows: {get: function() {
            this.qbGridBodyViewportEl.element('.qbRow').waitForVisible();
            return this.qbGridContainer.elements('.qbRow');
        }},
        getRecordRowElement: {value: function(recordIndex) {
            return this.getAllRows.value[recordIndex];
        }},

        /**
         * Given a record element that is being viewed in qbGrid, return the cell elements for that row
         * @param recordRowElement
         * @returns a list of record cell elements
         */
        getRecordRowCells: {value: function(recordRowElement) {
            return recordRowElement.elements('.qbCell');
        }},

        /**
         * Given a record element that is being viewed in qbGrid, return the value of that cell
         * @param recordCellElement
         * @returns the value of a record cell element
         */
        getRecordCellValue: {value: function(recordCellElement) {
            // If cell element is a checkbox field do special handling to get the value
            if (recordCellElement.isExisting('.checkbox') === true) {
                // Check for a specific element in the DOM which only shows if the checkbox field is selected
                return recordCellElement.isExisting('.checkbox .checked');
            } else {
                // Otherwise just grab the textContent value
                return recordCellElement.getAttribute('textContent');
            }
        }},

        /**
         * Get a record row element that is being viewed in qbGrid (based on recordIndex), return the value of the specified cell index
         * If no cell index defined, function will return all values from all the cells
         * @param recordIndex
         * @param recordCellIndex
         * @returns either an array of cell values (as strings) or one value of a cell
         */
        getRecordValues: {value: function(recordIndex, recordCellIndex) {
            this.waitForReportContent();
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
         * Method to verify cell values in the embedded report for table child table A under parent table A -> report1 -> ListAll report
         */
        verifyFieldValuesInEmbeddedReportTable: {
            value: function (expectedRecordValues) {
                for (var i = 0; i < expectedRecordValues.length; i++) {
                    console.log("The expected values are: " + JSON.stringify(expectedRecordValues));
                    //text field
                    expect(expectedRecordValues[0]).toBe(sText.toString());
                    //numeric field
                    expect(expectedRecordValues[1]).toBe(sNumeric.toString());
                }
            }
        },

        /**
         * Strip the data from the first column of the table row
         * @param: recordIndex, recordCellIndex
         */
        getRecordData: {value: function(recordIndex, recordCellIndex) {
            let data = this.getRecordValues(recordIndex, recordCellIndex);
            data.shift();
            return data;
        }},

        /**
         * Function that will get all the records from the UI report table grid.
         *@returns an array of cell values (as strings)
         */
        getAllRecordsFromTable: {value: function() {
            var tableRecords = [];
            //get the count of records rows in a table
            var numOfRows = formsPO.getRecordsCountInATable();
            //for each record row get the cell values
            for (var i = 0; i < numOfRows; i++) {
                var cellValues = this.getRecordValues(i);
                //we need to remove record actions like print, email etc
                cellValues.splice(0, 1);
                tableRecords.push(cellValues);
            }
            return tableRecords;
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
            this.qbGridBodyViewportEl.waitForVisible();
            var rows = this.qbGridBodyViewportEl.elements('.qbRow');
            return rows.value.length;
        }},

        /**
         * Method to click settings Icon on Report Table
         */
        clickSettingsIcon: {value: function() {
            this.settingsIcon.waitForVisible();
            //Click on settings icon
            this.settingsIcon.click();
            //wait until you see dropdown list
            return this.modifyTableSettings.waitForVisible();
        }},

        /**
         * Method to click 'Table properties & settings' from the dropdown list
         */
        clickModifyTableSettings: {value: function() {
            // wait for 'Table properties & settings' button tobe visible
            this.modifyTableSettings.waitForVisible();
            //Click on 'Table properties & settings'
            this.modifyTableSettings.click();
            //wait until you see delete table action button
            return tablesPO.deleteTableActionButton.waitForVisible();
        }},

        /**
         * Method to click Add Record button on Report Table
         */
        clickAddRecordBtnOnStage: {value: function() {
            this.addRecordBtnOnStage.waitForVisible();
            //Click on add record button
            this.addRecordBtnOnStage.click();
            //wait until you see edit container and save buttons in footer
            formsPO.editFormContainerEl.waitForVisible();
            return formsPO.editFormSaveBtns.waitForVisible();
        }},

        /**
         * Given a record element in agGrid, click on the record.
         * @param recordRowIndex
         */
        clickOnRecordInReportTable : {value: function(recordRowIndex) {
            var recordRowEl = this.getRecordRowElement(recordRowIndex);
            // Hardcoded to click on the third cell of the record since clicking on email, phone etc will bring up popups.
            var recordCellEl = this.getRecordRowCells(recordRowEl).value[3];

            //scroll to third cell of recordRowIndex row
            if (browserName === 'chrome') {
                recordCellEl.moveToObject();
            } else {
                browser.execute(function(elelemt) {
                    elelemt.scrollIntoView(false);
                }, recordCellEl);
            }
            //Click on the third cell of recordRowIndex row
            return recordCellEl.click();
        }},

        /**
         * Given a record element in agGrid, click on the record to open it in view form mode.
         * @param recordRowIndex
         */
        openRecordInViewMode : {value: function(realmName, appId, tableId, reportId, recordId) {
            //navigate to record page directly
            var requestRecordPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/app/' + appId + '/table/' + tableId + '/report/' + reportId + '/record/' + recordId);
            browser.url(requestRecordPageEndPoint);
            // wait until spinner disappears
            browser.waitForVisible('.spinner', e2eConsts.longWaitTimeMs, true);
        }},

        /**
         * Given a record element in agGrid, click on the edit pencil for that record to open the edit form
         * @param recordRowIndex
         */
        clickRecordEditPencilInRecordActions : {value: function(recordRowIndex) {
            //get all edit buttons in the report table first column
            var getAllEdits = this.editPencilBtnInRecordActions.value.filter(function(edit) {
                return edit.index === recordRowIndex;
            });

            if (getAllEdits !== []) {
                //Click on filtered save button
                getAllEdits[0].click();
                formsPO.editFormContainerEl.waitForVisible();
                //need these for trowser to drop down
                return browser.pause(e2eConsts.shortWaitTimeMs);
            } else {
                throw new Error('Edit button not found at row ' + recordRowIndex);
            }
        }},

        /**
         * Given a record element in agGrid, click on the checkbox to select that record and then click on edit pencil from the table actions
         * @param recordRowIndex
         */
        clickRecordEditPencilInTableActions : {value: function(recordRowIndex) {
            //get all checkboxes in the report table first column
            var getAllCheckBoxs = browser.elements('input.selectRowCheckbox').value.filter(function(checkbox) {
                return checkbox.index === recordRowIndex;
            });

            if (getAllCheckBoxs !== []) {
                //Click on filtered save button
                getAllCheckBoxs[0].click();
                //wait for edit pencil to be visible
                this.editPencilBtnOnReportActions.waitForVisible();
                //click on the edit pencil in table actions
                this.editPencilBtnOnReportActions.click();
                //wait until edit form is visible
                formsPO.editFormContainerEl.waitForVisible();
                //need these for trowser to drop down
                return browser.pause(e2eConsts.shortWaitTimeMs);
            } else {
                throw new Error('Checkbox not found at row ' + recordRowIndex);
            }
        }},

        // TODO: Refactor these once we port over the delete record tests
        // Checking for the deleted record on the first page

        checkForTheAbsenceDeletedRecordOnTheCurrentPage: {
            value: function(deletedRecord) {
                for (var i = 1; i < browser.elements('.qbRow').value.length; i++) {
                    expect(deletedRecord).not.toEqual(this.getRecordValues(i));
                }
            }},

        checkForThePresenceDeletedRecordOnTheCurrentPage: {
            value: function(deletedRecord) {
                //this will check each row
                for (var i = 1; i < browser.elements('.qbRow').value.length; i++) {
                    if (this.compareTwoRows(deletedRecord, this.getRecordValues(i))) {
                        return true;
                    }
                }
                return false;
            }},

        compareTwoRows: {
            value: function(rowA, rowB) {

                expect(rowA.length).toBe(rowB.length);
                for (var i = 1; i < rowA.length; i++) {
                    //comparing two cells from two rows
                    if (rowA[i] !== rowB[i]) {
                        return false;
                    }
                }
                return true;

            }},

        // Record Row to be selected:
        selectRowAndClickDeleteIcon: {value: function(recordRow) {
            this.recordCheckBoxes.value[recordRow].click();
            this.deleteIcon.waitForVisible();
            return this.deleteIcon.click();
        }},

        //Select a report from tables page with reportID being the index of the report
        selectReport: {value: function(tableName, reportIndex) {
            //wait unti leftNav is loaded
            this.waitForLeftNavLoaded();
            //Select the tabe
            tablesPO.selectTable(tableName);
            //Click on reports menu
            browser.element('.selected .iconUISturdy-report-menu-3').waitForVisible();
            browser.element('.selected .iconUISturdy-report-menu-3').click();
            //wait for container to slide down
            browser.pause(e2eConsts.mediumWaitTimeMs);
            browser.element('.reportGroups .reportGroup .open').waitForVisible();
            //Filter the reports
            var allReports = this.getReportListUlEl.value.filter(function(report) {
                return report.index === reportIndex;
            });

            if (allReports !== []) {
                //Click on the report
                allReports[0].element('.iconUISturdy-report-table').waitForVisible();
                allReports[0].element('.iconUISturdy-report-table').click();
                //wait for container to slide away
                browser.pause(e2eConsts.mediumWaitTimeMs);
                //wait for reportContent to load
                return this.waitForReportContent();
            }
        }},

        // /***********************
        //  * Small Breakpoint elements and helper methods
        // **********************/
        //
        //add new record button element
        addRecordBtnSB: {
            get: function() {
                return browser.element('.reportToolsAndContentContainer .addNewRecord');
            }
        },
        // sort and group button element on report page
        reportSortGrpBtnSB: {
            get: function() {
                return browser.element('.sortButton');
            }
        },
        //returns cell values for all the rows
        getAllRowsCellValuesSB: {
            get: function() {
                browser.element('.fieldRow').waitForVisible();
                return browser.elements('.fieldValue');
            }
        },
        //Element for dropdownToggle ActionButton
        dropdownToggleActionButtonSB: {
            get: function() {
                return browser.element('.qbIcon.iconUISturdy-fries');
            }
        },
        //Element for card-expander
        cardExpanderButtonSB: {
            get: function() {
                return browser.element('.qbPanelHeaderIcon.rotateUp.qbIcon.iconUISturdy-caret-up');
            }
        },
        /**
         * Helper method to ensure the report has been properly loaded with records. Will throw an error if no records are in the report.
         * @returns A promise that will resolve after waiting for the report records to be displayed
         */
        waitForReportContentSB: {
            value: function() {
                // wait until you see .records count
                return browser.element('.recordsCount').waitForVisible();
            }
        },

        /**
         * Helper method that will load a report for you in your browser by directly hitting a generated URL
         * @param realmName
         * @param appId
         * @param tableId
         * @param reportId
         * @returns A promise that will resolve after loading the generated URL
         */
        loadReportByIdInBrowserSB: {
            value: function(realmName, appId, tableId, reportId) {
            //navigate to the url
                browser.url(e2eBase.getRequestReportsPageEndpoint(realmName, appId, tableId, reportId));
            //wait for the report content to be visible
                return this.waitForReportContentSB();
            }
        },
        /**
         * Function that will click on the Add record button on report page
         */
        clickAddRecordBtnSB: {
            value: function() {
                browser.element('.reportToolsAndContentContainer .addNewRecord').waitForVisible();
                browser.element('.reportToolsAndContentContainer .addNewRecord').click();
                return  browser.element('.editForm').waitForVisible();
            }
        },
        /**
         * Function that will click on the DropdownToggleActionButton
         */
        clickDropdownToggleActionButtonSB: {
            value: function() {
                expect(this.dropdownToggleActionButtonSB.isVisible()).toBe(true);
                expect(this.dropdownToggleActionButtonSB.isEnabled()).toBe(true);
                return browser.element('.qbIcon.iconUISturdy-fries').click();
            }
        },
        /**
         * Function that will click on the card expander button
         */
        clickCardExpanderButtonSB: {
            value: function() {
                expect(this.cardExpanderButtonSB.isVisible()).toBe(true);
                expect(this.cardExpanderButtonSB.isEnabled()).toBe(true);
                return browser.element('.qbPanelHeaderIcon.rotateUp.qbIcon.iconUISturdy-caret-up').click();
            }
        },

    });

    module.exports = ReportContentPage;
}());

