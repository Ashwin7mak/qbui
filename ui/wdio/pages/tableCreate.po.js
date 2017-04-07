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
        tableNextBtn: {get: function() {return browser.element('.modal-footer button.nextButton');}},
        //table Cancel button
        tableCancelBtn: {get: function() {return browser.element('.modal-footer button.cancelButton');}},
        //table finished button
        tableFinishedBtn: {get: function() {return browser.element('.modal-footer button.finishedButton');}},
        //table previous button
        tablePreviousBtn: {get: function() {return browser.element('.modal-footer button.previousButton');}},

        //Icon chooser
        tableFieldIconChooser: {get: function() {return browser.element('.iconChooser.closed');}},
        //Icon chooser down arrow
        iconChooserSelect: {get: function() {return this.tableFieldIconChooser.element('.iconUISturdy-caret-filled-down');}},
        //Icon chooser search
        iconChooserSearch: {get: function() {return browser.element('.iconChooser.open .iconSearch input');}},

        //edit table apply btn
        editTableApplyBtn : {get: function() {return browser.element('button.primaryButton');}},
        //edit table resest btn
        editTableResetBtn : {get: function() {return browser.element('a.secondaryButton');}},

        // settings Icon under globalActions
        settingsBtn : {get: function() {return browser.element('.iconUISturdy-settings');}},
        //modify table settings
        modifyTableSettingsLink : {get: function() {return browser.element('.modifyTableSettings');}},
        //edit table heading
        editTableHeading : {get: function() {return browser.element('.stageHeadLine');}},


        /**
         * Returns all Icon List from the Icon Chooser
         * @returns Array of Icons
         */
        getAllIconsFromIconChooser: {get: function() {
            browser.element('.allIcons').waitForVisible();
            browser.element('.allIcons .qbIcon').waitForVisible();
            return browser.elements('.allIcons .qbIcon');
        }},

        /**
         * Method to select random Icon from the Icon Chooser
         *@returns IconChoosed className
         */
        selectRandomIconFromIconChooser: {value: function() {
            //search for tasks
            this.searchIconFromChooser('tasks');
            //get all icons to a list
            var icons = this.getAllIconsFromIconChooser;
            //Get random Icon from the list of Icons
            var randomIcon = _.sample(icons.value);
            //Get the className of Icon
            var randomIconClassName = randomIcon.getAttribute('className');
            //Select the Icon
            randomIcon.waitForVisible();
            randomIcon.click();
            //Wait until the iconChooser is closed
            this.tableFieldIconChooser.waitForVisible();
            return randomIconClassName;
        }},

        /**
         * Method to verify Icon choosed in the iconChooser dropdown
         * @param expectedIconChoosedClassName
         */
        verifyIconInIconChooserCombo: {value: function(expectedIconChoosedClassName) {
            //Wait untill you see closed Icon chooser
            this.tableFieldIconChooser.waitForVisible();
            return expect(browser.element('.showAllToggle .qbIcon').getAttribute('className')).toBe(expectedIconChoosedClassName);
        }},

        /**
         * Method to search for an Icon from the Icon Chooser
         *@param searchIcon item name
         */
        searchIconFromChooser: {value: function(searchIconName) {
            //Wait untill you see closed Icon chooser
            this.tableFieldIconChooser.waitForVisible();
            //Click on Icon chooser select dropdown to open
            this.iconChooserSelect.click();
            //Wait until you see open icon chooser
            this.iconChooserSearch.waitForVisible();
            //Click in search
            this.iconChooserSearch.click();
            //Enter search value
            return this.iconChooserSearch.setValue(searchIconName);
        }},

        /**
         * Returns all table links from left Nav apps page
         * @returns Array of table links
         */
        getAllTableLeftNavLinksList: {get: function() {
            browser.element('.leftNavLabel').waitForVisible();
            return browser.elements('.leftNavLabel');
        }},


        /**
         * Returns all table fields
         * @returns Array of fields
         */
        getAllTableFieldsList: {get: function() {
            browser.element('.tableField').waitForVisible();
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
            //Wait until Finished button visible
            this.tableFinishedBtn.waitForVisible();
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
         * Method to click on Create Table button in create table dialogue
         */
        clickFinishedBtn: {value: function() {
            var createTableButtonEl = this.tableFinishedBtn;

            //step 1-  Wait for the button to be visible
            createTableButtonEl.waitForVisible();
            // Catch an error from above and then retry
            // Single click via raw javascript
            browser.execute(function() {
                var event = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'detail': 1
                });
                document.querySelector('button.finishedButton').dispatchEvent(event);
            });
            browser.waitForVisible('form.editForm', e2eConsts.extraLongWaitTimeMs, true);
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
            expect(browser.isEnabled('.iconChooser.closed')).toBeTruthy();
            //Verify cancel button is enabled
            expect(browser.isEnabled('.modal-footer .cancelButton')).toBeTruthy();
            //Verify next button is disabled
            expect(browser.isEnabled('.modal-footer .nextButton')).toBeFalsy();
            //verify close button enabled
            expect(browser.isEnabled('.rightIcons .iconUISturdy-close')).toBeTruthy();
        }},

        /**
         * Method to enter table field input values
         * @filteredElement
         * @filteredElementInputClassName
         * @fieldValue
         */
        setInputValue : {value: function(filteredElement, filteredElementInputClassName, fieldValue) {
            filteredElement.element(filteredElementInputClassName).clearElement();
            if (browserName === 'firefox') {
                return filteredElement.setValue(filteredElementInputClassName, [fieldValue, '\uE004']);
            } else {
                filteredElement.element(filteredElementInputClassName).click();
                return browser.keys([fieldValue, '\uE004']);
            }
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
                    this.setInputValue(results[0], '.tableFieldInput input', fieldValue);
                    //Enter value of 'a record in the table is called a ' field
                } else if (tableField.includes('A record in the table is called')) {
                    //verify title of the field
                    expect(results[0].element('.tableFieldTitle').getAttribute('textContent')).toBe(tableField);
                    this.setInputValue(results[0], '.tableFieldInput input', fieldValue);
                    //Enter value for Description field
                } else if (tableField.includes('Description')) {
                    //verify title of the field
                    expect(results[0].element('.tableFieldTitle').getAttribute('textContent')).toBe(tableField);
                    this.setInputValue(results[0], '.tableFieldInput textarea', fieldValue);
                }
            } else {
                throw new Error('Cannot set value for input of field type ' + JSON.stringify(results[0]));
            }
        }},

        /**
         * Method to verify table field input values
         * @fieldName
         * @expectedFieldValue
         */
        verifyTableFieldValues : {value: function(tableField, expectedFieldValue) {
            //Filter all fields in create new table dialogue
            var results = this.getAllTableFieldsList.value.filter(function(field) {
                return field.getAttribute('textContent') === tableField;
            });

            if (results !== []) {
                //Enter values for 'table name' field
                if (tableField.includes('Table Name')) {
                    //Verify the table name field value
                    expect(results[0].element('.tableFieldInput input').getAttribute('value')).toBe(expectedFieldValue);
                } else if (tableField.includes('A record in the table is called')) {
                    //Verify the record field value
                    expect(results[0].element('.tableFieldInput input').getAttribute('value')).toBe(expectedFieldValue);
                } else if (tableField.includes('Description')) {
                    //Verify the description field value
                    expect(results[0].element('.tableFieldInput textarea').getAttribute('value')).toBe(expectedFieldValue);
                }
            } else {
                throw new Error('Unexpected table field filtered element' + JSON.stringify(results[0]));
            }
        }},

        getAllTableFieldValues : {value: function() {
            var allTableFieldValues = [];

            //Get all textField input values tableName, A record in the table is called
            browser.element('.tableFieldInput input').waitForVisible();
            browser.elements('.tableFieldInput input').value.map(function(elm) {
                allTableFieldValues.push(elm.getAttribute('value'));
            });

            //Get all textarea input values description
            browser.elements('.tableFieldInput textarea').value.map(function(elm) {
                allTableFieldValues.push(elm.getAttribute('value'));
            });
            return allTableFieldValues;
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
         * Method to enter the invalid field values and verify table field validation
         * @fieldName
         * @fieldValue
         * @fieldErrorMsg
         */
        verifyTableFieldValidation : {value: function(tableField, errorMsg) {
            //filter all fields in create new table dialogue
            var results = this.getAllTableFieldsList.value.filter(function(field) {
                return field.getAttribute('textContent') === tableField;
            });

            if (results !== []) {
                //Verify tipChildWrapper is visible
                results[0].element('.tipChildWrapper').waitForVisible();
                //moveToObject not working in firefox and edge but we do check that tipChildWrapper is present for all invalid fieldInputs which should be good.
                if (browserName === 'chrome') {
                    //Hover over to an element and verify the field error
                    results[0].moveToObject('.tableFieldInput');
                    browser.waitForExist('.invalidInput'); // Account for short timeout in showing tooltip
                    expect(results[0].element('.invalidInput').getAttribute('textContent')).toBe(errorMsg);
                    return results[0].click();
                }
            }
        }},

        /**
         * Method to verify table settings drop down
         */
        verifyTableSettingsDropDown : {value: function() {
            var liElements = [];
            this.settingsBtn.waitForVisible();
            //Click on settings gear Icon on table global actions
            this.settingsBtn.click();
            browser.elements('.configSet li').value.map(function(elm) {
                liElements.push(elm.getAttribute('textContent'));
            });
            expect(liElements[0]).toBe('Settings');
            expect(liElements[1]).toBe('Table');
            return expect(liElements[2]).toBe('Table properties & settings');
        }},

        /**
         * Method to click on table settings and properties link under tables gear icon in global actions
         */
        clickOnModifyTableSettingsLink : {value: function() {
            this.verifyTableSettingsDropDown();
            //Click on table properties and settings link
            this.modifyTableSettingsLink.waitForVisible();
            return this.modifyTableSettingsLink.click();
        }},

        /**
         * Method to click on Apply Button in edit table mode
         */
        clickOnEditTableApplyBtn : {value: function() {
            //Click on table properties and settings link
            this.editTableApplyBtn.waitForVisible();
            this.editTableApplyBtn.click();
            //Need this for notification container to slide away
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /**
         * Method to click on Reset Button in edit table mode
         */
        clickOnEditTableResetBtn : {value: function() {
            //Click on table properties and settings link
            this.editTableResetBtn.waitForVisible();
            this.editTableResetBtn.click();
            //Need this for notification container to slide away
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

    });

    module.exports = tablesPage;
}());
