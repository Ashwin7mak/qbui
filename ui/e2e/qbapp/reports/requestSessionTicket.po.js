/**
 * This file uses the Page Object pattern to define the requestSessionTicket page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 9/25/15
 */
(function() {
    'use strict';
    // In order to manage the async nature of Protractor with a non-Angular page use the ExpectedConditions feature
    var EC = protractor.ExpectedConditions;
    var RequestSessionTicketPage = function() {
        // Element locators
        this.ticketResponseBodyEl = element(by.tagName('body'));
        this.stringValueEl = element(by.tagName('stringValue'));
        /*
         * Loads the page in the browser to generate a session ticket
         * Use the service method in e2eBase to get the proper endpoint
         */
        this.get = function(sessionTicketRequest) {
            browser.get(sessionTicketRequest);
            // Make sure the page is loaded before giving control back to the test class
            browser.wait(EC.visibilityOf(this.ticketResponseBodyEl), 5000);
        };
    };
    module.exports = new RequestSessionTicketPage();
}());
