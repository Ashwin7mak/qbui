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
    var ALLOWED_DURATION_TYPE = ['s', 'second', 'seconds', 'ms', 'millisecond', 'milliseconds', 'm', 'minute', 'minutes', 'h', 'hour', 'hours', 'd', 'day', 'days', 'w', 'week', 'weeks'];
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
            _.findKey(DURATION_CONSTS, function(entry) {return entry === scale;}) &&
            // and its not smart unit or time based type e.g. HH:MM
            scale !== DURATION_CONSTS.SMART_UNITS && !scale.match(/:/g)) {

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
        if (fieldDef && _.has(fieldDef, 'datatypeAttributes.scale') && fieldDef.datatypeAttributes.scale === DURATION_CONSTS.SMART_UNITS) {
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
        case DURATION_CONSTS.HHMM:
        case DURATION_CONSTS.HHMMSS:
        case DURATION_CONSTS.MM:
        case DURATION_CONSTS.MMSS:
            returnValue = generateTimeUnits(millis, hours, minutes, seconds, opts);
            break;
        case DURATION_CONSTS.SMART_UNITS:
            returnValue = generateSmartUnit(millis, weeks, days, hours, minutes, seconds, opts);
            break;
        case DURATION_CONSTS.WEEKS:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_WEEK, opts);
            break;
        case DURATION_CONSTS.DAYS:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_DAY, opts);
            break;
        case DURATION_CONSTS.HOURS:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_HOUR, opts);
            break;
        case DURATION_CONSTS.MINUTES:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_MIN, opts);
            break;
        case DURATION_CONSTS.SECONDS:
            returnValue = divideToString(millis, DURATION_CONSTS.MILLIS_PER_SECOND, opts);
            break;
        case DURATION_CONSTS.MILLISECONDS:
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
        } else if (opts.scale === DURATION_CONSTS.HHMM || opts.scale === DURATION_CONSTS.HHMMSS) {
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

        if (opts.scale === DURATION_CONSTS.MMSS || opts.scale === DURATION_CONSTS.HHMMSS) {
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
        if (weeks.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_WEEK, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.WEEKS;
            }
            smartUnits += ' weeks';
        } else if (days.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_DAY, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.DAYS;
            }
            smartUnits += ' days';
        } else if (hours.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_HOUR, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.HOURS;
            }
            smartUnits += ' hours';
        } else if (minutes.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_MIN, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.MINUTES;
            }
            smartUnits += ' mins';
        } else if (seconds.abs().compareTo(DURATION_CONSTS.ONE) !== -1) {
            smartUnits += divideToString(millis, DURATION_CONSTS.MILLIS_PER_SECOND, opts);
            if (opts.formattedObj) {
                opts.formattedObj.string = smartUnits;
                opts.formattedObj.units = DURATION_CONSTS.SECONDS;
            }
            smartUnits += ' ' + DURATION_CONSTS.SECS;
        } else {
            if (opts.formattedObj) {
                opts.formattedObj.string =  millis.toString();
                opts.formattedObj.units = DURATION_CONSTS.MILLISECONDS;
            }
            smartUnits += millis.toString() + ' ' + DURATION_CONSTS.MSECS;
        }
        return smartUnits;
    }
    function convertToMilliseconds(num, millis) {
        return num * millis;
    }
    function getMilliseconds(num, type) {
        var returnValue;
        switch (type) {
        /**
         * If a user enters a number without entering a type, then the default for .scale
         * HHMM && HHMMSS will default to converting the value to milliseconds by hours
         * MM && MMSS will default to converting the value to milliseconds by minutes
         * */
        case DURATION_CONSTS.HHMM:
        case DURATION_CONSTS.HHMMSS:
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_HOUR);
            break;
        case DURATION_CONSTS.MM:
        case DURATION_CONSTS.MMSS:
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_MIN);
            break;
        case DURATION_CONSTS.WEEKS:
        case DURATION_CONSTS.W:
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_WEEK);
            break;
        /**
         * XD Specs state that smart units default to days
         * */
        case DURATION_CONSTS.SMART_UNITS:
        case DURATION_CONSTS.DAYS:
        case DURATION_CONSTS.D:
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_DAY);
            break;
        case DURATION_CONSTS.HOURS:
        case DURATION_CONSTS.H:
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_HOUR);
            break;
        case DURATION_CONSTS.MINUTES:
        case DURATION_CONSTS.M:
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_MIN);
            break;
        case DURATION_CONSTS.SECONDS:
        case DURATION_CONSTS.S:
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_SECOND);
            break;
        case DURATION_CONSTS.MILLISECONDS:
        case DURATION_CONSTS.MS:
            returnValue = num;
            break;
        default:
            break;
        }
        return returnValue;
    }
    function convertHourMinutesSeconds(num) {
        //::90
        //::Banana
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
            return convertToMilliseconds(num[0], DURATION_CONSTS.MILLIS_PER_SECOND);
        }
        /**
         * :MM:SS
         * */
        if (num[0] === ':') {
            num = num.match(/\d+/g, '');
            if (num.length === 2) {
                minutes = convertToMilliseconds(num[0], DURATION_CONSTS.MILLIS_PER_MIN);
                seconds = convertToMilliseconds(num[1], DURATION_CONSTS.MILLIS_PER_SECOND);
                return minutes + seconds;
            }
            /**
             * :MM
             * */
            return minutes = convertToMilliseconds(num[0], DURATION_CONSTS.MILLIS_PER_MIN);
        }
        num = num.match(/\d+/g, '');
        /**
         * HH:
         * */
        if (num.length === 1) {
            return hours = convertToMilliseconds(num[0], DURATION_CONSTS.MILLIS_PER_HOUR);
        }
        /**
         * HH:MM
         * */
        if (num.length === 2) {
            hours = convertToMilliseconds(num[0], DURATION_CONSTS.MILLIS_PER_HOUR);
            minutes = convertToMilliseconds(num[1], DURATION_CONSTS.MILLIS_PER_MIN);
            return hours + minutes;
        }
        /**
         * HH:MM:SS
         * */
        if (num.length === 3) {
            hours = convertToMilliseconds(num[0], DURATION_CONSTS.MILLIS_PER_HOUR);
            minutes = convertToMilliseconds(num[1], DURATION_CONSTS.MILLIS_PER_HOUR);
            seconds = convertToMilliseconds(num[2], DURATION_CONSTS.MILLIS_PER_HOUR);
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
                opts.scale = DURATION_CONSTS.SMART_UNITS;
            }
            if (!opts.decimalPlaces && opts.decimalPlaces !== 0) {
                opts.decimalPlaces = DURATION_CONSTS.DEFAULT_DECIMAL_PLACES;
            }
            return opts;
        },
        onBlurParsing: function(value, fieldInfo) {
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
                return getMilliseconds(value, fieldInfo.scale);
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
                //splitting on spaces is a little rigid,
                // will update later to make more flexible
                //value = [789, 'minutes']
                num = parseInt(value.splice(0, 1)[0]);
                //value = ['minutes', 'banana']
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
            //type = ['minute', 'seconds', 'hours'];
            //notAllowedType = ['hotdog'];
            if (type.length > 1 || notAllowedType.length > 0) {
                //return not accepted value to user, and throw validation error
                return value;
            }
            /**
             * If a user only entered a single accepted type (e.g., ["minutes"])
             * then the num will be converted to milliseconds, based off of the type passed in by the user
             * */
            if (type.length === 1) {
                /**
                 * Checks to see if the user inserted a shortcut key such as 'ms', 'm' and etc...
                 * */
                if (type.join('').length <= 2) {
                    return getMilliseconds(num, type.join(''));
                }
                /**
                 * Removes first letter and sets it toUpperCase
                 * Sets type to a string and concatenates the upperCaseLetter back on
                 * If type is not plural, then it concatenates an 's'
                 */
                //['minutes'];
                var firstLetter = type.join('').split('').splice(0, 1).join('').toUpperCase();
                //firstLetter = 'M'
                type = type.join('').slice(1);
                //type = 'inutes'
                type =  firstLetter + type;
                //type = "Minutes"
                if (type[type.length - 1] !== 's') {
                    type = type + 's';
                }
                return getMilliseconds(num, type);
            }
            /**
             * If a user enters a value without entering a type
             * Then the value will convert to milliseconds based off of the field the user
             * is typing in
             * */
            if (num && type.length === 0) {
                return getMilliseconds(num, fieldInfo.scale);
            }
            /**
             * If it does not convert, then just return the value
             * */
            return value;
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
