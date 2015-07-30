'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for PhoneNumber field formatting
 */
describe('Phone number record formatter unit test', function () {

    /**
     * DataProvider containing Records, FieldProperties and record display expectations PhoneNumber fields
     */
    function provider() {
        var fieldInfo = [
            {
                "id": 7,
                "name": "phone",
                "datatypeAttributes": {
                    "type": "PHONE_NUMBER"
                }
            }
        ];

        var fieldInfoHideExtension = [
            {
                "id": 7,
                "name": "phone",
                "datatypeAttributes": {
                    "type": "PHONE_NUMBER",
                    "includeExtension": false
                }
            }
        ];
        //Incomplete number
        var recordsInput =  [[{
                "id": 7,
                "value": "(1) 234-5678"}]];
        var expectedRecords =
            [[{
                "id": 7,
                "value": "(1) 234-5678",
                "display": "(1) 234-5678"}]];

        // 10 digit number
        var standardInput =  [[{
            "id": 7,
            "value": "(555) 777-9999 x1234"}]];
        var expectedStandardExpected =
            [[{
                "id": 7,
                "value": "(555) 777-9999 x1234",
                "display": "(555) 777-9999 x1234"}]];
        var expectedStandardExpectedNoExtension =
            [[{
                "id": 7,
                "value": "(555) 777-9999 x1234",
                "display": "(555) 777-9999"}]];

        //More than 10 digit number
        var moreThan10Input = [[{
            "id": 7,
            "value": "222(555) 777-9999 x1234"}]];

        var expectedMoreThan10 =
            [[{
                "id": 7,
                "value": "222(555) 777-9999 x1234",
                "display": "222(555) 777-9999"}]];

        //Incomplete number
        var nullInput =  [[{
            "id": 7,
            "value": null}]];
        var expectedNullResult =
            [[{
                "id": 7,
                "value": null,
                "display": ""}]];

        //Incomplete number
        var emptyInput =  [[{
            "id": 7,
            "value": ""}]];
        var emptyExpectedResult =
            [[{
                "id": 7,
                "value": "",
                "display": ""}]];

        return [
            { message: "small phone number", fieldInfo: fieldInfo, records: recordsInput, expectedRecords: expectedRecords },
            { message: "phone number with extension", fieldInfo: fieldInfo, records: standardInput, expectedRecords: expectedStandardExpected },
            { message: "phone number hide extenstion", fieldInfo: fieldInfoHideExtension, records: standardInput, expectedRecords: expectedStandardExpectedNoExtension },
            { message: "phone number hide extenstion more than 10 digits", fieldInfo: fieldInfoHideExtension, records: moreThan10Input, expectedRecords: expectedMoreThan10 },
            { message: "phone number null input", fieldInfo: fieldInfoHideExtension, records: nullInput, expectedRecords: expectedNullResult },
            { message: "phone number empty input", fieldInfo: fieldInfoHideExtension, records: emptyInput, expectedRecords: emptyExpectedResult }
        ];
    }

    /**
     * Unit test that validates PhoneNumber records formatting
     */
    describe('should format a phone number for display',function(){

        provider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});
