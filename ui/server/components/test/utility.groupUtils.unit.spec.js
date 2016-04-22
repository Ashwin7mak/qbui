'use strict';

var should = require('should');
var assert = require('assert');
var groupUtils = require('../utility/groupUtils.js');
var groupTypes = require('../../api/groupTypes');
var constants = require('../../api/constants');
var dateTimeFormatter = require('../../api/quickbase/formatter/dateTimeFormatter');
var moment = require('moment');
/**
 * Unit tests for Group Utility functions
 */
describe('Validate Group Utility functions', function() {

    function generateDateGroupingTestCases(positiveTests) {

        var testCases = [];

        if (positiveTests) {
            var testDates = [
                {day: 'Sun', date: '02-28-2016', expectation:{week:'02-22-2016', month:'Feb', year:2016, qtr:1, decade:2010}},
                {day: 'Mon', date: '02-29-2016', expectation:{week:'02-29-2016', month:'Feb', year:2016, qtr:1, decade:2010}},
                {day: 'Tue', date: '03-01-2016', expectation:{week:'02-29-2016', month:'Mar', year:2016, qtr:1, decade:2010}},
                {day: 'Tue', date: '04-05-2016', expectation:{week:'04-04-2016', month:'Apr', year:2016, qtr:2, decade:2010}},
                {day: 'Wed', date: '12-31-2008', expectation:{week:'12-29-2008', month:'Dec', year:2008, qtr:4, decade:2000}},
                {day: 'Thu', date: '01-01-2009', expectation:{week:'12-29-2008', month:'Jan', year:2009, qtr:1, decade:2000}},
                {day: 'Fri', date: '01-01-2010', expectation:{week:'12-28-2009', month:'Jan', year:2010, qtr:1, decade:2010}},
                {day: 'Sat', date: '01-09-2010', expectation:{week:'01-04-2010', month:'Jan', year:2010, qtr:1, decade:2010}}
            ];

            var obj = dateTimeFormatter.getJavaToJavaScriptDateFormats();
            var dateFormatKeys = Object.keys(obj);

            dateFormatKeys.forEach(function(dateFormatKey) {
                //  get one of the supported date formats
                var dateFormat = obj[dateFormatKey];

                //  generate a test for each day/format combination
                testDates.forEach(function(testDate) {
                    var formattedDate = moment(testDate.date, 'MM-DD-YYYY').format(dateFormat);

                    //  build a test case for each possible date format using the random date
                    testCases.push({
                        name: formattedDate + '(' + dateFormat + ')',
                        testDate: testDate,
                        displayDate: formattedDate,
                        displayFormat: dateFormatKey,
                        momentFormat: obj[dateFormatKey]
                    });
                });
            });
        } else {
            let emptyVal = '';
            testCases.push({name: 'empty date', displayDate: '', displayFormat: 'MM-DD-YYYY', expectation: emptyVal});
            testCases.push({name: 'null date', displayDate: null, displayFormat: 'MM-DD-YYYY', expectation: emptyVal});
            testCases.push({name: 'mismatched date format', displayDate: '2015-05-20', displayFormat: 'MM-DD-YYYY', expectation: emptyVal});
            testCases.push({name: 'invalid format', displayDate: '2015-05-20', displayFormat: 'blah', expectation: emptyVal});

            // NOTE: this test throws a deprecation warning..see https://github.com/moment/moment/issues/1407 for more info.
            // In summary, the parser currently parses the bad input successfully...but future releases will not.  In either
            // case, the isValid() test we execute against the parsed date returns false for both implementations, which
            // is the behavior we want.  Once the new code is released, their will be no deprecation warning and the test
            // should continue to pass.
            testCases.push({name: 'invalid date', displayDate: 'blah', displayFormat: 'MM-DD-YYYY', expectation: emptyVal});
        }
        return testCases;
    }

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

        describe('validate getFirstDayOfWeek', function() {
            //  negative test cases
            var testCases = generateDateGroupingTestCases(true);
            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    var mondayDate = groupUtils.getFirstDayOfWeek(test.displayDate, test.momentFormat);
                    assert.equal(mondayDate, moment(test.testDate.expectation.week, 'MM-DD-YYYY').format(test.momentFormat));
                });
            });
        });

        describe('validate getMonth', function() {
            //  positive test cases
            var testCases = generateDateGroupingTestCases(true);
            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    var month = groupUtils.getMonth(test.displayDate, test.momentFormat);
                    assert.equal(month, test.testDate.expectation.month + ' ' + test.testDate.expectation.year);
                });
            });
        });

        describe('validate getYear', function() {
            //  positive test cases
            var testCases = generateDateGroupingTestCases(true);
            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    var year = groupUtils.getYear(test.displayDate, test.momentFormat);
                    assert.equal(year, test.testDate.expectation.year);
                });
            });
        });

        describe('validate getQuarter', function() {
            //  positive test cases
            var testCases = generateDateGroupingTestCases(true);
            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    var quarter = groupUtils.getQuarter(test.displayDate, test.momentFormat);
                    assert.equal(quarter, constants.GROUPING.QUARTER + test.testDate.expectation.qtr + ' ' + test.testDate.expectation.year);
                });
            });
        });

        describe('validate getFiscalQuarter', function() {
            //  positive test cases
            var testCases = generateDateGroupingTestCases(true);
            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    var quarter = groupUtils.getFiscalQuarter(test.displayDate, test.momentFormat);
                    assert.equal(quarter, constants.GROUPING.QUARTER + test.testDate.expectation.qtr + ' ' + constants.GROUPING.FISCAL_YR + test.testDate.expectation.year);
                });
            });
        });

        describe('validate getFiscalYear', function() {
            //  positive test cases
            var testCases = generateDateGroupingTestCases(true);
            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    var year = groupUtils.getFiscalYear(test.displayDate, test.momentFormat);
                    assert.equal(year, constants.GROUPING.FISCAL_YR + test.testDate.expectation.year);
                });
            });
        });

        describe('validate getDecade', function() {
            //  positive test cases
            var testCases = generateDateGroupingTestCases(true);
            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    var decade = groupUtils.getDecade(test.displayDate, test.momentFormat);
                    assert.equal(decade, test.testDate.expectation.decade + '');
                });
            });
        });

        describe('validate negative test cases against date functions', function() {
            //  negative test cases against all of the implemented date functions
            var testCases = generateDateGroupingTestCases(false);
            testCases.forEach(function(test) {
                var results = [];
                it('Test case: ' + test.name, function() {
                    results.push(groupUtils.getFirstDayOfWeek(test.displayDate, test.momentFormat));
                    results.push(groupUtils.getMonth(test.displayDate, test.momentFormat));
                    results.push(groupUtils.getYear(test.displayDate, test.momentFormat));
                    results.push(groupUtils.getQuarter(test.displayDate, test.momentFormat));
                    results.push(groupUtils.getFiscalQuarter(test.displayDate, test.momentFormat));
                    results.push(groupUtils.getFiscalYear(test.displayDate, test.momentFormat));
                    results.push(groupUtils.getDecade(test.displayDate, test.momentFormat));

                    results.forEach(function(result) {
                        assert.equal(result, test.expectation);
                    });
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

        describe('validate DateTime group types', function() {
            var validGroupTypeTestCases = [
                {name: 'dateTime equals', dataType: constants.DATE_TIME, groupType: groupTypes.DATE.equals, expectation: true},
                {name: 'dateTime day', dataType: constants.DATE_TIME, groupType: groupTypes.DATE.day, expectation: true},
                {name: 'dateTime week', dataType: constants.DATE_TIME, groupType: groupTypes.DATE.week, expectation: true},
                {name: 'dateTime month', dataType: constants.DATE_TIME, groupType: groupTypes.DATE.month, expectation: true},
                {name: 'dateTime year', dataType: constants.DATE_TIME, groupType: groupTypes.DATE.year, expectation: true},
                {name: 'dateTime query', dataType: constants.DATE_TIME, groupType: groupTypes.DATE.quarter, expectation: true},
                {name: 'dateTime fiscal quarter', dataType: constants.DATE_TIME, groupType: groupTypes.DATE.fiscalQuarter, expectation: true},
                {name: 'dateTime fiscal year', dataType: constants.DATE_TIME, groupType: groupTypes.DATE.fiscalYear, expectation: true},
                {name: 'dateTime decade', dataType: constants.DATE_TIME, groupType: groupTypes.DATE.decade, expectation: true}
            ];
            var invalidGroupTypeTestCases = [
                {name: 'dateTime missing group type', dataType: constants.DATE_TIME, groupType: null, expectation: false},
                {name: 'dateTime empty group type', dataType: constants.DATE_TIME, groupType: '', expectation: false},
                {name: 'dateTime invalid group type', dataType: constants.DATE_TIME, groupType: groupTypes.TEXT.firstLetter, expectation: false}
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
                {name: 'email domain', dataType: constants.EMAIL_ADDRESS, groupType: groupTypes.EMAIL_ADDRESS.domain, expectation: true},
                {name: 'email domain_toplevel', dataType: constants.EMAIL_ADDRESS, groupType: groupTypes.EMAIL_ADDRESS.domain_topLevel, expectation: true},
                {name: 'email name', dataType: constants.EMAIL_ADDRESS, groupType: groupTypes.EMAIL_ADDRESS.name, expectation: true}
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

        describe('validate unsupported date type tests', function() {
            var unsupportedGroupTypes = [
                {name: 'CHECKBOX', dataType: constants.CHECKBOX},
                {name: 'FILE_ATTACHMENT', dataType: constants.FILE_ATTACHMENT},
                {name: 'PHONE_NUMBER', dataType: constants.PHONE_NUMBER},
                {name: 'TIME_OF_DAY', dataType: constants.TIME_OF_DAY},
                {name: 'URL', dataType: constants.URL}
            ];

            unsupportedGroupTypes.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.isValidGroupType(test.dataType, groupTypes.TEXT.equals), false);
                });
            });
        });

    });


});
