/**
 * This file uses the Page Object pattern to define the requestApps page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */
(function() {
    'use strict';
    // In order to manage the async nature of Protractor with a non-Angular page use the ExpectedConditions feature
    var EC = protractor.ExpectedConditions;
    var RequestAppsPage = function() {
        // Page Elements using Locators
        this.appContainerEl = element(by.className('apps-container'));
        this.appsDivEl = this.appContainerEl.all(by.className('apps'));
        this.tablesDivEl = element(by.className('tables'));
        this.tableLinksElList = this.tablesDivEl.all(by.tagName('a'));
        /*
         * Loads the page in the browser containing a list apps and tables in a realm
         * Use the service method in e2eBase to get this URL for the realm/app
         */
        this.get = function(requestAppsPageEndPoint) {
            browser.get(requestAppsPageEndPoint);
            // Make sure the page is loaded before giving control back to the test class
            browser.wait(EC.visibilityOf(this.tablesDivEl), 5000);
        };
    };
    module.exports = new RequestAppsPage();
}());
