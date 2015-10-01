/**
 * This file uses the Page Object pattern to define the requestReport page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */
(function() {
    'use strict';
    var RequestReportPage = function() {
        // Page Elements using Locators
        this.reportServiceDivEl = element(by.className('quickbase-app'));
        this.appElList = element.all(by.repeater('app in apps'));
        this.firstAppEl = this.appElList.first();
        this.firstTableEl = element.all(by.repeater('table in app.tables')).first();
        this.firstReportLinkEl = this.firstTableEl.all(by.tagName('a')).first();
        /*
         * Loads the page in the browser containing a list of the reports in an application
         * Use the service method in e2eBase to get this URL for the realm/app
         */
        this.get = function(requestReportPageEndPoint) {
            browser.get(requestReportPageEndPoint);
        };
    };
    module.exports = new RequestReportPage();
}());