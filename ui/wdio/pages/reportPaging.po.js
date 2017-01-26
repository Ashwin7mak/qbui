/**
 * This file uses the Page Object pattern to define the reportPaging page object for tests
 *
 * Created by klabak on 11/28/16
 */
(function() {
    'use strict';
    var e2ePageBase = require('./e2ePageBase.po');

    var ReportPagingPage = Object.create(e2ePageBase, {
        // Report Toolbar
        reportToolbarEl: {get: function() {return browser.element('.reportToolbar');}},

        // Report Toolbar Pagination Container
        pagingToolbarContainer: {get: function() {
            this.reportToolbarEl.element('.reportNavigation').waitForVisible();
            return this.reportToolbarEl.element('.reportNavigation');
        }
        },

        // Paging navigation buttons
        pagingToolbarPrevButton: {get: function() {return this.pagingToolbarContainer.elements('.navigationButton').value[0];}},
        pagingToolbarNextButton: {get: function() {
            this.pagingToolbarContainer.elements('.navigationButton').value[1].waitForVisible();
            return this.pagingToolbarContainer.elements('.navigationButton').value[1];
        }
        },
        // Page numbers
        pagingToolbarPageNumbers: {get: function() {return this.pagingToolbarContainer.element('.pageNumbers');}},

        /*
         * Function will get the current state of a previous paging button (whether it is disabled or not)
         * @param Prev button element
         * @returns boolean whether or not the button is disabled
         */
        getPagingPrevButtonDisabled: {value: function(pagingPrevButtonElement) {
            return e2ePageBase.hasClass(pagingPrevButtonElement.element(by.className('previousButton')), 'disabled');
        }},

        /*
         * Function will get the current state of a next paging button (whether it is disabled or not)
         * @param Next button element
         * @returns boolean whether or not the button is disabled
         */
        getPagingNextButtonDisabled: {value: function(pagingNextButtonElement) {
            return e2ePageBase.hasClass(pagingNextButtonElement.element(by.className('nextButton')), 'disabled');
        }},

        /*
         * Generic interaction function for clicking on paging nav buttons
         * @param Any paging button element that you want to click
         */
        clickPagingNavButton: {value: function(pagingButtonElement) {
            pagingButtonElement.click();
            browser.waitForVisible('.qbTbody');
        }}
    });

    module.exports = ReportPagingPage;
}());
