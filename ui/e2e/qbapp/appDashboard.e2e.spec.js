/**
 * This spec file defines the tests and expectations for the appDashboard page
 * Created by klabak on 4/16/15
 */

'use strict';
// Import the integrationBase module
var integrationBase = require('./../common/integrationBase')();

// Groups tests by functionality
describe('App Dashboard', function() {
    // Variable to hold the page object
    var page;

    // Setup method
    beforeEach(function() {
        // Call the app dashboard page
        browser.get('/qbapp#/');
        // Load the page object model
        page = require('./appDashboard.po');
    });

    // Test expectation
    it('should have the correct app title', function() {
        page.appTitleEl.getText().then(function (data) {
            expect(data.length).toBe(1);
            expect(data[0]).toEqual(page.APP_TITLE_TEXT);
        });
    });

    it('should have the right dashboard text', function(){
        page.appDashTextEl.getText().then(function (data) {
            expect(data.length).toBe(1);
            expect(data[0]).toEqual(page.APP_DASHBOARD_TEXT);
        });
    })

});
