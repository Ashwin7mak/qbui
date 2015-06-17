'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for Text field formatting
 */
describe('Text record formatter unit test', function () {

    //Generates and returns a random string of specified length
    function generateRandomString(size) {
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        var text = '';
        for (var i = 0; i < size; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * DataProvider containing Records, FieldProperties and record display expectations Text fields
     */
    function dataProvider() {

        var smallText = generateRandomString(5);
        var maxText = generateRandomString(4000);

        var inputSmallRecord =  [[{
                "id": 7,
                "value": smallText}]];
        var expectedSmallRecord =
            [[{
                "id": 7,
                "value": smallText,
                "display": smallText}]];

        // Text string of 4000 characters
        var inputMaxRecord =  [[{
            "id": 7,
            "value": maxText}]];
        var expectedMaxRecord =
            [[{
                "id": 7,
                "value": maxText,
                "display": maxText}]];

        //Empty records
        var emptyRecord =  [[{
            "id": 7,
            "value": ""}]];
        var expectedEmptyRecord =
            [[{
                "id": 7,
                "value": "",
                "display": ""}]];

        //null record value
        var nullRecord =  [[{
            "id": 7,
            "value": null}]];
        var nullExpectedRecord =
            [[{
                "id": 7,
                "value": null,
                "display": ""}]];

        return [
            { message: "Text - small text", records: inputSmallRecord, expectedRecords: expectedSmallRecord },
            { message: "Text - maximum text", records: inputMaxRecord, expectedRecords: expectedMaxRecord },
            { message: "Text - empty text", records: emptyRecord, expectedRecords: expectedEmptyRecord },
            { message: "Text - null text", records: nullRecord, expectedRecords: nullExpectedRecord }
        ];
    }

    /**
     * Unit test that validates Text records formatting
     */
    describe('should format a text for display',function(){
        var fieldInfo = [
            {
                "id": 7,
                "name": "text",
                "type": "TEXT"
            }
        ];
        dataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});
