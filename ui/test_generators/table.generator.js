/**
 * table.generator.js will generate valid json for a new table with an arbitrary number with various types of fields
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    'use strict';
    var consts = require('../server/api/constants');
    var rawValueGenerator = require('./rawValue.generator');
    var tableBuilder = require('./table.builder');
    var tableConsts = require('./table.constants');
    var fieldGenerator = require('./field.generator');
    var Chance = require('chance');
    var chance = new Chance();

    //The max number of fields we will generate at random
    var maxRandomFields = 10;

    module.exports = {


        getTableBuilder : function(){
            return tableBuilder.builder();
        },

        getMaxNumberRandomFields : function(){
            return maxRandomFields;
        },

        /**
         * Generate a list of field objects using the field generator
         * {
        *  field1 : CHECKBOX,
        *  field2 : NUMERIC,
        *  iLoveEmail : EMAIL_ADDRESS,
        *  youCanToo : EMAIL_ADDRESS
        * }
         */
        generateFieldListFromMap: function(fieldMap){
            var fields = [];
            var fieldNameKeys = Object.keys(fieldMap);

            fieldNameKeys.forEach(function (fieldName){
                var fieldType = fieldMap[fieldName];
                var fieldBuilder = fieldGenerator.getFieldBuilder();
                var field = fieldBuilder.withName(fieldName).withType(fieldType).build();
                fields.push(field);
            });

            return fields;
        },

        addFieldsOfType : function(tableBuilder, numFieldsToAdd, fieldType){
            var fields = generateFieldList(numFieldsToAdd, fieldType);
            tableBuilder.withAdditionalFields(fields);
            return tableBuilder;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateEmptyTable : function(){
            var builderInstance = getTableBuilderWithName();
            var tableInstance = builderInstance.build();
            return tableInstance;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateTableWithAllFieldTypes : function(){
            var builderInstance = generateTableWithAllFieldTypes();
            var tableInstance = builderInstance.build();
            return tableInstance;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateTable : function(size){
            var builderInstance = generateRandomTable(size);
            var tableInstance = builderInstance.build();
            return tableInstance;
        },

        /**
         * Generate a table with numFields number of fields all of type fieldType
         * @param appId the app id of the parent app
         * @param numFields the number of fields to generate
         * @param fieldType the field type for all fields
         * @returns {*} the table object with numFields of type fieldType
         */
        generateTableWithFieldsOfType : function(numFields, fieldType){
            var builderInstance = generateTableWithFieldsOfType(numFields, fieldType);
            var tableInstance = builderInstance.build();
            return tableInstance;
        },

        /**
         * Generate a table with the fields as described in the fieldNameToTypeMap
         * </p>
         * The map should appear as:
         * {
         *  field1 : CHECKBOX,
         *  field2 : NUMERIC,
         *  iLoveEmail : EMAIL_ADDRESS,
         *  youCanToo : EMAIL_ADDRESS
         * }
         * </p>
         * We will then return a table with fields of those names and types
         * @param fieldNameToTypeMap
         * @returns {*}
         */
        generateTableWithFieldMap : function(fieldNameToTypeMap){
            var builderInstance = generateTableWithFieldMap(fieldNameToTypeMap);
            var tableInstance = builderInstance.build();
            return tableInstance;
        },

        tableToJsonString : function(table){
            return JSON.stringify(table);
        },

        validateTableProperties : function(table){

            var fields = table[tableConsts.FIELDS];
            var fieldsValid = true;
            var tablePropsValid = true;

            if(typeof table[tableConsts.NAME] !== 'string'){
                tablePropsValid = false;
                console.error('The name of the table was not a string. Table: ' + JSON.stringify(table));
            }

            if(typeof table[tableConsts.APP_ID] !== 'undefined' && typeof table[tableConsts.APP_ID] !== 'string'){
                tablePropsValid = false;
                console.error('The app id on the table was not a string. Table: ' + JSON.stringify(table));
            }

            if(typeof table[tableConsts.TABLE_ALIAS] !== 'undefined' && typeof table[tableConsts.TABLE_ALIAS] !== 'string'){
                tablePropsValid = false;
                console.error('The table alias for the table was not a string. Table: ' + JSON.stringify(table));
            }

            for(var index in fields){
                if(!fieldGenerator.validateFieldProperties(fields[index])) {
                    fieldsValid = false;
                    console.error('Could not validate field: ' + fieldGenerator.fieldToJsonString(field) + '.\n This field will not be added to the table');
                }
            }

            return tablePropsValid && fieldsValid;
        },

        //For a given field type, apply any default values that are not currently present in the map
        applyDefaults : function(tableToModify) {

        }
    };

    function getTableBuilderWithName(){
        var builderInstance = tableBuilder.builder();
        var tableName = rawValueGenerator.generateString(15);
        builderInstance.withName(tableName);
        return builderInstance;
    }

    /**
     * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
     */
    function generateTableWithAllFieldTypes(){
        var builderInstance = getTableBuilderWithName();
        var availableFieldTypes = fieldGenerator.getAvailableFieldTypes()
        for(var i= 0; i< availableFieldTypes.length; i++){
            var field = fieldGenerator.generateBaseField(availableFieldTypes[i]);
            builderInstance.withField(field);
        }

        return builderInstance;
    }

    /**
     * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
     * @return the table builder
     */
    function generateRandomTable(size){
        var builderInstance = getTableBuilderWithName();

        var numFields = undefined === size ? chance.integer({min:1, max:maxRandomFields}) : size;

        for(var i= 0; i< numFields; i++){
            var fieldTypeIndex = chance.integer({min:1, max:availableFieldTypes.length-1});

            var field = fieldGenerator.generateBaseField(availableFieldTypes[fieldTypeIndex]);

            builderInstance.withField(field);
        }

        return builderInstance;
    }

    /**
     * Generate a table with numFields number of fields all of type fieldType
     * @param appId the app id of the parent app
     * @param numFields the number of fields to generate
     * @param fieldType the field type for all fields
     * @returns {*} the table object with numFields of type fieldType
     */
    function generateTableWithFieldsOfType(numFields, fieldType){
        var builderInstance = getTableBuilderWithName();

        for(var i= 0; i< numFields; i++){
            var field = fieldGenerator.generateBaseField(fieldType);
            builderInstance.withField(field);
        }

        return builderInstance;
    }

    /**
     * Generate a table with the fields as described in the fieldNameToTypeMap
     * </p>
     * The map should appear as:
     * {
         *  field1 : CHECKBOX,
         *  field2 : NUMERIC,
         *  iLoveEmail : EMAIL_ADDRESS,
         *  youCanToo : EMAIL_ADDRESS
         * }
     * </p>
     * We will then return a table with fields of those names and types
     * @param fieldNameToTypeMap
     * @returns {*}
     */
    function generateTableWithFieldMap(fieldNameToTypeMap){
        var builderInstance = getTableBuilderWithName();

        var fieldNameKeys = Object.keys(fieldNameToTypeMap);

        fieldNameKeys.forEach(function (fieldName){
            var fieldType = fieldNameToTypeMap[fieldName];
            var fieldBuilder = fieldGenerator.getFieldBuilder();
            var field = fieldBuilder.withName(fieldName).withType(fieldType).build();
            builderInstance.withField(field);
        });

        return builderInstance;
    }

    /**
     * Generate a list of field objects using the field generator
     * @param numFields
     * @param fieldType
     */
    function generateFieldList(numFields, fieldType){
        var fields = [];
        for(var i= 0; i< numFields; i++){
            fields.push(fieldGenerator.generateBaseField(fieldType));
        }
        return fields;
    }
}());