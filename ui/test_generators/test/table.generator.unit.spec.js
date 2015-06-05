/**
 * A test to test our test generation code
 * Created by cschneider1 on 6/1/15.
 */
'use strict';

var should = require('should');
var tableGenerator = require('../table.generator');
var tableConsts = require('../table.constants');
var fieldConsts = require('../field.constants');
var consts = require('../../server/api/constants');
var _ = require('lodash');
var assert = require('assert');

/**
 * Unit tests for field generator
 */
describe('Table generator unit test', function () {

    /**
     * Unit test that validates generating a table with all field types
     */
    describe('test generating a table with all field types',function(){
        var table = tableGenerator.generateTableWithAllFieldTypes();

        if(!table[tableConsts.NAME]){
            assert.fail('Table should be generated with a name');
        }

        var fields = table[tableConsts.FIELDS];
        var availableFieldTypes = tableGenerator.getAvailableFieldTypes();

        if(fields.length !== availableFieldTypes.length){
            assert.fail('Did not find the right number of fields. Expected ' +
            tableGenerator.getAvailableFieldTypes().length + '. Table: ' +
            tableGenerator.tableToJsonString(table));
        }

        var fieldsCreated = {};
        var field;

        _.forEach( fields, function(field){
            if(!fieldsCreated[field[fieldConsts.fieldKeys.TYPE]]) {
                fieldsCreated[field[fieldConsts.fieldKeys.TYPE]] = 1;
            }else{
                fieldsCreated[field[fieldConsts.fieldKeys.TYPE]] += 1;
            }
        });

        _.forEach(availableFieldTypes, function(fieldTypeCount){
            assert.equal(fieldsCreated[fieldTypeCount], 1, 'We should have a single field per type');
        });
    });

    /**
     * Unit test that validates generating a table with a random number of fields
     */
    describe('test generating a table with all field types',function(){
        var table = tableGenerator.generateTable();

        if(!table[tableConsts.NAME]){
            assert.fail('Table should be generated with a name');
        }

        var fields = table[tableConsts.FIELDS];

        if(fields.length >= tableGenerator.getMaxNumberRandomFields()){
            assert.fail('Did not find the right number of fields. Expected a number less than ' +
            tableGenerator.getMaxNumberRandomFields() + '. Table: ' +
            tableGenerator.tableToJsonString(table));
        }
    });

    function tableOfCertainSizeAndTypeProvider(){
        return [
            {message: "checkbox field table", numFields: 10, fieldType: consts.CHECKBOX},
            {message: "text field table", numFields: 10, fieldType: consts.TEXT},
            {message: "multi line text field table", numFields: 10, fieldType: consts.MULTI_LINE_TEXT},
            {message: "phone number field table", numFields: 10, fieldType: consts.PHONE_NUMBER},
            {message: "date field table", numFields: 10, fieldType: consts.DATE},
            {message: "formula duration field table", numFields: 10, fieldType: consts.FORMULA_DURATION},
            {message: "formula date field table", numFields: 10, fieldType: consts.FORMULA_DATE},
            {message: "duration field table", numFields: 10, fieldType: consts.DURATION},
            {message: "formula time of day field table", numFields: 10, fieldType: consts.FORMULA_TIME_OF_DAY},
            {message: "time of day field table", numFields: 10, fieldType: consts.TIME_OF_DAY},
            {message: "numeric field table", numFields: 10, fieldType: consts.NUMERIC},
            {message: "formula numeric field table", numFields: 10, fieldType: consts.FORMULA_NUMERIC},
            {message: "currency field table", numFields: 10, fieldType: consts.CURRENCY},
            {message: "rating field table", numFields: 10, fieldType: consts.RATING},
            {message: "formula currency field table", numFields: 10, fieldType: consts.FORMULA_CURRENCY},
            {message: "percent field table", numFields: 10, fieldType: consts.PERCENT},
            {message: "formula percent field table", numFields: 10, fieldType: consts.FORMULA_PERCENT},
            {message: "url field table", numFields: 10, fieldType: consts.URL},
            {message: "email address field table", numFields: 10, fieldType: consts.EMAIL_ADDRESS},
            {message: "user field table", numFields: 10, fieldType: consts.USER},
            {message: "formula user field table", numFields: 10, fieldType: consts.FORMULA_USER},
            {message: "file attachment field table", numFields: 10, fieldType: consts.FILE_ATTACHMENT},
            {message: "report link field table", numFields: 10, fieldType: consts.REPORT_LINK},
            {message: "summary field table", numFields: 10, fieldType: consts.SUMMARY},
            {message: "lookup field table", numFields: 10, fieldType: consts.LOOKUP},
            {message: "formula phone number field table", numFields: 10, fieldType: consts.FORMULA_PHONE_NUMBER},
            {message: "formula url field table", numFields: 10, fieldType: consts.FORMULA_URL},
            {message: "formula checkbox field table", numFields: 10, fieldType: consts.FORMULA_CHECKBOX},
            {message: "formula text field table", numFields: 10, fieldType: consts.FORMULA_TEXT},
            {message: "formula email address field table", numFields: 10, fieldType: consts.FORMULA_EMAIL_ADDRESS},
            {message: "text field table with no fields", numFields: 0, fieldType: consts.TEXT},
            {message: "text field table with 1 field", numFields: 1, fieldType: consts.TEXT},
        ];
    }

    /**
     * Unit test that validates generating a table with a fixed number of fields of a particular type
     */
    describe('test generating a table with fixed name and type',function(){
        tableOfCertainSizeAndTypeProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function (done) {
                var numFields = 14;
                var fieldType = consts.CHECKBOX;
                var table = tableGenerator.generateTableWithFieldsOfType(numFields, fieldType);

                if (!table[tableConsts.NAME]) {
                    assert.fail('Table should be generated with a name');
                }

                var fields = table[tableConsts.FIELDS];

                if (fields.length !== numFields) {
                    assert.fail('Did not find the right number of fields. Expected ' + numFields
                    + '. Table: ' +
                    tableGenerator.tableToJsonString(table));
                }

                _.forEach(fields, function(field) {
                    if (field[fieldConsts.fieldKeys.TYPE] !== fieldType) {
                        assert.fail('Did not find the right fieldType. Expected ' +
                        fieldType + '. Table: ' +
                        tableGenerator.tableToJsonString(table));
                    }
                });

                done();
            });
        });
    });

    function tableFromFieldMapProvider(){
        var fieldNameToTypeMap = {};
        fieldNameToTypeMap['checkbox field'] = consts.CHECKBOX;
        fieldNameToTypeMap['text field'] = consts.TEXT;
        fieldNameToTypeMap['multi line field'] = consts.MULTI_LINE_TEXT;
        fieldNameToTypeMap['phone number field'] = consts.PHONE_NUMBER;
        fieldNameToTypeMap['date field'] = consts.DATE;
        fieldNameToTypeMap['formula duration field'] = consts.FORMULA_DURATION;
        fieldNameToTypeMap['formula date field'] = consts.FORMULA_DATE;
        fieldNameToTypeMap['duration field'] = consts.DURATION;
        fieldNameToTypeMap['formula time of day field'] = consts.FORMULA_TIME_OF_DAY;
        fieldNameToTypeMap['time of day field'] = consts.TIME_OF_DAY;
        fieldNameToTypeMap['numeric field'] = consts.NUMERIC;
        fieldNameToTypeMap['formula numeric field'] = consts.FORMULA_NUMERIC;
        fieldNameToTypeMap['currency field'] = consts.CURRENCY;
        fieldNameToTypeMap['rating field'] = consts.RATING;
        fieldNameToTypeMap['formula currency field'] = consts.FORMULA_CURRENCY;
        fieldNameToTypeMap['percent field'] = consts.PERCENT;
        fieldNameToTypeMap['formula percent field'] = consts.FORMULA_PERCENT;
        fieldNameToTypeMap['url field'] = consts.URL;
        fieldNameToTypeMap['email address field'] = consts.EMAIL_ADDRESS;
        fieldNameToTypeMap['user field'] = consts.USER;
        fieldNameToTypeMap['formula user field'] = consts.FORMULA_USER;
        fieldNameToTypeMap['file attachment field'] = consts.FILE_ATTACHMENT;
        fieldNameToTypeMap['report link field'] = consts.REPORT_LINK;
        fieldNameToTypeMap['summary field'] = consts.SUMMARY;
        fieldNameToTypeMap['lookup field'] = consts.LOOKUP;
        fieldNameToTypeMap['formula phone number field'] = consts.FORMULA_PHONE_NUMBER;
        fieldNameToTypeMap['formula url field'] = consts.FORMULA_URL;
        fieldNameToTypeMap['formula checkbox field'] = consts.FORMULA_CHECKBOX;
        fieldNameToTypeMap['formula text field'] = consts.FORMULA_TEXT;
        fieldNameToTypeMap['formula email address field'] = consts.FORMULA_EMAIL_ADDRESS;


        return [
            {message: "generate a table based on a map holding custom names and all field types", fieldMap: fieldNameToTypeMap}
        ];
    }

    /**
     * Unit test that validates generating a table based on a map of fieldName: fieldType
     */
    describe('test generating a table with a map of custom name to field type ',function(){
        tableFromFieldMapProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function (done) {
                var fieldMap = entry.fieldMap;
                var table = tableGenerator.generateTableWithFieldMap(fieldMap);

                if (!table[tableConsts.NAME]) {
                    assert.fail('Table should be generated with a name');
                }

                var fields = table[tableConsts.FIELDS];
                var fieldNames = Object.keys(fieldMap);
                if (fields.length !== fieldNames.length) {
                    assert.fail('Did not find the right number of fields. Expected ' + fieldNames.length
                    + '. Table: ' +
                    tableGenerator.tableToJsonString(table));
                }

                var fieldFoundMap = {};
                _.forEach(fields, function(field) {
                    _.forEach(fieldMap, function (fieldType, fieldName){
                        //If we have found the field that we expect to have been generated from the map, then put it in the fieldFoundMap
                        if (field[fieldConsts.fieldKeys.TYPE] === fieldMap[fieldName] && field[fieldConsts.fieldKeys.NAME] === fieldName) {

                            if(!fieldFoundMap[field[fieldConsts.fieldKeys.NAME]]) {
                                fieldFoundMap[field[fieldConsts.fieldKeys.NAME]] = 1;
                            }else{
                                fieldFoundMap[field[fieldConsts.fieldKeys.NAME]] += 1;
                            }
                        }
                    });
                });

                fieldNames.forEach(function(fieldName){
                    if(!fieldFoundMap[fieldName] || fieldFoundMap[fieldName] > 1){
                        assert.fail('Could not find expected field with name' + fieldName
                        + ' and type '+ fieldMap[fieldName] +'. Table created: ' +
                        tableGenerator.tableToJsonString(table));
                    }
                });

                done();
            });
        });
    });
});



