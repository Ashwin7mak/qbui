/**
 * Given a user's input this module converts it to milliseconds
 */
(function() {
    'use strict';
    var DURATION_CONSTS = require('../../../../common/src/constants').DURATION_CONSTS;
    var durationFormatter = require('../../../../common/src/formatter/durationFormatter');
    var Locale = require('../../locales/locales');
    var regexNumsDecimalsColons = /-?[0-9.:]+/g;
    var removeCommas = /[,]+/g;
    /**
     * Accepted Types:
     * millisecond || milliseconds || ms
     * second || seconds || s
     * minute || minutes || m
     * hour || hours || h
     * week || weeks || w
     * Accepted Format For Seconds, Minutes, Hours:
     * 00:00:00
     * 00:00
     * :00
     * :00:00
     * ::00
     **/
    function allowedDurationType() {
        var ALLOWED_DURATION_TYPE = {};
        //Default to field scales if user does not enter a type
        ALLOWED_DURATION_TYPE[DURATION_CONSTS.SCALES.SECONDS] = DURATION_CONSTS.ACCEPTED_TYPE.SECONDS;
        ALLOWED_DURATION_TYPE[DURATION_CONSTS.SCALES.MINUTES] = DURATION_CONSTS.ACCEPTED_TYPE.MINUTES;
        ALLOWED_DURATION_TYPE[DURATION_CONSTS.SCALES.HOURS] = DURATION_CONSTS.ACCEPTED_TYPE.HOURS;
        ALLOWED_DURATION_TYPE[DURATION_CONSTS.SCALES.DAYS] = DURATION_CONSTS.ACCEPTED_TYPE.DAYS;
        ALLOWED_DURATION_TYPE[DURATION_CONSTS.SCALES.WEEKS] = DURATION_CONSTS.ACCEPTED_TYPE.WEEKS;
        ALLOWED_DURATION_TYPE[DURATION_CONSTS.SCALES.HHMMSS] = DURATION_CONSTS.ACCEPTED_TYPE.HOURS;
        ALLOWED_DURATION_TYPE[DURATION_CONSTS.SCALES.HHMM] = DURATION_CONSTS.ACCEPTED_TYPE.HOURS;
        ALLOWED_DURATION_TYPE[DURATION_CONSTS.SCALES.MMSS] = DURATION_CONSTS.ACCEPTED_TYPE.MINUTES;
        ALLOWED_DURATION_TYPE[DURATION_CONSTS.SCALES.MM] = DURATION_CONSTS.ACCEPTED_TYPE.MINUTES;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.S)] = DURATION_CONSTS.ACCEPTED_TYPE.SECONDS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.SECONDS)] = DURATION_CONSTS.ACCEPTED_TYPE.SECONDS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.MS)] = DURATION_CONSTS.ACCEPTED_TYPE.MILLISECONDS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.SECOND)] = DURATION_CONSTS.ACCEPTED_TYPE.SECONDS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.MILLISECOND)] = DURATION_CONSTS.ACCEPTED_TYPE.MILLISECONDS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.MILLISECONDS)] = DURATION_CONSTS.ACCEPTED_TYPE.MILLISECONDS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.M)] = DURATION_CONSTS.ACCEPTED_TYPE.MINUTES;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.MINUTE)] = DURATION_CONSTS.ACCEPTED_TYPE.MINUTES;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.MINUTES)] = DURATION_CONSTS.ACCEPTED_TYPE.MINUTES;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.H)] = DURATION_CONSTS.ACCEPTED_TYPE.HOURS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.HOUR)] = DURATION_CONSTS.ACCEPTED_TYPE.HOURS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.HOURS)] = DURATION_CONSTS.ACCEPTED_TYPE.HOURS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.D)] = DURATION_CONSTS.ACCEPTED_TYPE.DAYS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.DAY)] = DURATION_CONSTS.ACCEPTED_TYPE.DAYS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.DAYS)] = DURATION_CONSTS.ACCEPTED_TYPE.DAYS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.W)] = DURATION_CONSTS.ACCEPTED_TYPE.WEEKS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.WEEK)] = DURATION_CONSTS.ACCEPTED_TYPE.WEEKS;
        ALLOWED_DURATION_TYPE[Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.WEEKS)] = DURATION_CONSTS.ACCEPTED_TYPE.WEEKS;
        return ALLOWED_DURATION_TYPE;
    }
    function convertToMilliseconds(num, millis) {
        var result = num * millis;
        /**
         * One last check to be sure the result is a number
         * */
        if (isNaN(num)) {
            return num;
        }
        return result;
    }
    /**
     * This functions will convert the number the user entered into milliseconds based off of the type the user entered
     * For example if a user entered "2 hours" it will be converted into a total of 2 hours worth of milliseconds
     * */
    function getMilliseconds(num, type) {
        type = type.toLowerCase();
        var returnValue;
        switch (type) {
        /**
         * If a user enters a number without entering a type, then the default for .scale is to convert milliseconds by days
         * HHMM && HHMMSS will default to converting the value to milliseconds by hours
         * MM && MMSS will default to converting the value to milliseconds by minutes
         * */
        case DURATION_CONSTS.SCALES.HHMM.toLowerCase():
        case DURATION_CONSTS.SCALES.HHMMSS.toLowerCase():
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_HOUR);
            break;
        case DURATION_CONSTS.SCALES.MM.toLowerCase():
        case DURATION_CONSTS.SCALES.MMSS.toLowerCase():
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_MIN);
            break;
        case Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.WEEKS):
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_WEEK);
            break;
        // /**
        //  * XD Specs state that smart units default to days when a user does not input a type
        //  * */
        case DURATION_CONSTS.SCALES.SMART_UNITS.toLowerCase():
        case Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.DAYS):
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_DAY);
            break;
        case Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.HOURS):
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_HOUR);
            break;
        case Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.MINUTES):
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_MIN);
            break;
        case Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.SECONDS):
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_SECOND);
            break;
        case Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.MILLISECONDS):
            returnValue = num;
            break;
        default:
            break;
        }
        return returnValue;
    }
    /**
     * This function is used to convert the following formats into milliseconds
     * HH:MM:SS
     * HH:MM
     * :MM:SS
     * ::SS
     * The above formats are split on the colons and then, by locating the placements of the colons
     * converted to milliseconds by hours, minutes or seconds
     * finally the resulting milliseconds from hours, minutes and seconds are added together to get the
     * total milliseconds.
     * */
    function convertHourMinutesSeconds(num) {
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        var numArray = num.match(/[^:-]+/g);
        var isNegative = (/-/g).test(num);
        var answer;
        /**
         * match on num(optional)::num
         * ::SS
         * H::SS
         * HH::SS
         * */
        if (/^[^:]*::[^:]+$/g.test(num)) {
            if (numArray.length === 2) {
                hours = convertToMilliseconds(Math.abs(numArray[0]), DURATION_CONSTS.MILLIS_PER_HOUR);
                seconds = convertToMilliseconds(Math.abs(numArray[1]), DURATION_CONSTS.MILLIS_PER_SECOND);
                answer = hours + seconds;
            } else {
                answer = convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_SECOND);
            }
        } else if (/^:[^:]+/.test(num)) {
            /**
             * :MM:SS
             * */
            if (numArray.length === 2) {
                minutes = convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_MIN);
                seconds = convertToMilliseconds(numArray[1], DURATION_CONSTS.MILLIS_PER_SECOND);
                answer = minutes + seconds;
            } else {
                /**
                 * :MM
                 * */
                answer =  convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_MIN);
            }
        } else if (numArray.length === 1) {
            /**
             * HH:
             * */
            answer =  convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_HOUR);
        } else if (numArray.length === 2) {
            /**
             * HH:MM
             * */
            hours = convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_HOUR);
            minutes = convertToMilliseconds(numArray[1], DURATION_CONSTS.MILLIS_PER_MIN);
            answer =  hours + minutes;
        } else if (numArray.length === 3) {
            /**
             * HH:MM:SS
             * */

            hours = convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_HOUR);
            minutes = convertToMilliseconds(numArray[1], DURATION_CONSTS.MILLIS_PER_MIN);
            seconds = convertToMilliseconds(numArray[2], DURATION_CONSTS.MILLIS_PER_SECOND);
            answer =  hours + minutes + seconds;
        } else {
            answer = num;
        }

        if (isNegative) {
            answer *= -1;
        }
        return answer;
    }
    function isTimeFormatValid(value, type) {
        var colons;
        var regexValidNum = /^((-?\d+)|(-?\d+\.\d*)|(-?\d*\.\d+))$/;

        /**
         * If a type is inserted with time format, it is not valid
         * HH:MM:SS minutes is not a valid format
         * */
        if (type.length >= 1) {
            return false;
        }
        colons = value.match(/:/g);
        if (colons.length > 2) {
            return false;
        }
        let numArray = value.match(/[^:]+/g);
        if (numArray.length > 3 || numArray.length === 0) {
            return false;
        }
        let numbersValid = true;
        numArray.forEach((numval) => {
            if (!regexValidNum.test(numval)) {
                numbersValid  = false;
            }
        });
        return numbersValid;
    }

    module.exports = {
        isValid: function(value, scale) {
            var ALLOWED_DURATION_TYPE = allowedDurationType();
            var regexHasNums = /[0-9]+/g;
            var type;
            var isValidResults = {
                normalizedTypes: '',
                num: value,
                valid: true
            };
            /**
             * Don't validate empty strings
             * If the input is only a number, normalizedType defaults to field scale
             * */
            if (!value || Number(value)) {
                isValidResults.normalizedTypes = [ALLOWED_DURATION_TYPE[scale]];
                isValidResults.num = [value];
                return isValidResults;
            }
            /**
             * If a user does not input a number, return invalid
             * */
            if (!regexHasNums.test(value)) {
                isValidResults.valid = false;
                return isValidResults;
            }
            /**
             * If a user inserted a colon, it will be validated based off of time formats validation requirements
             * */
            value = value.toLowerCase();
            type = value.replace(regexNumsDecimalsColons, ' ')
                                .split(' ')
                                .filter(function(val) {return val !== '';});
            if (value.indexOf(':') !== -1) {
                return isTimeFormatValid(value, type);
            }
            /**
             * Strips out all numbers
             * If there is an invalid type return false
             * If there are no types, return true
             * If there are only accepted types return true
             * */
            isValidResults.normalizedTypes = type.map(function(val) {
                if (ALLOWED_DURATION_TYPE[val]) {
                    return ALLOWED_DURATION_TYPE[val];
                } else {
                    isValidResults.valid = false;
                }
            });
            /**
             * If a user inserts more types than nums return false
             * 1 week day invalid format
             * 1 week 2 days valid format
             * */
            isValidResults.num = value.match(regexNumsDecimalsColons);
            if (!(isValidResults.normalizedTypes.length === 0) && isValidResults.num.length !== isValidResults.normalizedTypes.length) {
                return false;
            }
            return isValidResults;
        },
        onBlurParsing: function(value, fieldInfo, includeUnits) {
            value = value.replace(removeCommas, '').split(' ').join(' ');
            value = value.trim();
            var total = 0;
            var scale = fieldInfo.scale;
            var isValidResults;
            var results = {
                value: DURATION_CONSTS.ACCEPTED_TYPE.DURATION_TYPE_INVALID_IPUT,
                display: value
            };
            /**
             * Checks to see if the value is a valid input
             * */
            isValidResults = this.isValid(value, scale);
            if (isValidResults.valid) {
                /**
                 * If the user inserted a semicolon, then the string needs to be parsed based off of
                 * the HHMMSS, HHMM, MMSS requirements
                 * */
                if (value && value.indexOf(':') !== -1) {
                    results.value = convertHourMinutesSeconds(value);
                    results.display = durationFormatter.format({value: results.value}, fieldInfo);
                    return results;
                }
                /**
                 * If a user only inputs one num and one type, then this function will only be called once
                 * However if the user inserted more than one num and more than one type then this function calls each num with its type
                 * The isValid function above, checks to be sure each num has a type, if it did not an error will be thrown
                 * Example 1 week 2 days becomes
                 * num = [1,2]
                 * listOfTypes = [week, days]
                 * During the first loop, the function invokes like so getMilliseconds(1, week) and then the result is accumulated to total;
                 * */
                console.log('isValidResults: ', isValidResults);
                if (isValidResults.num !== null) {
                    isValidResults.normalizedTypes.forEach(function(val, i) {
                        if (isValidResults.num.length === 1 && isValidResults.normalizedTypes[i] === DURATION_CONSTS.SCALES.MILLISECONDS) {
                            total = Number(getMilliseconds(isValidResults.num[i], isValidResults.normalizedTypes[i]));
                        } else {
                            total += getMilliseconds(isValidResults.num[i], isValidResults.normalizedTypes[i]);
                        }
                    });
                }
                results.value = total;
                results.display = durationFormatter.format({value: results.value}, fieldInfo);
                if (includeUnits) {
                    results.display = this.includeUnitsInInput(results.display, fieldInfo);
                }
            }
            console.log('results: ', results);
            return results;
        },
        includeUnitsInInput(display, fieldInfo) {
            /**
             * includeUnitsInInput checks to see if includeUnits is true
             * It then checks to see if display is only a number
             * If it is only a number it will concatenate the scale type of the field to the input
             * */
            if (durationFormatter.hasUnitsText(fieldInfo.scale) && !isNaN(Number(display))) {
                display = display + ' ' + this.getPlaceholder(fieldInfo.scale, display);
            }
            return display;
        },
        getPlaceholder: function(scale, value) {
            var placeholder = '';
            value = Number(value);
            if (!scale) {
                return placeholder;
            }

            switch (scale) {
            case DURATION_CONSTS.SCALES.HHMM:
                placeholder = DURATION_CONSTS.ACCEPTED_TYPE.HHMM;
                break;
            case DURATION_CONSTS.SCALES.HHMMSS:
                placeholder = DURATION_CONSTS.ACCEPTED_TYPE.HHMMSS;
                break;
            case DURATION_CONSTS.SCALES.MM:
                placeholder = DURATION_CONSTS.ACCEPTED_TYPE.MM;
                break;
            case DURATION_CONSTS.SCALES.MMSS:
                placeholder = DURATION_CONSTS.ACCEPTED_TYPE.MMSS;
                break;
            case DURATION_CONSTS.SCALES.WEEKS:
                placeholder = value === 1 ? Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.WEEK) :
                                            Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.WEEKS);

                break;
            /**
             * XD Specs state that smart units default to days
             * */
            case DURATION_CONSTS.SCALES.SMART_UNITS:
            case DURATION_CONSTS.SCALES.DAYS:
                placeholder = value === 1 ? Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.DAY) :
                                            Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.DAYS);
                break;
            case DURATION_CONSTS.SCALES.HOURS:
                placeholder = value === 1 ? Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.HOUR) :
                                            Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.HOURS);
                break;
            case DURATION_CONSTS.SCALES.MINUTES:
                placeholder = value === 1 ? Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.MINUTE) :
                                            Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.MINUTES);
                break;
            case DURATION_CONSTS.SCALES.SECONDS:
                placeholder = value === 1 ? Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.SECOND) :
                                            Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + DURATION_CONSTS.ACCEPTED_TYPE.SECONDS);
                break;
            default:
                break;
            }
            return placeholder;
        }
    };
}());
