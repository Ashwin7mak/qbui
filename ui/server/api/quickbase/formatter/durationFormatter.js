/**
 * Given a raw duration field value and field meta data from the Java capabilities API, this module is capable of
 * display formatting the duration field.
 */
(function () {
    'use strict';
    /*
     * We can't use the JS native number data type when handling records because it is possible to lose
     * decimal precision as a result of the JS implementation the number data type. In JS, all numbers are
     * 64 bit floating points where bits 0-51 store values, bits 52-62 store the exponent and
     * bit 63 is the sign bit. This is the IEEE 754 standard. Practically speaking, this means
     * that a java Long, which uses all bits 0-62 to store values, cannot be expressed in a JS
     * number without a loss of precision.  For this reason, we use a special implementation of
     * JSON.parse/stringify that depends on an implementation of BigDecimal, which is capable of
     * expressing all the precision of numeric values we expect to get from the java capabilities
     * APIs.  This is slower than using JSON.parse/stringify, but is necessary to avoid the loss
     * of precision. For more info, google it!
     */
    var bigDecimal = require('bigdecimal');
    var consts = require('../../constants');

    //Module constants:
    var MILLIS_PER_SECOND = new bigDecimal.BigDecimal(1000);
    var MILLIS_PER_MIN = new bigDecimal.BigDecimal(60000);
    var MILLIS_PER_HOUR = new bigDecimal.BigDecimal(3600000);
    var MILLIS_PER_DAY = new bigDecimal.BigDecimal(86400000);
    var MILLIS_PER_WEEK = new bigDecimal.BigDecimal(604800000);
    var SECONDS_PER_MINUTE = new bigDecimal.BigDecimal(60);
    var MINUTES_PER_HOUR = new bigDecimal.BigDecimal(60);

    var HHMM = ':HH:MM';
    var HHMMSS = ':HH:MM:SS';
    var MM = ':MM';
    var MMSS = ':MM:SS';
    var SMART_UNITS = 'Smart Units';
    var WEEKS = 'Weeks';
    var DAYS = 'Days';
    var HOURS = 'Hours';
    var MINUTES = 'Minutes';
    var SECONDS = 'Seconds';

    /**
     * Given a duration value and an options object with display config properties set on it, this method
     * formats the duration value as a string and returns the formatted string.
     * @param millis A millisecond value to format
     * @param opts display options
     * @returns the duration value formatted as a string
     */
    function formatDurationValue(millis, opts) {
        var seconds, minutes, hours, days, weeks;

        if (millis != 0) {
            seconds = millis.divide(MILLIS_PER_SECOND);
            minutes = millis.divide(MILLIS_PER_MIN);
            hours = millis.divide(MILLIS_PER_HOUR);
            days = millis.divide(MILLIS_PER_DAY);
            weeks = millis.divide(MILLIS_PER_WEEK);
        } else {
            seconds = 0;
            minutes = 0;
            hours = 0;
            days = 0;
            weeks = 0;
        }
        var returnValue;
        switch (opts.scale) {
                case HHMM:
                case HHMMSS:
                case MM:
                case MMSS:
                    returnValue = generateTimeUnits(millis, hours, minutes, seconds);
                    break;
                case SMART_UNITS:
                    returnValue = generateSmartUnit(millis, weeks, days, hours, minutes, seconds);
                    break;
                case WEEKS:
                    returnValue = millis.divide(MILLIS_PER_WEEK);
                    break;
                case DAYS:
                    returnValue = millis.divide(MILLIS_PER_DAY);
                    break;
                case HOURS:
                    returnValue = millis.divide(MILLIS_PER_HOUR);
                    break;
                case MINUTES:
                    returnValue = millis.divide(MILLIS_PER_MIN);
                    break;
                case SECONDS:
                    returnValue = millis.divide(MILLIS_PER_SECOND);
                    break;
                default:
                    break;
            }

        return returnValue;
    }

    /**
     * Helper method generates a time-unit scale value from milliseconds.  Time-unit scale values include
     * HHMM, HHMMSS, MM, and MMSS.
     *
     * @param millis The raw millisecond value
     * @param hours The whole hours value of the milliseconds
     * @param minutes The whole minutes value of the milliseconds
     * @param seconds The whole seconds value of the milliseconds
     *
     * @returns the duration value formatted as a string
     */
    function generateTimeUnits(millis, hours, minutes, seconds) {
        var timeUnits;
        if(millis < 0) {
           timeUnits += '-';
        }
        if(hours != 0) {
            if(hours < 10 && hours > -10) {
                timeUnits += '0';
            }
            timeUnits += Math.abs(hours) + ':';
        } else if(this == HHMM || this == HHMMSS) {
            timeUnits += '00:';
        }
        var extraMinutes = minutes - hours * MINUTES_PER_HOUR;
        if(extraMinutes != 0) {
            if(extraMinutes < 10 && extraMinutes > -10) {
                timeUnits += '0';
            }
            timeUnits += Math.abs(extraMinutes);
        } else {
            timeUnits += '00';
        }
        var extraSeconds = seconds - minutes * SECONDS_PER_MINUTE;
        if(this == MMSS || this == HHMMSS) {
            if(extraSeconds != 0) {
                timeUnits + ':';
                if(extraSeconds < 10 && extraSeconds > -10) {
                    timeUnits += '0';
                }
                timeUnits += Math.abs(extraSeconds);
            } else {
                timeUnits += ':00';
            }
        }

        return timeUnits;
    }

    /**
     * Helper method generates a smart unit value from milliseconds and other params.
     *
     * @param millis The raw millisecond value
     * @param weeks The whole weeks value of the milliseconds
     * @param days The whole days value of the milliseconds
     * @param hours The whole hours value of the milliseconds
     * @param minutes The whole minutes value of the milliseconds
     * @param seconds The whole seconds value of the milliseconds
     *
     * @returns the duration value formatted as a string
     */
    function generateSmartUnit(millis, weeks, days, hours, minutes, seconds) {
        //Entered as days
        var smartUnits;
        if(Math.abs(weeks) > 0) {
            smartUnits += millis.divide(MILLIS_PER_WEEK);
            smartUnits += ' weeks';
        } else if(Math.abs(days) > 0) {
            smartUnits +=  millis.divide(MILLIS_PER_DAY);
            smartUnits += ' days';
        } else if(Math.abs(hours) > 0) {
            smartUnits += millis.divide(MILLIS_PER_HOUR);
            smartUnits += ' hours';
        } else if(Math.abs(minutes) > 0) {
            smartUnits += millis.divide(MILLIS_PER_MIN);
            smartUnits += ' mins';
        } else if(Math.abs(seconds) > 0) {
            smartUnits += millis.divide(MILLIS_PER_SECOND);
            smartUnits += ' secs';
        } else {
            smartUnits += millis + ' msecs';
        }

        return smartUnits;
    }

    module.exports = {
        /**
         * Given a duration field's meta data, construct the formatting options, setting defaults
         * where none are provided or where invalid values are provided
         *
         * @param fieldInfo a field meta data object
         * @returns a display options object
         */
        generateFormat: function (fieldInfo) {
            var opts = {};
            if (fieldInfo) {
                opts.scale = fieldInfo.scale;
            }
            if (!opts.scale) {
                opts.scale = SMART_UNITS;
            }

            return opts;
        },

        /**
         * Given a raw number as input, formats the duration value for display.
         * @param fieldValue the field value object
         * @param fieldInfo the meta data about the field
         * @returns A formatted display string
         */
        format: function (fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }
            var opts = fieldInfo.jsFormat;
            if (!opts) {
                opts = this.generateFormat(fieldInfo);
            }
            var formattedValue = formatDurationValue(fieldValue.value, opts);
            return formattedValue;
        }
    };
}());