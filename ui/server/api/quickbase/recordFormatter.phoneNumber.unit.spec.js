'use strict';

var should = require('should');
var recordFormatter = require('./recordFormatter')();
var assert = require('assert');

describe('Phone number record formatter unit test', function () {

    /**
     * DataProvider containing Records, FieldProperties and record display expectations PhoneNumber fields
     */
    function provider() {
        //Incomplete number
        var recordsInput =  [[{
                "id": 7,
                "value": "12345678"}]];
        var expectedRecords =
            [[{
                "id": 7,
                "value": "12345678",
                "display": "(1) 234-5678"}]];

        // 10 digit number
        var standardInput =  [[{
            "id": 7,
            "value": "5557779999"}]];
        var expectedStandardExpected =
            [[{
                "id": 7,
                "value": "5557779999",
                "display": "(555) 777-9999"}]];

        //More than 10 digit number
        var largeInput =  [[{
            "id": 7,
            "value": "1234567890123"}]];
        var largeExpected =
            [[{
                "id": 7,
                "value": "1234567890123",
                "display": "123 (456) 789-0123"}]];

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
            { message: "small phone number", records: recordsInput, expectedRecords: expectedRecords },
            { message: "standard phone number", records: standardInput, expectedRecords: expectedStandardExpected },
            { message: "empty phone number", records: emptyRecords, expectedRecords: expectedEmptyRecords},
            { message: "too-long phone number", records: largeInput, expectedRecords: largeExpected },
            { message: "null phone number", records: nullRecords, expectedRecords: nullExpectedRecords }
        ];
    }

    /**
     * Unit test that validates transformation of PhoneNumber records
     */
    it('should format a phone number for display', function () {
        var fieldInfo = [
            {
                "id": 7,
                "name": "phone",
                "type": "PHONE_NUMBER"
            }
        ];
        provider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, fieldInfo);
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });
});