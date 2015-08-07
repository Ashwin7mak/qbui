'use strict';

var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');
var jBigNum = require('json-bignum');

describe('Lookup record formatter unit test', function() {

    //Generates and returns a random string of specified length
    function generateRandomString(size) {
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var text = '';
        for (var i = 0; i < size; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    function provider() {
        var numberDecimalOnly = 0.74765432;


        //Incomplete number
        var defaultRecordInput =  [[{
            id: 7,
            value: numberDecimalOnly}]];
        var defaultRecordExp = [[{
            id: 7,
            value: numberDecimalOnly,
            display: ''}]];

        // Setup the record inputs
        var recordInputDecimalOnly = jBigNum.parse(jBigNum.stringify(defaultRecordInput));

        var noFlagsFieldInfo = [{
            id: 7,
            name: 'currency lookup',
            type: 'LOOKUP',
            decimalPlaces: 2,
            datatypeAttributes: {
                type: 'CURRENCY',
                decimalPlaces: 2,
                clientSideAttributes: {
                    symbol:'$'
                }
            }
        }];

        //Default behavior
        var expectedDecimal_NoFlags = jBigNum.parse(jBigNum.stringify(defaultRecordExp));
        expectedDecimal_NoFlags[0][0].value = numberDecimalOnly;
        expectedDecimal_NoFlags[0][0].display = '$0.75';


        //Text field info
        var textFieldInfo = [
            {
                id: 7,
                name: 'text lookup',
                type: 'LOOKUP',
                datatypeAttributes: { type:'TEXT' }
            }
        ];
        var smallText = generateRandomString(5);
        var inputTextRecord =  [[{
            id: 7,
            value: smallText}]];
        var expectedTextRecord =
            [[{
                id: 7,
                value: smallText,
                display: smallText}]];

        // DATE
        var dateTimeFieldInfo = [{
            id: 7,
            name: 'datetime lookup',
            type: 'LOOKUP',
            datatypeAttributes: { type:'DATE_TIME' }
        }];
        var inputDateTime =  [[{
            id: 7,
            value: '2015-04-12T18:51:19z'}]];
        var expectedDateTime =
            [[{
                id: 7,
                value: '2015-04-12T18:51:19z',
                display: '04-12-2015'}]];

        var cases =[
            { message: 'Lookup -> CURRENCY', records: recordInputDecimalOnly, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_NoFlags },
            { message: 'Lookup -> TEXT', records: inputTextRecord, fieldInfo: textFieldInfo, expectedRecords: expectedTextRecord },
            { message: 'Lookup -> DATE_TIME', records: inputDateTime, fieldInfo: dateTimeFieldInfo, expectedRecords: expectedDateTime }
        ];
        return cases;
    }

    describe('should format a lookup by its scalarFieldType for display',function() {
        provider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});
