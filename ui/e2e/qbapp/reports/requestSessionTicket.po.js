/**
 * This file uses the Page Object pattern to define the requestSessionTicket page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 9/25/15
 */
(function() {
    'use strict';
    var RequestSessionTicketPage = function() {
        // Element locators
        this.ticketResponseBodyEl = element(by.tagName('body'));
        /*
         * Loads the page in the browser to generate a session ticket
         * Use the service method in e2eBase to get the proper endpoint
         */
        this.get = function(sessionTicketRequest) {
            browser.get(sessionTicketRequest);
        };
    };
    module.exports = new RequestSessionTicketPage();
}());