/**
 * Unit tests for record.generator.js
 * Created by klabak on 6/1/15.
 */

'use strict';

var consts = require('../../server/api/constants');
var fieldGenerator = require('./../field.generator.js');
var recordGenerator = require('./../record.generator.js');
var assert = require('assert');
var should = require('should');

describe('Record generator unit test', function () {

    /**
     * DataProvider containing the field types to include in the generated record
     */
    function positiveProvider() {
        return [
            {message: "checkbox field", fieldType: consts.CHECKBOX},
            {message: "text field", fieldType: consts.TEXT},
            {message: "multi line text field", fieldType: consts.MULTI_LINE_TEXT},
            {message: "phone number field", fieldType: consts.PHONE_NUMBER},
            {message: "date field", fieldType: consts.DATE},
            {message: "duration field", fieldType: consts.DURATION},
            {message: "time of day field", fieldType: consts.TIME_OF_DAY},
            {message: "numeric field", fieldType: consts.NUMERIC},
            {message: "currency field", fieldType: consts.CURRENCY},
            {message: "rating field", fieldType: consts.RATING},
            {message: "percent field", fieldType: consts.PERCENT},
            {message: "url field", fieldType: consts.URL},
            {message: "email address field", fieldType: consts.EMAIL_ADDRESS},
            {message: "user field", fieldType: consts.USER},
            {message: "file attachment field", fieldType: consts.FILE_ATTACHMENT},
        ];
    }

    // Positive test case
    it('should generate a record with values based on the fields provided', function (){
        // Setup the list of fields
        var fields = [];
        positiveProvider().forEach(function(entry) {
            // Generate the field and add it to the list
            var field = fieldGenerator.generateBaseField(entry.fieldType);
            fields.push(field);
        });

        // Generate the record values based on the field type
        var recordJson = recordGenerator.generateRecord(fields);
        console.log(recordJson);

        // Loop through the generated JSON checking type of each value generated matches field type
        for(var i = 0; i < recordJson.length; i++) {
            var obj = recordJson[i];
            console.log(obj.value);
            //console.log(Object.prototype.toString.call(obj.value));
        };
    });

    // Negative test case
    it('should not generate a value for a formula or virtual field type', function (){
        // Generate fields
        var dateTimeFormulaField = fieldGenerator.generateBaseField(consts.FORMULA_DATE);
        console.log('field: ' + JSON.stringify(dateTimeFormulaField));

        var lookupField = fieldGenerator.generateBaseField(consts.LOOKUP);
        console.log('field: ' + JSON.stringify(lookupField));

        var fields = [];
        fields.push(dateTimeFormulaField);
        fields.push(lookupField);

        var recordJson = recordGenerator.generateRecord(fields);
        expect(recordJson.length).toBe(0);
    });
});

