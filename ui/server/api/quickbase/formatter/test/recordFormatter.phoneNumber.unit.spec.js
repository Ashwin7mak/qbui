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
                "type": "PHONE_NUMBER"
            }
        ];

        var fieldInfoHideExtension = [
            {
                "id": 7,
                "name": "phone",
                "type": "PHONE_NUMBER",
                "includeExtension": false
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

        return [
            { message: "small phone number", fieldInfo: fieldInfo, records: recordsInput, expectedRecords: expectedRecords },
            { message: "phone number with extension", fieldInfo: fieldInfo, records: standardInput, expectedRecords: expectedStandardExpected },
            { message: "phone number hide extenstion", fieldInfo: fieldInfoHideExtension, records: standardInput, expectedRecords: expectedStandardExpectedNoExtension }
        ];
    }

    /**
     * Unit test that validates PhoneNumber records formatting
     */
    describe('should format a phone number for display',function(){

        provider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                console.log('entry: ' + JSON.stringify(entry));
                console.log('actual value: ' + JSON.stringify(formattedRecords));
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});