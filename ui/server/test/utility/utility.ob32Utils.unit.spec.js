'use strict';

var assert = require('assert');
var ob32Utils = require('../../src/utility/ob32Utils.js');

/**
 * Unit tests for ob32 Utility Functions
 */
describe('Validate ob32 Utility Functions', function() {

    describe('verify ob32 decoder works on encoded sections of ticket', function() {
        var testCases = [
            {name: 'decode time', encodedString: 'bky5c33ch', expectation: '1467640243271'},
            {name: 'decode user id', encodedString: 'j2s', expectation: '10000'},
            {name: 'decode realm id', encodedString: 'rfwbk', expectation: '15913002'},
            {name: 'decode user ticket version', encodedString: 'a', expectation: '0'},
        ];
        testCases.forEach(function(testCase) {
            it(testCase.name, function() {
                assert.equal(ob32Utils.decoder(testCase.encodedString), testCase.expectation);
            });
        });
    });


});
