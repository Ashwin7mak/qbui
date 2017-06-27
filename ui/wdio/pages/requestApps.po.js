/**
 * This file uses the Page Object pattern to define the requestApps page for tests
 */
(function() {
    'use strict';
    var e2ePageBase = require('./e2ePageBase.po');
    let loadingSpinner = requirePO('/common/loadingSpinner');

    var RequestAppsPage = Object.create(e2ePageBase, {
        // Page Elements using Locators
        appContainerEl: {get: function() {return browser.element('.apps-container');}},
        appsDivElList: {get: function() {return this.appContainerEl.elements('.apps');}},
        tablesDivEl: {get: function() {return browser.element('.tables');}},
        tableLinksElList: {get: function() {return this.tablesDivEl.elements('a');}},

        /**
         * Returns all apps links from left Nav apps page
         * @returns Array of apps links
         */
        getAllAppLeftNavLinksList: {get: function() {
            //wait until loading screen disappear in leftNav
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            browser.element('.appsList .leftNavLabel').waitForVisible();
            return browser.elements('.appsList .leftNavLabel');
        }},

        /**
         * Select a app by its name from apps page left nav
         * @params appName
         */
        selectApp: {value: function(appName) {
            //filter table names from leftNav links
            var results = this.getAllAppLeftNavLinksList.value.filter(function(app) {
                return app.getAttribute('textContent') === appName;
            });

            if (results !== []) {
                //Click on filtered table name
                results[0].click();
                //wait until loading screen disappear in leftNav
                return loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            }
        }},

        /*
         * Loads the page in the browser containing a list apps and tables in a realm
         * Use the service method in e2eBase to get this URL for the realm/app
         */
        get: {value: function(requestAppsPageEndPoint) {
            return browser.url(requestAppsPageEndPoint);
        }}
    });

    module.exports = RequestAppsPage;
}());
