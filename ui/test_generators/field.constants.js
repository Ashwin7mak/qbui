/**
 * field.constants.js holds all constants associated with field types throughout the entire hierarchy
 * divided by hierarchy
 * Created by cschneider1 on 5/29/15.
 */
(function(){
    var consts = require('../server/api/constants');

    //These are constants common to all fields
    module.exports = Object.freeze({

        /******************************************************************/
        /*                  FIELD JSON KEYS                               */
        /******************************************************************/
        //field keys at the highest level
        fieldKeys : {
            //Field property names
            ID : 'id',
            NAME : 'name',
            TYPE : 'type',
            TABLE_ID : 'tableId',
            BUILT_IN : 'builtIn',
            DATA_IS_COPYABLE : 'dataIsCopyable',
            INCLUDE_IN_QUICKSEARCH : 'includeInQuickSearch',
            CLIENT_SIDE_ATTRIBUTES : 'clientSideAttributes',
            types : {
                //Field property names
                ID : 'string',
                NAME : 'string',
                TYPE : 'string',
                TABLE_ID : 'string',
                BUILT_IN : 'boolean',
                DATA_IS_COPYABLE : 'boolean',
                INCLUDE_IN_QUICKSEARCH : 'boolean',
                CLIENT_SIDE_ATTRIBUTES : 'object'
            },
            fieldTypes : [
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
                consts.RATING ,
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
                consts.FORMULA_PHONE_NUMBER ,
                consts.FORMULA_URL,
                consts.FORMULA_CHECKBOX,
                consts.FORMULA_TEXT,
                consts.FORMULA_EMAIL_ADDRESS
            ]

        },

        //formula field property keys
        formulaFieldKeys : {
            //FormulaField property names
            FORMULA : 'formula',
            types : {
                //FormulaField property names
                FORMULA : 'string'
            },
            fieldTypes : [
                consts.FORMULA_DATE_TIME,
                consts.FORMULA_DURATION,
                consts.FORMULA_DATE,
                consts.FORMULA_TIME_OF_DAY,
                consts.FORMULA_NUMERIC,
                consts.FORMULA_CURRENCY,
                consts.FORMULA_PERCENT,
                consts.FORMULA_USER,
                consts.FORMULA_PHONE_NUMBER ,
                consts.FORMULA_URL,
                consts.FORMULA_CHECKBOX,
                consts.FORMULA_TEXT,
                consts.FORMULA_EMAIL_ADDRESS
            ]
        },

        //VirtualField property names
        virtualFieldKeys : {
            RELATIONSHIP_ID : 'relationshipId',
            REFERENCE_FIELD_ID : 'referenceFieldId',
            types : {
                RELATIONSHIP_ID : 'string',
                REFERENCE_FIELD_ID : 'number'
            },
            fieldTypes : [consts.SUMMARY, consts.LOOKUP]
        },

        //ConcreteField property names
        concreteFieldKeys : {
            USER_EDITABLE_VALUE : 'userEditableValue',
            REQUIRED : 'required',
            types : {
                USER_EDITABLE_VALUE : 'boolean',
                REQUIRED : 'boolean'
            },
            fieldTypes : [
                consts.CHECKBOX,
                consts.TEXT,
                consts.MULTI_LINE_TEXT,
                consts.BIGTEXT,
                consts.PHONE_NUMBER,
                consts.DATE_TIME,
                consts.DATE,
                consts.TIME_OF_DAY,
                consts.DURATION,
                consts.NUMERIC,
                consts.CURRENCY,
                consts.RATING ,
                consts.PERCENT,
                consts.URL,
                consts.EMAIL_ADDRESS,
                consts.USER,
                consts.FILE_ATTACHMENT
            ]
        },

        //ScalarField property names
        scalarFieldKeys : {
            UNIQUE : 'unique',
            INDEXED : 'indexed',
            KEY_FIELD : 'keyField',
            FOREIGN_KEY : 'foreignKey',
            PROXY_FIELD_ID : 'proxyFieldId',
            DEFAULT_VALUE : 'defaultValue',
            MULTIPLE_CHOICE : 'multipleChoice',
            MULTIPLE_CHOICE_SOURCE_ALLOWED : 'multipleChoiceSourceAllowed',
            types : {
                UNIQUE : 'boolean',
                INDEXED : 'boolean',
                KEY_FIELD : 'boolean',
                FOREIGN_KEY : 'boolean',
                PROXY_FIELD_ID : 'string',
                DEFAULT_VALUE : 'object',
                MULTIPLE_CHOICE : 'object',
                MULTIPLE_CHOICE_SOURCE_ALLOWED : 'boolean'
            },
            fieldTypes : [
                consts.CHECKBOX,
                consts.TEXT,
                consts.MULTI_LINE_TEXT,
                consts.BIGTEXT,
                consts.PHONE_NUMBER,
                consts.DATE_TIME,
                consts.DATE,
                consts.TIME_OF_DAY,
                consts.DURATION,
                consts.NUMERIC,
                consts.CURRENCY,
                consts.RATING ,
                consts.PERCENT,
                consts.URL,
                consts.EMAIL_ADDRESS,
                consts.USER,
            ]
        },

        dateAndDateFormulaFieldKeys : {
            SHOW_MONTH_AS_NAME : 'showMonthAsName',
            SHOW_DAY_OF_WEEK : 'showDayOfWeek',
            HIDE_YEAR_IF_CURRENT : 'hideYearIfCurrent',
            DATE_FORMAT : 'dateFormat',
            types : {
                SHOW_MONTH_AS_NAME : 'boolean',
                SHOW_DAY_OF_WEEK : 'boolean',
                HIDE_YEAR_IF_CURRENT : 'boolean',
                DATE_FORMAT : 'string'
            },
            fieldTypes : [consts.DATE, consts.DATE_TIME, consts.TIME_OF_DAY, consts.FORMULA_DATE, consts.FORMULA_DATE_TIME, consts.FORMULA_TIME_OF_DAY]
        },

        dateTimeAndDateTimeFormulatFieldKeys : {
            SHOW_TIME : 'showTime',
            SHOW_TIME_ZONE : 'showTimeZone',
            TIME_ZONE : 'timeZone',
            types :{
                SHOW_TIME : 'boolean',
                SHOW_TIME_ZONE : 'boolean',
                TIME_ZONE : 'string'
            },
            fieldTypes : [consts.DATE_TIME, consts.TIME_OF_DAY, consts.FORMULA_DATE_TIME, consts.FORMULA_TIME_OF_DAY]
        },

        dateTimeFormulaFieldKeys : {
            SORT_ORDER_ASCENDING : 'sortOrderAscending',
            types : {
                SORT_ORDER_ASCENDING : 'boolean'
            },
            fieldTypes : [consts.DATE_TIME, consts.TIME_OF_DAY, consts.FORMULA_DATE_TIME, consts.FORMULA_TIME_OF_DAY]
        },

        durationAndDurationFormulaFieldKeys : {
            SCALE : 'scale',
            types : {
                SCALE : 'string'
            },
            fieldTypes : [consts.DURATION, consts.FORMULA_DURATION]
        },

        emailAndEmailFormulaFieldKeys : {
            DEFAULT_DOMAIN : 'defaultDomain',
            SORT_BY_DOMAIN : 'sortByDomain',
            SHOW_EMAIL_EVERYONE : 'showEmailEveryone',
            types : {
                DEFAULT_DOMAIN : 'boolean',
                SORT_BY_DOMAIN : 'boolean',
                SHOW_EMAIL_EVERYONE : 'boolean'
            },
            fieldTypes : [consts.EMAIL_ADDRESS, consts.FORMULA_EMAIL_ADDRESS]
        },

        fileAttachmentFieldKeys : {
            LINK_TEXT : 'linkText',
            KEEP_ALL_REVISIONS : 'keepAllRevisions',
            REVISIONS_TO_KEEP : 'revisionToKeep',
            ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION : 'allowUsersToMakeOlderVersionsTheCurrentVersion',
            types : {
                LINK_TEXT : 'string',
                KEEP_ALL_REVISIONS : 'boolean',
                REVISIONS_TO_KEEP : 'number',
                ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION : 'boolean'
            },
            fieldTypes : [consts.FILE_ATTACHMENT]
        },

        numericAndNumericFormulaFieldKeys : {
            DECIMAL_PLACES : 'decimalPlaces',
            TREAT_NULL_AS_ZERO : 'treatNullAsZero',
            types : {
                DECIMAL_PLACES : 'number',
                TREAT_NULL_AS_ZERO : 'boolean'
            },
            fieldTypes : [
                consts.DURATION,
                consts.FORMULA_DURATION,
                consts.NUMERIC,
                consts.FORMULA_NUMERIC,
                consts.CURRENCY,
                consts.RATING ,
                consts.FORMULA_CURRENCY,
                consts.PERCENT,
                consts.FORMULA_PERCENT
            ]
        },

        phoneNumberAndPhoneNumberFormulaFieldKeys : {
            INCLUDE_EXTENSION : 'includeExtension',
            types : {
                INCLUDE_EXTENSION : 'boolean'
            },
            fieldTypes : [consts.PHONE_NUMBER, consts.FORMULA_PHONE_NUMBER]
        },

        reportLinkFieldKeys : {
            RELATIONSHIP_ID : 'relationshipId',
            DISPLAY_PROTOCOL : 'displayProtocol',
            LINK_TEXT : 'linkText',
            EXACT_MATCH : 'exactMatch',
            MULTI_CHOICE_SOURCE_ALLOWED : 'multiChoiceSourceAllowed',
            types : {
                RELATIONSHIP_ID : 'string',
                DISPLAY_PROTOCOL : 'boolean',
                LINK_TEXT : 'string',
                EXACT_MATCH : 'boolean',
                MULTI_CHOICE_SOURCE_ALLOWED : 'boolean'
            },
            fieldTypes : [consts.REPORT_LINK]
        },

        summaryFieldKeys : {
            AGGREGATE_FUNCTION : 'aggregateFunction',
            DECIMAL_PLACES : 'decimalPlaces',
            TREAT_NULL_AS_ZERO : 'treatNullAsZero',
            EXPRESSION : 'expression',
            types : {
                AGGREGATE_FUNCTION : 'string',
                DECIMAL_PLACES : 'number',
                TREAT_NULL_AS_ZERO : 'boolean',
                EXPRESSION : 'string'
            },
            fieldTypes : [consts.SUMMARY]
        },

        textAndTextFormulaFieldKeys : {
            HTML_ALLOWED : 'htmlAllowed',
            types : {
                HTML_ALLOWED : 'boolean'
            },
            fieldTypes : [consts.TEXT, consts.FORMULA_TEXT, consts.MULTI_LINE_TEXT]

        },

        timeOfDayAndTimeOfDayFormulaFieldKeys : {
            SCALE : 'scale',
            USE_24_HOUR_CLOCK : 'use24HourClock',
            USE_TIMEZONE : 'useTimezone',
            types : {
                SCALE : 'string',
                USE_24_HOUR_CLOCK : 'boolean',
                USE_TIMEZONE : 'boolean'
            },
            fieldTypes : [consts.TIME_OF_DAY, consts.FORMULA_TIME_OF_DAY]
        },

        urlAndUrlFormulaFieldKeys : {
            DISPLAY_PROTOCOL : 'displayProtocol',
            LINK_TEXT : 'linkText',
            types : {
                DISPLAY_PROTOCOL : 'string',
                LINK_TEXT : 'string'
            },
            fieldTypes : [consts.URL, consts.FORMULA_URL]
        },

        userAndUserFormulaFieldKeys : {
            SEND_INVITES_TO_USERS : 'sendInvitesToUsers',
            USER_DISPLAY_FORMAT : 'userDisplayFormat',
            types : {
                SEND_INVITES_TO_USERS : 'boolean',
                USER_DISPLAY_FORMAT : 'string'
            },
            fieldTypes : [consts.USER, consts.FORMULA_USER]
        }
    });
    
}());
