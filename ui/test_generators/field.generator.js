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

    module.exports = {
        getFieldBuilder : function(){
            return fieldBuilder.Builder();
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
            var fieldConstCategoryKeys = Object.keys(fieldConsts);
            var fieldKeys = Object.keys(field);
            //these will be initialized in the loop to be false
            //let's start out assuming the best and let the loop tell us if we're in trouble
            var foundKey = true;
            var valueValid = true;
            var typesKeyWord = 'types';
            var fieldConstSubKeys;
            var prevKey = '';

            fieldKeys.forEach(function (fieldKey) {

                if(foundKey == false){
                    console.error('We could not find this key in our key constants for a field. Key in question: ' +fieldKey+ 'Field ' + field);
                }else{
                    foundKey = false;
                }

                if(valueValid == false){
                    console.error('There was a value type mismatch. Key in question: ' +fieldKey+ 'Field ' + field);
                }else{
                    valueValid = false;
                }

                fieldConstCategoryKeys.forEach( function (constKey) {

                    fieldConstSubKeys = Object.keys(fieldConsts[constKey]);

                    fieldConstSubKeys.forEach(function (constSubKey)
                    {

                        if (fieldConsts[constKey][constSubKey] === fieldKey) {

                            foundKey = true;

                            //check that we have defined the type for this key word
                            if (typeof fieldConsts[constKey][typesKeyWord][constSubKey] === 'undefined') {
                                console.error('Type is not undefined for keyWord "' + fieldKey + '. Validating field ' + field);
                            }

                            var actualTypeOfProperty = typeof field[fieldKey];
                            var expectedTypeOfProperty = fieldConsts[constKey][typesKeyWord][constSubKey];

                            if (actualTypeOfProperty !== expectedTypeOfProperty) {
                                valueValid = false;
                            }
                        }
                    });
                });

                prevKey = fieldKey;
            });
            return foundKey && valueValid;
        },

        //For a given field type, apply any default values that are not currently present in the map
        applyDefaults : function(fieldToModify) {
            var type = fieldToModify[fieldConsts.fieldKeys.TYPE];

            if(!fieldTypeToFunctionCalls[type]){
                alert('Field type not found in fieldTypeToFunctionCalls');
            }

            fieldTypeToFunctionCalls[type].forEach(function (functionToCall) {
                functionToCall(fieldToModify);
            })
        }
    };

    var fieldTypeToFunctionCalls = {};

    //map fields by type so that we can know what to do fairly easily by grabbing keys
    //formula fields
    fieldTypeToFunctionCalls[consts.FORMULA_DATE_TIME] = [ applyFieldDefaults, applyFormulaDefaults, applyDateDefaults, applyDateTimeDefaults];
    fieldTypeToFunctionCalls[consts.FORMULA_DATE] = [applyFieldDefaults, applyFormulaDefaults, applyDateDefaults];
    fieldTypeToFunctionCalls[consts.FORMULA_TIME_OF_DAY] = [ applyFieldDefaults, applyFormulaDefaults, applyDateDefaults, applyDateTimeDefaults, applyTimeOfDayDefaults];
    fieldTypeToFunctionCalls[consts.FORMULA_NUMERIC] = [ applyFieldDefaults, applyFormulaDefaults,  applyNumericDefaults ];
    fieldTypeToFunctionCalls[consts.FORMULA_CURRENCY] = [ applyFieldDefaults, applyFormulaDefaults,  applyNumericDefaults ];
    fieldTypeToFunctionCalls[consts.FORMULA_PERCENT] = [ applyFieldDefaults, applyFormulaDefaults,  applyNumericDefaults ];
    fieldTypeToFunctionCalls[consts.FORMULA_DURATION] = [ applyFieldDefaults, applyFormulaDefaults, applyNumericDefaults, applyDurationDefaults ];
    fieldTypeToFunctionCalls[consts.FORMULA_USER] = [ applyFieldDefaults, applyFormulaDefaults];
    fieldTypeToFunctionCalls[consts.FORMULA_TEXT] = [ applyFieldDefaults, applyFormulaDefaults];
    fieldTypeToFunctionCalls[consts.FORMULA_PHONE_NUMBER] = [ applyFieldDefaults, applyFormulaDefaults, applyPhoneNumberDefaults];
    fieldTypeToFunctionCalls[consts.FORMULA_EMAIL_ADDRESS] = [ applyFieldDefaults, applyFormulaDefaults, applyEmailDefaults];
    fieldTypeToFunctionCalls[consts.FORMULA_URL] = [ applyFieldDefaults, applyFormulaDefaults];
    fieldTypeToFunctionCalls[consts.FORMULA_CHECKBOX] = [ applyFieldDefaults, applyFormulaDefaults];
    fieldTypeToFunctionCalls[consts.FORMULA_USER] = [ applyFieldDefaults, applyFormulaDefaults, applyUserDefaults];

    //concrete/scalar fields
    fieldTypeToFunctionCalls[consts.PERCENT] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyNumericDefaults ];
    fieldTypeToFunctionCalls[consts.NUMERIC] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyNumericDefaults ];
    fieldTypeToFunctionCalls[consts.CURRENCY] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyNumericDefaults ];
    fieldTypeToFunctionCalls[consts.RATING] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyNumericDefaults ];
    fieldTypeToFunctionCalls[consts.DURATION] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyNumericDefaults, applyDurationDefaults ];
    fieldTypeToFunctionCalls[consts.TEXT] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyTextDefaults ];
    fieldTypeToFunctionCalls[consts.MULTI_LINE_TEXT] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyTextDefaults ];
    fieldTypeToFunctionCalls[consts.BIGTEXT] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults ];
    fieldTypeToFunctionCalls[consts.URL] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyUrlDefaults];
    fieldTypeToFunctionCalls[consts.EMAIL_ADDRESS] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyEmailDefaults ];
    fieldTypeToFunctionCalls[consts.PHONE_NUMBER] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyPhoneNumberDefaults ];
    fieldTypeToFunctionCalls[consts.DATE_TIME] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyDateDefaults, applyDateTimeDefaults];
    fieldTypeToFunctionCalls[consts.DATE] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyDateDefaults];
    fieldTypeToFunctionCalls[consts.TIME_OF_DAY] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyDateDefaults, applyDateTimeDefaults, applyTimeOfDayDefaults];
    fieldTypeToFunctionCalls[consts.CHECKBOX] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults ];
    fieldTypeToFunctionCalls[consts.FILE_ATTACHMENT] = [ applyFieldDefaults, applyConcreteDefaults];
    fieldTypeToFunctionCalls[consts.USER] = [ applyFieldDefaults, applyConcreteDefaults, applyScalarDefaults, applyUserDefaults ];

    //virtuals
    fieldTypeToFunctionCalls[consts.LOOKUP] = [ applyFieldDefaults];
    fieldTypeToFunctionCalls[consts.SUMMARY] = [ applyFieldDefaults, applySummaryFieldDefaults];

    //weirdos
    fieldTypeToFunctionCalls[consts.REPORT_LINK] = [ applyFieldDefaults, applyReportLinkDefaults];
    fieldTypeToFunctionCalls[consts.FILE_ATTACHMENT] = [ applyFieldDefaults, applyConcreteDefaults, applyFileAttachmentDefaults];

    function applyFieldDefaults(fieldToModify){
        //apply all high level field properties that are missing
        //we can't apply an id as that will be assigned by the api
        if(!fieldToModify[fieldConsts.fieldKeys.BUILT_IN]) {
            fieldToModify[fieldConsts.fieldKeys.BUILT_IN] = defaultConsts.fieldDefaults.BUILTIN_DEFAULT;
        }

        if(!fieldToModify[fieldConsts.fieldKeys.DATA_IS_COPYABLE]) {
            fieldToModify[fieldConsts.fieldKeys.DATA_IS_COPYABLE] = defaultConsts.fieldDefaults.DATA_COPYABLE_DEFAULT;
        }

        if(!fieldToModify[fieldConsts.fieldKeys.INCLUDE_IN_QUICKSEARCH]) {
            fieldToModify[fieldConsts.fieldKeys.INCLUDE_IN_QUICKSEARCH] = defaultConsts.fieldDefaults.USE_IN_QUICKSEARCH_DEFAULT;
        }
    }

    function applyConcreteDefaults(fieldToModify){

        if(!fieldToModify[fieldConsts.concreteFieldKeys.REQUIRED]){
            fieldToModify[fieldConsts.concreteFieldKeys.REQUIRED] = defaultConsts.concreteDefaults.REQUIRED_DEFAULT;
        }

        if(!fieldToModify[fieldConsts.concreteFieldKeys.USER_EDITABLE_VALUE]){
            fieldToModify[fieldConsts.concreteFieldKeys.USER_EDITABLE_VALUE] = defaultConsts.concreteDefaults.USER_EDITABLE_DEFAULT;
        }
    }

    function applyFormulaDefaults(fieldToModify){

        if(!fieldToModify[fieldConsts.formulaFieldKeys.FORMULA]){
            fieldToModify[fieldConsts.formulaFieldKeys.FORMULA] = defaultConsts.formulaDefaults.FORMULA_STRING_DEFAULT;
        }
    }

    function applyNumericDefaults(fieldToModify){

        if(!fieldToModify[fieldConsts.numericAndNumericFormulaFieldKeys.DECIMAL_PLACES]){
            fieldToModify[fieldConsts.numericAndNumericFormulaFieldKeys.DECIMAL_PLACES] = defaultConsts.numericDefaults.DECIMAL_PLACES_DEFAULT;
        }

        if(!fieldToModify[fieldConsts.numericAndNumericFormulaFieldKeys.TREAT_NULL_AS_ZERO]){
            fieldToModify[fieldConsts.numericAndNumericFormulaFieldKeys.TREAT_NULL_AS_ZERO] = defaultConsts.numericDefaults.TREAT_NULL_AS_ZERO_DEFAULT;
        }
    }

    function applyScalarDefaults(fieldToModify) {

        if (!fieldToModify[fieldConsts.scalarFieldKeys.UNIQUE]) {
            fieldToModify[fieldConsts.scalarFieldKeys.UNIQUE] = defaultConsts.scalarDefaults.UNIQUE_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.scalarFieldKeys.INDEXED]) {
            fieldToModify[fieldConsts.scalarFieldKeys.INDEXED] = defaultConsts.scalarDefaults.INDEXED_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.scalarFieldKeys.MULTIPLE_CHOICE_SOURCE_ALLOWED]) {
            fieldToModify[fieldConsts.scalarFieldKeys.MULTIPLE_CHOICE_SOURCE_ALLOWED] = defaultConsts.scalarDefaults.MULTI_CHOICE_SOURCE_ALLOWED_DEFAULT;
        }
    }

    function applyDateDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.dateAndDateFormulaFieldKeys.SHOW_MONTH_AS_NAME]) {
            fieldToModify[fieldConsts.dateAndDateFormulaFieldKeys.SHOW_MONTH_AS_NAME] = defaultConsts.dateDefaults.SHOW_MONTH_AS_NAME_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.dateAndDateFormulaFieldKeys.SHOW_DAY_OF_WEEK]) {
            fieldToModify[fieldConsts.dateAndDateFormulaFieldKeys.SHOW_DAY_OF_WEEK] = defaultConsts.dateDefaults.SHOW_DAY_OF_WEEK_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.dateAndDateFormulaFieldKeys.HIDE_YEAR_IF_CURRENT]) {
            fieldToModify[fieldConsts.dateAndDateFormulaFieldKeys.HIDE_YEAR_IF_CURRENT] = defaultConsts.dateDefaults.HIDE_YEAR_IF_CURRENT_DEFAULT;
        }
    }

    function applyDateTimeDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME]) {
            fieldToModify[fieldConsts.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME] = defaultConsts.dateTimeDefaults.SHOW_TIME_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME_ZONE]) {
            fieldToModify[fieldConsts.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME_ZONE] = defaultConsts.dateTimeDefaults.SHOW_TIME_ZONE_DEFAULT;
        }

    }

    function applyTimeOfDayDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME]) {
            fieldToModify[fieldConsts.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME] = defaultConsts.dateTimeDefaults.SHOW_TIME_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME_ZONE]) {
            fieldToModify[fieldConsts.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME_ZONE] = defaultConsts.dateTimeDefaults.SHOW_TIME_ZONE_DEFAULT;
        }

    }

    function applyDurationDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.durationAndDurationFormulaFieldKeys.SCALE]) {
            fieldToModify[fieldConsts.durationAndDurationFormulaFieldKeys.SCALE] = defaultConsts.durationDefaults.SCALE_DEFAULT;
        }
    }

    function applyEmailDefaults(fieldToModify) {

        if (!fieldToModify[fieldConsts.emailAndEmailFormulaFieldKeys.DEFAULT_DOMAIN]) {
            fieldToModify[fieldConsts.emailAndEmailFormulaFieldKeys.DEFAULT_DOMAIN] = defaultConsts.emailDefaults.DOMAIN_DEFAULT_VALUE_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.emailAndEmailFormulaFieldKeys.SORT_BY_DOMAIN]) {
            fieldToModify[fieldConsts.emailAndEmailFormulaFieldKeys.SORT_BY_DOMAIN] = defaultConsts.emailDefaults.SORT_BY_DOMAIN_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.emailAndEmailFormulaFieldKeys.SHOW_EMAIL_EVERYONE]) {
            fieldToModify[fieldConsts.emailAndEmailFormulaFieldKeys.SHOW_EMAIL_EVERYONE] = defaultConsts.emailDefaults.SHOW_EMAIL_EVERYONE_DEFAULT;
        }

    }

    function applyFileAttachmentDefaults(fieldToModify) {

        if (!fieldToModify[fieldConsts.fileAttachmentFieldKeys.LINK_TEXT]) {
            fieldToModify[fieldConsts.fileAttachmentFieldKeys.LINK_TEXT] = defaultConsts.fileAttachmentDefaults.LINK_TEXT_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.fileAttachmentFieldKeys.KEEP_ALL_REVISIONS]) {
            fieldToModify[fieldConsts.fileAttachmentFieldKeys.KEEP_ALL_REVISIONS] = defaultConsts.fileAttachmentDefaults.KEEP_ALL_REVISIONS_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.fileAttachmentFieldKeys.REVISIONS_TO_KEEP]) {
            fieldToModify[fieldConsts.fileAttachmentFieldKeys.REVISIONS_TO_KEEP] = defaultConsts.fileAttachmentDefaults.REVISIONS_TO_KEEP_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.fileAttachmentFieldKeys.ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION]) {
            fieldToModify[fieldConsts.fileAttachmentFieldKeys.ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION] = defaultConsts.fileAttachmentDefaults.ALLOW_USERS_TO_SET_CURRENT_VERSION_DEFAULT;
        }

    }

    function applyPhoneNumberDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.phoneNumberAndPhoneNumberFormulaFieldKeys.INCLUDE_EXTENSION]) {
            fieldToModify[fieldConsts.phoneNumberAndPhoneNumberFormulaFieldKeys.INCLUDE_EXTENSION] = defaultConsts.phoneNumberDefaults.INCLUDE_EXTENSION_DEFAULT;
        }
    }

    function applyReportLinkDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.reportLinkFieldKeys.DISPLAY_PROTOCOL]) {
            fieldToModify[fieldConsts.reportLinkFieldKeys.DISPLAY_PROTOCOL] = defaultConsts.reportDefaults.DISPLAY_PROTOCOL_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.reportLinkFieldKeys.LINK_TEXT]) {
            fieldToModify[fieldConsts.reportLinkFieldKeys.LINK_TEXT] = defaultConsts.reportDefaults.LINK_TEXT_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.reportLinkFieldKeys.EXACT_MATCH]) {
            fieldToModify[fieldConsts.reportLinkFieldKeys.EXACT_MATCH] = defaultConsts.reportDefaults.EXACT_MATCH_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.reportLinkFieldKeys.MULTI_CHOICE_SOURCE_ALLOWED]) {
            fieldToModify[fieldConsts.reportLinkFieldKeys.MULTI_CHOICE_SOURCE_ALLOWED] = defaultConsts.reportDefaults.MULTI_CHOICE_SOURCE_ALLOWED_DEFAULT;
        }
    }

    function applySummaryFieldDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.summaryFieldKeys.AGGREGATE_FUNCTION]) {
            fieldToModify[fieldConsts.summaryFieldKeys.AGGREGATE_FUNCTION] = defaultConsts.summaryDefaults.AGGREGATE_FUNCTION_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.summaryFieldKeys.DECIMAL_PLACES]) {
            fieldToModify[fieldConsts.summaryFieldKeys.DECIMAL_PLACES] = defaultConsts.summaryDefaults.DECIMAL_PLACES_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.summaryFieldKeys.TREAT_NULL_AS_ZERO]) {
            fieldToModify[fieldConsts.summaryFieldKeys.TREAT_NULL_AS_ZERO] = defaultConsts.summaryDefaults.TREAT_NULL_AS_ZERO_DEFAULT;
        }
    }

    function applyTextDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.textAndTextFormulaFieldKeys.HTML_ALLOWED]) {
            fieldToModify[fieldConsts.textAndTextFormulaFieldKeys.HTML_ALLOWED] = defaultConsts.textDefaults.HTML_ALLOWED_DEFAULT;
        }
    }

    function applyUrlDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.urlAndUrlFormulaFieldKeys.DISPLAY_PROTOCOL]) {
            fieldToModify[fieldConsts.urlAndUrlFormulaFieldKeys.DISPLAY_PROTOCOL] = defaultConsts.urlDefaults.URL_DISPLAY_PROTOCOL_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.urlAndUrlFormulaFieldKeys.LINK_TEXT]) {
            fieldToModify[fieldConsts.urlAndUrlFormulaFieldKeys.LINK_TEXT] = defaultConsts.urlDefaults.URL_DEFAULT_LINK_TEXT;
        }
    }

    function applyUserDefaults(fieldToModify){
        if (!fieldToModify[fieldConsts.userAndUserFormulaFieldKeys.SEND_INVITES_TO_USERS]) {
            fieldToModify[fieldConsts.userAndUserFormulaFieldKeys.SEND_INVITES_TO_USERS] = defaultConsts.userDefaults.SEND_INVITES_TO_USERS_DEFAULT;
        }

        if (!fieldToModify[fieldConsts.userAndUserFormulaFieldKeys.USER_DISPLAY_FORMAT]) {
            fieldToModify[fieldConsts.userAndUserFormulaFieldKeys.USER_DISPLAY_FORMAT] = defaultConsts.userDefaults.USER_DISPLAY_FORMAT_DEFAULT;
        }
    }


}());