/**
 * field.generator.js will generate valid json for a particular field of a particular type. It leverages the builder pattern
 * to allow the caller to set various properties on the field
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    'use strict';
    var consts = require('../server/api/constants');
    var fieldConsts = require('./field.constants');
    var defaultConsts = require('./field.schema.defaults');
    var rawValueGenerator = require('./rawValue.generator');
    var fieldBuilder = require('./field.builder');
    var _ = require('lodash');
    var FIELD_KEYS = 'fieldKeys';
    
    module.exports = {
        getFieldBuilder : function(){
            return fieldBuilder.builder();
        },

        getAvailableFieldTypes : function(){
            return fieldConsts.availableFieldTypes;
        },

        //Generate a json field blob based on field type
        generateBaseField : function(type){
            var builder = fieldBuilder.builder();
            var fieldName = rawValueGenerator.generateString(15);
            var field = builder.withName(fieldName).withType(type).build();
            return field;
        },

        fieldToJsonString : function(field){
            return JSON.stringify(field);
        },

        validateFieldProperties : function(field){

            //these will be initialized in the loop to be false
            //let's start out assuming the best and let the loop tell us if we're in trouble
            var foundKey = false;
            var valueValid = true;
            var typesKeyWord = 'types';
            var fieldType = field[fieldConsts.TYPE];
            var fieldKeys = Object.keys(field);

            //loop over all of the keys on the passed field
            fieldKeys.forEach(function (fieldKey) {
                foundKey = false;
                //loop over every key in for this field type
                _.forEach(fieldConsts[fieldType][FIELD_KEYS], function (constValue, constKey) {

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

                if(foundKey == false){
                    console.error('We could not find this key in our key constants for a field. Key in question: ' +fieldKey+ ' Field ' + JSON.stringify(field));
                }

                if(valueValid == false){
                    console.error('There was a value type mismatch. Key in question: ' +fieldKey+ ' Field ' + JSON.stringify(field));
                }

            });

            return foundKey && valueValid;
        },

        //For a given field type, apply any default values that are not currently present in the map
        applyDefaults : function(fieldToModify) {
            var type = fieldToModify[fieldConsts.TYPE];

            if(!fieldTypeToFunctionCalls[type]){
                throw new Error('Field type not found in fieldTypeToFunctionCalls');
            }

            fieldTypeToFunctionCalls[type](fieldToModify);
        }
    };



    var fieldTypeToFunctionCalls = {};

    //map fields by type so that we can know what to do fairly easily by grabbing keys
    //formula fields
    fieldTypeToFunctionCalls[consts.FORMULA_DATE_TIME] = applyDateTimeFormulaHierarchy;
    fieldTypeToFunctionCalls[consts.FORMULA_DATE] = applyDateFormulaHierarchy;
    fieldTypeToFunctionCalls[consts.FORMULA_TIME_OF_DAY] = function(fieldToModify){ applyDateTimeFormulaHierarchy(fieldToModify); applyTimeOfDayDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.FORMULA_NUMERIC] = applyNumericFormulaHierarchy;
    fieldTypeToFunctionCalls[consts.FORMULA_CURRENCY] = applyNumericFormulaHierarchy;
    fieldTypeToFunctionCalls[consts.FORMULA_PERCENT] = applyNumericFormulaHierarchy;
    fieldTypeToFunctionCalls[consts.FORMULA_DURATION] = function(fieldToModify){applyNumericFormulaHierarchy(fieldToModify); applyDurationDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.FORMULA_USER] = applyFormulaHierarchy;
    fieldTypeToFunctionCalls[consts.FORMULA_TEXT] = applyFormulaHierarchy;
    fieldTypeToFunctionCalls[consts.FORMULA_PHONE_NUMBER] = function(fieldToModify){ applyFormulaHierarchy(fieldToModify); applyPhoneNumberDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.FORMULA_EMAIL_ADDRESS] = function(fieldToModify){ applyFormulaHierarchy(fieldToModify); applyEmailDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.FORMULA_URL] = applyFormulaHierarchy;
    fieldTypeToFunctionCalls[consts.FORMULA_CHECKBOX] = applyFormulaHierarchy;
    fieldTypeToFunctionCalls[consts.FORMULA_USER] = function(fieldToModify){applyFormulaHierarchy(fieldToModify); applyUserDefaults(fieldToModify);};

    //concrete/scalar fields
    fieldTypeToFunctionCalls[consts.PERCENT] = applyNumericHierarchy;
    fieldTypeToFunctionCalls[consts.NUMERIC] = applyNumericHierarchy;
    fieldTypeToFunctionCalls[consts.CURRENCY] = applyNumericHierarchy;
    fieldTypeToFunctionCalls[consts.RATING] = applyNumericHierarchy;
    fieldTypeToFunctionCalls[consts.DURATION] = function(fieldToModify){applyNumericHierarchy(fieldToModify); applyDurationDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.TEXT] = applyTextHierarchy;
    fieldTypeToFunctionCalls[consts.MULTI_LINE_TEXT] = applyTextHierarchy;
    fieldTypeToFunctionCalls[consts.BIGTEXT] = applyTextHierarchy;
    fieldTypeToFunctionCalls[consts.URL] = function(fieldToModify){ applyScalarHierarchy(fieldToModify); applyUrlDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.EMAIL_ADDRESS] = function(fieldToModify){ applyScalarHierarchy(fieldToModify); applyEmailDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.PHONE_NUMBER] = function(fieldToModify){ applyScalarHierarchy(fieldToModify); applyPhoneNumberDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.DATE_TIME] = applyDateTimeHierarchy;
    fieldTypeToFunctionCalls[consts.DATE] = applyDateHierarchy;
    fieldTypeToFunctionCalls[consts.TIME_OF_DAY] = function(fieldToModify){ applyDateTimeHierarchy(fieldToModify); applyTimeOfDayDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.CHECKBOX] = applyScalarHierarchy;
    fieldTypeToFunctionCalls[consts.USER] = function(fieldToModify){applyScalarHierarchy(fieldToModify); applyUserDefaults(fieldToModify);};

    //virtuals
    fieldTypeToFunctionCalls[consts.LOOKUP] = applyFieldDefaults;
    fieldTypeToFunctionCalls[consts.SUMMARY] = function(fieldToModify){applyFieldDefaults(fieldToModify); applySummaryFieldDefaults(fieldToModify);};

    //weirdos
    fieldTypeToFunctionCalls[consts.REPORT_LINK] = function(fieldToModify){applyFieldDefaults(fieldToModify); applyReportLinkDefaults(fieldToModify);};
    fieldTypeToFunctionCalls[consts.FILE_ATTACHMENT] = function(fieldToModify){applyConcreteHierarchy(fieldToModify); applyFileAttachmentDefaults(fieldToModify);};

    function applyFormulaHierarchy(fieldToModify){
        applyFieldDefaults(fieldToModify);
        applyFormulaDefaults(fieldToModify);
    };

    function applyConcreteHierarchy(fieldToModify){
        applyFieldDefaults(fieldToModify);
        applyConcreteDefaults(fieldToModify);
    };

    function applyScalarHierarchy(fieldToModify){
        applyConcreteHierarchy(fieldToModify)
        applyScalarDefaults(fieldToModify);
    };

    function applyNumericHierarchy(fieldToModify){
        applyScalarHierarchy(fieldToModify)
        applyNumericDefaults(fieldToModify);
    };

    function applyNumericFormulaHierarchy(fieldToModify){
        applyFormulaHierarchy(fieldToModify)
        applyNumericDefaults(fieldToModify);
    };

    function applyDateHierarchy(fieldToModify){
        applyConcreteHierarchy(fieldToModify)
        applyDateDefaults(fieldToModify);
    };

    function applyDateFormulaHierarchy(fieldToModify){
        applyFormulaHierarchy(fieldToModify)
        applyDateDefaults(fieldToModify);
    };

    function applyDateTimeHierarchy(fieldToModify){
        applyDateHierarchy(fieldToModify)
        applyDateTimeDefaults(fieldToModify);
    };

    function applyDateTimeFormulaHierarchy(fieldToModify){
        applyFormulaHierarchy(fieldToModify)
        applyDateTimeDefaults(fieldToModify);
    };

    function applyTextHierarchy(fieldToModify){
        applyScalarHierarchy(fieldToModify)
        applyTextDefaults(fieldToModify);
    };

    function applyFieldDefaults(fieldToModify){
        //apply all high level field properties that are missing
        //we can't apply an id as that will be assigned by the api
        if(!fieldToModify[fieldConsts.BUILT_IN]) {
            fieldToModify[fieldConsts.BUILT_IN] = defaultConsts.fieldDefaults.BUILTIN_DEFAULT;
        }

        if(!fieldToModify[fieldConsts.DATA_IS_COPYABLE]) {
            fieldToModify[fieldConsts.DATA_IS_COPYABLE] = defaultConsts.fieldDefaults.DATA_COPYABLE_DEFAULT;
        }

        if(!fieldToModify[fieldConsts.INCLUDE_IN_QUICKSEARCH]) {
            fieldToModify[fieldConsts.INCLUDE_IN_QUICKSEARCH] = defaultConsts.fieldDefaults.USE_IN_QUICKSEARCH_DEFAULT;
        }
    }

    function applyConcreteDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];
        
        if(!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].REQUIRED]){
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].REQUIRED] = defaultConsts.concreteDefaults.REQUIRED_DEFAULT;
        }

        if(!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].USER_EDITABLE_VALUE]){
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].USER_EDITABLE_VALUE] = defaultConsts.concreteDefaults.USER_EDITABLE_DEFAULT;
        }
    }

    function applyFormulaDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if(!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].FORMULA]){
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].FORMULA] = defaultConsts.formulaDefaults.FORMULA_STRING_DEFAULT;
        }
    }

    function applyNumericDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if(!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DECIMAL_PLACES]){
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DECIMAL_PLACES] = defaultConsts.numericDefaults.DECIMAL_PLACES_DEFAULT;
        }

        if(!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].TREAT_NULL_AS_ZERO]){
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].TREAT_NULL_AS_ZERO] = defaultConsts.numericDefaults.TREAT_NULL_AS_ZERO_DEFAULT;
        }
    }

    function applyScalarDefaults(fieldToModify) {
        var fieldType = fieldToModify[fieldConsts.TYPE];

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

    function applyDateDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_MONTH_AS_NAME]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_MONTH_AS_NAME] = defaultConsts.dateDefaults.SHOW_MONTH_AS_NAME_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_DAY_OF_WEEK]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_DAY_OF_WEEK] = defaultConsts.dateDefaults.SHOW_DAY_OF_WEEK_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].HIDE_YEAR_IF_CURRENT]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].HIDE_YEAR_IF_CURRENT] = defaultConsts.dateDefaults.HIDE_YEAR_IF_CURRENT_DEFAULT;
        }
    }

    function applyDateTimeDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_TIME]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_TIME] = defaultConsts.dateTimeDefaults.SHOW_TIME_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_TIME_ZONE]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_TIME_ZONE] = defaultConsts.dateTimeDefaults.SHOW_TIME_ZONE_DEFAULT;
        }

    }

    function applyTimeOfDayDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_TIME]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_TIME] = defaultConsts.dateTimeDefaults.SHOW_TIME_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_TIME_ZONE]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_TIME_ZONE] = defaultConsts.dateTimeDefaults.SHOW_TIME_ZONE_DEFAULT;
        }

    }

    function applyDurationDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SCALE]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SCALE] = defaultConsts.durationDefaults.SCALE_DEFAULT;
        }
    }

    function applyEmailDefaults(fieldToModify) {
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DEFAULT_DOMAIN]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DEFAULT_DOMAIN] = defaultConsts.emailDefaults.DOMAIN_DEFAULT_VALUE_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SORT_BY_DOMAIN]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SORT_BY_DOMAIN] = defaultConsts.emailDefaults.SORT_BY_DOMAIN_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_EMAIL_EVERYONE]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SHOW_EMAIL_EVERYONE] = defaultConsts.emailDefaults.SHOW_EMAIL_EVERYONE_DEFAULT;
        }

    }

    function applyFileAttachmentDefaults(fieldToModify) {
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].LINK_TEXT]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].LINK_TEXT] = defaultConsts.fileAttachmentDefaults.LINK_TEXT_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].KEEP_ALL_REVISIONS]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].KEEP_ALL_REVISIONS] = defaultConsts.fileAttachmentDefaults.KEEP_ALL_REVISIONS_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].REVISIONS_TO_KEEP]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].REVISIONS_TO_KEEP] = defaultConsts.fileAttachmentDefaults.REVISIONS_TO_KEEP_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION] = defaultConsts.fileAttachmentDefaults.ALLOW_USERS_TO_SET_CURRENT_VERSION_DEFAULT;
        }

    }

    function applyPhoneNumberDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].INCLUDE_EXTENSION]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].INCLUDE_EXTENSION] = defaultConsts.phoneNumberDefaults.INCLUDE_EXTENSION_DEFAULT;
        }
    }

    function applyReportLinkDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

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

    function applySummaryFieldDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

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

    function applyTextDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].HTML_ALLOWED]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].HTML_ALLOWED] = defaultConsts.textDefaults.HTML_ALLOWED_DEFAULT;
        }
    }

    function applyUrlDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DISPLAY_PROTOCOL]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].DISPLAY_PROTOCOL] = defaultConsts.urlDefaults.URL_DISPLAY_PROTOCOL_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].LINK_TEXT]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].LINK_TEXT] = defaultConsts.urlDefaults.URL_DEFAULT_LINK_TEXT;
        }
    }

    function applyUserDefaults(fieldToModify){
        var fieldType = fieldToModify[fieldConsts.TYPE];

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SEND_INVITES_TO_USERS]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].SEND_INVITES_TO_USERS] = defaultConsts.userDefaults.SEND_INVITES_TO_USERS_DEFAULT;
        }

        if (!fieldToModify[fieldConsts[fieldType][FIELD_KEYS].USER_DISPLAY_FORMAT]) {
            fieldToModify[fieldConsts[fieldType][FIELD_KEYS].USER_DISPLAY_FORMAT] = defaultConsts.userDefaults.USER_DISPLAY_FORMAT_DEFAULT;
        }
    }

}());