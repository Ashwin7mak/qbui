(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    // Lodash utility library
    var _ = require('lodash');

    // Import the base page object

    var e2ePageBase = requirePO('e2ePageBase');
    var reportServicePage = require('../common/services/reportService');
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
        //view form
        viewFormContainerEl : {get: function() {return browser.element('.viewForm');}},

        //edit Form
        editFormContainerEl : {get: function() {return browser.element('.editForm .formTable');}},

        //form save buttons
        editFormSaveBtns : {get: function() {return browser.elements('.trowserFooter .rightIcons .saveButtons button');}},

        //alert button
        formErrorMsgAlertBtn : {get: function() {return browser.element('.iconTableUISturdy-alert');}},


        ////form table field values
        //formTableFieldValueElList : {get: function() {return this.formEditContainerEl.elements('.qbPanelBody.formTable.input');}},
        //
        ////form title
        //formTitle : {get: function() {return this.formContainerEl.elements('.qbPanelHeaderTitleText');}},

        //form error message container
        formErrorMessageContainerEl : {get: function() {return browser.elements('.loadedContent .qbErrorMessageVisible');}},

        //header on error message container
        formErrorMessageHeader : {get: function() {return this.formErrorMessageContainerEl.element('.qbErrorMessageHeader');}},

        //close btn on error container
        formErrorMessageContainerCloseBtn : {get: function() {return this.formErrorMessageContainerEl.element('.iconTableUISturdy-x-secondary');}},

        formErrorMessageHeaderAlertBtn : {get: function() {return this.formErrorMessageHeader.elements('.leftIcons.iconTableUISturdy-alert');}},

        formErrorMessageContent : {get: function() {return this.formErrorMessageVisisble.element('.qbErrorMessageContent');}},

        //Save changes before leaving dialogue
        formsSaveChangesDialog : {get: function() {return browser.element('.modal-dialog');}},
        formsSaveChangesDialogHeader : {get: function() {return this.formsSaveChangesDialog.element('.modal-body');}},
        formsSaveChangesDialogFooter : {get: function() {return this.formsSaveChangesDialog.element('.modal-footer');}},

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
            this.formErrorMsgAlertBtn.waitForVisible();
            return this.formErrorMsgAlertBtn.click();
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
         * Returns all text input fields on the form
         * @returns Array of text input fields
         */
        getAllTextInputFields: {value: function() {
            this.editFormContainerEl.elements('input[type="text"].textField').waitForVisible();
            return this.editFormContainerEl.elements('input[type="text"].textField');
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
            this.editFormContainerEl.elements('input[type="tel"].phoneNumber').waitForVisible();
            return this.editFormContainerEl.elements('input[type="tel"].phoneNumber');
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
            this.editFormContainerEl.elements('input[placeholder="days"].textField').waitForVisible();
            return this.editFormContainerEl.elements('input[placeholder="days"].textField');
        }},

        /**
         * Returns all numeric input fields on the form
         * @returns Array of numeric input fields
         */
        getAllNumericInputFields: {value: function() {
            this.editFormContainerEl.elements('.numericField').waitForVisible();
            return this.editFormContainerEl.elements('.numericField');
        }},

        /**
         * Returns all Date fields on the form
         * @returns Array of date input fields
         */
        getAllDateInputFields: {value: function() {
            this.editFormContainerEl.elements('.cellEdit.dateCell input').waitForVisible();
            return this.editFormContainerEl.elements('.cellEdit.dateCell input');
        }},

        /**
         * Returns all Time fields on the form
         * @returns Array of time input fields
         */
        getAllTimeInputFields: {value: function() {
            this.editFormContainerEl.elements('.cellEdit.timeCell .Select-control').waitForVisible();
            return this.editFormContainerEl.elements('.cellEdit.timeCell .Select-control');
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
            this.editFormContainerEl.elements('.cellEdit.userFormat .Select-control').waitForVisible();
            return this.editFormContainerEl.elements('.cellEdit.userFormat .Select-control');
        }},

        /**
         * Returns all error messages from the errorMessage container on the form
         * @returns Array of error messages
         */
        getErrorMessagesFromContainer: {value: function() {
            var actualErrMsgs = [];
            var errorMsgs = this.formErrorMessageContainerEl.elements('.qbErrorMessageItem');
            for (var i = 0; i < errorMsgs.value.length; i++) {
                actualErrMsgs.push(errorMsgs.value[i].getText());
            }
            return actualErrMsgs;
        }},

        /**
         * Method to click Add Record button on Report Table
         */
        clickAddRecordBtnOnStage: {value: function() {
            browser.elements('.layout-stage .pageActions .iconTableUISturdy-add').waitForVisible();
            browser.element('.iconTableUISturdy-add').click();
            return this.editFormContainerEl.waitForVisible();
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
                    return saveButtons.value[i].click();
                }
            }
        }},

        /**
         * Method to click Save button on the form.
         */
        clickFormSaveBtn : {value: function() {
            var self = this;
            this.editFormSaveBtns.waitForVisible();
            return self.clickBtnOnForm('Save');
        }},
        /**
         * Method to click Save & Add Another button on the form Add.
         */
        clickFormSaveAndAddAnotherBtn : {value: function() {
            var self = this;
            this.editFormSaveBtns.waitForVisible();
            return self.clickBtnOnForm('Save & Add Another');
        }},

        /**
         * Method to click Save & Next button on the form Edit.
         */
        clickFormSaveAndNextBtn : {value: function() {
            var self = this;
            this.editFormSaveBtns.waitForVisible();
            return self.clickBtnOnForm('Save & Next');
        }},

        //clickButtonOnSaveChangesDialog : {value: function(btnName) {
        //    var self = this;
        //    var btns = self.formsSaveChangesDialogFooter.elements('button');
        //
        //    for (var i=0; i< btns.length; i++){
        //        if (btns[i].value === btnName) {
        //            return btns[i].click ();
        //        }
        //    }
        //}},

        clickFormAlertBtn : {value: function() {
            var self = this;
            self.formErrorMsgAlertBtn.waitForVisible();
            return self.formErrorMsgAlertBtn.click();
        }},
        //
        //clickFormCloseBtn : {value: function() {
        //    var self = this;
        //    return reportServicePage.waitForElementToBeClickable(self.formCloseBtn).then(function() {
        //        return self.formCloseBtn.click();
        //    });
        //}},
        //
        //selectTodaysDateFromDatePicker : {value: function(fieldDateIconElement) {
        //    return fieldDateIconElement.element(by.className('glyphicon-calendar')).click().then(function() {
        //        return reportServicePage.waitForElement(fieldDateIconElement.element(by.className('datepicker'))).then(function() {
        //            return reportServicePage.waitForElement(fieldDateIconElement.element(by.className('datepicker')).element(by.className('active'))).then(function() {
        //                return fieldDateIconElement.element(by.className('datepicker')).element(by.className('active')).click();
        //            });
        //        });
        //    });
        //}},
        //
        /**
         * Method to enter field values in the form.
         */
        enterFormValues : {value: function(fieldType) {
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            var i;
            //get all input fields in the form
            if (fieldType === 'allTextFields') {
                var textFields = this.getAllTextInputFields();
                for (i = 0; i < textFields.value.length; i++) {
                    textFields.value[i].setValue(sText);
                }
            } else if (fieldType === 'allEmailFields') {
                var emailFields = this.getAllEmailInputFields();
                for (i = 0; i < emailFields.value.length; i++) {
                    emailFields.value[i].setValue(sEmail);
                }

            }else if (fieldType === 'allPhoneFields') {
                var phoneFields = this.getAllPhoneInputFields();
                for (i = 0; i < phoneFields.value.length; i++) {
                    phoneFields.value[i].setValue(sPhone);
                }

            }else if (fieldType === 'allUrlFields') {
                var urlFields = this.getAllUrlInputFields();
                for (i = 0; i < urlFields.value.length; i++) {
                    urlFields.value[i].setValue(sUrl);
                }

            }else if (fieldType === 'allDurationFields') {
                var durationFields = this.getAllDurationInputFields();
                for (i = 0; i < durationFields.value.length; i++) {
                    durationFields.value[i].setValue(sNumeric);
                }
            } else if (fieldType === 'allNumericFields') {
                //get all numeric input field validators on the form
                var numericFields = this.getAllNumericInputFields();
                for (i = 0; i < numericFields.value.length; i++) {
                    numericFields.value[i].setValue(sNumeric);
                }
            } else if (fieldType === 'allDateFields') {
                //get all date field input validators
                var dateFields = this.getAllDateInputFields();
                for (i = 0; i < dateFields.value.length; i++) {
                    if (browserName === 'safari') {
                        dateFields.value[i].setValue(sDate.replace(/-/g, "/"));
                    } else {
                        dateFields.value[i].setValue(sDate);
                    }
                }
            } else if (fieldType === 'allTimeFields' && browserName !== 'safari') {
                //get all time field input validators
                var timeFields = this.getAllTimeInputFields();
                for (i = 0; i < timeFields.value.length; i++) {
                    timeFields.value[i].click();
                    browser.keys([sTime, 'Enter']);
                }
            } else if (fieldType === 'allCheckboxFields') {
                //TODO not working Need to verify with Ken
                var checkboxFields = this.getAllCheckboxFields();
                for (i = 0; i < checkboxFields.value.length; i++) {
                    console.log("the attribute is: " + checkboxFields.value[i].element('input').getAttribute('checked'));
                    if (checkboxFields.value[i].element('input').getAttribute('checked') === 'false') {
                        checkboxFields.value[i].element('.label').click();
                    }
                }
            }else if (fieldType === 'allUserField'  && browserName !== 'safari') {
                //get all time field input validators
                var userFields = this.getAllUserFields();
                for (i = 0; i < userFields.value.length; i++) {
                    userFields.value[i].click();
                    browser.keys([sUser, 'Enter']);
                }
            }
        }},

        /**
         * Method to enter field values in the form.
         */
        enterInvalidFormValues : {value: function(fieldType) {
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            var i;
            //get all input fields in the form
            if (fieldType === 'allTextFields') {
                var textFields = this.getAllTextInputFields();
                for (i = 0; i < textFields.value.length; i++) {
                    textFields.value[i].setValue('');
                }
            } else if (fieldType === 'allEmailFields') {
                var emailFields = this.getAllEmailInputFields();
                for (i = 0; i < emailFields.value.length; i++) {
                    emailFields.value[i].setValue('!@#$%^');
                }

            }else if (fieldType === 'allPhoneFields') {
                var phoneFields = this.getAllPhoneInputFields();
                for (i = 0; i < phoneFields.value.length; i++) {
                    phoneFields.value[i].setValue('!@#$%^');
                }

            }else if (fieldType === 'allUrlFields') {
                var urlFields = this.getAllUrlInputFields();
                for (i = 0; i < urlFields.value.length; i++) {
                    urlFields.value[i].setValue('!@#$%^');
                }

            }else if (fieldType === 'allDurationFields') {
                var durationFields = this.getAllDurationInputFields();
                for (i = 0; i < durationFields.value.length; i++) {
                    durationFields.value[i].setValue('&*^^%%%');
                }
            } else if (fieldType === 'allNumericFields') {
                //get all numeric input field validators on the form
                var numericFields = this.getAllNumericInputFields();
                for (i = 0; i < numericFields.value.length; i++) {
                    numericFields.value[i].setValue('!@#$%^');
                }
            }
        }},

        /**
         * Method to verify error messages on the form.
         */
        verifyErrorMessages : {value: function(expectedErrorMessages) {
            var self = this;

            self.formErrorMessageContainerEl.waitForVisible();

            // verify the heading of the error message container
            expect(this.formErrorMessageHeader.getText()).toBe('Please fix these ' + expectedErrorMessages.length + ' fields.');

            //Get all error messages from error container
            var actualErrorMessages = this.getErrorMessagesFromContainer();

            //Verify the errors from the container are expected errors
            expect(actualErrorMessages).toEqual(expectedErrorMessages);

            //Close the error container
            self.clickCloseBtnOnErrorContainer();
        }},
        //
        //closeSaveChangesDialogue : {value: function() {
        //    var self = this;
        //    return self.clickFormCloseBtn().then(function() {
        //        //come out of dirty form state
        //        return reportServicePage.waitForElement(self.formsSaveChangesDialog).then(function() {
        //            expect(self.formsSaveChangesDialogHeader.getText()).toBe('Save changes before leaving?');
        //            //close the dialogue by clicking on dont save
        //            return self.clickButtonOnSaveChangesDialog("Don't save");
        //        });
        //    });
        //}},
        //
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
                if (browserName !== 'safari' && browserName !== 'firefox') {
                    expect(expectedRecordValues[8]).toBe(sTime);
                }
                //numeric duration field
                //expect(expectedRecordValues[9]).toBe('9.92063E-9 weeks');
                //checkbox field
                //TODO clicking on checkbox not working
                //expect(expectedRecordValues[10]).toBe('true');
                //email field
                //expect(expectedRecordValues[11]).toBe(sPhone);
                //phone field
                expect(expectedRecordValues[12]).toBe(sEmail);
                //url field
                expect(expectedRecordValues[13]).toBe(sUrl);
                //user Field
                if (browserName !== 'safari' && browserName !== 'firefox') {
                    expect(expectedRecordValues[14]).toBe('administrator User for default SQL Installation');
                }
            }
        }},
        //
        ///**
        // * Function that gets user authentication
        // */
        //getUserAuthentication : {value: function() {
        //    // Get a session ticket for that subdomain and realmId (stores it in the browser)
        //    var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
        //    var realmId = e2eBase.recordBase.apiBase.realm.id;
        //    //get the user authentication
        //    return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
        //}},
        //
        //verifyFieldsNotPresentOnForm : {value: function(formTableElement, expectedFieldsNotPresentOnForm) {
        //    var self = this;
        //    return formTableElement.all(by.className('fieldLabel')).filter(function(elm) {
        //        return elm;
        //    }).map(function(elm) {
        //        return elm.getText();
        //    }).then(function(fieldsPresentOnForm) {
        //        return expectedFieldsNotPresentOnForm.filter(function(field) {
        //            //Verify that fieldsOnForm array don't contain expectedFieldsNotPresentOnForm items
        //            expect(fieldsPresentOnForm.indexOf(field)).toBe(-1);
        //        });
        //    });
        //
        //}}

    });

    module.exports = FormsPage;
}());
