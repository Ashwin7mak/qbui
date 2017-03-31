(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    // Lodash utility library
    var _ = require('lodash');

    // Import the base page object
    var e2ePageBase = requirePO('e2ePageBase');
    var formsPO = requirePO('formsPage');
    var reportContentPO = requirePO('reportContent');

    var tablesPage = Object.create(e2ePageBase, {
        //new table button
        newTableBtn : {get: function() {return browser.element('.newTable');}},
        //new table container
        tableContainer : {get: function() {return browser.element('.modal-dialog .bodyContainer');}},
        //new table header
        tableHeader : {get: function() {return this.tableContainer.element('.modal-title');}},
        //new table description
        tableDescription : {get: function() {return this.tableContainer.element('.pageContainer .description');}},
        //new table title
        tableTitle : {get: function() {return this.tableContainer.element('.pageContainer .title');}},

        //table close
        tableCloseBtn : {get: function() {return browser.element('.closeButton');}},
        //table help
        tableHelpBtn : {get: function() {return browser.element('.iconUISturdy-help');}},

        //table Next button
        tableNextBtn: {get: function() {return browser.element('.modal-footer .nextButton');}},
        //table Cancel button
        tableCancelBtn: {get: function() {return browser.element('.modal-footer .cancelButton');}},
        //table finished button
        tableFinishedBtn: {get: function() {return browser.element('.modal-footer .finishedButton');}},
        //table previous button
        tablePreviousBtn: {get: function() {return browser.element('.modal-footer .previousButton');}},

        //Icon chooser
        tableFieldIconDropDown: {get: function() {return browser.element('.iconChooser .createTableIconDropdown');}},

        /**
         * Returns all table links from left Nav apps page
         * @returns Array of table links
         */
        getAllTableLeftNavLinksList: {get: function() {
            return browser.elements('.leftNavLabel');
        }},


        /**
         * Returns all table fields
         * @returns Array of fields
         */
        getAllTableFieldsList: {get: function() {
            return browser.elements('.tableField');
        }},

        /**
         * Select a table by its name from apps page left nav
         * @params tableName
         */
        selectTable: {value: function(tableName) {
            //filter table names from leftNav links
            var results = this.getAllTableLeftNavLinksList.value.filter(function(table) {
                return table.getAttribute('textContent') === tableName;
            });

            if (results !== []) {
                //Click on filtered table name
                results[0].click();
                //Wat until reports page is visible
                return reportContentPO.reportContainerEl.waitForVisible();
            }
        }},

        /**
         * Verify table not present in the left Nav
         * @params tableName
         */
        getAllTablesFromLeftNav: {value: function() {
            //filter table names from leftNav links
            var results = [];
            this.getAllTableLeftNavLinksList.value.map(function(table) {
                results.push(table.getAttribute('textContent'));
            });
            return results;
        }},

        /**
         * Method to click on create new table
         */
        clickCreateNewTable : {value: function() {
            //Wait until new table button visible
            this.newTableBtn.waitForVisible();
            //Verify the name of the button
            expect(this.newTableBtn.getAttribute('textContent')).toBe('New Table');
            //Verify there is also + Icon associated with it
            this.newTableBtn.element('.iconUISturdy-add-mini').waitForVisible();
            //Click on the new Table Btn
            return this.newTableBtn.click();
        }},

        /**
         * Method to click on Next button in create Table dialogue
         */
        clickNextBtn : {value: function() {
            //Wait until next button visible
            this.tableNextBtn.waitForVisible();
            //click on next button
            this.tableNextBtn.click();
            //Need this to wait for container to slide to next screen
            browser.pause(e2eConsts.shortWaitTimeMs);
            //Verify the title and description in table summary in the dialogue
            expect(this.tableHeader.getAttribute('textContent')).toBe('Get ready to add fields to your table');
            return expect(this.tableDescription.getAttribute('textContent')).toBe('Each bit of information you want to collect is a field, like Customer Name.');
        }},

        /**
         * Method to click on cancel button in create table dialogue
         */
        clickCancelBtn : {value: function() {
            //Wait until cancel button visible
            this.tableCancelBtn.waitForVisible();
            //click on cancel button
            this.tableCancelBtn.click();
            //Need this to wait for dialogue to dissapear
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /**
         * Method to click on Finished button in create table dialogue
         */
        clickFinishedBtn : {value: function() {
            //Wait until Finished button visible
            this.tableFinishedBtn.waitForVisible();
            //Click on finished button
            this.tableFinishedBtn.click();
            //make sure it lands in forms edit container
            return formsPO.editFormContainerEl.waitForVisible();

        }},

        /**
         * Method to click on Previous button in create table dialogue
         */
        clickPreviousBtn : {value: function() {
            //Wait until Finished button visible
            this.tablePreviousBtn.waitForVisible();
            //Click on finished button
            this.tablePreviousBtn.click();
            //Need this to wait for container to slide to next screen
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /**
         * Method to click on Close button in create table dialogue
         */
        clickCloseBtn : {value: function() {
            //Wait until Finished button visible
            this.tableCloseBtn.waitForVisible();
            //Click on finished button
            this.tableCloseBtn.click();
            //Need this to wait for container to slide away
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /**
         * Method to verify table elements in create table dialogue
         */
        verifyTable : {value: function() {
            //Wait until table container visible
            this.tableContainer.waitForVisible();
            //Verify table header
            expect(this.tableHeader.getAttribute('textContent')).toBe('New Table');
            //Verify table header description
            expect(this.tableDescription.getAttribute('textContent')).toBe('Create a new table when you want to collect a new type of information.');
            //Verify table title
            expect(this.tableTitle.getAttribute('textContent')).toBe('Name your table');
            //Verify Icon choose is enabled
            expect(browser.isEnabled('.iconChooser .dropdown')).toBeTruthy();
            //Verify cancel button is enabled
            expect(browser.isEnabled('.modal-footer .cancelButton')).toBeTruthy();
            //Verify next button is disabled
            expect(browser.isEnabled('.modal-footer .nextButton')).toBeFalsy();
            //verify close button enabled
            expect(browser.isEnabled('.rightIcons .iconUISturdy-close')).toBeTruthy();
        }},

        /**
         * Method to enter table field values
         * @tableField
         * @fieldValue
         */
        enterTableFieldValue : {value: function(tableField, fieldValue) {
            //Filter all fields in create new table dialogue
            var results = this.getAllTableFieldsList.value.filter(function(field) {
                return field.getAttribute('textContent') === tableField;
            });

            if (results !== []) {
                //Enter values for 'table name' field
                if (tableField.includes('Table Name')) {
                    //verify title of the field
                    expect(results[0].element('.tableFieldTitle').getAttribute('textContent')).toBe(tableField);
                    results[0].element('.tableFieldInput input').setValue(fieldValue);
                    results[0].element('..').click();
                    //Enter value of 'a record in the table is called a ' field
                } else if (tableField.includes('A record in the table is called')) {
                    //verify title of the field
                    expect(results[0].element('.tableFieldTitle').getAttribute('textContent')).toBe(tableField);
                    results[0].element('.tableFieldInput input').setValue(fieldValue);
                    results[0].element('..').click();
                    //Enter value for Description field
                } else if (tableField.includes('Description')) {
                    //verify title of the field
                    expect(results[0].element('.tableFieldTitle').getAttribute('textContent')).toBe(tableField);
                    results[0].element('.tableFieldInput textarea').setValue(fieldValue);
                    results[0].element('..').click();
                }
            } else {
                throw new Error('Cannot set value for input of field type ' + JSON.stringify(results[0]));
            }
        }},

        /**
         * Method to verify table field place Holders
         * @fieldName
         * @expectedPlaceHolder
         */
        verifyTableFieldPlaceHolders : {value: function(tableField, expectedPlaceHolder) {
            //Filter all fields in create new table dialogue
            var results = this.getAllTableFieldsList.value.filter(function(field) {
                return field.getAttribute('textContent') === tableField;
            });

            if (results !== []) {
                //Enter values for 'table name' field
                if (tableField.includes('Table Name')) {
                    //Verify the placeholder inside input
                    expect(results[0].element('.tableFieldInput input').getAttribute('placeholder')).toBe(expectedPlaceHolder);
                    //Enter value of 'a record in the table is called a ' field
                } else if (tableField.includes('A record in the table is called')) {
                    //Verify the placeholder inside input
                    expect(results[0].element('.tableFieldInput input').getAttribute('placeholder')).toBe(expectedPlaceHolder);
                    //Enter value for Description field
                } else if (tableField.includes('Description')) {
                    //Verify the placeholder inside input
                    expect(results[0].element('.tableFieldInput textarea').getAttribute('placeholder')).toBe(expectedPlaceHolder);
                }
            } else {
                throw new Error('Unexpected table field filtered element' + JSON.stringify(results[0]));
            }
        }},

        /**
         * Method to verify table field validation
         * @fieldName
         * @fieldErrorMsg
         */
        verifyTableFieldValidation : {value: function(tableField, errorMsg) {
            //filter all fields in create new table dialogue
            var results = this.getAllTableFieldsList.value.filter(function(field) {
                return field.getAttribute('textContent') === tableField;
            });

            if (results !== []) {
                //Hover over to an element and verify the field error
                expect(results[0].moveToObject('.tableFieldInput').element('.invalidInput').getAttribute('textContent')).toBe(errorMsg);
                return results[0].click();
            }
        }},


    });

    module.exports = tablesPage;
}());
