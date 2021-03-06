/**
 * This file uses the Page Object pattern to define locators for performing in-line actions on records
 *
 * Created by klabak on 11/25/16
 */
(function() {
    'use strict';
    var reportContent = require('./reportContent.po');
    var e2ePageBase = require('./e2ePageBase.po');
    var assert = require('assert');

    var saveRecordInlineEdit  = '.qbGrid .saveRecord';
    var cancelRecordInlineEdit = '.qbGrid .cancelSelection';
    var addRecordInlineEdit = '.qbGrid .addRecord';

    var ReportInLineEditPage = Object.create(reportContent, {

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
         * Given a record element in qbGrid, double click on the record to open the edit menu
         * @param recordRowIndex
         */
        openRecordEditMenu: {value: function(recordIndex) {
            // This will return a qbRow from the specified recordIndex
            var recordRowEl = reportContent.getRecordRowElement(recordIndex);

            // This focuses on the cellData from qbCell at the specified recordIndex
            var cellData = recordRowEl.element('.cellData.NoWrap');
            // Get the pencil from the qbCell
            var cellEditIcon = recordRowEl.element('.cellEditIcon');
            //TODO: moveToObject does not work on safari, a javascript workaround needs to be implemented
            //TODO: moveToObject on Chrome and Firefox does not move to the exact qbCell that is returned from recordCellEl
            //TODO: the challenge is all cell's have the same className of qbCell, so the browser will move the mouse to the first
            //TODO: qbCell on the DOM. More research is required, in order to get moveToObject to move to the exact qbCell that is specified
            if (browserName !== 'safari') {
                // Hover over the cell
                cellData.waitForVisible();
                cellData.moveToObject();
                // Then once the pencil is visible hover over the pencil and click
                cellEditIcon.waitForVisible();
                cellEditIcon.moveToObject();
                cellEditIcon.click();
                this.getInlineEditRecord().waitForVisible();
            }
        }},

        //Assert three buttons not to be present
        assertInlineEditMenuButtonsTobeTrue:{value: function() {
            expect(browser.isVisible(saveRecordInlineEdit)).toBe(true);
            expect(browser.isVisible(cancelRecordInlineEdit)).toBe(true);
            expect(browser.isVisible(addRecordInlineEdit)).toBe(true);
        }},

        //Assert three buttons to be present
        assertInlineEditMenuButtonsTobeFalse:{value: function() {
            expect(browser.isVisible(saveRecordInlineEdit)).toBe(false);
            expect(browser.isVisible(cancelRecordInlineEdit)).toBe(false);
            expect(browser.isVisible(addRecordInlineEdit)).toBe(false);
        }},

        /**
         * Find and click the save button for the record being edited
         */
        clickSaveChangesButton: {value: function() {
            var saveRecordButtonEl = this.getSaveRecordButton();
            // Wait for the button to be visible
            saveRecordButtonEl.waitForVisible();
            try {
                // Click on save button
                saveRecordButtonEl.click();
                // Wait for inline edit menu to disappear to confirm that click event worked
                browser.waitForVisible(cancelRecordInlineEdit, e2eConsts.extraLongWaitTimeMs, true);
            } catch (err) {
                browser.logger.info("Caught an error clicking in-line edit save button - Trying again with JS. \n Error " + err.toString());
                // Catch an error from above and then retry
                // Single click via raw javascript
                browser.execute(function() {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 1
                    });
                    document.querySelector('.qbRow.editing .saveRecord').dispatchEvent(event);
                });
                browser.waitForVisible(cancelRecordInlineEdit, e2eConsts.mediumWaitTimeMs, true);
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
                browser.waitForVisible(cancelRecordInlineEdit, e2eConsts.mediumWaitTimeMs, true);
            } catch (err) {
                browser.logger.info("Caught an error clicking in-line edit cancel button - Trying again with JS. \n Error " + err.toString());
                // Catch an error from above and then retry
                // Single click via raw javascript
                browser.execute(function() {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 1
                    });
                    document.querySelector('.qbRow.editing .cancelSelection').dispatchEvent(event);
                });
                browser.waitForVisible('.qbRow.editing .saveRecord', e2eConsts.mediumWaitTimeMs, true);
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
            }
        }},

        /**
         * Loop through the records being displayed and return the one being edited
         * @returns The record element being edited
         */
        getInlineEditRecord: {value: function() {
            var recordRowElements = reportContent.qbGridBodyViewportEl.elements('.qbRow');
            var recordBeingEdited;
            // Loop through the records and find the one being edited
            for (var i = 0; i < recordRowElements.value.length; i++) {
                var recordRowElement = recordRowElements.value[i];
                // Check the class of each element for 'editing'
                var elementClass = recordRowElement.getAttribute('class');
                if (elementClass.indexOf('qbRow editing') !== -1) {
                    // Found our record element
                    recordBeingEdited = recordRowElements.value[i];
                }
            }
            // Didn't find a record so throw an error
            if (!recordBeingEdited) {
                throw new Error('No record is being inline edited on the page');
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
            // var dateFieldCells = recordBeingEdited.elements('div[colid="Date Field"]');
            var qbCells = recordBeingEdited.elements('.qbCell');
            var dateFieldCells = qbCells.elements('.cellEdit.dateCell.place');
            var dateFieldCell = dateFieldCells.value[dateFieldIndex];
            // var dateFieldCell = dateFieldCells;
            var dateFieldCalIcon = this.getDateFieldCalendarIconEl(dateFieldCell);

            var dateTimeFieldCells = qbCells.elements('.dateTimeFieldValueEditor');
            var dateTimeFieldCell = dateTimeFieldCells.value[0];

            if (browserName === 'chrome') {
                browser.moveToObject(dateFieldCalIcon.selector);
            } else {
                browser.execute(function(dateCalIconElement) {
                    dateCalIconElement.scrollIntoView(false);
                }, dateFieldCalIcon.value);
            }

            // Sauce Labs needs extra room so scroll past to the Date Time field next to it
            if (browserName === 'chrome') {
                browser.moveToObject(dateTimeFieldCell.selector);
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
            // var dateFieldCells = recordBeingEdited.elements('div[colid="Date Field"]');
            var qbCells = recordBeingEdited.elements('qbCell');
            var dateFieldCells = qbCells.elements('.cellEdit.dateCell.place');
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
        // * Function returns the date-time input cells for the record being edited in qbGrid
        // * @returns An array of element locators
        // */
        //this.getTimeOfDayFieldInputCells = function() {
        //    return this.qbGridRecordElList.filter(function(elem) {
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
        // * Function returns the date-time input cells for the record being edited in qbGrid
        // * @returns An array of element locators
        // */
        //this.getDateTimeFieldInputCells = function() {
        //    return this.qbGridRecordElList.filter(function(elem) {
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
        // * Function returns the date-time input cells for the record being edited in qbGrid
        // * @returns An array of element locators
        // */
        //this.getCheckboxFieldInputCells = function() {
        //    return this.qbGridRecordElList.filter(function(elem) {
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
        //this.deleteIcon = element(by.className('iconLink icon-delete')).element(by.className('qbIcon iconUISturdy-delete'));
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
