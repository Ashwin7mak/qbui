/*
 Given a raw phone number field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the phone number instance.
 */
(function() {
    'use strict';
    var _ = require('lodash');

    var EXTENSION_DELIM = 'x';
    var OPEN_PAREN = '(';
    var CLOSE_PAREN = ')';
    var DASH = '-';
    var INTERNATIONAL_SYMBOL = '+';

    var US_SEVEN_DIGIT_FORMAT = "$1" + DASH + "$2";
    var US_TEN_DIGIT_FORMAT = OPEN_PAREN + "$1" + CLOSE_PAREN + " $2" + DASH + "$3";
    var BASIC_INTERNATIONAL_FORMAT = INTERNATIONAL_SYMBOL + "$1 $2 $3 $4 $5 $6 $7";

    var ALLOWED_CHARACTERS_ONCHANGE = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'x', '(', ')', '+', '-', '.', ' '];
    var ALLOWED_CHARACTERS_ONBLUR = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'x', '+'];

    // Basic phone number formatting for client side. More complex formatting occurs on the server side in
    // server/src/api/quickbase/formatter/phoneNumberFormatter
    module.exports = {
        // Export these constants so the same one can be used in tests
        EXTENSION_DELIM: EXTENSION_DELIM,
        OPEN_PAREN: OPEN_PAREN,
        CLOSE_PAREN: CLOSE_PAREN,
        DASH: DASH,
        INTERNATIONAL_SYMBOL: INTERNATIONAL_SYMBOL,

        /**
         * Separates the phone number and the extension if possible
         * It is greedy about spaces around the extension delimiter
         * @param phoneNumber
         * @returns {*}
         */
        splitPhoneNumberAndExtension: function(phoneNumber) {
            if (!phoneNumber || !_.isString(phoneNumber)) {
                return {getPhoneNumber: '', getExtension: ''};
            }

            // don't look for spaces before the delimiter so that a user can enter spaces between numbers. Extra spaces will be trimmed later.
            var splitNumber = phoneNumber.split(new RegExp(EXTENSION_DELIM + '\\s*', 'g'));
            return {
                getPhoneNumber: splitNumber[0],
                getExtension: (splitNumber.length > 1 ? splitNumber[1] : '')
            };
        },

        /**
         * Get an extension from a phone number string or a phone number display object
         * @param phoneNumber
         * @returns {*}
         */
        getExtension: function(phoneNumber) {
            if (!phoneNumber) {
                return '';
            }

            if (_.isString(phoneNumber)) {
                return this.splitPhoneNumberAndExtension(phoneNumber).getExtension;
            }

            // prefer the extension in the display string as it is likely the most up to date
            if (phoneNumber.display && phoneNumber.display.indexOf('x') >= 0) {
                return this.splitPhoneNumberAndExtension(phoneNumber.display).getExtension;
            }

            if (_.has(phoneNumber, 'extension') && phoneNumber.extension !== null) {
                return phoneNumber.extension;
            }

            return '';
        },

        getPhoneNumber: function(phoneNumber) {
            if (!phoneNumber) {
                return '';
            }
            return this.splitPhoneNumberAndExtension(phoneNumber).getPhoneNumber;
        },

        getUpdatedPhoneNumberWithExt: function(phoneNum, extNum) {
            if (!extNum) {
                return phoneNum.trim();
            }
            return phoneNum.trim() + EXTENSION_DELIM + extNum.trim();
        },

        onChangeMasking: function(nums) {
            /**
             * onChangeMasking only allows user to type the allowed characters in the ALLOWED_CHARACTERS_ONCHANGE array.
             * A user will be unable to type any characters that are not allowed into the input box
             * */
            return nums.split('')
                .filter(function(num) {return ALLOWED_CHARACTERS_ONCHANGE.indexOf(num) > -1;})
                .join('');
        },

        onBlurMasking: function(nums) {
            /**
             * onBlurMasking removes all special characters. It modifies the value to be a string of numbers with or without an ext
             * */
            if (!nums) {
                return '';
            }
            return nums.split('')
                .filter(function(num) {return ALLOWED_CHARACTERS_ONBLUR.indexOf(num) > -1;})
                .join('');
        },

        /**
         * Strips all characters considered "special" in a phone number. For now, that is anything except for integers.
         * @param phoneNumber
         */
        stripSpecialCharacters: function(phoneNumber) {
            if (!phoneNumber || phoneNumber.length === 0) {
                return '';
            }

            return phoneNumber.replace(/[^0-9]/g, '');
        },

        stripSpecialCharactersExceptExtension: function(phoneNumber) {
            if (!phoneNumber || phoneNumber.length === 0) {
                return '';
            }

            var splitNumber = this.splitPhoneNumberAndExtension(phoneNumber);

            var phoneWithoutSpecialCharacters = this.stripSpecialCharacters(splitNumber.getPhoneNumber);
            if (splitNumber.getExtension && splitNumber.getExtension.length > 0) {
                phoneWithoutSpecialCharacters = phoneWithoutSpecialCharacters + 'x' + this.stripSpecialCharacters(splitNumber.getExtension);
            }

            return phoneWithoutSpecialCharacters;
        },

        format: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }

            var value = fieldValue.value;

            // If it looks like it might be an international number, don't format it as a US number
            // Additional, more advanced formatting will happen after save
            if (value.indexOf(INTERNATIONAL_SYMBOL) === 0) {
                return this.formatAsBasicInternationalNumber(fieldValue, fieldInfo);
            } else {
                return this.formatAsBasicUsNumber(fieldValue, fieldInfo);
            }
        },

        formatAsBasicUsNumber: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }

            // get the phone number and extension
            var phoneWithOutExtension = this.splitPhoneNumberAndExtension(fieldValue.value).getPhoneNumber.trim();
            var extension = this.splitPhoneNumberAndExtension(fieldValue.value).getExtension.trim();

            var formattedPhoneVal = "";

            /*
             * Translating from raw to formatted phone number values work from front to back, filling out the first 3, second 3, last 4, followed by and remaining digits
             * The extension is appended to the formatted value if necessary according to the field properties.
             *
             * the phoneWithOutExtension var carries the remaining raw values which still needs to inserted into the formatted value.
             */
            var phoneWithOutExtensionLength = phoneWithOutExtension.length;
            if (phoneWithOutExtensionLength <= 4) {
                formattedPhoneVal = phoneWithOutExtension;
            } else if (phoneWithOutExtensionLength <= 7) {
                formattedPhoneVal = phoneWithOutExtension.replace(/^(\d{0,3})(\d{4})/, US_SEVEN_DIGIT_FORMAT);
            } else if (phoneWithOutExtensionLength <= 10) {
                formattedPhoneVal = phoneWithOutExtension.replace(/^(\d{0,3})(\d{3})(\d{4})/, US_TEN_DIGIT_FORMAT);
            } else {
                // Cannot use shorthand here because of some conditional spaces
                var matches = phoneWithOutExtension.match(/^(1?)(\d{0,3})(\d{3})(\d{4})(.*)/);
                formattedPhoneVal = OPEN_PAREN + matches[2] + CLOSE_PAREN + " " + matches[3] + DASH + matches[4];
                if (matches[1] && matches[1].length > 0) {
                    formattedPhoneVal = matches[1] + " " + formattedPhoneVal;
                }
                if (matches[5] && matches[5].length > 0) {
                    formattedPhoneVal += " " + matches[5];
                }
            }

            return this._addExtension(formattedPhoneVal, extension, fieldInfo);
        },

        formatAsBasicInternationalNumber: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }

            var splitPhoneNumber = this.splitPhoneNumberAndExtension(fieldValue.value);
            var phoneWithoutExtension = splitPhoneNumber.getPhoneNumber.trim();
            phoneWithoutExtension = this.stripSpecialCharacters(phoneWithoutExtension);
            var extension = splitPhoneNumber.getExtension.trim();

            var formattedPhoneVal;
            // Format international numbers that start with a 1 as a US format (this does not cover all international cases
            // but is a best guess until we can access Google Libphonenumber on the server
            if (phoneWithoutExtension.charAt(0) === '1') {
                return this.format(fieldValue, fieldInfo);
            } else {
                formattedPhoneVal = phoneWithoutExtension.replace(/^(\d{2})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})(\d*)/, BASIC_INTERNATIONAL_FORMAT);
            }

            return this._addExtension(formattedPhoneVal, extension, fieldInfo);
        },

        _addExtension: function(phoneNumber, extension, fieldInfo) {
            // Heads up: fieldInfo.includeExtension appears to only be set if it is equal to false
            if ((fieldInfo && fieldInfo.includeExtension === false) || !extension) {
                return this.splitPhoneNumberAndExtension(phoneNumber).getPhoneNumber.trim();
            }

            return phoneNumber.trim() + " " + EXTENSION_DELIM + extension.trim();
        }
    };
}());
