/**
 * field.generator.js will generate valid json for a particular field of a particular type. It leverages the builder pattern
 * to allow the caller to set various properties on the field
 * Created by cschneider1 on 5/28/15.
 */
(function() {
    'use strict';
    var consts = require('../server/api/constants');
    var fieldConsts = require('./field.constants');
    var defaultConsts = require('./field.schema.defaults');
    var rawValueGenerator = require('./rawValue.generator');
    var fieldBuilder = require('./field.builder');
    var datatypeAttributesGenerator = require('./datatype.attributes.generator');
    var _ = require('lodash');
    var FIELD_KEYS = 'fieldKeys';

    module.exports = {
        getFieldBuilder : function() {
            return fieldBuilder.builder();
        },

        getDataTypeBuilder : function() {
            return datatypeAttributesGenerator.getDataTypeBuilder();
        },

        getAvailableFieldTypes : function() {
            return fieldConsts.availableFieldTypes;
        },

        getAvailableDataTypes : function() {
            return datatypeAttributesGenerator.getAvailableDataTypes();
        },

        //Generate a json field blob based on field type
        generateBaseField : function(type, datatype) {
            var builder = fieldBuilder.builder();
            var fieldName = rawValueGenerator.generateString(15);
            var datatypeAttributes = datatypeAttributesGenerator.generateBaseDataType(datatype);
            var field = builder.withName(fieldName).withFieldType(type).withDataTypeAttributes(datatypeAttributes).build();
            return field;
        },

        fieldToJsonString : function(field) {
            return JSON.stringify(field);
        },

        validateFieldProperties : function(field) {
            //these will be initialized in the loop to be false
            //let's start out assuming the best and let the loop tell us if we're in trouble
            var foundKey = false;
            var valueValid = true;
            var dataTypeAttributesValid = true;
            var typesKeyWord = 'types';
            var fieldType = field[fieldConsts.fieldKeys.TYPE];
            var fieldKeys = Object.keys(field);
            var dataTypeAttributes = field[fieldConsts.fieldKeys.DATA_TYPE_ATTRIBUTES];


            //loop over all of the keys on the passed field
            fieldKeys.forEach(function(fieldKey) {
                foundKey = false;
                //loop over every key in for this field type
                _.forEach(fieldConsts[fieldType][FIELD_KEYS], function(constValue, constKey) {

                    if (fieldKey === 'datatypeAttributes' && constValue !== fieldKey) {
                        console.log('blech');
                    }

                    //if we find the fieldKey matches current JSON constant then make sure we have found the right type
                    if (constValue === fieldKey) {

                        foundKey = true;

                        //check that we have defined the type for this key word
                        if (typeof fieldConsts[fieldType][typesKeyWord][constKey] === 'undefined') {
                            console.error('Type is not undefined for keyWord "' + fieldKey + '. Validating field ' + JSON.stringify(field));
                        }

                        var actualTypeOfProperty = typeof field[fieldKey];
                        var expectedTypeOfProperty = fieldConsts[fieldType][typesKeyWord][constKey];

                        if (actualTypeOfProperty !== expectedTypeOfProperty) {
                            valueValid = false;
                        }
                    }
                });

                if (foundKey == false) {
                    console.error('We could not find this key in our key constants for a field. Key in question: ' +fieldKey+ ' Field ' + JSON.stringify(field));
                }

                if (valueValid == false) {
                    console.error('There was a value type mismatch. Key in question: ' +fieldKey+ ' Field ' + JSON.stringify(field));
                }

            });

            if (!datatypeAttributesGenerator.validateDataTypeProperties(dataTypeAttributes)) {
                dataTypeAttributesValid = false;
                console.error('Could not validate dataTypeAttributes: ' + datatypeAttributesGenerator.fieldToJsonString(dataTypeAttributes) + '.\n This field will not be added to the table');
            }

            return foundKey && valueValid && dataTypeAttributesValid;
        },

        //For a given field type, apply any default values that are not currently present in the map
        applyDefaults : function(fieldToModify) {
            var type = fieldToModify[fieldConsts.fieldKeys.TYPE];

            if (!fieldTypeToFunctionCalls[type]) {
                throw new Error('Field type not found in fieldTypeToFunctionCalls');
            }

            fieldTypeToFunctionCalls[type](fieldToModify);
        }
    };



    var fieldTypeToFunctionCalls = {};

    //map fields by type so that we can know what to do fairly easily by grabbing keys
    //formula fields
    fieldTypeToFunctionCalls[consts.FORMULA] = applyFormulaHierarchy;

    //concrete/scalar fields
    fieldTypeToFunctionCalls[consts.SCALAR] = applyScalarHierarchy;

    //virtuals
    fieldTypeToFunctionCalls[consts.LOOKUP] = applyFieldDefaults;
    fieldTypeToFunctionCalls[consts.SUMMARY] = function(fieldToModify){applyFieldDefaults(fieldToModify); applySummaryFieldDefaults(fieldToModify);};

    //weirdos
    fieldTypeToFunctionCalls[consts.REPORT_LINK] = function(fieldToModify){applyFieldDefaults(fieldToModify); applyReportLinkDefaults(fieldToModify);};

    fieldTypeToFunctionCalls[consts.CONCRETE] = applyConcreteHierarchy;

    function applyFormulaHierarchy(fieldToModify) {
        applyFieldDefaults(fieldToModify);
        applyFormulaDefaults(fieldToModify);
    }

    function applyConcreteHierarchy(fieldToModify) {
        applyFieldDefaults(fieldToModify);
        applyConcreteDefaults(fieldToModify);
    }

    function applyScalarHierarchy(fieldToModify) {
        applyConcreteHierarchy(fieldToModify)
        applyScalarDefaults(fieldToModify);
    }

    function applyFieldDefaults(fieldToModify) {
        //apply all high level field properties that are missing
        //we can't apply an id as that will be assigned by the api
        if (!fieldToModify[fieldConsts.fieldKeys.BUILT_IN]) {
            fieldToModify[fieldConsts.fieldKeys.BUILT_IN] = defaultConsts.fieldDefaults.BUILTIN_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.fieldKeys.DATA_IS_COPYABLE]) {
            fieldToModify[fieldConsts.fieldKeys.DATA_IS_COPYABLE] = defaultConsts.fieldDefaults.DATA_COPYABLE_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.fieldKeys.INCLUDE_IN_QUICKSEARCH]) {
            fieldToModify[fieldConsts.fieldKeys.INCLUDE_IN_QUICKSEARCH] = defaultConsts.fieldDefaults.USE_IN_QUICKSEARCH_DEFAULT;
        }
    }

    function applyConcreteDefaults(fieldToModify) {
        var fieldType = fieldToModify[fieldConsts.fieldKeys.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].REQUIRED]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].REQUIRED] = defaultConsts.concreteDefaults.REQUIRED_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].USER_EDITABLE_VALUE]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].USER_EDITABLE_VALUE] = defaultConsts.concreteDefaults.USER_EDITABLE_DEFAULT;
        }
    }

    function applyFormulaDefaults(fieldToModify) {
        var fieldType = fieldToModify[fieldConsts.fieldKeys.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].FORMULA]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].FORMULA] = defaultConsts.formulaDefaults.FORMULA_STRING_DEFAULT;
        }
    }

    function applyScalarDefaults(fieldToModify) {
        var fieldType = fieldToModify[fieldConsts.fieldKeys.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].UNIQUE]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].UNIQUE] = defaultConsts.scalarDefaults.UNIQUE_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].INDEXED]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].INDEXED] = defaultConsts.scalarDefaults.INDEXED_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].MULTIPLE_CHOICE_SOURCE_ALLOWED]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].MULTIPLE_CHOICE_SOURCE_ALLOWED] = defaultConsts.scalarDefaults.MULTI_CHOICE_SOURCE_ALLOWED_DEFAULT;
        }
    }

    function applyReportLinkDefaults(fieldToModify) {
        var fieldType = fieldToModify[fieldConsts.fieldKeys.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DISPLAY_PROTOCOL]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DISPLAY_PROTOCOL] = defaultConsts.reportDefaults.DISPLAY_PROTOCOL_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].LINK_TEXT]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].LINK_TEXT] = defaultConsts.reportDefaults.LINK_TEXT_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].EXACT_MATCH]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].EXACT_MATCH] = defaultConsts.reportDefaults.EXACT_MATCH_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].MULTI_CHOICE_SOURCE_ALLOWED]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].MULTI_CHOICE_SOURCE_ALLOWED] = defaultConsts.reportDefaults.MULTI_CHOICE_SOURCE_ALLOWED_DEFAULT;
        }
    }

    function applySummaryFieldDefaults(fieldToModify) {
        var fieldType = fieldToModify[fieldConsts.fieldKeys.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].AGGREGATE_FUNCTION]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].AGGREGATE_FUNCTION] = defaultConsts.summaryDefaults.AGGREGATE_FUNCTION_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DECIMAL_PLACES]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DECIMAL_PLACES] = defaultConsts.summaryDefaults.DECIMAL_PLACES_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].TREAT_NULL_AS_ZERO]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].TREAT_NULL_AS_ZERO] = defaultConsts.summaryDefaults.TREAT_NULL_AS_ZERO_DEFAULT;
        }
    }

}());