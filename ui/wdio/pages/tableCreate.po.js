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
    const tableNameFieldTitle = "Table name";

    var tablesPage = Object.create(e2ePageBase, {
        //new table button
        newTableBtn : {get: function() {return browser.element('.newTableItem .newTable');}},
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

        //table footer buttons
        tableFooterButtons: {get: function() {return browser.elements('.modal-footer .buttons button');}},

        //Icon chooser
        tableFieldIconChooser: {get: function() {return browser.element('.iconChooser.closed');}},
        //Icon chooser down arrow
        iconChooserSelect: {get: function() {return this.tableFieldIconChooser.element('.showAllToggle .showAllSelectedIcon');}},
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

        //new table ready dialogue
        tableReadyDialogue : {get: function() {return browser.element('.tableReadyDialog .modal-dialog');}},
        //new table ready title
        tableReadyDialogueTitle : {get: function() {return this.tableReadyDialogue.element('.titleText');}},
        //new table ready Text
        tableReadyDialogueTextParagraph1 : {get: function() {return this.tableReadyDialogue.element('.tableReadyText p');}},
        //new table ready Text
        tableReadyDialogueTextParagraph2 : {get: function() {return this.tableReadyDialogue.element('.tableReadyText p p');}},

        //Delete Table
        deleteTableActionButton: {get: function() {return browser.element('.iconActions .iconActionButton .buttonLabel');}},
        deletePromtTextField: {get: function() {return browser.element('.modal-dialog .deleteTableDialogContent .prompt');}},



        /**
         * Returns all Icon List from the Icon Chooser
         * @returns Array of Icons
         */
        getAllIconsFromIconChooser: {get: function() {
            browser.element('.allIcons button').waitForVisible();
            browser.element('.allIcons button span').waitForVisible();
            return browser.elements('.allIcons button span');
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
            var randomIconClassName = randomIcon.getAttribute('className').split(' ').splice(-1)[0];
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
            //Get the className of Icon
            let iconChoosedClassName = browser.element('.showAllToggle .qbIcon').getAttribute('className').split(' ').splice(-1)[0];
            return expect(iconChoosedClassName).toBe(expectedIconChoosedClassName);
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
            browser.element('.tablesList').waitForVisible();
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
            //wait until leftNav Loaded.Selected table is not loaded until all table properties are available
            //while (browser.element('.tablesList .leftNavLink .leftNavLabel').getAttribute('textContent').length === 0) {
            //    browser.pause(e2eConsts.shortWaitTimeMs);
            //}
            browser.waitForText('.tablesList .leftNavLink .leftNavLabel', e2eConsts.extraLongWaitTimeMs);
            //filter table names from leftNav links
            var results = this.getAllTableLeftNavLinksList.value.filter(function(table) {
                return table.getAttribute('textContent') === tableName;
            });

            if (results !== []) {
                //Click on filtered table name
                results[0].click();
                //Wat until reports page is visible
                return reportContentPO.reportContainerEl;
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
            browser.waitForExist('.tablesList .leftNavLabel');
            //Wait until new table button visible
            this.newTableBtn.waitForVisible();
            //Verify the name of the button
            expect(this.newTableBtn.getAttribute('textContent')).toContain('New Table');
            //Verify there is also + Icon associated with it
            this.newTableBtn.element('.iconUISturdy-add-new-stroke').waitForVisible();
            //Click on the new Table Btn
            this.newTableBtn.click();
            return browser.element('.tableFieldInput').waitForVisible();
        }},

        /**
         * Method for spinner to dissaper after hitting on any save buttons on edit forms
         */
        waitUntilNotificationContainerGoesAway : {value: function() {
            //wait until notification container slides away
            browser.waitForExist('.notification-container-empty', e2eConsts.mediumWaitTimeMs);
            //Need this to wait for container to slide away
            return browser.pause(e2eConsts.mediumWaitTimeMs);
        }},

        /**
         * Method to click button with name on the table footer.
         */
        clickBtnOnTableDlgFooter : {value: function(btnName) {
            //get all save buttons on the form
            var buttonToClick = this.tableFooterButtons.value.filter(function(button) {
                return button.getAttribute('textContent') === btnName;
            });

            if (buttonToClick !== []) {
                buttonToClick[0].waitForVisible();
                //Click on filtered save button
                return buttonToClick[0].click();
            } else {
                throw new Error('button with name ' + btnName + " not found on the table");
            }
        }},

        /**
         * Method to verify new Table Dialogue contents
         */
        verifyNewTableCreateDialogue : {value: function() {
            this.tableReadyDialogue.waitForVisible();
            //Verify the title and description in table summary in the dialogue
            expect(this.tableReadyDialogueTitle.getAttribute('textContent')).toContain('Your table\'s ready!');
            expect(this.tableReadyDialogueTextParagraph1.getAttribute('textContent')).toContain('Each bit of information you want to collect is a field.');
            return this.tableReadyDialogue.element('.modal-footer .finishedButton').waitForVisible();
        }},

        /**
         * Method to click on OK button in new table dialogue
         */
        clickOkBtn: {value: function() {
            this.tableReadyDialogue.waitForVisible();
            this.tableReadyDialogue.element('.modal-footer .finishedButton').waitForVisible();
            expect(this.tableReadyDialogue.element('.modal-footer .finishedButton').getAttribute('textContent')).toBe('OK');
            this.tableReadyDialogue.element('.modal-footer .finishedButton').click();
            //Need small wait for the container to dissapear
            browser.pause(e2eConsts.mediumWaitTimeMs);
            return formsPO.editFormContainerEl.waitForVisible();
        }},

        /**
         * Method to click on cancel button in create table dialogue
         */
        clickCancelBtn : {value: function() {
            return this.clickBtnOnTableDlgFooter('Cancel');
        }},

        /**
         * Method to click on Create Table button in create table dialogue
         */
        clickFinishedBtn: {value: function() {
            this.clickBtnOnTableDlgFooter('Create table');
            this.waitUntilNotificationContainerGoesAway();
            return this.tableReadyDialogue.waitForVisible();
        }},

        /**
         * Method to click on Previous button in create table dialogue
         */
        clickPreviousBtn : {value: function() {
            return this.clickBtnOnTableDlgFooter('Previous');
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
            expect(this.tableHeader.getAttribute('textContent')).toContain('New Table');
            //Verify table header description
            expect(this.tableDescription.getAttribute('textContent')).toContain('Create a new table when you want to collect a new type of information.');
            //Verify table title
            expect(this.tableTitle.getAttribute('textContent')).toContain('Name your table');
            //Verify Icon choose is enabled
            expect(browser.isEnabled('.iconChooser.closed')).toBeTruthy();
            //Verify cancel button is enabled
            expect(browser.isEnabled('.modal-footer .cancelButton')).toBeTruthy();
            //Verify create button is disabled
            expect(browser.isEnabled('.modal-footer .finishedButton')).toBeFalsy();
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
            filteredElement.element(filteredElementInputClassName).click();
            filteredElement.element(filteredElementInputClassName).clearElement();
            if (browserName === 'firefox') {
                return filteredElement.setValue(filteredElementInputClassName, [fieldValue, '\uE004']);
            } else {
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
                return field.element('.tableFieldTitle').getAttribute('textContent') === tableField;
            });

            if (results !== []) {
                //Enter values for 'table name' field
                if (tableField.includes(tableNameFieldTitle)) {
                    //verify title of the field
                    expect(results[0].element('.tableFieldTitle').getAttribute('textContent')).toContain(tableField);
                    this.setInputValue(results[0], '.tableFieldInput input', fieldValue);
                    //Enter value of 'a record in the table is called a ' field
                } else if (tableField.includes('A record in the table is called')) {
                    //verify title of the field
                    expect(results[0].element('.tableFieldTitle').getAttribute('textContent')).toContain(tableField);
                    this.setInputValue(results[0], '.tableFieldInput input', fieldValue);
                    //Enter value for Description field
                } else if (tableField.includes('Description')) {
                    //verify title of the field
                    expect(results[0].element('.tableFieldTitle').getAttribute('textContent')).toContain(tableField);
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
                return field.element('.tableFieldTitle').getAttribute('textContent') === tableField;
            });

            if (results !== []) {
                //Enter values for 'table name' field
                if (tableField.includes(tableNameFieldTitle)) {
                    //Verify the table name field value
                    expect(results[0].element('.tableFieldInput input').getAttribute('value')).toContain(expectedFieldValue);
                } else if (tableField.includes('A record in the table is called')) {
                    //Verify the record field value
                    expect(results[0].element('.tableFieldInput input').getAttribute('value')).toContain(expectedFieldValue);
                } else if (tableField.includes('Description')) {
                    //Verify the description field value
                    expect(results[0].element('.tableFieldInput textarea').getAttribute('value')).toContain(expectedFieldValue);
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
                if (tableField.includes(tableNameFieldTitle)) {
                    //Verify the placeholder inside input
                    expect(results[0].element('.tableFieldInput input').getAttribute('placeholder')).toContain(expectedPlaceHolder);
                    //Enter value of 'a record in the table is called a ' field
                } else if (tableField.includes('A record in the table is called')) {
                    //Verify the placeholder inside input
                    expect(results[0].element('.tableFieldInput input').getAttribute('placeholder')).toContain(expectedPlaceHolder);
                    //Enter value for Description field
                } else if (tableField.includes('Description')) {
                    //Verify the placeholder inside input
                    expect(results[0].element('.tableFieldInput textarea').getAttribute('placeholder')).toContain(expectedPlaceHolder);
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
                    expect(results[0].element('.invalidInput').getAttribute('textContent')).toContain(errorMsg);
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
            expect(liElements[0]).toContain('Settings');
            expect(liElements[1]).toContain('Table');
            return expect(liElements[2]).toContain('Table properties & settings');
        }},

        /**
         * Method to click on table settings and properties link under tables gear icon in global actions
         */
        clickOnModifyTableSettingsLink : {value: function() {
            this.verifyTableSettingsDropDown();
            //Click on table properties and settings link
            this.modifyTableSettingsLink.waitForVisible();
            this.modifyTableSettingsLink.click();
            return browser.element('.tableFieldInput').waitForVisible();
        }},

        /**
         * Method to click on 'back to apps ' link
         */
        clickBackToAppsLink : {value: function() {
            browser.element('.standardLeftNav .navItemContent').waitForVisible();
            browser.element('.standardLeftNav .navItemContent').click();
            browser.waitForExist('.tablesList .leftNavLabel');
            return this.newTableBtn.waitForVisible();
        }},

        /**
         * Method to click on Apply Button in edit table mode
         */
        clickOnEditTableApplyBtn : {value: function() {
            //Click on table properties and settings link
            this.editTableApplyBtn.waitForVisible();
            this.editTableApplyBtn.click();
            //Need this for notification container to slide away
            return browser.pause(e2eConsts.mediumWaitTimeMs);
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

        /**
         * Method to click deleteTableActionButton
         */
        clickDeleteTableActionButton: {value: function() {
            //wait until you see delete table action button
            this.deleteTableActionButton.waitForVisible();
            //Click on delete table action button
            this.deleteTableActionButton.click();
            return browser.waitForExist('.modal-dialog .deleteTableDialogContent');
        }},

        /**
         * Method to click deleteTableButton
         */
        clickDeleteTableButton: {value: function() {
            //use the predefined deleteTableButton here
            expect(browser.isEnabled('.modal-dialog .primaryButton')).toBeTruthy();
            //wait for deletetable button to be visible
            browser.element('.modal-dialog .modal-footer .primaryButton').waitForVisible();
            //Click on delete table button
            return browser.element('.modal-dialog .modal-footer .primaryButton').click();
        }},

        /**
         * Set the deletePromtTextField value
         */
        setDeletePromtTextFieldValue: {value: function(fieldValue) {
            //wait for model dialogue
            browser.waitForExist('.modal-dialog .deleteTableDialogContent');
            //wait for deletePromtTextField tobe visible
            this.deletePromtTextField.waitForVisible();
            //set the deletePromtTextField value to 'YES'
            return this.setInputValue(this.deletePromtTextField, 'input', fieldValue);
        }},

        /**
         * Method to click don't delete Table button
         */
        clickDontDeleteTableButton: {value: function() {
            //wait for the button tobe visible
            browser.element('.modal-dialog .modal-footer .secondaryButton').waitForVisible();
            //Click on don't delete table button
            browser.element('.modal-dialog .modal-footer .secondaryButton').click();
            //Need this to wait for model dialogue to slide away
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

    });

    module.exports = tablesPage;
}());
