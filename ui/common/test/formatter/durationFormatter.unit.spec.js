'use strict';

var assert = require('assert');
var moment = require('moment');
var _ = require('lodash');
var durationFormatter = require('../../src/formatter/durationFormatter');
var consts = require('../../src/constants');
var DURATION_CONSTS = consts.DURATION_CONSTS;
var DURATION_SCALES = DURATION_CONSTS.SCALES;

// gen a repeatable seed for random values, so it can be reproduced
var Chance = require('chance');
var seed = new Chance().integer({min: 1, max: 1000000000});

var chance = new Chance(seed);

describe('DurationFormatter (seed ' + seed + ')', () => {

    function addAllScales(array) {
        Object.keys(DURATION_SCALES).forEach(function(scaleKey) {
            var item = {};
            var scale = DURATION_SCALES[scaleKey];
            if (typeof (scale) === 'string') {
                if (durationFormatter.hasUnitsText(scale)) {
                    var val = chance.floating({min: 0, max: 99999});
                    var ms = moment.duration(val, scale).asMilliseconds();
                    item.description = "test scale " + scale;
                    item.fieldValue = {value: ms};
                    item.fieldInfo = {scale: scale, decimalPlaces:4};
                    item.expectation = '' + val;
                    array.push(item);
                } else if (scale !== DURATION_SCALES.SMART_UNITS) {
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
                    itemWeeks.fieldValue = {value: weeks * DURATION_CONSTS.MILLIS_PER_WEEK};
                    itemWeeks.fieldInfo = {scale: DURATION_SCALES.SMART_UNITS, decimalPlaces:4};
                    itemWeeks.expectation = '' + weeks + ' weeks';
                    itemWeeks.expectRaw = '' + weeks;
                    itemWeeks.expectUnits = DURATION_SCALES.WEEKS;
                    array.push(itemWeeks);

                    var days = chance.floating({min: 1, max: 6});
                    var itemDays = {};
                    itemDays.description = 'returns a smart units fieldvalue.value is ' + days + ' days ';
                    itemDays.fieldValue = {value: days * DURATION_CONSTS.MILLIS_PER_DAY};
                    itemDays.fieldInfo = {scale: DURATION_SCALES.SMART_UNITS, decimalPlaces:4};
                    itemDays.expectation = '' + days + ' days';
                    itemDays.expectRaw = '' + days;
                    itemDays.expectUnits = DURATION_SCALES.DAYS;
                    array.push(itemDays);

                    var _hours = chance.floating({min: 1, max: 23});
                    var itemHours = {};
                    itemHours.description = 'returns a smart units fieldvalue.value is ' + _hours + ' hours ';
                    itemHours.fieldValue = {value: _hours * DURATION_CONSTS.MILLIS_PER_HOUR};
                    itemHours.fieldInfo = {scale: DURATION_SCALES.SMART_UNITS, decimalPlaces:4};
                    itemHours.expectation = '' + _hours + ' hours';
                    itemHours.expectRaw = '' + _hours;
                    itemHours.expectUnits = DURATION_SCALES.HOURS;
                    array.push(itemHours);

                    var _mins = chance.floating({min: 1, max: 59});
                    var itemMinutes = {};
                    itemMinutes.description = 'returns a smart units fieldvalue.value is ' + _mins + ' mins ';
                    itemMinutes.fieldValue = {value: _mins * DURATION_CONSTS.MILLIS_PER_MIN};
                    itemMinutes.fieldInfo = {scale: DURATION_SCALES.SMART_UNITS, decimalPlaces:4};
                    itemMinutes.expectation = '' + _mins + ' mins';
                    itemMinutes.expectRaw = '' + _mins;
                    itemMinutes.expectUnits = DURATION_SCALES.MINUTES;
                    array.push(itemMinutes);

                    var _secs = chance.floating({min: 1, max: 59});
                    var itemSeconds = {};
                    itemSeconds.description = 'returns a smart units fieldvalue.value is ' + _secs + ' secs ';
                    itemSeconds.fieldValue = {value: (_secs * DURATION_CONSTS.MILLIS_PER_SECOND).toFixed(4)};
                    itemSeconds.fieldInfo = {scale: DURATION_SCALES.SMART_UNITS, decimalPlaces:4};
                    itemSeconds.expectation = '' + _secs + ' ' + DURATION_CONSTS.SCALES.SECONDS.toLowerCase();
                    itemSeconds.expectRaw = '' + _secs;
                    itemSeconds.expectUnits = DURATION_SCALES.SECONDS;
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
            description: 'returns 0 weeks if fieldvalue.value is 0',
            fieldValue: {value: 0},
            fieldInfo: {},
            expectation: '0 weeks'
        },
        {
            description: 'returns a blank string if fieldvalue.value is 0 for smartunits',
            fieldValue: {value: 0},
            fieldInfo: {scale: DURATION_SCALES.SMART_UNITS},
            expectation: '0 weeks',
            expectUnits : DURATION_SCALES.WEEKS
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
                assert.equal(formattedDuration, testCase.expectation,  msg);
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
                        assert.equal(formattedDuration.units, testCase.fieldInfo.scale, msg);
                    } else if (testCase.fieldInfo.scale === DURATION_SCALES.SMART_UNITS) {
                        assert.equal(formattedDuration.units, testCase.expectUnits, msg);
                    }
                }

            });
        });
    });

    describe('hasUnitsText for table header', () => {
        let hasUnitsCases = [
            {scale: DURATION_SCALES.WEEKS, expectation: true},
            {scale: DURATION_SCALES.DAYS, expectation: true},
            {scale: DURATION_SCALES.HOURS, expectation: true},
            {scale: DURATION_SCALES.MINUTES, expectation: true},
            {scale: DURATION_SCALES.SECONDS, expectation: true},
            {scale: DURATION_SCALES.MILLISECONDS, expectation: true},
            {scale: DURATION_SCALES.HHMM, expectation: false},
            {scale: DURATION_SCALES.HHMMSS, expectation: false},
            {scale: DURATION_SCALES.MM, expectation: false},
            {scale: DURATION_SCALES.MMSS, expectation: false},
            {scale: DURATION_SCALES.SMART_UNITS, expectation: false},
            {scale: 'invalid', expectation: false},
            {scale: null, expectation: false},
            {scale: undefined, expectation: false},
        ];
        hasUnitsCases.forEach((testCase) => {
            it(testCase.scale + ' should be ' + testCase.expectation, () => {
                var hasUnits = durationFormatter.hasUnitsText(testCase.scale);
                assert.equal(hasUnits, testCase.expectation);
            });
        });
    });


    describe('isSmartUnitsField ', () => {
        describe('test scales', () => {
            let isSmartUnitsCases = [
                {scale: DURATION_SCALES.WEEKS, expectation: false},
                {scale: DURATION_SCALES.DAYS, expectation: false},
                {scale: DURATION_SCALES.HOURS, expectation: false},
                {scale: DURATION_SCALES.MINUTES, expectation: false},
                {scale: DURATION_SCALES.SECONDS, expectation: false},
                {scale: DURATION_SCALES.MILLISECONDS, expectation: false},
                {scale: DURATION_SCALES.HHMM, expectation: false},
                {scale: DURATION_SCALES.HHMMSS, expectation: false},
                {scale: DURATION_SCALES.MM, expectation: false},
                {scale: DURATION_SCALES.MMSS, expectation: false},
                {scale: 'invalid', expectation: false},
                {scale: null, expectation: false},
                {scale: undefined, expectation: false},
                {scale: DURATION_SCALES.SMART_UNITS, expectation: true},

            ];
            isSmartUnitsCases.forEach((testCase) => {
                it(testCase.scale + ' should be ' + testCase.expectation, () => {
                    var fieldDef = {
                        datatypeAttributes : {
                            scale : testCase.scale
                        }
                    };
                    var isSmartUnits = durationFormatter.isSmartUnitsField(fieldDef);
                    assert.equal(isSmartUnits, testCase.expectation);
                });
            });
        });
        describe('test input parameter', () => {
            let param = [
                {message: 'null fieldDef', param: null, expectation: false},
                {message: 'undefined fieldDef', param: undefined, expectation: false},
                {message: 'partial fieldDef', param: {}, expectation: false},
                {message: 'partial fieldDef datatypeAttributes', param: {datatypeAttributes : {}}, expectation: false},
                {message: 'invalid fieldDef ', param: 23, expectation: false},
            ];
            param.forEach((testCase) => {
                it(testCase.message, () => {
                    var isSmartUnits = durationFormatter.isSmartUnitsField(testCase.param);
                    assert.equal(isSmartUnits, testCase.expectation);
                });
            });
        });

    });

});
