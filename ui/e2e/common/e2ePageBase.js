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
        this.waitForElement = function(element){
            return browser.wait(EC.visibilityOf(element), 5000);
        };

    };
    module.exports = new BasePage();
}());
