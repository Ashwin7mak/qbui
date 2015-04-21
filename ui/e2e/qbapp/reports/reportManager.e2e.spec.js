/**
 * Created by klabak on 4/20/15.
 */

'use strict';

// Import the integrationBase module
var integrationBase = require('./../../common/integrationBase')();

// Groups tests by functionality
describe('Report Manager', function() {
    // Variable to hold the page object
    var page;

    // Setup method
    beforeEach(function () {
        // Call the report page
        browser.get('/qbapp#/report/1');
        page = require('./reportManager.po');
    });

    // Test expectation
    it('should have the header be visible by default', function () {
        // This method will allow for partial matches
        expect(page.stageDivEl.getAttribute('class')).toMatch('stage-open');

        // This helper method will only allow for exact matches
        integrationBase.hasClass(page.stageDivEl, 'stage-open').then(function(hasClass){
            expect(hasClass).toEqual(true);
        });
    });

    // Test expectation
    it('the stage button should collapse and expand the stage element', function () {
        // Once the page loads click the stage collapse button
        page.stageTabArrowEl.click().then(function(){
            // Test that the stage class has changed (which hides the div)
            integrationBase.hasClass(page.stageDivEl, 'stage-close').then(function(hasClass) {
                expect(hasClass).toEqual(true);
            });
        });
    });

});


