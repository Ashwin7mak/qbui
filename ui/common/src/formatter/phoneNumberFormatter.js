/*
 Given a raw phone number field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the phone number instance.
 */
(function() {
    'use strict';

    var EXTENSION_DELIM = 'x';
    var OPEN_PAREN = '(';
    var CLOSE_PAREN = ')';
    var DASH = '-';

    module.exports = {
        //Given a raw number as input, formats as a legacy QuickBase phone number. Note, not internationalized
        format: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }
            var phoneWithOutExtension = "";
            var extension;

            var extIndex = fieldValue.value.indexOf(EXTENSION_DELIM);

            // get the phone number and extension
            if (extIndex !== -1) {
                phoneWithOutExtension = fieldValue.value.substring(0, extIndex);
                extension = fieldValue.value.split(EXTENSION_DELIM)[1].trim();
            } else {
                phoneWithOutExtension = fieldValue.value;
            }

            var formattedPhoneVal = "";

            /*
             * Translating from raw to formatted phone number values work from back to front, filling out the last four, middle three, area code,
             * then any extra with formatting included in that order. The extension is appended to the formatted value if necessary according to the
             * field properties.
             *
             * the phoneWithOutExtension var carries the remaining raw values which still needs to inserted into the formatted value.
             */
            if (phoneWithOutExtension.length <= 4) {
                formattedPhoneVal = phoneWithOutExtension;
            } else {
                var lastFour = phoneWithOutExtension.substring(phoneWithOutExtension.length - 4);
                formattedPhoneVal = DASH + lastFour;

                phoneWithOutExtension = phoneWithOutExtension.substring(0, phoneWithOutExtension.length - 4);
                if (phoneWithOutExtension.length <= 3) {
                    formattedPhoneVal =  phoneWithOutExtension + formattedPhoneVal;
                } else {
                    var midThree = phoneWithOutExtension.substring(phoneWithOutExtension.length - 3, phoneWithOutExtension.length);
                    formattedPhoneVal = CLOSE_PAREN + " " + midThree + formattedPhoneVal;

                    phoneWithOutExtension = phoneWithOutExtension.substring(0, phoneWithOutExtension.length - 3);
                    if (phoneWithOutExtension.length <= 3) {
                        formattedPhoneVal = OPEN_PAREN + phoneWithOutExtension + formattedPhoneVal;
                    } else {
                        var firstThree = phoneWithOutExtension.substring(phoneWithOutExtension.length - 3, phoneWithOutExtension.length);
                        formattedPhoneVal = OPEN_PAREN + firstThree + formattedPhoneVal;
                        phoneWithOutExtension = phoneWithOutExtension.substring(0, phoneWithOutExtension.length - 3);

                        formattedPhoneVal = phoneWithOutExtension + " " + formattedPhoneVal;
                    }
                }
            }

            // fieldInfo.includeExtension appears to only be set if it is equal to false so add it and then remove it if necessary
            if (extension) {
                formattedPhoneVal = formattedPhoneVal + " " + EXTENSION_DELIM + extension;
            }
            if (fieldInfo && fieldInfo.includeExtension === false) {
                formattedPhoneVal = formattedPhoneVal.split(EXTENSION_DELIM)[0].trim();
            }
            return formattedPhoneVal;
        }
    };
}());
