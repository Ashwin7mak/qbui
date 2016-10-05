(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    // Lodash utility library
    var _ = require('lodash');

    var e2ePageBase = require('./../../common/e2ePageBase');
    var ReportServicePage = requirePO('reportService');
    var reportServicePage = new ReportServicePage();
    var formFields = [];

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
                    //TODO need to figure out how to verify growl text which says success record saved
                    e2eBase.sleep(browser.params.largeSleep);
                });
            });
        };

        this.clickFormCloseBtn = function() {
            return this.formCloseBtn.click();
        };

        this.enterFormValues = function(fieldLabel) {
            var sDate = '12-12-2016';
            var sText = 'abcdefghijklmn';
            var sNumeric = '123.0';
            var sTime = '02:30 am';

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
                    elm.element(by.className('glyphicon-time')).click();
                    // Let the drop down animate
                    e2eBase.sleep(browser.params.smallSleep);
                    return elm.element(by.tagName('input')).sendKeys(sTime, protractor.Key.ENTER);
                });
            }
        };

    };
    FormsPage.prototype = e2ePageBase;
    module.exports = FormsPage;
}());
