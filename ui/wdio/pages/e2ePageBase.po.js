/**
 * Page object base module that defines common locators / actions / functions to be used in E2E tests
 * All new page objects should inherit this module by default.
 */
(function() {
    'use strict';
    var reportContentPO = requirePO('reportContent');
    let loadingSpinner = requirePO('/common/loadingSpinner');
    let topNavPO = requirePO('topNav');

    function PageBase() {
        // Define common locators that all pages share here
    }

    /**
     * Helper method that checks the classes of an element for only exact matches
     * Use this method instead of toMatch() as that will return true for partial matches.
     */
    PageBase.prototype.hasClass = function(element, cls) {
        return element.getAttribute('class').split(' ').indexOf(cls) !== -1;
    };

    PageBase.prototype.isDisabled = function(element) {
        return this.hasClass(element, 'disabled');
    };

    /**
     * Helper method that will scroll element into view on the page if it's not visible
     * @param Element locator for the element you want to scroll to
     * @returns A Promise
     */
    PageBase.prototype.scrollElementIntoView = function(elementLocator) {
        return elementLocator.isDisplayed().then(function(result) {
            if (!result) {
                return browser.execute("arguments[0].scrollIntoView();", elementLocator.getWebElement());
            }
        });
    };

    PageBase.prototype.waitForElementToBeDisplayed = function(element) {
        return browser.waitForVisible(element, 5000);
    };

    PageBase.prototype.waitForElementToBeInvisible = function(element) {
        return browser.waitForVisible(element, 5000, false);
    };

    PageBase.prototype.waitForElementToBePresent = function(element) {
        return browser.waitForExist(element, 5000);
    };

    PageBase.prototype.waitForElementToBeStale = function(element) {
        return browser.waitForExist(element, 5000, false);
    };

    PageBase.prototype.waitForElementToBeClickable = function(element) {
        //TODO Need to implement, use waitUntil method
    };

    /**
     * Helper method that will load an apps page for you in your browser by directly hitting a generated URL
     * @param realmName
     * @returns A promise that will resolve after loading the generated URL
     */
    PageBase.prototype.loadAppsInBrowser = function(realmName) {
        this.navigateTo(e2eBase.getRequestAppsPageEndpoint(realmName));
        //wait until loading screen disappear in leftNav
        loadingSpinner.waitUntilLeftNavSpinnerGoesAway();
        //wait until loading screen disappear in report Content
        loadingSpinner.waitUntilReportLoadingSpinnerGoesAway();
        //wait until apps links in leftNav is visible
        return browser.element('.appsList .leftNavLabel').waitForVisible();
    };

    /**
     * Helper method that will load an particular app by ID for you in your browser by directly hitting a generated URL
     * @param realmName
     * @param appId
     * @returns A promise that will resolve after loading the generated URL
     */
    PageBase.prototype.loadAppByIdInBrowser = function(realmName, appId) {
        this.navigateTo(e2eBase.getRequestAppPageEndpoint(realmName, appId));
        //wait until loading screen disappear in leftNav
        loadingSpinner.waitUntilLeftNavSpinnerGoesAway();
        //wait until loading screen disappear in report Content
        loadingSpinner.waitUntilReportLoadingSpinnerGoesAway();
        //If tablesList is not visible then again navigate to appId page
        if (!browser.element('.tablesList').isExisting()) {
            this.navigateTo(e2eBase.getRequestAppPageEndpoint(realmName, appId));
        }
        //wait until you see newTable in left Nav
        return browser.element('.appHomePageBody .noRowsIcon').waitForVisible();
    };

    /**
     * Helper method that will load an particular table by ID in an app for you in your browser by directly hitting a generated URL
     * @param realmName
     * @param appId
     * @param tableId
     * @returns A promise that will resolve after loading the generated URL
     */
    PageBase.prototype.loadTableByIdInBrowser = function(realmName, appId, tableId) {
        this.navigateTo(e2eBase.getRequestTableEndpoint(realmName, appId, tableId));
        //wait until loading screen disappear in leftNav
        loadingSpinner.waitUntilLeftNavSpinnerGoesAway();
        //wait until loading screen disappear in report Content
        loadingSpinner.waitUntilReportLoadingSpinnerGoesAway();
        //wait until records count loaded
        return browser.element('.reportToolbar .loadedContent .recordsCount').waitForVisible();
    };

    /**
     * Helper method that will load a report for you in your browser by directly hitting a generated URL
     * @param realmName
     * @param appId
     * @param tableId
     * @param reportId
     * @returns A promise that will resolve after loading the generated URL
     */
    PageBase.prototype.loadReportByIdInBrowser = function(realmName, appId, tableId, reportId) {
        this.navigateTo(e2eBase.getRequestReportsPageEndpoint(realmName, appId, tableId, reportId));
        //wait until loading screen disappear in leftNav
        loadingSpinner.waitUntilLeftNavSpinnerGoesAway();
        //wait until loading screen disappear in report Content
        loadingSpinner.waitUntilReportLoadingSpinnerGoesAway();
        //wait until report rows in table are loaded
        return reportContentPO.waitForReportContent();
    };

    /**
     * Helper method that will load users for an app for you in your browser by directly hitting a generated URL
     * @param realmName
     * @param appId
     * @returns A promise that will resolve after loading the generated URL
     */
    PageBase.prototype.loadUsersInAnAppInBrowser = function(realmName, appId) {
        this.navigateTo(e2eBase.getRequestUsersEndpoint(realmName, appId));
        //wait until loading screen disappear in leftNav
        loadingSpinner.waitUntilLeftNavSpinnerGoesAway();
        //wait until loading screen disappear in report Content
        loadingSpinner.waitUntilReportLoadingSpinnerGoesAway();
        //If user report is not visible then again navigate to user page
        if (!browser.element('.userManagementContainer').isExisting()) {
            this.navigateTo(e2eBase.getRequestUsersEndpoint(realmName, appId));
        }
        //wait until report rows in table are loaded
        return reportContentPO.waitForReportContent();
    };

    PageBase.prototype.navigateTo = function(url) {
        return browser.url(url);
    };

    module.exports = new PageBase();
}());
