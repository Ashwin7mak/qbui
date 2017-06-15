'use strict';

var recordFormatter = require('../../../../src/api/quickbase/formatter/recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for TimeOfDay field formatting
 */
describe('Time of day record formatter unit test', function() {

    /**
     * DataProvider containing Records, FieldProperties and record display expectations TimeOfDay fields
     */
    function provider() {
        var inputTod = '18:51:21';
        //Incomplete number
        var recordsInput = [[{
            id   : 7,
            value: inputTod
        }]];
        var expectedHHMM12HourClock = [[{
            id     : 7,
            value  : inputTod,
            display: '6:51 pm'
        }]];
        var fieldWithoutTimezone = [
            {
                id                : 7,
                type              : 'SCALAR',
                name              : 'datetime',
                datatypeAttributes: {
                    type          : 'TIME_OF_DAY',
                    scale         : 'HH:MM',
                    use24HourClock: false,
                    timeZone          : "America/Los_Angeles"
                }
            }
        ];
        var fieldWithTimezone = [
            {
                id                : 7,
                type              : 'SCALAR',
                name              : 'datetime',
                datatypeAttributes: {
                    type          : 'TIME_OF_DAY',
                    scale         : 'HH:MM',
                    use24HourClock: false,
                    useTimezone       : true,
                    timeZone          : "America/Los_Angeles"
                }
            }
        ];

        var expectedHHMM12HourClockTz = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMM12HourClockTz[0][0].display = '11:51 am';

        var expectedHHMM24HourClock = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMM24HourClock[0][0].display = '18:51';
        var todHHMM24HourField = JSON.parse(JSON.stringify(fieldWithoutTimezone));
        todHHMM24HourField[0].datatypeAttributes.use24HourClock = true;

        var expectedHHMM24HourClockTz = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMM24HourClockTz[0][0].display = '11:51';
        var todHHMM24HourTzField = JSON.parse(JSON.stringify(fieldWithTimezone));
        todHHMM24HourTzField[0].datatypeAttributes.use24HourClock = true;

        var expectedHHMMSS24HourClock = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMMSS24HourClock[0][0].display = '18:51:21';
        var todHHMMSS24HourField = JSON.parse(JSON.stringify(fieldWithoutTimezone));
        todHHMMSS24HourField[0].datatypeAttributes.use24HourClock = true;
        todHHMMSS24HourField[0].datatypeAttributes.scale = 'HH:MM:SS';

        var expectedHHMMSS24HourClockTz = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMMSS24HourClockTz[0][0].display = '11:51:21';
        var todHHMMSS24HourTzField = JSON.parse(JSON.stringify(fieldWithTimezone));
        todHHMMSS24HourTzField[0].datatypeAttributes.use24HourClock = true;
        todHHMMSS24HourTzField[0].datatypeAttributes.scale = 'HH:MM:SS';

        var expectedHHMMSS12HourClock = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMMSS12HourClock[0][0].display = '6:51:21 pm';
        var todHHMMSS12HourField = JSON.parse(JSON.stringify(fieldWithoutTimezone));
        todHHMMSS12HourField[0].datatypeAttributes.use24HourClock = false;
        todHHMMSS12HourField[0].datatypeAttributes.scale = 'HH:MM:SS';

        var expectedHHMMSS12HourClockTz = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMMSS12HourClockTz[0][0].display = '11:51:21 am';
        var todHHMMSS12HourTzField = JSON.parse(JSON.stringify(fieldWithTimezone));
        todHHMMSS12HourTzField[0].datatypeAttributes.use24HourClock = false;
        todHHMMSS12HourTzField[0].datatypeAttributes.scale = 'HH:MM:SS';

        var expectedNull = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedNull[0][0].display = '';
        expectedNull[0][0].value = null;
        var recordsNull = JSON.parse(JSON.stringify(recordsInput));
        recordsNull[0][0].value = null;

        var expectedEmpty = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedEmpty[0][0].display = '';
        expectedEmpty[0][0].value = '';
        var recordsEmpty = JSON.parse(JSON.stringify(recordsInput));
        recordsEmpty[0][0].value = '';

        var cases = [
            {message: 'TOD - HH:MM 12 hour clock', records: recordsInput, fieldInfo: fieldWithoutTimezone, expectedRecords: expectedHHMM12HourClock},
            {message: 'TOD - HH:MM 24 hour clock', records: recordsInput, fieldInfo: todHHMM24HourField, expectedRecords: expectedHHMM24HourClock},
            {message: 'TOD - HH:MM:SS 24 hour clock', records: recordsInput, fieldInfo: todHHMMSS24HourField, expectedRecords: expectedHHMMSS24HourClock},
            {message: 'TOD - HH:MM:SS 12 hour clock', records: recordsInput, fieldInfo: todHHMMSS12HourField, expectedRecords: expectedHHMMSS12HourClock},
            {message: 'TOD - null -> empty string', records: recordsNull, fieldInfo: fieldWithoutTimezone, expectedRecords: expectedNull},
            {message: 'TOD - empty string -> empty string', records: recordsEmpty, fieldInfo: fieldWithoutTimezone, expectedRecords: expectedEmpty},
            {message: 'TOD - HH:MM 12 hour clock with timezone', records: recordsInput, fieldInfo: fieldWithTimezone, expectedRecords: expectedHHMM12HourClockTz},
            {message: 'TOD - HH:MM 24 hour clock with timezone', records: recordsInput, fieldInfo: todHHMM24HourTzField, expectedRecords: expectedHHMM24HourClockTz},
            {message: 'TOD - HH:MM:SS 24 hour clock with timezone', records: recordsInput, fieldInfo: todHHMMSS24HourTzField, expectedRecords: expectedHHMMSS24HourClockTz},
            {message: 'TOD - HH:MM:SS 12 hour clock with timezone', records: recordsInput, fieldInfo: todHHMMSS12HourTzField, expectedRecords: expectedHHMMSS12HourClockTz},
        ];

        return cases;
    }

    /**
     * Unit test that validates TimeOfDay records formatting with various field property flags set
     */
    describe('should format a time of day record with various properties for display', function() {
        provider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});
