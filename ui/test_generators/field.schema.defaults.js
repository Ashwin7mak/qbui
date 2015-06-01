/**
 * This constants file holds all default values associated with a field's schema
 * Created by cschneider1 on 5/29/15.
 */
(function() {

    //These are constants common to all fields
    module.exports = Object.freeze({
            /******************************************************************/
            /*                  FIELD DEFAULTS                                */
            /******************************************************************/

            /**
             * I've separated out the field defaults by their concrete java class to make them a bit easier to group.
             * This means that you must know the hierarchy in order to leverage these constants effectively.
             * </p>
             * Many of the scalar field defaults are duplicated on their formula field counter parts. That is only clear
             * in the comments, and not inherent in the name.
             */

            //Field defaults
            fieldDefaults: {
                BUILTIN_DEFAULT: false,
                DATA_COPYABLE_DEFAULT: true,
                USE_IN_QUICKSEARCH_DEFAULT: true
            },

            //Formula field defaults
            formulaDefaults: {
                FORMULA_STRING_DEFAULT: ''
            },

            //ConcreteFieldDefaults
            concreteDefaults: {
                REQUIRED_DEFAULT: false,
                USER_EDITABLE_DEFAULT: false
            },

            //ScalarFieldDefaults
            scalarDefaults: {
                UNIQUE_DEFAULT: false,
                INDEXED_DEFAULT: false,
                MULTI_CHOICE_SOURCE_ALLOWED_DEFAULT: false
            },

            //Numeric and Numeric formula defaults
            numericDefaults: {
                DECIMAL_PLACES_DEFAULT: 14,
                TREAT_NULL_AS_ZERO: true
            },

            //Date and Date Formula defaults
            dateDefaults: {
                SHOW_MONTH_AS_NAME_DEFAULT: false,
                SHOW_DAY_OF_WEEK_DEFAULT: false,
                HIDE_YEAR_IF_CURRENT_DEFAULT: false
            },

            //DateTime and DateTimeFormula Defaults
            dateTimeDefaults: {
                SHOW_TIME_DEFAULT: true,
                SHOW_TIME_ZONE_DEFAULT: false
            },

            //Duration and DurationFormula
            durationDefaults: {
                SCALE_DEFAULT: 'Smart Units'
            },

            //Email and EmailFormula
            emailDefaults: {
                DOMAIN_DEFAULT_VALUE_DEFAULT: false,
                SORT_BY_DOMAIN_DEFAULT: false,
                SHOW_EMAIL_EVERYONE_DEFAULT: false
            },

            //FileAttachments
            fileAttachmentDefaults: {
                REVISIONS_TO_KEEP_DEFAULT: 3,
                ALLOW_USERS_TO_SET_CURRENT_VERSION_DEFAULT: true,
                KEEP_ALL_REVISIONS_DEFAULT: false,
                LINK_TEXT_DEFAULT: ''
            },

            //PhoneNumber and PhoneNumberFormulaField
            phoneNumberDefaults: {
                INCLUDE_EXTENSION_DEFAULT: true
            },

            //Rating and RatingFormula
            ratingDefaults: {
                DECIMAL_PLACES_DEFAULT: 1,
                TREAT_NULL_AS_ZERO_DEFAULT: false
            },

            //ReportLink
            reportDefaults: {
                EXACT_MATCH_DEFAULT: true,
                DISPLAY_PROTOCOL_DEFAULT: true,
                LINK_TEXT_DEFAULT: '',
                MULTI_CHOICE_SOURCE_ALLOWED_DEFAULT: false
            },

            //Summary
            summaryDefaults: {
                DECIMAL_PLACES_DEFAULT: 14,
                TREAT_NULL_AS_ZERO_DEFAULT: true,
                AGGREGATE_FUNCTION_DEFAULT: 'SUM'
            },

            //Text and TextFormula
            textDefaults: {
                HTML_ALLOWED_DEFAULT: false
            },

            //TimeOfDay and TimeOfDayFormula
            timeOfDayDefaults: {
                TIME_OF_DAY_SCALE_DEFAULT: 'HH:MM',
                USE_24_HOUR_CLOCK_DEFAULT: false,
                TIME_OF_DAY_USE_TIMEZONE_DEFAULT: false
            },

            //URL and URLFormula
            urlDefaults: {
                URL_DISPLAY_PROTOCOL_DEFAULT: true,
                URL_DEFAULT_LINK_TEXT: ''
            },

            //User and UserFormula
            userDefaults: {
                USER_DISPLAY_FORMAT_DEFAULT: 'FIRST_THEN_LAST',
                SEND_INVITES_TO_USERS_DEFAULT: true,
                USER_INDEXED_DEFAULT: true
            }
        }
    );

}());