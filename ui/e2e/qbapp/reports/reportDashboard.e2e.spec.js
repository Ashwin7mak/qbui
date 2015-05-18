/**
 * This spec file defines the tests and expectations for the reportDashboard page
 * Created by klabak on 4/16/15
 */

'use strict';
// Import the integrationBase module
var integrationBase = require('./../../common/integrationBase')();

// Groups tests by functionality
describe('report Dashboard', function(){
    // Variable to hold the page object
    var page;
    // Variable to keep track of the page status
    var pageLoaded = false;

    // Setup method
    beforeEach(function() {
        if ( ! pageLoaded) {
            // Load the page object model
            page = require('./reportDashboard.po.js');
            // Call the reports dashboard page
            browser.get('/qbapp#/reports');
            pageLoaded = true;
        }
    });

    // Test expectations
    it('should have a particular link present', function(){
        integrationBase.getLinks(page.navLinksEl).then(function(links) {
            expect(links[1].getText()).toBe(page.REPORT_2_TEXT);
        })
    });

    it('should have default content in the header', function(){
        expect(page.layoutHeaderEl.getText()).toBe(page.DEFAULT_HEADER_TEXT)
    });

    it('should update the main content with the proper report when a link is clicked', function(){
        integrationBase.getLinks(page.navLinksEl).then(function(links) {
            // Click the Report 2 link
            links[1].click();
            // Check the header text has been updated
            expect(page.layoutHeaderEl.getText()).toBe(page.DEFAULT_HEADER_TEXT.concat(' > Report name 2'));
            // Check the report content div is now present
            expect(page.reportContentEl.isPresent()).toBe(true);
        })
    });
});
