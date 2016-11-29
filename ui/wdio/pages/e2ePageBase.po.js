/**
 * Page object base module that defines common locators / actions / functions to be used in E2E tests
 * All new page objects should inherit this module by default.
 */
(function() {
    'use strict';

    function PageBase() {
        // Define common locators that all pages share here
    }

    /**
     * Helper method that checks the classes of an element for only exact matches
     * Use this method instead of toMatch() as that will return true for partial matches.
     */
    PageBase.prototype.hasClass = function(element, cls) {
        return element.getAttribute('class').then(function(classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
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

    module.exports = new PageBase();
}());
