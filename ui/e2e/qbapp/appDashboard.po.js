/**
 * This file uses the Page Object pattern to define the appDashboard page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */

(function(){
    'use strict';

    var appDashboardPage = function() {
        // Constants
        this.APP_TITLE_TEXT = 'Application';
        this.APP_DASHBOARD_TEXT = 'This is the home page for Application X';

        // Page Elements using Locators
        this.appDivEl = element(by.className('quickbase-app'));
        this.appTitleEl = element.all(by.tagName('p')).filter(function(elem, index) {
                            return elem.getText()
                                .then(function(text) {
                                    return text === 'Application';
                                });
                        });
        this.appDashTextEl = element.all(by.tagName('p')).filter(function(elem, index) {
                                return elem.getText()
                                    .then(function(text) {
                                        return text === 'This is the home page for Application X';
                                    });
                            });

        this.tablesLinkEl = this.appDivEl.element(by.linkText('Tables'));
        this.reportsLinkEl = this.appDivEl.element(by.linkText('Reports'));
        this.settingsLinkEl = this.appDivEl.element(by.linkText('Settings'));
    };

    module.exports = new appDashboardPage();
}());