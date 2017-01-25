/**
 * This file uses the Page Object pattern to define locators for performing in-line actions on records
 *
 * Created by klabak on 11/25/16
 */
(function() {
    'use strict';
    // var reportContent = require('./reportContent.po');
    var reportContent = require('./qbGRidReportContent.po');
    var e2ePageBase = require('./e2ePageBase.po');
    var assert = require('assert');

    var saveRecordInlineEdit  = '.qbGrid .saveRecord';
    var cancelRecordInlineEdit = '.qbGrid .cancelSelection';
    var addRecordInlineEdit = '.qbGrid .addRecord';

    var ReportInLineEditPage = Object.create(reportContent, {

        //TODO: Move tableActionsContainer to another PO
        // Report tools and content container (toolbar locators are in another PO)
        //this.reportToolsAndContentEl = this.reportContainerEl.element(by.className('reportToolsAndContentContainer'));
        //// Loaded Content Div
        //this.loadedContentEl = this.reportToolsAndContentEl.all(by.className('loadedContent')).first();
        //// Report table
        //this.reportTable = this.loadedContentEl.element(by.className('reportTable'));
        //// Table actions container
        //this.reportToolbarContainerEl = this.reportToolsAndContentEl.element(by.className('reportToolbarContainer'));
        //// Report toolbar
        //this.reportsToolBar = element(by.className('reportToolbar'));
        //// Report records count
        //this.reportRecordsCount = element(by.className('recordsCount')).element(by.tagName('SPAN'));
        //// Report filter search Box
        //this.reportFilterSearchBox = this.reportsToolBar.element(by.className('searchInput'));
        //// Table actions container
        //this.tableActionsContainerEl = this.loadedContentEl.element(by.className('tableActionsContainer'));

        /**
         * In-line Edit Record Menu on the Reports Page
         */

        // We append the editing class to the row being edited
        // Return the row being edited
        getInLineEditRecordMenu: {value: function() {
            return browser.element('.qbGrid.editing');
        }},

        // Returns the save record button for the record being edited
        getSaveRecordButton: {value: function() {
            return browser.element(saveRecordInlineEdit);
        }},
        // Returns the cancel button
        getCancelRecordButton: {value: function() {
            return browser.element(cancelRecordInlineEdit);
        }},
        // Returns the Save and Add New record butotn
        getSaveAddNewRecordButton: {value: function() {
            return browser.element(addRecordInlineEdit);
        }},

        // Notification Container for In-line edit actions
        notificationContainerEl: {get: function() {return browser.element('.notification-container');}},
        notificationSuccessPopupEl: {get: function() {return this.notificationContainerEl.element('.notification-success');}},

        /**
         * Given a record element in agGrid, double click on the record to open the edit menu
         * @param recordRowIndex
         */
        openRecordEditMenu: {value: function(recordIndex) {
            var recordRowEl = reportContent.getRecordRowElement(recordIndex);
            // Hardcoded to click on the first cell of the record
            console.log('recordRowEl: ', recordRowEl);
            //Get a single qbCell from the row
            var recordCellEl = reportContent.getRecordRowCells(recordRowEl).value[5];
            //Focus on the cellData from qbCell
            var cellData = recordCellEl.element('.cellData');
            //Get the pencil from the qbCell
            var cellEditIcon = recordCellEl.element('.cellEditIcon');
            // See http://webdriver.io/api/protocol/execute.html
            //TODO: Make generic double click function in e2ePageBase
            if (browserName === 'chrome') {
                //Hover over the cell
                browser.moveToObject(cellData.selector);
                //Then once the pencil is visible hover over the pencil
                browser.moveToObject(cellEditIcon.selector);
                browser.element('.cellEditIcon.qbIcon.iconTableUISturdy-edit').click();
            } else {
                browser.execute(function(recordCellElement) {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 2
                    });
                    recordCellElement.dispatchEvent(event);
                }, recordCellEl);
            }
            this.getInlineEditRecord().waitForVisible();
        }},

        //Assert three buttons not to be present
        assertInlineEditMenuButtonsTobeTrue:{value: function() {
            expect(browser.isVisible(saveRecordInlineEdit)).toBeTruthy();
            expect(browser.isVisible(cancelRecordInlineEdit)).toBeTruthy();
            expect(browser.isVisible(addRecordInlineEdit)).toBeTruthy();
        }},

        //Assert three buttons to be present
        assertInlineEditMenuButtonsTobeFalse:{value: function() {
            expect(browser.isVisible(saveRecordInlineEdit)).toBeFalse();
            expect(browser.isVisible(cancelRecordInlineEdit)).toBeFalse();
            expect(browser.isVisible(addRecordInlineEdit)).toBeFalse();
        }},

        /**
         * Find and click the save button for the record being edited
         */
        clickSaveChangesButton: {value: function() {
            var saveRecordButtonEl = this.getSaveRecordButton();

            //step 1-  Wait for the button to be visible
            saveRecordButtonEl.waitForVisible();
            try {
                //step 2 - Click on save button
                saveRecordButtonEl.click();

                //step 3 - After save button click wait for inline edit menu to disappear as to confirm that click event worked
                browser.waitForVisible(cancelRecordInlineEdit, e2eConsts.mediumWaitTimeMilliseonds, true);
            } catch (err) {

                console.log("Checking to see if WebdriverIO command throws an error - Trying again with JS. \n Error = " + err.toString());
                // Catch an error from above and then retry
                // Single click via raw javascript
                browser.execute(function() {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 1
                    });
                    document.querySelector('.ag-row.editing .saveRecord').dispatchEvent(event);
                });
                browser.waitForVisible(cancelRecordInlineEdit, e2eConsts.mediumWaitTimeMilliseonds, true);
            }
        }},

        /**
         * Find and click inline Edit Menu 'Save and Add a new Row' button
         */
        clickSaveAddNewRowButton: {value: function() {
            this.getSaveAddNewRecordButton().waitForVisible();
            this.getSaveAddNewRecordButton().click();
        }},

        /**
         * Find and click the cancel button for the record being edited
         */
        clickCancelButton: {value: function() {
            var cancelRecordButtonEl = this.getCancelRecordButton();

            cancelRecordButtonEl.waitForVisible();
            try {
                cancelRecordButtonEl.click();
                // By setting the true flag it will do the inverse of the function (in this case wait for it to be invisible)
                browser.waitForVisible(cancelRecordInlineEdit, e2eConsts.mediumWaitTimeMilliseonds, true);
            } catch (err) {

                console.log("Checking to see if WebdriverIO command throws an error - Trying again with JS. \n Error = " + err.toString());
                // Catch an error from above and then retry
                // Single click via raw javascript
                browser.execute(function() {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 1
                    });
                    document.querySelector('.ag-row.editing .cancelSelection').dispatchEvent(event);
                });
                browser.waitForVisible('.ag-row.editing .saveRecord', e2eConsts.mediumWaitTimeMilliseonds, true);
            }
        }},

        /**
         * Asserts that the notification contains a particular text value
         * @param Text to assert is the notification element
         */
        assertSuccessMessage: {value: function(successMessage) {
            if (browserName !== 'safari') {
                this.notificationSuccessPopupEl.waitForVisible();
                var messageText = this.notificationSuccessPopupEl.getText();
                expect(messageText).toContain(successMessage.toString(), 'Expected Message not found');
            }}},

        /**
         * Loop through the records being displayed and return the one being edited
         * @returns The record element being edited
         */
        getInlineEditRecord: {value: function() {
            var recordRowElements = reportContent.agGridRecordElList.elements('tr');
            var recordBeingEdited;
            console.log('recordRowElements: ', recordRowElements);
            browser.debug();
            // Loop through the records and find the one being edited
            for (var i = 0; i < recordRowElements.value.length; i++) {
                var recordRowElement = recordRowElements.value[i];
                // Check the class of each element for 'editing'
                var elementClass = recordRowElement.getAttribute('class');
                console.log('recordRowElement: ', recordRowElement);
                console.log('elementClass: ', elementClass);
                // browser.debug();
                if (elementClass.indexOf('qbRow editing') !== -1) {
                    // Found our record element
                    recordBeingEdited = recordRowElements.value[i];
                }
            }
            return recordBeingEdited;
        }},

        /**
         * Returns all input cells for the record being edited (regardless of field type)
         * @returns Array of input cells
         */
        getInlineEditRecordInputCells: {value: function() {
            var recordBeingEdited = this.getInlineEditRecord();
            return recordBeingEdited.elements('input');
        }},

        /**
         * Returns all text input cells for record being edited
         * @returns Array of text input cells
         */
        getTextFieldInputCells: {value: function() {
            var recordBeingEdited = this.getInlineEditRecord();
            return recordBeingEdited.elements('input[type="text"].textField');
        }},

        /**
         * Enters text into a specified Text Field. Clears any existing data first.
         * @param textFieldIndex - The text field to edit by index
         * @param textToEnter - The text to enter
         */
        //TODO: Lots of duplication with these editField functions (make generic)
        editTextField: {value: function(textFieldIndex, textToEnter) {
            var textFieldInputCells = this.getTextFieldInputCells();
            var textInputCell = textFieldInputCells.value[textFieldIndex];

            //TODO: Make generic moveToObject function in e2ePageBase
            if (browserName === 'chrome') {
                textInputCell.moveToObject();
            } else {
                browser.execute(function(textInputCellElement) {
                    textInputCellElement.scrollIntoView(false);
                }, textInputCell);
            }
            textInputCell.setValue(textToEnter);
            // expect(textInputCell.getText()).toBe(textToEnter);
            // browser.pause(500);
        }},

        /**
         * Returns all numeric input cells for record being edited
         * @returns Array of numeric input cells
         */
        getNumericFieldInputCells: {value: function() {
            var recordBeingEdited = this.getInlineEditRecord();
            return recordBeingEdited.elements('input[type="text"].numericField');
        }},

        /**
         * Enters a numeric value into a specified Numeric Field. Clears any existing data first.
         * @param numericFieldIndex - The numeric field to edit by index
         * @param numToEnter - The number to enter
         */
        editNumericField: {value: function(numericFieldIndex, numToEnter) {
            //TODO: This code is duplicated. Can create a generic function w/ some wrappers
            var numericFieldInputCells = this.getNumericFieldInputCells();
            var numericInputCell = numericFieldInputCells.value[numericFieldIndex];

            if (browserName === 'chrome') {
                numericInputCell.moveToObject();
            } else {
                browser.execute(function(numericInputCellElement) {
                    numericInputCellElement.scrollIntoView(false);
                }, numericInputCell);
            }
            numericInputCell.setValue(numToEnter);
        }},

        /**
         * Returns all numeric input cells for record being edited
         * @returns Array of numeric input cells
         */
        getDateFieldInputCells: {value: function() {
            var recordBeingEdited = this.getInlineEditRecord();
            return recordBeingEdited.elements('.cellEdit.dateCell input');
        }},

        /**
         * Enters a date value into a specified Date Field. Clears any existing data first.
         * @param dateFieldIndex - The date field to edit by index
         * @param dateToEnter - The date to enter
         */
        editDateField: {value: function(dateFieldIndex, dateToEnter) {
            var dateFieldInputCells = this.getDateFieldInputCells();
            var dateInputCell = dateFieldInputCells.value[dateFieldIndex];

            if (browserName === 'chrome') {
                dateInputCell.moveToObject();
            } else {
                browser.execute(function(dateInputCellElement) {
                    dateInputCellElement.scrollIntoView(false);
                }, dateInputCell);
            }
            dateInputCell.setValue(dateToEnter);
        }},

        //TODO: Move to Calendar Widget PO
        /**
         * Opens the date picker widget for the specified date field
         * @param Date field to edit by index
         */
        openDateFieldCalWidget: {value: function(dateFieldIndex) {
            var recordBeingEdited = this.getInlineEditRecord();
            var dateFieldCells = recordBeingEdited.elements('div[colid="Date Field"]');

            var dateFieldCell = dateFieldCells.value[dateFieldIndex];
            var dateFieldCalIcon = this.getDateFieldCalendarIconEl(dateFieldCell);

            var dateTimeFieldCells = recordBeingEdited.elements('div[colid="Date Time Field"]');
            var dateTimeFieldCell = dateTimeFieldCells.value[0];

            if (browserName === 'chrome') {
                dateFieldCalIcon.moveToObject();
            } else {
                browser.execute(function(dateCalIconElement) {
                    dateCalIconElement.scrollIntoView(false);
                }, dateFieldCalIcon.value);
            }

            // Sauce Labs needs extra room so scroll past to the Date Time field next to it
            if (browserName === 'chrome') {
                dateTimeFieldCell.moveToObject();
            } else {
                browser.execute(function(dateTimeElement) {
                    dateTimeElement.scrollIntoView(false);
                }, dateTimeFieldCell.value);
            }

            //TODO: This does not work in Safari (widget opens manually just not with automation)
            dateFieldCalIcon.click();
        }},

        /**
         * Gets the calendar icon for a dateFieldCell element
         * @param date field cell element
         * @returns the calendar icon element
         */
        getDateFieldCalendarIconEl: {value: function(dateFieldCellEl) {
            return dateFieldCellEl.element('.glyphicon.glyphicon-calendar');
        }},

        /**
         * Gets the calendar widget for a dateFieldCell element
         * @param date field cell
         * @returns the calendar widget element
         */
        getDateFieldCalendarWidgetEl: {value: function(dateFieldCellEl) {
            return dateFieldCellEl.element('.datepicker');
        }},

        /**
         * Gets the currently selected date in the date widget
         * @param date calendar widget
         * @returns the selected date element
         */
        getCurrentSelectedDate: {value: function(dateFieldCalendarWidget) {
            return dateFieldCalendarWidget.element('.day.active');
        }},

        /**
         * Gets the parent row for the selected date
         * @param Selected date element
         * @returns The parent row element for the date
         */
        getDateRowForSelectedDate: {value: function(selectedDateEl) {
            return selectedDateEl.element('..');
        }},

        /**
         * Function figures out the currently selected date in the date picker and advances it by one day
         * @param Index of date field to edit
         */
        advanceCurrentlySelectedDate: {value: function(dateFieldIndex) {
            var recordBeingEdited = this.getInlineEditRecord();
            var dateFieldCells = recordBeingEdited.elements('div[colid="Date Field"]');
            var dateFieldCell = dateFieldCells.value[dateFieldIndex];

            var selectedRow = this.getDateRowForSelectedDate(this.getCurrentSelectedDate(this.getDateFieldCalendarWidgetEl(dateFieldCell)));
            var datesInRow = selectedRow.elements('td');
            var currentDateIndex;

            // Loop through the records and find the one being edited
            for (var i = 0; i < datesInRow.value.length; i++) {
                var date = datesInRow.value[i];
                // Check the class of each element for 'editing'
                var elementClass = date.getAttribute('class');
                if (elementClass.indexOf('active') !== -1) {
                    // Found our currently selected element
                    currentDateIndex = i;
                }
            }

            // So now select the next date after the current one
            //TODO: Will need to handle a date at the end of the calendar row
            var nextDate = datesInRow.value[currentDateIndex + 1];

            //nextDate.moveToObject();
            if (browserName === 'chrome') {
                nextDate.moveToObject();
            } else {
                browser.execute(function(dateElement) {
                    dateElement.scrollIntoView(false);
                }, nextDate);
            }
            //Todo: Not working for Safari
            nextDate.click();
        }}

        ///**
        // * Function returns the date-time input cells for the record being edited in agGrid
        // * @returns An array of element locators
        // */
        //this.getTimeOfDayFieldInputCells = function() {
        //    return this.agGridRecordElList.filter(function(elem) {
        //        // Return only the row with 'editing' in the class
        //        return elem.getAttribute('class').then(function(elmClass) {
        //            return elmClass.indexOf('editing') !== -1;
        //        });
        //    }).then(function(rowElem) {
        //        expect(rowElem.length).toBe(1);
        //        return rowElem[0].all(by.css('.cellEdit.timeCell'));
        //    });
        //};
        //
        ////TODO: Functions to get Input and Time Widget Icon for TOD field
        //
        ///**
        // * Function returns the date-time input cells for the record being edited in agGrid
        // * @returns An array of element locators
        // */
        //this.getDateTimeFieldInputCells = function() {
        //    return this.agGridRecordElList.filter(function(elem) {
        //        // Return only the row with 'editing' in the class
        //        return elem.getAttribute('class').then(function(elmClass) {
        //            return elmClass.indexOf('editing') !== -1;
        //        });
        //    }).then(function(rowElem) {
        //        expect(rowElem.length).toBe(1);
        //        return rowElem[0].all(by.css('.cellEdit.timeCell.dateTimeField'));
        //    });
        //};
        //
        ////TODO: Functions to get the inputs and widgets for Date Time fields
        //
        ///**
        // * Function returns the date-time input cells for the record being edited in agGrid
        // * @returns An array of element locators
        // */
        //this.getCheckboxFieldInputCells = function() {
        //    return this.agGridRecordElList.filter(function(elem) {
        //        // Return only the row with 'editing' in the class
        //        return elem.getAttribute('class').then(function(elmClass) {
        //            return elmClass.indexOf('editing') !== -1;
        //        });
        //    }).then(function(rowElem) {
        //        expect(rowElem.length).toBe(1);
        //        return rowElem[0].all(by.css('input[type="checkbox"]'));
        //    });
        //};
        //
        ////TODO: Function to select checkbox input field
        //
        ////TODO: getUserFieldInputCells()

        /* Delete Page */
        //this.recordCountEl = element(by.className('recordsCount')).element(by.tagName('span'));
        ////This gives you all the record checkboxes of the report page
        //this.recordCheckBoxes = element.all(by.className('ag-selection-checkbox'));
        //
        //this.deleteIcon = element(by.className('iconLink icon-delete')).element(by.className('qbIcon iconTableUISturdy-delete'));
        //this.successWindow = element(by.className('notification notification-success')).element(by.className('notification-message')).element(by.className('message'));
        //
        //
        ////Click on the Delete Icon and Checking for the success Message
        //this.clickSelectedRecordDeleteIcon = function() {
        //    var self = this;
        //    this.deleteIcon.click();
        //};
        //
        //// Success window assertion that comes on delete, add and edit of a row
        //this.assertSuccessMessage = function(successMessage) {
        //    var self = this;
        //    this.waitForElement(self.successWindow).then(function() {
        //        expect(self.successWindow.getText()).toMatch(successMessage.toString());
        //    });
        //};
        //
    });

    module.exports = ReportInLineEditPage;
}());
