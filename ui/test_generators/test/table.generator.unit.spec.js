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

        console.log('table: ' + JSON.stringify(table));

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
        for(var index in fields){
            field = fields[index];
            if(!fieldsCreated[field[fieldConsts.fieldKeys.TYPE]]) {
                fieldsCreated[field[fieldConsts.fieldKeys.TYPE]] = 1;
            }else{
                fieldsCreated[field[fieldConsts.fieldKeys.TYPE]] += 1;
            }
        }

        for(var typeIndex in availableFieldTypes){
            var fieldTypeCount = fieldsCreated[availableFieldTypes[typeIndex]];
            assert.equal(fieldTypeCount, 1, 'We should have a single field per type')
        }
    });

    /**
     * Unit test that validates generating a table with a random number of fields
     */
    describe('test generating a table with all field types',function(){
        var table = tableGenerator.generateTable();

        console.log('table: ' + JSON.stringify(table));

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

    /**
     * Unit test that validates generating a table with a fixed number of fields of a particular type
     */
    describe('test generating a table with all field types',function(){
        var numFields = 14;
        var fieldType = consts.CHECKBOX;
        var table = tableGenerator.generateTableWithFieldsOfType(numFields, fieldType);

        console.log('table: ' + JSON.stringify(table));

        if(!table[tableConsts.NAME]){
            assert.fail('Table should be generated with a name');
        }

        var fields = table[tableConsts.FIELDS];

        if(fields.length !== numFields){
            assert.fail('Did not find the right number of fields. Expected ' + numFields
            + '. Table: ' +
            tableGenerator.tableToJsonString(table));
        }

        var field;
        for(var index in fields){
            field = fields[index];
            if(field[fieldConsts.fieldKeys.TYPE] !== fieldType){
                assert.fail('Did not find the right fieldType. Expected ' +
                fieldType + '. Table: ' +
                tableGenerator.tableToJsonString(table));
            }
        }
    });
});



