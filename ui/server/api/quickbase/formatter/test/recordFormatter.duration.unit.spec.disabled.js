'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for Duration field formatting
 */
describe('Duration record formatter unit test', function () {

    var HHMM = ":HH:MM";
    var HHMMSS = ":HH:MM:SS";
    var MM = ":MM";
    var MMSS = ":MM:SS";
    var SMART_UNITS ="Smart Units";
    var WEEKS = "Weeks";
    var DAYS = "Days";
    var HOURS = "Hours";
    var MINUTES = "Minutes";
    var SECONDS = "Seconds";

    var DAYS_VAL = 10;
    var OVER_HOUR_VAL = 1.75;
    var UNDER_HOUR_VAL = 0.25;
    var MINUTES_VAL = 0.025;
    var SECONDS_VAL = 0.00025;

    // 2^32 = 4294967296
    var MAX = 4294967296;
    var MIN = -4294967296;

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for Duration fields with no flags
     * Should default to "Smart Units"
     */
    function durationNoFlagsDataProvider() {

        /**
         * FieldInfo for flag: no flags
         */
        var fieldInfo = [{
            "id": 7,
            "name": "duration",
            "type": "DURATION"
        }];

        /**
         * Duration inputs for flag: no flags
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: no flags
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": "6 hours"}]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = "4294967296 days";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-4294967296 days";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - hour value with no flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - minimum value with no flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with no flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with no flag -> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with no flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with no field property flags set
     */
    describe('should format duration record with no properties for display',function(){
        durationNoFlagsDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
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
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": WEEKS
            }
        }];

        /**
         * Duration inputs for flag: Weeks
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: Weeks
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": UNDER_HOUR_VAL}]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = "4294967296";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-4294967296";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - hour value with Weeks flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - minimum value with Weeks flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with Weeks flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with Weeks flag -> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with Weeks flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Weeks field property flags set
     */
    describe('should format Weeks duration record with various properties for display',function(){
        durationWeeksDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
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
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": DAYS
            }
        }];

        /**
         * Duration inputs for flag: Days
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: Days
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": UNDER_HOUR_VAL}]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = "4294967296";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-4294967296";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - hour value with Days flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - minimum value with Days flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with Days flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with Days flag -> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with Days flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Days field property flags set
     */
    describe('should format Days duration record with various properties for display',function(){
        durationDaysDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for Hours Duration fields
     */
    function durationHoursDataProvider() {

        /**
         * FieldInfo for flag: Hours
         */
        var fieldInfo = [{
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": HOURS
            }
        }];

        /**
         * Duration inputs for flag: Hours
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: Hours
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": UNDER_HOUR_VAL}]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = "4294967296";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-4294967296";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - hour value with Hours flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - minimum value with Hours flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with Hours flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with Hours flag -> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with Hours flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Hours field property flags set
     */
    describe('should format Hours duration record with various properties for display',function(){
        durationHoursDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
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
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": MINUTES
            }
        }];

        /**
         * Duration inputs for flag: Minutes
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: Minutes
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": UNDER_HOUR_VAL}]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = "4294967296";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-4294967296";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - hour value with Minutes flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - minimum value with Minutes flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with Minutes flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with Minutes flag -> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with Minutes flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Minutes field property flags set
     */
    describe('should format Minutes duration record with various properties for display',function(){
        durationMinutesDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
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
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": SECONDS
            }
        }];

        /**
         * Duration inputs for flag: Seconds
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: Seconds
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": UNDER_HOUR_VAL}]];
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = "4294967296";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-4294967296";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - hour value with Seconds flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - minimum value with Seconds flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with Seconds flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with Seconds flag -> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with Seconds flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Seconds field property flags set
     */
    describe('should format Seconds duration record with various properties for display',function(){
        durationSecondsDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for HHMM Duration fields
     */
    function durationHHMMDataProvider() {

        /**
         * FieldInfo for flag: HHMM
         */
        var fieldInfo = [{
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": HHMM
            }
        }];

        /**
         * Duration inputs for flag: HHMM
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputOverHour = JSON.parse(JSON.stringify(recordInputHours));
        recordInputOverHour[0][0].value = OVER_HOUR_VAL;
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: HHMM
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": "0:15"}]];
        var expectedOverHourDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedOverHourDuration[0][0].value = OVER_HOUR_VAL;
        expectedOverHourDuration[0][0].display = "1:45";
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = "0:00";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-0:00";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - under hour value with HHMM flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - over hour value with HHMM flag", records: recordInputOverHours, fieldInfo: fieldInfo, expectedRecords: expectedOverHoursDuration },
            { message: "Duration - minimum value with HHMM flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with HHMM flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with HHMM flag -> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with HHMM flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with HHMM field property flags set
     */
    describe('should format HHMM duration record with various properties for display',function(){
        durationHHMMDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for HHMMSS Duration fields
     */
    function durationHHMMSSDataProvider() {

        /**
         * FieldInfo for flag: HHMMSS
         */
        var fieldInfo = [{
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": HHMMSS
            }
        }];

        /**
         * Duration inputs for flag: HHMMSS
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputOverHour = JSON.parse(JSON.stringify(recordInputHours));
        recordInputOverHour[0][0].value = OVER_HOUR_VAL;
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: HHMMSS
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": "0:15:00"}]];
        var expectedOverHourDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedOverHourDuration[0][0].value = OVER_HOUR_VAL;
        expectedOverHourDuration[0][0].display = "1:45:00";
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = "0:00:005461882265600.000";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-0:00:005461882265600.000";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - under hour value with HHMMSS flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - over hour value with HHMMSS flag", records: recordInputOverHour, fieldInfo: fieldInfo, expectedRecords: expectedOverHourDuration },
            { message: "Duration - minimum value with HHMMSS flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with HHMMSS flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with HHMMSS flag-> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with HHMMSS flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with HHMMSS field property flags set
     */
    describe('should format HHMMSS duration record with various properties for display',function(){
        durationHHMMSSDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for MM Duration fields
     */
    function durationMMDataProvider() {

        /**
         * FieldInfo for flag: MM
         */
        var fieldInfo = [{
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": MM
            }
        }];

        /**
         * Duration inputs for flag: MM
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputOverHour = JSON.parse(JSON.stringify(recordInputHours));
        recordInputOverHour[0][0].value = OVER_HOUR_VAL;
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: MM
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": ":15"}]];
        var expectedOverHourDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedOverHourDuration[0][0].value = OVER_HOUR_VAL;
        expectedOverHourDuration[0][0].display = "1:45";
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = ":00";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-:00";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - under hour value with MM flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - over hour value with MM flag", records: recordInputOverHour, fieldInfo: fieldInfo, expectedRecords: expectedOverHourDuration },
            { message: "Duration - minimum value with MM flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with MM flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with MM flag-> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with MM flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with MM field property flags set
     */
    describe('should format MM duration record with various properties for display',function(){
        durationMMDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for MMSS Duration fields
     */
    function durationMMSSDataProvider() {

        /**
         * FieldInfo for flag: MMSS
         */
        var fieldInfo = [{
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": MMSS
            }
        }];

        /**
         * Duration inputs for flag: MMSS
         */
        var recordInputHours =  [[{
            "id": 7,
            "value": UNDER_HOUR_VAL}]];
        var recordInputOverHour = JSON.parse(JSON.stringify(recordInputHours));
        recordInputOverHour[0][0].value = OVER_HOUR_VAL;
        var recordInputMin = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MIN;
        var recordInputMax = JSON.parse(JSON.stringify(recordInputHours));
        recordInputMin[0][0].value = MAX;

        /**
         * Expectations for flag: MMSS
         */
        var expectedHoursDuration = [[{
            "id": 7,
            "value": UNDER_HOUR_VAL,
            "display": ":15:00"}]];
        var expectedOverHourDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedOverHourDuration[0][0].value = OVER_HOUR_VAL;
        expectedOverHourDuration[0][0].display = "1:45:00";
        var expectedMaxDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMaxDuration[0][0].value = MAX;
        expectedMaxDuration[0][0].display = ":00:005461882265600.000";
        var expectedMinDuration = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedMinDuration[0][0].value = MIN;
        expectedMinDuration[0][0].display = "-:00:005461882265600.000";

        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputHours));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHours));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHoursDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - under hour value with MMSS flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - over hour value with MMSS flag", records: recordInputOverHour, fieldInfo: fieldInfo, expectedRecords: expectedOverHourDuration },
            { message: "Duration - minimum value with MMSS flag", records: recordInputMin, fieldInfo: fieldInfo, expectedRecords: expectedMinDuration },
            { message: "Duration - maximum value with MMSS flag", records: recordInputMax, fieldInfo: fieldInfo, expectedRecords: expectedMaxDuration },
            { message: "Duration - null value with MMSS flag-> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with MMSS flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with MMSS field property flags set
     */
    describe('should format MMSS duration record with various properties for display',function(){
        durationMMSSDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for Smart Units Duration fields
     */
    function durationSmartUnitsDataProvider() {

        /**
         * FieldInfo for flag: Smart Units
         */
        var fieldInfo = [{
            "id": 7,
            "name": "duration",
            "type": "DURATION",
            "clientSideAttributes": {
                "scale": SMART_UNITS
            }
        }];

        /**
         * Duration inputs for flag: Smart Units
         */
        var recordInputDays =  [[{
            "id": 7,
            "value": DAYS_VAL}]];
        var recordInputHours = JSON.parse(JSON.stringify(recordInputDays));
        recordInputHours[0][0].value = UNDER_HOUR_VAL;
        var recordInputMinutes = JSON.parse(JSON.stringify(recordInputDays));
        recordInputMinutes[0][0].value = MINUTES_VAL;
        var recordInputSeconds = JSON.parse(JSON.stringify(recordInputDays));
        recordInputSeconds[0][0].value = SECONDS_VAL;

        /**
         * Expectations for flag: Smart Units
         */
        var expectedDaysDuration = [[{
            "id": 7,
            "value": DAYS_VAL,
            "display": "10 days"}]];
        var expectedHoursDuration = JSON.parse(JSON.stringify(expectedDaysDuration));
        expectedHoursDuration[0][0].value = UNDER_HOUR_VAL;
        expectedHoursDuration[0][0].display = "6 hours";
        var expectedMinutesDuration = JSON.parse(JSON.stringify(expectedDaysDuration));
        expectedMinutesDuration[0][0].value = MINUTES_VAL;
        expectedMinutesDuration[0][0].display = "36 mins";
        var expectedSecondsDuration = JSON.parse(JSON.stringify(expectedDaysDuration));
        expectedSecondsDuration[0][0].value = SECONDS_VAL;
        expectedSecondsDuration[0][0].display = "21.6 secs";


        // Null record input and expectations
        var recordsNull = JSON.parse(JSON.stringify(recordInputDays));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedDaysDuration));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        // Empty record input and expectations
        var recordsEmpty = JSON.parse(JSON.stringify(recordInputDays));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedDaysDuration));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            { message: "Duration - days value with Smart Units flag", records: recordInputDays, fieldInfo: fieldInfo, expectedRecords: expectedDaysDuration },
            { message: "Duration - hours value with Smart Units flag", records: recordInputHours, fieldInfo: fieldInfo, expectedRecords: expectedHoursDuration },
            { message: "Duration - minutes value with Smart Units flag", records: recordInputMinutes, fieldInfo: fieldInfo, expectedRecords: expectedMinutesDuration },
            { message: "Duration - seconds value with Smart Units flag", records: recordInputSeconds, fieldInfo: fieldInfo, expectedRecords: expectedDaysDuration },
            { message: "Duration - null value with Smart Units flag-> empty string", records: recordsNull, fieldInfo: fieldInfo, expectedRecords: expectedNull },
            { message: "Duration - empty value with Smart Units flag -> empty string", records: recordsEmpty, fieldInfo: fieldInfo, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates Duration records formatting with Smart Units field property flags set
     */
    describe('should format Smart Units duration record with various properties for display',function(){
        durationSmartUnitsDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('actual value: ' + JSON.stringify(formattedRecords));
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });
});