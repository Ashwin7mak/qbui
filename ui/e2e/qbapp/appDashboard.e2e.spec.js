/**
 * This spec file defines the tests and expectations for the appDashboard page
 * Created by klabak on 4/16/15
 */

'use strict';

// Groups tests by functionality
describe('app Dashboard', function() {
    // Variable to hold the page object
    var page;
    // Variable to keep track of the page status
    var pageLoaded = false;

    // Setup method
    beforeEach(function() {
        if ( ! pageLoaded) {
            // Load the page object model
            page = require('./appDashboard.po');
            // Call the app dashboard page
            browser.get('/qbapp#/');
            pageLoaded = true;
        }
    });

    // Test expectations
    it('should have the correct app title', function () {
        page.appTitleEl.getText().then(function (data) {
            expect(data.length).toBe(1);
            expect(data[0]).toEqual(page.APP_TITLE_TEXT);
        });
    });

    it('should have the right dashboard text', function () {
        page.appDashTextEl.getText().then(function (data) {
            expect(data.length).toBe(1);
            expect(data[0]).toEqual(page.APP_DASHBOARD_TEXT);
        });
    })
});
