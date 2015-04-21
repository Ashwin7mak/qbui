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
    var PATTERN_THREE_THEN_TWO = 'THREE_THEN_TWO';
    //Defaults & supported values
    var DEFAULT_SEPARATOR_START = 3;
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
        if(precision === 0) {
            return null;
        } else if(!precision) {
            return characteristicString;
        } else if(characteristicString === null){
            characteristicString = '';
        }
        if(characteristicString.length > precision) {
            //round
            var charNum = Number(characteristicString);
            charNum = Math.round(charNum / (Math.pow(10, characteristicString.length - precision)));
            characteristicString = charNum.toString();
        }
        //Pad if needed to fill out the precision
        if(characteristicString.length < precision) {
            while(characteristicString.length < precision) {
                characteristicString = characteristicString + ZERO_CHAR;
            }
        }
        return characteristicString;
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
        var numString = numeric.toString();
        //Split the string on the decimal point, if there is one
        var numParts = numString.toString().split(PERIOD);
        var mantissaString = numParts[0];
        var characteristicString = null;
        if(numParts.length > 1) {
            characteristicString = numParts[1];
        }
        characteristicString = toRoundedDisplayDecimal(characteristicString, opts.decimalPlaces);
        //Format the mantissa, if its long enough to need formatting
        if (opts.separatorMark && mantissaString.length > opts.separatorStart) {
            var mantissaLength = mantissaString.length;
            //apply the separator pattern
            if (opts.separatorPattern === PATTERN_EVERY_THREE) {
                mantissaString = splitString(mantissaString, mantissaLength, 3).join(opts.separatorMark);
            } else if (opts.separatorPattern === PATTERN_THREE_THEN_TWO) {
                var rightMostStart = mantissaLength - 3;
                var ret = splitString(mantissaString, rightMostStart, 2);
                ret.push(mantissaString.substr(rightMostStart));
                mantissaString = ret.join(opts.separatorMark);
            }
        }
        var returnValue = mantissaString;
        if (characteristicString) {
            returnValue = returnValue + opts.decimalMark + characteristicString;
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
        generateFormat: function (fieldInfo) {
            var opts = {};
            if (fieldInfo && fieldInfo.clientSideAttributes) {
                opts.separatorStart = fieldInfo.clientSideAttributes.separator_start;
                opts.separatorMark = fieldInfo.clientSideAttributes.separator_mark;
                opts.separatorPattern = fieldInfo.clientSideAttributes.separator_pattern;
                opts.decimalMark = fieldInfo.clientSideAttributes.decimal_mark;
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
            return opts;
        },
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
            var opts = fieldInfo.jsFormat;
            if (!opts) {
                opts = this.generateFormat(fieldInfo);
            }
            var formattedValue = formatNumericValue(fieldValue.value, opts);
            return formattedValue;
        }
    };
}());