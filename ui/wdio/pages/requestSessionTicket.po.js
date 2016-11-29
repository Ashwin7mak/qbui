/**
 * This file uses the Page Object pattern to define the requestSessionTicket page for tests
 */
(function() {
    'use strict';
    var e2ePageBase = require('./e2ePageBase.po');

    var RequestSessionTicketPage = Object.create(e2ePageBase, {
        // Page Elements using Locators
        ticketResponseBodyEl: { get: function() { return browser.element('body'); } },
        stringValueEl: { get: function() { return browser.element('#stringValue'); } },

        /*
         * Loads the page in the browser to generate a session ticket
         * Use the service method in e2eBase to get the proper endpoint
         */
        get: { value: function(sessionTicketRequest) {
            return browser.url(sessionTicketRequest);
        } }
    });

    module.exports = RequestSessionTicketPage;
}());
