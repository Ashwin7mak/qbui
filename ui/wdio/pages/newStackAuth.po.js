/**
 * This file uses the Page Object pattern to define the newStackAuth page object for tests
 */
(function() {
    'use strict';

    var e2ePageBase = require('./e2ePageBase.po');
    var RequestSessionTicketPage = require('./requestSessionTicket.po');
    var RequestAppsPage = require('./requestApps.po');

    var newStackAuthPage = Object.create(e2ePageBase, {
        /**
         * Login function will request a ticket for the specified realm endpoint, store it as a browser cookie then load the applications endpoint
         * @param realmName
         * @param realmId
         */
        realmLogin: {value: function(realmName, realmId) {
            //TODO: Will have to extend with user auth, for now just uses Super Admin to auth for ticket
            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            return e2ePageBase.navigateTo(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint)).then(function() {
                // Load the requestAppsPage (shows a list of all the apps in a realm)
                return e2ePageBase.navigateTo(e2eBase.getRequestAppsPageEndpoint(realmName));
            });
        }},

        /**
         * Login function will request a ticket for the specific user for specified realm endpoint, store it as a browser cookie then load the applications endpoint
         * @param realmName
         * @param realmId
         * @param userId
         */
        nonAdminRealmLogin: {value: function(realmName, realmId, userId) {
            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            return e2ePageBase.navigateTo(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId=')).then(function() {
                // Load the requestAppsPage (shows a list of all the apps in a realm)
                return e2ePageBase.navigateTo(e2eBase.getRequestAppsPageEndpoint(realmName));
            });
        }}
    });

    module.exports = newStackAuthPage;
}());
