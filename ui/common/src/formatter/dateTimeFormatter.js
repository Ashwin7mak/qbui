/*
 Given a raw date field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the date instance.
 */
(function() {
    'use strict';
    var moment = require('moment-timezone');
    var consts = require('../constants');

    //FORMATTING COMPONENTS
    var DASH = '-';
    var COMMA = ',';
    var SPACE = ' ';
    var TWO_DIGIT_MONTH = 'MM';
    var MONTH_ABBREV = 'MMM';
    var DAY_OF_WEEK = 'dddd, ';
    var TIME = 'h:mm a';
    var FOUR_DIGIT_YEAR = 'YYYY';
    var TWO_DIGIT_YEAR = 'YY';
    var TWO_DIGIT_DAY = 'DD';
    var DEFAULT_TIMEZONE = 'America/Los_Angeles';
    var TIMEZONE_FORMATTER = '(z)';

    //Base formats  (US centric formatted dates -- does not support localized dates)
    var DATE_FORMATS = Object.freeze({
        MM_DD_YY   : TWO_DIGIT_MONTH + DASH + TWO_DIGIT_DAY + DASH + TWO_DIGIT_YEAR,
        MM_DD_YYYY : TWO_DIGIT_MONTH + DASH + TWO_DIGIT_DAY + DASH + FOUR_DIGIT_YEAR,
        DD_MM_YYYY : TWO_DIGIT_DAY + DASH + TWO_DIGIT_MONTH + DASH + FOUR_DIGIT_YEAR,
        DD_MM_YY   : TWO_DIGIT_DAY + DASH + TWO_DIGIT_MONTH + DASH + TWO_DIGIT_YEAR,
        YYYY_MM_DD : FOUR_DIGIT_YEAR + DASH + TWO_DIGIT_MONTH + DASH + TWO_DIGIT_DAY,
        MMM_DD_YY  : MONTH_ABBREV + SPACE + TWO_DIGIT_DAY + COMMA + SPACE + TWO_DIGIT_YEAR,
        MMM_DD_YYYY: MONTH_ABBREV + SPACE + TWO_DIGIT_DAY + COMMA + SPACE + FOUR_DIGIT_YEAR
    });
    //resolves the moment.js format string from the JAVA 8 date format string
    var JAVA_TO_JS_DATE_FORMATS = Object.freeze({
        'MM-dd-uu'  : DATE_FORMATS.MM_DD_YY,
        'MM-dd-uuuu': DATE_FORMATS.MM_DD_YYYY,
        'dd-MM-uuuu': DATE_FORMATS.DD_MM_YYYY,
        'dd-MM-uu'  : DATE_FORMATS.DD_MM_YY,
        'uuuu-MM-dd': DATE_FORMATS.YYYY_MM_DD
    });

    function showMonthAsName(formatString) {
        if (formatString === DATE_FORMATS.MM_DD_YY) {
            return DATE_FORMATS.MMM_DD_YY;
        } else if (formatString === DATE_FORMATS.MM_DD_YYYY) {
            return DATE_FORMATS.MMM_DD_YYYY;
        } else {
            return formatString.replace(TWO_DIGIT_MONTH, MONTH_ABBREV);
        }
    }

    function showDayOfWeek(formatString) {
        return DAY_OF_WEEK + formatString;
    }

    function hideYear(formatString) {
        //  the testing order is important..changing will negatively impact yyyy-mm-dd tests
        var noYearString = formatString.replace(DASH + FOUR_DIGIT_YEAR, '');
        noYearString = noYearString.replace(FOUR_DIGIT_YEAR + DASH, '');
        noYearString = noYearString.replace(DASH + TWO_DIGIT_YEAR, '');
        noYearString = noYearString.replace(COMMA + SPACE + FOUR_DIGIT_YEAR, '');
        noYearString = noYearString.replace(COMMA + SPACE + TWO_DIGIT_YEAR, '');
        return noYearString;
    }

    module.exports = {

        /**
         * set logger object (support different logger on client vs server)
         * @param logger
         */
        setLogger: function(logger) {
            this.log = logger;
        },

        getJavaToJavaScriptDateFormats: function() {
            return JAVA_TO_JS_DATE_FORMATS;
        },

        getDateFormat: function(fieldInfo) {

            var jsDateFormat = '';

            if (fieldInfo) {
                jsDateFormat = JAVA_TO_JS_DATE_FORMATS[fieldInfo.dateFormat];
            }

            // apply a default date format if none defined
            if (!jsDateFormat) {
                jsDateFormat = DATE_FORMATS.MM_DD_YYYY;
            }

            if (fieldInfo) {
                if (fieldInfo.showMonthAsName) {
                    jsDateFormat = showMonthAsName(jsDateFormat);
                }
                if (fieldInfo.showDayOfWeek) {
                    jsDateFormat = showDayOfWeek(jsDateFormat);
                }
            }

            return jsDateFormat;
        },

        getTimeFormat: function(fieldInfo) {
            var jsTimeFormat = '';

            if (fieldInfo) {
                if (fieldInfo.showTime) {
                    jsTimeFormat = TIME;
                }
                if (fieldInfo.showTimeZone) {
                    jsTimeFormat += (fieldInfo.showTime ? ' ' : '') + TIMEZONE_FORMATTER;
                }
            }

            return jsTimeFormat;
        },

        generateFormat: function(fieldInfo) {
            //  get date formatting requirements
            var jsDateFormat = this.getDateFormat(fieldInfo);

            //  get time formatting requirements
            var jsTimeFormat = this.getTimeFormat(fieldInfo);

            var jsFormat = '';
            if (jsDateFormat) {
                jsFormat = jsDateFormat + (jsTimeFormat ? ' ' : '') + jsTimeFormat;
            } else {
                jsFormat = jsTimeFormat;
            }

            return jsFormat;
        },

        format: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }

            fieldInfo = fieldInfo || {};

            var timeZone = consts.UTC_TIMEZONE;
            if (fieldInfo.type === consts.DATE_TIME || fieldInfo.type === consts.FORMULA_DATE_TIME) {
                timeZone = fieldInfo.timeZone;
                if (!timeZone) {
                    timeZone = DEFAULT_TIMEZONE;
                }
            }
            var rawInput = fieldValue.value.replace(/(\[.*?\])/, '');
            var d;
            try {
                //Date constructor expects ISO 8601 date
                d = new Date(rawInput);
            } catch (err) {
                if (log) {
                    log.error('Failed to parse a valid date attempting to display format a date. ' + fieldValue.value);
                }
                return '';
            }
            var m = moment.tz(d, timeZone);
            var jsDateFormat = fieldInfo.jsFormat;
            if (!jsDateFormat) {
                jsDateFormat = this.generateFormat(fieldInfo);
            }
            //If the date is the current year and hideYearIfCurrent is true, remove the date from the formatter string
            if (fieldInfo.hideYearIfCurrent && parseInt(m.format(FOUR_DIGIT_YEAR)) === new Date().getFullYear()) {
                jsDateFormat = hideYear(jsDateFormat);
            }
            return m.format(jsDateFormat);
        }
    };
}());
