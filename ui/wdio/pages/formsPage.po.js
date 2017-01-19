(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    // Lodash utility library
    var _ = require('lodash');

    // Import the base page object

    var e2ePageBase = requirePO('e2ePageBase');
    var ReportInLineEditPO = requirePO('reportInLineEdit');
    var reportContentPO = requirePO('reportContent');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');

    var sText = 'testTextValue';
    var sUrl = 'http://www.yahoo.com';
    var sEmail = 'test@gmail.com';
    var sPhone = '508-481-1015';
    var sNumeric = 33.33;
    var sTime = '12:30 am';
    var date = new Date();
    var sDate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + '-' + date.getFullYear();
    var sUser = 'administrator User for default SQL Installation';

    var FormsPage = Object.create(e2ePageBase, {
        //Record add button on stage
        addRecordBtnOnStage : {get: function() {return browser.element('.layout-stage .pageActions .iconTableUISturdy-add');}},
        //view form
        viewFormContainerEl : {get: function() {return browser.element('form.viewForm');}},
        //edit Form
        editFormContainerEl : {get: function() {return browser.element('form.editForm');}},
        //form footer save buttons(there will be 2 buttons)
        editFormSaveBtns : {get: function() {return browser.elements('.trowserFooter .rightIcons .saveButtons button');}},
        //form footer alert button
        editFormFooterErrorAlertBtn : {get: function() {return browser.element('.trowserFooter .iconTableUISturdy-alert');}},

        //edit pencil in view form
        editPencilBtnOnStageInViewForm : {get: function() {return browser.element('.stageRight .pageActions .iconTableUISturdy-edit');}},
        //edit pencil in report actions tool bar
        editPencilBtnOnReportActions : {get: function() {return browser.element('.reportActions .actionIcons .iconTableUISturdy-edit');}},
        //edit pencil in record actions
        editPencilBtnInRecordActions : {get: function() {return browser.elements('.recordActions .iconActionButton.edit');}},

        //form close button
        formCloseBtn : {get: function() {return browser.element('.trowserHeader .iconTableUISturdy-close');}},

        //form error message container
        formErrorMessageContainerEl : {get: function() {return browser.element('div.qbErrorMessage.qbErrorMessageVisible');}},
        //header on error message container
        formErrorMessageHeader : {get: function() {return this.formErrorMessageContainerEl.element('.qbErrorMessageHeader');}},
        //close btn on error container
        formErrorMessageContainerCloseBtn : {get: function() {return this.formErrorMessageContainerEl.element('.iconTableUISturdy-x-secondary');}},
        formErrorMessageContent : {get: function() {return this.formErrorMessageContainerEl.element('.qbErrorMessageContent');}},

        //Save changes before leaving dialogue
        formsSaveChangesDialog : {get: function() {return browser.element('.modal-dialog');}},
        formsSaveChangesDialogHeader : {get: function() {return this.formsSaveChangesDialog.element('.modal-body');}},
        formsSaveChangesDialogFooter : {get: function() {return this.formsSaveChangesDialog.element('.modal-footer');}},

        // Notification Container for form actions
        notificationContainerEl: {get: function() {return browser.element('.notification-container');}},
        notificationWindow: {get: function() {return this.notificationContainerEl.element('.notification-message .message');}},


        /**
         * Method to click Add Record button on Report Table
         */
        clickAddRecordBtnOnStage: {value: function() {
            this.addRecordBtnOnStage.waitForVisible();
            //Click on add record button
            this.addRecordBtnOnStage.click();
            //wait until you see edit container and save buttons in footer
            this.editFormContainerEl.waitForVisible();
            return this.editFormSaveBtns.waitForVisible();
        }},

        /**
         * Method for spinner to dissaper after hitting on any save buttons on edit forms
         */
        waitUntilSpinnerGoesAwayAfterSave : {value: function(btnName) {
            //wait until loading screen disappear
            browser.waitForVisible('.trowserChildren .loader .spinner', e2eConsts.extraLongWaitTimeMilliseonds, true);
            //Need this to wait for container to slide away
            return browser.pause(3000);
        }},

        /**
         * Method to click Save button with name on the form.
         */
        clickBtnOnForm : {value: function(btnName) {
            //get all save buttons on the form
            var saveButton = this.editFormSaveBtns.value.filter(function(button) {
                return button.getAttribute('textContent') === btnName;
            });

            if (saveButton !== []) {
                //Click on filtered save button
                saveButton[0].click();
                return this.waitUntilSpinnerGoesAwayAfterSave();
            } else {
                throw new Error('button with name ' + btnName + " not found on the form");
            }
        }},

        /**
         * Method to click Save button on the form.
         */
        clickFormSaveBtn : {value: function() {
            //Click on form Save button
            this.editFormSaveBtns.waitForVisible();
            return this.clickBtnOnForm('Save');
        }},
        /**
         * Method to click Save & Add Another button on the form Add.
         */
        clickFormSaveAndAddAnotherBtn : {value: function() {
            //Click on Save and add Another button
            this.editFormSaveBtns.waitForVisible();
            return this.clickBtnOnForm('Save & Add Another');
        }},

        /**
         * Method to click Save & Next button on the form Edit.
         */
        clickFormSaveAndNextBtn : {value: function() {
            //Click on Save and Next button on form
            this.editFormSaveBtns.waitForVisible();
            return this.clickBtnOnForm('Save & Next');
        }},

        /**
         * Method to click on close button to close the form.
         */
        clickFormCloseBtn : {value: function() {
            //Click on form close button
            this.formCloseBtn.waitForVisible();
            return this.formCloseBtn.click();
        }},

        /**
         * Returns all field labels on the form
         * @parm elementFormName - is it view form or edit form
         * @returns Array of field Labels
         */
        getAllFieldLabelsOnForm: {value: function(elementFormName) {
            elementFormName.elements('.fieldLabel').waitForVisible();
            return elementFormName.elements('.fieldLabel');
        }},

        /**
         * Returns all text input fields on the form
         * @returns Array of text input fields
         */
        getAllFieldRows: {value: function() {
            this.editFormContainerEl.elements('.fieldRow').waitForVisible();
            return this.editFormContainerEl.elements('.fieldRow');
        }},

        /**
         * Returns all email input fields on the form
         * @returns Array of email input fields
         */
        getAllEmailInputFields: {value: function() {
            this.editFormContainerEl.elements('input[type="email"].textField').waitForVisible();
            return this.editFormContainerEl.elements('input[type="email"].textField');
        }},

        /**
         * Returns all phone input fields on the form
         * @returns Array of phone input fields
         */
        getAllPhoneInputFields: {value: function() {
            this.editFormContainerEl.elements('input.phoneNumber').waitForVisible();
            return this.editFormContainerEl.elements('input.phoneNumber');
        }},

        /**
         * Returns all url input fields on the form
         * @returns Array of url input fields
         */
        getAllUrlInputFields: {value: function() {
            this.editFormContainerEl.elements('input[type="url"].textField').waitForVisible();
            return this.editFormContainerEl.elements('input[type="url"].textField');
        }},

        /**
         * Returns all duration input fields on the form
         * @returns Array of duration input fields
         */
        getAllDurationInputFields: {value: function() {
            this.editFormContainerEl.elements('input.durationField').waitForVisible();
            return this.editFormContainerEl.elements('input.durationField');
        }},

        /**
         * Returns all numeric input fields on the form
         * @returns Array of numeric input fields
         */
        getAllNumericInputFields: {value: function() {
            this.editFormContainerEl.elements('input.numericField').waitForVisible();
            return this.editFormContainerEl.elements('input.numericField');
        }},

        /**
         * Returns all Date fields on the form
         * @returns Array of date input fields
         */
        getAllDateInputFields: {value: function() {
            this.editFormContainerEl.elements('.cellEdit.dateCell').waitForVisible();
            return this.editFormContainerEl.elements('.cellEdit.dateCell');
        }},

        /**
         * Returns all Time fields on the form
         * @returns Array of time input fields
         */
        getAllTimeInputFields: {value: function() {
            this.editFormContainerEl.elements('.cellEdit.timeCell').waitForVisible();
            return this.editFormContainerEl.elements('.cellEdit.timeCell');
        }},

        /**
         * Returns all Checkbox fields on the form
         * @returns Array of checkbox fields
         */
        getAllCheckboxFields: {value: function() {
            this.editFormContainerEl.elements('.checkbox').waitForVisible();
            return this.editFormContainerEl.elements('.checkbox');
        }},

        /**
         * Returns all User fields on the form
         * @returns Array of user fields
         */
        getAllUserFields: {value: function() {
            this.editFormContainerEl.elements('.cellEdit.userFormat').waitForVisible();
            return this.editFormContainerEl.elements('.cellEdit.userFormat');
        }},

        /**
         * Select active date from the date Picker
         *
         */
        selectTodaysDateFromDatePicker : {value: function(fieldDateIconElement) {
            fieldDateIconElement.element('.glyphicon-calendar').click();
            //wait for datePicker to be visible
            fieldDateIconElement.element('.datepicker .active').waitForVisible();
            return fieldDateIconElement.element('.datepicker .active').click();
        }},

        /**
         * Select List option from the List combo
         *
         */
        selectFromList : {value: function(fieldElement, listOption) {
            fieldElement.element('.Select-menu-outer').waitForVisible();
            //get all options from the list
            var option = browser.elements('.Select-option').value.filter(function(optionText) {
                return optionText.element(' div div').getText() === listOption;
            });

            if (option !== []) {
                //Click on filtered option
                return option[0].element(' div div').click();
            } else {
                throw new Error('Option with name ' + listOption + " not found in the list");
            }
        }},

        /**
         * Returns all text input fields on the form
         * @returns Array of text input fields
         */
        getRecordsCountInATable: {value: function() {
            //Get the count (eg: 25 records). Get just numbers from string and convert into Integer
            return parseFloat(browser.element('.recordsCount').getText().replace(/[^0-9\.]/g, ''));
        }},

        /**
         * Method to wait until edit form is loaded
         *
         */
        waitForEditFormsTableLoad: {value: function() {
            // wait for edit form
            return browser.waitForVisible('.editForm', browser.waitforTimeout);
        }},

        /**
         * Method to wait until view form is loaded
         *
         */
        waitForViewFormsTableLoad: {value: function() {
            // wait for view form
            return browser.waitForVisible('.viewForm', browser.waitforTimeout);
        }},

        /**
         * Returns all error messages from the errorMessage container on the form
         * @returns Array of error messages
         */
        getErrorMessagesFromContainer: {value: function() {
            var actualErrMsgs = [];
            //get all error messages on the form error container
            this.formErrorMessageContainerEl.elements('.qbErrorMessageItem').value.map(function(errMsg) {
                actualErrMsgs.push(errMsg.getText());
            });
            return actualErrMsgs;
        }},

        /**
         * Method to click on close button on error message container on the form.
         */
        clickCloseBtnOnErrorContainer: {value: function() {
            this.formErrorMessageContainerCloseBtn.waitForVisible();
            return this.formErrorMessageContainerCloseBtn.click();
        }},

        /**
         * Method to click on alert button on form footer.
         */
        clickAlertBtnOnFormFooter: {value: function() {
            this.editFormFooterErrorAlertBtn.waitForVisible();
            return this.editFormFooterErrorAlertBtn.click();
        }},

        /**
         * Given a record element in agGrid, click on the record to select that record and then click on edit pencil from the view form
         * @param recordRowIndex
         */
        openRecordInViewMode : {value: function(recordRowIndex) {
            var recordRowEl = reportContentPO.getRecordRowElement(recordRowIndex);
            // Hardcoded to click on the third cell of the record
            var recordCellEl = reportContentPO.getRecordRowCells(recordRowEl).value[3];

            //scroll to third cell of recordRowIndex row
            if (browserName === 'chrome') {
                recordCellEl.moveToObject();
            } else {
                browser.execute(function(elelemt) {
                    elelemt.scrollIntoView(false);
                }, recordCellEl);
            }
            //Click on the third cell of recordRowIndex row
            recordCellEl.click();
            //wait until view form is visible
            return this.viewFormContainerEl.waitForVisible();
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
                this.editFormContainerEl.waitForVisible();
                //need these for trowser to drop down
                return browser.pause(3000);
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
            var getAllCheckBoxs = browser.elements('input.ag-selection-checkbox').value.filter(function(checkbox) {
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
                return this.editFormContainerEl.waitForVisible();
            } else {
                throw new Error('Checkbox not found at row ' + recordRowIndex);
            }
        }},

        /**
         * Given a record element in agGrid, click on the record to select that record and then click on edit pencil from the view form
         * @param recordRowIndex
         */
        clickRecordEditPencilInViewForm : {value: function(recordRowIndex) {
            var recordRowEl = reportContentPO.getRecordRowElement(recordRowIndex);
            // Hardcoded to click on the first cell of the record
            var recordCellEl = reportContentPO.getRecordRowCells(recordRowEl).value[0];
            //scroll to third cell of recordRowIndex row
            if (browserName === 'chrome') {
                recordCellEl.moveToObject();
            } else {
                browser.execute(function(elelemt) {
                    elelemt.scrollIntoView(false);
                }, recordCellEl);
            }
            //Click on the first cell of recordRowIndex row
            recordCellEl.click();
            //wait until view form is visible
            this.viewFormContainerEl.waitForVisible();
            //click on the edit pencil in view form actions
            this.editPencilBtnOnStageInViewForm.click();
            //wait until edit form is visible
            return this.editFormContainerEl.waitForVisible();
        }},

        /**
         * Method to set input value for a field on the form.
         */
        setFormInputValue: {value: function(getAllUniqueFieldTypes, fieldValue) {
            var fieldTypes = getAllUniqueFieldTypes;
            for (var i = 0; i < fieldTypes.value.length; i++) {
                if (browserName === 'firefox') {
                    fieldTypes.value[i].click();
                    browser.pause(100);
                    fieldTypes.value[i].setValue(fieldValue);
                    browser.pause(100);
                    fieldTypes.value[i].element('..').click();
                    browser.pause(100);
                } else {
                    fieldTypes.value[i].setValue(fieldValue);
                }
            }
        }},

        /**
         * Method to enter field values in the form.
         */
        enterFormValues : {value: function(fieldType) {
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            var i;
            //get all input fields in the form
            if (fieldType === 'allTextFields') {
                var textFields = this.getAllFieldRows();
                for (i = 0; i < textFields.value.length; i++) {
                    if (textFields.value[i].element('.fieldLabel').getText() === 'Text Field') {
                        textFields.value[i].element('input[type="text"].textField').setValue(sText);
                    }
                }
            } else if (fieldType === 'allEmailFields') {
                this.setFormInputValue(this.getAllEmailInputFields(), sEmail);
            }else if (fieldType === 'allPhoneFields') {
                this.setFormInputValue(this.getAllPhoneInputFields(), sPhone);
            }else if (fieldType === 'allUrlFields') {
                this.setFormInputValue(this.getAllUrlInputFields(), sUrl);
            }else if (fieldType === 'allDurationFields') {
                this.setFormInputValue(this.getAllDurationInputFields(), sNumeric);
            } else if (fieldType === 'allNumericFields') {
                this.setFormInputValue(this.getAllNumericInputFields(), sNumeric);
            } else if (fieldType === 'allDateFields') {
                //get all date field input validators
                var dateFields = this.getAllDateInputFields();
                for (i = 0; i < dateFields.value.length; i++) {
                    if (browserName === 'safari') {
                        dateFields.value[i].element('input').setValue(sDate.replace(/-/g, "/"));
                    } else {
                        dateFields.value[i].element('input').setValue(sDate);
                    }
                }
            } else if (fieldType === 'allTimeFields') {
                //get all time fields on form
                var timeFields = this.getAllTimeInputFields();
                for (i = 0; i < timeFields.value.length; i++) {
                    timeFields.value[i].element('.Select-control').click();
                    this.selectFromList(timeFields.value[i], sTime);
                }

            } else if (fieldType === 'allCheckboxFields') {
                //get all checkbox fields on form
                var checkboxFields = this.getAllCheckboxFields();
                for (i = 0; i < checkboxFields.value.length; i++) {
                    //if checkbox not selected then check it.
                    if (!checkboxFields.value[i].element('input').isSelected()) {
                        checkboxFields.value[i].click();
                    }
                }
            }else if (fieldType === 'allUserField') {
                //get all user field input validators
                var userFields = this.getAllUserFields();
                for (i = 0; i < userFields.value.length; i++) {
                    userFields.value[i].element('.Select-control').click();
                    this.selectFromList(userFields.value[i], sUser);
                }
            }
        }},

        /**
         * Method to enter field values in the form.
         */
        enterInvalidFormValues : {value: function(fieldType, invalidValue) {
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            var i;
            //get all input fields in the form
            if (fieldType === 'allTextFields') {
                var textFields = this.getAllFieldRows();
                for (i = 0; i < textFields.value.length; i++) {
                    if (textFields.value[i].element('.fieldLabel').getText() === 'Text Field') {
                        textFields.value[i].element('input[type="text"].textField').setValue(invalidValue);
                    }
                }
            } else if (fieldType === 'allEmailFields') {
                this.setFormInputValue(this.getAllEmailInputFields(), invalidValue);
            }else if (fieldType === 'allPhoneFields') {
                this.setFormInputValue(this.getAllPhoneInputFields(), invalidValue);
            }else if (fieldType === 'allUrlFields') {
                this.setFormInputValue(this.getAllUrlInputFields(), invalidValue);
            }else if (fieldType === 'allDurationFields') {
                this.setFormInputValue(this.getAllDurationInputFields(), invalidValue);
            } else if (fieldType === 'allNumericFields') {
                this.setFormInputValue(this.getAllNumericInputFields(), invalidValue);
            }
        }},

        /**
         * Method to verify error messages on the form error container.
         */
        verifyErrorMessages : {value: function(expectedErrorMessages) {
            this.formErrorMessageContainerEl.waitForVisible();
            // verify the heading of the error message container
            var errorHeader = 'Please fix this field';
            if (expectedErrorMessages.length > 1) {
                errorHeader = 'Please fix these ' + expectedErrorMessages.length + ' fields.';
            }
            //Get all error messages from error container
            var actualErrorMessages = this.getErrorMessagesFromContainer();
            //Verify the errors from the container are expected errors
            expect(actualErrorMessages).toEqual(expectedErrorMessages);
            expect(this.formErrorMessageHeader.getText()).toBe(errorHeader);
            //Close the error container
            this.clickCloseBtnOnErrorContainer();
        }},

        /**
         * Method to click a button on Save changes dialogue box
         */
        clickButtonOnSaveChangesDialog : {value: function(btnName) {
            //get all save buttons on the form
            var btns = this.formsSaveChangesDialogFooter.elements('button').value.filter(function(button) {
                return button.getAttribute('textContent') === btnName;
            });

            if (btns !== []) {
                //Click on filtered save button
                return btns[0].click();
            } else {
                throw new Error('button with name ' + btnName + " not found on the Save Changes Dialogue box");
            }
        }},

        /**
         * Method to close save changes dialogue box by clicking on 'Dont save' button
         */
        closeSaveChangesDialogue : {value: function() {
            //Need this for notifications to slide away
            browser.pause(5000);
            //click on form close button
            this.clickFormCloseBtn();
            //wait until save changes dialogue popups
            this.formsSaveChangesDialog.waitForVisible();
            //come out of dirty form state
            expect(this.formsSaveChangesDialogHeader.getText()).toBe('Save changes before leaving?');
            //close the dialogue by clicking on don't save
            return this.clickButtonOnSaveChangesDialog("Don't save");
        }},

        /**
         * Method to verify cell values in the report table for table 1 -> report1 -> ListAll report
         */
        verifyFieldValuesInReportTable : {value: function(expectedRecordValues) {
            for (var i = 0; i < expectedRecordValues.length; i++) {
                console.log("The expected values are: " + JSON.stringify(expectedRecordValues));
                //text field
                expect(expectedRecordValues[0]).toBe(sText.toString());
                //numeric field
                expect(expectedRecordValues[1]).toBe(sNumeric.toString());
                //numeric currency field
                expect(expectedRecordValues[2]).toBe('$' + sNumeric.toString());
                //numeric percent field
                expect(expectedRecordValues[3]).toBe(sNumeric.toString() + '%');
                //numeric rating field
                expect(expectedRecordValues[4]).toBe(sNumeric.toString());
                //date field
                expect(expectedRecordValues[5]).toBe(sDate.toString());
                //date time field
                expect(expectedRecordValues[6]).toBe(sDate.toString() + ' ' + sTime.toString());
                //TODO time of day field not working on firefox verify. i do see it gets selected via automation. do manual testing to verify this
                if (browserName !== 'firefox') {
                    expect(expectedRecordValues[7]).toBe(sTime.toString());
                }
                //numeric duration field
                expect(expectedRecordValues[8]).toBe('4.76142857142857  weeks');
                //checkbox field
                expect(expectedRecordValues[9]).toBe('true');
                //email field
                expect(expectedRecordValues[10]).toBe('(508) 481-1015');
                //phone field
                expect(expectedRecordValues[11]).toBe(sEmail.toString());
                //url field
                expect(expectedRecordValues[12]).toBe(sUrl.toString());
                //user Field
                if (browserName !== 'firefox') {
                    expect(expectedRecordValues[13]).toBe('administrator User for default SQL Installation');
                }
            }
        }},

        /**
         * Method to verify any messages on notification container
         */
        assertNotificationMessage: {value: function(expectedMessage) {
            this.notificationWindow.waitForVisible();
            var messageText = this.notificationWindow.getText();
            expect(messageText).toContain(expectedMessage.toString());
        }},

        /**
         * Function that gets user authentication
         */
        getUserAuthentication : {value: function(realmName, realmId, userId) {
            //get the user authentication
            return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
        }},

        /**
         * Method to verify fields to not present on the form
         */
        verifyFieldsNotPresentOnForm : {value: function(elementFormName, expectedFieldsNotPresentOnForm) {
            var fieldsOnForm = [];

            //get all field Labels from the form
            var fieldLabelsOnForm = this.getAllFieldLabelsOnForm(elementFormName);
            //For each field Label on push get the text and push into actual array for comparision
            for (var i = 0; i < fieldLabelsOnForm.value.length;i++) {
                var fieldLabel = fieldLabelsOnForm.value[i].getText();
                fieldsOnForm.push(fieldLabel);
            }
            //Verify that fieldsOnForm array don't contain expectedFieldsNotPresentOnForm items
            expect(expectedFieldsNotPresentOnForm.indexOf(fieldsOnForm)).toBe(-1);
        }}

    });

    module.exports = FormsPage;
}());
