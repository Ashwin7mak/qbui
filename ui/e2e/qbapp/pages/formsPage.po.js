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
    var sNumeric = rawValueGenerator.generateDouble(0, 10);
    var sTime = "12:00 am";

    var sDate = date[1] + '-' + date[2] + '-' + date[0];


    console.log("the date is: " + sDate);
    console.log("the numeric is: " + sNumeric);
    console.log("The time is: " + sTime);


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


        this.clickFormSaveBtn = function() {
            var self = this;
            return reportServicePage.waitForElementToBeClickable(self.formSaveBtn).then(function() {
                return self.formSaveBtn.click().then(function() {
                    //return $.growl({title: 'success', message: 'record saved'});
                    ////TODO need to figure out how to verify growl text which says success record saved
                    // Check that the edit notification is displayed
                    //reportServicePage.waitForElement(reportServicePage.editSuccessPopup); This dosent wrk here
                    e2eBase.sleep(browser.params.largeSleep);
                    browser.manage().logs().get('browser').then(function(browserLog) {
                        expect(browserLog.length).toEqual(0);
                        console.log("the browser log is: "+JSON.stringify(browserLog));
                    });
                });
            });
        };

        this.clickFormCloseBtn = function() {
            return this.formCloseBtn.click();
        };

        this.enterFormValues = function(fieldLabel) {
            if (fieldLabel === 'dateCell') {
                //enter date fields
                return this.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                    return elm;
                }).map(function(elm) {
                    return elm.element(by.tagName('input')).clear().sendKeys(sDate);
                });
            } else if (fieldLabel === 'textField') {
                //enter text fields
                return this.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                    return elm;
                }).map(function(elm) {
                    return elm.clear().sendKeys(sText);
                });
            } else if (fieldLabel === 'numericField') {
                //enter numeric fields
                return this.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                    return elm;
                }).map(function(elm) {
                    return elm.clear().sendKeys(sNumeric);
                });
            } else if (fieldLabel === 'checkbox') {
                //select checkbod field
                return this.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                    return elm;
                }).map(function(elm) {
                    //if (!elm.element(by.className('label')).isSelected()) {
                    return elm.element(by.className('label')).click();
                    //}
                });
            } else if (fieldLabel === 'timeCell') {
                //enter time of day fields
                return this.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                    return elm;
                }).map(function(elm) {
                    elm.element(by.className('Select-control')).element(by.className('glyphicon-time')).click();
                    // Let the drop down animate
                    e2eBase.sleep(browser.params.smallSleep);
                    return elm.element(by.tagName('input')).sendKeys(sTime, protractor.Key.ENTER);
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
                    expect(reportServicePage.getRecordValues(records[recordRowNo], 4)).toBe(sNumeric + '%');
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
