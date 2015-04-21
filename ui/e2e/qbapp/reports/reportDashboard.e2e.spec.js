/**
 * This spec file defines the tests and expectations for the reportDashboard page
 * Created by klabak on 4/16/15
 */

'use strict';
// Import the integrationBase module
var integrationBase = require('./../../common/integrationBase')();

// Groups tests by functionality
describe('report Dashboard', function() {
    // Variable to hold the page object
    var page;

    // Setup method
    beforeEach(function() {
        // Call the reports dashboard page
        browser.get('/qbapp#/reports');
        // Load the page object model
        page = require('./reportDashboard.po.js');
    });

    // Test expectations

});
