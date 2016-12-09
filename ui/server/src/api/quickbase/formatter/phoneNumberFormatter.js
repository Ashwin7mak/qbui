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
                return this._addExtension(phoneNumber.nationalFormattedNumber, phoneNumber.extension);
            }

            if (phoneNumber.formattedNumber) {
                return this._addExtension(phoneNumber.formattedNumber, phoneNumber.extension);
            }

            if (phoneNumber.nationalFormattedNumber) {
                return this._addExtension(phoneNumber.nationalFormattedNumber, phoneNumber.extension);
            }

            return this._addExtension(phoneNumber.dialString, phoneNumber.extension);
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

            if (!PhoneNumberUtil.isValidNumber(GooglePhoneNumber, (countryCode || self.countryCode))) {
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
        }

        this.region = _.clone(region);
        this.countryCode = null;
        this.dialString = _.clone(phoneNumber);
        this.internationalNumber = null;
        this.formattedNumber = null;
        this.internetDialableNumber = null;

        this.first15DigitsOfNumber = BLANK_PHONE_NUMBER;
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

        this.first15Digits = PhoneNumberFormatter.stripSpecialCharacters(this.phonenumberWithoutExtension).slice(0, 15);

        try {
            attemptToParseNumberWithGoogleLibrary();
        } catch (firstTryError) {
            // Don't do anything
            try {
                attemptToParseNumberWithGoogleLibrary('+' + this.first15Digits);
            } catch (secondTryError) {
                try {
                    // Retry and default to a US number
                    attemptToParseNumberWithGoogleLibrary(this.first15Digits, DEFAULT_REGION);
                } catch (thirdTryError) {
                    if (this.first15Digits.charAt(0) !== '0') {
                        this.nationalFormattedNumber = StandardPhoneFormatter.format({value: this.dialString});
                    }
                }
            }
        }
    }

    module.exports = PhoneNumberFormatter;

}());
