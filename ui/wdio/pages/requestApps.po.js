/**
 * This file uses the Page Object pattern to define the requestApps page for tests
 */
(function() {
    'use strict';
    var e2ePageBase = require('./e2ePageBase.po');

    var RequestAppsPage = Object.create(e2ePageBase, {
        // Page Elements using Locators
        appContainerEl: { get: function() { return browser.element('.apps-container'); } },
        appsDivElList: { get: function() { return this.appContainerEl.elements('.apps'); } },
        tablesDivEl: { get: function() { return browser.element('.tables'); } },
        tableLinksElList: { get: function() { return this.tablesDivEl.elements('a'); } },

        /*
         * Loads the page in the browser containing a list apps and tables in a realm
         * Use the service method in e2eBase to get this URL for the realm/app
         */
        get: { value: function(requestAppsPageEndPoint) {
            return browser.url(requestAppsPageEndPoint);
        } }
    });

    module.exports = RequestAppsPage;
}());
