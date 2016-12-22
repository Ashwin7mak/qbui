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

    /**
     * Helper method that will load a report for you in your browser by directly hitting a generated URL
     * @param realmName
     * @param appId
     * @param tableId
     * @param reportId
     * @returns A promise that will resolve after loading the generated URL
     */
    PageBase.prototype.loadReportByIdInBrowser = function(realmName, appId, tableId, reportId) {
        browser.url(e2eBase.getRequestReportsPageEndpoint(realmName, appId, tableId, reportId));
        return browser.waitForVisible('.ag-body-container');
    };

    //TODO: Refactor these if needed
    //// Verify the element is located on top of the other
    //this.isElementOnTop = function(element1, element2) {
    //    var self = this;
    //    // First check that both elements are being displayed
    //    return self.waitForElements(element1, element2).then(function() {
    //        // Get element1 location
    //        element1.getLocation().then(function(navDivLocation) {
    //            var element1xPosition = navDivLocation.x;
    //            var element1yPosition = navDivLocation.y;
    //            // Get element2 location
    //            element2.getLocation().then(function(navDivLocation2) {
    //                var element2xPosition = navDivLocation2.x;
    //                var element2yPosition = navDivLocation2.y;
    //                // Compare element2 coordinates to be greater than element1
    //                expect(element2xPosition === element1xPosition || element2xPosition > element1xPosition).toBeTruthy();
    //                expect(element2yPosition > element1yPosition).toBeTruthy();
    //            });
    //        });
    //    });
    //};

    //// Resize the browser window to the given pixel width and height. Returns a promise
    //resizeBrowser: function(width, height) {
    //    var deferred = Promise.pending();
    //    // Define the window size if there is a browser object
    //    if (typeof browser !== 'undefined') {
    //        browser.driver.manage().window().getSize().then(function(dimension) {
    //            // Currently our breakpoints only change when browser width is changed so don't need to check height (yet)
    //            if (dimension.width === width) {
    //                // Do nothing because we are already at the current width
    //                deferred.resolve();
    //            } else {
    //                // Resize browser if not at same width
    //                browser.driver.manage().window().setSize(width, height).then(function() {
    //                    e2eBase.sleep(browser.params.mediumSleep).then(function() {
    //                        deferred.resolve();
    //                    });
    //                });
    //            }
    //        });
    //        return deferred.promise;
    //    } else {
    //        return deferred.resolve();
    //    }
    //},

    //// Helper method to sleep a specified number of seconds
    //sleep: function(ms) {
    //    var deferred = Promise.pending();
    //    try {
    //        browser.driver.sleep(ms);
    //        deferred.resolve();
    //    } catch (error) {
    //        console.error(JSON.stringify(error));
    //        deferred.reject(error);
    //    }
    //    return deferred.promise;
    //}

    module.exports = new PageBase();
}());
