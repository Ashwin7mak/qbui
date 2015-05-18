/**
 * Integration base module that defines common locators / actions / functions to be used by all Protractor tests
 * Created by klabak on 4/15/15.
 */

(function(){
    'useStrict';
    var promise = require('bluebird');
    module.exports = function (){

        var integrationBase = {

            // Find a particular link (based on link text) in a list of links
            getLink: function (listOfLinks, linkText){
                var linkDeferred = promise.pending();
                // Check the size of the list first
                expect(listOfLinks.length).not.toBe(null);
                var arrayLength = listOfLinks.length;

                var getTextPromises = [];

                for (var i = 0; i < arrayLength; i++) {
                    // Use === as it checks for type as well
                    // console.log('searching');

                    getTextPromises.push(listOfLinks[i].getText());
                }

                promise.all(getTextPromises)
                    .then(function(responses){
                        var valueFound = false;

                        for (var i = 0; i < responses.length; i++){
                            if(responses[i] === linkText){
                                // console.log('found link');
                                valueFound = true;
                                linkDeferred.resolve(responses[i]);
                            }
                        }
                        if (!valueFound){
                            linkDeferred.reject('Could not find link');
                        }

                    }).catch(function(error){
                        linkDeferred.reject(error);
                    })

                return linkDeferred.promise;
            },

            // Gets all links within a div element
            // Returns a promise (calls Protractor's element.all() function)
            getLinks: function (div){
                // Check that the div is not empty
                expect(div).not.toEqual({});
                return div.all(by.tagName('a'));
            },

            // Helper method that checks the classes of an element for only exact matches
            // Use this method instead of toMatch() as that will return true for partial matches
            hasClass: function (element, cls) {
                return element.getAttribute('class').then(function (classes) {
                    return classes.split(' ').indexOf(cls) !== -1;
                });
            }


        }

        return integrationBase;

        // Can have locators for headers and footers here as well
    }
}());