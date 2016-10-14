/**
 * Page object base module that defines common locators / actions / functions to be used in Protractor tests
 * All new page objects should inherit this module by default.
 * Created by klabak on 4/15/15.
 */
(function() {
    'use strict';
    var promise = require('bluebird');
    // In order to manage the async nature of Protractor with a non-Angular page use the ExpectedConditions feature
    var EC = protractor.ExpectedConditions;
    var BasePage = function() {
        /**
         * Find a particular link (based on link text) in a list of links
         */
        this.getLink = function(listOfLinks, linkText) {
            var linkDeferred = promise.pending();
            //Check the size of the list first
            expect(listOfLinks.length).not.toBe(null);
            var arrayLength = listOfLinks.length;
            var getTextPromises = [];
            for (var i = 0; i < arrayLength; i++) {
                getTextPromises.push(listOfLinks[i].getText());
            }
            promise.all(getTextPromises)
                    .then(function(responses) {
                        var valueFound = false;
                        for (var j = 0; j < responses.length; j++) {
                            if (responses[j] === linkText) {
                                valueFound = true;
                                linkDeferred.resolve(responses[j]);
                            }
                        }
                        if (!valueFound) {
                            linkDeferred.reject('Could not find link');
                        }
                    }).catch(function(error) {
                        linkDeferred.reject(error);
                    });
            return linkDeferred.promise;
        };

        /**
         * Gets all links within a div element
         * Returns a promise (calls Protractor's element.all() function)
         */
        this.getLinks = function(div) {
            //Check that the div is not empty
            expect(div).not.toEqual({});
            return div.all(by.tagName('a'));
        };

        /**
         * Helper method that checks the classes of an element for only exact matches
         * Use this method instead of toMatch() as that will return true for partial matches.
         */
        this.hasClass = function(element, cls) {
            return element.getAttribute('class').then(function(classes) {
                return classes.split(' ').indexOf(cls) !== -1;
            });
        };

        /**
         * Helper method that will scroll element into view on the page if it's not visible
         * @param Element locator for the element you want to scroll to
         * @returns A Promise
         */
        this.scrollElementIntoView = function(elementLocator) {
            return elementLocator.isDisplayed().then(function(result) {
                if (!result) {
                    return browser.executeScript("arguments[0].scrollIntoView();", elementLocator.getWebElement());
                }
            });
        };

        /*
         * Wrapper functions for Protractor's ExpectedConditions feature which allows you to wait for non-Angular elements
         */
        this.waitForElement = function(element) {
            return browser.wait(EC.visibilityOf(element), browser.params.ecTimeout, 'Timed out waiting for element to appear');
        };

        this.waitForElements = function(element1, element2) {
            var condition = EC.and(EC.visibilityOf(element1), EC.visibilityOf(element2));
            //wait for condition to be true.
            return browser.wait(condition, browser.params.ecTimeout, 'Timed out waiting for elements to be visible');
        };

        this.waitForElementToBePresent = function(element) {
            return browser.wait(EC.presenceOf(element), browser.params.ecTimeout, 'Timed out waiting for element to be present on the DOM');
        };

        this.waitForElementToBeClickable = function(element) {
            return browser.wait(EC.elementToBeClickable(element), browser.params.ecTimeout, 'Timed out waiting for element to be clickable');
        };

        this.waitForElementToBeStale = function(element) {
            return browser.wait(EC.stalenessOf(element), browser.params.ecTimeout, 'Timed out waiting for element to become stale');
        };

        this.waitForElementToBeInvisible = function(element) {
            return browser.wait(EC.invisibilityOf(element), browser.params.ecTimeout, 'Timed out waiting for element to be invisible');
        };

        this.waitForElementsToBeClickable = function(element1, element2) {
            var condition = EC.and(EC.elementToBeClickable(element1), EC.elementToBeClickable(element2));
            //wait for condition to be true.
            return browser.wait(condition, browser.params.ecTimeout, 'Timed out waiting for elements to be visible');
        };

        // Verify the element is located on top of the other
        this.isElementOnTop = function(element1, element2) {
            var self = this;
            // First check that both elements are being displayed
            return self.waitForElements(element1, element2).then(function() {
                // Get element1 location
                element1.getLocation().then(function(navDivLocation) {
                    var element1xPosition = navDivLocation.x;
                    var element1yPosition = navDivLocation.y;
                    // Get element2 location
                    element2.getLocation().then(function(navDivLocation2) {
                        var element2xPosition = navDivLocation2.x;
                        var element2yPosition = navDivLocation2.y;
                        // Compare element2 coordinates to be greater than element1
                        expect(element2xPosition === element1xPosition || element2xPosition > element1xPosition).toBeTruthy();
                        expect(element2yPosition > element1yPosition).toBeTruthy();
                    });
                });
            });
        };

        //TODO: Left, Right, Bottom functions

        // Verify the element is present in the DOM and displayed (either by the display attribute or hidden prop)
        this.assertElementDisplayed = function(element) {
            expect(element.isPresent()).toBeTruthy('element not present in DOM');
            expect(element.isDisplayed()).toBeTruthy('element not displayed on page');
        };
    };
    module.exports = new BasePage();
}());
