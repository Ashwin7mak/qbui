/**
 * Given a raw duration field value and field meta data from the Java capabilities API, this module is capable of
 * display formatting the duration field.
 */
(function() {
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
    var DURATION_CONSTS = require('../constants').DURATION_CONSTS;
    var _ = require('lodash');

    /**
     * Takes two BigDecimal inputs, divides them using the opts.decimalPlaces property for precision,
     * and then stringifies the quotient, removing any trailing zeros.
     * @param numerator
     * @param denominator
     * @param opts
     * @returns {*}
     */
    function divideToString(numerator, denominator, opts) {
        return divideBigDecimals(numerator, denominator, opts).stripTrailingZeros().toPlainString();
    }

    /**
     * Takes two BigDecimal inputs, divides them using the opts.decimalPlaces property for precision
     * and returns the quotient as a BigDecimal instance.
     * @param numerator
     * @param denominator
     * @param opts
     */
    function divideBigDecimals(numerator, denominator, opts) {
        return numerator.divide(denominator, opts.decimalPlaces, bigDecimal.RoundingMode.HALF_UP());
    }

    /**
     * Given a duration scale returns true if it his a duration scale that has as a fixed unit, false otherwise
     * will return false for 'Smart Units' and any time based scale 'HH:MM' 'HH:MM:SS' etc
     *
     * @param scale
     * @returns {boolean}
     */
    function hasUnitsText(scale) {
        var answer = false;
        if (scale &&
            //it's one of the duration scale values
            _.findKey(DURATION_CONSTS.SCALES, function(entry) {return entry === scale;}) &&
            // and its not smart unit or time based type e.g. HH:MM
            scale !== DURATION_CONSTS.SCALES.SMART_UNITS && !scale.match(/:/g)) {

            answer = true;
        }
        return answer;
    }

    /**
     * Given a fieldDefinition returns true if it is a smartunits duration field
     *
     * @param scale
     * @returns {boolean}
     */
    function isSmartUnitsField(fieldDef) {
        var answer = false;
        if (fieldDef && _.has(fieldDef, 'datatypeAttributes.scale') && fieldDef.datatypeAttributes.scale === DURATION_CONSTS.SCALES.SMART_UNITS) {
            answer = true;
        }
        return answer;
    }

    /**
     * Given a duration value and an options object with display config properties set on it, this method
     * formats the duration value as a string and returns the formatted string.
     * @param millis A millisecond value to format
     * @param opts display options
     * @param formattedObj result formatted object to fill with string and units if exists
     * @returns the duration value formatted as a string
     */
    function formatDurationValue(millis, opts) {
        millis = new bigDecimal.BigDecimal(millis.toString());
        var seconds, minutes, hours, days, weeks;
        if (millis.compareTo(DURATION_CONSTS.ZERO) !== 0) {
            seconds = divideBigDecimals(millis, DURATION_CONSTS.MILLIS_PER_SECOND, opts);
            minutes = divideBigDecimals(millis, DURATION_CONSTS.MILLIS_PER_MIN, opts);
            hours = divideBigDecimals(millis, DURATION_CONSTS.MILLIS_PER_HOUR, opts);
            days = divideBigDecimals(millis, DURATION_CONSTS.MILLIS_PER_DAY, opts);
            weeks = divideBigDecimals(millis, DURATION_CONSTS.MILLIS_PER_WEEK, opts);
        } else {
            seconds = 0;
            minutes = 0;
            hours = 0;
            days = 0;
            weeks = 0;
        }

        var returnValue = '';
        switch (opts.scale) {
        case DURATION_CONSTS.SCALES.HHMM:
        case DURATION_CONSTS.SCALES.HHMMSS:
        case DURATION_CONSTS.SCALES.MM:
        case DURATION_CONSTS.SCALES.MMSS:
            returnValue = generateTimeUnits(millis, hours, minutes, seconds, opts);
            break;
        case DURATION_CONSTS.SCALES.SMART_UNITS:
            returnValue = generateSmartUnit(millis, weeks, days, hours, minutes, seconds, opts);
            break;
        case DURATION_CONSTS.SCALES.WEEKS:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_WEEK, opts);
            break;
        case DURATION_CONSTS.SCALES.DAYS:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_DAY, opts);
            break;
        case DURATION_CONSTS.SCALES.HOURS:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_HOUR, opts);
            break;
        case DURATION_CONSTS.SCALES.MINUTES:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_MIN, opts);
            break;
        case DURATION_CONSTS.SCALES.SECONDS:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_SECOND, opts);
            break;
        case DURATION_CONSTS.SCALES.MILLISECONDS:
            returnValue = millis;
            break;
        default:
            break;
        }

        // if result in an object was requested and its not yet set set the
        // value and units measure, this form of result allows for localizing the results scale units
        if (typeof (opts.formattedObj) !== 'undefined' && typeof (opts.formattedObj.string) !== 'undefined' && opts.formattedObj.string.length === 0) {
            opts.formattedObj.string = returnValue;
            if (hasUnitsText(opts.scale)) {
                opts.formattedObj.units = opts.scale;
            }
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
        if (millis.compareTo(DURATION_CONSTS.ZERO) === 0) {
            timeUnits = '0';
            return timeUnits;
        }
        if (millis.signum() < 0) {
            timeUnits += '-';
        }
        var wholeHours = Math.floor(hours.abs().longValue());
        if (wholeHours !== 0) {
            //If its less than 10 and greater than negative ten, prepend a '0'
            if (hours.compareTo(DURATION_CONSTS.TEN) === -1 && hours.compareTo(DURATION_CONSTS.NEGATIVE_TEN) === 1) {
                timeUnits += '0';
            }
            timeUnits += wholeHours + ':';
        } else if (opts.scale === DURATION_CONSTS.SCALES.HHMM || opts.scale === DURATION_CONSTS.SCALES.HHMMSS) {
            timeUnits += '00:';
        }
        var wholeHoursBd = new bigDecimal.BigDecimal(wholeHours);
        var extraMinutes = minutes.abs().subtract(wholeHoursBd.multiply(DURATION_CONSTS.MINUTES_PER_HOUR));

        if (timeUnits === '') { // no hours but minutes preface with :
            timeUnits += ':';
        }
        if (extraMinutes.signum() !== 0) {
            if (extraMinutes.compareTo(DURATION_CONSTS.TEN) === -1 && extraMinutes.compareTo(DURATION_CONSTS.NEGATIVE_TEN) === 1) {
                timeUnits += '0';
            }
            timeUnits += Math.floor(extraMinutes.abs().longValue());
        } else {
            timeUnits += '00';
        }
        var wholeMinutes = Math.floor(minutes.abs().longValue());
        var wholeMinutesBd = new bigDecimal.BigDecimal(wholeMinutes);

        var extraSeconds = seconds.abs().subtract(wholeMinutesBd.multiply(DURATION_CONSTS.SECONDS_PER_MINUTE));

        if (opts.scale === DURATION_CONSTS.SCALES.MMSS || opts.scale === DURATION_CONSTS.SCALES.HHMMSS) {
            if (extraSeconds.compareTo(DURATION_CONSTS.ZERO) !== 0) {
                timeUnits += ':';
                if (extraSeconds.compareTo(DURATION_CONSTS.TEN) === -1 && extraSeconds.compareTo(DURATION_CONSTS.NEGATIVE_TEN) === 1) {
                    timeUnits += '0';
                }
                timeUnits += extraSeconds.abs().longValue();
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
     * @param opts options for decimalplaces and optional formattedObj
     *
     * @returns the duration value formatted as a string
     */
    function generateSmartUnit(millis, weeks, days, hours, minutes, seconds, opts) {
        //Entered as days
        var smartUnits = '';
        if (millis.compareTo(DURATION_CONSTS.ZERO) === 0) {
            smartUnits += 0;
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.SCALES.DAYS;
            }
        } else if (weeks.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_WEEK, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.SCALES.WEEKS;
            }
            smartUnits += ' ' + DURATION_CONSTS.SCALES.WEEKS.toLowerCase();
        } else if (days.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_DAY, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.SCALES.DAYS;
            }
            smartUnits += ' ' + DURATION_CONSTS.SCALES.DAYS.toLowerCase();
        } else if (hours.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_HOUR, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.SCALES.HOURS;
            }
            smartUnits += ' ' + DURATION_CONSTS.SCALES.HOURS.toLowerCase();
        } else if (minutes.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_MIN, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.SCALES.MINUTES;
            }
            smartUnits += ' ' + DURATION_CONSTS.ACCEPTED_TYPE.MINS.toLowerCase();
        } else if (seconds.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_SECOND, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.SCALES.SECONDS;
            }
            smartUnits += ' ' + DURATION_CONSTS.SCALES.SECONDS.toLowerCase();
        } else {
            if (opts.formattedObj) {
                opts.formattedObj.string = millis.toString();
                opts.formattedObj.units = DURATION_CONSTS.SCALES.MILLISECONDS;
            }
            smartUnits += millis.toString() + ' ' + DURATION_CONSTS.SCALES.MILLISECONDS.toLowerCase();
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
        generateFormat: function(fieldInfo) {
            var opts = {};
            if (fieldInfo) {
                opts.scale = fieldInfo.scale;
                opts.decimalPlaces = fieldInfo.decimalPlaces;
            }
            if (!opts.scale) {
                opts.scale = DURATION_CONSTS.SCALES.SMART_UNITS;
            }
            if (!opts.decimalPlaces && opts.decimalPlaces !== 0) {
                opts.decimalPlaces = DURATION_CONSTS.DEFAULT_DECIMAL_PLACES;
            }
            return opts;
        },
        /**
         * Given a raw number as input, formats the duration value for display.
         * @param fieldValue the field value object
         * @param fieldInfo the meta data about the field
         * @returns A formatted display string
         */
        format: function(fieldValue, fieldInfo) {
            if (typeof fieldValue === 'undefined' ||
                fieldValue === null ||
                typeof fieldValue.value === 'undefined' ||
                fieldValue.value === null ||
                fieldValue.value === '') {
                return '';
            }
            var opts = fieldInfo.jsFormat;
            if (!opts) {
                opts = this.generateFormat(fieldInfo);
            }
            if (fieldInfo && fieldInfo.formattedObj) {
                opts.formattedObj = fieldInfo.formattedObj;
            }
            var formattedValue = formatDurationValue(fieldValue.value, opts);
            return formattedValue;
        },

        hasUnitsText : hasUnitsText,
        isSmartUnitsField: isSmartUnitsField

    };
}());
