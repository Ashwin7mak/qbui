/**
 * app.generator.js will generate valid json for an application and allow you to create an arbitrary number of
 * tables, fields, relationships, and roles
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    var consts = require('../server/api/constants');
    var tableGenerator = require('./table.generator');
    var appConsts = require('./app.constants');
    var appBuilder = require('./app.builder');
    var rawValueGenerator = require('./rawValue.generator');


    var _ = require('lodash');


    module.exports = {
        getAppBuilderWithName : function(){
            var builderInstance = appBuilder.builder();
            var appName = rawValueGenerator.generateString(appConsts.APP_NAME_LENGTH);
            builderInstance.withName(appName);
            return builderInstance;
        },

        generateAppWithTables : function(numTables){
            var builderInstance = getAppBuilderWithName();
            var tableToAdd;
            numTables.forEach( function (index){
                tableToAdd = tableGenerator.generateTable();
                builderInstance.withTable(tableToAdd);
            });
        },

        generateAppWithTablesOfSize : function(numTables, numFieldsPerTable){
            var builderInstance = getAppBuilderWithName();
            var tableToAdd;
            numTables.forEach( function (index){
                tableToAdd = tableGenerator.generateTable(numFieldsPerTable);
                builderInstance.withTable(tableToAdd);
            });
        },

        /**
         * Generate a table following the structure defined by a map from
         * table name to map of field name to field type.
         * </p>
         * For example:
         * {
         *  "Table1" : {
         *      "field 1" : CHECKBOX,
         *      "field 2" : TEXT,
         *      "numericField" : NUMERIC
         *  },
         *  "Table2" : {
         *      "field1" : CHECKBOX,
         *      "field2" : TEXT,
         *      "duration" : DURATION,
         *      "formula user" : FORMULA_USER
         *  }
         *
         */
        generateAppWithTablesFromMap : function(tableMap){
            var builderInstance = getAppBuilderWithName();
            var tableNames = Object.keys(tableMap);
            var fieldList;
            var tableBuilder;
            tableNames.forEach( function (tableName){
                tableBuilder = tableGenerator.getTableBuilder();
                tableBuilder.withName(tableName);
                fieldList = tableGenerator.generateFieldListFromMap(tableMap[tableName]);
                tableBuilder.withFields(fieldList);
                builderInstance.withTable(tableBuilder.build());
            });
        }
    };




}());