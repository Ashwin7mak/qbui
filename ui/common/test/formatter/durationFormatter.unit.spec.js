'use strict';

var assert = require('assert');
var moment = require('moment');
var _ = require('lodash');
var durationFormatter = require('../../src/formatter/durationFormatter');
var consts = require('../../src/constants');

// gen a repeatable seed for random values, so it can be reproduced
var Chance = require('chance');
var seed = new Chance().integer({min: 1, max: 1000000000});

var chance = new Chance(seed);

describe('DurationFormatter (seed ' + seed + ')', () => {

    function addAllScales(array) {
        Object.keys(consts.DURATION_CONSTS).forEach(function(scaleKey) {
            var item = {};
            var scale = consts.DURATION_CONSTS[scaleKey];
            if (typeof (scale) === 'string') {
                if (durationFormatter.hasUnitsText(scale)) {
                    var val = chance.floating({min: 0, max: 99999});
                    var ms = moment.duration(val, scale).asMilliseconds();
                    item.description = "test scale " + scale;
                    item.fieldValue = {value: ms};
                    item.fieldInfo = {scale: scale, decimalPlaces:4};
                    item.expectation = '' + val;
                    array.push(item);
                } else if (scale !== consts.DURATION_CONSTS.SMART_UNITS) {
                    var hours = chance.integer({min: 0, max: 9999});
                    var mins = chance.integer({min: 0, max: 59});
                    var secs = chance.floating({min: 0, max: 59});
                    var secDec = secs.toString().split('.')[1];
                    var secWhole = secs.toString().split('.')[0];
                    var partofSecond = secDec !== undefined ? '.' + secDec : '';
                    var durVal = moment.duration({hours, minutes: mins, seconds: secs});
                    var durms = durVal.asMilliseconds();


                    var HHMMval = `${chance.pad(hours, 2)}:${chance.pad(mins, 2)}`; //10:00
                    var MMval = `${chance.pad(hours, 2)}:${chance.pad(mins, 2)}`; //:05
                    var HHMMSSval = `${chance.pad(hours, 2)}:${chance.pad(mins, 2)}:${chance.pad(secWhole, 2)}${partofSecond}`; //10:05:23
                    var MMSSval = `${chance.pad(hours, 2)}:${chance.pad(mins, 2)}:${chance.pad(secWhole, 2)}${partofSecond}`; //:00:23

                    var testInfo = {
                        ':HH:MM': {
                            ms: durms,
                            exp: HHMMval
                        },
                        ':HH:MM:SS': {
                            ms: durms,
                            exp: HHMMSSval
                        },
                        ':MM': {
                            ms: durms,
                            exp: MMval
                        },
                        ':MM:SS': {
                            ms: durms,
                            exp: MMSSval
                        }
                    };
                    if (testInfo[scale]) {
                        item.description = "test scale " + scale;
                        item.fieldValue = {value: testInfo[scale].ms};
                        item.fieldInfo = {scale: scale, decimalPlaces:4};
                        item.expectation = testInfo[scale].exp;
                        item.input = {hours, mins, secs};
                        array.push(item);
                    }
                } else { //smartunit scale
                    var weeks = chance.floating({min: 1, max: 999999});
                    var itemWeeks = {};
                    itemWeeks.description = 'returns a smart units fieldvalue.value is ' + weeks + ' weeks ';
                    itemWeeks.fieldValue = {value: weeks * consts.DURATION_CONSTS.MILLIS_PER_WEEK};
                    itemWeeks.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS, decimalPlaces:4};
                    itemWeeks.expectation = '' + weeks + ' weeks';
                    itemWeeks.expectRaw = '' + weeks;
                    itemWeeks.expectUnits = consts.DURATION_CONSTS.WEEKS;
                    array.push(itemWeeks);

                    var days = chance.floating({min: 1, max: 6});
                    var itemDays = {};
                    itemDays.description = 'returns a smart units fieldvalue.value is ' + days + ' days ';
                    itemDays.fieldValue = {value: days * consts.DURATION_CONSTS.MILLIS_PER_DAY};
                    itemDays.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS, decimalPlaces:4};
                    itemDays.expectation = '' + days + ' days';
                    itemDays.expectRaw = '' + days;
                    itemDays.expectUnits = consts.DURATION_CONSTS.DAYS;
                    array.push(itemDays);

                    var _hours = chance.floating({min: 1, max: 23});
                    var itemHours = {};
                    itemHours.description = 'returns a smart units fieldvalue.value is ' + _hours + ' hours ';
                    itemHours.fieldValue = {value: _hours * consts.DURATION_CONSTS.MILLIS_PER_HOUR};
                    itemHours.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS, decimalPlaces:4};
                    itemHours.expectation = '' + _hours + ' hours';
                    itemHours.expectRaw = '' + _hours;
                    itemHours.expectUnits = consts.DURATION_CONSTS.HOURS;
                    array.push(itemHours);

                    var _mins = chance.floating({min: 1, max: 59});
                    var itemMinutes = {};
                    itemMinutes.description = 'returns a smart units fieldvalue.value is ' + _mins + ' mins ';
                    itemMinutes.fieldValue = {value: _mins * consts.DURATION_CONSTS.MILLIS_PER_MIN};
                    itemMinutes.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS, decimalPlaces:4};
                    itemMinutes.expectation = '' + _mins + ' mins';
                    itemMinutes.expectRaw = '' + _mins;
                    itemMinutes.expectUnits = consts.DURATION_CONSTS.MINUTES;
                    array.push(itemMinutes);

                    var _secs = chance.floating({min: 1, max: 59});
                    var itemSeconds = {};
                    itemSeconds.description = 'returns a smart units fieldvalue.value is ' + _secs + ' secs ';
                    itemSeconds.fieldValue = {value: (_secs * consts.DURATION_CONSTS.MILLIS_PER_SECOND).toFixed(4)};
                    itemSeconds.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS, decimalPlaces:4};
                    itemSeconds.expectation = '' + _secs + ' secs';
                    itemSeconds.expectRaw = '' + _secs;
                    itemSeconds.expectUnits = consts.DURATION_CONSTS.SECONDS;
                    array.push(itemSeconds);
                }
            }
        });
    }

    var dataProvider = [
        //manual non random tests
        {
            description: 'returns a blank for null value',
            fieldValue: null,
            fieldInfo: {},
            expectation: ''
        },
        {
            description: 'returns a blank string if fieldvalue.value is null',
            fieldValue: {value: null},
            fieldInfo: {},
            expectation: ''
        },
        {
            description: 'returns a blank string if fieldvalue.value and fieldInfo is undefined',
            fieldValue: undefined,
            fieldInfo: undefined,
            expectation: ''
        },
        {
            description: 'returns a blank string if fieldvalue.value and fieldInfo is null',
            fieldValue: null,
            fieldInfo: null,
            expectation: ''
        },
        {
            description: 'returns a blank string if fieldInfo is null',
            fieldValue: {value: null},
            fieldInfo: null,
            expectation: ''
        },
        {
            description: 'returns a blank string if fieldvalue.value is 0',
            fieldValue: {value: 0},
            fieldInfo: {},
            expectation: ''
        },
        {
            description: 'returns a blank string if fieldvalue.value is 0 for smartunits',
            fieldValue: {value: 0},
            fieldInfo: {scale: consts.DURATION_CONSTS.SMART_UNITS},
            expectation: ''
        }
    ];

    //generate test case sets x times randomized test data
    var times = 1;
    Array.apply(null, {length: times}).forEach(() => {
        addAllScales(dataProvider);
    });

    function testMessage(testCase) {
        return (`fieldValue(ms): ${_.has(testCase, 'fieldValue.value') ? testCase.fieldValue.value : null }, ` +
        `expect: "${testCase.expectation}", ` +
        (_.has(testCase, 'input') ? `input  : ${JSON.stringify(testCase.input)},`  : '') +
        `scale: "${_.has(testCase, 'fieldInfo.scale') ? testCase.fieldInfo.scale : null }"`);
    }
    describe('format - get string ', () => {
        dataProvider.forEach((testCase) => {
            var msg = testMessage(testCase);

            it(testCase.description + ' ' + msg, () => {
                var formattedDuration = durationFormatter.format(testCase.fieldValue, testCase.fieldInfo);
                assert.equal(testCase.expectation, formattedDuration,  msg);
            });
        });
    });

    describe('formatParts - get results in localizable object ', () => {
        dataProvider.forEach((testCase) => {
            var msg = testMessage(testCase);

            it(testCase.description + ' ' + msg, () => {
                var answer = {
                    string : '',
                    units : null
                };
                if (testCase.fieldInfo) {
                    testCase.fieldInfo.formattedObj = answer;
                }
                durationFormatter.format(testCase.fieldValue, testCase.fieldInfo);
                var formattedDuration = answer;

                assert.equal(formattedDuration.string, _.has(testCase, 'expectRaw') ? testCase.expectRaw : testCase.expectation, msg);

                if (_.has(testCase, 'fieldInfo.scale')) {
                    if (durationFormatter.hasUnitsText(testCase.fieldInfo.scale)) {
                        assert.equal(testCase.fieldInfo.scale, formattedDuration.units, msg);
                    } else if (testCase.fieldInfo.scale === consts.DURATION_CONSTS.SMART_UNITS) {
                        assert.equal(testCase.expectUnits, formattedDuration.units,  msg);
                    }
                }

            });
        });
    });
});
