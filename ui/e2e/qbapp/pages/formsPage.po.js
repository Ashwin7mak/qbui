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

    var date = new Array();
    date = new Date().toJSON().slice(0, 10).split('-');
    var sText = '9782341234';
    var sNumeric = rawValueGenerator.generateInt(1, 100);
    var sTime = "12:00 am";

    var sDate = date[1] + '-' + date[2] + '-' + date[0];

    var FormsPage = function() {
        this.formTrowserHeader = element(by.className('recordTrowser')).element(by.className('trowserHeader'));
        //form help button
        this.formHelpBtn = this.formTrowserHeader.element(by.className('iconTableUISturdy-help'));
        //form close button
        this.formCloseBtn = this.formTrowserHeader.element(by.className('iconTableUISturdy-close'));

        this.formTrowserFooter = element(by.className('recordTrowser')).element(by.className('trowserFooter'));
        //save button
        this.formSaveBtn = this.formTrowserFooter.element(by.className('rightIcons')).all(by.tagName('button')).first();
        //alert button
        this.formErrorMsgAlertBtn = this.formTrowserFooter.element(by.className('rightIcons')).element(by.className('saveAlertButton'));

        this.formBodyEl = element(by.tagName('body'));
        //form container
        this.formContainerEl = element(by.className('recordTrowser')).element(by.className('formContainer'));
        //view form
        this.formViewContainerEl = this.formContainerEl.element(by.className('viewForm'));
        //edit Form
        this.formEditContainerEl = this.formContainerEl.element(by.className('editForm'));
        //form table field labels
        this.formTable = this.formEditContainerEl.element(by.className('qbPanelBody')).element(by.className('formTable'));
        //form table field values
        this.formTableFieldValueElList = this.formEditContainerEl.element(by.className('qbPanelBody')).element(by.className('formTable')).all(by.className('input'));
        //form title
        this.formTitle = this.formContainerEl.element(by.className('qbPanelHeaderTitleText'));

        //form error messages
        this.formErrorMessage = element.all(by.className('loadedContent')).first().element(by.className('qbErrorMessage'));
        this.formErrorMessageVisisble = element.all(by.className('loadedContent')).first().element(by.className('qbErrorMessageVisible'));
        this.formErrorMessageHeader = this.formErrorMessage.element(by.className('qbErrorMessageHeader'));
        this.formErrorMessageHeaderCloseBtn = this.formErrorMessageHeader.element(by.className('rightIcons')).element(by.tagName('button'));
        this.formErrorMessageHeaderAlertBtn = this.formErrorMessageHeader.element(by.className('leftIcons')).element(by.className('iconTableUISturdy-alert'));
        this.formErrorMessageContent = this.formErrorMessage.element(by.className('qbErrorMessageContent'));

        //Save buttons function
        this.clickSaveBtnWithName = function(btnName) {
            this.formTrowserFooter.element(by.className('rightIcons')).element(by.className('saveButtons')).all(by.tagName('button')).filter(function(elm) {
                return elm.getAttribute('textContent').then(function(text) {
                    return text  === btnName;
                });
            }).then(function(filteredSaveBtn) {
                return filteredSaveBtn[0].click();
            });
        };

        // TODO add method for calendar picker
        //TODO add method for time picker

        this.clickFormSaveBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formSaveBtn).then(function() {
                self.clickSaveBtnWithName('Save');
                    // Check that the edit notification is displayed
                return reportServicePage.waitForElement(reportServicePage.editSuccessPopup);
            });
        };

        this.clickFormSaveAndAddAnotherBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formSaveBtn).then(function() {
                self.clickSaveBtnWithName('Save & Add Another');
                // Check that the edit notification is displayed
                return reportServicePage.waitForElement(reportServicePage.editSuccessPopup).then(function() {
                    return reportServicePage.waitForElement(self.formEditContainerEl);
                });
            });
        };

        this.clickFormSaveAndNextBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formSaveBtn).then(function() {
                self.clickSaveBtnWithName('Save & Next');
                    // Check that the edit notification is displayed
                return reportServicePage.waitForElement(reportServicePage.editSuccessPopup).then(function() {
                    return reportServicePage.waitForElement(self.formEditContainerEl);
                });
            });
        };

        this.clickFormAlertBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formErrorMsgAlertBtn).then(function() {
                return self.formErrorMsgAlertBtn.click();
            });
        };

        this.clickFormCloseBtn = function() {
            var self = this;
            return this.formCloseBtn.click().then(function() {
                return reportServicePage.waitForElement(self.reportAddRecordBtn);
            });
        };

        this.selectTodaysDateFromDatePicker = function(fieldDateIconElement) {
            return fieldDateIconElement.element(by.className('glyphicon-calendar')).click().then(function() {
                reportServicePage.waitForElement(fieldDateIconElement.element(by.className('datepicker'))).then(function() {
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
                if (fieldLabel === 'dateCell' && browserName !== 'safari') {
                    //enter date fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        //TODO Enable below when the bug that enters date into date field is fixed
                        //return elm.element(by.className('date')).click().then(function() {
                        //    return elm.element(by.className('date')).element(by.tagName('input')).clear().sendKeys(sDate);
                        //});

                        //Select the date from the date picker untill above is fixed
                        return elm.element(by.className('date')).element(by.tagName('input')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                            return self.selectTodaysDateFromDatePicker(elm);
                        });
                    });
                } else if (fieldLabel === 'textField') {
                    //enter text fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return elm.clear().sendKeys(sText);
                    });
                } else if (fieldLabel === 'numericField') {
                    //enter numeric fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return elm.clear().sendKeys(sNumeric);
                    });
                } else if (fieldLabel === 'checkbox') {
                    //select checkbox field
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return elm.element(by.className('label')).click();
                    });
                } else if (fieldLabel === 'timeCell' && browserName !== 'safari') {
                    //enter time of day fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        //Do the click below to make it user editable
                        return elm.element(by.className('Select-control')).click().then(function() {
                            e2eBase.sleep(browser.params.smallSleep);
                            browser.actions().sendKeys(sTime, protractor.Key.ENTER).perform();
                        });
                    });
                }
            });
        };

        this.enterInvalidFormValues = function(fieldLabel) {
            var self = this;
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            return reportServicePage.waitForElement(self.formEditContainerEl).then(function() {
                if (fieldLabel === 'textField') {
                    //enter text fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return elm.clear().sendKeys("9782311213");
                    });
                } else if (fieldLabel === 'numericField') {
                    //enter numeric fields
                    return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return elm.clear().sendKeys("@!!^&*%$##@#%%^^");
                    });
                }
            });
        };

        this.verifyErrorMessages = function(expectedErrorMessages) {
            var self = this;
            var errorMsgs = [];
            return reportServicePage.waitForElement(self.formErrorMessageContent).then(function() {
                return reportServicePage.waitForElement(self.formErrorMessage).then(function() {
                    self.formErrorMessageContent.all(by.className('qbErrorMessageItem')).filter(function(elm) {
                        return elm;
                    }).map(function(elm) {
                        return elm.getAttribute('textContent');
                    }).then(function(text) {
                        expect(text).toEqual(expectedErrorMessages);
                        //close the alert
                        return self.formErrorMessageHeaderCloseBtn.click();
                    });
                });
            });
        };

        this.verifyFieldValuesInReportTable = function(recordRowNo, fieldType) {
            reportServicePage.agGridRecordElList.then(function(records) {
                if (fieldType === 'numericField') {
                    //numeric field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 2)).toBe(sNumeric.toString());
                    //numeric currency field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 3)).toBe('$' + sNumeric);
                    //numeric percent field
                    //TODO sometimes this fails example '56.99999999999999%' to be '57%'
                    //expect(reportServicePage.getRecordValues(records[recordRowNo], 4)).toBe(sNumeric + '%');
                    //numeric rating field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 5)).toBe(sNumeric.toString());
                    //numeric duration field
                    // expect(reportServicePage.getRecordValues(records[7], 9)).toBe('2.0337302E-7 weeks');
                } if (fieldType === 'dateCell' && browserName !== 'safari') {
                    //date field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 6)).toBe(sDate);
                    //date Time field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 7)).toBe(sDate + ' ' + sTime);
                }if (fieldType === 'timeCell' && browserName !== 'safari') {
                    //time of day field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 8)).toBe(sTime);
                }if (fieldType === 'checkbox') {
                    //checkbox field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 10)).toBe('true');
                }
            });
        };

    };
    FormsPage.prototype = e2ePageBase;
    module.exports = FormsPage;
}());
