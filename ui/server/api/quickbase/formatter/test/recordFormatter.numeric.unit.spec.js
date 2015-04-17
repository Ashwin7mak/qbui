'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

describe('Numeric record formatter unit test', function () {

    function provider() {
        var numberDecimalOnly = ".98765432";
        var numberDouble = 98765432100.98765;
        var numberNoSeparator = "99";
        var numberMultipleSeparators = "98765432100";

        //Incomplete number
        var defaultRecordInput =  [[{
            "id": 7,
            "value": numberDouble}]];
        var defaultRecordExp = [[{
                "id": 7,
                "value": numberDouble,
                "display": "98.765.432.100,9877"}]];
        var defaultFieldInfo = [{
                "id": 7,
                "name": "numeric",
                "type": "NUMERIC",
                "decimalPlaces": 4,
                "clientSideAttributes": {
                    "separatorStart": 3,
                    "separatorMark": ".",
                    "separatorPattern": "EVERY_THREE",
                    "decimalMark": ","
                }
        }];

        // Setup the record inputs
        var recordInputDecimalOnly = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputDecimalOnly[0][0].value = numberDecimalOnly;
        var recordInputDouble = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputDouble[0][0].value = numberDouble;
        var recordInputNoSeparator = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputNoSeparator[0][0].value = numberNoSeparator;
        var recordInputMultipleSeparators = JSON.parse(JSON.stringify(defaultRecordInput));
        recordInputMultipleSeparators[0][0].value = numberMultipleSeparators;

        // No flags - decimal only
        var expectedDecimalOnly_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimalOnly_NoFlags[0][0].value = numberDecimalOnly;
        expectedDecimalOnly_NoFlags[0][0].display = numberDecimalOnly;

        // No flags - double number
        var expectedDouble_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDouble_NoFlags[0][0].value = numberDouble;
        expectedDouble_NoFlags[0][0].display = numberDouble;

        // No flags - no separator
        var expectedNoSeparator_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedNoSeparator_NoFlags[0][0].value = numberNoSeparator;
        expectedNoSeparator_NoFlags[0][0].display = numberNoSeparator;

        // No flags - multiple separators
        var expectedMultiSeparators_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedMultiSeparators_NoFlags[0][0].value = numberMultipleSeparators;
        expectedMultiSeparators_NoFlags[0][0].display = numberMultipleSeparators;

        var cases =[
            { message: "Numeric - decimal only with no format", records: defaultRecordInput, fieldInfo: defaultFieldInfo, expectedRecords: defaultRecordExp },
            //{ message: "Numeric - double with no format", records: recordInputDouble, fieldInfo: defaultFieldInfo, expectedRecords: expectedDouble_NoFlags },
            //{ message: "Numeric - no separator with no format", records: recordInputNoSeparator, fieldInfo: defaultFieldInfo, expectedRecords: expectedNoSeparator_NoFlags },
            //{ message: "Numeric - multiple separators with no format", records: recordInputMultipleSeparators, fieldInfo: defaultFieldInfo, expectedRecords: expectedMultiSeparators_NoFlags },
        ];

        return cases;
    }

    it('should format a numeric record with various properties for display', function () {
        provider().forEach(function(entry){
            var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
            console.log(JSON.stringify(formattedRecords));
            assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
        });
    });
});