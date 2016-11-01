(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = require('./../../common/e2ePageBase');
    var rawValueGenerator = require('./../../../test_generators/rawValue.generator');

    var date = new Array();
    date = new Date().toJSON().slice(0, 10).split('-');
    var sText = '9782341234';
    var sNumeric = rawValueGenerator.generateInt(1, 100);
    var sTime = "12:00 am";

    var sDate = date[1] + '-' + date[2] + '-' + date[0];

    var ReportCardView = function() {
        this.reportContainerEl = element(by.className('reportContainer'));
        //report header
        this.reportHeader = this.reportContainerEl.element(by.className('reportHeader'));
        //report search button
        this.reportSearchBtn = this.reportHeader.element(by.className('iconssturdy-search'));
        //report search input box
        this.reportSearchInput = this.reportHeader.element(by.className('searchInput'));
        // Report tools and content container
        this.reportToolsAndContentEl = this.reportContainerEl.element(by.className('reportToolsAndContentContainer'));
        // Loaded Content Div
        this.loadedContentEl = this.reportToolsAndContentEl.all(by.className('loadedContent')).first();
        // Report toolbar
        this.reportsToolBar = element(by.className('reportToolbar'));
        // Report records count
        this.reportRecordsCount = element(by.className('recordsCount')).element(by.tagName('SPAN'));

        //report Table
        this.reportTable = this.reportToolsAndContentEl.element(by.className('reportTable'));

        this.reportTableLoadedContent = this.reportTable.element(by.className('tableLoaderContainer')).element(by.className('loadedContent'));

        //record container
        this.recordContainerEl = element(by.className('recordContainer'));
        //record actions container
        this.recordActionsContainer = this.recordContainerEl.element(by.className('recordActionsContainer'));
        //record form actions
        this.recordFormActionPreviousBtn = this.recordActionsContainer.element(by.className('secondaryFormActions')).element(by.className('iconTableUISturdy-caret-left'));
        this.recordFormActionReturnToReportBtn = this.recordActionsContainer.element(by.className('secondaryFormActions')).element(by.className(' qbIcon iconTableUISturdy-return'));
        this.recordFormActionNextBtn = this.recordActionsContainer.element(by.className('secondaryFormActions')).element(by.className('iconTableUISturdy-caret-right'));

        //record page actions
        //record edit button
        this.recordEditBtn = this.recordActionsContainer.element(by.className('pageActions')).element(by.className('iconTableUISturdy-edit'));

        //card View List
        this.reportCardViewListHolder = this.reportTable.element(by.className('cardViewListHolder'));
        //card Rows
        this.reportCards = this.reportCardViewListHolder.element(by.className('collapse'));
        //card record rows
        this.reportCardRows = this.reportCards.all(by.className('top-card-row')).filter(function(elem) {
            // Return records that are being shown in the grid
            return elem.getText();
        });
        //card record row values
        this.reportCardRowFieldLabel = this.reportCards.all(by.className('fieldLabel')).filter(function(elem) {
            // Return records that are being shown in the grid
            return elem.getText();
        });
        //card record row values
        this.reportCardRowFieldValues = this.reportCards.all(by.className('fieldValue')).filter(function(elem) {
            // Return records that are being shown in the grid
            return elem.getText();
        });

        //card record fields
        this.reportCardFields = this.reportCards.all(by.className('fieldRow'));

        //card view header
        this.reportCardViewHeader = this.reportCardViewListHolder.element(by.className('cardViewHeader'));
        //fetch previous button
        this.reportHeaderPreviousBtn = this.reportCardViewHeader.element(by.className('fetchPreviousButton'));

        //card view footer
        this.reportCardViewFooter = this.reportCardViewListHolder.element(by.className('cardViewFooter'));
        //fetch next button
        this.reportFooterNextBtn = this.reportCardViewFooter.element(by.className('fetchNextButton'));

        //Add Record Button
        this.addNewRecordBtn = this.reportToolsAndContentEl.element(by.className('addNewRecord'));

        //form container
        this.reportFormContainerEl = element(by.className('formContainer'));
        //form table
        this.formTable = this.reportFormContainerEl.element(by.className('formTable'));

        /*
         * Generic interaction function for clicking on paging nav buttons
         * @param Any paging button element that you want to click
         */
        this.clickPagingNavButton = function(pagingButtonElement) {
            var self = this;
            return e2ePageBase.waitForElementToBeClickable(pagingButtonElement).then(function() {
                return pagingButtonElement.click().then(function() {
                    // Wait for the report to load before proceeding with control flow
                    return self.waitForReportReady();
                });
            });
        };

        /**
         * Click Add Record button on Loaded Report Content for small BP
         *
         */
        this.clickAddRecord = function() {
            var self = this;
            return e2ePageBase.waitForElementToBeClickable(self.addNewRecordBtn).then(function() {
                return self.addNewRecordBtn.click().then(function() {
                    e2ePageBase.waitForElement(element(by.className('editForm')));
                });
            });
        };

        /**
         * Click on record in a table to open up in record view mode
         *
         */
        this.clickRecord = function(recordId) {
            var self = this;
            e2ePageBase.waitForElement(self.loadedContentEl).then(function() {
                self.reportCards.all(by.className('top-card-row')).then(function(records) {
                    return records[recordId - 1].click().then(function() {
                        e2ePageBase.waitForElement(self.recordEditBtn);
                        //card-expander
                    });
                });
            });
        };

        /**
         * Click Edit Record button on record content pageActions
         *
         */
        this.clickEditRecord = function() {
            var self = this;
            return e2ePageBase.waitForElementToBeClickable(self.recordEditBtn).then(function() {
                return self.recordEditBtn.click().then(function() {
                    e2ePageBase.waitForElement(element(by.className('editForm')));
                });
            });
        };

        /**
         * Enter field values on small breakpoint form
         *
         */
        this.enterFormValues = function(fieldLabel) {
            var self = this;
            //TODO this function covers all fields in dataGen. We will extend as we add more fields to dataGen.
            if (fieldLabel === 'dateCell') {
                //enter date fields
                return self.formTable.all(by.className(fieldLabel)).filter(function(elm) {
                    return elm;
                }).map(function(elm) {
                    //Do the click below to make it user editable
                    return elm.element(by.tagName('input')).click().then(function() {
                        //return elm.element(by.tagName('input')).clear().sendKeys(sDate);
                        browser.actions().sendKeys(sDate, protractor.Key.ENTER).perform();
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
                    return elm.element(by.tagName('input')).click().then(function() {
                        e2eBase.sleep(browser.params.smallSleep);
                        browser.actions().sendKeys(sTime, protractor.Key.ENTER).perform();
                    });
                });
            }
        };

        /**
         * Verify field values on small breakpoint report table
         *
         */
        this.verifyFieldValuesInReportTableSmallBP = function(fieldType) {
            var self = this;
            self.formTable.all(by.className(fieldType)).map(function(elm) {
                return elm.getAttribute('textContent').then(function(text) {
                    if (fieldType === 'numericField') {
                        expect(text.replace(/[!@#$%^&*]/g, "")).toBe(sNumeric.toString());
                    }
                    if (fieldType === 'checkbox') {
                        expect(elm.element(by.className('iconTableUISturdy-check')).isPresent()).toBeTruthy();
                    }
                });
            });

        };

        /**
         * Scrolling through pagingAdding and removing facets refreshes the displayed report quite often.
         * Function will wait for the loaded content to refresh. Helps with stability of tests.
         */
        this.waitForReportReady = function() {
            var self = this;
            return e2ePageBase.waitForElement(self.reportRecordsCount).then(function() {
                e2eBase.sleep(browser.params.smallSleep);
            });
        };

    };
    ReportCardView.prototype = e2ePageBase;
    module.exports = ReportCardView;
}());
