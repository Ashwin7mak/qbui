/**
 * This file uses the Page Object pattern to define the realmDashboard page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */

(function(){
    'use strict';

    var realmDashboardPage = function() {
        // Constants
        this.parText1 = 'Welcome to Quickbase. This is your home page dashboard';
        this.parText2 = 'Here are your quickbase applications';

        // Page Elements using Locators
        this.realmDivEl = element(by.className('quickbase-realm'));
        this.intuitLogoEl = element(by.className('intuit-logo'));
    };

    module.exports = new realmDashboardPage();
}());