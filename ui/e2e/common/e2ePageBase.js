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
        this.waitForElement = function(element) {
            return browser.wait(EC.visibilityOf(element), 5000, 'Timed out waiting for element to appear');
        };

        this.waitForElementToBePresent = function(element) {
            return browser.wait(EC.presenceOf(element), 5000, 'Timed out waiting for element to appear');
        };

        this.waitForElementToBeClickable = function(element) {
            return browser.wait(EC.elementToBeClickable(element), 5000, 'Timed out waiting for element to be clickable');
        };

        // Verify the element is located Top
        this.isElementOnTop = function(element1, element2) {
            // First check that both elements are being displayed
            this.isElementDisplayed(element1);
            this.isElementDisplayed(element2);

            // Get element1 location
            element1.getLocation().then(function(navDivLocation) {
                var element1xPosition = navDivLocation.x;
                var element1yPosition = navDivLocation.y;
                //TODO Require logger.js instead of using console.log
                //console.log("The coordinates of element1 are: " + element1xPosition + "," + element1yPosition);
                // Get element2 location
                element2.getLocation().then(function(navDivLocation2) {
                    var element2xPosition = navDivLocation2.x;
                    var element2yPosition = navDivLocation2.y;
                    //console.log("The coordinates of element2 are: " + element2xPosition + "," + element2yPosition);
                    // Compare element2 coordinates to be greater than element1
                    expect(element2xPosition === element1xPosition || element2xPosition > element1xPosition).toBeTruthy();
                    expect(element2yPosition > element1yPosition).toBeTruthy();
                });
            });
        };

        //TODO: Left, Right, Bottom functions

        // Verify the element is present in the DOM and displayed (either by the display attribute or hidden prop)
        this.isElementDisplayed = function(element) {
            expect(element.isPresent()).toBeTruthy('element not present in DOM');
            expect(element.isDisplayed()).toBeTruthy('element not displayed on page');
        };
    };
    module.exports = new BasePage();
}());
