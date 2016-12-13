'use strict';

var recordFormatter = require('../../../../src/api/quickbase/formatter/recordFormatter')();
var assert = require('assert');
var consts = require('../../../../../common/src/constants');
/*
 * We can't use the JS native number data type when handling records because it is possible to lose
 * decimal precision as a result of the JS implementation the number data type. In JS, all numbers are
 * 64 bit floating points where bits 0-51 store values, bits 52-62 store the exponent and
 * bit 63 is the sign bit. This is the IEEE 754 standard. Practically speaking, this means
 * that a java Long, which uses all bits 0-62 to store values, cannot be expressed in a JS
 * number without a loss of precision.  For this reason, we use a special implementation of
 * JSON.parse/stringify that depends on an implementation of BigDecimal, which is capable of
 * expressing all the precision of numeric values we expect to get from the java capabilities
 * APIs.  This is slower than using JSON.parse/stringify, but is necessary to avoid the loss
 * of precision. For more info, google it!
 */
var bigDecimal = require('bigdecimal');
var CONSTS = require('../../../../../common/src/constants').DURATION_CONSTS;

/**
 * Unit tests for Duration field formatting
 */
describe('Duration record formatter unit test', function() {

    var OVER_HOUR_VAL = 2;
    var UNDER_HOUR_VAL = 0;

    // 2^63 = 4294967296
    var MAX = new bigDecimal.BigDecimal('9223372036854775807');
    var MIN = new bigDecimal.BigDecimal('-9223372036854775807');

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for Duration fields with no flags
     * Should default to 'Smart Units'
     */
    function durationNoFlagsDataProvider() {

        /**
         * FieldInfo for flag: no flags
         */
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            datatypeAttributes: {
                type: 'DURATION'
            },
            type              : 'SCALAR'
        }];

        /**
         * Duration inputs for flag: no flags
         */
        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: no flags
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: '0 days'
        }]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display = MAX.divide(CONSTS.MILLIS_PER_WEEK,
                                                       CONSTS.DEFAULT_DECIMAL_PLACES,
                                                       bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString() + ' weeks';
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display = MIN.divide(CONSTS.MILLIS_PER_WEEK,
                                                       CONSTS.DEFAULT_DECIMAL_PLACES,
                                                       bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString() + ' weeks';

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - minimum value with no flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with no flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with no flag -> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with no flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with no field property flags set
     */
    describe('should format duration record with no properties for display', function() {
        durationNoFlagsDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for Weeks Duration fields
     */
    function durationWeeksDataProvider() {

        /**
         * FieldInfo for flag: Weeks
         */
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            type              : 'SCALAR',
            datatypeAttributes: {
                type : 'DURATION',
                scale: CONSTS.WEEKS
            }
        }];

        /**
         * Duration inputs for flag: Weeks
         */
        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: Weeks
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: ''
        }]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display =
                MAX.divide(CONSTS.MILLIS_PER_WEEK,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display =
                MIN.divide(CONSTS.MILLIS_PER_WEEK,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - hour value with Weeks flag', records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration},
            {message: 'Duration - minimum value with Weeks flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with Weeks flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with Weeks flag -> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with Weeks flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Weeks field property flags set
     */
    describe('should format Weeks duration record with various properties for display', function() {
        durationWeeksDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for Days Duration fields
     */
    function durationDaysDataProvider() {

        /**
         * FieldInfo for flag: Days
         */
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            datatypeAttributes: {
                type : 'DURATION',
                scale: CONSTS.DAYS
            },
            type              : 'SCALAR'
        }];

        /**
         * Duration inputs for flag: Days
         */
        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: Days
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: UNDER_HOUR_VAL
        }]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display =
                MAX.divide(CONSTS.MILLIS_PER_DAY,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display =
                MIN.divide(CONSTS.MILLIS_PER_DAY,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - minimum value with Days flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with Days flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with Days flag -> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with Days flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Days field property flags set
     */
    describe('should format Days duration record with various properties for display', function() {
        durationDaysDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for Hours Duration fields
     */
    function durationHoursDataProvider() {
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            datatypeAttributes: {
                type : 'DURATION',
                scale: CONSTS.HOURS
            },
            type              : 'SCALAR'
        }];

        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: Days
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: UNDER_HOUR_VAL
        }]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display =
                MAX.divide(CONSTS.MILLIS_PER_HOUR,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display =
                MIN.divide(CONSTS.MILLIS_PER_HOUR,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - minimum value with Hours flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with Hours flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with Hours flag -> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with Hours flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Hours field property flags set
     */
    describe('should format Hours duration record with various properties for display', function() {
        durationHoursDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for Minutes Duration fields
     */
    function durationMinutesDataProvider() {

        /**
         * FieldInfo for flag: Minutes
         */
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            datatypeAttributes: {
                type : 'DURATION',
                scale: CONSTS.MINUTES
            },
            type              : 'SCALAR'
        }];

        /**
         * Duration inputs for flag: Minutes
         */
        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: Days
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: UNDER_HOUR_VAL
        }]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display =
                MAX.divide(CONSTS.MILLIS_PER_MIN,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display =
                MIN.divide(CONSTS.MILLIS_PER_MIN,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - minimum value with Minutes flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with Minutes flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with Minutes flag -> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with Minutes flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Minutes field property flags set
     */
    describe('should format Minutes duration record with various properties for display', function() {
        durationMinutesDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for Seconds Duration fields
     */
    function durationSecondsDataProvider() {

        /**
         * FieldInfo for flag: Seconds
         */
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            datatypeAttributes: {
                type : 'DURATION',
                scale: CONSTS.SECONDS
            },
            type              : 'SCALAR'
        }];

        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: Days
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: UNDER_HOUR_VAL
        }]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display =
                MAX.divide(CONSTS.MILLIS_PER_SECOND,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display =
                MIN.divide(CONSTS.MILLIS_PER_SECOND,
                           CONSTS.DEFAULT_DECIMAL_PLACES,
                           bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - minimum value with Seconds flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with Seconds flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with Seconds flag -> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with Seconds flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Seconds field property flags set
     */
    describe('should format Seconds duration record with various properties for display', function() {
        durationSecondsDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for CONSTS.HHMM Duration fields
     */
    function durationHHMMDataProvider() {

        /**
         * FieldInfo for flag: CONSTS.HHMM
         */
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            datatypeAttributes: {
                type : 'DURATION',
                scale: CONSTS.HHMM
            },
            type              : 'SCALAR'
        }];

        /**
         * Duration inputs for flag: CONSTS.HHMM
         */
        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputOverHour = JSON.parse(JSON.stringify(recordInputHours));
        recordInputOverHour[0][0].value = OVER_HOUR_VAL;
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: CONSTS.HHMM
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: ''
        }]];
        var expectedOverHourDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedOverHourDuration[0][0].value = OVER_HOUR_VAL;
        expectedOverHourDuration[0][0].display = '00:00';
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display = '2562047788015:12';
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display = '-2562047788015:12';

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - under hour value with CONSTS.HHMM flag', records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration},
            {message: 'Duration - over hour value with CONSTS.HHMM flag', records: recordInputOverHour, fieldInfo: fieldInfo, expectedRecords: expectedOverHourDuration},
            {message: 'Duration - minimum value with CONSTS.HHMM flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with CONSTS.HHMM flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with CONSTS.HHMM flag -> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with CONSTS.HHMM flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with CONSTS.HHMM field property flags set
     */
    describe('should format CONSTS.HHMM duration record with various properties for display', function() {
        durationHHMMDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for CONSTS.HHMMSS Duration fields
     */
    function durationHHMMSSDataProvider() {

        /**
         * FieldInfo for flag: CONSTS.HHMMSS
         */
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            datatypeAttributes: {
                type : 'DURATION',
                scale: CONSTS.HHMMSS
            },
            type              : 'SCALAR'
        }];

        /**
         * Duration inputs for flag: CONSTS.HHMMSS
         */
        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputOverHour = JSON.parse(JSON.stringify(recordInputHours));
        recordInputOverHour[0][0].value = OVER_HOUR_VAL;
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: CONSTS.HHMMSS
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: ''
        }]];
        var expectedOverHourDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedOverHourDuration[0][0].value = OVER_HOUR_VAL;
        expectedOverHourDuration[0][0].display = '00:00:00.002';
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display = '2562047788015:12:55.807';
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display = '-2562047788015:12:55.807';

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - under hour value with CONSTS.HHMMSS flag', records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration},
            {message: 'Duration - over hour value with CONSTS.HHMMSS flag', records: recordInputOverHour, fieldInfo: fieldInfo, expectedRecords: expectedOverHourDuration},
            {message: 'Duration - minimum value with CONSTS.HHMMSS flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with CONSTS.HHMMSS flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with CONSTS.HHMMSS flag-> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with CONSTS.HHMMSS flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with CONSTS.HHMMSS field property flags set
     */
    describe('should format CONSTS.HHMMSS duration record with various properties for display', function() {
        durationHHMMSSDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for CONSTS.MM Duration fields
     */
    function durationMMDataProvider() {

        /**
         * FieldInfo for flag: CONSTS.MM
         */
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            datatypeAttributes: {
                type : 'DURATION',
                scale: CONSTS.MM
            },
            type              : 'SCALAR'
        }];

        /**
         * Duration inputs for flag: CONSTS.MM
         */
        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputOverHour = JSON.parse(JSON.stringify(recordInputHours));
        recordInputOverHour[0][0].value = OVER_HOUR_VAL;
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: CONSTS.MM
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: ''
        }]];
        var expectedOverHourDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedOverHourDuration[0][0].value = OVER_HOUR_VAL;
        expectedOverHourDuration[0][0].display = ':00';
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display = '2562047788015:12';
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display = '-2562047788015:12';

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - under hour value with CONSTS.MM flag', records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration},
            {message: 'Duration - over hour value with CONSTS.MM flag', records: recordInputOverHour, fieldInfo: fieldInfo, expectedRecords: expectedOverHourDuration},
            {message: 'Duration - minimum value with CONSTS.MM flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with CONSTS.MM flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with CONSTS.MM flag-> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with CONSTS.MM flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with CONSTS.MM field property flags set
     */
    describe('should format CONSTS.MM duration record with various properties for display', function() {
        durationMMDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for CONSTS.MMSS Duration fields
     */
    function durationMMSSDataProvider() {

        /**
         * FieldInfo for flag: CONSTS.MMSS
         */
        var fieldInfo = [{
            id                : 7,
            name              : 'duration',
            datatypeAttributes: {
                type : 'DURATION',
                scale: CONSTS.MMSS
            },
            type              : 'SCALAR'
        }];

        /**
         * Duration inputs for flag: CONSTS.MMSS
         */
        var recordInputHours = [[{
            id   : 7,
            value: UNDER_HOUR_VAL
        }]];
        var recordInputOverHour = JSON.parse(JSON.stringify(recordInputHours));
        recordInputOverHour[0][0].value = OVER_HOUR_VAL;
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN.stripTrailingZeros().toString();
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMax[0][0].value = MAX.stripTrailingZeros().toString();

        /**
         * Expectations for flag: CONSTS.MMSS
         */
        var expectedHoursDuration = [[{
            id     : 7,
            value  : UNDER_HOUR_VAL,
            display: ''
        }]];
        var expectedOverHourDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedOverHourDuration[0][0].value = OVER_HOUR_VAL;
        expectedOverHourDuration[0][0].display = ':00:00.002';
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX.stripTrailingZeros().toString();
        expectedMaxDuration[0][0].display = '2562047788015:12:55.807';
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN.stripTrailingZeros().toString();
        expectedMinDuration[0][0].display = '-2562047788015:12:55.807';

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = '';
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';

        var cases = [
            {message: 'Duration - under hour value with CONSTS.MMSS flag', records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration},
            {message: 'Duration - over hour value with CONSTS.MMSS flag', records: recordInputOverHour, fieldInfo: fieldInfo, expectedRecords: expectedOverHourDuration},
            {message: 'Duration - minimum value with CONSTS.MMSS flag', records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration},
            {message: 'Duration - maximum value with CONSTS.MMSS flag', records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration},
            {message: 'Duration - null value with CONSTS.MMSS flag-> empty string', records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull},
            {message: 'Duration - empty value with CONSTS.MMSS flag -> empty string', records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty}
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with CONSTS.MMSS field property flags set
     */
    describe('should format CONSTS.MMSS duration record with various properties for display', function() {
        durationMMSSDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });
});
