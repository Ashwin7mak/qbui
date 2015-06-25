/**
 * This file uses the Page Object pattern to define the directReportLinksPage page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */

(function(){
    'use strict';

    var directReportLinksPage = function() {
        // Constants

        // Page Elements using Locators
        this.directReportLinksDivEl = element(by.repeater('report in reports'));
        //TODO: This will get all the links, change name and use helper method in base class to find specific one
        this.firstReportLinkEl = this.directReportLinksDivEl.element(by.tagName('a'));
    };

    module.exports = new directReportLinksPage();
}());