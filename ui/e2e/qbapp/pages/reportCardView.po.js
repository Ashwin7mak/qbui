(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = require('./../../common/e2ePageBase');

    var ReportCardView = function() {
        this.reportContainerEl = element(by.className('reportContainer'));
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
        //card View List
        this.reportCardViewListHolder = this.reportTable.element(by.className('cardViewListHolder'));
        //card Rows
        this.reportCards = this.reportCardViewListHolder.element(by.className('collapse'));
        //card record rows
        this.reportCardRows = this.reportCards.all(by.className('top-card-row')).filter(function(elem) {
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

    };
    ReportCardView.prototype = e2ePageBase;
    module.exports = ReportCardView;
}());
