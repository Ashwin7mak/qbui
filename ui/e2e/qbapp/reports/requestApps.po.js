/**
 * This file uses the Page Object pattern to define the requestApps page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */
(function() {
    'use strict';
    var RequestAppsPage = function() {
        // Page Elements using Locators
        this.appContainerEl = element(by.className('apps-container'));
        this.appElList = this.appContainerEl.all(by.className('apps'));
        this.tableElList = element(by.className('tables'));
        this.firstTableLinkEl = this.tableElList.all(by.tagName('a')).first();
        /*
         * Loads the page in the browser containing a list apps and tables in a realm
         * Use the service method in e2eBase to get this URL for the realm/app
         */
        this.get = function(requestAppsPageEndPoint) {
            browser.get(requestAppsPageEndPoint);
        };
    };
    module.exports = new RequestAppsPage();
}());