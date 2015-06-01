/**
 * field.constants.js holds all constants associated with field types throughout the entire hierarchy
 * divided by hierarchy
 * Created by cschneider1 on 5/29/15.
 */
(function(){
    var consts = require('../server/api/quickbase/constants');
    var fieldConsts = require(this);

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
            }
        },

        //formula field property keys
        formulaFieldKeys : {
            //FormulaField property names
            FORMULA : 'formula',
            types : {
                //FormulaField property names
                FORMULA : 'string'
            }
        },

        //VirtualField property names
        virtualFieldKeys : {
            RELATIONSHIP_ID : 'relationshipId',
            REFERENCE_FIELD_ID : 'referenceFieldId',
            types : {
                RELATIONSHIP_ID : 'string',
                REFERENCE_FIELD_ID : 'number'
            }
        },

        //ConcreteField property names
        concreteFieldKeys : {
            USER_EDITABLE_VALUE : 'userEdtiableValue',
            REQUIRED : 'required',
            types : {
                USER_EDITABLE_VALUE : 'boolean',
                REQUIRED : 'boolean'
            }
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
            }
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
            }
        },

        dateTimeAndDateTimeFormulatFieldKeys : {
            SHOW_TIME : 'showTime',
            SHOW_TIME_ZONE : 'showTimeZone',
            TIME_ZONE : 'timeZone',
            types :{
                SHOW_TIME : 'boolean',
                SHOW_TIME_ZONE : 'boolean',
                TIME_ZONE : 'string'
            }
        },

        dateTimeFormulaFieldKeys : {
            SORT_ORDER_ASCENDING : 'sortOrderAscending',
            types : {
                SORT_ORDER_ASCENDING : 'boolean'
            }
        },

        durationAndDurationFormulaFieldKeys : {
            SCALE : 'scale',
            types : {
                SCALE : 'string'
            }
        },

        emailAndEmailFormulaFieldKeys : {
            DEFAULT_DOMAIN : 'defaultDomain',
            SORT_BY_DOMAIN : 'sortByDomain',
            SHOW_EMAIL_EVERYONE : 'showEmailEveryone',
            types : {
                DEFAULT_DOMAIN : 'string',
                SORT_BY_DOMAIN : 'boolean',
                SHOW_EMAIL_EVERYONE : 'boolean'
            }
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
            }
        },

        numericAndNumericFormulaFieldKeys : {
            DECIMAL_PLACES : 'decimalPlaces',
            TREAT_NULL_AS_ZERO : 'treatNullAsZero',
            types : {
                DECIMAL_PLACES : 'number',
                TREAT_NULL_AS_ZERO : 'boolean'
            }
        },

        phoneNumberAndPhoneNumberFormulaFieldKeys : {
            INCLUDE_EXTENSION : 'includeExtension',
            types : {
                INCLUDE_EXTENSION : 'boolean'
            }
        },

        reportLinkFieldKeys : {
            RELATIONSHIP_ID : 'relationshipId',
            DISPLAY_PROTOCOL : 'displayProtocol',
            LINK_TEXT : 'linkText',
            EXACT_MATCH : 'exactMatch',
            MULTI_CHOICE_SOURCE_ALLOWED : 'multiChoiceSourceAllowed',
            types : {
                RELATIONSHIP_ID : 'string',
                DISPLAY_PROTOCOL : 'string',
                LINK_TEXT : 'string',
                EXACT_MATCH : 'boolean',
                MULTI_CHOICE_SOURCE_ALLOWED : 'boolean'
            }
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
            }
        },

        textAndTextFormulaFieldKeys : {
            HTML_ALLOWED : 'htmlAllowed',
            types : {
                HTML_ALLOWED : 'boolean'
            }
        },

        timeOfDayAndTimeOfDayFormulaFieldKeys : {
            SCALE : 'scale',
            USE_24_HOUR_CLOCK : 'use24HourClock',
            USE_TIMEZONE : 'useTimezone',
            types : {
                SCALE : 'number',
                USE_24_HOUR_CLOCK : 'boolean',
                USE_TIMEZONE : 'boolean'
            }
        },

        urlAndUrlFormulaFieldKeys : {
            DISPLAY_PROTOCOL : 'displayProtocol',
            LINK_TEXT : 'linkText',
            types : {
                DISPLAY_PROTOCOL : 'string',
                LINK_TEXT : 'string'
            }
        },

        userAndUserFormulaFieldKeys : {
            SEND_INVITES_TO_USERS : 'sendInvitesToUsers',
            USER_DISPLAY_FORMAT : 'userDisplayFormat',
            types : {
                SEND_INVITES_TO_USERS : 'boolean',
                USER_DISPLAY_FORMAT : 'string'
            }
        }
    });
    
}());
