'use strict';

var should = require('should');
var recordFormatter = require('./recordFormatter')();
var assert = require('assert');

describe('DateTime record formatter unit test', function () {

    function provider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T18:51:19+00:00"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format
        var mmddyyyy_FieldInfo = [{
                "id": 7,
                "name": "datetime",
                "type": "DATE_TIME",
                "showTime": false,
                "showTimeZone": false,
                "showMonthAsName": false,
                "showDayOfWeek": false,
                "format": "MM-dd-uuuu",
                "timeZone": "America/New_York"}];

        var expectedRecords_MMDDYYYY =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showDayOfWeek flag
        var mmddyyyy_ShowDayOfWeek_FieldInfo = mmddyyyy_FieldInfo;
        mmddyyyy_ShowDayOfWeek_FieldInfo.showDayOfWeek = true;

        var expectedRecords_MMDDYYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, 04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showTimeZone flag
        var mmddyyyy_ShowTimeZone_FieldInfo = mmddyyyy_FieldInfo;
        mmddyyyy_ShowTimeZone_FieldInfo.showTimeZone = true;

        var expectedRecords_MMDDYYY_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "04-12-2015 2:51 PM PST"}]];

        //Empty records
        var emptyRecords =  [[{
            "id": 7,
            "value": ""}]];
        var expectedEmptyRecords =
            [[{
                "id": 7,
                "value": "",
                "display": ""}]];

        //null record value
        var nullRecords =  [[{
            "id": 7,
            "value": null}]];
        var nullExpectedRecords =
            [[{
                "id": 7,
                "value": null,
                "display": null}]];

        return [
            { message: "dateTime with MM_DD_YYYY format", records: recordsInput, fieldInfo: mmddyyyy_FieldInfo, expectedRecords: expectedRecords_MMDDYYYY },
            { message: "dateTime with MM_DD_YYYY format and showDayOfWeek flag", records: recordsInput, fieldInfo: mmddyyyy_ShowDayOfWeek_FieldInfo, expectedRecords: expectedRecords_MMDDYYY_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTimeZone flag", records: recordsInput, fieldInfo: mmddyyyy_ShowTimeZone_FieldInfo, expectedRecords: expectedRecords_MMDDYYY_ShowTimeZone },
            { message: "empty dateTime with MM_DD_YYYY format", records: emptyRecords, fieldInfo: mmddyyyy_FieldInfo, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with MM_DD_YYYY format", records: nullRecords, fieldInfo: mmddyyyy_FieldInfo, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format a DateTime for display', function () {
        provider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            console.log();
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });
});