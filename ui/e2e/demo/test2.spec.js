/**
 * Test spec file to identify the version of Jasmine
 */

describe('Test to print out jasmine version', function() {
    it('prints jasmine version', function() {
        console.log('jasmine-version:' + jasmine.getEnv().versionString());
    });
});