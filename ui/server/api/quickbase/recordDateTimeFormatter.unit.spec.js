'use strict';

var should = require('should');
var recordFormatter = require('./recordFormatter')();
var assert = require('assert');

describe('RECORDS date time formatter unit test', function () {

    function provider() {
        //Incomplete number
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T18:51:19+00:00"}]];
        var expectedRecords =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, 04-12-2015 2:51 PM"}]];


        return [
            { message: "Date time", records: recordsInput, expectedRecords: expectedRecords }
        ];
    }

    it('should format a date time for display', function () {
        var dateFieldInfo = [
            {
                "id": 7,
                "name": "datetime",
                "type": "DATE_TIME",
                "showTime": true,
                "showTimeZone": false,
                "showMonthAsName": false,
                "showDayOfWeek": true,
                "format": "MM-dd-uuuu",
                "timeZone": "America/New_York"
            }
        ];
        provider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, dateFieldInfo);
            console.log();
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });
});