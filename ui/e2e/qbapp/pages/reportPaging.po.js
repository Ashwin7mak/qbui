/**
 * This file uses the Page Object pattern to define the reportPaging page object for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 8/10/16
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = require('./../../common/e2ePageBase');
    var ReportServicePage = requirePO('reportService');
    var reportServicePage = new ReportServicePage();

    var ReportPagingPage = function() {

        // Report Toolbar
        this.reportToolbar = element(by.className('reportToolbar'));
        // Report Toolbar Pagination Container
        this.pagingToolbarContainer = this.reportToolbar.element(by.className('reportNavigation'));
        // Paging navigation buttons
        this.pagingToolbarPrevButton = this.pagingToolbarContainer.all(by.className('navigationButton')).get(0);
        this.pagingToolbarNextButton = this.pagingToolbarContainer.all(by.className('navigationButton')).get(1);
        // Page numbers
        this.pagingToolbarPageNumbers = this.pagingToolbarContainer.element(by.className('pageNumbers'));

        // Report Footer
        this.reportFooter = element(by.className('reportFooter'));
        // Report Toolbar Pagination Container
        this.pagingFooterContainer = this.reportFooter.element(by.className('reportNavigation'));
        // Paging navigation buttons
        this.pagingFooterPrevButton = this.pagingFooterContainer.all(by.className('navigationButton')).get(0);
        this.pagingFooterNextButton = this.pagingFooterContainer.all(by.className('navigationButton')).get(1);
        // Page numbers
        this.pagingFooterPageNumbers = this.pagingFooterContainer.element(by.className('pageNumbers'));

        /*
         * Function will get the current state of a previous paging button (whether it is disabled or not)
         * Generic function that can take a button element from the toolbar or from the footer
         */
        this.getPagingPrevButtonDisabled = function(pagingPrevButtonElement) {
            return e2ePageBase.hasClass(pagingPrevButtonElement.element(by.className('previousButton')), 'disabled');
        };

        /*
         * Function will get the current state of a next paging button (whether it is disabled or not)
         */
        this.getPagingNextButtonDisabled = function(pagingNextButtonElement) {
            return e2ePageBase.hasClass(pagingNextButtonElement.element(by.className('nextButton')), 'disabled');
        };

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
            return e2ePageBase.waitForElement(reportServicePage.agGridBodyEl);
        };
    };

    ReportPagingPage.prototype = e2ePageBase;
    module.exports = ReportPagingPage;
}());
