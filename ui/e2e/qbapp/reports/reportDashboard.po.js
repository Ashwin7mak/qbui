/**
 * This file uses the Page Object pattern to define the reportDashboard page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */

(function(){
    'use strict';

    var reportDashboardPage = function() {
        // Constants
        this.REPORT_1_TEXT = 'Report 1';
        this.REPORT_2_TEXT = 'Report 2';
        this.REPORT_3_TEXT = 'Report 3';
        this.DEFAULT_HEADER_TEXT = 'Beta > Reports';

        // Page Elements using Locators
        this.layoutHeaderEl = element(by.className('layout-header'));
        this.navLinksEl = element(by.className('nav-links'));
        this.reportContentEl = element(by.className('report-content'));
    };

    module.exports = new reportDashboardPage();
}());