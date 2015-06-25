/**
 * This file uses the Page Object pattern to define the reportService page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */

(function(){
    'use strict';

    var requestReportPage = function() {
        // Constants

        // Page Elements using Locators
        this.reportServiceDivEl = element(by.className('quickbase-app'));
        this.sessionTicketLinkEl = this.reportServiceDivEl.element(by.linkText('session ticket'));

        this.appIdInputEl = element(by.id('appId'));
        this.tableIdInputEl = element(by.id('tableId'));
        this.goButtonEl = element(by.id('theButton'));
    };

    module.exports = new requestReportPage();
}());