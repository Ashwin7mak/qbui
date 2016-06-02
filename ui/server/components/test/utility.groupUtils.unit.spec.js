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

    //  Return random number where min <= randomNumber < max
    function getRandomNumber(min, max, scale) {
        var num;
        if (min < max) {
            if (scale === undefined || scale ===  null) {
                scale = Math.floor(Math.random() * (5 - 0));
            }
            num = Math.random() * ((max - 1 / Math.pow(10, scale)) - min) + min;
        } else {
            num = min;
        }

        if (scale === 0) {
            return Math.floor(num);
        } else {
            //  possible parsed number could get rounded up to the max
            var parsedNumber = Number.parseFloat(num.toFixed(scale));
            if (Number.parseFloat(parsedNumber) >= max) {
                return num;
            }
        }
        return Number.parseFloat(num.toFixed(scale));
    }

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
            //testCases.push({name: 'mismatched date format', displayDate: '2015-05-20', displayFormat: 'MM-DD-YYYY', expectation: emptyVal});
            //testCases.push({name: 'invalid format', displayDate: '2015-05-20', displayFormat: 'blah', expectation: emptyVal});

            // NOTE: this test throws a deprecation warning..see https://github.com/moment/moment/issues/1407 for more info.
            // In summary, the parser currently parses the bad input successfully...but future releases will not.  In either
            // case, the isValid() test we execute against the parsed date returns false for both implementations, which
            // is the behavior we want.  Once the new code is released, their will be no deprecation warning and the test
            // should continue to pass.
            //testCases.push({name: 'invalid date', displayDate: 'blah', displayFormat: 'MM-DD-YYYY', expectation: emptyVal});
        }
        return testCases;
    }

    describe('validate random number generator', function() {

        var testRuns = 1000000; // 1 million
        var testFail = false;

        var min = 75;
        var max = 76;
        var randomNum;

        //  run this outside of the 'it test block'; otherwise susceptible to timeout error
        for (var x = 0; x < testRuns; x++) {
            randomNum = getRandomNumber(min, max);
            if (randomNum < min || randomNum >= max) {
                testFail = true;
            }
        }

        //  test to ensure random number generator works as expected.
        it('Number of test runs: ' + testRuns, function() {
            if (testFail) {
                assert.fail(n, '75 <= n < 80', 'random number generator out of range');
            } else {
                assert.ok(true, 'random number generator tested ' + testRuns + ' runs.');
            }
        });

    });

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

        describe('validate numeric fractions - thousandth fractional tests', function() {

            var testCases = [];
            var testScale = 4;

            testCases.push({name: 'thousandth (76.12345)', input:76.12345, expectation:'76.1230' + groupTypes.delimiter + '76.1240'});
            testCases.push({name: 'thousandth (76.1234)', input:76.1234, expectation:'76.1230' + groupTypes.delimiter + '76.1240'});
            testCases.push({name: 'thousandth (76.123)', input:76.123, expectation:'76.1230' + groupTypes.delimiter + '76.1240'});
            testCases.push({name: 'thousandth (76.12)', input:76.12, expectation:'76.1200' + groupTypes.delimiter + '76.1210'});
            testCases.push({name: 'thousandth (76.1)', input:76.1, expectation:'76.1000' + groupTypes.delimiter + '76.1010'});
            testCases.push({name: 'thousandth (76)', input:76, expectation:'76.0000' + groupTypes.delimiter + '76.0010'});
            testCases.push({name: 'thousandth (.76)', input:.76, expectation:'0.7600' + groupTypes.delimiter + '0.7610'});
            testCases.push({name: 'thousandth (-.76)', input:-.76, expectation:'-0.7600' + groupTypes.delimiter + '-0.7590'});
            testCases.push({name: 'thousandth (-76)', input:-76, expectation:'-76.0000' + groupTypes.delimiter + '-75.9990'});
            testCases.push({name: 'thousandth (-76.1)', input:-76.1, expectation:'-76.1000' + groupTypes.delimiter + '-76.0990'});
            testCases.push({name: 'thousandth (-76.12)', input:-76.12, expectation:'-76.1200' + groupTypes.delimiter + '-76.1190'});
            testCases.push({name: 'thousandth (-76.123)', input:-76.123, expectation:'-76.1230' + groupTypes.delimiter + '-76.1220'});
            testCases.push({name: 'thousandth (-76.1234)', input:-76.1234, expectation:'-76.1240' + groupTypes.delimiter + '-76.1230'});
            testCases.push({name: 'thousandth (-76.12345)', input:-76.12345, expectation:'-76.1240' + groupTypes.delimiter + '-76.1230'});

            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.deepEqual(groupUtils.getRangeFraction(test.input, testScale), test.expectation);
                });
            });
        });

        describe('validate numeric fractions - hundredth fractional tests', function() {

            var testCases = [];
            var testScale = 3;

            testCases.push({name: 'hundredth (76.12345)', input:76.12345, expectation:'76.120' + groupTypes.delimiter + '76.130'});
            testCases.push({name: 'hundredth (76.1234)', input:76.1234, expectation:'76.120' + groupTypes.delimiter + '76.130'});
            testCases.push({name: 'hundredth (76.123)', input:76.123, expectation:'76.120' + groupTypes.delimiter + '76.130'});
            testCases.push({name: 'hundredth (76.12)', input:76.12, expectation:'76.120' + groupTypes.delimiter + '76.130'});
            testCases.push({name: 'hundredth (76.1)', input:76.1, expectation:'76.100' + groupTypes.delimiter + '76.110'});
            testCases.push({name: 'hundredth (76)', input:76, expectation:'76.000' + groupTypes.delimiter + '76.010'});
            testCases.push({name: 'hundredth (.76)', input:.76, expectation:'0.760' + groupTypes.delimiter + '0.770'});
            testCases.push({name: 'hundredth (-.76)', input:-.76, expectation:'-0.760' + groupTypes.delimiter + '-0.750'});
            testCases.push({name: 'hundredth (-76)', input:-76, expectation:'-76.000' + groupTypes.delimiter + '-75.990'});
            testCases.push({name: 'hundredth (-76.1)', input:-76.1, expectation:'-76.100' + groupTypes.delimiter + '-76.090'});
            testCases.push({name: 'hundredth (-76.12)', input:-76.12, expectation:'-76.120' + groupTypes.delimiter + '-76.110'});
            testCases.push({name: 'hundredth (-76.123)', input:-76.123, expectation:'-76.130' + groupTypes.delimiter + '-76.120'});
            testCases.push({name: 'hundredth (-76.1234)', input:-76.1234, expectation:'-76.130' + groupTypes.delimiter + '-76.120'});
            testCases.push({name: 'hundredth (-76.12345)', input:-76.12345, expectation:'-76.130' + groupTypes.delimiter + '-76.120'});

            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.deepEqual(groupUtils.getRangeFraction(test.input, testScale), test.expectation);
                });
            });
        });

        describe('validate numeric fractions - tens fractional tests', function() {

            var testCases = [];
            var testScale = 2;

            testCases.push({name: 'tens (76.12345)', input:76.12345, expectation:'76.10' + groupTypes.delimiter + '76.20'});
            testCases.push({name: 'tens (76.1234)', input:76.1234, expectation:'76.10' + groupTypes.delimiter + '76.20'});
            testCases.push({name: 'tens (76.123)', input:76.123, expectation:'76.10' + groupTypes.delimiter + '76.20'});
            testCases.push({name: 'tens (76.12)', input:76.12, expectation:'76.10' + groupTypes.delimiter + '76.20'});
            testCases.push({name: 'tens (76.1)', input:76.1, expectation:'76.10' + groupTypes.delimiter + '76.20'});
            testCases.push({name: 'tens (76)', input:76, expectation:'76.00' + groupTypes.delimiter + '76.10'});
            testCases.push({name: 'tens (.76)', input:.76, expectation:'0.70' + groupTypes.delimiter + '0.80'});
            testCases.push({name: 'tens (-.76)', input:-.76, expectation:'-0.80' + groupTypes.delimiter + '-0.70'});
            testCases.push({name: 'tens (-76)', input:-76, expectation:'-76.00' + groupTypes.delimiter + '-75.90'});
            testCases.push({name: 'tens (-76.1)', input:-76.1, expectation:'-76.10' + groupTypes.delimiter + '-76.00'});
            testCases.push({name: 'tens (-76.12)', input:-76.12, expectation:'-76.20' + groupTypes.delimiter + '-76.10'});
            testCases.push({name: 'tens (-76.123)', input:-76.123, expectation:'-76.20' + groupTypes.delimiter + '-76.10'});
            testCases.push({name: 'tens (-76.1234)', input:-76.1234, expectation:'-76.20' + groupTypes.delimiter + '-76.10'});
            testCases.push({name: 'tens (-76.12345)', input:-76.12345, expectation:'-76.20' + groupTypes.delimiter + '-76.10'});

            testCases.forEach(function(test) {
                it('Test case: ' + test.name + ':' + test.input, function() {
                    assert.deepEqual(groupUtils.getRangeFraction(test.input, testScale), test.expectation);
                });
            });
        });

        describe('validate numeric fractions - ones tests', function() {

            var testCases = [];
            var testScale = 1;

            for (var idx = 1; idx < 5; idx++) {
                var lowerBound = getRandomNumber(-100, 100, 0);  // generate random number between 0 and 100
                var upperBound = lowerBound + 1;
                testCases.push({
                    name: 'ones scale ' + idx,
                    input: getRandomNumber(lowerBound, upperBound, idx),
                    expectation: lowerBound.toString() + groupTypes.delimiter + upperBound.toString()}
                );
            }

            testCases.push({name: 'ones pos fraction', input:getRandomNumber(0, 1, 2), expectation:'0' + groupTypes.delimiter + '1'});
            testCases.push({name: 'ones neg fraction', input:getRandomNumber(-1, 0, 2), expectation:'-1' + groupTypes.delimiter + '0'});

            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.deepEqual(groupUtils.getRangeFraction(test.input, testScale), test.expectation);
                    assert.deepEqual(groupUtils.getRangeWhole(test.input, testScale), test.expectation);
                });
            });
        });

        describe('validate numeric fractions - negative fractional tests', function() {

            var testCases = [];

            testCases.push({name: 'null input', input:null, scale:1, expectation:''});
            testCases.push({name: 'non-number input', input:'', scale:1, expectation:''});
            testCases.push({name: 'null scale', input:76.1, scale:null, expectation:''});
            testCases.push({name: 'non-number scale', input:76.1, scale:'', expectation:''});

            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.deepEqual(groupUtils.getRangeFraction(test.input, test.scale), test.expectation);
                });
            });
        });

        describe('validate numeric fractions - positive value range tests', function() {

            var testCases = [];

            testCases.push({name: 'five (pos)', input:getRandomNumber(75, 80), factor:5, expectation:'75' + groupTypes.delimiter + '80'});
            testCases.push({name: 'ten (pos)', input:getRandomNumber(70, 80), factor:10, expectation:'70' + groupTypes.delimiter + '80'});
            testCases.push({name: 'hundred (pos)', input:getRandomNumber(0, 100), factor:100, expectation:'0' + groupTypes.delimiter + '100'});
            testCases.push({name: 'thousand (pos)', input:getRandomNumber(0, 1000), factor:1000, expectation:'0' + groupTypes.delimiter + '1000'});
            testCases.push({name: '10Thousand (pos)', input:getRandomNumber(0, 10000), factor:10000, expectation:'0' + groupTypes.delimiter + '10000'});
            testCases.push({name: '100Thousand (pos)', input:getRandomNumber(0, 100000), factor:100000, expectation:'0' + groupTypes.delimiter + '100000'});
            testCases.push({name: 'million (pos)', input:getRandomNumber(0, 1000000), factor:1000000, expectation:'0' + groupTypes.delimiter + '1000000'});
            testCases.push({name: 'five (neg)', input:getRandomNumber(-80, -75), factor:5, expectation:'-80' + groupTypes.delimiter + '-75'});
            testCases.push({name: 'ten (neg)', input:getRandomNumber(-80, -70), factor:10, expectation:'-80' + groupTypes.delimiter + '-70'});
            testCases.push({name: 'hundred (neg)', input:getRandomNumber(-100, -1), factor:100, expectation:'-100' + groupTypes.delimiter + '0'});
            testCases.push({name: 'thousand (neg)', input:getRandomNumber(-1000, -1), factor:1000, expectation:'-1000' + groupTypes.delimiter + '0'});
            testCases.push({name: '10Thousand (neg)', input:getRandomNumber(-10000, -1), factor:10000, expectation:'-10000' + groupTypes.delimiter + '0'});
            testCases.push({name: '100Thousand (neg)', input:getRandomNumber(-100000, -1), factor:100000, expectation:'-100000' + groupTypes.delimiter + '0'});
            testCases.push({name: 'million (neg)', input:getRandomNumber(-1000000, -1), factor:1000000, expectation:'-1000000' + groupTypes.delimiter + '0'});

            testCases.forEach(function(test) {
                it('Test case: ' + test.name + ': ' + test.input, function() {
                    assert.deepEqual(groupUtils.getRangeWhole(test.input, test.factor), test.expectation);
                });
            });
        });

        describe('validate numeric fractions - negative whole tests', function() {

            var testCases = [];

            testCases.push({name: 'null input', input:null, factor:5, expectation:''});
            testCases.push({name: 'non-number input', input:'', factor:5, expectation:''});
            testCases.push({name: 'null factor', input:76.1, factor:null, expectation:''});
            testCases.push({name: 'non-number factor', input:76.1, factor:'', expectation:''});

            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.deepEqual(groupUtils.getRangeWhole(test.input, test.factor), test.expectation);
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
                    assert.equal(month, test.testDate.expectation.month + groupTypes.delimiter + test.testDate.expectation.year);
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
                    assert.equal(quarter, test.testDate.expectation.qtr + groupTypes.delimiter + test.testDate.expectation.year);
                });
            });
        });

        describe('validate getFiscalQuarter', function() {
            //  positive test cases
            var testCases = generateDateGroupingTestCases(true);
            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    var quarter = groupUtils.getFiscalQuarter(test.displayDate, test.momentFormat);
                    assert.equal(quarter, test.testDate.expectation.qtr + groupTypes.delimiter + test.testDate.expectation.year);
                });
            });
        });

        describe('validate getFiscalYear', function() {
            //  positive test cases
            var testCases = generateDateGroupingTestCases(true);
            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    var year = groupUtils.getFiscalYear(test.displayDate, test.momentFormat);
                    assert.equal(year, test.testDate.expectation.year + '');
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

        describe('validate getEmailName tests', function() {
            var testCases = [
                {name: 'valid email address1', emailAddress: 'johnSmith@test.com', expectation: 'johnSmith'},
                {name: 'valid email address3', emailAddress: 'john.smith@test.ma.com', expectation: 'john.smith'},
                {name: 'valid email address2', emailAddress: 'johnsmith@com', expectation: 'johnsmith'},
                {name: 'empty email address', emailAddress: '', expectation: ''},
                {name: 'null email address', emailAddress: null, expectation: ''},
                {name: 'invalid email address - numeric input', emailAddress: 12345, expectation: ''},
                {name: 'invalid email address - invalid object', emailAddress: new Date(), expectation: ''},
                {name: 'invalid email address - invalid format', emailAddress: 'johnsmith@johnSmith@test.com', expectation: ''},
                {name: 'invalid email address - invalid format2', emailAddress: 'johnsmith.com', expectation: ''}
            ];

            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.getEmailName(test.emailAddress), test.expectation);
                });
            });
        });

        describe('validate getEmailDomain tests', function() {
            var testCases = [
                {name: 'valid email address1', emailAddress: 'johnSmith@test.com', expectation: 'test.com'},
                {name: 'valid email address3', emailAddress: 'john.smith@test.ma.com', expectation: 'test.ma.com'},
                {name: 'valid email address2', emailAddress: 'johnsmith@com', expectation: 'com'},
                {name: 'empty email address', emailAddress: '', expectation: ''},
                {name: 'null email address', emailAddress: null, expectation: ''},
                {name: 'invalid email address - numeric input', emailAddress: 12345, expectation: ''},
                {name: 'invalid email address - invalid object', emailAddress: new Date(), expectation: ''},
                {name: 'invalid email address - invalid format', emailAddress: 'johnsmith@johnSmith@test.com', expectation: ''},
                {name: 'invalid email address - invalid format2', emailAddress: 'johnsmith.com', expectation: ''}
            ];

            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.getEmailDomain(test.emailAddress), test.expectation);
                });
            });
        });

        describe('validate getEmailDomainTopLevel tests', function() {
            var testCases = [
                {name: 'valid email address1', emailAddress: 'johnSmith@test.com', expectation: 'com'},
                {name: 'valid email address3', emailAddress: 'john.smith@test.ma.com', expectation: 'com'},
                {name: 'valid email address2', emailAddress: 'johnsmith@com', expectation: 'com'},
                {name: 'empty email address', emailAddress: '', expectation: ''},
                {name: 'null email address', emailAddress: null, expectation: ''},
                {name: 'invalid email address - numeric input', emailAddress: 12345, expectation: ''},
                {name: 'invalid email address - invalid object', emailAddress: new Date(), expectation: ''},
                {name: 'invalid email address - invalid format', emailAddress: 'johnsmith@johnSmith@test.com', expectation: ''},
                {name: 'invalid email address - invalid format2', emailAddress: 'johnsmith.com', expectation: ''}
            ];

            testCases.forEach(function(test) {
                it('Test case: ' + test.name, function() {
                    assert.equal(groupUtils.getEmailDomainTopLevel(test.emailAddress), test.expectation);
                });
            });
        });

        describe('duration tests', function() {
            var testCases = [
                {name: 'null input', duration: null, expectation: ''},
                {name: 'string input', duration: 'something', expectation: ''},
                {name: '-3', duration: -3, expectation: -3},
                {name: '-2.5', duration: -2.5, expectation: -3},
                {name: '0.5', duration: 0.5, expectation: 0},
                {name: '1', duration: 1, expectation: 1},
                {name: '10', duration: 10, expectation: 10},
                {name: '10.75', duration: 10.75, expectation: 10},
                {name: '30', duration: 30, expectation: 30}
            ];

            describe('validate duration second tests', function() {
                testCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        var duration = typeof test.duration === 'number' ? constants.MILLI.ONE_SECOND * test.duration : test.duration;
                        var expectation = test.expectation;
                        assert.equal(groupUtils.getDurationInSeconds(duration), expectation);
                    });
                });
            });

            describe('validate duration minute tests', function() {
                testCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        var duration = typeof test.duration === 'number' ? constants.MILLI.ONE_MINUTE * test.duration : test.duration;
                        var expectation = test.expectation;
                        assert.equal(groupUtils.getDurationInMinutes(duration), expectation);
                    });
                });
            });

            describe('validate duration hour tests', function() {
                testCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        var duration = typeof test.duration === 'number' ? constants.MILLI.ONE_HOUR * test.duration : test.duration;
                        var expectation = test.expectation;
                        assert.equal(groupUtils.getDurationInHours(duration), expectation);
                    });
                });
            });

            describe('validate duration day tests', function() {
                testCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        var duration = typeof test.duration === 'number' ? constants.MILLI.ONE_DAY * test.duration : test.duration;
                        var expectation = test.expectation;
                        assert.equal(groupUtils.getDurationInDays(duration), expectation);
                    });
                });
            });

            describe('validate duration week tests', function() {
                testCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        var duration = typeof test.duration === 'number' ? constants.MILLI.ONE_WEEK * test.duration : test.duration;
                        var expectation = test.expectation;
                        assert.equal(groupUtils.getDurationInWeeks(duration), expectation);
                    });
                });
            });

            describe('validate duration equals tests', function() {

                var equalTestCases = [
                    {name: 'null input', duration: null, expectation: ''},
                    {name: 'string input', duration: 'something', expectation: ''},

                    {name: 'second', duration: constants.MILLI.ONE_SECOND, expectation: '1' + groupTypes.delimiter + groupTypes.DURATION.second},
                    {name: 'seconds', duration: constants.MILLI.ONE_SECOND * 55, expectation: '55' + groupTypes.delimiter + groupTypes.DURATION.second},
                    {name: 'second negative', duration: constants.MILLI.ONE_SECOND * -1, expectation: '-1' + groupTypes.delimiter + groupTypes.DURATION.second},
                    {name: 'seconds negative', duration: constants.MILLI.ONE_SECOND * -55, expectation: '-55' + groupTypes.delimiter + groupTypes.DURATION.second},

                    {name: 'minute', duration: constants.MILLI.ONE_MINUTE, expectation: '1' + groupTypes.delimiter + groupTypes.DURATION.minute},
                    {name: 'minutes', duration: constants.MILLI.ONE_MINUTE * 5, expectation: '5' + groupTypes.delimiter + groupTypes.DURATION.minute},
                    {name: 'minutes2', duration: (constants.MILLI.ONE_MINUTE * 5) + (constants.MILLI.ONE_SECOND * 30), expectation: '5.5' + groupTypes.delimiter + groupTypes.DURATION.minute},
                    {name: 'minute negative', duration: constants.MILLI.ONE_MINUTE * -1, expectation: '-1' + groupTypes.delimiter + groupTypes.DURATION.minute},
                    {name: 'minutes negative', duration: constants.MILLI.ONE_MINUTE * -5, expectation: '-5' + groupTypes.delimiter + groupTypes.DURATION.minute},

                    {name: 'hour', duration: constants.MILLI.ONE_HOUR, expectation: '1' + groupTypes.delimiter + groupTypes.DURATION.hour},
                    {name: 'hours', duration: constants.MILLI.ONE_HOUR * 4, expectation: '4' + groupTypes.delimiter + groupTypes.DURATION.hour},
                    {name: 'hours2', duration: (constants.MILLI.ONE_HOUR * 4) + (constants.MILLI.ONE_MINUTE * 15), expectation: '4.25' + groupTypes.delimiter + groupTypes.DURATION.hour},
                    {name: 'hour negative', duration: constants.MILLI.ONE_HOUR * -1, expectation: '-1' + groupTypes.delimiter + groupTypes.DURATION.hour},
                    {name: 'hours negative', duration: constants.MILLI.ONE_HOUR * -4, expectation: '-4' + groupTypes.delimiter + groupTypes.DURATION.hour},

                    {name: 'day', duration: constants.MILLI.ONE_DAY, expectation: '1' + groupTypes.delimiter + groupTypes.DURATION.day},
                    {name: 'days', duration: constants.MILLI.ONE_DAY * 3, expectation: '3' + groupTypes.delimiter + groupTypes.DURATION.day},
                    {name: 'days2', duration: (constants.MILLI.ONE_DAY * 3) + (constants.MILLI.ONE_HOUR * 18), expectation: '3.75' + groupTypes.delimiter + groupTypes.DURATION.day},
                    {name: 'day negative', duration: constants.MILLI.ONE_DAY * -1, expectation: '-1' + groupTypes.delimiter + groupTypes.DURATION.day},
                    {name: 'days negative', duration: constants.MILLI.ONE_DAY * -3, expectation: '-3' + groupTypes.delimiter + groupTypes.DURATION.day},

                    {name: 'week', duration: (constants.MILLI.ONE_WEEK), expectation: '1' + groupTypes.delimiter + groupTypes.DURATION.week},
                    {name: 'weeks', duration: (constants.MILLI.ONE_WEEK * 10), expectation: '10' + groupTypes.delimiter + groupTypes.DURATION.week},
                    {name: 'week negative', duration: (constants.MILLI.ONE_WEEK) * -1, expectation: '-1' + groupTypes.delimiter + groupTypes.DURATION.week},
                    {name: 'weeks negative', duration: (constants.MILLI.ONE_WEEK * -10), expectation: '-10' + groupTypes.delimiter + groupTypes.DURATION.week}
                ];

                equalTestCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        assert.equal(groupUtils.getDurationEquals(test.duration), test.expectation);
                    });
                });
            });

        });

        //1464879417 --> jun 02 2016 10:56:57 AM  GMT-0400 (EDT)
        //1464889938 --> jun 02 2016 01:52:18 PM  GMT-0400 (EDT)
        describe('time of day tests', function() {
            var testCases = [
                {name: 'null input', timeOfDay: null, second:'', minute:'', hour:'', am_pm:''},
                {name: 'invalid input', timeOfDay: 'bad input', second:'', minute:'', hour:'', am_pm:''},
                {name: 'AM time - numeric', timeOfDay: 1464879417, second:'1464879417', minute:'1464879360', hour:'1464876000', am_pm:'1464840000'},
                {name: 'PM time - string', timeOfDay: '1464889938', second:'1464889938', minute:'1464889920', hour:'1464886800', am_pm:'1464926399'}
            ];

            describe('validate time of day second tests', function() {
                testCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        assert.equal(groupUtils.getBySecond(test.timeOfDay), test.second);
                    });
                });
            });

            describe('validate time of day minute tests', function() {
                testCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        assert.equal(groupUtils.getByMinute(test.timeOfDay), test.minute);
                    });
                });
            });

            describe('validate time of day hour tests', function() {
                testCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        assert.equal(groupUtils.getByHour(test.timeOfDay), test.hour);
                    });
                });
            });

            describe('validate time of day AmPm tests', function() {
                testCases.forEach(function(test) {
                    it('Test case: ' + test.name, function() {
                        assert.equal(groupUtils.getByAmPm(test.timeOfDay), test.am_pm);
                    });
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

        describe('validate TIME_OF_DAY group types', function() {
            var validGroupTypeTestCases = [
                {name: 'timeOfDay equals', dataType: constants.TIME_OF_DAY, groupType: groupTypes.TIME_OF_DAY.equals, expectation: true},
                {name: 'timeOfDay second', dataType: constants.TIME_OF_DAY, groupType: groupTypes.TIME_OF_DAY.second, expectation: true},
                {name: 'timeOfDay minute', dataType: constants.TIME_OF_DAY, groupType: groupTypes.TIME_OF_DAY.minute, expectation: true},
                {name: 'timeOfDay hour', dataType: constants.TIME_OF_DAY, groupType: groupTypes.TIME_OF_DAY.hour, expectation: true},
                {name: 'timeOfDay week', dataType: constants.TIME_OF_DAY, groupType: groupTypes.TIME_OF_DAY.am_pm, expectation: true}
            ];
            var invalidGroupTypeTestCases = [
                {name: 'timeOfDay missing group type', dataType: constants.TIME_OF_DAY, groupType: null, expectation: false},
                {name: 'timeOfDay empty group type', dataType: constants.TIME_OF_DAY, groupType: '', expectation: false},
                {name: 'timeOfDay invalid group type', dataType: constants.TIME_OF_DAY, groupType: groupTypes.TEXT.firstLetter, expectation: false}
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
                {name: 'email name', dataType: constants.EMAIL_ADDRESS, groupType: groupTypes.EMAIL_ADDRESS.equals, expectation: true},
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
