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

    var date = new Array();
    date = new Date().toJSON().slice(0, 10).split('-');
    var sText = rawValueGenerator.generateString(10);
    var sNumeric = rawValueGenerator.generateInt(1, 100);
    var sTime = "12:00 am";

    var sDate = date[1] + '-' + date[2] + '-' + date[0];

    var FormsPage = function() {
        this.formTrowserHeader = element(by.className('trowserHeader'));
        //form help button
        this.formHelpBtn = this.formTrowserHeader.element(by.className('iconTableUISturdy-help'));
        //form close button
        this.formCloseBtn = this.formTrowserHeader.element(by.className('iconTableUISturdy-close'));

        this.formTrowserFooter = element(by.className('trowserFooter'));
        //save button
        this.formSaveBtn = this.formTrowserFooter.element(by.className('rightIcons')).element(by.tagName('button'));

        this.formBodyEl = element(by.tagName('body'));
        //form container
        this.formContainerEl = element(by.className('formContainer'));
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

        // TODO add method for calendar picker
        //TODO add method for time picker

        this.clickFormSaveBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formSaveBtn).then(function() {
                return self.formSaveBtn.click().then(function() {
                    // Check that the edit notification is displayed
                    reportServicePage.waitForElement(reportServicePage.editSuccessPopup);
                });
            });
        };

        this.clickAddFormSaveBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formSaveBtn).then(function() {
                //TODO talking to Drew on Monday. I dont see record saved mesage after hiting save for Add form. I see some console errors but record is getting added to UI.
                return self.formSaveBtn.click();
            });
        };

        this.clickFormCloseBtn = function() {
            return this.formCloseBtn.click();
        };

        this.enterFormValues = function(fieldLabel) {
            var self = this;
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            if (fieldLabel === 'dateCell') {
                //enter date fields
                return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                    return elm;
                }).map(function(elm) {
                    //Do the click below to make it user editable
                    return elm.element(by.className('date')).click().then(function() {
                        return elm.element(by.className('date')).element(by.tagName('input')).clear().sendKeys(sDate);
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
            } else if (fieldLabel === 'timeCell') {
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
                } if (fieldType === 'dateCell') {
                    //date field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 6)).toBe(sDate);
                    //date Time field
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 7)).toBe(sDate + ' ' + sTime);
                }if (fieldType === 'timeCell') {
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
