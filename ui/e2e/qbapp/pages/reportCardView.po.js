(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = require('./../../common/e2ePageBase');

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
