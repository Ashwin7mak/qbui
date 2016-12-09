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
    var CONSTS = require('../constants').DURATION_CONSTS;
    var ALLOWED_DURATION_TYPE = ['second', 'seconds', 'minute', 'minutes', 'hour', 'hours', 'day', 'days', 'week', 'weeks'];

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
     * Given a duration scale returns true if it has a fixed unit, false otherwise
     * will return false for 'Smart Units' and any time based scale 'HH:MM' 'HH:MM:SS' etc
     *
     * @param scale
     * @returns {boolean}
     */
    function hasUnitsText(scale) {
        var answer = false;
        if (scale && scale !== CONSTS.SMART_UNITS && !scale.match(/:/g)) {
            answer = true;
        }
        return answer;
    }

    /**
     * Given a duration value and an options object with display config properties set on it, this method
     * formats the duration value as a string and returns the formatted string.
     * @param millis A millisecond value to format
     * @param opts display options
     * @param resultObj result object to fill with string and units if exists
     * @returns the duration value formatted as a string
     */
    function formatDurationValue(millis, opts) {
        millis = new bigDecimal.BigDecimal(millis.toString());
        var seconds, minutes, hours, days, weeks;
        if (millis.compareTo(CONSTS.ZERO) !== 0) {
            seconds = divideBigDecimals(millis, CONSTS.MILLIS_PER_SECOND, opts);
            minutes = divideBigDecimals(millis, CONSTS.MILLIS_PER_MIN, opts);
            hours = divideBigDecimals(millis, CONSTS.MILLIS_PER_HOUR, opts);
            days = divideBigDecimals(millis, CONSTS.MILLIS_PER_DAY, opts);
            weeks = divideBigDecimals(millis, CONSTS.MILLIS_PER_WEEK, opts);
        } else {
            seconds = 0;
            minutes = 0;
            hours = 0;
            days = 0;
            weeks = 0;
        }

        var returnValue = '';
        switch (opts.scale) {
        case CONSTS.HHMM:
        case CONSTS.HHMMSS:
        case CONSTS.MM:
        case CONSTS.MMSS:
            returnValue = generateTimeUnits(millis, hours, minutes, seconds, opts);
            break;
        case CONSTS.SMART_UNITS:
            returnValue = generateSmartUnit(millis, weeks, days, hours, minutes, seconds, opts);
            break;
        case CONSTS.WEEKS:
            returnValue = divideToString(millis, CONSTS.MILLIS_PER_WEEK, opts);
            break;
        case CONSTS.DAYS:
            returnValue = divideToString(millis, CONSTS.MILLIS_PER_DAY, opts);
            break;
        case CONSTS.HOURS:
            returnValue = divideToString(millis, CONSTS.MILLIS_PER_HOUR, opts);
            break;
        case CONSTS.MINUTES:
            returnValue = divideToString(millis, CONSTS.MILLIS_PER_MIN, opts);
            break;
        case CONSTS.SECONDS:
            returnValue = divideToString(millis, CONSTS.MILLIS_PER_SECOND, opts);
            break;
        default:
            break;
        }

        // if result in an object was requested and its not yet set set the
        // value and units measure, this form of result allows for localizing the results scale units
        if (typeof (opts.resultObj) !== 'undefined' && typeof (opts.resultObj.string) !== 'undefined' && opts.resultObj.string.length === 0) {
            opts.resultObj.string = returnValue;
            if (hasUnitsText(opts.scale)) {
                opts.resultObj.units = opts.scale;
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
        if (millis.signum() < 0) {
            timeUnits += '-';
        }
        var wholeHours = Math.floor(hours.abs().longValue());
        if (wholeHours !== 0) {
            //If its less than 10 and greater than negative ten, prepend a '0'
            if (hours.compareTo(CONSTS.TEN) === -1 && hours.compareTo(CONSTS.NEGATIVE_TEN) === 1) {
                timeUnits += '0';
            }
            timeUnits += wholeHours + ':';
        } else if (opts.scale === CONSTS.HHMM || opts.scale === CONSTS.HHMMSS) {
            timeUnits += '00:';
        }
        var wholeHoursBd = new bigDecimal.BigDecimal(wholeHours);
        var extraMinutes = minutes.abs().subtract(wholeHoursBd.multiply(CONSTS.MINUTES_PER_HOUR));

        if (timeUnits === '') { // no hours but minutes preface with :
            timeUnits += ':';
        }
        if (extraMinutes.signum() !== 0) {
            if (extraMinutes.compareTo(CONSTS.TEN) === -1 && extraMinutes.compareTo(CONSTS.NEGATIVE_TEN) === 1) {
                timeUnits += '0';
            }
            timeUnits += Math.floor(extraMinutes.abs().longValue());
        } else {
            timeUnits += '00';
        }
        var wholeMinutes = Math.floor(minutes.abs().longValue());
        var wholeMinutesBd = new bigDecimal.BigDecimal(wholeMinutes);

        var extraSeconds = seconds.abs().subtract(wholeMinutesBd.multiply(CONSTS.SECONDS_PER_MINUTE));

        if (opts.scale === CONSTS.MMSS || opts.scale === CONSTS.HHMMSS) {
            if (extraSeconds.compareTo(CONSTS.ZERO) !== 0) {
                timeUnits += ':';
                if (extraSeconds.compareTo(CONSTS.TEN) === -1 && extraSeconds.compareTo(CONSTS.NEGATIVE_TEN) === 1) {
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
     * @param opts options for decimalplaces and optional resultobj
     *
     * @returns the duration value formatted as a string
     */
    function generateSmartUnit(millis, weeks, days, hours, minutes, seconds, opts) {
        //Entered as days
        var smartUnits = '';
        if (weeks.abs().compareTo(CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, CONSTS.MILLIS_PER_WEEK, opts);
            if (opts.resultObj) {
                opts.resultObj.string = smartUnits;
                opts.resultObj.units = CONSTS.WEEKS;
            }
            smartUnits += ' ' + CONSTS.WEEKS.toLocaleLowerCase();
        } else if (days.abs().compareTo(CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, CONSTS.MILLIS_PER_DAY, opts);
            if (opts.resultObj) {
                opts.resultObj.string = smartUnits;
                opts.resultObj.units = CONSTS.DAYS;
            }
            smartUnits += ' ' + CONSTS.DAYS;
        } else if (hours.abs().compareTo(CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, CONSTS.MILLIS_PER_HOUR, opts);
            if (opts.resultObj) {
                opts.resultObj.string = smartUnits;
                opts.resultObj.units = CONSTS.HOURS.toLowerCase();
            }
            smartUnits += ' ' + CONSTS.HOURS;
        } else if (minutes.abs().compareTo(CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, CONSTS.MILLIS_PER_MIN, opts);
            if (opts.resultObj) {
                opts.resultObj.string = smartUnits;
                opts.resultObj.units = CONSTS.MINUTES.toLocaleLowerCase();
            }
            smartUnits += ' ' + CONSTS.MINS;
        } else if (seconds.abs().compareTo(CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, CONSTS.MILLIS_PER_SECOND, opts);
            if (opts.resultObj) {
                opts.resultObj.string = smartUnits;
                opts.resultObj.units = CONSTS.SECONDS;
            }
            smartUnits += ' ' + CONSTS.SECS;
        } else {
            if (opts.resultObj) {
                opts.resultObj.string =  millis.toString();
                opts.resultObj.units = CONSTS.MSECS;
            }
            smartUnits += millis.toString() + ' ' + CONSTS.MSECS;
        }
        return smartUnits;
    }
    function convertToMilliseconds(num, millis) {
        return num * millis;
    }
    function convertDisplayTypeToAcceptedType(displayType) {
        let type;
        switch (displayType) {
        case CONSTS.MSECS:
        case CONSTS.SECONDS:
            type = CONSTS.SECONDS;
            break;
        case CONSTS.MINS:
            type = CONSTS.MINUTES;
            break;
        default:
            break;
        }
        return type;
    }
    function getMilliseconds(num, type) {
        console.log('type: ', type);
        var returnValue;
        switch (type) {
        /**
         * If a user enters a number without entering a type, then the default for .scale
         * HHMM && HHMMSS will default to converting the value to milliseconds by hours
         * MM && MMSS will default to converting the value to milliseconds by minutes
         * */
        case CONSTS.HHMM:
        case CONSTS.HHMMSS:
            returnValue = convertToMilliseconds(num, CONSTS.MILLIS_PER_HOUR);
            break;
        case CONSTS.MM:
        case CONSTS.MMSS:
            returnValue = convertToMilliseconds(num, CONSTS.MILLIS_PER_MIN);
            break;
        // case CONSTS.SMART_UNITS:
        //     returnValue = generateSmartUnit(millis, weeks, days, hours, minutes, seconds, opts);
        //     break;
        case CONSTS.WEEKS:
            returnValue = convertToMilliseconds(num, CONSTS.MILLIS_PER_WEEK);
            break;
        case CONSTS.DAYS:
            returnValue = convertToMilliseconds(num, CONSTS.MILLIS_PER_DAY);
            break;
        case CONSTS.HOURS:
            returnValue = convertToMilliseconds(num, CONSTS.MILLIS_PER_HOUR);
            break;
        case CONSTS.MINUTES:
            returnValue = convertToMilliseconds(num, CONSTS.MILLIS_PER_MIN);
            break;
        case CONSTS.SECONDS:
            returnValue = convertToMilliseconds(num, CONSTS.MILLIS_PER_SECOND);
            break;
        default:
            break;
        }
        return returnValue;
    }
    function convertHourMinutesSeconds(num) {
        var hours;
        var minutes;
        var seconds;
        /**
         * If a user enters a semicolon without a number, just return the value
         * */
        if (!num.match(/\d+/g, '')) {
            return num;
        }
        /**
         * ::SS
         * */
        if (num[0] === ':' && num[1] === ':') {
            num = num.match(/\d+/g, '');
            return convertToMilliseconds(num[0], CONSTS.MILLIS_PER_SECOND);
        }
        /**
         * :MM:SS
         * */
        if (num[0] === ':') {
            num = num.match(/\d+/g, '');
            if (num.length === 2) {
                minutes = convertToMilliseconds(num[0], CONSTS.MILLIS_PER_MIN);
                seconds = convertToMilliseconds(num[1], CONSTS.MILLIS_PER_SECOND);
                return minutes + seconds;
            }
            /**
             * :MM
             * */
            return minutes = convertToMilliseconds(num[0], CONSTS.MILLIS_PER_MIN);
        }
        num = num.match(/\d+/g, '');
        /**
         * HH:
         * */
        if (num.length === 1) {
            return hours = convertToMilliseconds(num[0], CONSTS.MILLIS_PER_HOUR);
        }
        /**
         * HH:MM
         * */
        if (num.length === 2) {
            hours = convertToMilliseconds(num[0], CONSTS.MILLIS_PER_HOUR);
            minutes = convertToMilliseconds(num[1], CONSTS.MILLIS_PER_MIN);
            return hours + minutes;
        }
        /**
         * HH:MM:SS
         * */
        if (num.length === 3) {
            hours = convertToMilliseconds(num[0], CONSTS.MILLIS_PER_HOUR);
            minutes = convertToMilliseconds(num[1], CONSTS.MILLIS_PER_HOUR);
            seconds = convertToMilliseconds(num[2], CONSTS.MILLIS_PER_HOUR);
            return  hours + minutes + seconds;
        }
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
                opts.scale = CONSTS.SMART_UNITS;
            }
            if (!opts.decimalPlaces && opts.decimalPlaces !== 0) {
                opts.decimalPlaces = CONSTS.DEFAULT_DECIMAL_PLACES;
            }
            return opts;
        },
        onBlurMasking(value, fieldInfo, display) {
            //http://www.calculateme.com/time/days/to-milliseconds/1
            /**
             * Accepted Type:
                 * second || seconds
                 * minute || minutes
                 * hour || hours
                 * week || weeks
             * Accepted Format For Seconds, Minutes, Hours:
                 * 00:00:00
                 * 00:00
                 * :00
                 * :00:00
                 * ::00
             **/
            var type = [];
            var notAllowedType = [];
            var num;
            /**
             * If value is only a number, then the value will be converted to milliseconds based on
             * the field that the user is typing in
             * */
            if (typeof value === 'number') {
                console.log('info: ', fieldInfo.scale);
                return convertToMilliseconds(value, fieldInfo.scale);
            }
            /**
             * This sets the string to lowerCase()
             * to make it easier to convert the type later
             * (e.g., 'minute' will later be converted to 'Minutes)
             * */
            if (typeof value === 'string') {
                value = value.toLowerCase();
            }
            /**
             * If the user inserted a semicolon, then the string needs to be parsed based off of
             * the HHMMSS, HHMM, MMSS requirements
             * */
            if (value && value.split('').indexOf(':') !== -1) {
                return convertHourMinutesSeconds(value);
            }
            /**
             * If the user passes in a string containing a number and a type, we split the string here
             * and separate the number and type from each other
             * */
            if (value) {
                value = value.split(' ');
                num = value.splice(0, 1);
                value.forEach(function(val) {
                    if (ALLOWED_DURATION_TYPE.indexOf(val) !== -1) {
                        type.push(val);
                    } else {
                        notAllowedType.push(val);
                    }
                });
            }
            /**
             * If a user enters more than one type (e.g., "days minutes") or an unaccepted type,
             * then we just returned the value that the user typed in without any conversion,
             * a validation error will be thrown onSave
             * */
            if (type.length > 1 || notAllowedType.length > 0) {
                return value;
            }
            /**
             * If a user only entered a single accepted type (e.g., "minutes")
             * then the num will be converted to milliseconds, based off of the type passed in by the user
             * */
            if (type.length === 1) {
                /**
                 * Removes first letter and sets it toUpperCase
                 * Sets type to a string and concatenates the upperCaseLetter back on
                 * If type is not plural, then it concatenates an 's'
                 */
                var firstLetter = type.join('').split('').splice(0, 1).join('').toUpperCase();
                type = type.join('').slice(1);
                type =  firstLetter + type;
                if (type[type.length - 1] !== 's') {
                    type = type + 's';
                }
                return getMilliseconds(num, type);
            }
            if (display && type.length === 0 && fieldInfo.scale === "Smart Units") {
                display = display.split(' ');
                num = display[0];
                type = display[1];
                type = convertDisplayTypeToAcceptedType(type);
                return getMilliseconds(num, type);
            }
            /**
             * If a user enters a value without entering a type
             * Then the value will convert to milliseconds based off of the field the user
             * is typing in
             * */
            if (num && type.length === 0) {
                console.log('fieldInfo.scale: ', fieldInfo.scale);
                return getMilliseconds(num, fieldInfo.scale);
            }
        },
        /**
         * Given a raw number as input, formats the duration value for display.
         * @param fieldValue the field value object
         * @param fieldInfo the meta data about the field
         * @returns A formatted display string
         */
        format: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }
            var opts = fieldInfo.jsFormat;
            if (!opts) {
                opts = this.generateFormat(fieldInfo);
            }
            if (fieldInfo && fieldInfo.resultObj) {
                opts.resultObj = fieldInfo.resultObj;
            }
            var formattedValue = formatDurationValue(fieldValue.value, opts);
            return formattedValue;
        },

        hasUnitsText : hasUnitsText

    };
}());
