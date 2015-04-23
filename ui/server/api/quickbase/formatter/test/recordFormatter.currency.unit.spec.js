'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

describe('Currency record formatter unit test', function () {
    /**
     * DataProvider containing Records, FieldProperties and record display expectations for currency field
     */
    function provider() {
        var numberDecimalOnly = .74765432;


        //Incomplete number
        var defaultRecordInput =  [[{
            "id": 7,
            "value": numberDecimalOnly}]];
        var defaultRecordExp = [[{
            "id": 7,
            "value": numberDecimalOnly,
            "display": ""}]];

        // Setup the record inputs
        var recordInputDecimalOnly = JSON.parse(JSON.stringify(defaultRecordInput));

        var noFlagsFieldInfo = [{
            "id": 7,
            "name": "currency",
            "type": "CURRENCY",
            "decimalPlaces": 2,
            "clientSideAttributes": {
            }
        }];

        var expectedDecimal_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_NoFlags[0][0].value = numberDecimalOnly;
        expectedDecimal_NoFlags[0][0].display = "$0.75";

        //Test for right of sign
        var rightOfSignFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        rightOfSignFieldInfo[0].clientSideAttributes.position = 'RIGHT_OF_SIGN';
        var rightOfSignInput = JSON.parse(JSON.stringify(defaultRecordInput));
        rightOfSignInput[0][0].value = -2.883;
        var rightOfSignExpected = JSON.parse(JSON.stringify(rightOfSignInput));
        rightOfSignExpected[0][0].display = '-$2.88';


        var cases =[
            { message: "Currency - decimal with no format", records: recordInputDecimalOnly, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_NoFlags },
            { message: "Currency - right of sign positioning of symbol", records: rightOfSignInput, fieldInfo: rightOfSignFieldInfo, expectedRecords: rightOfSignExpected }
        ];

        return cases;
    }

    describe('should format a currency record with various properties for display',function(){
        provider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});