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

        //Default behavior
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

        //Right of the number
        var rightFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        rightFieldInfo[0].clientSideAttributes.position = 'RIGHT';
        var rightInput = JSON.parse(JSON.stringify(defaultRecordInput));
        rightInput[0][0].value = -2.883;
        var rightExpected = JSON.parse(JSON.stringify(rightOfSignInput));
        rightExpected[0][0].display = '-2.88 $';

        //Test for right of sign
        var rightOfSignEuroFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        rightOfSignEuroFieldInfo[0].clientSideAttributes.position = 'RIGHT_OF_SIGN';
        rightOfSignEuroFieldInfo[0].clientSideAttributes.symbol = '€';
        var rightOfSignEuroInput = JSON.parse(JSON.stringify(defaultRecordInput));
        rightOfSignEuroInput[0][0].value = -2.883;
        var rightOfSignEuroExpected = JSON.parse(JSON.stringify(rightOfSignInput));
        rightOfSignEuroExpected[0][0].display = '-€2.88';

        //Right of the number
        var rightEuroFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        rightEuroFieldInfo[0].clientSideAttributes.position = 'RIGHT';
        rightEuroFieldInfo[0].clientSideAttributes.symbol = '€';
        var rightEuroInput = JSON.parse(JSON.stringify(defaultRecordInput));
        rightEuroInput[0][0].value = -2.883;
        var rightEuroExpected = JSON.parse(JSON.stringify(rightOfSignInput));
        rightEuroExpected[0][0].display = '-2.88 €';

        //Test for right of sign positive value
        var rightOfSignPositiveEuroFieldInfo = JSON.parse(JSON.stringify(noFlagsFieldInfo));
        rightOfSignPositiveEuroFieldInfo[0].clientSideAttributes.position = 'RIGHT_OF_SIGN';
        rightOfSignPositiveEuroFieldInfo[0].clientSideAttributes.symbol = '€';
        var rightOfSignPositiveEuroInput = JSON.parse(JSON.stringify(defaultRecordInput));
        rightOfSignPositiveEuroInput[0][0].value = 2.883;
        var rightOfSignPositiveEuroExpected = JSON.parse(JSON.stringify(rightOfSignPositiveEuroInput));
        rightOfSignPositiveEuroExpected[0][0].display = '€2.88';

        var cases =[
            { message: "Currency - decimal with no format -> symbol left", records: recordInputDecimalOnly, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_NoFlags },
            { message: "Currency - right of sign positioning of symbol", records: rightOfSignInput, fieldInfo: rightOfSignFieldInfo, expectedRecords: rightOfSignExpected },
            { message: "Currency - symbol to the right of the number", records: rightInput, fieldInfo: rightFieldInfo, expectedRecords: rightExpected },
            { message: "Currency - euro symbol right of sign positioning", records: rightOfSignEuroInput, fieldInfo: rightOfSignEuroFieldInfo, expectedRecords: rightOfSignEuroExpected },
            { message: "Currency - euro symbol to the right of the number", records: rightEuroInput, fieldInfo: rightEuroFieldInfo, expectedRecords: rightEuroExpected },
            { message: "Currency - euro symbol RIGHT_OF_SIGN for positive value", records: rightOfSignPositiveEuroInput, fieldInfo: rightOfSignPositiveEuroFieldInfo, expectedRecords: rightOfSignPositiveEuroExpected }
        ];
        return cases;
    }

    describe('should format a currency record with various properties for display',function(){
        provider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('input: ' + JSON.stringify(entry.expectedRecords));
                //console.log('Returned value: ' + JSON.stringify(formattedRecords));
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});