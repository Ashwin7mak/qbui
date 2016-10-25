/**
 * This file uses the Page Object pattern to define the newStackAuth page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 10/20/16
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    var e2ePageBase = require('./../../common/e2ePageBase');

    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');

    var newStackAuthPage = function() {
        /**
         * Login function will request a ticket for the specified realm endpoint, store it as a browser cookie then load the applications endpoint
         * @param realmName
         * @param realmId
         */
        this.realmLogin = function(realmName, realmId) {
            //TODO: Will have to extend with user auth, for now just uses Super Admin to auth for ticket
            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint)).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            });
        };
    };
    newStackAuthPage.prototype = e2ePageBase;
    module.exports = newStackAuthPage;
}());
