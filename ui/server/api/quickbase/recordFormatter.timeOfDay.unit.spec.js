'use strict';

var should = require('should');
var recordFormatter = require('./recordFormatter')();
var assert = require('assert');

describe('RECORDS - TIME_OF_DAY formatter unit test', function () {

    function provider() {
        //Incomplete number
        var recordsInput =  [[{
            "id": 7,
            "value": "1970-01-01T18:51:00Z"}]];
        var expectedRecords =
            [[{
                "id": 7,
                "value": "1970-01-01T18:51:00Z",
                "display": "6:51 PM"}]];


        return [
            { message: "TOD - HH:MM 12 hour clock", records: recordsInput, expectedRecords: expectedRecords }
        ];
    }

    it('should format a date time for display', function () {
        var todFieldInfo = [
            {
                "id": 7,
                "name": "datetime",
                "type": "TIME_OF_DAY",
                "scale": "HH:MM",
                "use24HourClock": false
            }
        ];
        provider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, todFieldInfo);
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });
});