/**
 * Unit tests for record.generator.js
 * Created by klabak on 6/1/15.
 */

'use strict';

var consts = require('../../server/api/constants');
var fieldGenerator = require('./../field.generator.js');
var recordGenerator = require('./../record.generator.js');
var tableGenerator = require('./../table.generator.js');
var assert = require('assert');
var should = require('should');

describe('Record generator', function () {

    /**
     * DataProvider containing the field types to include in the generated record
     */
    function fieldProvider() {
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

    /**
     * Positive test cases
     */
    it('should generate a record with values based on the list of fields provided', function (){
        // Setup the list of fields
        var fields = [];
        fieldProvider().forEach(function(entry) {
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

    it('should generate a record if given a table', function (){
        // Generate a table
        var table = tableGenerator.generateTable(5);

        // Generate a record for that table
        var recordJson = recordGenerator.generateRecordForTable(table);
    });

    /**
     * Negative test cases
     */
    it('should not generate a value for a formula or virtual field type', function (){
        // Generate fields
        var dateTimeFormulaField = fieldGenerator.generateBaseField(consts.FORMULA_DATE);

        var lookupField = fieldGenerator.generateBaseField(consts.LOOKUP);

        var fields = [];
        fields.push(dateTimeFormulaField);
        fields.push(lookupField);

        var recordJson = recordGenerator.generateRecord(fields);
        expect(recordJson.length).toBe(0);
    });
});

