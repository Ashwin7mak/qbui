'use strict';

var assert = require('assert');
var collectionUtils = require('../../src/utility/collectionUtils.js');

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
                assert.equal(collectionUtils.convertListToDelimitedString(testCase.inList, testCase.delimiter), testCase.expectation);
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
                assert.equal(collectionUtils.convertListToDelimitedString(testCase.inList, testCase.delimiter), testCase.expectation);
            });
        });
    });

    describe('verify contains function', function() {
        var testCases = [
            {name: 'invalid array - null', inList: null, obj:'test', expectation: false},
            {name: 'invalid array - string', inList: 'bad array', obj:'test', expectation: false},
            {name: 'array is empty', inList: [], obj:'test', expectation: false},
            {name: 'object not found in list', inList: ['1', '2', '3'], obj:'5', expectation: false},
            {name: 'object is found in list', inList: ['1', '2', '3'], obj:'1', expectation: true},
            {name: 'object is found in list multiple times', inList: ['3', '1', '1'], obj:'1', expectation: true},
            {name: 'null object is found in list', inList: ['3', null, '1'], obj:null, expectation: true},
            {name: 'null object is not found in list', inList: ['3', '2', '1'], obj:null, expectation: false}
        ];
        testCases.forEach(function(testCase) {
            it(testCase.name, function() {
                assert.equal(collectionUtils.contains(testCase.inList, testCase.obj), testCase.expectation);
            });
        });
    });


});
