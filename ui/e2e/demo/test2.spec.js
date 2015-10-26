/**
 * Test spec file to identify the version of Jasmine being used by the Protractor tests
 */

describe('Test to print out jasmine version', function() {
    'use strict';
    // This function is present in Jasmine 2.1 and above
    beforeAll(function() {
        console.log('beforeAll capability is present');
    });
    it('prints jasmine version used by protractor', function() {
        console.log('jasmine-version:' + jasmine.version);
    });
});
