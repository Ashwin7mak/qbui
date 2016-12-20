/**
 * Given a user's input this module converts it to milliseconds
 */
(function() {
    'use strict';
    var DURATION_CONSTS = require('../../../../common/src/constants').DURATION_CONSTS;
    var Locale = require('../../locales/locales');
    // var ALLOWED_DURATION_TYPE = ['s', 'second', 'seconds', 'ms', 'millisecond', 'milliseconds', 'm', 'minute', 'minutes', 'h', 'hour', 'hours', 'd', 'day', 'days', 'w', 'week', 'weeks'];
    var regexNumsDecimalsColons = /[0-9.:]+/g;
    var removeCommas = /[,]+/g;
    var ALLOWED_DURATION_TYPE = [DURATION_CONSTS.MINUTES, DURATION_CONSTS.HOURS];

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
        var tempObj = {};
        ALLOWED_DURATION_TYPE.forEach(function(currentType) {
            tempObj[currentType] = Locale.getMessage('durationAcceptedType.' + currentType);
        });
        console.log('getMilliseconds: ', type);
        console.log('tempObj: ', tempObj);
        console.log('num: ', num);
        var returnValue;
        switch (type) {
        /**
         * If a user enters a number without entering a type, then the default for .scale is to convert milliseconds by days
         * HHMM && HHMMSS will default to converting the value to milliseconds by hours
         * MM && MMSS will default to converting the value to milliseconds by minutes
         * */
        // case DURATION_CONSTS.SCALES.HHMM:
        // case DURATION_CONSTS.SCALES.HHMMSS:
        //     returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_HOUR);
        //     break;
        // case DURATION_CONSTS.SCALES.MM:
        // case DURATION_CONSTS.MMSS:
        //     returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_MIN);
        //     break;
        // case DURATION_CONSTS.SCALES.WEEKS:
        // case DURATION_CONSTS.W:
        //     returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_WEEK);
        //     break;
        // /**
        //  * XD Specs state that smart units default to days when a user does not input a type
        //  * */
        // case DURATION_CONSTS.SCALES.SMART_UNITS:
        // case DURATION_CONSTS.SCALES.DAYS:
        // case DURATION_CONSTS.D:
        //     returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_DAY);
        //     break;
        // case tempObj[DURATION_CONSTS.HOURS]:
        // case DURATION_CONSTS.H:
        case Locale.getMessage('durationAcceptedType.' + DURATION_CONSTS.HOURS):
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_HOUR);
            break;
        case Locale.getMessage('durationAcceptedType.' + DURATION_CONSTS.MINUTES):
        // case DURATION_CONSTS.M:
            returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_MIN);
            break;
        // case DURATION_CONSTS.SCALES.SECONDS:
        // case DURATION_CONSTS.S:
        //     returnValue = convertToMilliseconds(num, DURATION_CONSTS.MILLIS_PER_SECOND);
        //     break;
        // case DURATION_CONSTS.SCALES.MILLISECONDS:
        // case DURATION_CONSTS.MS:
        //     returnValue = num;
        //     break;
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
        var numArray = num.match(/[^:]+/g, '');
        /**
         * ::SS => num[0] === ':' && num[1] === ':'
         * H::S =>  num[1] === ':' && num[2] === ':'
         * HH::SS => num[2] === ':' && num[3] === ':'
         * */
        if (num[0] === ':' && num[1] === ':' ||
            num[1] === ':' && num[2] === ':' ||
            num[2] === ':' && num[3] === ':') {
            if (numArray.length === 2) {
                hours = convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_HOUR);
                seconds = convertToMilliseconds(numArray[1], DURATION_CONSTS.MILLIS_PER_SECOND);
                return hours + seconds;
            }
            return convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_SECOND);
        }
        /**
         * :MM:SS
         * */
        if (num[0] === ':') {
            if (numArray.length === 2) {
                minutes = convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_MIN);
                seconds = convertToMilliseconds(numArray[1], DURATION_CONSTS.MILLIS_PER_SECOND);
                return minutes + seconds;
            }
            /**
             * :MM
             * */
            return convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_MIN);
        }
        /**
         * HH:
         * */
        if (numArray.length === 1) {
            return convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_HOUR);
        }
        /**
         * HH:MM
         * */
        if (numArray.length === 2) {
            hours = convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_HOUR);
            minutes = convertToMilliseconds(numArray[1], DURATION_CONSTS.MILLIS_PER_MIN);
            return hours + minutes;
        }
        /**
         * HH:MM:SS
         * */
        if (numArray.length === 3) {
            hours = convertToMilliseconds(numArray[0], DURATION_CONSTS.MILLIS_PER_HOUR);
            minutes = convertToMilliseconds(numArray[1], DURATION_CONSTS.MILLIS_PER_MIN);
            seconds = convertToMilliseconds(numArray[2], DURATION_CONSTS.MILLIS_PER_SECOND);
            return  hours + minutes + seconds;
        }
        return num;
    }
    function isTimeFormatValid(value, type) {
        var colons;
        var regexValidNum = /^((-?\d+)|(-?\d+\.\d*)|(-?\d*\.\d+))$/;

        /**
         * If a type is inserted with time format, it is not valid
         * HH:MM:SS minutes is not a valid format
         * */
        type = type.join('').trim().split(' ');
        if (type.length > 1 || type.length === 1 && type[0] !== '') {
            return false;
        }
        colons = value.match(/:/g);
        if (colons.length > 3) {
            return false;
        }
        let numArray = value.match(/[^:]+/g, '');
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
        isValid: function(value) {
            var regexHasNums = /[0-9]+/g;
            var tempNum;
            var localizedTypes = [];
            var tempType = [];
            var valid = true;
            var type;
            /**
             * Don't validate empty strings
             * */
            if (!value) {
                return true;
            }
            /**
             * If a user does not input a number, return invalid
             * */
            if (!regexHasNums.test(value)) {
                return false;
            }
            /**
             * If the input is only a number, return true
             * */
            if (typeof value === 'number' || !value) {
                return true;
            }
            /**
             * If a user inserted a colon, it will be validated based off of time formats validation requirements
             * */
            value = value.toLowerCase();
            type = value.replace(regexNumsDecimalsColons, ' ').split(' ');
            if (value.indexOf(':') !== -1) {
                return isTimeFormatValid(value, type);
            }
            /**
             * Strips out all numbers
             * If there is an invalid type return false
             * If there are no types, return true
             * If there are only accepted types return true
             * */
            ALLOWED_DURATION_TYPE.forEach(function(currentType) {
                localizedTypes.push(Locale.getMessage('durationAcceptedType.' + currentType).toLowerCase());
            });
            type.forEach(function(val) {
                if (localizedTypes.indexOf(val) === -1 && val !== '') {
                    valid = false;
                } else if (val !== '') {
                    tempType.push(val);
                }
            });
            /**
             * If a user inserts more types than nums return false
             * 1 week day invalid format
             * 1 week 2 days valid format
             * */
            tempNum = value.match(regexNumsDecimalsColons);
            if (!(tempType.length === 0) && tempNum.length !== tempType.length) {
                return false;
            }
            return valid;
        },
        onBlurParsing: function(value, fieldInfo) {
            value = value.replace(removeCommas, '').split(' ').join(' ');
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
            var total = 0;
            var listOfTypes = [];
            var type;
            var num;
            /**
             * Checks to see if the value is a valid input
             * */
            if (this.isValid(value)) {
                /**
                 * If the user inserted a semicolon, then the string needs to be parsed based off of
                 * the HHMMSS, HHMM, MMSS requirements
                 * */
                if (value && value.indexOf(':') !== -1) {
                    return {value: convertHourMinutesSeconds(value), valid: true};
                }
                /**
                 * If the user passes in a string containing a number and a type, we split the string here
                 * and separate the number and type from each other
                 * Strips out all commas
                 * */
                value = value.toLowerCase();
                num = value.match(regexNumsDecimalsColons);
                type = value.replace(regexNumsDecimalsColons, ' ').split(' ');
                type.forEach(function(val) {
                    /**
                     * Checks to see if the user inserted a shortcut key such as 'ms', 'm' and etc...
                     * */
                    if (val.length <= 2 && val !== '') {
                        val = val.toUpperCase();
                        listOfTypes.push(val);
                    } else if (val !== '') {
                        /**
                         * Removes first letter and sets it toUpperCase
                         * Sets type to a string and concatenates the upperCaseLetter back on
                         * If type is not plural, then it concatenates an 's'
                         * This formats it to make it easier to check it against constants later
                         */
                        val = val.toLowerCase();
                        var firstLetter = val[0].toUpperCase();
                        val = val.slice(1);
                        val = firstLetter + val;
                        if (val[val.length - 1] !== 's') {
                            val = val + 's';
                        }
                        listOfTypes.push(val);
                    }
                });
                /**
                 * If a user only inputs one num and one type, then this function will only be called once
                 * However if the user inserted more than one num and more than one type then this function calls each num with its type
                 * The isValid function above, checks to be sure each num has a type, if it did not an error will be thrown
                 * Example 1 week 2 days becomes
                 * num = [1,2]
                 * listOfTypes = [week, days]
                 * During the first loop, the function invokes like so getMilliseconds(1, week) and then the result is accumulated to total;
                 * */
                if (num !== null && num.length === listOfTypes.length && listOfTypes[0] !== '') {
                    num.forEach(function(val, i) {
                        if (num.length === 1 && listOfTypes[i] === DURATION_CONSTS.MILLISECONDS || listOfTypes[i] === DURATION_CONSTS.MS) {
                            total = Number(getMilliseconds(num[i], listOfTypes[i]));
                        } else {
                            total += getMilliseconds(num[i], listOfTypes[i]);
                        }
                    });
                    return {value: total, valid: true};
                }
                if (num !== null) {
                    return {value: getMilliseconds(num[0], fieldInfo.scale), valid: true};
                }
            }
            return {
                value: value,
                valid: false
            };
        },
        getPlaceholder: function(scale) {
            var placeholder = '';
            if (!scale) {
                return placeholder;
            }
            switch (scale) {
            case DURATION_CONSTS.HHMM:
                placeholder = DURATION_CONSTS.PLACEHOLDER.HHMM;
                break;
            case DURATION_CONSTS.HHMMSS:
                placeholder = DURATION_CONSTS.PLACEHOLDER.HHMMSS;
                break;
            case DURATION_CONSTS.MM:
                placeholder = DURATION_CONSTS.PLACEHOLDER.MM;
                break;
            case DURATION_CONSTS.MMSS:
                placeholder = DURATION_CONSTS.PLACEHOLDER.MMSS;
                break;
            case DURATION_CONSTS.WEEKS:
                placeholder = DURATION_CONSTS.PLACEHOLDER.WEEKS;
                break;
            /**
             * XD Specs state that smart units default to days
             * */
            case DURATION_CONSTS.SMART_UNITS:
            case DURATION_CONSTS.DAYS:
                placeholder = DURATION_CONSTS.PLACEHOLDER.DAYS;
                break;
            case DURATION_CONSTS.HOURS:
                placeholder = DURATION_CONSTS.PLACEHOLDER.HOURS;
                break;
            case DURATION_CONSTS.MINUTES:
                placeholder = DURATION_CONSTS.PLACEHOLDER.MINUTES;
                break;
            case DURATION_CONSTS.SECONDS:
                placeholder = DURATION_CONSTS.PLACEHOLDER.SECONDS;
                break;
            default:
                break;
            }
            return placeholder;
        }
    };
}());
