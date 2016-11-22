(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    // Lodash utility library
    var _ = require('lodash');

    var e2ePageBase = require('./../../common/e2ePageBase');
    var rawValueGenerator = require('./../../../test_generators/rawValue.generator');
    var ReportServicePage = requirePO('reportService');
    var reportServicePage = new ReportServicePage();
    var ReportCardViewPage = requirePO('reportCardView');
    var reportCardViewPage = new ReportCardViewPage();
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportContentPage = requirePO('reportContent');
    var reportContentPage = new ReportContentPage();

    var sText = '9782341234';
    var sNumeric = rawValueGenerator.generateInt(0, 99);
    var sTime = "12:00 am";
    var date = new Date();
    var sDate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + '-' + date.getFullYear();

    var FormsPage = function() {
        this.formTrowserHeader = element.all(by.className('trowserHeader')).first();
        //form help button
        this.formHelpBtn = this.formTrowserHeader.element(by.className('iconTableUISturdy-help'));
        //form close button
        this.formCloseBtn = this.formTrowserHeader.element(by.className('iconTableUISturdy-close'));

        this.formTrowserFooter = element(by.className('recordTrowser')).element(by.className('trowserFooter'));
        //save button
        this.formSaveBtn = this.formTrowserFooter.element(by.className('saveButtons'));
        //alert button
        this.formErrorMsgAlertBtn = this.formTrowserFooter.element(by.className('rightIcons')).element(by.className('iconTableUISturdy-alert'));

        this.formBodyEl = element(by.tagName('body'));
        this.recordContainerEl = element(by.className('recordContainer')).all(by.className('loadedContent')).first();
        //form container
        this.formContainerEl = element(by.className('recordTrowser')).element(by.className('formContainer'));
        //view form
        this.formViewContainerEl = this.recordContainerEl.element(by.className('viewForm'));
        //edit Form
        this.formEditContainerEl = this.formContainerEl.element(by.className('editForm'));
        //form view table
        this.formViewModeTable = this.formViewContainerEl.element(by.className('qbPanelBody')).element(by.className('formTable'));
        //form edit table field labels
        this.formTable = this.formEditContainerEl.element(by.className('qbPanelBody')).element(by.className('formTable'));
        //form table field values
        this.formTableFieldValueElList = this.formEditContainerEl.element(by.className('qbPanelBody')).element(by.className('formTable')).all(by.className('input'));
        //form title
        this.formTitle = this.formContainerEl.element(by.className('qbPanelHeaderTitleText'));

        //form error messages
        this.formErrorMessage = element.all(by.className('loadedContent')).first().element(by.className('qbErrorMessage'));
        this.formErrorMessageVisisble = element.all(by.className('loadedContent')).first().element(by.className('qbErrorMessageVisible'));
        this.formErrorMessageHeader = this.formErrorMessage.element(by.className('qbErrorMessageHeader'));
        this.formErrorMessageHeaderCloseBtn = this.formErrorMessageHeader.element(by.className('rightIcons')).element(by.className('iconTableUISturdy-x-secondary'));
        this.formErrorMessageHeaderAlertBtn = this.formErrorMessageHeader.element(by.className('leftIcons')).element(by.className('iconTableUISturdy-alert'));
        this.formErrorMessageContent = this.formErrorMessageVisisble.element(by.className('qbErrorMessageContent'));

        //Save changes before leaving dialogue
        this.formsSaveChangesDialog = element(by.className('modal-dialog'));
        this.formsSaveChangesDialogHeader = this.formsSaveChangesDialog.element(by.className('modal-body'));
        this.formsSaveChangesDialogFooter = this.formsSaveChangesDialog.element(by.className('modal-footer'));
        this.clickButtonOnSaveChangesDialog = function(btnName) {
            var self = this;
            return self.formsSaveChangesDialogFooter.element(by.className('buttons')).all(by.tagName('button')).filter(function(elm) {
                return elm.getAttribute('textContent').then(function(text) {
                    return text  === btnName;
                });
            }).then(function(filteredSaveBtn) {
                return filteredSaveBtn[0].click();
            });
        };

        //Save buttons function
        this.clickSaveBtnWithName = function(btnName) {
            var self = this;
            return reportServicePage.waitForElement(self.formTrowserFooter.element(by.className('rightIcons')).element(by.className('saveButtons'))).then(function() {
                return self.formTrowserFooter.element(by.className('rightIcons')).element(by.className('saveButtons')).all(by.tagName('button')).filter(function(elm) {
                    return elm.getAttribute('textContent').then(function(text) {
                        return text === btnName;
                    });
                }).then(function(filteredSaveBtn) {
                    return filteredSaveBtn[0].click();
                }).then(function() {
                    //Need this for growl to come and go off
                    return e2eBase.sleep(browser.params.smallSleep);
                });
            });
        };

        // TODO add method for calendar picker
        //TODO add method for time picker

        this.clickFormSaveBtn = function() {
            var self = this;
            return reportServicePage.waitForElement(self.formSaveBtn).then(function() {
                return self.clickSaveBtnWithName('Save');
            });
        };

        this.clickFormSaveAndAddAnotherBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formSaveBtn).then(function() {
                return self.clickSaveBtnWithName('Save & Add Another');
            }).then(function() {
                return reportServicePage.waitForElement(self.formEditContainerEl);
            });
        };

        this.clickFormSaveAndNextBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formSaveBtn).then(function() {
                return self.clickSaveBtnWithName('Save & Next');
            }).then(function() {
                return reportServicePage.waitForElement(self.formEditContainerEl);
            });
        };

        this.clickFormAlertBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formErrorMsgAlertBtn).then(function() {
                return self.formErrorMsgAlertBtn.click();
            }).then(function() {
                //need this for message content to come up and slide down
                return e2eBase.sleep(browser.params.smallSleep);
            });
        };

        this.clickFormCloseBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formCloseBtn).then(function() {
                return self.formCloseBtn.click();
            });
        };

        this.selectTodaysDateFromDatePicker = function(fieldDateIconElement) {
            return fieldDateIconElement.element(by.className('glyphicon-calendar')).click().then(function() {
                return reportServicePage.waitForElement(fieldDateIconElement.element(by.className('datepicker'))).then(function() {
                    return reportServicePage.waitForElement(fieldDateIconElement.element(by.className('datepicker')).element(by.className('active'))).then(function() {
                        return fieldDateIconElement.element(by.className('datepicker')).element(by.className('active')).click();
                    });
                });
            });
        };

        this.enterFormValues = function(fieldLabel) {
            var self = this;
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            return reportServicePage.waitForElement(self.formTable).then(function() {
                return e2eBase.sleep(browser.params.smallSleep);
            }).then(function() {
                var fetchEnterCellValuesPromises = [];
                if (fieldLabel === 'dateCell') {
                    //enter date fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return elm.element(by.className('date')).click().then(function() {
                            return fetchEnterCellValuesPromises.push(elm.element(by.className('date')).element(by.tagName('input')).clear().sendKeys(sDate.replace(/-/g, "/")));
                        });

                        ////Select the date from the date picker.
                        //return elm.element(by.className('date')).element(by.tagName('input')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                        //    return self.selectTodaysDateFromDatePicker(elm);
                        //});
                    });
                } else if (fieldLabel === 'textField') {
                    //enter text fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return fetchEnterCellValuesPromises.push(elm.clear().sendKeys(sText));
                    });
                } else if (fieldLabel === 'numericField') {
                    //enter numeric fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return fetchEnterCellValuesPromises.push(elm.clear().elm.sendKeys(sNumeric));
                    });
                } else if (fieldLabel === 'checkbox') {
                    //select checkbox field
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return fetchEnterCellValuesPromises.push(elm.element(by.className('label')).click());
                    });
                } else if (fieldLabel === 'timeCell' && browserName !== 'safari' && browserName !== 'firefox') {
                    //enter time of day fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        //Do the click below to make it user editable
                        return elm.element(by.className('Select-control')).click().then(function() {
                            e2eBase.sleep(browser.params.smallSleep);
                            fetchEnterCellValuesPromises.push(browser.actions().sendKeys(sTime, protractor.Key.ENTER).perform());
                        });
                    });
                }
                return Promise.all(fetchEnterCellValuesPromises);
            });
        };

        this.enterInvalidFormValues = function(fieldLabel) {
            var self = this;
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            return reportServicePage.waitForElement(self.formEditContainerEl).then(function() {
                return e2eBase.sleep(browser.params.smallSleep);
            }).then(function() {
                var fetchEnterCellValuesPromises = [];
                if (fieldLabel === 'textField') {
                    //enter text fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return fetchEnterCellValuesPromises.push(elm.clear().sendKeys(""));
                    });
                } else if (fieldLabel === 'numericField') {
                    //enter numeric fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return fetchEnterCellValuesPromises.push(elm.clear().sendKeys("@!!^&*%$#"));
                    });
                }
                return Promise.all(fetchEnterCellValuesPromises);
            });
        };

        this.verifyErrorMessages = function(expectedErrorMessages) {
            var self = this;
            //give some time for the popup to slide out after error occurs
            return reportServicePage.waitForElement(self.formErrorMessageVisisble).then(function() {
                return self.formErrorMessageContent.all(by.className('qbErrorMessageItem')).filter(function(elm) {
                    return elm;
                }).map(function(elm) {
                    return elm.getAttribute('textContent');
                }).then(function(text) {
                    expect(text).toEqual(expectedErrorMessages);
                    //close the alert
                    return self.formErrorMessageHeaderCloseBtn.click();
                }).then(function() {
                    //give some time for the popup to slide in after closing
                    return e2eBase.sleep(browser.params.smallSleep);
                });
            });
        };

        this.closeSaveChangesDialogue = function() {
            var self = this;
            return self.clickFormCloseBtn().then(function() {
                //come out of dirty form state
                return reportServicePage.waitForElement(self.formsSaveChangesDialog).then(function() {
                    expect(self.formsSaveChangesDialogHeader.getText()).toBe('Save changes before leaving?');
                    //close the dialogue by clicking on dont save
                    return self.clickButtonOnSaveChangesDialog("Don't Save");
                });
            });
        };

        this.verifyFieldValuesInReportTable = function(recordRowNo, fieldType) {
            return reportServicePage.agGridRecordElList.then(function(records) {
                if (fieldType === 'numericField') {
                    //numeric field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 2)).toBe(sNumeric.toString());
                    //numeric currency field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 3)).toBe('$' + sNumeric);
                    //numeric percent field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 4)).toBe(sNumeric + '%');
                    //numeric rating field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 5)).toBe(sNumeric.toString());
                    //numeric duration field
                    //expect(reportServicePage.getRecordValues(records[recordRowNo], 9)).toBe('9.92063E-9 weeks');
                } if (fieldType === 'dateCell') {
                    //date field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 6)).toBe(sDate);
                    //date Time field
                    //TODO enable this after entering value into time field is fixed for safari and firefox
                    //expect(reportServicePage.getRecordValues(records[recordRowNo], 7)).toBe(sDate + ' ' + sTime);
                }if (fieldType === 'timeCell' && browserName !== 'safari' && browserName !== 'firefox') {
                    //time of day field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 8)).toBe(sTime);
                }if (fieldType === 'checkbox') {
                    //checkbox field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 10)).toBe('true');
                }
            });
        };

        /**
         * Function that gets user authentication
         */
        this.getUserAuthentication = function(userId) {
            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            var realmId = e2eBase.recordBase.apiBase.realm.id;
            //get the user authentication
            return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
        };

        this.verifyFieldsNotPresentOnForm = function(formTableElement, expectedFieldsNotPresentOnForm) {
            var self = this;
            return formTableElement.all(by.className('fieldLabel')).filter(function(elm) {
                return elm;
            }).map(function(elm) {
                return elm.getText();
            }).then(function(fieldsPresentOnForm) {
                return expectedFieldsNotPresentOnForm.filter(function(field) {
                    //Verify that fieldsOnForm array don't contain expectedFieldsNotPresentOnForm items
                    expect(fieldsPresentOnForm.indexOf(field)).toBe(-1);
                });
            });

        };

    };
    FormsPage.prototype = e2ePageBase;
    module.exports = FormsPage;
}());
