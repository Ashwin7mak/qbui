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

    var availableFieldTypes = [
        consts.CHECKBOX,
        consts.TEXT,
        consts.MULTI_LINE_TEXT,
        consts.BIGTEXT,
        consts.PHONE_NUMBER,
        consts.DATE_TIME,
        consts.FORMULA_DATE_TIME,
        consts.DATE,
        consts.DURATION,
        consts.FORMULA_DURATION,
        consts.FORMULA_DATE,
        consts.FORMULA_TIME_OF_DAY,
        consts.TIME_OF_DAY,
        consts.NUMERIC,
        consts.FORMULA_NUMERIC,
        consts.CURRENCY,
        consts.RATING,
        consts.FORMULA_CURRENCY,
        consts.PERCENT,
        consts.FORMULA_PERCENT,
        consts.URL,
        consts.EMAIL_ADDRESS,
        consts.USER,
        consts.FORMULA_USER,
        consts.FILE_ATTACHMENT,
        consts.REPORT_LINK,
        consts.SUMMARY,
        consts.LOOKUP,
        consts.FORMULA_PHONE_NUMBER,
        consts.FORMULA_URL,
        consts.FORMULA_CHECKBOX,
        consts.FORMULA_TEXT,
        consts.FORMULA_EMAIL_ADDRESS];

    //The max number of fields we will generate at random
    var maxRandomFields = 10;

    module.exports = {


        getTableBuilder : function(){
            return tableBuilder.builder();
        },

        getAvailableFieldTypes : function(){
            return availableFieldTypes;
        },

        getMaxNumberRandomFields : function(){
            return maxRandomFields;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateTableWithAllFieldTypesForApp : function(appId){
            var builder = generateTableWithAllFieldTypes();
            builder.withAppId(appId);
            table = builder.build();
            return table;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateTableForApp : function(appId){
            var builder = generateRandomTable();
            builder.withAppId(appId);
            table = builder.build();
            return table;
        },

        /**
         * Generate a table with numFields number of fields all of type fieldType
         * @param appId the app id of the parent app
         * @param numFields the number of fields to generate
         * @param fieldType the field type for all fields
         * @returns {*} the table object with numFields of type fieldType
         */
        generateTableWithFieldsOfTypeForApp : function(appId, numFields, fieldType){
            var builder = generateTableWithFieldsOfType(numFields, fieldType);
            builder.withAppId(appId);
            table = builder.build();
            return table;
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
        generateTableWithFieldMapForApp : function(appId, fieldNameToTypeMap){
            var builder = generateTableWithFieldMapForApp(fieldNameToTypeMap);
            builder.withAppId(appId);
            var table = builder.build();
            return table;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateTableWithAllFieldTypes : function(){
            var builder = generateTableWithAllFieldTypes();
            var table = builder.build();
            return table;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateTable : function(){
            var builder = generateRandomTable();
            var table = builder.build();
            return table;
        },

        /**
         * Generate a table with numFields number of fields all of type fieldType
         * @param appId the app id of the parent app
         * @param numFields the number of fields to generate
         * @param fieldType the field type for all fields
         * @returns {*} the table object with numFields of type fieldType
         */
        generateTableWithFieldsOfType : function(numFields, fieldType){
            var builder = generateTableWithFieldsOfType(numFields, fieldType);
            var table = builder.build();
            return table;
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
            var builder = generateTableWithFieldMapForApp(fieldNameToTypeMap);
            var table = builder.build();
            return table;
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
        var builder = tableBuilder.builder();
        var tableName = rawValueGenerator.generateString(15);
        builder.withName(tableName);
        return builder;
    }

    /**
     * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
     */
    function generateTableWithAllFieldTypes(){
        var builder = getTableBuilderWithName();

        for(var i= 0; i< availableFieldTypes.length; i++){
            var field = fieldGenerator.generateBaseField(availableFieldTypes[i]);
            builder.withField(field);
        }

        return builder;
    }

    /**
     * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
     * @return the table builder
     */
    function generateRandomTable(){
        var builder = getTableBuilderWithName();

        var numFields = chance.integer({min:1, max:maxRandomFields});
        for(var i= 0; i< numFields; i++){
            var fieldTypeIndex = chance.integer({min:1, max:availableFieldTypes.length-1});

            var field = fieldGenerator.generateBaseField(availableFieldTypes[fieldTypeIndex]);

            builder.withField(field);
        }

        return builder;
    }

    /**
     * Generate a table with numFields number of fields all of type fieldType
     * @param appId the app id of the parent app
     * @param numFields the number of fields to generate
     * @param fieldType the field type for all fields
     * @returns {*} the table object with numFields of type fieldType
     */
    function generateTableWithFieldsOfType(numFields, fieldType){
        var builder = getTableBuilderWithName();

        for(var i= 0; i< numFields; i++){
            var field = fieldGenerator.generateBaseField(fieldType);
            builder.withField(field);
        }

        return builder;
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
    function generateTableWithFieldMapForApp(fieldNameToTypeMap){
        var builder = getTableBuilderWithName();

        var fieldNameKeys = Object.keys(fieldNameToTypeMap);

        fieldNameKeys.forEach(function (fieldName){
            var fieldType = fieldNameToTypeMap[fieldName];
            var fieldBuilder = fieldGenerator.getFieldBuilder();
            var field = fieldBuilder.withName(fieldName).withType(fieldType).build();
            builder.withField(field);
        });

        return builder;
    }
}());