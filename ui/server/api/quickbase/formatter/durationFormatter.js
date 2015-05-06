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
    var DECIMAL_DEFAULTS = 8;
    var MILLIS_PER_SECOND = new bigDecimal.BigDecimal(1000);
    var MILLIS_PER_MIN = new bigDecimal.BigDecimal(60000);
    var MILLIS_PER_HOUR = new bigDecimal.BigDecimal(3600000);
    var MILLIS_PER_DAY = new bigDecimal.BigDecimal(86400000);
    var MILLIS_PER_WEEK = new bigDecimal.BigDecimal(604800000);
    var SECONDS_PER_MINUTE = new bigDecimal.BigDecimal(60);
    var MINUTES_PER_HOUR = new bigDecimal.BigDecimal(60);
    var TEN = new bigDecimal.BigDecimal(10);
    var NEGATIVE_TEN = new bigDecimal.BigDecimal(-10);
    var ZERO = new bigDecimal.BigDecimal(0);

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
        millis = new bigDecimal.BigDecimal(millis.toString());
        var seconds, minutes, hours, days, weeks;
        if (millis.compareTo(ZERO) != 0) {
            seconds = millis.divide(MILLIS_PER_SECOND, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP());
            minutes = millis.divide(MILLIS_PER_MIN, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP());
            hours = millis.divide(MILLIS_PER_HOUR, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP());
            days = millis.divide(MILLIS_PER_DAY, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP());
            weeks = millis.divide(MILLIS_PER_WEEK, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP());
        } else {
            seconds = 0;
            minutes = 0;
            hours = 0;
            days = 0;
            weeks = 0;
        }
        var returnValue = '';
        switch (opts.scale) {
                case HHMM:
                case HHMMSS:
                case MM:
                case MMSS:
                    returnValue = generateTimeUnits(millis, hours, minutes, seconds, opts);
                    break;
                case SMART_UNITS:
                    returnValue = generateSmartUnit(millis, weeks, days, hours, minutes, seconds, opts);
                    break;
                case WEEKS:
                    returnValue = millis.divide(MILLIS_PER_WEEK, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
                    break;
                case DAYS:
                    returnValue = millis.divide(MILLIS_PER_DAY, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
                    break;
                case HOURS:
                    returnValue = millis.divide(MILLIS_PER_HOUR, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
                    break;
                case MINUTES:
                    returnValue = millis.divide(MILLIS_PER_MIN, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
                    break;
                case SECONDS:
                    returnValue = millis.divide(MILLIS_PER_SECOND, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString();
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
    function generateTimeUnits(millis, hours, minutes, seconds, opts) {
        var timeUnits = '';
        if(millis.signum() < 0) {
           timeUnits += '-';
        }
        var h =  Math.round(hours.abs().longValue());
        if(h != 0) {
            //If its less than 10 and greater than negative ten, prepend a '0'
            if(hours.compareTo(TEN) === -1 && hours.compareTo(NEGATIVE_TEN) === 1) {
                timeUnits += '0';
            }
            timeUnits += Math.round(hours.abs().longValue()) + ':';
        } else if(opts.scale == HHMM || opts.scale == HHMMSS) {
            timeUnits += '00:';
        }
        var extraMinutes = minutes.subtract(hours.multiply(MINUTES_PER_HOUR));
        if(extraMinutes.signum() != 0) {
            if(extraMinutes.compareTo(TEN) === -1 && extraMinutes.compareTo(NEGATIVE_TEN) === 1) {
                timeUnits += '0';
            }
            timeUnits += Math.round(extraMinutes.abs().longValue());
        } else {
            timeUnits += '00';
        }
        var extraSeconds =seconds.subtract(minutes.multiply(SECONDS_PER_MINUTE));
        if(opts.scale === MMSS || opts.scale == HHMMSS) {
            if(extraSeconds.compareTo(ZERO) != 0) {
                timeUnits += ':';
                if(extraSeconds.compareTo(TEN) === -1 && extraSeconds.compareTo(NEGATIVE_TEN) === 1) {
                    timeUnits += '0';
                }
                timeUnits += Math.round(extraSeconds.abs().longValue());
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
    function generateSmartUnit(millis, weeks, days, hours, minutes, seconds, opts) {
        //Entered as days
        var smartUnits = '';
        if(weeks.abs().compareTo(ZERO) > 0) {
            smartUnits += millis.divide(MILLIS_PER_WEEK, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).toString();
            smartUnits += ' weeks';
        } else if(days.abs().compareTo(ZERO) > 0) {
            smartUnits +=  millis.divide(MILLIS_PER_DAY, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).toString();
            smartUnits += ' days';
        } else if(hours.abs().compareTo(ZERO) > 0) {
            smartUnits += millis.divide(MILLIS_PER_HOUR, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).toString();
            smartUnits += ' hours';
        } else if(minutes.abs().compareTo(ZERO) > 0) {
            smartUnits += millis.divide(MILLIS_PER_MIN, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).toString();
            smartUnits += ' mins';
        } else if(seconds.abs().compareTo(ZERO) > 0) {
            smartUnits += millis.divide(MILLIS_PER_SECOND, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP()).toString();
            smartUnits += ' secs';
        } else {
            smartUnits += millis.toString() + ' msecs';
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
                opts.decimalPlaces = fieldInfo.decimalPlaces;
            }
            if (!opts.scale) {
                opts.scale = SMART_UNITS;
            }
            if(!opts.decimalPlaces && opts.decimalPlaces !== 0) {
                opts.decimalPlaces = DECIMAL_DEFAULTS;
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