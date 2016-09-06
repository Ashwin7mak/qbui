/**
 * Given a raw numeric field value and field meta data from the Java capabilities API, this module is capable of
 * display formatting the numeric field.
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
    var consts = require('../constants');

    //Module constants:
    var COMMA = ',';
    var DASH = '-';
    var ZERO_CHAR = '0';
    var PERIOD = '.';
    var PATTERN_EVERY_THREE = 'EVERY_THREE';
    var PATTERN_THREE_THEN_TWO = 'THREE_THEN_TWO';
    var CURRENCY_LEFT = 'LEFT';
    var CURRENCY_RIGHT = 'RIGHT';
    var CURRENCY_LEFT_OF_SIGN = 'LEFT_OF_SIGN';
    var CURRENCY_SYMBOL = '$';
    var PERCENT_SYMBOL = '%';
    //Defaults & supported values
    var DEFAULT_SEPARATOR_START = 3;
    var DEFAULT_CURRENCY_SYMBOL = CURRENCY_SYMBOL;
    var DEFAULT_CURRENCY_SYMBOL_POSITION = CURRENCY_LEFT;
    var DEFAULT_SEPARATOR_MARK = null;
    var DEFAULT_DECIMAL_PLACES = null;
    var DEFAULT_DECIMAL_MARK = PERIOD;
    var DEFAULT_SEPARATOR_PATTERN = PATTERN_EVERY_THREE;
    var SUPPORTED_DELIMETERS = {};
    SUPPORTED_DELIMETERS[COMMA] = true;
    SUPPORTED_DELIMETERS[PERIOD] = true;
    var SUPPORTED_SEPARATOR_PATTERNS = {};
    SUPPORTED_SEPARATOR_PATTERNS[PATTERN_EVERY_THREE] = true;
    SUPPORTED_SEPARATOR_PATTERNS[PATTERN_THREE_THEN_TWO] = true;

    /**
     * Splits a string into an array of strings of length charsPerSubstring ending with the substring
     * whose end position is at position lastPos. The array is populated right to left using unshift() and thus
     * the first substring in the array can have less than charsPerSubstring number of characters in it.
     * @param inputString the input string
     * @param lastPos the end position of the final substring within the returned array
     * @param charsPerSubstring The number of characters per substring
     * @returns The array of substrings of length charsPerSubstring within the input string, ending at pos lastPos
     */
    function splitString(inputString, lastPos, charsPerSubstring) {
        var ret = [];
        if (inputString.length - lastPos + charsPerSubstring > 0) {
            for (var i = lastPos - charsPerSubstring; i > 0 - charsPerSubstring; i -= charsPerSubstring) {
                var start = i;
                var len = charsPerSubstring;
                if (i < 0) {
                    start = 0;
                    len = charsPerSubstring + i;
                }
                ret.unshift(inputString.substr(start, len));
            }
        }
        return ret;
    }

    /**
     * given a numeric characteristic value as a string, rounds the value to the precision specified and
     * returns the value as a string.
     * @param value the numeric value to round and stringify
     * @param precision the number of decimal places to return in the formatted string
     * @returns the rounded numeric as a string with number of decimal places equal to precision
     */
    function toRoundedDisplayDecimal(characteristicString, precision) {
        if (precision === 0) {
            return null;
        } else if (!precision) {
            return characteristicString;
        } else if (characteristicString === null) {
            characteristicString = '';
        }
        if (characteristicString.length > precision) {
            //round
            var c = new bigDecimal.BigDecimal(characteristicString);
            c = c.divide(new bigDecimal.BigDecimal(Math.pow(10, characteristicString.length - precision)));
            c = c.setScale(0, bigDecimal.RoundingMode.HALF_UP());
            var cStr = c.toString();
            characteristicString = cStr;
        }
        //Pad if needed to fill out the precision
        if (characteristicString.length < precision) {
            while (characteristicString.length < precision) {
                characteristicString = characteristicString + ZERO_CHAR;
            }
        }
        return characteristicString;
    }

    /**
     * Given a raw mantissaString and formatting options object, format and return a display-ready
     * mantissa string.
     * @param mantissaString
     * @param opts
     * @returns {*}
     */
    function toFormattedMantissaString(mantissaString, opts) {

        if (mantissaString === null) {
            return '';
        }

        var formattedMantissa = mantissaString;
        //Format the mantissa, if its long enough to need formatting
        if (opts.separatorMark && mantissaString.length > opts.separatorStart) {
            var mantissaLength = mantissaString.length;
            //apply the separator pattern
            if (opts.separatorPattern === PATTERN_EVERY_THREE) {
                formattedMantissa = splitString(mantissaString, mantissaLength, 3).join(opts.separatorMark);
            } else if (opts.separatorPattern === PATTERN_THREE_THEN_TWO) {
                var rightMostStart = mantissaLength - 3;
                var ret = splitString(mantissaString, rightMostStart, 2);
                ret.push(mantissaString.substr(rightMostStart));
                formattedMantissa = ret.join(opts.separatorMark);
            }
        }

        return formattedMantissa;
    }

    /**
     * Is the numeric value in scientific notation format.
     *
     *
     * @param numeric
     * @returns {boolean}
     */
    function isScientificNotation(numeric) {
        return String(numeric).split(/[eE]/).length === 2;
    }


    /**
     * Need to manually build function to convert scientific notation number as
     * using the build-in javascript functions like parse of Number will not work
     * for large numbers like 1.34E+25
     *
     * @param numeric
     * @returns {*}
     */
    function convertScientificNotation(numeric) {
        //  split the number where have the coefficient and base 10 exponent
        var data = String(numeric).split(/[eE]/);
        if (data.length === 1) {
            return data[0];
        }

        var coefficient = data[0].replace(PERIOD, ''),
            exponent = Number(data[1]) + 1;

        //  is the exponent negative IE: 1.2345e-20
        if (exponent < 0) {
            //  format fraction as 0.xxxx or -0.xxx
            var leadingZeros = (numeric < 0 ? DASH : '') + ZERO_CHAR + PERIOD;

            //  append the number of base 10 zeros
            while (exponent++) {
                leadingZeros += ZERO_CHAR;
            }

            //  return the converted number
            return leadingZeros + coefficient.replace(/^\-/, '');
        }

        //  have a positive exponent IE: 1.2345e+20
        exponent -= (numeric < 0 ? coefficient.length - 1 : coefficient.length);
        while (exponent--) {
            coefficient += ZERO_CHAR;    // append a zero for each base 10 exponent
        }

        //  return the converted number
        return coefficient;
    }

    /**
     * Given a numeric value and an options object with display config properties set on it, this method
     * formats the numeric value as a string and returns the formatted string.
     * @param numeric A numeric value
     * @param opts display options
     * @returns the numeric value formatted as a string
     */
    function formatNumericValue(numeric, opts) {
        if (opts.decimalMark === ",") {
            console.log("wait");
        }
        var mantissaString = null, characteristicString = null;

        if (opts.type === consts.PERCENT || opts.type === consts.FORMULA_PERCENT) {
            numeric = numeric ? numeric * 100 : 0;
        }

        if (opts.decimalPlaces === 14) {
            opts.decimalPlaces = null;
        }

        //Resolve the number value as a string with the proper decimal places
        var numString = Number(numeric).toString();


        // If numString is in scientific notation format, this means the number is too
        // large to convert using the javascript built-in function.  We'll need to
        // manually perform the conversion.
        if (isScientificNotation(numString)) {
            numString = convertScientificNotation(numString);
        }
        //Split the string on the decimal point, if there is one
        var numParts = numString.split(PERIOD);
        mantissaString = numParts[0];
        if (numParts.length > 1) {
            characteristicString = numParts[1];
        }

        characteristicString = toRoundedDisplayDecimal(characteristicString, opts.decimalPlaces);
        mantissaString = toFormattedMantissaString(mantissaString, opts);
        //Construct the return string
        var returnValue = mantissaString;
        if (characteristicString) {
            returnValue = returnValue + opts.decimalMark + characteristicString;
        }

        //Handle percent and currency subtypes
        if (opts.type === consts.FORMULA_CURRENCY || opts.type === consts.CURRENCY) {
            if (opts.position === CURRENCY_RIGHT) {
                returnValue = returnValue + ' ' + opts.symbol;
            } else if (opts.position === CURRENCY_LEFT_OF_SIGN && returnValue.charAt(0) === DASH) {
                //Place the currency symbol between the - and the number itself
                returnValue = returnValue.replace(/^(-)/, DASH + opts.symbol);
            } else {
                returnValue = opts.symbol + returnValue;
            }
        } else if (opts.type === consts.PERCENT || opts.type === consts.FORMULA_PERCENT) {
            returnValue = returnValue + PERCENT_SYMBOL;
        }
        return returnValue;
    }

    module.exports = {
        /**
         * Given a numeric field's meta data, construct the formatting options, setting defaults
         * where none are provided or where invalid values are provided
         *
         * @param fieldInfo a field meta data object
         * @returns a display options object
         */
        generateFormat: function(fieldInfo) {
            var opts = {};
            if (fieldInfo && fieldInfo.clientSideAttributes) {
                opts.separatorStart = fieldInfo.clientSideAttributes.separator_start;
                opts.separatorMark = fieldInfo.clientSideAttributes.separator_mark;
                opts.separatorPattern = fieldInfo.clientSideAttributes.separator_pattern;
                opts.decimalMark = fieldInfo.clientSideAttributes.decimal_mark;
                opts.type = fieldInfo.type;
                if (opts.type === consts.CURRENCY || opts.type === consts.FORMULA_CURRENCY) {
                    opts.symbol = fieldInfo.clientSideAttributes.symbol;
                    opts.position = fieldInfo.clientSideAttributes.position;
                }
            }
            opts.decimalPlaces = fieldInfo.decimalPlaces;
            //If decimal places is not a number or less than 0, set it to default value
            if (opts.decimalPlaces && (isNaN(opts.decimalPlaces) || opts.decimalPlaces < 0)) {
                opts.decimalPlaces = DEFAULT_DECIMAL_PLACES;
            }
            if (!opts.separatorStart || isNaN(opts.separatorStart)) {
                opts.separatorStart = DEFAULT_SEPARATOR_START;
            }
            if (!opts.separatorMark || opts.separatorMark.length !== 1) {
                opts.separatorMark = DEFAULT_SEPARATOR_MARK;
            }
            if (!opts.separatorPattern || !SUPPORTED_SEPARATOR_PATTERNS[opts.separatorPattern]) {
                opts.separatorPattern = DEFAULT_SEPARATOR_PATTERN;
            }
            if (!opts.decimalMark || opts.decimalMark.length !== 1) {
                opts.decimalMark = DEFAULT_DECIMAL_MARK;
            }
            if (!opts.type) {
                opts.type = consts.NUMERIC;
            }
            //Add any additional currency options, if this is a currency field
            if (opts.type === consts.CURRENCY || opts.type === consts.FORMULA_CURRENCY) {
                if (!opts.symbol) {
                    opts.symbol = DEFAULT_CURRENCY_SYMBOL;
                }
                if (!opts.position) {
                    opts.position = DEFAULT_CURRENCY_SYMBOL_POSITION;
                }
            }
            return opts;
        },
        /**
         * Given a raw number as input, formats the numeric value for display.
         * @param fieldValue the field value object
         * @param fieldInfo the meta data about the field
         * @returns A formatted display string
         */
        format: function(fieldValue, fieldInfo) {

            if (!fieldValue) {
                return '';
            }

            //  is the field value a valid number
            if (fieldValue.value === null || fieldValue.value === undefined) {
                return '';
            }

            var opts = fieldInfo.jsFormat;
            if (!opts) {
                opts = this.generateFormat(fieldInfo);
            }
            var formattedValue = formatNumericValue(fieldValue.value, opts);
            return formattedValue;
        }
    };
}());
