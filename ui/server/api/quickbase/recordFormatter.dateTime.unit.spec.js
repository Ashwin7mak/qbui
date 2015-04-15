'use strict';

var should = require('should');
var recordFormatter = require('./recordFormatter')();
var assert = require('assert');

describe('DateTime record formatter unit test', function () {

    function mmddyyyyDataProvider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T18:51:19+00:00"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format
        // TODO: Determine how to use the constants in dateTime formatter to set format???
        var mmddyyyy = {
                "id": 7,
                "name": "datetime",
                "type": "DATE_TIME",
                "showTime": true,
                "showTimeZone": false,
                "showMonthAsName": false,
                "showDayOfWeek": false,
                "format": "MM-dd-uuuu",
                "timeZone": "America/New_York"};
        var mmddyyyy_FieldInfo = [mmddyyyy];
        var expectedRecords_MMDDYYYY =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showDayOfWeek flag
        var mmddyyyy_ShowDayOfWeek_FieldInfo = JSON.parse(JSON.stringify(mmddyyyy));
        mmddyyyy_ShowDayOfWeek_FieldInfo.showDayOfWeek = true;
        mmddyyyy_ShowDayOfWeek_FieldInfo = [mmddyyyy_ShowDayOfWeek_FieldInfo];
        var expectedRecords_MMDDYYYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, 04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showTimeZone flag
        var mmddyyyy_ShowTimeZone_FieldInfo = JSON.parse(JSON.stringify(mmddyyyy));
        mmddyyyy_ShowTimeZone_FieldInfo.showTimeZone = true;
        mmddyyyy_ShowTimeZone_FieldInfo = [mmddyyyy_ShowTimeZone_FieldInfo];
        var expectedRecords_MMDDYYYY_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "04-12-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showTimeZone flag
        var mmddyyyy_ShowMonthAsName_FieldInfo = JSON.parse(JSON.stringify(mmddyyyy));
        mmddyyyy_ShowMonthAsName_FieldInfo.showMonthAsName = true;
        mmddyyyy_ShowMonthAsName_FieldInfo = [mmddyyyy_ShowMonthAsName_FieldInfo];
        var expectedRecords_MMDDYYYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Apr-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and all flags enabled
        var mmddyyyy_AllFlags_FieldInfo = JSON.parse(JSON.stringify(mmddyyyy));
        mmddyyyy_AllFlags_FieldInfo.showTime = true;
        mmddyyyy_AllFlags_FieldInfo.showTimeZone = true;
        mmddyyyy_AllFlags_FieldInfo.showMonthAsName = true;
        mmddyyyy_AllFlags_FieldInfo.showDayOfWeek = true;
        mmddyyyy_AllFlags_FieldInfo = [mmddyyyy_AllFlags_FieldInfo];
        var expectedRecords_MMDDYYYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, Apr-12-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showTime flag set to false
        var mmddyyyy_ShowTimeDisabled_FieldInfo = JSON.parse(JSON.stringify(mmddyyyy));
        mmddyyyy_ShowTimeDisabled_FieldInfo.showTime = false;
        mmddyyyy_ShowTimeDisabled_FieldInfo = [mmddyyyy_ShowTimeDisabled_FieldInfo];
        var expectedRecords_MMDDYYYY_ShowTimeDisabled =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "04-12-2015"}]];

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
            { message: "dateTime with MM_DD_YYYY format and showTime flag", records: recordsInput, fieldInfo: mmddyyyy_FieldInfo, expectedRecords: expectedRecords_MMDDYYYY },
            { message: "dateTime with MM_DD_YYYY format and showDayOfWeek flag", records: recordsInput, fieldInfo: mmddyyyy_ShowDayOfWeek_FieldInfo, expectedRecords: expectedRecords_MMDDYYYY_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTimeZone flag", records: recordsInput, fieldInfo: mmddyyyy_ShowTimeZone_FieldInfo, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone },
            { message: "dateTime with MM_DD_YYYY format and showMonthAsName flag", records: recordsInput, fieldInfo: mmddyyyy_ShowMonthAsName_FieldInfo, expectedRecords: expectedRecords_MMDDYYYY_ShowMonthAsName },
            { message: "dateTime with MM_DD_YYYY format and with all flags", records: recordsInput, fieldInfo: mmddyyyy_AllFlags_FieldInfo, expectedRecords: expectedRecords_MMDDYYYY_AllFlags },
            { message: "dateTime with MM_DD_YYYY format and showTime flag disabled", records: recordsInput, fieldInfo: mmddyyyy_ShowTimeDisabled_FieldInfo, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeDisabled },
            // TODO: Current returns "Invalid date" in display for empty date
            //{ message: "empty dateTime with MM_DD_YYYY format", records: emptyRecords, fieldInfo: mmddyyyy_FieldInfo, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with MM_DD_YYYY format", records: nullRecords, fieldInfo: mmddyyyy_FieldInfo, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various MM_DD_YYYY DateTime records for display', function () {
        mmddyyyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            console.log('FIELD INFO: ' + JSON.stringify(entry.fieldInfo));
            console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function mmddyyDataProvider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19+00:00"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format
        // TODO: Determine how to use the constants in dateTime formatter to set format???
        var mmddyy = {
            "id": 7,
            "name": "datetime",
            "type": "DATE_TIME",
            "showTime": true,
            "showTimeZone": false,
            "showMonthAsName": false,
            "showDayOfWeek": false,
            "format": "MM-dd-uu",
            "timeZone": "America/New_York"};
        var mmddyy_FieldInfo = [mmddyy];
        var expectedRecords_MMDDYY =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19+00:00",
                "display": "04-12-15 1:51 AM"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and showDayOfWeek flag
        var mmddyy_ShowDayOfWeek_FieldInfo = JSON.parse(JSON.stringify(mmddyy));
        mmddyy_ShowDayOfWeek_FieldInfo.showDayOfWeek = true;
        mmddyy_ShowDayOfWeek_FieldInfo = [mmddyy_ShowDayOfWeek_FieldInfo];
        var expectedRecords_MMDDYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19+00:00",
                "display": "Sunday, 04-12-15 1:51 AM"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and showTimeZone flag
        var mmddyy_ShowTimeZone_FieldInfo = JSON.parse(JSON.stringify(mmddyy));
        mmddyy_ShowTimeZone_FieldInfo.showTimeZone = true;
        mmddyy_ShowTimeZone_FieldInfo = [mmddyy_ShowTimeZone_FieldInfo];
        var expectedRecords_MMDDYY_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19+00:00",
                "display": "04-12-15 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and showTimeZone flag
        var mmddyy_ShowMonthAsName_FieldInfo = JSON.parse(JSON.stringify(mmddyy));
        mmddyy_ShowMonthAsName_FieldInfo.showMonthAsName = true;
        mmddyy_ShowMonthAsName_FieldInfo = [mmddyy_ShowMonthAsName_FieldInfo];
        var expectedRecords_MMDDYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19+00:00",
                "display": "Apr-12-15 1:51 AM"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and all flags enabled
        var mmddyy_AllFlags_FieldInfo = JSON.parse(JSON.stringify(mmddyy));
        mmddyy_AllFlags_FieldInfo.showTime = true;
        mmddyy_AllFlags_FieldInfo.showTimeZone = true;
        mmddyy_AllFlags_FieldInfo.showMonthAsName = true;
        mmddyy_AllFlags_FieldInfo.showDayOfWeek = true;
        mmddyy_AllFlags_FieldInfo = [mmddyy_AllFlags_FieldInfo];
        var expectedRecords_MMDDYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19+00:00",
                "display": "Sunday, Apr-12-15 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and showTime flag set to false
        var mmddyy_ShowTimeDisabled_FieldInfo = JSON.parse(JSON.stringify(mmddyy));
        mmddyy_ShowTimeDisabled_FieldInfo.showTime = false;
        mmddyy_ShowTimeDisabled_FieldInfo = [mmddyy_ShowTimeDisabled_FieldInfo];
        var expectedRecords_MMDDYY_ShowTimeDisabled =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19+00:00",
                "display": "04-12-15"}]];

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
            { message: "dateTime with MM_DD_YY format and showTime flag", records: recordsInput, fieldInfo: mmddyy_FieldInfo, expectedRecords: expectedRecords_MMDDYY },
            { message: "dateTime with MM_DD_YY format and showDayOfWeek flag", records: recordsInput, fieldInfo: mmddyy_ShowDayOfWeek_FieldInfo, expectedRecords: expectedRecords_MMDDYY_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showTimeZone flag", records: recordsInput, fieldInfo: mmddyy_ShowTimeZone_FieldInfo, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone },
            { message: "dateTime with MM_DD_YY format and showMonthAsName flag", records: recordsInput, fieldInfo: mmddyy_ShowMonthAsName_FieldInfo, expectedRecords: expectedRecords_MMDDYY_ShowMonthAsName },
            { message: "dateTime with MM_DD_YY format and with all flags", records: recordsInput, fieldInfo: mmddyy_AllFlags_FieldInfo, expectedRecords: expectedRecords_MMDDYY_AllFlags },
            { message: "dateTime with MM_DD_YY format and showTime flag disabled", records: recordsInput, fieldInfo: mmddyy_ShowTimeDisabled_FieldInfo, expectedRecords: expectedRecords_MMDDYY_ShowTimeDisabled },
            // TODO: Current returns "Invalid date" in display for empty date
            //{ message: "empty dateTime with MM_DD_YY format", records: emptyRecords, fieldInfo: mmddyy_FieldInfo, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with MM_DD_YY format", records: nullRecords, fieldInfo: mmddyy_FieldInfo, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various MM_DD_YY DateTime records for display', function () {
        mmddyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            console.log('FIELD INFO: ' + JSON.stringify(entry.fieldInfo));
            console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });
});