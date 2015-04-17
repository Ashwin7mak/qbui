'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

describe('Date record formatter unit test', function () {

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for MM_DD_YYYY format
     */
    function mmddyyyyDataProvider() {

        // Default Date record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T18:51:19z"}]];
        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T18:51:19z"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format
        var mmddyyyy = {
                "id": 7,
                "name": "date",
                "type": "DATE",
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

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowDayOfWeek flag
        var fieldInfo_MMDDYYYY_ShowDayOfWeek = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowDayOfWeek = [fieldInfo_MMDDYYYY_ShowDayOfWeek];
        var expectedRecords_MMDDYYYY_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015"}]];

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowDayOfWeek, ShowMonthAsName flag
        var fieldInfo_MMDDYYYY_ShowDayOfWeek_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowDayOfWeek_ShowMonthAsName.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_ShowDayOfWeek_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowDayOfWeek_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowDayOfWeek_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowDayOfWeek_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12-2015"}]];

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

        // FieldInfo and record expectation for field with MM_DD_YYYY format and ShowMonthAsName flag
        var fieldInfo_MMDDYYYY_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyyyy));
        fieldInfo_MMDDYYYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYYYY_ShowMonthAsName = [fieldInfo_MMDDYYYY_ShowMonthAsName];
        var expectedRecords_MMDDYYYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015"}]];

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
        fieldInfo_MMDDYYYY_AllFlags.showMonthAsName = true;
        fieldInfo_MMDDYYYY_AllFlags.showDayOfWeek = true;
        fieldInfo_MMDDYYYY_AllFlags.hideYearIfCurrent = true;
        fieldInfo_MMDDYYYY_AllFlags = [fieldInfo_MMDDYYYY_AllFlags];
        var expectedRecords_MMDDYYYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12"}]];
        var expectedRecords_MMDDYYYY_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "Wednesday, Apr-12-2000"}]];


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
            { message: "date with MM_DD_YYYY format no flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY, expectedRecords: expectedRecords_MMDDYYYY },
            { message: "date with MM_DD_YYYY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYYYY_ShowDayOfWeek },
            { message: "date with MM_DD_YYYY format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowDayOfWeek_HideYearIfCurrent },
            { message: "date with MM_DD_YYYY format and showDayOfWeek, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowDayOfWeek_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYYYY_ShowDayOfWeek_ShowMonthAsName },

            { message: "date with MM_DD_YYYY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYYYY_ShowMonthAsName },
            { message: "date with MM_DD_YYYY format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_ShowMonthAsName_HideYearIfCurrent },

            { message: "date with MM_DD_YYYY format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_HideYearIfCurrent },
            { message: "date with MM_DD_YYYY format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYYYY_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYYYY_HideYearIfCurrent_DiffYear },
            { message: "date with MM_DD_YYYY format and all flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYYYY_AllFlags, expectedRecords: expectedRecords_MMDDYYYY_AllFlags },
            { message: "date with MM_DD_YYYY format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYYYY_AllFlags, expectedRecords: expectedRecords_MMDDYYYY_AllFlags_DiffYear },
            { message: "empty date with MM_DD_YYYY format", records: emptyRecords, fieldInfo: fieldInfo_MMDDYYYY, expectedRecords: expectedEmptyRecords},
            { message: "null date with MM_DD_YYYY format", records: nullRecords, fieldInfo: fieldInfo_MMDDYYYY, expectedRecords: nullExpectedRecords }
        ];
    }

    /**
     * Unit test that validates Date records with MM_DD_YYYY format and various field property flags set
     */
    it('should format various MM_DD_YYYY Date records for display', function () {
        mmddyyyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for MM_DD_YY format
     */
    function mmddyyDataProvider() {

        //// Default Date record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format
        var mmddyy = {
            "id": 7,
            "name": "date",
            "type": "DATE",
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

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowDayOfWeek, ShowMonthAsName flag
        var fieldInfo_MMDDYY_ShowDayOfWeek_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowDayOfWeek_ShowMonthAsName.showDayOfWeek = true;
        fieldInfo_MMDDYY_ShowDayOfWeek_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowDayOfWeek_ShowMonthAsName = [fieldInfo_MMDDYY_ShowDayOfWeek_ShowMonthAsName];
        var expectedRecords_MMDDYY_ShowDayOfWeek_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12-15"}]];

        // FieldInfo and record expectation for field with MM_DD_YY format and ShowMonthAsName flag
        var fieldInfo_MMDDYY_ShowMonthAsName = JSON.parse(JSON.stringify(mmddyy));
        fieldInfo_MMDDYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_MMDDYY_ShowMonthAsName = [fieldInfo_MMDDYY_ShowMonthAsName];
        var expectedRecords_MMDDYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Apr-12-15"}]];

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
        fieldInfo_MMDDYY_AllFlags.showMonthAsName = true;
        fieldInfo_MMDDYY_AllFlags.showDayOfWeek = true;
        fieldInfo_MMDDYY_AllFlags.hideYearIfCurrent = true;
        fieldInfo_MMDDYY_AllFlags = [fieldInfo_MMDDYY_AllFlags];
        var expectedRecords_MMDDYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12"}]];
        var expectedRecords_MMDDYY_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "Wednesday, Apr-12-00"}]];


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
            { message: "date with MM_DD_YY format no flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY, expectedRecords: expectedRecords_MMDDYY },
            { message: "date with MM_DD_YY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowDayOfWeek, expectedRecords: expectedRecords_MMDDYY_ShowDayOfWeek },
            { message: "date with MM_DD_YY format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowDayOfWeek_HideYearIfCurrent },
            { message: "date with MM_DD_YY format and showDayOfWeek, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowDayOfWeek_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYY_ShowDayOfWeek_ShowMonthAsName },

            { message: "date with MM_DD_YY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowMonthAsName, expectedRecords: expectedRecords_MMDDYY_ShowMonthAsName },
            { message: "date with MM_DD_YY format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_ShowMonthAsName_HideYearIfCurrent },

            { message: "date with MM_DD_YY format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_HideYearIfCurrent },
            { message: "date with MM_DD_YY format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYY_HideYearIfCurrent, expectedRecords: expectedRecords_MMDDYY_HideYearIfCurrent_DiffYear },
            { message: "date with MM_DD_YY format and all flag", records: recordsInput, fieldInfo: fieldInfo_MMDDYY_AllFlags, expectedRecords: expectedRecords_MMDDYY_AllFlags },
            { message: "date with MM_DD_YY format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_MMDDYY_AllFlags, expectedRecords: expectedRecords_MMDDYY_AllFlags_DiffYear },
            { message: "empty date with MM_DD_YY format", records: emptyRecords, fieldInfo: fieldInfo_MMDDYY, expectedRecords: expectedEmptyRecords},
            { message: "null date with MM_DD_YY format", records: nullRecords, fieldInfo: fieldInfo_MMDDYY, expectedRecords: nullExpectedRecords }
        ];
    }

    /**
     * Unit test that validates Date records with MM_DD_YY format and various field property flags set
     */
    it('should format various MM_DD_YY Date records for display', function () {
        mmddyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for DD_MM_YY format
     */
    function ddmmyyDataProvider() {

        //// Default Date record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format
        var ddmmyy = {
            "id": 7,
            "name": "date",
            "type": "DATE",
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


        // FieldInfo and record expectation for field with DD_MM_YY format and ShowDayOfWeek, ShowMonthAsName flag
        var fieldInfo_DDMMYY_ShowDayOfWeek_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowDayOfWeek_ShowMonthAsName.showDayOfWeek = true;
        fieldInfo_DDMMYY_ShowDayOfWeek_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowDayOfWeek_ShowMonthAsName = [fieldInfo_DDMMYY_ShowDayOfWeek_ShowMonthAsName];
        var expectedRecords_DDMMYY_ShowDayOfWeek_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr-15"}]];

        // FieldInfo and record expectation for field with DD_MM_YY format and ShowMonthAsName flag
        var fieldInfo_DDMMYY_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyy));
        fieldInfo_DDMMYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYY_ShowMonthAsName = [fieldInfo_DDMMYY_ShowMonthAsName];
        var expectedRecords_DDMMYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "12-Apr-15"}]];

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
        fieldInfo_DDMMYY_AllFlags.showMonthAsName = true;
        fieldInfo_DDMMYY_AllFlags.showDayOfWeek = true;
        fieldInfo_DDMMYY_AllFlags.hideYearIfCurrent = true;
        fieldInfo_DDMMYY_AllFlags = [fieldInfo_DDMMYY_AllFlags];
        var expectedRecords_DDMMYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 12-Apr"}]];
        var expectedRecords_DDMMYY_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "Wednesday, 12-Apr-00"}]];


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
            { message: "date with DD_MM_YY format and no flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY, expectedRecords: expectedRecords_DDMMYY },
            { message: "date with DD_MM_YY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYY_ShowDayOfWeek },
            { message: "date with DD_MM_YY format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowDayOfWeek_HideYearIfCurrent },
            { message: "date with DD_MM_YY format and showDayOfWeek, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowDayOfWeek_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYY_ShowDayOfWeek_ShowMonthAsName },

            { message: "date with DD_MM_YY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYY_ShowMonthAsName },
            { message: "date with DD_MM_YY format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_ShowMonthAsName_HideYearIfCurrent },

            { message: "date with DD_MM_YY format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_HideYearIfCurrent },
            { message: "date with DD_MM_YY format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYY_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYY_HideYearIfCurrent_DiffYear },
            { message: "date with DD_MM_YY format and all flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYY_AllFlags, expectedRecords: expectedRecords_DDMMYY_AllFlags },
            { message: "date with DD_MM_YY format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYY_AllFlags, expectedRecords: expectedRecords_DDMMYY_AllFlags_DiffYear },
            { message: "empty date with DD_MM_YY format", records: emptyRecords, fieldInfo: fieldInfo_DDMMYY, expectedRecords: expectedEmptyRecords},
            { message: "null date with DD_MM_YY format", records: nullRecords, fieldInfo: fieldInfo_DDMMYY, expectedRecords: nullExpectedRecords }
         ];
    }

    /**
     * Unit test that validates Date records with DD_MM_YY format and various field property flags set
     */
    it('should format various DD_MM_YY Date records for display', function () {
        ddmmyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for DD_MM_YYYY format
     */
    function ddmmyyyyDataProvider() {

        // Default Date record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T18:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T18:51:19z"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format
        var ddmmyyyy = {
            "id": 7,
            "name": "date",
            "type": "DATE",
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

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowDayOfWeek, ShowMonthAsName flag
        var fieldInfo_DDMMYYYY_ShowDayOfWeek_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowDayOfWeek_ShowMonthAsName.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_ShowDayOfWeek_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowDayOfWeek_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowDayOfWeek_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowDayOfWeek_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-Apr-2015"}]];

        // FieldInfo and record expectation for field with DD_MM_YYYY format and ShowMonthAsName flag
        var fieldInfo_DDMMYYYY_ShowMonthAsName = JSON.parse(JSON.stringify(ddmmyyyy));
        fieldInfo_DDMMYYYY_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_DDMMYYYY_ShowMonthAsName = [fieldInfo_DDMMYYYY_ShowMonthAsName];
        var expectedRecords_DDMMYYYY_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "12-Apr-2015"}]];

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
        fieldInfo_DDMMYYYY_AllFlags.showMonthAsName = true;
        fieldInfo_DDMMYYYY_AllFlags.showDayOfWeek = true;
        fieldInfo_DDMMYYYY_AllFlags.hideYearIfCurrent = true;
        fieldInfo_DDMMYYYY_AllFlags = [fieldInfo_DDMMYYYY_AllFlags];
        var expectedRecords_DDMMYYYY_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 12-Apr"}]];
        var expectedRecords_DDMMYYYY_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "Wednesday, 12-Apr-2000"}]];


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
            { message: "date with DD_MM_YYYY format and no flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY, expectedRecords: expectedRecords_DDMMYYYY },
            { message: "date with DD_MM_YYYY format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowDayOfWeek, expectedRecords: expectedRecords_DDMMYYYY_ShowDayOfWeek },
            { message: "date with DD_MM_YYYY format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowDayOfWeek_HideYearIfCurrent },
            { message: "date with DD_MM_YYYY format and showDayOfWeek, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowDayOfWeek_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYYYY_ShowDayOfWeek_ShowMonthAsName },

            { message: "date with DD_MM_YYYY format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowMonthAsName, expectedRecords: expectedRecords_DDMMYYYY_ShowMonthAsName },
            { message: "date with DD_MM_YYYY format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_ShowMonthAsName_HideYearIfCurrent },

            { message: "date with DD_MM_YYYY format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_HideYearIfCurrent },
            { message: "date with DD_MM_YYYY format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYYYY_HideYearIfCurrent, expectedRecords: expectedRecords_DDMMYYYY_HideYearIfCurrent_DiffYear },
            { message: "date with DD_MM_YYYY format and all flag", records: recordsInput, fieldInfo: fieldInfo_DDMMYYYY_AllFlags, expectedRecords: expectedRecords_DDMMYYYY_AllFlags },
            { message: "date with DD_MM_YYYY format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_DDMMYYYY_AllFlags, expectedRecords: expectedRecords_DDMMYYYY_AllFlags_DiffYear },
            { message: "empty date with DD_MM_YY format", records: emptyRecords, fieldInfo: fieldInfo_DDMMYYYY, expectedRecords: expectedEmptyRecords},
            { message: "null date with DD_MM_YY format", records: nullRecords, fieldInfo: fieldInfo_DDMMYYYY, expectedRecords: nullExpectedRecords }
         ];
    }

    /**
     * Unit test that validates Date records with DD_MM_YYYY format and various field property flags set
     */
    it('should format various DD_MM_YYYY Date records for display', function () {
        ddmmyyyyDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for YYYY_MM_DD format
     */
    function yyyymmddDataProvider() {

        //// Default Date record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T05:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T05:51:19z"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format
        var yyyymmdd = {
            "id": 7,
            "name": "date",
            "type": "DATE",
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

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowDayOfWeek, ShowMonthAsName flag
        var fieldInfo_YYYYMMDD_ShowDayOfWeek_ShowMonthAsName = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowDayOfWeek_ShowMonthAsName.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_ShowDayOfWeek_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowDayOfWeek_ShowMonthAsName = [fieldInfo_YYYYMMDD_ShowDayOfWeek_ShowMonthAsName];
        var expectedRecords_YYYYMMDD_ShowDayOfWeek_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, 2015-Apr-12"}]];

        // FieldInfo and record expectation for field with YYYY_MM_DD format and ShowMonthAsName flag
        var fieldInfo_YYYYMMDD_ShowMonthAsName = JSON.parse(JSON.stringify(yyyymmdd));
        fieldInfo_YYYYMMDD_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_YYYYMMDD_ShowMonthAsName = [fieldInfo_YYYYMMDD_ShowMonthAsName];
        var expectedRecords_YYYYMMDD_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "2015-Apr-12"}]];

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
        fieldInfo_YYYYMMDD_AllFlags.showMonthAsName = true;
        fieldInfo_YYYYMMDD_AllFlags.showDayOfWeek = true;
        fieldInfo_YYYYMMDD_AllFlags.hideYearIfCurrent = true;
        fieldInfo_YYYYMMDD_AllFlags = [fieldInfo_YYYYMMDD_AllFlags];
        var expectedRecords_YYYYMMDD_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T05:51:19z",
                "display": "Sunday, Apr-12"}]];
        var expectedRecords_YYYYMMDD_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T05:51:19z",
                "display": "Wednesday, 2000-Apr-12"}]];

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
            { message: "date with YYYY_MM_DD format and no flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD, expectedRecords: expectedRecords_YYYYMMDD },
            { message: "date with YYYY_MM_DD format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowDayOfWeek, expectedRecords: expectedRecords_YYYYMMDD_ShowDayOfWeek },
            { message: "date with YYYY_MM_DD format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowDayOfWeek_HideYearIfCurrent },
            { message: "date with YYYY_MM_DD format and showDayOfWeek, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowDayOfWeek_ShowMonthAsName, expectedRecords: expectedRecords_YYYYMMDD_ShowDayOfWeek_ShowMonthAsName },

            { message: "date with YYYY_MM_DD format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowMonthAsName, expectedRecords: expectedRecords_YYYYMMDD_ShowMonthAsName },
            { message: "date with YYYY_MM_DD format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_ShowMonthAsName_HideYearIfCurrent },

            { message: "date with YYYY_MM_DD format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_HideYearIfCurrent },
            { message: "date with YYYY_MM_DD format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_YYYYMMDD_HideYearIfCurrent, expectedRecords: expectedRecords_YYYYMMDD_HideYearIfCurrent_DiffYear },
            { message: "date with YYYY_MM_DD format and all flag", records: recordsInput, fieldInfo: fieldInfo_YYYYMMDD_AllFlags, expectedRecords: expectedRecords_YYYYMMDD_AllFlags },
            { message: "date with YYYY_MM_DD format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_YYYYMMDD_AllFlags, expectedRecords: expectedRecords_YYYYMMDD_AllFlags_DiffYear },
            { message: "empty date with YYYY_MM_DD format", records: emptyRecords, fieldInfo: fieldInfo_YYYYMMDD, expectedRecords: expectedEmptyRecords},
            { message: "null date with YYYY_MM_DD format", records: nullRecords, fieldInfo: fieldInfo_YYYYMMDD, expectedRecords: nullExpectedRecords }
        ];
    }

    /**
     * Unit test that validates Date records with YYYY_MM_DD format and various field property flags set
     */
    it('should format various YYYY_MM_DD Date records for display', function () {
        yyyymmddDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations for an invalid format, which
     * then defaults to MM_DD_YYYY
     */
    function invalidFormatDataProvider() {

        // Default Date record input
        var recordsInput =  [[{
            "id": 7,
            "value": "2015-04-12T18:51:19z"}]];

        var recordsInputDiffYear =  [[{
            "id": 7,
            "value": "2000-04-12T18:51:19z"}]];

        // FieldInfo and record expectation for field with invalid format
        var invalidFormat = {
            "id": 7,
            "name": "date",
            "type": "DATE",
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

        // FieldInfo and record expectation for field with invalid format and ShowDayOfWeek flag
        var fieldInfo_InvalidFormat_ShowDayOfWeek = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowDayOfWeek.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowDayOfWeek = [fieldInfo_InvalidFormat_ShowDayOfWeek];
        var expectedRecords_InvalidFormat_ShowDayOfWeek =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, 04-12-2015"}]];

        // FieldInfo and record expectation for field with invalid format and ShowDayOfWeek, ShowMonthAsName flag
        var fieldInfo_InvalidFormat_ShowDayOfWeek_ShowMonthAsName = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowDayOfWeek_ShowMonthAsName.showDayOfWeek = true;
        fieldInfo_InvalidFormat_ShowDayOfWeek_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowDayOfWeek_ShowMonthAsName = [fieldInfo_InvalidFormat_ShowDayOfWeek_ShowMonthAsName];
        var expectedRecords_InvalidFormat_ShowDayOfWeek_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12-2015"}]];

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

        // FieldInfo and record expectation for field with invalid format and ShowMonthAsName flag
        var fieldInfo_InvalidFormat_ShowMonthAsName = JSON.parse(JSON.stringify(invalidFormat));
        fieldInfo_InvalidFormat_ShowMonthAsName.showMonthAsName = true;
        fieldInfo_InvalidFormat_ShowMonthAsName = [fieldInfo_InvalidFormat_ShowMonthAsName];
        var expectedRecords_InvalidFormat_ShowMonthAsName =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Apr-12-2015"}]];

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
        fieldInfo_InvalidFormat_AllFlags.showMonthAsName = true;
        fieldInfo_InvalidFormat_AllFlags.showDayOfWeek = true;
        fieldInfo_InvalidFormat_AllFlags.hideYearIfCurrent = true;
        fieldInfo_InvalidFormat_AllFlags = [fieldInfo_InvalidFormat_AllFlags];
        var expectedRecords_InvalidFormat_AllFlags =
            [[{
                "id": 7,
                "value": "2015-04-12T18:51:19z",
                "display": "Sunday, Apr-12"}]];
        var expectedRecords_InvalidFormat_AllFlags_DiffYear =
            [[{
                "id": 7,
                "value": "2000-04-12T18:51:19z",
                "display": "Wednesday, Apr-12-2000"}]];


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
            { message: "date with invalid format and no flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat, expectedRecords: expectedRecords_InvalidFormat },
            { message: "date with invalid format and showDayOfWeek flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowDayOfWeek, expectedRecords: expectedRecords_InvalidFormat_ShowDayOfWeek },
            { message: "date with invalid format and showDayOfWeek, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowDayOfWeek_HideYearIfCurrent },
            { message: "date with invalid format and showDayOfWeek, showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowDayOfWeek_ShowMonthAsName, expectedRecords: expectedRecords_InvalidFormat_ShowDayOfWeek_ShowMonthAsName },

            { message: "date with invalid format and showMonthAsName flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowMonthAsName, expectedRecords: expectedRecords_InvalidFormat_ShowMonthAsName },
            { message: "date with invalid format and showMonthAsName, hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_ShowMonthAsName_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_ShowMonthAsName_HideYearIfCurrent },

            { message: "date with invalid format and hideYearIfCurrent flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_HideYearIfCurrent },
            { message: "date with invalid format and hideYearIfCurrent flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_InvalidFormat_HideYearIfCurrent, expectedRecords: expectedRecords_InvalidFormat_HideYearIfCurrent_DiffYear },
            { message: "date with invalid format and all flag", records: recordsInput, fieldInfo: fieldInfo_InvalidFormat_AllFlags, expectedRecords: expectedRecords_InvalidFormat_AllFlags },
            { message: "date with invalid format and all flag and different year", records: recordsInputDiffYear, fieldInfo: fieldInfo_InvalidFormat_AllFlags, expectedRecords: expectedRecords_InvalidFormat_AllFlags_DiffYear },
            { message: "empty date with invalid format", records: emptyRecords, fieldInfo: fieldInfo_InvalidFormat, expectedRecords: expectedEmptyRecords},
            { message: "null date with invalid format", records: nullRecords, fieldInfo: fieldInfo_InvalidFormat, expectedRecords: nullExpectedRecords }
        ];
    }

    /**
     * Unit test that validates Date records with an invalid format and various field property flags set.
     * That should ignore the invalid format and default to MM_DD_YYYY
     */
    it('should format various Date records with invalid format for display', function () {
        invalidFormatDataProvider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            //console.log('TEST CASE: ' + JSON.stringify(entry.message));
            //console.log('RET RECS: ' + JSON.stringify(formattedRecords));
            //console.log('EXP RECS: ' + JSON.stringify(entry.expectedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });

});