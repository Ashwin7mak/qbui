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
                "showTime": false,
                "showTimeZone": false,
                "showMonthAsName": false,
                "showDayOfWeek": false,
                "format": "MM-dd-uuuu",
                "timeZone": "America/New_York"};
        var fieldInfo_MMDDYYYY = [mmddyyyy];
        var expectedRecords_MMDDYYYY =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "04-12-2015"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime = [fieldInfo_MMDDYYYY_ShowTime];
        var expectedRecords_MMDDYYYY_ShowTime =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowTimeZone flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone = [fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone];
        var expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "04-12-2015 2:51 PM EDT"}]];


        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowMonthAsName flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowTime_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Apr-12-2015 2:51 PM"}]];


        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTime_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, 04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Apr-12-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, 04-12-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, Apr-12-2015 2:51 PM"}]];


        // FieldInfo and record expectation for field with MM_DD_YYYY format and showDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, 04-12-2015"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showTimeZone flag
        var fieldInfo_MMDDYYYY_ShowTimeZone = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone = [fieldInfo_MMDDYYYY_ShowTimeZone];
        var expectedRecords_MMDDYYYY_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "04-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTimeZone, ShowMonthAsName flag
        var fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Apr-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, 04-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTimeZone, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, Apr-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowMonthAsName flag
        var fieldInfo_MMDDYYYY_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Apr-12-2015"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, Apr-12-2015"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and all flags enabled
        var fieldInfo_MMDDYYYY_AllFlags = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_AllFlags.showTime = true;
        fieldInfo_MMDDYYYY_AllFlags.showTimeZone = true;
        fieldInfo_MMDDYYYY_AllFlags.showMonthAsName = true;
        fieldInfo_MMDDYYYY_AllFlags.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_AllFlags = [fieldInfo_MMDDYYYY_AllFlags];
        var expectedRecords_MMDDYYYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19+00:00",
                "display": "Sunday, Apr-12-2015 2:51 PM EDT"}]];


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
                "display": ""}]];

        return [
            { message: "dateTime with MM_DD_YYYY format and no flags", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY, expectedRecords: expectedRecords_MMDDYYYY },
            { message: "dateTime with MM_DD_YYYY format and showTime flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime, expectedRecords: expectedRecords_MMDDYYYY_ShowTime },
            { message: "dateTime with MM_DD_YYYY format and showTime, showTimeZone flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone },
            { message: "dateTime with MM_DD_YYYY format and showTime, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowMonthAsName },
            { message: "dateTime with MM_DD_YYYY format and showTime, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with MM_DD_YYYY format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone },
            { message: "dateTime with MM_DD_YYYY format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with MM_DD_YYYY format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYYYY_ShowMonthAsName },
            { message: "dateTime with MM_DD_YYYY format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and all flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_AllFlags, expectedRecords: expectedRecords_MMDDYYYY_AllFlags },
            // TODO: Current returns "Invalid date" in display for empty date
            //{ message: "empty dateTime with MM_DD_YYYY format", records: emptyRecords, fieldInfo: mmddyyyy_FieldInfo, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with MM_DD_YYYY format", records: nullRecords, fieldInfo: fieldInfo_MMDDYYYY, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various MM_DD_YYYY DateTime records for display', function () {
        mmddyyyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function mmddyyDataProvider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format
        // TODO: Determine how to use the constants in dateTime formatter to set format???
        var mmddyy = {
            "id": 7,
            "name": "datetime",
            "type": "DATE_TIME",
            "showTime": false,
            "showTimeZone": false,
            "showMonthAsName": false,
            "showDayOfWeek": false,
            "format": "MM-dd-uu",
            "timeZone": "America/New_York"};
        var fieldInfo_MMDDYY = [mmddyy];
        var expectedRecords_MMDDYY =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12-15"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and showDayOfWeek flag
        var fieldInfo_MMDDYY_ShowTime = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime.showTime = true;
        fieldInfo_MMDDYY_ShowTime = [fieldInfo_MMDDYY_ShowTime];
        var expectedRecords_MMDDYY_ShowTime =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12-15 1:51 AM"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowTimeZone flag
        var fieldInfo_MMDDYY_ShowTime_ShowTimeZone = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone = [fieldInfo_MMDDYY_ShowTime_ShowTimeZone];
        var expectedRecords_MMDDYY_ShowTime_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12-15 1:51 AM EDT"}]];


        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowMonthAsName flag
        var fieldInfo_MMDDYY_ShowTime_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName = [fieldInfo_MMDDYY_ShowTime_ShowMonthAsName];
        var expectedRecords_MMDDYY_ShowTime_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12-15 1:51 AM"}]];


        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_MMDDYY_ShowTime_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowDayOfWeek.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowTime_ShowDayOfWeek = [fieldInfo_MMDDYY_ShowTime_ShowDayOfWeek];
        var expectedRecords_MMDDYY_ShowTime_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12-15 1:51 AM"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName = [fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12-15 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek = [fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12-15 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12-15 1:51 AM"}]];


        // FieldInfo and record expectation for field with MM_DD_YY format and showDayOfWeek flag
        var fieldInfo_MMDDYY_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowDayOfWeek = [fieldInfo_MMDDYY_ShowDayOfWeek];
        var expectedRecords_MMDDYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12-15"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and showTimeZone flag
        var fieldInfo_MMDDYY_ShowTimeZone = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTimeZone.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTimeZone = [fieldInfo_MMDDYY_ShowTimeZone];
        var expectedRecords_MMDDYY_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12-15 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTimeZone, ShowMonthAsName flag
        var fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName = [fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_MMDDYY_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12-15 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek = [fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_MMDDYY_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12-15 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTimeZone, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12-15 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowMonthAsName flag
        var fieldInfo_MMDDYY_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowMonthAsName = [fieldInfo_MMDDYY_ShowMonthAsName];
        var expectedRecords_MMDDYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12-15"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_MMDDYY_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_MMDDYY_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_MMDDYY_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12-15"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and all flags enabled
        var fieldInfo_MMDDYY_AllFlags = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_AllFlags.showTime = true;
        fieldInfo_MMDDYY_AllFlags.showTimeZone = true;
        fieldInfo_MMDDYY_AllFlags.showMonthAsName = true;
        fieldInfo_MMDDYY_AllFlags.showDayOfWeek = true;
        fieldInfo_MMDDYY_AllFlags = [fieldInfo_MMDDYY_AllFlags];
        var expectedRecords_MMDDYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12-15 1:51 AM EDT"}]];


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
                "display": ""}]];

        return [
            { message: "dateTime with MM_DD_YY format and no flags", records: recordsInput, fieldInfo: fieldInfo_MMDDYY, expectedRecords: expectedRecords_MMDDYY },
            { message: "dateTime with MM_DD_YY format and showTime flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime, expectedRecords: expectedRecords_MMDDYY_ShowTime },
            { message: "dateTime with MM_DD_YY format and showTime, showTimeZone flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowTimeZone, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowTimeZone },
            { message: "dateTime with MM_DD_YY format and showTime, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowMonthAsName },
            { message: "dateTime with MM_DD_YY format and showTime, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with MM_DD_YY format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone },
            { message: "dateTime with MM_DD_YY format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with MM_DD_YY format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYY_ShowMonthAsName },
            { message: "dateTime with MM_DD_YY format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and all flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_AllFlags, expectedRecords: expectedRecords_MMDDYY_AllFlags },
            // TODO: Current returns "Invalid date" in display for empty date
            //{ message: "empty dateTime with MM_DD_YY format", records: emptyRecords, fieldInfo: fieldInfo_MMDDYY, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with MM_DD_YY format", records: nullRecords, fieldInfo: fieldInfo_MMDDYY, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various MM_DD_YY DateTime records for display', function () {
        mmddyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function ddmmyyDataProvider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format
        // TODO: Determine how to use the constants in dateTime formatter to set format???
        var ddmmyy = {
            "id": 7,
            "name": "datetime",
            "type": "DATE_TIME",
            "showTime": false,
            "showTimeZone": false,
            "showMonthAsName": false,
            "showDayOfWeek": false,
            "format": "dd-MM-uu",
            "timeZone": "America/New_York"};
        var fieldInfo_DDMMYY = [ddmmyy];
        var expectedRecords_DDMMYY =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04-15"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and showDayOfWeek flag
        var fieldInfo_DDMMYY_ShowTime = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime.showTime = true;
        fieldInfo_DDMMYY_ShowTime = [fieldInfo_DDMMYY_ShowTime];
        var expectedRecords_DDMMYY_ShowTime =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04-15 1:51 AM"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowTimeZone flag
        var fieldInfo_DDMMYY_ShowTime_ShowTimeZone = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone = [fieldInfo_DDMMYY_ShowTime_ShowTimeZone];
        var expectedRecords_DDMMYY_ShowTime_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04-15 1:51 AM EDT"}]];


        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowMonthAsName flag
        var fieldInfo_DDMMYY_ShowTime_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName = [fieldInfo_DDMMYY_ShowTime_ShowMonthAsName];
        var expectedRecords_DDMMYY_ShowTime_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr-15 1:51 AM"}]];


        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_DDMMYY_ShowTime_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowDayOfWeek.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowTime_ShowDayOfWeek = [fieldInfo_DDMMYY_ShowTime_ShowDayOfWeek];
        var expectedRecords_DDMMYY_ShowTime_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04-15 1:51 AM"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName = [fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr-15 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek = [fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04-15 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr-15 1:51 AM"}]];


        // FieldInfo and record expectation for field with DD_MM_YY format and showDayOfWeek flag
        var fieldInfo_DDMMYY_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowDayOfWeek = [fieldInfo_DDMMYY_ShowDayOfWeek];
        var expectedRecords_DDMMYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04-15"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and showTimeZone flag
        var fieldInfo_DDMMYY_ShowTimeZone = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTimeZone.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTimeZone = [fieldInfo_DDMMYY_ShowTimeZone];
        var expectedRecords_DDMMYY_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04-15 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTimeZone, ShowMonthAsName flag
        var fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName = [fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_DDMMYY_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr-15 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek = [fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_DDMMYY_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04-15 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTimeZone, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr-15 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowMonthAsName flag
        var fieldInfo_DDMMYY_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowMonthAsName = [fieldInfo_DDMMYY_ShowMonthAsName];
        var expectedRecords_DDMMYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr-15"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_DDMMYY_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_DDMMYY_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_DDMMYY_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr-15"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and all flags enabled
        var fieldInfo_DDMMYY_AllFlags = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_AllFlags.showTime = true;
        fieldInfo_DDMMYY_AllFlags.showTimeZone = true;
        fieldInfo_DDMMYY_AllFlags.showMonthAsName = true;
        fieldInfo_DDMMYY_AllFlags.showDayOfWeek = true;
        fieldInfo_DDMMYY_AllFlags = [fieldInfo_DDMMYY_AllFlags];
        var expectedRecords_DDMMYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr-15 1:51 AM EDT"}]];


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
                "display": ""}]];

        return [
            { message: "dateTime with DD_MM_YY format and no flags", records: recordsInput, fieldInfo: fieldInfo_DDMMYY, expectedRecords: expectedRecords_DDMMYY },
            { message: "dateTime with DD_MM_YY format and showTime flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime, expectedRecords: expectedRecords_DDMMYY_ShowTime },
            { message: "dateTime with DD_MM_YY format and showTime, showTimeZone flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowTimeZone, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowTimeZone },
            { message: "dateTime with DD_MM_YY format and showTime, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowMonthAsName },
            { message: "dateTime with DD_MM_YY format and showTime, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with DD_MM_YY format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone },
            { message: "dateTime with DD_MM_YY format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with DD_MM_YY format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYY_ShowMonthAsName },
            { message: "dateTime with DD_MM_YY format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and all flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_AllFlags, expectedRecords: expectedRecords_DDMMYY_AllFlags },
            // TODO: Current returns "Invalid date" in display for empty date
            //{ message: "empty dateTime with DD_MM_YY format", records: emptyRecords, fieldInfo: fieldInfo_DDMMYY, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with DD_MM_YY format", records: nullRecords, fieldInfo: fieldInfo_DDMMYY, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various DD_MM_YY DateTime records for display', function () {
        ddmmyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function ddmmyyyyDataProvider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format
        // TODO: Determine how to use the constants in dateTime formatter to set format???
        var ddmmyyyy = {
            "id": 7,
            "name": "datetime",
            "type": "DATE_TIME",
            "showTime": false,
            "showTimeZone": false,
            "showMonthAsName": false,
            "showDayOfWeek": false,
            "format": "dd-MM-uuuu",
            "timeZone": "America/New_York"};
        var fieldInfo_DDMMYYYY = [ddmmyyyy];
        var expectedRecords_DDMMYYYY =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04-2015"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and showDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime = [fieldInfo_DDMMYYYY_ShowTime];
        var expectedRecords_DDMMYYYY_ShowTime =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04-2015 1:51 AM"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowTimeZone flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone = [fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone];
        var expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04-2015 1:51 AM EDT"}]];


        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowMonthAsName flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowTime_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr-2015 1:51 AM"}]];


        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTime_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04-2015 1:51 AM"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr-2015 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04-2015 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr-2015 1:51 AM"}]];


        // FieldInfo and record expectation for field with DD_MM_YYYY format and showDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04-2015"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and showTimeZone flag
        var fieldInfo_DDMMYYYY_ShowTimeZone = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone = [fieldInfo_DDMMYYYY_ShowTimeZone];
        var expectedRecords_DDMMYYYY_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04-2015 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTimeZone, ShowMonthAsName flag
        var fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr-2015 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04-2015 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTimeZone, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr-2015 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowMonthAsName flag
        var fieldInfo_DDMMYYYY_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr-2015"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr-2015"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and all flags enabled
        var fieldInfo_DDMMYYYY_AllFlags = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_AllFlags.showTime = true;
        fieldInfo_DDMMYYYY_AllFlags.showTimeZone = true;
        fieldInfo_DDMMYYYY_AllFlags.showMonthAsName = true;
        fieldInfo_DDMMYYYY_AllFlags.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_AllFlags = [fieldInfo_DDMMYYYY_AllFlags];
        var expectedRecords_DDMMYYYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr-2015 1:51 AM EDT"}]];


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
                "display": ""}]];

        return [
            { message: "dateTime with DD_MM_YYYY format and no flags", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY, expectedRecords: expectedRecords_DDMMYYYY },
            { message: "dateTime with DD_MM_YYYY format and showTime flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime, expectedRecords: expectedRecords_DDMMYYYY_ShowTime },
            { message: "dateTime with DD_MM_YYYY format and showTime, showTimeZone flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone },
            { message: "dateTime with DD_MM_YYYY format and showTime, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowMonthAsName },
            { message: "dateTime with DD_MM_YYYY format and showTime, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with DD_MM_YYYY format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone },
            { message: "dateTime with DD_MM_YYYY format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with DD_MM_YYYY format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYYYY_ShowMonthAsName },
            { message: "dateTime with DD_MM_YYYY format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and all flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_AllFlags, expectedRecords: expectedRecords_DDMMYYYY_AllFlags },
            // TODO: Current returns "Invalid date" in display for empty date
            //{ message: "empty dateTime with DD_MM_YYYY format", records: emptyRecords, fieldInfo: fieldInfo_DDMMYYYY, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with DD_MM_YYYY format", records: nullRecords, fieldInfo: fieldInfo_DDMMYYYY, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various DD_MM_YYYY DateTime records for display', function () {
        ddmmyyyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function yyyymmddDataProvider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format
        // TODO: Determine how to use the constants in dateTime formatter to set format???
        var yyyymmdd = {
            "id": 7,
            "name": "datetime",
            "type": "DATE_TIME",
            "showTime": false,
            "showTimeZone": false,
            "showMonthAsName": false,
            "showDayOfWeek": false,
            "format": "uuuu-MM-dd",
            "timeZone": "America/New_York"};
        var fieldInfo_YYYYMMDD = [yyyymmdd];
        var expectedRecords_YYYYMMDD =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "2015-04-12"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and showDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowTime = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime = [fieldInfo_YYYYMMDD_ShowTime];
        var expectedRecords_YYYYMMDD_ShowTime =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "2015-04-12 1:51 AM"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowTimeZone flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone = [fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone];
        var expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "2015-04-12 1:51 AM EDT"}]];


        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowMonthAsName flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName = [fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName];
        var expectedRecords_YYYYMMDD_ShowTime_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "2015-Apr-12 1:51 AM"}]];


        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowDayOfWeek = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowDayOfWeek.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowDayOfWeek = [fieldInfo_YYYYMMDD_ShowTime_ShowDayOfWeek];
        var expectedRecords_YYYYMMDD_ShowTime_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-04-12 1:51 AM"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName = [fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "2015-Apr-12 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek = [fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-04-12 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-Apr-12 1:51 AM"}]];


        // FieldInfo and record expectation for field with YYYY_MM_DD format and showDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowDayOfWeek = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowDayOfWeek = [fieldInfo_YYYYMMDD_ShowDayOfWeek];
        var expectedRecords_YYYYMMDD_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-04-12"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and showTimeZone flag
        var fieldInfo_YYYYMMDD_ShowTimeZone = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTimeZone.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTimeZone = [fieldInfo_YYYYMMDD_ShowTimeZone];
        var expectedRecords_YYYYMMDD_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "2015-04-12 EDT"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTimeZone, ShowMonthAsName flag
        var fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName = [fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_YYYYMMDD_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "2015-Apr-12 EDT"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek = [fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_YYYYMMDD_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-04-12 EDT"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTimeZone, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-Apr-12 EDT"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowMonthAsName flag
        var fieldInfo_YYYYMMDD_ShowMonthAsName = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowMonthAsName = [fieldInfo_YYYYMMDD_ShowMonthAsName];
        var expectedRecords_YYYYMMDD_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "2015-Apr-12"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-Apr-12"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and all flags enabled
        var fieldInfo_YYYYMMDD_AllFlags = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_AllFlags.showTime = true;
        fieldInfo_YYYYMMDD_AllFlags.showTimeZone = true;
        fieldInfo_YYYYMMDD_AllFlags.showMonthAsName = true;
        fieldInfo_YYYYMMDD_AllFlags.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_AllFlags = [fieldInfo_YYYYMMDD_AllFlags];
        var expectedRecords_YYYYMMDD_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-Apr-12 1:51 AM EDT"}]];


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
                "display": ""}]];

        return [
            { message: "dateTime with YYYY_MM_DD format and no flags", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD, expectedRecords: expectedRecords_YYYYMMDD },
            { message: "dateTime with YYYY_MM_DD format and showTime flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime, expectedRecords: expectedRecords_YYYYMMDD_ShowTime },
            { message: "dateTime with YYYY_MM_DD format and showTime, showTimeZone flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone },
            { message: "dateTime with YYYY_MM_DD format and showTime, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowMonthAsName },
            { message: "dateTime with YYYY_MM_DD format and showTime, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with YYYY_MM_DD format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone },
            { message: "dateTime with YYYY_MM_DD format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with YYYY_MM_DD format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowMonthAsName, expectedRecords: expectedRecords_YYYYMMDD_ShowMonthAsName },
            { message: "dateTime with YYYY_MM_DD format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and all flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_AllFlags, expectedRecords: expectedRecords_YYYYMMDD_AllFlags },
            // TODO: Current returns "Invalid date" in display for empty date
            //{ message: "empty dateTime with YYYY_MM_DD format", records: emptyRecords, fieldInfo: fieldInfo_YYYYMMDD, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with YYYY_MM_DD format", records: nullRecords, fieldInfo: fieldInfo_YYYYMMDD, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various YYYY_MM_DD DateTime records for display', function () {
        yyyymmddDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });
});