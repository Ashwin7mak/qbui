'use strict';

var assert = require('assert');
var moment = require('moment');
var _ = require('lodash');
var durationFormatter = require('../../src/formatter/durationFormatter');
var consts = require('../../src/constants');
var Chance = require('chance');
var seed = new Chance().integer({min: 1, max: 1000000000});

//seed = 33;
var chance = new Chance(seed);
//console.log('DurationFormatter seed:' + seed + '\n');


describe('DurationFormatter (seed ' + seed + ')', () => {

    function addAllScales(array) {
        Object.keys(consts.DURATION_CONSTS).forEach(function(scaleKey) {
            var item = {};
            var scale = consts.DURATION_CONSTS[scaleKey];
            if (typeof (scale) === 'string') {
                if (durationFormatter.hasUnitsText(scale)) {
                    var val = chance.integer({fixed: 4, min: 0, max: 99999});
                    var ms = (moment.duration(val, scale).asMilliseconds());
                    item.description = "test scale " + scale;
                    item.fieldValue = {value: ms};
                    item.fieldInfo = {scale: scale};
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
                        item.fieldInfo = {scale: scale};
                        item.expectation = testInfo[scale].exp;
                        item.input = {hours, mins, secs};
                        array.push(item);
                    }
                } else { //smartunit scale
                    var weeks = chance.integer({min: 1, max: 999999});
                    item.description = 'returns a smart units fieldvalue.value is ' + weeks + ' weeks ';
                    item.fieldValue = {value: weeks * consts.DURATION_CONSTS.MILLIS_PER_WEEK};
                    item.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS};
                    item.expectation = '' + weeks + ' weeks';
                    item.expectRaw = '' + weeks;
                    item.expectUnits = consts.DURATION_CONSTS.WEEKS;
                    array.push(item);

                    var days = chance.integer({min: 1, max: 6});
                    item.description = 'returns a smart units fieldvalue.value is ' + days + ' days ';
                    item.fieldValue = {value: days * consts.DURATION_CONSTS.MILLIS_PER_DAY};
                    item.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS};
                    item.expectation = '' + days + ' days';
                    item.expectRaw = '' + days;
                    item.expectUnits = consts.DURATION_CONSTS.DAYS;
                    array.push(item);

                    var _hours = chance.integer({min: 1, max: 23});
                    item.description = 'returns a smart units fieldvalue.value is ' + _hours + ' hours ';
                    item.fieldValue = {value: _hours * consts.DURATION_CONSTS.MILLIS_PER_HOUR};
                    item.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS};
                    item.expectation = '' + _hours + ' hours';
                    item.expectRaw = '' + _hours;
                    item.expectUnits = consts.DURATION_CONSTS.HOURS;
                    array.push(item);

                    var _mins = chance.integer({min: 1, max: 59});
                    item.description = 'returns a smart units fieldvalue.value is ' + _mins + ' mins ';
                    item.fieldValue = {value: _mins * consts.DURATION_CONSTS.MILLIS_PER_MIN};
                    item.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS};
                    item.expectation = '' + _mins + ' mins';
                    item.expectRaw = '' + _mins;
                    item.expectUnits = consts.DURATION_CONSTS.MINUTES;
                    array.push(item);

                    var _secs = chance.integer({min: 1, max: 59});
                    item.description = 'returns a smart units fieldvalue.value is ' + _secs + ' secs ';
                    item.fieldValue = {value: _secs * consts.DURATION_CONSTS.MILLIS_PER_SECOND};
                    item.fieldInfo = {scale: consts.DURATION_CONSTS.SMART_UNITS};
                    item.expectation = '' + _secs + ' secs';
                    item.expectRaw = '' + _secs;
                    item.expectUnits = consts.DURATION_CONSTS.SECONDS;
                    array.push(item);
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
        },
        // {
        //     description: 'fails 361195020000',
        //     fieldValue: {value: 361195020000},
        //     fieldInfo: {scale: consts.DURATION_CONSTS.HHMM},
        //     expectation: '3933.5939:57'
        // },
        // {
        //     description: 'fails 544378500000',
        //     fieldValue: {value: 544378500000},
        //     fieldInfo: {scale: consts.DURATION_CONSTS.HHMM},
        //     expectation: "6227.1768:15"
        // },
        //8948460000
        //34710725789.9 - MM:SS
    ];

    //generate test case sets x times randomized test data
    var times = 2;
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
                    testCase.fieldInfo.resultObj = answer;
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
