/**
 * field.generator.js will generate valid json for a particular field of a particular type. It leverages the builder pattern
 * to allow the caller to set various properties on the field
 * Created by cschneider1 on 5/28/15.
 */
(function() {
    'use strict';
    var consts = require('../server/api/constants');
    var dataTypeConsts = require('./datatype.attributes.constants');
    var defaultConsts = require('./field.schema.defaults');
    var rawValueGenerator = require('./rawValue.generator');
    var dataTypeBuilder = require('./datatype.attributes.builder');
    var _ = require('lodash');
    var DATATYPE_KEYS = 'dataTypeKeys';

    module.exports = {
        getDataTypeBuilder : function() {
            return dataTypeBuilder.builder();
        },

        getAvailableDataTypes : function() {
            return dataTypeConsts.availableDataTypes;
        },

        //Generate a json field blob based on field type
        generateBaseDataType : function(type) {
            var builder = dataTypeBuilder.builder();
            return builder.withType(type).build();
        },

        dataTypeToJsonString : function(dataTypeAttributes) {
            return JSON.stringify(dataTypeAttributes);
        },

        validateDataTypeProperties : function(dataTypeAttributes) {
            //these will be initialized in the loop to be false
            //let's start out assuming the best and let the loop tell us if we're in trouble
            var foundKey = false;
            var valueValid = true;
            var typesKeyWord = 'types';
            var dataType = dataTypeAttributes[dataTypeConsts.dataTypeKeys.TYPE];
            var dataTypeKeys = Object.keys(dataTypeAttributes);

            //loop over all of the keys on the passed field
            dataTypeKeys.forEach(function(dataTypeKey) {
                foundKey = false;
                //loop over every key in for this field type
                _.forEach(dataTypeConsts[dataType][DATATYPE_KEYS], function(constValue, constKey) {

                    //if we find the fieldKey matches current JSON constant then make sure we have found the right type
                    if (constValue === dataTypeKey) {

                        foundKey = true;

                        //check that we have defined the type for this key word
                        if (typeof dataTypeConsts[dataType][typesKeyWord][constKey] === 'undefined') {
                            console.error('Type is not undefined for keyWord "' + dataTypeKey + '. Validating field ' + JSON.stringify(dataTypeAttributes));
                        }

                        var actualTypeOfProperty = typeof dataTypeAttributes[dataTypeKey];
                        var expectedTypeOfProperty = dataTypeConsts[dataType][typesKeyWord][constKey];

                        if (actualTypeOfProperty !== expectedTypeOfProperty) {
                            valueValid = false;
                        }
                    }
                });

                if (foundKey == false) {
                    console.error('We could not find this key in our key constants for a field. Key in question: ' + dataTypeKey + ' Field ' + JSON.stringify(dataTypeAttributes));
                }

                if (valueValid == false) {
                    console.error('There was a value type mismatch. Key in question: ' +dataTypeKey+ ' Field ' + JSON.stringify(dataTypeAttributes));
                }

            });

            return foundKey && valueValid;
        },

        //For a given field type, apply any default values that are not currently present in the map
        applyDefaults : function(fieldToModify) {
            var type = fieldToModify[dataTypeConsts.availableDataTypes.TYPE];

            if (!dataTypeToFunctionCalls[type]) {
                throw new Error('Field type not found in fieldTypeToFunctionCalls');
            }

            dataTypeToFunctionCalls[type](fieldToModify);
        }
    };



    var dataTypeToFunctionCalls = {};

    //map fields by type so that we can know what to do fairly easily by grabbing keys
    //formula fields
    //concrete/scalar fields
    dataTypeToFunctionCalls[consts.PERCENT] = applyNumericHierarchy;
    dataTypeToFunctionCalls[consts.NUMERIC] = applyNumericHierarchy;
    dataTypeToFunctionCalls[consts.CURRENCY] = applyNumericHierarchy;
    dataTypeToFunctionCalls[consts.RATING] = applyNumericHierarchy;
    dataTypeToFunctionCalls[consts.DURATION] = function(fieldToModify){applyNumericHierarchy(fieldToModify); applyDurationDefaults(fieldToModify);};
    dataTypeToFunctionCalls[consts.TEXT] = applyTextHierarchy;
    dataTypeToFunctionCalls[consts.MULTI_LINE_TEXT] = applyTextHierarchy;
    dataTypeToFunctionCalls[consts.BIGTEXT] = applyTextHierarchy;
    dataTypeToFunctionCalls[consts.URL] = function(fieldToModify){ applyUrlDefaults(fieldToModify);};
    dataTypeToFunctionCalls[consts.EMAIL_ADDRESS] = function(fieldToModify){ applyEmailDefaults(fieldToModify);};
    dataTypeToFunctionCalls[consts.PHONE_NUMBER] = function(fieldToModify){ applyPhoneNumberDefaults(fieldToModify);};
    dataTypeToFunctionCalls[consts.DATE_TIME] = applyDateTimeHierarchy;
    dataTypeToFunctionCalls[consts.DATE] = applyDateHierarchy;
    dataTypeToFunctionCalls[consts.TIME_OF_DAY] = function(fieldToModify){ applyDateTimeHierarchy(fieldToModify); applyTimeOfDayDefaults(fieldToModify);};
    dataTypeToFunctionCalls[consts.CHECKBOX] = function(fieldToModify){};
    dataTypeToFunctionCalls[consts.USER] = function(fieldToModify){applyUserDefaults(fieldToModify);};

    //weirdos
    dataTypeToFunctionCalls[consts.FILE_ATTACHMENT] = function(fieldToModify){ applyFileAttachmentDefaults(fieldToModify);};

    function applyNumericHierarchy(fieldToModify) {
        applyNumericDefaults(fieldToModify);
    }

    function applyDateHierarchy(fieldToModify) {
        applyDateDefaults(fieldToModify);
    }

    function applyDateTimeHierarchy(fieldToModify) {
        applyDateHierarchy(fieldToModify)
        applyDateTimeDefaults(fieldToModify);
    }

    function applyTextHierarchy(fieldToModify) {
        applyTextDefaults(fieldToModify);
    }

    function applyNumericDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DECIMAL_PLACES]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DECIMAL_PLACES] = defaultConsts.numericDefaults.DECIMAL_PLACES_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].TREAT_NULL_AS_ZERO]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].TREAT_NULL_AS_ZERO] = defaultConsts.numericDefaults.TREAT_NULL_AS_ZERO_DEFAULT;
        }
    }

    function applyDateDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_MONTH_AS_NAME]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_MONTH_AS_NAME] = defaultConsts.dateDefaults.SHOW_MONTH_AS_NAME_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_DAY_OF_WEEK]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_DAY_OF_WEEK] = defaultConsts.dateDefaults.SHOW_DAY_OF_WEEK_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].HIDE_YEAR_IF_CURRENT]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].HIDE_YEAR_IF_CURRENT] = defaultConsts.dateDefaults.HIDE_YEAR_IF_CURRENT_DEFAULT;
        }
    }

    function applyDateTimeDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_TIME]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_TIME] = defaultConsts.dateTimeDefaults.SHOW_TIME_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_TIME_ZONE]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_TIME_ZONE] = defaultConsts.dateTimeDefaults.SHOW_TIME_ZONE_DEFAULT;
        }

    }

    function applyTimeOfDayDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_TIME]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_TIME] = defaultConsts.dateTimeDefaults.SHOW_TIME_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_TIME_ZONE]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_TIME_ZONE] = defaultConsts.dateTimeDefaults.SHOW_TIME_ZONE_DEFAULT;
        }

    }

    function applyDurationDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SCALE]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SCALE] = defaultConsts.durationDefaults.SCALE_DEFAULT;
        }
    }

    function applyEmailDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DEFAULT_DOMAIN]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DEFAULT_DOMAIN] = defaultConsts.emailDefaults.DOMAIN_DEFAULT_VALUE_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SORT_BY_DOMAIN]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SORT_BY_DOMAIN] = defaultConsts.emailDefaults.SORT_BY_DOMAIN_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_EMAIL_EVERYONE]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SHOW_EMAIL_EVERYONE] = defaultConsts.emailDefaults.SHOW_EMAIL_EVERYONE_DEFAULT;
        }

    }

    function applyFileAttachmentDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].LINK_TEXT]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].LINK_TEXT] = defaultConsts.fileAttachmentDefaults.LINK_TEXT_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].KEEP_ALL_REVISIONS]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].KEEP_ALL_REVISIONS] = defaultConsts.fileAttachmentDefaults.KEEP_ALL_REVISIONS_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].REVISIONS_TO_KEEP]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].REVISIONS_TO_KEEP] = defaultConsts.fileAttachmentDefaults.REVISIONS_TO_KEEP_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION] = defaultConsts.fileAttachmentDefaults.ALLOW_USERS_TO_SET_CURRENT_VERSION_DEFAULT;
        }

    }

    function applyPhoneNumberDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].INCLUDE_EXTENSION]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].INCLUDE_EXTENSION] = defaultConsts.phoneNumberDefaults.INCLUDE_EXTENSION_DEFAULT;
        }
    }

    function applyReportLinkDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DISPLAY_PROTOCOL]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DISPLAY_PROTOCOL] = defaultConsts.reportDefaults.DISPLAY_PROTOCOL_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].LINK_TEXT]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].LINK_TEXT] = defaultConsts.reportDefaults.LINK_TEXT_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].EXACT_MATCH]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].EXACT_MATCH] = defaultConsts.reportDefaults.EXACT_MATCH_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].MULTI_CHOICE_SOURCE_ALLOWED]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].MULTI_CHOICE_SOURCE_ALLOWED] = defaultConsts.reportDefaults.MULTI_CHOICE_SOURCE_ALLOWED_DEFAULT;
        }
    }

    function applySummaryFieldDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].AGGREGATE_FUNCTION]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].AGGREGATE_FUNCTION] = defaultConsts.summaryDefaults.AGGREGATE_FUNCTION_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DECIMAL_PLACES]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DECIMAL_PLACES] = defaultConsts.summaryDefaults.DECIMAL_PLACES_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].TREAT_NULL_AS_ZERO]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].TREAT_NULL_AS_ZERO] = defaultConsts.summaryDefaults.TREAT_NULL_AS_ZERO_DEFAULT;
        }
    }

    function applyTextDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].HTML_ALLOWED]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].HTML_ALLOWED] = defaultConsts.textDefaults.HTML_ALLOWED_DEFAULT;
        }
    }

    function applyUrlDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DISPLAY_PROTOCOL]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].DISPLAY_PROTOCOL] = defaultConsts.urlDefaults.URL_DISPLAY_PROTOCOL_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].LINK_TEXT]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].LINK_TEXT] = defaultConsts.urlDefaults.URL_DEFAULT_LINK_TEXT;
        }
    }

    function applyUserDefaults(fieldToModify) {
        var fieldType = fieldToModify[dataTypeConsts.fieldKeys.TYPE];

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SEND_INVITES_TO_USERS]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].SEND_INVITES_TO_USERS] = defaultConsts.userDefaults.SEND_INVITES_TO_USERS_DEFAULT;
        }

        if (!fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].USER_DISPLAY_FORMAT]) {
            fieldToModify[dataTypeConsts[fieldType][DATATYPE_KEYS].USER_DISPLAY_FORMAT] = defaultConsts.userDefaults.USER_DISPLAY_FORMAT_DEFAULT;
        }
    }

}());