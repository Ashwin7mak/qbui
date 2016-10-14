/**
 * This file uses the Page Object pattern to define locators for viewing report content in-line actions you can take on records
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = require('./../../common/e2ePageBase');
    var ReportServicePage = requirePO('reportService');
    var reportServicePage = new ReportServicePage();

    var ReportContentPage = function() {
        /**
         * Report Container (encapsulates both the report toolbar and the report content)
         */
        this.reportContainerEl = element(by.className('reportContainer'));
        // Report tools and content container (toolbar locators are in another PO)
        this.reportToolsAndContentEl = this.reportContainerEl.element(by.className('reportToolsAndContentContainer'));

        //TODO: Move tableActionsContainer to another PO
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

        //TODO: Will need to extend these locators when we show multiple reports on a page
        /**
         * Report content div containing column headers and the actual report content in agGrid
         */
        this.reportContentEl = this.reportToolsAndContentEl.element(by.className('reportContent'));

        // agGrid container
        this.agGridContainerEl = this.reportContentEl.all(by.className('agGrid')).first();
        // Contains the column headers
        this.agGridHeaderEl = this.agGridContainerEl.element(by.className('ag-header-container'));
        this.agGridBodyEl = this.agGridContainerEl.element(by.className('ag-body-container'));
        // Contains the actual records
        this.agGridBodyViewportEl = element(by.className('ag-body-viewport'));


        // All column headers from agGrid including first checkbox and last hidden actions column
        this.agGridColHeaderElList = this.agGridHeaderEl.all(by.className('ag-header-cell'));
        this.agGridLastColHeaderEl = this.agGridColHeaderElList.last();

        /**
         * Helper function that will get all of the field column headers from the report. Returns an array of strings.
         */
        this.getReportColumnHeaders = function() {
            var deferred = Promise.pending();
            this.agGridColHeaderElList.then(function(elements) {
                var fetchTextPromises = [];
                for (var i = 0; i < elements.length; i++) {
                    fetchTextPromises.push(elements[i].getAttribute('colid'));
                }
                return Promise.all(fetchTextPromises);
            }).then(function(colHeaders) {
                var fieldColHeaders = [];
                colHeaders.forEach(function(headerText) {
                    if (!headerText) {
                        throw Error('Did not find text for column header');
                    }
                    // The getText call above is returning the text value with a new line char on the end, need to remove it
                    var subText = headerText.replace(/(\r\n|\n|\r)/gm, '');
                    if (subText !== 'actions') {
                        fieldColHeaders.push(subText.trim());
                    }
                });
                return fieldColHeaders;
            }).then(function(fieldColHeaders) {
                return deferred.resolve(fieldColHeaders);
            }).then(null, function(error) {
                deferred.reject(error);
                throw error;
            });
            return deferred.promise;
        };

        // agGrid is divided up into two columns, one is the actions column (pinned on the left) and the second is the record data
        // this will get you every row of the actions column
        this.agGridRowActionsElList = element(by.className('ag-pinned-left-cols-container')).all(by.className('ag-row'));

        // this will get you every record in the record data column
        // note that filter resolves the .all promise call here so this is not then-able
        this.agGridRecordElList = this.agGridBodyViewportEl.all(by.className('ag-row')).filter(function(elem) {
            // Return records that are being shown in the grid
            return elem.getCssValue('visibility').then(function(visible) {
                return visible === 'visible';
            });
        });

        // In-line Edit Record Menu
        //TODO: We render an editTools element per row so create a element locator functions for that
        this.agGridEditRecordMenu = element(by.className('ag-pinned-left-cols-container')).all(by.className('editTools')).first();
        this.agGridEditRecordButtons = this.agGridEditRecordMenu.all(by.tagName('button'));
        this.agGridSaveRecordButton = this.agGridEditRecordMenu.element(by.className('saveRecord'));
        this.agGridCancelSelectionButton = this.agGridEditRecordMenu.element(by.className('cancelSelection'));
        this.agGridAddRecordButton = this.agGridEditRecordMenu.element(by.className('addRecord'));

        // Notification Container for in-line edit actions
        this.notificationContainer = element(by.className('notification-container'));
        this.editSuccessPopup = this.notificationContainer.element(by.className('notification-success'));

        /**
         * Returns a recordRowElement from the table based on the supplied index
         * @param recordIndex
         * @returns Resolved element at specified index (not a promise)
         */
        this.getRecordRowElement = function(recordIndex) {
            return this.agGridRecordElList.get(recordIndex);
        };

        /**
         * Given a record element that is being viewed in agGrid, return the cells for that row
         * @param recordRowElement
         */
        this.getRecordRowCells = function(recordRowElement) {
            return recordRowElement.all(by.className('ag-cell-no-focus'));
        };

        /**
         * Given a record element that is being viewed in agGrid, return the value of that cell
         * @param recordCellElement
         */
        this.getRecordCellValue = function(recordCellElement) {
            // Check to see if the cell element has an sub element of input type checkbox
            // See http://www.protractortest.org/#/api?view=ElementFinder.prototype.isElementPresent
            return recordCellElement.element(by.className(' cellData')).isElementPresent(by.className('checkbox')).then(function(result) {
                // If cell element is a checkbox field do special handling to get the value
                if (result === true) {
                    // See http://www.protractortest.org/#/api?view=webdriver.WebElement.prototype.isSelected for getting the checkbox value
                    return recordCellElement.element(by.className(' cellData')).isElementPresent(by.className('checked'));
                } else {
                    // Otherwise just grab the innerText value
                    return recordCellElement.getAttribute('innerText');
                }
            });
        };

        /**
         * Get a record row element that is being viewed in agGrid (based on recordIndex), return the value of the specified cell index
         * If no cell index defined, function will return all values from all the cells
         * @param recordIndex
         * @param recordCellIndex
         */
        this.getRecordValues = function(recordIndex, recordCellIndex) {
            var self = this;

            var recordRowElement = self.getRecordRowElement(recordIndex);

            return self.getRecordRowCells(recordRowElement).then(function(cells) {
                // Return all record values if no cell number supplied
                if (typeof recordCellIndex === 'undefined') {
                    var fetchCellValuesPromises = [];
                    for (var i = 0; i < cells.length; i++) {
                        fetchCellValuesPromises.push(self.getRecordCellValue(cells[i]));
                    }
                    return Promise.all(fetchCellValuesPromises).then(function(results) {
                        // Do post processing
                        for (var j = 0; j < results.length; j++) {
                            results[j] = self.formatRecordValue(results[j]);
                        }
                        return results;
                    });
                } else {
                    // Get the value for a specific cell number
                    return self.getRecordCellValue(cells[recordCellIndex]).then(function(result) {
                        // Do post processing
                        return self.formatRecordValue(result);
                    });
                }
            });
        };

        /**
         * Helper function to format record values returned from Protractor get functions
         * Returns a string value
         * @param rawRecordValue
         */
        this.formatRecordValue = function(rawRecordValue) {
            if (typeof rawRecordValue === 'boolean') {
                // Handle the checkbox field
                return rawRecordValue.toString();
            } else {
                // Remove whitespace and any newline characters
                return rawRecordValue.trim();
            }
        };

        /**
         * Given a record element in agGrid, click on the selection checkbox for that record to open the edit menu
         * @param recordRowIndex
         */
        this.openRecordEditMenu = function(recordRowIndex) {
            this.waitForReportContent();
            if (browserName === 'chrome') {
                var rowElement = element(by.className('ag-body')).element(by.className('ag-body-container')).all(by.className('ag-row')).get(recordRowIndex).all(by.className('nonEditable')).first();
                browser.actions().doubleClick(rowElement).perform();
            } else {
                browser.executeScript(function() {
                    var event = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true,
                        'detail': 2
                    });
                    document.getElementsByClassName('ag-body-container')[0].getElementsByClassName('ag-row')[0].querySelector('.ag-cell-no-focus').dispatchEvent(event);
                });
            }
            return e2ePageBase.waitForElementToBePresent(this.agGridEditRecordMenu);
        };

        /**
         * Function returns the input cells for the record being edited in agGrid
         */
        this.getRecordRowInputCells = function() {
            return this.agGridRecordElList.filter(function(elem) {
                // Return only the row with 'editing' in the class
                return elem.getAttribute('class').then(function(elmClass) {
                    return elmClass.indexOf('editing') !== -1;
                });
            }).then(function(rowElem) {
                expect(rowElem.length).toBe(1);
                return rowElem[0].all(by.tagName('input'));
            });
        };

        /**
         * Function returns the date input cells for the record being edited in agGrid
         * @returns An array of element locators
         */
        this.getTextFieldInputCells = function() {
            return this.agGridRecordElList.filter(function(elem) {
                // Return only the row with 'editing' in the class
                return elem.getAttribute('class').then(function(elmClass) {
                    return elmClass.indexOf('editing') !== -1;
                });
            }).then(function(rowElem) {
                expect(rowElem.length).toBe(1);
                return rowElem[0].all(by.css('.input.textField'));
            });
        };

        this.editTextField = function(textFieldIndex, textToEnter) {
            return this.getTextFieldInputCells().then(function(textInputCells) {
                var textFieldInput = textInputCells[textFieldIndex];
                e2ePageBase.scrollElementIntoView(textFieldInput);
                textFieldInput.clear();
                textFieldInput.sendKeys(textToEnter);
            });
        };

        this.editDateField = function(dateFieldIndex, dateToEnter) {
            var self = this;
            return self.getDateFieldInputCells().then(function(inputCells) {
                var dateFieldCell = inputCells[dateFieldIndex];
                e2ePageBase.scrollElementIntoView(dateFieldCell);
                self.getDateFieldInputBoxEl(dateFieldCell).clear();
                self.getDateFieldInputBoxEl(dateFieldCell).sendKeys(dateToEnter);
            });
        };

        this.openDateFieldCalWidget = function(dateFieldIndex) {
            var self = this;
            return self.getDateFieldInputCells().then(function(inputCells) {
                var dateFieldCell = inputCells[dateFieldIndex];
                // Open the calendar widget
                e2ePageBase.scrollElementIntoView(dateFieldCell);
                //TODO: Safari is having an issue opening this widget (it works manually of course)
                self.getDateFieldCalendarIconEl(dateFieldCell).click();
                return dateFieldCell;
            });
        };

        /**
         * Function returns the date input cells for the record being edited in agGrid
         * @returns An array of element locators
         */
        //TODO: Extend for editing multiple records at a time
        this.getNumericFieldInputCells = function() {
            return this.agGridRecordElList.filter(function(elem) {
                // Return only the row with 'editing' in the class
                return elem.getAttribute('class').then(function(elmClass) {
                    return elmClass.indexOf('editing') !== -1;
                });
            }).then(function(rowElem) {
                expect(rowElem.length).toBe(1);
                return rowElem[0].all(by.css('.input.numericField.cellEdit'));
            });
        };

        /**
         * Function returns the date input cells for the record being edited in agGrid
         * @returns An array of element locators
         */
        //TODO: Extend for editing multiple records at a time
        this.getDateFieldInputCells = function() {
            return this.agGridRecordElList.filter(function(elem) {
                // Return only the row with 'editing' in the class
                return elem.getAttribute('class').then(function(elmClass) {
                    return elmClass.indexOf('editing') !== -1;
                });
            }).then(function(rowElem) {
                expect(rowElem.length).toBe(1);
                return rowElem[0].all(by.css('.cellEdit.dateCell'));
            });
        };

        this.getDateFieldInputBoxEl = function(dateFieldInputCellEl) {
            return dateFieldInputCellEl.all(by.tagName('input')).first();
        };

        //TODO: Move to Calendar Widget PO
        this.getDateFieldCalendarIconEl = function(dateFieldInputCellEl) {
            return dateFieldInputCellEl.element(by.css('.glyphicon.glyphicon-calendar'));
        };

        this.getDateFieldCalendarWidgetEl = function(dateFieldInputCellEl) {
            return dateFieldInputCellEl.element(by.className('datepicker'));
        };

        this.getCurrentSelectedDate = function(dateFieldCalendarWidget) {
            return dateFieldCalendarWidget.element(by.css('.day.active'));
        };

        this.getDateRowForSelectedDate = function(selectedDateEl) {
            return selectedDateEl.element(by.xpath('..'));
        };

        this.advanceCurrentlySelectedDate = function(dateFieldInputCellEl) {
            var self = this;
            var selectedRow = self.getDateRowForSelectedDate(self.getCurrentSelectedDate(self.getDateFieldCalendarWidgetEl(dateFieldInputCellEl)));

            return selectedRow.all(by.tagName('td')).map(function(elem, index) {
                return e2ePageBase.hasClass(elem, 'active').then(function(result) {
                    if (result === true) {
                        return index;
                    }
                });
            }).then(function(selectedIndexes) {
                var foundIndex;
                selectedIndexes.forEach(function(index) {
                    if (index) {
                        foundIndex = index;
                    }
                });
                return selectedRow.all(by.tagName('td')).get(foundIndex + 1);
            }).then(function(newElementToSelect) {
                return newElementToSelect.click();
            });
        };

        /**
         * Function returns the date-time input cells for the record being edited in agGrid
         * @returns An array of element locators
         */
        this.getTimeOfDayFieldInputCells = function() {
            return this.agGridRecordElList.filter(function(elem) {
                // Return only the row with 'editing' in the class
                return elem.getAttribute('class').then(function(elmClass) {
                    return elmClass.indexOf('editing') !== -1;
                });
            }).then(function(rowElem) {
                expect(rowElem.length).toBe(1);
                return rowElem[0].all(by.css('.cellEdit.timeCell'));
            });
        };

        //TODO: Functions to get Input and Time Widget Icon for TOD field

        /**
         * Function returns the date-time input cells for the record being edited in agGrid
         * @returns An array of element locators
         */
        this.getDateTimeFieldInputCells = function() {
            return this.agGridRecordElList.filter(function(elem) {
                // Return only the row with 'editing' in the class
                return elem.getAttribute('class').then(function(elmClass) {
                    return elmClass.indexOf('editing') !== -1;
                });
            }).then(function(rowElem) {
                expect(rowElem.length).toBe(1);
                return rowElem[0].all(by.css('.cellEdit.timeCell.dateTimeField'));
            });
        };

        //TODO: Functions to get the inputs and widgets for Date Time fields

        /**
         * Function returns the date-time input cells for the record being edited in agGrid
         * @returns An array of element locators
         */
        this.getCheckboxFieldInputCells = function() {
            return this.agGridRecordElList.filter(function(elem) {
                // Return only the row with 'editing' in the class
                return elem.getAttribute('class').then(function(elmClass) {
                    return elmClass.indexOf('editing') !== -1;
                });
            }).then(function(rowElem) {
                expect(rowElem.length).toBe(1);
                return rowElem[0].all(by.css('input[type="checkbox"]'));
            });
        };

        //TODO: Function to select checkbox input field

        //TODO: getUserFieldInputCells()

        /**
         * Find and click the save button for the record being edited
         */
        this.clickEditMenuSaveButton = function() {
            var self = this;
            return self.agGridRowActionsElList.filter(function(elem) {
                // Return only the row with 'editing' in the class
                return elem.getAttribute('class').then(function(elmClass) {
                    return elmClass.indexOf('editing') !== -1;
                });
            }).then(function(rowElem) {
                expect(rowElem.length).toBe(1);
                return rowElem[0].element(by.className('editTools')).all(by.tagName('button')).get(1).click().then(function() {
                    // Check that the edit notification is displayed
                    self.waitForElement(self.editSuccessPopup);
                    // Check that the edit menu is no longer displayed
                    self.waitForElementToBeInvisible(self.agGridEditRecordMenu);
                    // Wait for the report to update
                    self.waitForReportContent();
                });
            });
        };

        /**
         * Find and click the cancel button for the record being edited
         */
        this.clickEditMenuCancelButton = function() {
            var self = this;
            return self.agGridRowActionsElList.filter(function(elem) {
                // Return only the row with 'editing' in the class
                return elem.getAttribute('class').then(function(elmClass) {
                    return elmClass.indexOf('editing') !== -1;
                });
            }).then(function(rowElem) {
                expect(rowElem.length).toBe(1);
                return rowElem[0].element(by.className('editTools')).all(by.tagName('button')).get(0).click().then(function() {
                    // Wait for the report to be ready
                    self.waitForReportContent();
                });
            });
        };
        /**
         * Helper method to ensure the report has been properly loaded with records. Will throw an error if no records are in the report.
         * @returns A promise that will resolve after waiting for the report records to be displayed
         */
        this.waitForReportContent = function() {
            var self = this;
            // First wait for the containers
            return e2ePageBase.waitForElements(self.reportContainerEl, self.reportContentEl).then(function() {
                // Then wait for records to be shown in the grid
                return e2ePageBase.waitForElement(self.agGridBodyViewportEl);
            }).catch(function(e) {
                // If we had issues send and error up the chain
                return Promise.reject(new Error('Error waiting for reportContent (are there records showing on the report?): ' + e.message));
            });
        };
    };
    ReportContentPage.prototype = e2ePageBase;
    module.exports = ReportContentPage;
}());
