(function() {
    'use strict';

    var _ = require('lodash');
    var PhoneNumberFormat = require('google-libphonenumber').PhoneNumberFormat;
    var PhoneNumberUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    var StandardPhoneFormatter = require('../../../../../common/src/formatter/phoneNumberFormatter');

    var BLANK_PHONE_NUMBER = '';
    var DEFAULT_COUNTRY_CODE = 1;
    var DEFAULT_REGION = 'US';

    var PhoneNumberFormatter = {
        QbPhoneNumber: QbPhoneNumber,

        /**
         * Parse a phone number string into a QbPhoneNumber object with additional information such as
         * the country code and locally formatted numbers.
         * @param phoneNumber
         * @param countryCode
         * @returns {QbPhoneNumber}
         */
        parse: function(phoneNumber, countryCode) {
            return new QbPhoneNumber(phoneNumber, countryCode);
        },

        format: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }

            var phoneNumber = this.parse(fieldValue.value);

            if (phoneNumber.countryCode === 1) {
                return phoneNumber.nationalFormattedNumber;
            }

            if (phoneNumber.formattedNumber) {
                return phoneNumber.formattedNumber;
            }

            if (phoneNumber.nationalFormattedNumber) {
                return phoneNumber.nationalFormattedNumber;
            }

            return phoneNumber.dialString;
        },

        _addExtension(phoneNumber, extension) {
            if (extension && extension.length > 0) {
                return phoneNumber + StandardPhoneFormatter.EXTENSION_DELIM + extension;
            } else {
                return phoneNumber;
            }
        },

        /**
         * Strips all characters considered "special" in a phone number. For now, that is anything except for integers.
         * @param phoneNumber
         */
        stripSpecialCharacters: function(phoneNumber) {
            if (!phoneNumber || phoneNumber.length === 0) {
                return phoneNumber;
            }

            return phoneNumber.replace(/[^0-9]/, '');
        },
    };

    function QbPhoneNumber(phoneNumber, region) {
        var self = this;

        function attemptToParseNumberWithGoogleLibrary(currentPhoneNumber, countryCode) {
            var GooglePhoneNumber = PhoneNumberUtil.parse((currentPhoneNumber || self.phonenumberWithoutExtension), (countryCode || self.countryCode));

            let isValidNumber = PhoneNumberUtil.isValidNumber(GooglePhoneNumber, (countryCode || self.countryCode));
            if (!isValidNumber) {
                throw 'Invalid Phone Number';
            }

            self.countryCode = GooglePhoneNumber.getCountryCode();

            if (!self.countryCode) {
                self.countryCode = DEFAULT_COUNTRY_CODE;
            }

            self.internationalNumber = PhoneNumberUtil.format(GooglePhoneNumber, PhoneNumberFormat.E164);
            self.formattedNumber = PhoneNumberUtil.format(GooglePhoneNumber, PhoneNumberFormat.INTERNATIONAL);
            self.nationalFormattedNumber = PhoneNumberUtil.format(GooglePhoneNumber, PhoneNumberFormat.NATIONAL);
            self.userFormattedNumber = PhoneNumberUtil.formatInOriginalFormat(GooglePhoneNumber, self.region);
            self.internetDialableNumber = PhoneNumberUtil.format(GooglePhoneNumber, PhoneNumberFormat.RFC3966);
            self.isDialable = isValidNumber;
        }

        this.region = _.clone(region);
        this.countryCode = null;
        this.dialString = _.clone(phoneNumber);
        this.internationalNumber = null;
        this.formattedNumber = null;
        this.internetDialableNumber = null;
        this.isDialable = false;

        this.first15Digits = BLANK_PHONE_NUMBER;
        this.first11Digits = BLANK_PHONE_NUMBER;
        this.first10Digits = BLANK_PHONE_NUMBER;
        this.extraDigits = BLANK_PHONE_NUMBER;
        this.phonenumberWithoutExtension = BLANK_PHONE_NUMBER;
        this.extension = BLANK_PHONE_NUMBER;

        // Exit with defaults if a phone number was not provided
        if (!phoneNumber || phoneNumber.length === 0) {
            return;
        }

        var splitPhoneNumber = phoneNumber.split(StandardPhoneFormatter.EXTENSION_DELIM);

        this.phonenumberWithoutExtension = splitPhoneNumber[0];
        this.extension = null;
        if (splitPhoneNumber.length > 1) {
            this.extension = splitPhoneNumber[1];
        }

        this.withoutSpecialCharacters = PhoneNumberFormatter.stripSpecialCharacters(this.phonenumberWithoutExtension);
        this.first15Digits = this.withoutSpecialCharacters.slice(0, 15);
        this.first11Digits = this.first15Digits.slice(0, 11);
        this.first10Digits = this.first15Digits.slice(0, 10);
        try {
            // Try to parse the number as is
            attemptToParseNumberWithGoogleLibrary();
        } catch (firstTryError) {
            try {
                // Attempt to parse the number with a leading plus sign to catch international numbers
                attemptToParseNumberWithGoogleLibrary('+' + this.first15Digits);
                this.extraDigits = this.withoutSpecialCharacters.slice(15);
            } catch (secondTryError) {
                try {
                    // Retry and default to a US number
                    if (this.dialString.charAt(0) === '1') {
                        attemptToParseNumberWithGoogleLibrary(this.first11Digits, DEFAULT_REGION);
                        this.extraDigits = this.withoutSpecialCharacters.slice(11);
                    } else {
                        attemptToParseNumberWithGoogleLibrary(this.first10Digits, DEFAULT_REGION);
                        this.extraDigits = this.withoutSpecialCharacters.slice(10);
                    }
                } catch (thirdTryError) {
                    // Give up on a valid number and use the standard US formatter unless the number starts with a 0.
                    // Numbers that start with 0 are likely international and shouldn't be formatted like US numbers
                    if (this.first15Digits.charAt(0) !== '0') {
                        this.nationalFormattedNumber = StandardPhoneFormatter.format({value: this.dialString});
                    }
                    // A number cannot be dialed unless we can verify it is valid and can obtain an international number from libPhoneNumber
                    this.isDialable = false;
                }
            }
        }
    }

    module.exports = PhoneNumberFormatter;

}());
