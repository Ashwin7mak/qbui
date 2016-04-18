'use strict';

var should = require('should');
var assert = require('assert');
var groupUtils = require('../utility/groupUtils.js');
var groupTypes = require('../../api/groupTypes');
var constants = require('../../api/constants');
/**
 * Unit tests for Group Utility functions
 */
describe('Validate Group Utility', function() {

    describe('validate group utility functions', function() {

        describe('validate get first word', function() {
            var obj = {one:'one'};
            var firstWordTestCases = [
                {name: 'empty content', content: '', expectation: ''},
                {name: 'null content', content: null, expectation: null},
                {name: 'invalid object', content: obj, expectation: obj},
                {name: 'boolean object', content: false, expectation: false},
                {name: 'single word content', content: 'one', expectation: 'one'},
                {name: 'multi word content', content: 'one two three', expectation: 'one'}

            ];

            firstWordTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.getFirstWord(test.content), test.expectation);
                });
            });
        });

        describe('validate get first letter', function() {
            var obj = {one:'one'};
            var firstWordTestCases = [
                {name: 'empty content', content: '', expectation: ''},
                {name: 'null content', content: null, expectation: null},
                {name: 'invalid object', content: obj, expectation: obj},
                {name: 'boolean object', content: false, expectation: false},
                {name: 'single word content', content: 'one', expectation: 'o'},
                {name: 'multi word content', content: 'one two three', expectation: 'o'}

            ];

            firstWordTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.getFirstLetter(test.content), test.expectation);
                });
            });
        });

        describe('validate Date group types', function() {
            var validGroupTypeTestCases = [
                {name: 'date equals', dataType: constants.DATE, groupType: groupTypes.DATE.equals, expectation: true},
                {name: 'date day', dataType: constants.DATE, groupType: groupTypes.DATE.day, expectation: true},
                {name: 'date week', dataType: constants.DATE, groupType: groupTypes.DATE.week, expectation: true},
                {name: 'date month', dataType: constants.DATE, groupType: groupTypes.DATE.month, expectation: true},
                {name: 'date year', dataType: constants.DATE, groupType: groupTypes.DATE.year, expectation: true},
                {name: 'date query', dataType: constants.DATE, groupType: groupTypes.DATE.quarter, expectation: true},
                {name: 'date fiscal quarter', dataType: constants.DATE, groupType: groupTypes.DATE.fiscalQuarter, expectation: true},
                {name: 'date fiscal year', dataType: constants.DATE, groupType: groupTypes.DATE.fiscalYear, expectation: true},
                {name: 'date decade', dataType: constants.DATE, groupType: groupTypes.DATE.decade, expectation: true}
            ];
            var invalidGroupTypeTestCases = [
                {name: 'date missing group type', dataType: constants.DATE, groupType: null, expectation: false},
                {name: 'date empty group type', dataType: constants.DATE, groupType: '', expectation: false},
                {name: 'date invalid group type', dataType: constants.DATE, groupType: groupTypes.TEXT.firstLetter, expectation: false}
            ];
            validGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
            invalidGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
        });

        describe('validate DURATION group types', function() {
            var validGroupTypeTestCases = [
                {name: 'duration equals', dataType: constants.DURATION, groupType: groupTypes.DURATION.equals, expectation: true},
                {name: 'duration second', dataType: constants.DURATION, groupType: groupTypes.DURATION.second, expectation: true},
                {name: 'duration minute', dataType: constants.DURATION, groupType: groupTypes.DURATION.minute, expectation: true},
                {name: 'duration hour', dataType: constants.DURATION, groupType: groupTypes.DURATION.hour, expectation: true},
                {name: 'duration am_pm', dataType: constants.DURATION, groupType: groupTypes.DURATION.am_pm, expectation: true},
                {name: 'duration week', dataType: constants.DURATION, groupType: groupTypes.DURATION.week, expectation: true},
                {name: 'duration day', dataType: constants.DURATION, groupType: groupTypes.DURATION.day, expectation: true}
            ];
            var invalidGroupTypeTestCases = [
                {name: 'duration missing group type', dataType: constants.DURATION, groupType: null, expectation: false},
                {name: 'duration empty group type', dataType: constants.DURATION, groupType: '', expectation: false},
                {name: 'duration invalid group type', dataType: constants.DURATION, groupType: groupTypes.TEXT.firstLetter, expectation: false}
            ];
            validGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
            invalidGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
        });

        describe('validate EMAIL group types', function() {
            var validGroupTypeTestCases = [
                {name: 'email domain', dataType: constants.EMAIL_ADDRESS, groupType: groupTypes.EMAIL.domain, expectation: true},
                {name: 'email domain_toplevel', dataType: constants.EMAIL_ADDRESS, groupType: groupTypes.EMAIL.domain_topLevel, expectation: true},
                {name: 'email name', dataType: constants.EMAIL_ADDRESS, groupType: groupTypes.EMAIL.name, expectation: true}
            ];
            var invalidGroupTypeTestCases = [
                {name: 'email missing group type', dataType: constants.EMAIL_ADDRESS, groupType: null, expectation: false},
                {name: 'email empty group type', dataType: constants.EMAIL_ADDRESS, groupType: '', expectation: false},
                {name: 'email invalid group type', dataType: constants.EMAIL_ADDRESS, groupType: groupTypes.TEXT.firstLetter, expectation: false}
            ];
            validGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
            invalidGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
        });

        describe('validate NUMERIC group types', function() {
            var validGroupTypeTestCases = [
                {name: 'numeric equals', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.equals, expectation: true},
                {name: 'numeric range', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.range, expectation: true},
                {name: 'numeric thousandth', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.thousandth, expectation: true},
                {name: 'numeric hundredth', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.hundredth, expectation: true},
                {name: 'numeric tenth', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.tenth, expectation: true},
                {name: 'numeric one', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.one, expectation: true},
                {name: 'numeric five', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.five, expectation: true},
                {name: 'numeric ten', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.ten, expectation: true},
                {name: 'numeric hundred', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.hundred, expectation: true},
                {name: 'numeric one_k', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.one_k, expectation: true},
                {name: 'numeric ten_k', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.ten_k, expectation: true},
                {name: 'numeric hundred_k', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.hundred_k, expectation: true},
                {name: 'numeric million', dataType: constants.NUMERIC, groupType: groupTypes.NUMERIC.million, expectation: true},
            ];
            var invalidGroupTypeTestCases = [
                {name: 'numeric missing group type', dataType: constants.NUMERIC, groupType: null, expectation: false},
                {name: 'numeric empty group type', dataType: constants.NUMERIC, groupType: '', expectation: false},
                {name: 'numeric invalid group type', dataType: constants.NUMERIC, groupType: groupTypes.DATE.decade, expectation: false}
            ];
            validGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
            invalidGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
        });

        describe('validate TEXT group types', function() {
            var validGroupTypeTestCases = [
                {name: 'text equals', dataType: constants.TEXT, groupType: groupTypes.TEXT.equals, expectation: true},
                {name: 'text first letter', dataType: constants.TEXT, groupType: groupTypes.TEXT.firstLetter, expectation: true},
                {name: 'text first word', dataType: constants.TEXT, groupType: groupTypes.TEXT.firstWord, expectation: true}
            ];
            var invalidGroupTypeTestCases = [
                {name: 'text missing group type', dataType: constants.TEXT, groupType: null, expectation: false},
                {name: 'text empty group type', dataType: constants.TEXT, groupType: '', expectation: false},
                {name: 'text invalid group type', dataType: constants.TEXT, groupType: groupTypes.DATE.decade, expectation: false}
            ];
            validGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
            invalidGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
        });

        describe('validate USER group types', function() {
            var validGroupTypeTestCases = [
                {name: 'user equals', dataType: constants.USER, groupType: groupTypes.USER.equals, expectation: true},
                {name: 'user first letter', dataType: constants.USER, groupType: groupTypes.USER.firstLetter, expectation: true},
                {name: 'user first word', dataType: constants.USER, groupType: groupTypes.USER.firstWord, expectation: true}
            ];
            var invalidGroupTypeTestCases = [
                {name: 'user missing group type', dataType: constants.USER, groupType: null, expectation: false},
                {name: 'user empty group type', dataType: constants.USER, groupType: '', expectation: false},
                {name: 'user invalid group type', dataType: constants.USER, groupType: groupTypes.DATE.decade, expectation: false}
            ];
            validGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
            invalidGroupTypeTestCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, test.groupType), test.expectation);
                });
            });
        });

    });


});
