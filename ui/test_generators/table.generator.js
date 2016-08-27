/**
 * table.generator.js will generate valid json for a new table with an arbitrary number with various types of fields
 * Created by cschneider1 on 5/28/15.
 */
(function() {
    'use strict';
    //var consts = require('../common/src/constants');
    var rawValueGenerator = require('./rawValue.generator');
    var tableBuilder = require('./table.builder');
    var tableConsts = require('./table.constants');
    var fieldGenerator = require('./field.generator');
    var chance = require('chance').Chance();
    var FIELD_TYPE_CONST = 'fieldType';
    var DATA_TYPE_CONST = 'dataType';
    var DATA_ATTR_CONST = 'dataAttr';

    //The max number of fields we will generate at random
    var maxRandomFields = 10;

    module.exports = {


        getTableBuilder: function() {
            return tableBuilder.builder();
        },

        getMaxNumberRandomFields: function() {
            return maxRandomFields;
        },

        /**
         * Generate a list of field objects using the field generator
         * {
         *  field1 : { fieldType: SCALAR, dataType: CHECKBOX},
         *  field2 : { fieldType: SCALAR, dataType: NUMERIC},
         *  iLoveEmail : { fieldType: SCALAR, dataType: EMAIL_ADDRESS},
         *  youCanToo : { fieldType: SCALAR, dataType: EMAIL_ADDRESS}
         * }
         * </p>
         */
        generateFieldListFromMap: function(fieldMap) {
            var table = generateTableWithFieldMap(fieldMap);

            return table[tableConsts.FIELDS];
        },

        addFieldsOfType: function(inTableBuilder, numFieldsToAdd, fieldType, dataType) {
            var fields = generateFieldList(numFieldsToAdd, fieldType, dataType);
            inTableBuilder.withAdditionalFields(fields);
            return inTableBuilder;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateEmptyTable: function() {
            var builderInstance = getTableBuilderWithName();
            var tableInstance = builderInstance.build();
            return tableInstance;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateTableWithAllFieldTypes: function() {
            var builderInstance = generateTableWithAllFieldTypes();
            var tableInstance = builderInstance.build();
            return tableInstance;
        },

        /**
         * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
         */
        generateTable: function(size) {
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
        generateTableWithFieldsOfType: function(numFields, fieldType, dataType) {
            var builderInstance = generateTableWithFieldsOfFieldTypeAndDataType(numFields, fieldType, dataType);
            var tableInstance = builderInstance.build();
            return tableInstance;
        },


        /**
         * Generate a table with numFields number of fields using one of the allowed fieldType
         * @param appId the app id of the parent app
         * @param numFields the number of fields to generate
         * @param allowedFieldTypes array of allowed types
         * @returns {*} the table object with numFields of type fieldType
         */
        generateTableWithFieldsOfAllowedTypes: function(numFields, allowedFieldTypes) {
            var builderInstance = generateTableWithAnyFieldsOfType(numFields, allowedFieldTypes);
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
        generateTableWithFieldMap: function(fieldNameToTypeMap) {
            return generateTableWithFieldMap(fieldNameToTypeMap);
        },

        tableToJsonString: function(table) {
            return JSON.stringify(table);
        },

        validateTableProperties: function(table) {
            var fields = table[tableConsts.FIELDS];
            var fieldsValid = true;
            var tablePropsValid = true;

            if (typeof table[tableConsts.NAME] !== 'string') {
                tablePropsValid = false;
                console.error('The name of the table was not a string. Table: ' + JSON.stringify(table));
            }

            if (typeof table[tableConsts.APP_ID] !== 'undefined' && typeof table[tableConsts.APP_ID] !== 'string') {
                tablePropsValid = false;
                console.error('The app id on the table was not a string. Table: ' + JSON.stringify(table));
            }

            if (typeof table[tableConsts.TABLE_ALIAS] !== 'undefined' && typeof table[tableConsts.TABLE_ALIAS] !== 'string') {
                tablePropsValid = false;
                console.error('The table alias for the table was not a string. Table: ' + JSON.stringify(table));
            }

            for (var index in fields) {
                if (!fieldGenerator.validateFieldProperties(fields[index])) {
                    fieldsValid = false;
                    console.error('Could not validate field: ' + fieldGenerator.fieldToJsonString(fields[index]) + '.\n This field will not be added to the table');
                }
            }

            return tablePropsValid && fieldsValid;
        },

        //For a given field type, apply any default values that are not currently present in the map
        applyDefaults: function() {
        }
    };

    function getTableBuilderWithName() {
        var builderInstance = tableBuilder.builder();
        //var tableName = rawValueGenerator.generateString(15);
        var tableName = rawValueGenerator.generateEntityName({capitalize: true});
        builderInstance.withName(tableName);
        return builderInstance;
    }

    /**
     * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
     */
    function generateTableWithAllFieldTypes() {
        var builderInstance = getTableBuilderWithName();
        var availableFieldTypes = fieldGenerator.getAvailableFieldTypes();
        var availableDataTypes = fieldGenerator.getAvailableDataTypes();
        for (var i = 0; i < availableFieldTypes.length; i++) {
            for (var j = 0; j < availableDataTypes.length; j++) {

                var field = fieldGenerator.generateBaseField(availableFieldTypes[i], availableDataTypes[j]);
                builderInstance.withField(field);
            }
        }

        return builderInstance;
    }

    /**
     * Generate a json table blob with between 0 and 10 fields with the specified appId populated on the table
     * @return the table builder
     */
    function generateRandomTable(size) {
        var builderInstance = getTableBuilderWithName();
        var numFields = size || chance.integer({min: 1, max: maxRandomFields});
        var types = fieldGenerator.getAvailableFieldTypes();
        var dataTypes = fieldGenerator.getAvailableDataTypes();

        var maxFieldTypeIndex = types.length - 1;
        var maxDataTypeIndex = dataTypes.length - 1;
        for (var i = 0; i < numFields; i++) {
            var fieldTypeIndex = chance.integer({min: 1, max: maxFieldTypeIndex});
            var dataTypeIndex = chance.integer({min: 1, max: maxDataTypeIndex});

            var field = fieldGenerator.generateBaseField(types[fieldTypeIndex], dataTypes[dataTypeIndex]);
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
    function generateTableWithFieldsOfFieldTypeAndDataType(numFields, fieldType, dataType) {
        var builderInstance = getTableBuilderWithName();

        for (var i = 0; i < numFields; i++) {
            // get the next field type if more fields are request than there are types index wraps around to the start
            var field = fieldGenerator.generateBaseField(fieldType, dataType);
            builderInstance.withField(field);
        }

        return builderInstance;
    }


    /**
     * Generate a table with numFields number of fields from any of the allowed fieldTypes
     * @param appId the app id of the parent app
     * @param numFields the number of fields to generate
     * @param allowedFieldTypes the array of allowed field types
     * @param allowedDataTypes the array of allowed data types
     * @returns {*} the table object with numFields of type fieldType
     */
    function generateTableWithAnyFieldsOfType(numFields, allowedFieldTypes, allowedDataTypes) {
        var builderInstance = getTableBuilderWithName();
        if (allowedFieldTypes && allowedFieldTypes.length && allowedDataTypes && allowedDataTypes.length) {
            // get the list of fields in random order
            // with numfield entries in randomTypes if that's less than the full allowedFieldTypes list
            var randomTypes = chance.pick(allowedFieldTypes, numFields < allowedFieldTypes ? numFields : allowedFieldTypes.length);
            var randomDataTypes = chance.pick(allowedDataTypes, numFields < allowedDataTypes ? numFields : allowedFieldTypes.length);

            for (var i = 0; i < numFields; i++) {
                // get the next field type if more fields are request than there are types index wraps around to the start
                var fieldType = randomTypes[i % (randomTypes.length - 1)];
                var dataType = randomDataTypes[i % (randomDataTypes.length - 1)];
                var field = fieldGenerator.generateBaseField(fieldType, dataType);
                builderInstance.withField(field);
            }
        }

        return builderInstance;
    }

    /**
     * Generate a table with the fields as described in the fieldNameToTypeMap
     * </p>
     * The map should appear as:
     * {
         *  field1 : { fieldType: SCALAR, dataType: CHECKBOX},
         *  field2 : { fieldType: SCALAR, dataType: NUMERIC},
         *  iLoveEmail : { fieldType: SCALAR, dataType: EMAIL_ADDRESS},
         *  youCanToo : { fieldType: SCALAR, dataType: EMAIL_ADDRESS, dataAttr: {unique: true}}
         *  rosesAreRed : { fieldType: SCALAR, dataType: TEXT, dataAttr: {required: true, clientSideAttributes: {word_wrap: true}}}
         *
         *  the dataAttr property is optional
         * }
     * </p>
     * We will then return a table with fields of those names and types
     * @param fieldNameToTypeMap
     * @returns {*}
     */
    function generateTableWithFieldMap(fieldNameToTypeMap) {
        var field;
        var builderInstance = getTableBuilderWithName();

        var fieldNameKeys = Object.keys(fieldNameToTypeMap);

        fieldNameKeys.forEach(function(fieldName) {
            var fieldType = fieldNameToTypeMap[fieldName][FIELD_TYPE_CONST];
            var dataType = fieldNameToTypeMap[fieldName][DATA_TYPE_CONST];

            var fieldBuilder = fieldGenerator.getFieldBuilder();
            var dataTypeAttributeBuilder = fieldGenerator.getDataTypeBuilder();
            var dataTypeAttributes = dataTypeAttributeBuilder.withType(dataType).build();
            if (fieldNameToTypeMap[fieldName][DATA_ATTR_CONST]) {
                console.log(`dataTypeAttributes for ${fieldName} before=${JSON.stringify(dataTypeAttributes)} adding ${JSON.stringify(fieldNameToTypeMap[fieldName][DATA_ATTR_CONST])}`);
                dataTypeAttributes = Object.assign({}, dataTypeAttributes, fieldNameToTypeMap[fieldName][DATA_ATTR_CONST]);
                console.log(`dataTypeAttributes for ${fieldName} after=${JSON.stringify(dataTypeAttributes)}`);
            }
            if (fieldName.includes('User')) {
                field = fieldBuilder.withName(fieldName).withFieldType(fieldType).withDataTypeAttributes(dataTypeAttributes).build();
                field.indexed = true;
            } else {
                field = fieldBuilder.withName(fieldName).withFieldType(fieldType).withDataTypeAttributes(dataTypeAttributes).build();
            }
            builderInstance.withField(field);
        });

        return builderInstance.build();
    }

    /**
     * Generate a list of field objects using the field generator
     * @param numFields
     * @param fieldType
     * @param dataType
     */
    function generateFieldList(numFields, fieldType, dataType) {
        var fields = [];
        for (var i = 0; i < numFields; i++) {
            fields.push(fieldGenerator.generateBaseField(fieldType, dataType));
        }
        return fields;
    }
}());
