(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    // Lodash utility library
    var _ = require('lodash');

    // Import the base page object

    var e2ePageBase = requirePO('e2ePageBase');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    let loadingSpinner = requirePO('/common/loadingSpinner');
    let notificationContainer = requirePO('/common/notificationContainer');

    var sText = 'testTextValue';
    var sUrl = 'http://www.yahoo.com';
    var sEmail = 'test@gmail.com';
    var sPhone = '508-481-1015';
    var sNumeric = '33.33';
    var sTime = '12:30 am';
    var date = new Date();
    var sDate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + '-' + date.getFullYear();
    var sUser = 'administrator User for default SQL Installation';

    var FormsPage = Object.create(e2ePageBase, {
        //view form
        viewFormContainerEl : {get: function() {return browser.element('form.viewForm');}},
        //edit Form
        editFormContainerEl : {get: function() {return browser.element('form.editForm');}},
        //form footer save buttons(there will be 2 buttons)
        editFormSaveBtns : {get: function() {return browser.elements('.saveOrCancelFooter .rightIcons .saveButtons button');}},
        //form footer alert button
        editFormFooterErrorAlertBtn : {get: function() {return browser.element('.saveOrCancelFooter .iconUISturdy-alert');}},

        //edit pencil in view form
        editPencilBtnOnStageInViewForm : {get: function() {return browser.element('.stageRight .pageActions .iconUISturdy-edit');}},

        //form close button
        formCloseBtn : {get: function() {return browser.element('.trowserHeader .iconUISturdy-close');}},
        //cancel form button
        formCancelBtn: {get: function() {return browser.element('.alternativeTrowserFooterButton');}},

        //form error message container
        formErrorMessageContainerEl : {get: function() {return browser.element('div.qbErrorMessage.qbErrorMessageVisible');}},
        //header on error message container
        formErrorMessageHeader : {get: function() {return this.formErrorMessageContainerEl.element('.qbErrorMessageHeader');}},
        //close btn on error container
        formErrorMessageContainerCloseBtn : {get: function() {return this.formErrorMessageContainerEl.element('.iconUISturdy-x-secondary');}},
        formErrorMessageContent : {get: function() {return this.formErrorMessageContainerEl.element('.qbErrorMessageContent');}},

        // Notification Container for form actions
        notificationContainerEl: {get: function() {return browser.element('.notification-container');}},
        notificationWindow: {get: function() {return this.notificationContainerEl.element('.notification-message .message');}},

        // Add new record button on Small break point
        addRecordOnSBP : {get: function() {return browser.element('.reportToolsAndContentContainer .addNewRecord .iconUISturdy-add-new-filled');}},

        /**
         * Method to click on add record button on small break point.
         */
        clickAddRecordOnSBP : {value: function() {
            //Click on form add button
            this.addRecordOnSBP.waitForVisible();
            return this.addRecordOnSBP.click();
        }},

        /**
         * Method for spinner to dissaper after hitting on any save buttons on edit forms
         */
        waitUntilSpinnerGoesAwayAfterSave : {value: function(btnName) {
            //wait until loading screen disappear
            browser.waitForVisible('.trowserChildren .loader .spinner', e2eConsts.extraLongWaitTimeMs, true);
            //Need this to wait for container to slide away
            return browser.pause(e2eConsts.shortWaitTimeMs);
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
            this.clickBtnOnForm('Save');
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            //wait until save success container goes away
            return notificationContainer.waitUntilNotificationContainerGoesAway();
        }},

        /**
         * Method to click Cancel button on the form.
         */
        clickFormCancelBtn : {value: function() {
            //Click on form Save button
            this.formCancelBtn.waitForVisible();
            this.formCancelBtn.click();
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            //Need this to wait for container to slide away
            return browser.pause(e2eConsts.shortWaitTimeMs);
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
            return elementFormName.elements('.fieldLabel');
        }},

        /**
         * Returns all text input fields on the form
         * @returns Array of text input fields
         */
        getAllTextFields: {value: function() {
            return this.editFormContainerEl.elements('input[type="text"].textField');
        }},

        /**
         * Returns all email input fields on the form
         * @returns Array of email input fields
         */
        getAllEmailInputFields: {value: function() {
            return this.editFormContainerEl.elements('input[type="email"].textField');
        }},

        /**
         * Returns all phone input fields on the form
         * @returns Array of phone input fields
         */
        getAllPhoneInputFields: {value: function() {
            return this.editFormContainerEl.elements('input[type="tel"].textField.phoneNumber');
        }},

        /**
         * Returns all url input fields on the form
         * @returns Array of url input fields
         */
        getAllUrlInputFields: {value: function() {
            return this.editFormContainerEl.elements('input[type="url"].textField');
        }},

        /**
         * Returns all duration input fields on the form
         * @returns Array of duration input fields
         */
        getAllDurationInputFields: {value: function() {
            return this.editFormContainerEl.elements('input[type="text"].durationField');
        }},

        /**
         * Returns all numeric input fields on the form
         * @returns Array of numeric input fields
         */
        getAllNumericInputFields: {value: function() {
            return this.editFormContainerEl.elements('input[type="text"].numericField');
        }},

        /**
         * Returns all Date fields on the form
         * @returns Array of date input fields
         */
        getAllDateInputFields: {value: function() {
            return this.editFormContainerEl.elements('.cellEdit.dateCell');
        }},

        /**
         * Returns all Time fields on the form
         * @returns Array of time input fields
         */
        getAllTimeInputFields: {value: function() {
            return this.editFormContainerEl.elements('.cellEdit.timeCell .glyphicon-time');
        }},

        /**
         * Returns all Parent fields on the form
         * @returns Array of parent fields
         */
        getAllParentRecordFields: {
            value: function() {
                return this.editFormContainerEl.elements('.cellWrapper .multiChoiceContainer .Select-arrow-zone');
            }
        },

        /**
         * Returns all Checkbox fields on the form
         * @returns Array of checkbox fields
         */
        getAllCheckboxFields: {value: function() {
            return this.editFormContainerEl.elements('.checkbox.hasLabel');
        }},

        /**
         * Returns all User fields on the form
         * @returns Array of user fields
         */
        getAllUserFields: {value: function() {
            return this.editFormContainerEl.elements('.cellEdit.userFormat .Select-arrow');
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
         * Returns all text input fields on the form
         * @returns Array of text input fields
         */
        getRecordsCountInATable: {value: function() {
            //Get the count (eg: 25 records). Get just numbers from string and convert into Integer
            return parseFloat(browser.element('.reportToolbar .recordsCount').getText().replace(/[^0-9\.]/g, ''));
        }},

        /**
         * Method to wait until edit form is loaded
         *
         */
        waitForEditFormsTableLoad: {value: function() {
            // wait for edit form
            this.editFormContainerEl.waitForVisible();
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            //Need this for container to slide down completely
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /**
         * Method to wait until view form is loaded
         *
         */
        waitForViewFormsTableLoad: {value: function() {
            this.viewFormContainerEl.waitForVisible();
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            //Need this for container to slide down completely
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /**
         * Method to get record values from view form mode
         *
         */
        getRecordValuesInViewForm: {value: function(elementClassName) {
            var recordValues = [];
            browser.element(elementClassName).elements('.cellWrapper').value.filter(function(record) {
                recordValues.push(record.getAttribute('textContent'));
            });
            return recordValues;
        }},

        /**
         * Method to get all fields from view form
         */
        getAllFieldsInViewForm: {value: function() {
            let fields = [];
            browser.elements('.formElementContainer .field').value.filter(function(fieldLabel) {
                return fields.push(fieldLabel.element('.fieldLabel').getAttribute('textContent'));
            });
            return fields;
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
        clickRecordEditPencilInViewForm : {value: function() {
            this.editPencilBtnOnStageInViewForm.waitForVisible();
            //click on the edit pencil in view form actions
            this.editPencilBtnOnStageInViewForm.click();
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            //wait until edit form is visible
            this.editFormContainerEl.waitForVisible();
            //Need this to stabilize container
            return browser.pause(e2eConsts.shortWaitTimeMs);
        }},

        /**
         * Method to set input value for a field on the form.
         */
        setFormInputValue: {value: function(getAllUniqueFieldTypes, fieldValue) {
            var fieldTypes = getAllUniqueFieldTypes;
            for (var i = 0; i < fieldTypes.value.length; i++) {
                //scroll to an element.
                browser.execute("return arguments[0].scrollIntoView(true);", fieldTypes.value[i]);
                //Need this if loop because I just want to enter this textValue into textField only. Some fields className also just says textField.(eg duration)
                if (fieldValue === 'testTextValue') {
                    return fieldTypes.value[i].setValue([fieldValue]);
                } else {
                    fieldTypes.value[i].setValue([fieldValue]);
                }
            }
        }},

        /**
         * Select List option from the List combo
         *
         */
        selectFromList : {value: function(listOption) {
            browser.waitForVisible('.Select-menu-outer .Select-option');
            //wait untill you see 1 option since drop down loads onDemand now
            // browser.waitForVisible('.Select-option');
            //get all options from the list
            let option = browser.element('.Select-menu-outer').elements('.Select-option').value.filter(function(optionText) {
                return optionText.getAttribute('textContent').trim().includes(listOption);
            });

            if (option !== []) {
                browser.execute("return arguments[0].scrollIntoView(true);", option[0]);
                //Click on filtered option
                option[0].waitForVisible();
                option[0].click();
                //wait until loading screen disappear
                return browser.waitForVisible('.Select-menu-outer', e2eConsts.shortWaitTimeMs, true);
            } else {
                throw new Error('Option with name ' + listOption + " not found in the list");
            }
        }},

        /**
         * Method to select value from a dropDown List.
         */
        setDropDownValue: {value: function(getAllUniqueFieldTypes, fieldValue) {
            var fieldTypes = getAllUniqueFieldTypes;
            for (var i = 0; i < fieldTypes.value.length; i++) {
                browser.execute("return arguments[0].scrollIntoView(true);", fieldTypes.value[i]);
                //Need this to stabilize after scrolling to the element
                browser.pause(e2eConsts.shortWaitTimeMs);
                fieldTypes.value[i].waitForVisible();
                fieldTypes.value[i].click();
                this.selectFromList(fieldValue);
            }
        }},

        /**
         * Method to search for record.
         */
        searchForRecord: {value: function(searchValue) {
            browser.element('.reportToolbar  .searchInput').waitForVisible();
            return browser.element('.reportToolbar  .searchInput').setValue(searchValue);
        }},

        /**
         * Method to enter field values in the form.
         * @param fieldType type of field to be filled in
         * @param parentValue  parent record to be linked to
         */
        enterFormValues: {
            value: function(fieldType, parentValue) {
                //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
                var i;
                if (!parentValue) {
                    parentValue = 1;
                }
                //get all input fields in the form
                if (fieldType === 'allTextFields') {
                    this.setFormInputValue(this.getAllTextFields(), sText);
                } else if (fieldType === 'allEmailFields') {
                    this.setFormInputValue(this.getAllEmailInputFields(), sEmail);
                } else if (fieldType === 'allPhoneFields') {
                    this.setFormInputValue(this.getAllPhoneInputFields(), sPhone);
                } else if (fieldType === 'allUrlFields') {
                    this.setFormInputValue(this.getAllUrlInputFields(), sUrl);
                } else if (fieldType === 'allDurationFields') {
                    this.setFormInputValue(this.getAllDurationInputFields(), sNumeric);
                } else if (fieldType === 'allNumericFields') {
                    this.setFormInputValue(this.getAllNumericInputFields(), sNumeric);
                } else if (fieldType === 'allTimeFields') {
                    var timeFields = this.getAllTimeInputFields();
                    for (i = 0; i < timeFields.value.length; i++) {
                        browser.execute("return arguments[0].scrollIntoView(true);", timeFields.value[i]);
                        //Need this to stabilize after scrolling to the element
                        browser.pause(e2eConsts.shortWaitTimeMs);
                        timeFields.value[i].waitForVisible();
                        timeFields.value[i].click();
                        if (browserName === 'chrome') {
                            browser.keys([sTime, 'Enter']);
                        } else {
                            this.selectFromList(sTime);
                        }
                    }
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
                } else if (fieldType === 'allCheckboxFields') {
                    //get all checkbox fields on form
                    var checkboxFields = this.getAllCheckboxFields();
                    for (i = 0; i < checkboxFields.value.length; i++) {
                        //if checkbox not selected then check it.
                        if (checkboxFields.value[i].element('input').isSelected() === false) {
                            checkboxFields.value[i].element('label').click();
                        }
                    }
                } else if (fieldType === 'allUserField') {
                    this.setDropDownValue(this.getAllUserFields(), sUser);
                } else if (fieldType === 'allParentRecordFields') {
                    this.setDropDownValue(this.getAllParentRecordFields(), parentValue);
                }
            }
        },

        /**
         * Method to enter field values in the form.
         */
        enterInvalidFormValues : {value: function(fieldType, invalidValue) {
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            if (fieldType === 'allTextFields') {
                this.setFormInputValue(this.getAllTextFields(), invalidValue);
            } else if (fieldType === 'allEmailFields') {
                this.setFormInputValue(this.getAllEmailInputFields(), invalidValue);
            } else if (fieldType === 'allPhoneFields') {
                this.setFormInputValue(this.getAllPhoneInputFields(), invalidValue);
            } else if (fieldType === 'allUrlFields') {
                this.setFormInputValue(this.getAllUrlInputFields(), invalidValue);
            } else if (fieldType === 'allDurationFields') {
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
         * Method to verify cell values in the report table for table 1 -> report1 -> ListAll report
         */
        verifyFieldValuesInReportTable : {value: function(expectedRecordValues) {
            for (var i = 0; i < expectedRecordValues.length; i++) {
                console.log("The expected values are: " + JSON.stringify(expectedRecordValues));
                //text field
                expect(expectedRecordValues[1]).toBe(sText.toString());
                //numeric field
                expect(expectedRecordValues[2]).toBe(sNumeric.toString());
                //numeric currency field
                expect(expectedRecordValues[3]).toBe('$' + sNumeric.toString());
                //numeric percent field
                expect(expectedRecordValues[4]).toBe(sNumeric.toString() + '%');
                //numeric rating field
                //TODO this needs to be fixed as UI accepts more than 1 decimal places and core takes just 1 decimal place.
                //expect(expectedRecordValues[5]).toBe(sNumeric.toString());
                if (platformName !== 'iOS') {
                    //TODO As the date and time fields on small break point are not user editable and having some bugs we are ignoring these fields on small break point, this needs to be fixed
                    //date field
                    expect(expectedRecordValues[6]).toBe(sDate.toString());
                    //date time field
                    expect(expectedRecordValues[7]).toBe(sDate.toString() + ' ' + sTime.toString());
                }
                //TODO time of day field not working on firefox verify. i do see it gets selected via automation. do manual testing to verify this
                if (platformName !== 'iOS' && browserName !== 'firefox') {
                    expect(expectedRecordValues[8]).toBe(sTime.toString());
                }
                //numeric duration field
                expect(expectedRecordValues[9]).toBe('4.76142857142857  weeks');
                //checkbox field
                expect(expectedRecordValues[10]).toBe('true');
                //email field
                expect(expectedRecordValues[11]).toBe('(508) 481-1015');
                //phone field
                expect(expectedRecordValues[12]).toBe(sEmail.toString());
                //url field
                expect(expectedRecordValues[13]).toBe(sUrl.toString());
                //user Field
                if (browserName !== 'firefox') {
                    expect(expectedRecordValues[14]).toBe('administrator User for default SQL Installation');
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
        }},

        formCardOnSBP:{
            get: function() {
                browser.element('.cardViewList.cardViewListHolder .collapse .card').waitForVisible();
                return browser.element('.cardViewList.cardViewListHolder .collapse .card');
            }
        },
        // Edit record button on Small break point
        editRecordOnSBP : {get: function() {return browser.element('.recordActionsContainer .iconActions .tipChildWrapper .iconUISturdy-edit');}},

        // Return button on Small break point
        returnButtonOnSBP : {get: function() {return browser.element('.recordActionsContainer .iconActions .tipChildWrapper .iconUISturdy-return');}},

        // Date field on Small Break Point
        dateFieldOnSBP : {get: function() {return browser.element('.formContainer .qbPanelBody .cellWrapper .fieldValueEditor .dateCell');}},

        /**
         * Method to click on edit record pencil button on small break point.
         */
        clickEditRecordOnSBP : {value: function() {
            //Click on form edit button
            this.editRecordOnSBP.waitForVisible();
            return this.editRecordOnSBP.click();
        }},
        /**
         * Method to click on form card on small break point.
         */
        clickFormCardOnSBP : {value: function() {
            //Click on form edit button
            this.formCardOnSBP.waitForVisible();
            return this.formCardOnSBP.click();
        }},
        /**
         * Method to check if the field is a checkbox on small break point.
         */
        isCheckbox: {value: function(field) {
            return field.element('div').getAttribute('class').split(' ').indexOf('checkbox') !== -1;
        }},
        /**
         * Method to check if the checkbox is checked on small break point
         */
        isChecked: {value: function(field) {
            return (field.element('./..//span[contains(@class,"symbol")]').getAttribute('class').split(' ').indexOf('checked')) > 0;
        }},

        /**
         * Method to get the values of the fields of form on small break point.
         */
        getFieldValues: {value: function() {
            // Gets the list of field values from the form
            let fields = browser.elements('.cellWrapper');
            return fields.value.map(function(field) {
                return FormsPage.isCheckbox(field) ? FormsPage.isChecked(field).toString() :
                    // field.getText(); - getText() returns the data of the duration field with single space in between the value and 'weeks',
                    // but the value in DOM has two spaces. We are using getAttribute('textContent') for consistency with reportContent.po getRecordCellValue().
                field.getAttribute('textContent');

            });
        }}
    });

    module.exports = FormsPage;
}());
