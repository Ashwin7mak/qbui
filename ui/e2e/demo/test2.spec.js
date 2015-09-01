/**
 * Test spec file to identify the version of Jasmine
 */

describe('Test to print out jasmine version', function() {
    'use strict';
    it('prints jasmine version', function() {
        /* global jasmine:true */
        console.log('jasmine-version:' + jasmine.getEnv().versionString());
    });
});