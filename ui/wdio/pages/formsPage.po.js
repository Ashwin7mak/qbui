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
    var sPhone = '15084811015';
    var sNumeric = '33.33';
    var sTime = '12:00 am';
    var date = new Date();
    var sDate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + '-' + date.getFullYear();
    var sUser = 'administrator';

    var FormsPage = Object.create(e2ePageBase, {
        //Record add button on stage
        addRecordBtnOnStage : {get: function() {return browser.element('.layout-stage .pageActions .iconTableUISturdy-add');}},
        //view form
        viewFormContainerEl : {get: function() {return browser.element('.viewForm .formTable');}},
        //edit Form
        editFormContainerEl : {get: function() {return browser.element('.editForm .formTable');}},
        //form footer save buttons(there will be 2 buttons)
        editFormSaveBtns : {get: function() {return browser.elements('.trowserFooter .rightIcons .saveButtons button');}},
        //form footer alert button
        editFormFooterErrorAlertBtn : {get: function() {return browser.element('.trowserFooter .rightIcons .saveButtons .iconTableUISturdy-alert');}},

        //edit pencil in view form
        editPencilBtnOnStageInViewForm : {get: function() {return browser.element('.stageRight .pageActions .iconTableUISturdy-edit');}},
        //edit pencil in report actions tool bar
        editPencilBtnOnReportActions : {get: function() {return browser.element('.reportActions .actionIcons .iconTableUISturdy-edit');}},
        //edit pencil in record actions
        editPencilBtnInRecordActions : {get: function() {return browser.elements('.recordActions .iconActionButton.edit');}},

        //form close button
        formCloseBtn : {get: function() {return browser.element('.trowserHeader .iconTableUISturdy-close');}},

        //form error message container
        formErrorMessageContainerEl : {get: function() {return browser.element('.loadedContent .qbErrorMessageVisible');}},
        //header on error message container
        formErrorMessageHeader : {get: function() {return this.formErrorMessageContainerEl.element('.qbErrorMessageHeader');}},
        //close btn on error container
        formErrorMessageContainerCloseBtn : {get: function() {return this.formErrorMessageContainerEl.element('.iconTableUISturdy-x-secondary');}},
        formErrorMessageContent : {get: function() {return this.formErrorMessageContainerEl.element('.qbErrorMessageContent');}},

        //Save changes before leaving dialogue
        formsSaveChangesDialog : {get: function() {return browser.element('.modal-dialog');}},
        formsSaveChangesDialogHeader : {get: function() {return this.formsSaveChangesDialog.element('.modal-body');}},
        formsSaveChangesDialogFooter : {get: function() {return this.formsSaveChangesDialog.element('.modal-footer');}},

        //notification window
        notificationWindow : {get: function() {return browser.element('.notification .notification-message .message');}},


        /**
         * Method to click Add Record button on Report Table
         */
        clickAddRecordBtnOnStage: {value: function() {
            var self = this;
            self.addRecordBtnOnStage.waitForVisible();
            //Click on add record button
            self.addRecordBtnOnStage.click();
            //wait until you see edit container and save buttons in footer
            self.editFormContainerEl.waitForVisible();
            return this.editFormSaveBtns.waitForVisible();
        }},

        /**
         * Method to click Save button with name on the form.
         */
        clickBtnOnForm : {value: function(btnName) {
            var self = this;
            //get all save buttons on the form
            var saveButtons = self.editFormSaveBtns;
            for (var i = 0; i < saveButtons.value.length; i++) {
                if (saveButtons.value[i].getText() === btnName) {
                    //Click if button name filtered is same as parameter button name
                    return saveButtons.value[i].click();
                }
            }
        }},

        /**
         * Method to click Save button on the form.
         */
        clickFormSaveBtn : {value: function() {
            var self = this;
            //Click on form Save button
            self.editFormSaveBtns.waitForVisible();
            return self.clickBtnOnForm('Save');
        }},
        /**
         * Method to click Save & Add Another button on the form Add.
         */
        clickFormSaveAndAddAnotherBtn : {value: function() {
            var self = this;
            //Click on Save and add Another button
            self.editFormSaveBtns.waitForVisible();
            return self.clickBtnOnForm('Save & Add Another');
        }},

        /**
         * Method to click Save & Next button on the form Edit.
         */
        clickFormSaveAndNextBtn : {value: function() {
            var self = this;
            //Click on Save and Next button on form
            self.editFormSaveBtns.waitForVisible();
            return self.clickBtnOnForm('Save & Next');
        }},

        /**
         * Method to click on close button to close the form.
         */
        clickFormCloseBtn : {value: function() {
            var self = this;
            //Click on form close button
            self.formCloseBtn.waitForVisible();
            return self.formCloseBtn.click();
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
        getAllTextInputFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('input[type="text"].textField').waitForVisible();
            return self.editFormContainerEl.elements('input[type="text"].textField');
        }},

        /**
         * Returns all email input fields on the form
         * @returns Array of email input fields
         */
        getAllEmailInputFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('input[type="email"].textField').waitForVisible();
            return self.editFormContainerEl.elements('input[type="email"].textField');
        }},

        /**
         * Returns all phone input fields on the form
         * @returns Array of phone input fields
         */
        getAllPhoneInputFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('input[type="tel"].phoneNumber').waitForVisible();
            return self.editFormContainerEl.elements('input[type="tel"].phoneNumber');
        }},

        /**
         * Returns all url input fields on the form
         * @returns Array of url input fields
         */
        getAllUrlInputFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('input[type="url"].textField').waitForVisible();
            return self.editFormContainerEl.elements('input[type="url"].textField');
        }},

        /**
         * Returns all duration input fields on the form
         * @returns Array of duration input fields
         */
        getAllDurationInputFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('input[placeholder="days"].textField').waitForVisible();
            return self.editFormContainerEl.elements('input[placeholder="days"].textField');
        }},

        /**
         * Returns all numeric input fields on the form
         * @returns Array of numeric input fields
         */
        getAllNumericInputFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('.numericField').waitForVisible();
            return self.editFormContainerEl.elements('.numericField');
        }},

        /**
         * Returns all Date fields on the form
         * @returns Array of date input fields
         */
        getAllDateInputFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('.cellEdit.dateCell input').waitForVisible();
            return self.editFormContainerEl.elements('.cellEdit.dateCell input');
        }},

        /**
         * Returns all Time fields on the form
         * @returns Array of time input fields
         */
        getAllTimeInputFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('.cellEdit.timeCell .Select-input input').waitForVisible();
            return self.editFormContainerEl.elements('.cellEdit.timeCell .Select-input input');
        }},

        /**
         * Returns all Checkbox fields on the form
         * @returns Array of checkbox fields
         */
        getAllCheckboxFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('.checkbox').waitForVisible();
            return self.editFormContainerEl.elements('.checkbox');
        }},

        /**
         * Returns all User fields on the form
         * @returns Array of user fields
         */
        getAllUserFields: {value: function() {
            var self = this;
            self.editFormContainerEl.elements('.cellEdit.userFormat input').waitForVisible();
            return self.editFormContainerEl.elements('.cellEdit.userFormat input');
        }},

        /**
         * Returns all text input fields on the form
         * @returns Array of text input fields
         */
        getRecordsCountInATable: {value: function() {
            //Get the count (eg: 25 records). Get just numbers from string and convert into Integer
            return parseInt(browser.element('.recordsCount').getText().replace(/[^0-9\.]/g, ''));
        }},

        /**
         * Method to wait until edit form is loaded
         *
         */
        waitForEditFormsTableLoad: {value: function() {
            return browser.elements('.editForm .formTable .fieldRow').waitForVisible();
        }},

        /**
         * Method to wait until view form is loaded
         *
         */
        waitForViewFormsTableLoad: {value: function() {
            //return browser.waitForVisible('.viewForm .formTable .fieldRow');
            return browser.elements('.viewForm .formTable .fieldRow').waitForVisible();
        }},

        /**
         * Returns all error messages from the errorMessage container on the form
         * @returns Array of error messages
         */
        getErrorMessagesFromContainer: {value: function() {
            var self = this;
            var actualErrMsgs = [];
            var errorMsgs = self.formErrorMessageContainerEl.elements('.qbErrorMessageItem');
            for (var i = 0; i < errorMsgs.value.length; i++) {
                actualErrMsgs.push(errorMsgs.value[i].getText());
            }
            return actualErrMsgs;
        }},

        /**
         * Method to click on close button on error message container on the form.
         */
        clickCloseBtnOnErrorContainer: {value: function() {
            var self = this;
            self.formErrorMessageContainerCloseBtn.waitForVisible();
            return self.formErrorMessageContainerCloseBtn.click();
        }},

        /**
         * Method to click on alert button on form footer.
         */
        clickAlertBtnOnFormFooter: {value: function() {
            var self = this;
            self.editFormFooterErrorAlertBtn.waitForVisible();
            return self.editFormFooterErrorAlertBtn.click();
        }},

        /**
         * Given a record element in agGrid, click on the record to select that record and then click on edit pencil from the view form
         * @param recordRowIndex
         */
        openRecordInViewMode : {value: function(recordRowIndex) {
            var self = this;
            var recordRowEl = reportContentPO.getRecordRowElement(recordRowIndex);
            // Hardcoded to click on the third cell of the record
            var recordCellEl = reportContentPO.getRecordRowCells(recordRowEl).value[3];
            //Click on the first cell of recordRowIndex row
            recordCellEl.click();
            //wait until view form is visible
            return self.viewFormContainerEl.waitForVisible();
        }},

        /**
         * Given a record element in agGrid, click on the edit pencil for that record to open the edit form
         * @param recordRowIndex
         */
        clickRecordEditPencilInRecordActions : {value: function(recordRowIndex) {
            var self = this;
            var getAllEdits = this.editPencilBtnInRecordActions;
            for (var i = 0; i < getAllEdits.value.length;i++) {
                if (i === recordRowIndex) {
                    //Click on the edit pencil of a recordRowIndex row
                    getAllEdits.value[i].click();
                }
            }
            return self.editFormContainerEl.waitForVisible();
        }},

        /**
         * Given a record element in agGrid, click on the checkbox to select that record and then click on edit pencil from the table actions
         * @param recordRowIndex
         */
        clickRecordEditPencilInTableActions : {value: function(recordRowIndex) {
            var self = this;
            var getAllCheckBoxs = browser.elements('.ag-selection-checkbox');
            for (var i = 0; i < getAllCheckBoxs.value.length;i++) {
                if (i === recordRowIndex) {
                    //Click on the checkbox of a recordRowIndex row to select that row
                    getAllCheckBoxs.value[i].click();
                }
            }
            //click on the edit pencil in table actions
            self.editPencilBtnOnReportActions.click();
            //wait until edit form is visible
            return self.editFormContainerEl.waitForVisible();
        }},

        /**
         * Given a record element in agGrid, click on the record to select that record and then click on edit pencil from the view form
         * @param recordRowIndex
         */
        clickRecordEditPencilInViewForm : {value: function(recordRowIndex) {
            var self = this;
            var recordRowEl = reportContentPO.getRecordRowElement(recordRowIndex);
            // Hardcoded to click on the first cell of the record
            var recordCellEl = reportContentPO.getRecordRowCells(recordRowEl).value[0];
            //Click on the first cell of recordRowIndex row
            recordCellEl.click();
            //wait until view form is visible
            self.viewFormContainerEl.waitForVisible();
            //click on the edit pencil in view form actions
            self.editPencilBtnOnStageInViewForm.click();
            //wait until edit form is visible
            return self.editFormContainerEl.waitForVisible();
        }},

        /**
         * Method to enter field values in the form.
         */
        enterFormValues : {value: function(fieldType) {
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            var self = this;
            var i;
            //get all input fields in the form
            if (fieldType === 'allTextFields') {
                var textFields = self.getAllTextInputFields();
                for (i = 0; i < textFields.value.length; i++) {
                    textFields.value[i].setValue(sText);
                }
            } else if (fieldType === 'allEmailFields') {
                var emailFields = self.getAllEmailInputFields();
                for (i = 0; i < emailFields.value.length; i++) {
                    emailFields.value[i].setValue(sEmail);
                }

            }else if (fieldType === 'allPhoneFields') {
                var phoneFields = self.getAllPhoneInputFields();
                for (i = 0; i < phoneFields.value.length; i++) {
                    phoneFields.value[i].setValue(sPhone);
                }

            }else if (fieldType === 'allUrlFields') {
                var urlFields = self.getAllUrlInputFields();
                for (i = 0; i < urlFields.value.length; i++) {
                    urlFields.value[i].setValue(sUrl);
                }

            }else if (fieldType === 'allDurationFields') {
                var durationFields = self.getAllDurationInputFields();
                for (i = 0; i < durationFields.value.length; i++) {
                    durationFields.value[i].setValue(sNumeric);
                }
            } else if (fieldType === 'allNumericFields') {
                //get all numeric input field validators on the form
                var numericFields = self.getAllNumericInputFields();
                for (i = 0; i < numericFields.value.length; i++) {
                    numericFields.value[i].setValue(sNumeric);
                }
            } else if (fieldType === 'allDateFields') {
                //get all date field input validators
                var dateFields = self.getAllDateInputFields();
                for (i = 0; i < dateFields.value.length; i++) {
                    if (browserName === 'safari' && browserName === 'firefox') {
                        dateFields.value[i].setValue(sDate.replace(/-/g, "/"));
                    } else {
                        dateFields.value[i].setValue(sDate);
                    }
                }
            } else if (fieldType === 'allTimeFields' && browserName !== 'firefox') {
                //get all time field input validators
                var timeFields = self.getAllTimeInputFields();
                for (i = 0; i < timeFields.value.length; i++) {
                    timeFields.value[i].setValue(sTime);
                }

            } else if (fieldType === 'allCheckboxFields') {
                var checkboxFields = self.getAllCheckboxFields();
                for (i = 0; i < checkboxFields.value.length; i++) {
                    //if checkbox not selected then check it.
                    if (!checkboxFields.value[i].element('input').isSelected()) {
                        checkboxFields.value[i].click();
                    }
                }
            }else if (fieldType === 'allUserField') {
                //get all user field input validators
                var userFields = self.getAllUserFields();
                for (i = 0; i < userFields.value.length; i++) {
                    userFields.value[i].keys([sUser, 'Down', 'Enter']);
                }
            }
        }},

        /**
         * Method to enter field values in the form.
         */
        enterInvalidFormValues : {value: function(fieldType) {
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            var i;
            var self = this;
            //get all input fields in the form
            if (fieldType === 'allTextFields') {
                var textFields = self.getAllTextInputFields();
                for (i = 0; i < textFields.value.length; i++) {
                    textFields.value[i].setValue('');
                }
            } else if (fieldType === 'allEmailFields') {
                var emailFields = self.getAllEmailInputFields();
                for (i = 0; i < emailFields.value.length; i++) {
                    emailFields.value[i].setValue('!@#$%^');
                }

            }else if (fieldType === 'allPhoneFields') {
                var phoneFields = self.getAllPhoneInputFields();
                for (i = 0; i < phoneFields.value.length; i++) {
                    phoneFields.value[i].setValue('!@#$%^');
                }

            }else if (fieldType === 'allUrlFields') {
                var urlFields = self.getAllUrlInputFields();
                for (i = 0; i < urlFields.value.length; i++) {
                    urlFields.value[i].setValue('!@#$%^');
                }

            }else if (fieldType === 'allDurationFields') {
                var durationFields = self.getAllDurationInputFields();
                for (i = 0; i < durationFields.value.length; i++) {
                    durationFields.value[i].setValue('&*^^%%%');
                }
            } else if (fieldType === 'allNumericFields') {
                //get all numeric input field validators on the form
                var numericFields = self.getAllNumericInputFields();
                for (i = 0; i < numericFields.value.length; i++) {
                    numericFields.value[i].setValue('!@#$%^');
                }
            }
        }},

        /**
         * Method to verify error messages on the form error container.
         */
        verifyErrorMessages : {value: function(expectedErrorMessages) {
            var self = this;

            self.formErrorMessageContainerEl.waitForVisible();
            // verify the heading of the error message container
            expect(self.formErrorMessageHeader.getText()).toBe('Please fix these ' + expectedErrorMessages.length + ' fields.');
            //Get all error messages from error container
            var actualErrorMessages = self.getErrorMessagesFromContainer();
            //Verify the errors from the container are expected errors
            expect(actualErrorMessages).toEqual(expectedErrorMessages);
            //Close the error container
            self.clickCloseBtnOnErrorContainer();
        }},

        /**
         * Method to click a button on Save changes dialogue box
         */
        clickButtonOnSaveChangesDialog : {value: function(btnName) {
            var self = this;
            var btns = self.formsSaveChangesDialogFooter.elements('button');
            for (var i = 0; i < btns.value.length; i++) {
                if (btns.value[i].getText() === btnName) {
                    return btns.value[i].click();
                }
            }
        }},

        /**
         * Method to close save changes dialogue box by clicking on 'Dont save' button
         */
        closeSaveChangesDialogue : {value: function() {
            var self = this;
            //click on form close button
            self.clickFormCloseBtn();
            //wait until save changes dialogue popups
            self.formsSaveChangesDialog.waitForVisible();
            //come out of dirty form state
            expect(self.formsSaveChangesDialogHeader.getText()).toBe('Save changes before leaving?');
            //close the dialogue by clicking on don't save
            return self.clickButtonOnSaveChangesDialog("Don't save");
        }},

        /**
         * Method to verify cell values in the report table for table 1 -> report1 -> ListAll report
         */
        verifyFieldValuesInReportTable : {value: function(expectedRecordValues) {
            for (var i = 0; i < expectedRecordValues.length; i++) {
                //text field
                expect(expectedRecordValues[1]).toBe(sText);
                //numeric field
                expect(expectedRecordValues[2]).toBe(sNumeric.toString());
                //numeric currency field
                expect(expectedRecordValues[3]).toBe('$' + sNumeric);
                //numeric percent field
                expect(expectedRecordValues[4]).toBe(sNumeric + '%');
                //numeric rating field
                expect(expectedRecordValues[5]).toBe(sNumeric.toString());
                //date field
                expect(expectedRecordValues[6]).toBe(sDate);
                //date time field
                expect(expectedRecordValues[7]).toBe(sDate + ' ' + sTime);
                //TODO time of day field not working on firefox verify. i do see it gets selected via automation. do manual testing to verify this
                expect(expectedRecordValues[8]).toBe(sTime);
                //numeric duration field
                //expect(expectedRecordValues[9]).toBe('9.92063E-9 weeks');
                //checkbox field
                expect(expectedRecordValues[10]).toBe('true');
                //email field
                //expect(expectedRecordValues[11]).toBe(sPhone);
                //phone field
                expect(expectedRecordValues[12]).toBe(sEmail);
                //url field
                expect(expectedRecordValues[13]).toBe(sUrl);
                //user Field
                // expect(expectedRecordValues[14]).toBe('administrator User for default SQL Installation');
            }
        }},

        /**
         * Method to verify any messages on notification container
         */
        assertNotificationMessage: {value: function(expectedMessage) {
            var self = this;
            self.notificationWindow.waitForVisible();
            var messageText = self.notificationWindow.getText();
            expect(messageText).toContain(expectedMessage.toString());
            // By setting the true flag it will do the inverse of the function (in this case wait for it to be invisible)
            browser.waitForExist('.notification-message', browser.waitforTimeout, true);
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
            var self = this;
            var fieldsOnForm = [];

            //get all field Labels from the form
            var fieldLabelsOnForm = self.getAllFieldLabelsOnForm(elementFormName);
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
