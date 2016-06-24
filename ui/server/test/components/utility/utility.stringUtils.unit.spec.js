'use strict';

var assert = require('assert');
var stringUtils = require('../../../src/components/utility/stringUtils.js');

/**
 * Unit tests for String Utility Functions
 */
describe('Validate String Utility Functions', function() {

    describe('verify convertListToDelimitedString with valid input', function() {
        var testCases = [
            {name: 'valid array - . delimiter', inList: [1, 2, 3, 4, 5], delimiter:'.', expectation: '1.2.3.4.5'},
            {name: 'valid array - : delimiter', inList: [1, 2, 3, 4, 5], delimiter:':', expectation: '1:2:3:4:5'},
            {name: 'valid array - null delimiter', inList: [1, 2, 3, 4, 5], delimiter:null, expectation: '1,2,3,4,5'},
            {name: 'valid array - empty delimiter', inList: [1, 2, 3, 4, 5], delimiter:'', expectation: '1,2,3,4,5'},
            {name: 'valid array - undefined delimiter', inList: [1, 2, 3, 4, 5], delimiter:undefined, expectation: '1,2,3,4,5'},
            {name: 'valid array - empty', inList: {}, delimiter:'.', expectation: ''}
        ];
        testCases.forEach(function(testCase) {
            it(testCase.name, function() {
                assert.equal(stringUtils.convertListToDelimitedString(testCase.inList, testCase.delimiter), testCase.expectation);
            });
        });
    });

    describe('verify convertListToDelimitedString with invalid input', function() {
        var testCases = [
            {name: 'invalid array - null', inList: null, delimiter:'.', expectation: ''},
            {name: 'invalid array - empty', inList: '', delimiter:'.', expectation: ''},
            {name: 'invalid array - string', inList: '1,2,3', delimiter:'.', expectation: ''},
            {name: 'invalid array - number', inList: 5, delimiter:'.', expectation: ''},
            {name: 'invalid array - boolean', inList: true, delimiter:'.', expectation: ''},
            {name: 'invalid array - undefined', inList: undefined, delimiter:'.', expectation: ''}
        ];
        testCases.forEach(function(testCase) {
            it(testCase.name, function() {
                assert.equal(stringUtils.convertListToDelimitedString(testCase.inList, testCase.delimiter), testCase.expectation);
            });
        });
    });


});
