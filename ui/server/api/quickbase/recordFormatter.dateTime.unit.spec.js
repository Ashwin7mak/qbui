'use strict';

var should = require('should');
var recordFormatter = require('./recordFormatter')();
var assert = require('assert');

describe('DateTime record formatter unit test', function () {

    function mmddyyyyDataProvider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T18:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T18:51:19z"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format
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
                "value": "2015-04-12T18:51:19z",
                "display": "04-12-2015"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime = [fieldInfo_MMDDYYYY_ShowTime];
        var expectedRecords_MMDDYYYY_ShowTime =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowTimeZone flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone = [fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone];
        var expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12-2015 2:51 PM EDT"}]];


        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowMonthAsName flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowTime_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015 2:51 PM"}]];


        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTime_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTime_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowTime_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowTime_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowTime_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowTime_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12 2:51 PM"}]];
        var expectedRecords_MMDDYYYY_ShowTime_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "04-12-2000 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTime, ShowMonthAsName, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12 2:51 PM"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and showTimeZone flag
        var fieldInfo_MMDDYYYY_ShowTimeZone = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone = [fieldInfo_MMDDYYYY_ShowTimeZone];
        var expectedRecords_MMDDYYYY_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTimeZone, ShowMonthAsName flag
        var fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTimeZone, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTimeZone, ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowTimeZone, ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowMonthAsName flag
        var fieldInfo_MMDDYYYY_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12-2015"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and HideYearIfCurrent flag
        var fieldInfo_MMDDYYYY_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_HideYearIfCurrent = [fieldInfo_MMDDYYYY_HideYearIfCurrent];
        var expectedRecords_MMDDYYYY_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12"}]];
        var expectedRecords_MMDDYYYY_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "04-12-2000"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and all flags enabled
        var fieldInfo_MMDDYYYY_AllFlags = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_AllFlags.showTime = true;
        fieldInfo_MMDDYYYY_AllFlags.showTimeZone = true;
        fieldInfo_MMDDYYYY_AllFlags.showMonthAsName = true;
        fieldInfo_MMDDYYYY_AllFlags.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_AllFlags.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_AllFlags = [fieldInfo_MMDDYYYY_AllFlags];
        var expectedRecords_MMDDYYYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12 2:51 PM EDT"}]];
        var expectedRecords_MMDDYYYY_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "Wednesday, Apr-12-2000 2:51 PM EDT"}]];


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
            { message: "dateTime with MM_DD_YYYY format and showTime, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and showTime, hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_HideYearIfCurrent_DiffYear },
            { message: "dateTime with MM_DD_YYYY format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with MM_DD_YYYY format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTime, showTimeZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and showTime, showTimeZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and showTime, showTimeZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTime, showMonthAsName, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone },
            { message: "dateTime with MM_DD_YYYY format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with MM_DD_YYYY format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTimZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showTimZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and showTimZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYYYY_ShowMonthAsName },
            { message: "dateTime with MM_DD_YYYY format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YYYY format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YYYY format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYYYY_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_HideYearIfCurrent_DiffYear },
            { message: "dateTime with MM_DD_YYYY format and all flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_AllFlags, expectedRecords: expectedRecords_MMDDYYYY_AllFlags },
            { message: "dateTime with MM_DD_YYYY format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYYYY_AllFlags, expectedRecords: expectedRecords_MMDDYYYY_AllFlags_DiffYear },
            { message: "empty dateTime with MM_DD_YYYY format", records: emptyRecords, fieldInfo: fieldInfo_MMDDYYYY, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with MM_DD_YYYY format", records: nullRecords, fieldInfo: fieldInfo_MMDDYYYY, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various MM_DD_YYYY DateTime records for display', function () {
        mmddyyyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function mmddyyDataProvider() {

        //// Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format
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

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowTime_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYY_ShowTime_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowTime_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowTime_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowTime_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12 1:51 AM"}]];
        var expectedRecords_MMDDYY_ShowTime_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "04-12-00 1:51 AM"}]];

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

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowTime_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowTime_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowTime_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12 1:51 AM EDT"}]];


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

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTime, ShowMonthAsName, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12 1:51 AM"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and showDayOfWeek flag
        var fieldInfo_MMDDYY_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowDayOfWeek = [fieldInfo_MMDDYY_ShowDayOfWeek];
        var expectedRecords_MMDDYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12-15"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12"}]];

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

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowTimeZone_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12 EDT"}]];

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

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTimeZone, ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12 EDT"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12 EDT"}]];


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

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_MMDDYY_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_MMDDYY_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_MMDDYY_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and HideYearIfCurrent flag
        var fieldInfo_MMDDYY_HideYearIfCurrent = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_HideYearIfCurrent = [fieldInfo_MMDDYY_HideYearIfCurrent];
        var expectedRecords_MMDDYY_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12"}]];
        var expectedRecords_MMDDYY_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "04-12-00"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and all flags enabled
        var fieldInfo_MMDDYY_AllFlags = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_AllFlags.showTime = true;
        fieldInfo_MMDDYY_AllFlags.showTimeZone = true;
        fieldInfo_MMDDYY_AllFlags.showMonthAsName = true;
        fieldInfo_MMDDYY_AllFlags.showDayOfWeek = true;
        fieldInfo_MMDDYY_AllFlags.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_AllFlags = [fieldInfo_MMDDYY_AllFlags];
        var expectedRecords_MMDDYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12 1:51 AM EDT"}]];
        var expectedRecords_MMDDYY_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "Wednesday, Apr-12-00 1:51 AM EDT"}]];


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
            { message: "dateTime with MM_DD_YY format and showTime, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowTime_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and showTime, hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYY_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowTime_HideYearIfCurrent_DiffYear },
            { message: "dateTime with MM_DD_YY format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with MM_DD_YY format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showTime, showTimeZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and showTime, showTimeZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and showTime, showTimeZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showTime, showMonthAsName, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone },
            { message: "dateTime with MM_DD_YY format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with MM_DD_YY format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showTimZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showTimZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and showTimZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYY_ShowMonthAsName },
            { message: "dateTime with MM_DD_YY format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowDayOfWeek },
            { message: "dateTime with MM_DD_YY format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_HideYearIfCurrent },
            { message: "dateTime with MM_DD_YY format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYY_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_HideYearIfCurrent_DiffYear },
            { message: "dateTime with MM_DD_YY format and all flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_AllFlags, expectedRecords: expectedRecords_MMDDYY_AllFlags },
            { message: "dateTime with MM_DD_YY format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYY_AllFlags, expectedRecords: expectedRecords_MMDDYY_AllFlags_DiffYear },
            { message: "empty dateTime with MM_DD_YY format", records: emptyRecords, fieldInfo: fieldInfo_MMDDYY, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with MM_DD_YY format", records: nullRecords, fieldInfo: fieldInfo_MMDDYY, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various MM_DD_YY DateTime records for display', function () {
        mmddyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function ddmmyyDataProvider() {

        //// Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format
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

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowTime_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYY_ShowTime_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowTime_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowTime_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowTime_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04 1:51 AM"}]];
        var expectedRecords_DDMMYY_ShowTime_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "12-04-00 1:51 AM"}]];

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

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowTime_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowTime_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowTime_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr 1:51 AM EDT"}]];


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

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTime, ShowMonthAsName, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr 1:51 AM"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and showDayOfWeek flag
        var fieldInfo_DDMMYY_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowDayOfWeek = [fieldInfo_DDMMYY_ShowDayOfWeek];
        var expectedRecords_DDMMYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04-15"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04"}]];

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

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowTimeZone_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04 EDT"}]];

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

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTimeZone, ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-04 EDT"}]];


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

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_DDMMYY_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_DDMMYY_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_DDMMYY_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and HideYearIfCurrent flag
        var fieldInfo_DDMMYY_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_HideYearIfCurrent = [fieldInfo_DDMMYY_HideYearIfCurrent];
        var expectedRecords_DDMMYY_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-04"}]];
        var expectedRecords_DDMMYY_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "12-04-00"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and all flags enabled
        var fieldInfo_DDMMYY_AllFlags = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_AllFlags.showTime = true;
        fieldInfo_DDMMYY_AllFlags.showTimeZone = true;
        fieldInfo_DDMMYY_AllFlags.showMonthAsName = true;
        fieldInfo_DDMMYY_AllFlags.showDayOfWeek = true;
        fieldInfo_DDMMYY_AllFlags.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_AllFlags = [fieldInfo_DDMMYY_AllFlags];
        var expectedRecords_DDMMYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr 1:51 AM EDT"}]];
        var expectedRecords_DDMMYY_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "Wednesday, 12-Apr-00 1:51 AM EDT"}]];


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
            { message: "dateTime with DD_MM_YY format and showTime, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowTime_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and showTime, hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYY_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowTime_HideYearIfCurrent_DiffYear },
            { message: "dateTime with DD_MM_YY format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with DD_MM_YY format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showTime, showTimeZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and showTime, showTimeZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and showTime, showTimeZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showTime, showMonthAsName, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone },
            { message: "dateTime with DD_MM_YY format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with DD_MM_YY format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showTimZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showTimZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and showTimZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYY_ShowMonthAsName },
            { message: "dateTime with DD_MM_YY format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YY format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YY format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYY_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_HideYearIfCurrent_DiffYear },
            { message: "dateTime with DD_MM_YY format and all flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_AllFlags, expectedRecords: expectedRecords_DDMMYY_AllFlags },
            { message: "dateTime with DD_MM_YY format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYY_AllFlags, expectedRecords: expectedRecords_DDMMYY_AllFlags_DiffYear },
            { message: "empty dateTime with DD_MM_YY format", records: emptyRecords, fieldInfo: fieldInfo_DDMMYY, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with DD_MM_YY format", records: nullRecords, fieldInfo: fieldInfo_DDMMYY, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various DD_MM_YY DateTime records for display', function () {
        ddmmyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function ddmmyyyyDataProvider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T18:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T18:51:19z"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format
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
                "value": "2015-04-12T18:51:19z",
                "display": "12-04-2015"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and showDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime = [fieldInfo_DDMMYYYY_ShowTime];
        var expectedRecords_DDMMYYYY_ShowTime =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-04-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowTimeZone flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone = [fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone];
        var expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-04-2015 2:51 PM EDT"}]];


        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowMonthAsName flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowTime_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-Apr-2015 2:51 PM"}]];


        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTime_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTime_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-04-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowTime_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowTime_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowTime_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowTime_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-04 2:51 PM"}]];
        var expectedRecords_DDMMYYYY_ShowTime_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "12-04-2000 2:51 PM"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-Apr-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-Apr 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-04-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-04 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-04 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-Apr-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTime, ShowMonthAsName, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-Apr 2:51 PM"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-04-2015"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-04"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and showTimeZone flag
        var fieldInfo_DDMMYYYY_ShowTimeZone = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone = [fieldInfo_DDMMYYYY_ShowTimeZone];
        var expectedRecords_DDMMYYYY_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-04-2015 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTimeZone, ShowMonthAsName flag
        var fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-Apr-2015 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-04-2015 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-04 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTimeZone, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-Apr-2015 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTimeZone, ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-Apr EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowTimeZone, ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-04 EDT"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowMonthAsName flag
        var fieldInfo_DDMMYYYY_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-Apr-2015"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-Apr-2015"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-Apr"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and HideYearIfCurrent flag
        var fieldInfo_DDMMYYYY_HideYearIfCurrent = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_HideYearIfCurrent = [fieldInfo_DDMMYYYY_HideYearIfCurrent];
        var expectedRecords_DDMMYYYY_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-04"}]];
        var expectedRecords_DDMMYYYY_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "12-04-2000"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and all flags enabled
        var fieldInfo_DDMMYYYY_AllFlags = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_AllFlags.showTime = true;
        fieldInfo_DDMMYYYY_AllFlags.showTimeZone = true;
        fieldInfo_DDMMYYYY_AllFlags.showMonthAsName = true;
        fieldInfo_DDMMYYYY_AllFlags.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_AllFlags.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_AllFlags = [fieldInfo_DDMMYYYY_AllFlags];
        var expectedRecords_DDMMYYYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-Apr 2:51 PM EDT"}]];
        var expectedRecords_DDMMYYYY_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "Wednesday, 12-Apr-2000 2:51 PM EDT"}]];


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
            { message: "dateTime with DD_MM_YYYY format and showTime, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and showTime, hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_HideYearIfCurrent_DiffYear },
            { message: "dateTime with DD_MM_YYYY format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with DD_MM_YYYY format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showTime, showTimeZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and showTime, showTimeZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and showTime, showTimeZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showTime, showMonthAsName, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone },
            { message: "dateTime with DD_MM_YYYY format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with DD_MM_YYYY format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showTimZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showTimZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and showTimZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYYYY_ShowMonthAsName },
            { message: "dateTime with DD_MM_YYYY format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowDayOfWeek },
            { message: "dateTime with DD_MM_YYYY format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_HideYearIfCurrent },
            { message: "dateTime with DD_MM_YYYY format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYYYY_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_HideYearIfCurrent_DiffYear },
            { message: "dateTime with DD_MM_YYYY format and all flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_AllFlags, expectedRecords: expectedRecords_DDMMYYYY_AllFlags },
            { message: "dateTime with DD_MM_YYYY format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYYYY_AllFlags, expectedRecords: expectedRecords_DDMMYYYY_AllFlags_DiffYear },
            { message: "empty dateTime with DD_MM_YYYY format", records: emptyRecords, fieldInfo: fieldInfo_DDMMYYYY, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with DD_MM_YYYY format", records: nullRecords, fieldInfo: fieldInfo_DDMMYYYY, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various DD_MM_YYYY DateTime records for display', function () {
        ddmmyyyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function yyyymmddDataProvider() {

        //// Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format
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

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowTime_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_HideYearIfCurrent.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowTime_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowTime_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowTime_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12 1:51 AM"}]];
        var expectedRecords_YYYYMMDD_ShowTime_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "2000-04-12 1:51 AM"}]];

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

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_HideYearIfCurrent.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12 1:51 AM EDT"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12 1:51 AM EDT"}]];


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

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTime, ShowMonthAsName, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12 1:51 AM"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and showDayOfWeek flag
        var fieldInfo_YYYYMMDD_ShowDayOfWeek = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowDayOfWeek = [fieldInfo_YYYYMMDD_ShowDayOfWeek];
        var expectedRecords_YYYYMMDD_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-04-12"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12"}]];

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

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12 EDT"}]];

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

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTimeZone, ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12 EDT"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 04-12 EDT"}]];


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

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and HideYearIfCurrent flag
        var fieldInfo_YYYYMMDD_HideYearIfCurrent = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_HideYearIfCurrent = [fieldInfo_YYYYMMDD_HideYearIfCurrent];
        var expectedRecords_YYYYMMDD_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "04-12"}]];
        var expectedRecords_YYYYMMDD_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "2000-04-12"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and all flags enabled
        var fieldInfo_YYYYMMDD_AllFlags = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_AllFlags.showTime = true;
        fieldInfo_YYYYMMDD_AllFlags.showTimeZone = true;
        fieldInfo_YYYYMMDD_AllFlags.showMonthAsName = true;
        fieldInfo_YYYYMMDD_AllFlags.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_AllFlags.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_AllFlags = [fieldInfo_YYYYMMDD_AllFlags];
        var expectedRecords_YYYYMMDD_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12 1:51 AM EDT"}]];
        var expectedRecords_YYYYMMDD_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "Wednesday, 2000-Apr-12 1:51 AM EDT"}]];


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
            { message: "dateTime with YYYY_MM_DD format and showTime, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and showTime, hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_HideYearIfCurrent_DiffYear },
            { message: "dateTime with YYYY_MM_DD format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with YYYY_MM_DD format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showTime, showTimeZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and showTime, showTimeZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and showTime, showTimeZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showTime, showMonthAsName, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone },
            { message: "dateTime with YYYY_MM_DD format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with YYYY_MM_DD format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showTimZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showTimZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and showTimZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowMonthAsName, expectedRecords: expectedRecords_YYYYMMDD_ShowMonthAsName },
            { message: "dateTime with YYYY_MM_DD format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowDayOfWeek },
            { message: "dateTime with YYYY_MM_DD format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_HideYearIfCurrent },
            { message: "dateTime with YYYY_MM_DD format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_YYYYMMDD_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_HideYearIfCurrent_DiffYear },
            { message: "dateTime with YYYY_MM_DD format and all flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_AllFlags, expectedRecords: expectedRecords_YYYYMMDD_AllFlags },
            { message: "dateTime with YYYY_MM_DD format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_YYYYMMDD_AllFlags, expectedRecords: expectedRecords_YYYYMMDD_AllFlags_DiffYear },
            { message: "empty dateTime with YYYY_MM_DD format", records: emptyRecords, fieldInfo: fieldInfo_YYYYMMDD, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with YYYY_MM_DD format", records: nullRecords, fieldInfo: fieldInfo_YYYYMMDD, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various YYYY_MM_DD DateTime records for display', function () {
        yyyymmddDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    function invalidFormatDataProvider() {

        // Default DateTime record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T18:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T18:51:19z"}]];

        // FieldInfo and record expectation for field with invalid format
        var invalidFormat = {
            "id": 7,
            "name": "datetime",
            "type": "DATE_TIME",
            "showTime": false,
            "showTimeZone": false,
            "showMonthAsName": false,
            "showDayOfWeek": false,
            "format": "invalid_date_format",
            "timeZone": "America/New_York"};
        var fieldInfo_InvalidFormat = [invalidFormat];
        var expectedRecords_InvalidFormat =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12-2015"}]];

        // FieldInfo and record expectation for field with invalid format and showDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowTime = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime.showTime = true;
        fieldInfo_InvalidFormat_ShowTime = [fieldInfo_InvalidFormat_ShowTime];
        var expectedRecords_InvalidFormat_ShowTime =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowTimeZone flag
        var fieldInfo_InvalidFormat_ShowTime_ShowTimeZone = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone = [fieldInfo_InvalidFormat_ShowTime_ShowTimeZone];
        var expectedRecords_InvalidFormat_ShowTime_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12-2015 2:51 PM EDT"}]];


        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowMonthAsName flag
        var fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName = [fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName];
        var expectedRecords_InvalidFormat_ShowTime_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015 2:51 PM"}]];


        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowTime_ShowDayOfWeek = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowDayOfWeek.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowTime_ShowDayOfWeek = [fieldInfo_InvalidFormat_ShowTime_ShowDayOfWeek];
        var expectedRecords_InvalidFormat_ShowTime_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTime, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowTime_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_HideYearIfCurrent.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowTime_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowTime_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowTime_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12 2:51 PM"}]];
        var expectedRecords_InvalidFormat_ShowTime_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "04-12-2000 2:51 PM"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName = [fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek = [fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_HideYearIfCurrent.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowTimeZone, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12 2:51 PM EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12-2015 2:51 PM"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTime, ShowMonthAsName, ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showTime = true;
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12 2:51 PM"}]];

        // FieldInfo and record expectation for field with invalid format and ShowDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowDayOfWeek = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowDayOfWeek = [fieldInfo_InvalidFormat_ShowDayOfWeek];
        var expectedRecords_InvalidFormat_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015"}]];

        // FieldInfo and record expectation for field with invalid format and ShowDayOfWeek, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12"}]];

        // FieldInfo and record expectation for field with invalid format and showTimeZone flag
        var fieldInfo_InvalidFormat_ShowTimeZone = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTimeZone.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTimeZone = [fieldInfo_InvalidFormat_ShowTimeZone];
        var expectedRecords_InvalidFormat_ShowTimeZone =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTimeZone, ShowMonthAsName flag
        var fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName = [fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName];
        var expectedRecords_InvalidFormat_ShowTimeZone_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTimeZone, ShowDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek = [fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek];
        var expectedRecords_InvalidFormat_ShowTimeZone_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTimeZone, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowTimeZone_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTimeZone_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTimeZone_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowTimeZone_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowTimeZone_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowTimeZone_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12 EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTimeZone, ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_InvalidFormat_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12-2015 EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTimeZone, ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12 EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowTimeZone, ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showTimeZone = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12 EDT"}]];

        // FieldInfo and record expectation for field with invalid format and ShowMonthAsName flag
        var fieldInfo_InvalidFormat_ShowMonthAsName = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowMonthAsName = [fieldInfo_InvalidFormat_ShowMonthAsName];
        var expectedRecords_InvalidFormat_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015"}]];

        // FieldInfo and record expectation for field with invalid format and ShowMonthAsName, ShowDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowMonthAsName_ShowDayOfWeek = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowMonthAsName_ShowDayOfWeek.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowMonthAsName_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowMonthAsName_ShowDayOfWeek = [fieldInfo_InvalidFormat_ShowMonthAsName_ShowDayOfWeek];
        var expectedRecords_InvalidFormat_ShowMonthAsName_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12-2015"}]];

        // FieldInfo and record expectation for field with invalid format and ShowMonthAsName, HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_ShowMonthAsName_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowMonthAsName_HideYearIfCurrent.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowMonthAsName_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_ShowMonthAsName_HideYearIfCurrent = [fieldInfo_InvalidFormat_ShowMonthAsName_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_ShowMonthAsName_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12"}]];

        // FieldInfo and record expectation for field with invalid format and HideYearIfCurrent flag
        var fieldInfo_InvalidFormat_HideYearIfCurrent = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_HideYearIfCurrent.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_HideYearIfCurrent = [fieldInfo_InvalidFormat_HideYearIfCurrent];
        var expectedRecords_InvalidFormat_HideYearIfCurrent =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "04-12"}]];
        var expectedRecords_InvalidFormat_HideYearIfCurrent_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "04-12-2000"}]];

        // FieldInfo and record expectation for field with invalid format and all flags enabled
        var fieldInfo_InvalidFormat_AllFlags = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_AllFlags.showTime = true;
        fieldInfo_InvalidFormat_AllFlags.showTimeZone = true;
        fieldInfo_InvalidFormat_AllFlags.showMonthAsName = true;
        fieldInfo_InvalidFormat_AllFlags.showDayOfWeek = true;
        fieldInfo_InvalidFormat_AllFlags.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_AllFlags = [fieldInfo_InvalidFormat_AllFlags];
        var expectedRecords_InvalidFormat_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12 2:51 PM EDT"}]];
        var expectedRecords_InvalidFormat_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "Wednesday, Apr-12-2000 2:51 PM EDT"}]];


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
            { message: "dateTime with invalid format and no flags", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat, expectedRecords: expectedRecords_InvalidFormat },
            { message: "dateTime with invalid format and showTime flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime, expectedRecords: expectedRecords_InvalidFormat_ShowTime },
            { message: "dateTime with invalid format and showTime, showTimeZone flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowTimeZone, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowTimeZone },
            { message: "dateTime with invalid format and showTime, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowMonthAsName },
            { message: "dateTime with invalid format and showTime, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowDayOfWeek, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowDayOfWeek },
            { message: "dateTime with invalid format and showTime, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowTime_HideYearIfCurrent },
            { message: "dateTime with invalid format and showTime, hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_InvalidFormat_ShowTime_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowTime_HideYearIfCurrent_DiffYear },
            { message: "dateTime with invalid format and showTime, showTimeZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with invalid format and showTime, showTimeZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with invalid format and showTime, showTimeZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with invalid format and showTime, showTimeZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with invalid format and showTime, showTimeZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with invalid format and showTime, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with invalid format and showTime, showMonthAsName, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowTime_ShowMonthAsName_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with invalid format and showTimZone flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTimeZone, expectedRecords: expectedRecords_InvalidFormat_ShowTimeZone },
            { message: "dateTime with invalid format and showTimZone, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName, expectedRecords: expectedRecords_InvalidFormat_ShowTimeZone_ShowMonthAsName },
            { message: "dateTime with invalid format and showTimZone, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek, expectedRecords: expectedRecords_InvalidFormat_ShowTimeZone_ShowDayOfWeek },
            { message: "dateTime with invalid format and showTimZone, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTimeZone_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowTimeZone_HideYearIfCurrent },
            { message: "dateTime with invalid format and showTimZone, showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_InvalidFormat_ShowTimeZone_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with invalid format and showTimZone, showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowTimeZone_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with invalid format and showTimZone, showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowTimeZone_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with invalid format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowMonthAsName, expectedRecords: expectedRecords_InvalidFormat_ShowMonthAsName },
            { message: "dateTime with invalid format and showMonthAsName, showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowMonthAsName_ShowDayOfWeek, expectedRecords: expectedRecords_InvalidFormat_ShowMonthAsName_ShowDayOfWeek },
            { message: "dateTime with invalid format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowMonthAsName_HideYearIfCurrent },
            { message: "dateTime with invalid format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowDayOfWeek, expectedRecords: expectedRecords_InvalidFormat_ShowDayOfWeek },
            { message: "dateTime with invalid format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent },
            { message: "dateTime with invalid format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_HideYearIfCurrent },
            { message: "dateTime with invalid format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_InvalidFormat_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_HideYearIfCurrent_DiffYear },
            { message: "dateTime with invalid format and all flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_AllFlags, expectedRecords: expectedRecords_InvalidFormat_AllFlags },
            { message: "dateTime with invalid format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_InvalidFormat_AllFlags, expectedRecords: expectedRecords_InvalidFormat_AllFlags_DiffYear },
            { message: "empty dateTime with invalid format", records: emptyRecords, fieldInfo: fieldInfo_InvalidFormat, expectedRecords: expectedEmptyRecords},
            { message: "null dateTime with invalid format", records: nullRecords, fieldInfo: fieldInfo_InvalidFormat, expectedRecords: nullExpectedRecords }
        ];
    }

    it('should format various DateTime records with invalid format for display', function () {
        invalidFormatDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

});