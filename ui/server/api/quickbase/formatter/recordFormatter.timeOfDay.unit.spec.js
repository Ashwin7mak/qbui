'use strict';

var should = require('should');
var recordFormatter = require('./recordFormatter')();
var assert = require('assert');

describe('Time of day record formatter unit test', function () {

    function provider() {
        var inputTod = "1970-01-01T18:51:21Z";
        //Incomplete number
        var recordsInput =  [[{
            "id": 7,
            "value": inputTod}]];
        var expectedHHMM12HourClock = [[{
                "id": 7,
                "value": inputTod,
                "display": "6:51 PM"}]];
        var todHHMM12HourClock = [
            {
                "id": 7,
                "name": "datetime",
                "type": "TIME_OF_DAY",
                "scale": "HH:MM",
                "use24HourClock": false
            }
        ];

        var expectedHHMM24HourClock = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMM24HourClock[0][0].display = "18:51";
        var todHHMM24HourClock = JSON.parse(JSON.stringify(todHHMM12HourClock));
        todHHMM24HourClock[0].use24HourClock = true;

        var expectedHHMMSS24HourClock = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMMSS24HourClock[0][0].display = "18:51:21";
        var todHHMMSS24HourClock = JSON.parse(JSON.stringify(todHHMM12HourClock));
        todHHMMSS24HourClock[0].use24HourClock = true;
        todHHMMSS24HourClock[0].scale = "HH:MM:SS";

        var expectedHHMMSS12HourClock = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedHHMMSS12HourClock[0][0].display = "6:51:21 PM";
        var todHHMMSS12HourClock = JSON.parse(JSON.stringify(todHHMM12HourClock));
        todHHMMSS12HourClock[0].use24HourClock = false;
        todHHMMSS12HourClock[0].scale = "HH:MM:SS";

        var expectedNull = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;
        var recordsNull = JSON.parse(JSON.stringify(recordsInput));
        recordsNull[0][0].value = null;

        var expectedEmpty = JSON.parse(JSON.stringify(expectedHHMM12HourClock));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";
        var recordsEmpty = JSON.parse(JSON.stringify(recordsInput));
        recordsEmpty[0][0].value = "";

        var cases =[
            { message: "TOD - HH:MM 12 hour clock", records: recordsInput, fieldInfo: todHHMM12HourClock, expectedRecords: expectedHHMM12HourClock },
            { message: "TOD - HH:MM 24 hour clock", records: recordsInput, fieldInfo: todHHMM24HourClock, expectedRecords: expectedHHMM24HourClock },
            { message: "TOD - HH:MM:SS 24 hour clock", records: recordsInput, fieldInfo: todHHMMSS24HourClock, expectedRecords: expectedHHMMSS24HourClock },
            { message: "TOD - HH:MM:SS 12 hour clock", records: recordsInput, fieldInfo: todHHMMSS12HourClock, expectedRecords: expectedHHMMSS12HourClock },
            { message: "TOD - null -> empty string", records: recordsNull, fieldInfo: todHHMM12HourClock, expectedRecords: expectedNull },
            { message: "TOD - empty string -> empty string", records: recordsEmpty, fieldInfo: todHHMM12HourClock, expectedRecords: expectedEmpty },
        ];

        return cases;
    }

    it('should format a time of day for display', function () {
        provider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });
});