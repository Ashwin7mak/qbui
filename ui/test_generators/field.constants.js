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
            CLIENT_SIDE_ATTRIBUTES : 'clientSideAttributes'
        },

        //formula field property keys
        formulaFieldKeys : {
            //FormulaField property names
            FORMULA : 'formula'
        },

        //VirtualField property names
        virtualFieldKeys : {
            RELATIONSHIP_ID : 'relationshipId',
            REFERENCE_FIELD_ID : 'referenceFieldId'
        },

        //ConcreteField property names
        concreteFieldKeys : {
            USER_EDITABLE_VALUE : 'userEdtiableValue',
            REQUIRED : 'required'
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
            MULTIPLE_CHOICE_SOURCE_ALLOWED : 'multipleChoiceSourceAllowed'
        },

        dateAndDateFormulaFieldKeys : {
            SHOW_MONTH_AS_NAME : 'showMonthAsName',
            SHOW_DAY_OF_WEEK : 'showDayOfWeek',
            HIDE_YEAR_IF_CURRENT : 'hideYearIfCurrent',
            DATE_FORMAT : 'dateFormat'
        },

        dateTimeAndDateTimeFormulatFieldKeys : {
            SHOW_TIME : 'showTime',
            SHOW_TIME_ZONE : 'showTimeZone',
            TIME_ZONE : 'timeZone'
        },

        dateTimeFormulaFieldKeys : {
            SORT_ORDER_ASCENDING : 'sortOrderAscending'
        },

        durationAndDurationFormulaFieldKeys : {
            SCALE : 'scale'
        },

        emailAndEmailFormulaFieldKeys : {
            DEFAULT_DOMAIN : 'defaultDomain',
            SORT_BY_DOMAIN : 'sortByDomain',
            SHOW_EMAIL_EVERYONE : 'showEmailEveryone'
        },

        fileAttachmentFieldKeys : {
            LINK_TEXT : 'linkText',
            KEEP_ALL_REVISIONS : 'keepAllRevisions',
            REVISIONS_TO_KEEP : 'revisionToKeep',
            ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION : 'allowUsersToMakeOlderVersionsTheCurrentVersion'
        },

        numericAndNumericFormulaFieldKeys : {
            DECIMAL_PLACES : 'decimalPlaces',
            TREAT_NULL_AS_ZERO : 'treatNullAsZero'
        },

        phoneNumberAndPhoneNumberFormulaFieldKeys : {
            INCLUDE_EXTENSION : 'includeExtension'
        },

        reportLinkFieldKeys : {
            RELATIONSHIP_ID : 'relationshipId',
            DISPLAY_PROTOCOL : 'displayProtocol',
            LINK_TEXT : 'linkText',
            EXACT_MATCH : 'exactMatch',
            MULTI_CHOICE_SOURCE_ALLOWED : 'multiChoiceSourceAllowed'
        },

        summaryFieldKeys : {
            AGGREGATE_FUNCTION : 'aggregateFunction',
            DECIMAL_PLACES : 'decimalPlaces',
            TREAT_NULL_AS_ZERO : 'treatNullAsZero',
            EXPRESSION : 'expression'
        },

        textAndTextFormulaFieldKeys : {
            HTML_ALLOWED : 'htmlAllowed'
        },

        timeOfDayAndTimeOfDayFormulaFieldKeys : {
            SCALE : 'scale',
            USE_24_HOUR_CLOCK : 'use24HourClock',
            USE_TIMEZONE : 'useTimezone'
        },

        urlAndUrlFormulaFieldKeys : {
            DISPLAY_PROTOCOL : 'displayProtocol',
            LINK_TEXT : 'linkText'
        },

        userAndUserFormulaFieldKeys : {
            SEND_INVITES_TO_USERS : 'sendInvitesToUsers',
            USER_DISPLAY_FORMAT : 'userDisplayFormat'
        },


    });




}());
