/**
 * Given a raw numeric field value and field meta data from the Java capabilities API, this module is capable of
 * display formatting the numeric field.
 */
(function () {
    'use strict';
    //Module constants:
    var COMMA = ',';
    var ZERO_CHAR = '0';
    var DASH = '-';
    var PERIOD = '.';
    var PATTERN_EVERY_THREE = 'EVERY_THREE';
    var PATTERN_THREE_THEN_TWO = 'THREE_THEN_TWO'
    //Defaults & supported values
    var DEFAULT_SEPARATOR_START = 3;
    var DEFAULT_SEPARATOR_MARK = null;
    var DEFAULT_DECIMAL_MARK = COMMA;
    var DEFAULT_SEPARATOR_PATTERN = PATTERN_EVERY_THREE;
    var SUPPORTED_DELIMETERS = {};
    SUPPORTED_DELIMETERS[COMMA] = true;
    SUPPORTED_DELIMETERS[PERIOD] = true;
    var SUPPORTED_SEPARATOR_PATTERNS = {};
    SUPPORTED_SEPARATOR_PATTERNS[PATTERN_EVERY_THREE] = true;
    SUPPORTED_SEPARATOR_PATTERNS[PATTERN_THREE_THEN_TWO] = true;

    /**
     * Given a numeric field's meta data, construct the formatting options, setting defaults
     * where none are provided.
     *
     * @param fieldInfo a field meta data object
     * @returns a display options object
     */
    function resolveFormattingOptions(fieldInfo) {
        var opts = {};
        if (fieldInfo && fieldInfo.clientSideAttributes) {
            opts.separatorStart = fieldInfo.clientSideAttributes.separatorStart;
            opts.separatorMark = fieldInfo.clientSideAttributes.separatorMark;
            opts.separatorPattern = fieldInfo.clientSideAttributes.separatorPattern;
            opts.decimalMark = fieldInfo.clientSideAttributes.decimalMark;
        }
        opts.decimalPlaces = fieldInfo.decimalPlaces;
        if (!opts.separatorStart) {
            opts.separatorStart = DEFAULT_SEPARATOR_START;
        }
        if (!opts.separatorMark) {
            opts.separatorMark = DEFAULT_SEPARATOR_MARK;
        }
        if (!opts.separatorPattern || !SUPPORTED_SEPARATOR_PATTERNS[opts.separatorPattern]) {
            opts.separatorPattern = DEFAULT_SEPARATOR_PATTERN;
        }
        if (!opts.decimalMark || opts.decimalMark.length !== 1) {
            opts.decimalMark = DEFAULT_DECIMAL_MARK;
        }
        return opts;
    }

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
        if(inputString.length - lastPos + charsPerSubstring > 0) {
            for (var i = lastPos - charsPerSubstring; i > 0; i -= charsPerSubstring) {
                ret.unshift(inputString.substr(i, n));
            }
        }
        return ret;
    }

    /**
     * given a numeric value, rounds the value to the decimal precision specifies and returns
     * the value as a string with the number of decimal places equal to the precision value.
     * @param value the numeric value to round and stringify
     * @param precision the number of decimal places to return in the formatted string
     * @returns the rounded numeric as a string with number of decimal places equal to precision
     */
    function toRoundedDisplayDecimal(value, precision) {
        var precision = precision || 0,
            power = Math.pow(10, precision),
            absValue = Math.abs(Math.round(value * power)),
            result = (value < 0 ? DASH : '') + String(Math.floor(absValue / power));

        if (precision > 0) {
            var fraction = String(absValue % power),
                padding = new Array(Math.max(precision - fraction.length, 0) + 1).join(ZERO_CHAR);
            result += PERIOD + padding + fraction;
        }
        return result;
    }

    /**
     * Given a numeric value and an options object with display config properties set on it, this method
     * formats the numeric value as a string and returns the formatted string.
     * @param numeric A numeric value
     * @param opts display options
     * @returns the numeric value formatted as a string
     */
    function formatNumericValue(numeric, opts) {
        //Resolve the number value as a string with the proper decimal places
        var numString;
        if(!opts.decimalPlaces && opts.decimalPlaces !== 0) {
            numString = numeric.toString();
        } else {
            numString = toRoundedDisplayDecimal(numeric, opts.decimalPlaces);
        }
        //Split the string on the decimal point, if there is one
        var numParts = numString.split(PERIOD);
        var mantissaString = numParts[0];
        var characteristicString = numParts[1];
        //Format the mantissa, if its long enough to need formatting
        if (opts.separatorMark && mantissaString.length > opts.separatorStart) {
            var mantissaLength = mantissaString.length;
            //apply the separator pattern
            if (opts.separatorPattern === PATTERN_EVERY_THREE) {
                mantissaString = splitString(mantissaString, mantissaLength - 1, 3).join(opts.separatorMark);
            } else if (opts.separatorPattern === PATTERN_THREE_THEN_TWO) {
                var ret = [];
                var n = 2;
                var rightMostStart = mantissaLength - 4;
                ret.push(mantissaString.substr(rightMostStart));
                ret.unshift(splitString(mantissaString, rightMostStart - n, n));
                mantissaString = ret.join(opts.separatorMark);
            } else {
                console.log('Number separator pattern not supported in display formatting numeric values: '
                    + opts.separatorPattern);
                return numString;
            }
        }
        var returnValue = mantissaString;
        if(characteristicString) {
            returnValue = returnValue + opts.decimalMark + characteristicString;
        }
        return returnValue;
    }

    module.exports = {
        /**
         * Given a raw number as input, formats the numeric value for display.
         * @param fieldValue the field value object
         * @param fieldInfo the meta data about the field
         * @returns A formatted display string
         */
        format: function (fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }
            var opts = resolveFormattingOptions(fieldInfo);
            var formattedValue = formatNumericValue(fieldValue.value, opts);
            return formattedValue;
        }
    };
}());