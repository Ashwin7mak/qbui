/**
 * A test to test our test generation code
 * Created by cschneider1 on 6/1/15.
 */
'use strict';

var should = require('should');
var appGenerator = require('../app.generator');
var appConsts = require('../app.constants');
var tableConsts = require('../table.constants');
var fieldConsts = require('../field.constants');
var consts = require('../../server/api/constants');
var _ = require('lodash');
var assert = require('assert');

/**
 * Unit tests for app generator
 */
describe('App generator unit test', function () {

    function appWithNumTablesProvider(){
        return [
            {message: "Generate 0 tables", numTables : 0},
            {message: "Generate 1 tables", numTables : 1},
            {message: "Generate 10 tables", numTables : 10},
        ];
    }

    /**
     * Unit test that validates generating an app with a specified number of tables
     */
    describe('test generating an app with a specified number of tables',function(){
        appWithNumTablesProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function (done) {
                var numTables = entry.numTables;
                var app = appGenerator.generateAppWithTables(numTables);

                if(!app[appConsts.NAME]){
                    assert.fail('Table should be generated with a name');
                }

                var tables = app[appConsts.TABLES];

                if(tables && tables.length !== numTables){
                    assert.fail('Did not find the right number of fields. Expected ' +
                    numTables + '. Table: ' +
                    appGenerator.appToJsonString(app));
                }

                done();
            });
        });
    });

    function appWithNumTablesNumFieldsProvider(){
        return [
            {message: "Generate 1 tables, 0 fields", numTables : 1, numFields: 0},
            {message: "Generate 1 tables, 1 field", numTables : 1, numFields: 1},
            {message: "Generate 1 tables, 10 field", numTables : 1, numFields: 10},
            {message: "Generate 10 tables, 10 field", numTables : 10, numFields: 10},
        ];
    }

    /**
     * Unit test that validates generating an app with a specified number of tables and a specified number of fields
     */
    describe('test generating an app with a specified number of tables and a specified number of fields',function(){
        appWithNumTablesNumFieldsProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function (done) {
                var numTables = entry.numTables;
                var numFields = entry.numFields;
                var app = appGenerator.generateAppWithTablesOfSize(numTables, numFields);

                if(!app[appConsts.NAME]){
                    assert.fail('Table should be generated with a name');
                }

                var tables = app[appConsts.TABLES];

                if(tables.length !== numTables){
                    assert.fail('Did not find the right number of tables. Expected ' +
                    numTables + '. App: ' +
                    appGenerator.appToJsonString(app));
                }

                var fieldsPerTable;
                _.forEach(tables, function(table) {
                    fieldsPerTable = table[tableConsts.FIELDS];
                    if(fieldsPerTable && fieldsPerTable.length !== numFields){
                        assert.fail('Did not find the right number of fields on table. Expected ' +
                        numFields + ' on table named '+ table[tableConsts.NAME] +'. App: ' +
                        appGenerator.appToJsonString(app));
                    }
                });

                done();
            });
        });
    });

    function appFromTableMapProvider(){
        var tableToFieldToFieldTypeMap = {};
        tableToFieldToFieldTypeMap['table 1'] = {};
        tableToFieldToFieldTypeMap['table 1']['field 1'] = consts.TEXT;
        tableToFieldToFieldTypeMap['table 1']['field 2'] = consts.MULTI_LINE_TEXT;
        tableToFieldToFieldTypeMap['table 1']['field 3'] = consts.PHONE_NUMBER;
        tableToFieldToFieldTypeMap['table 1']['field 4'] = consts.DATE;
        tableToFieldToFieldTypeMap['table 1']['field 5'] = consts.FORMULA_DURATION;
        tableToFieldToFieldTypeMap['table 1']['field 6'] = consts.FORMULA_DATE;
        tableToFieldToFieldTypeMap['table 1']['field 7'] = consts.DURATION;

        tableToFieldToFieldTypeMap['table 2'] = {};
        tableToFieldToFieldTypeMap['table 2']['field 1'] = consts.NUMERIC;
        tableToFieldToFieldTypeMap['table 2']['field 2'] = consts.NUMERIC;
        tableToFieldToFieldTypeMap['table 2']['field 3'] = consts.NUMERIC;
        tableToFieldToFieldTypeMap['table 2']['field 4'] = consts.NUMERIC;


        return [
            {message: "generate a table based on a map holding custom table names and custom fields", tableMap: tableToFieldToFieldTypeMap}
        ];
    }

    /**
     * Unit test that validates generating an app a map of table : fieldName: fieldType
     */
    describe('test generating an app with a map of custom table names and custom fields',function(){
        appFromTableMapProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function (done) {
                var tableMap = entry.tableMap;
                var app = appGenerator.generateAppWithTablesFromMap(tableMap);

                if (!app[appConsts.NAME]) {
                    assert.fail('App should be generated with a name');
                }

                var tables = app[appConsts.TABLES];
                var tableNames = Object.keys(tableMap);
                if (tables.length !== tableNames.length) {
                    assert.fail('Did not find the right number of tables. Expected ' + tableNames.length
                    + '. App: ' +
                    appGenerator.appToJsonString(app));
                }

                var tableFoundMap = {};
                var fields;
                _.forEach(tables, function(table) {
                        fields = table[tableConsts.FIELDS];
                    _.forEach(tableNames, function (tableName) {
                        if(tableName === table[tableConsts.NAME]){
                            if (!tableFoundMap[table[tableConsts.NAME]]) {
                                tableFoundMap[table[tableConsts.NAME]] = {count: 1, fields:{}};
                            } else {
                                tableFoundMap[table[tableConsts.NAME]].count += 1;
                            }

                            _.forEach(fields, function (field) {
                                _.forEach(tableMap[tableName], function (fieldType, fieldName) {
                                    //If we have found the field that we expect to have been generated from the map, then put it in the fieldFoundMap
                                    if (field[fieldConsts.fieldKeys.TYPE] === fieldType && field[fieldConsts.fieldKeys.NAME] === fieldName) {

                                        if (!tableFoundMap[table[tableConsts.NAME]]) {
                                            tableFoundMap[table[tableConsts.NAME]].fields[field[fieldConsts.fieldKeys.NAME]] = 1;
                                        } else {
                                            tableFoundMap[table[tableConsts.NAME]].fields[field[fieldConsts.fieldKeys.NAME]] += 1;
                                        }
                                    }
                                });
                            });
                        }
                    });
                });

                tableNames.forEach(function(tableName){
                    if(!tableFoundMap[tableName] || tableFoundMap[tableName] > 1){
                        assert.fail('Could not find expected table with name' + tableName
                         +'. App created: ' +
                        appGenerator.appToJsonString(app));
                    }

                    _.forEach(tableFoundMap[tableName], function (fieldType, fieldName) {
                        if(!tableFoundMap[tableName][fieldName] || tableFoundMap[tableName][fieldName] > 1){
                            assert.fail('Could not find expected table with field of name' + fieldName
                            +'. App created: ' +
                            appGenerator.appToJsonString(app));
                        }
                    });
                });

                done();
            });
        });
    });
});



