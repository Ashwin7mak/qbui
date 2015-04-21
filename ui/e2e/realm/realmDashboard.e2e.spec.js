/**
 * This spec file defines the tests and expectations for the realmDashboard page
 * Created by klabak on 4/10/15
 */

'use strict';

// Import the integrationBase module
var integrationBase = require('./../common/integrationBase')();

// Groups tests by functionality
describe('Realm Dashboard', function() {
    // Variable to hold the page object
    var page;

    // Setup method
    beforeEach(function() {
        // Call the main node.js page
        browser.get('/');
        // Load the page object model
        page = require('./realmDashboard.po');
    });

    // Test expectation
    it('should include the Intuit logo', function() {
        expect(page.intuitLogoEl.isPresent()).toBe(true);
    });

    // Second test
    it('should contain the realm div with dashboard information', function(){
        // Check the div is present
        expect(page.realmDivEl.isPresent()).toBe(true);
        // Grab all the links out of the div
        element.all(by.tagName('a')).then(function(links) {
            expect(links.length).toBe(4);
            expect(links[0].getText()).toBe('Application 1');
        });
    });

    it('should take the user to the application dashboard', function(){
        // Grab all the links out of the div
        element.all(by.tagName('a')).then(function(links) {
            links[0].click();
            // Check the title of the next page
            expect(browser.getTitle()).toBe('Application Home');
        });
    });

    it('should have the proper welcome message', function(){
        // Grab all the paragraphs out of the div
        element.all(by.tagName('p')).then(function(pars) {
            // Compare text with constants defined in the page object
            expect(pars[0].getText()).toBe(page.parText1);
            expect(pars[1].getText()).toBe(page.parText2);
        });
    });

    it('should have a particular link present', function(){
        integrationBase.getLinks(page.realmDivEl).then(function(links) {
            expect(links[0].getText()).toBe('Application 1');
        })
    });

    it('should have another link present', function(done) {
        element.all(by.tagName('a'))
            .then(function (links) {
                integrationBase.getLink(links, 'Application 2')
                    .then(function (text) {
                        expect(text).not.toEqual('Application 3');
                        done();
                    }, function (error) {
                        expect('').toBe('failed to get link: ' + error);
                        done();
                    });
            }, function (error) {
                expect('').toBe('failed to get link: ' + error);
                done();
            });
    });
});
