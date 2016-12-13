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

        formatAndReturnDisplayObject: function(fieldValue, fieldInfo) {
            var phoneNumber = PhoneNumberFormatter.parse(fieldValue.value);

            return {
                display: PhoneNumberFormatter.format(fieldValue, fieldInfo),
                countryCode: phoneNumber.countryCode,
                isDialable: phoneNumber.isDialable,
                internetDialableNumber: phoneNumber.internetDialableNumber,
                internationalNumber: phoneNumber.internationalNumber,
                extraDigits: phoneNumber.extraDigits,
                extension: phoneNumber.extension
            };
        },

        /**
         * Attempt to parse the phone number and produce a formatted phone number. If not possible, returns the user entered value.
         * @param fieldValue
         * @param fieldInfo
         * @returns {*}
         */
        format: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }

            var phoneNumber = this.parse(fieldValue.value);

            // Currently we only localize the format of US numbers because we don't have enough information about user preferences
            // Once we can persist the country code with the number and we know the user's location, we can nationally format other
            // numbers as well.
            if (phoneNumber.countryCode === 1) {
                return phoneNumber.nationalFormattedNumber;
            }

            // When it is a non-use number and we can recognize the country then we can apply generic international formatting to a number
            if (phoneNumber.internationalNumber) {
                return phoneNumber.internationalNumber;
            }

            // Return the user entered string without formatting if other attempts to format have failed
            return phoneNumber.dialString;
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
    };

    function QbPhoneNumber(phoneNumber, region) {
        var self = this;
        this.reset = reset;

        // First set all the default values
        reset();

        // Exit with defaults if a phone number was not provided
        if (!phoneNumber || phoneNumber.length === 0) {
            return;
        }

        splitOutExtension();
        getValidPhoneNumberLengths();
        getPossibleFormatsForCurrentNumber();

        // Keep extra digits as null if it is empty for easier detection of numbers with extensions
        if (!this.extraDigits || this.extraDigits.length === 0) {
            this.extraDigits = null;
        }

        // ---- SUPPORTING PRIVATE FUNCTIONS FOR QbPhoneNumber ---

        /**
         * Reset properties to the defaults for QbPhoneNumber
         */
        function reset() {
            self.region = _.clone(region);
            self.countryCode = null;
            self.dialString = _.clone(phoneNumber);
            self.e164FormattedNumber = null;
            self.internationalNumber = null;
            self.internetDialableNumber = null;
            self.isDialable = false;
            self.isValid = false;

            self.withoutSpecialCharacters = BLANK_PHONE_NUMBER;
            self.first15Digits = BLANK_PHONE_NUMBER;
            self.first11Digits = BLANK_PHONE_NUMBER;
            self.first10Digits = BLANK_PHONE_NUMBER;
            self.phonenumberWithoutExtension = BLANK_PHONE_NUMBER;
            self.extraDigits = null;
            self.extension = null;
        }

        /**
         * Split the main number from the extension and set to separate properties
         */
        function splitOutExtension() {
            var splitPhoneNumber = phoneNumber.split(new RegExp(`\\s*${StandardPhoneFormatter.EXTENSION_DELIM}\\s*`, 'g'));
            self.phonenumberWithoutExtension = splitPhoneNumber[0];
            if (splitPhoneNumber.length > 1 && splitPhoneNumber[1] && splitPhoneNumber[1].length > 0) {
                self.extension = PhoneNumberFormatter.stripSpecialCharacters(splitPhoneNumber[1]);
            }
        }

        function getValidPhoneNumberLengths() {
            self.withoutSpecialCharacters = PhoneNumberFormatter.stripSpecialCharacters(self.phonenumberWithoutExtension);
            self.first15Digits = self.withoutSpecialCharacters.slice(0, 15);
            self.first11Digits = self.withoutSpecialCharacters.slice(0, 11);
            self.first10Digits = self.withoutSpecialCharacters.slice(0, 10);
        }

        /**
         * Attempt to identify a valid phone number using Google LibPhoneNumber
         * This function will throw an error if the number is not valid (either during parse or when checking for a valid number)
         * @param currentPhoneNumber
         * @param countryCode
         */
        function attemptToParseNumberWithGoogleLibrary(currentPhoneNumber, currentRegion) {
            if (!currentPhoneNumber) {
                currentPhoneNumber = self.withoutSpecialCharacters;
            }
            var currentPhoneNumberLength = currentPhoneNumber.length;

            var googlePhoneNumber;
            var isValidNumber = false;
            do {
                try {
                    // Splice doesn't include the last number so we need to add one to the length
                    googlePhoneNumber = PhoneNumberUtil.parse((currentPhoneNumber.slice(0, currentPhoneNumberLength + 1)), (currentRegion || self.region));
                    isValidNumber = PhoneNumberUtil.isValidNumber(googlePhoneNumber, (region || self.region));
                    if (!isValidNumber) {
                        currentPhoneNumberLength = currentPhoneNumberLength - 1;
                    } else {
                        break;
                    }
                // Catch errors thrown by Google LibPhone number parse and isValidNumber methods
                // and try again with a shorter number in case there are extra digits at the end
                } catch (invalidNumber) {
                    // Break out of the loop if there is an invalid country calling code because
                    // shortening the number will not fix that problem.
                    if (invalidNumber.message === 'Invalid country calling code') {
                        break;
                    }
                    currentPhoneNumberLength = currentPhoneNumberLength - 1;
                }
            } while (currentPhoneNumberLength > 6);

            if (isValidNumber) {
                setFormats(googlePhoneNumber, isValidNumber);
            }
        }

        function setFormats(googlePhoneNumber, isValidNumber) {
            self.countryCode = googlePhoneNumber.getCountryCode();

            if (!self.countryCode) {
                self.region = DEFAULT_REGION;
                self.countryCode = DEFAULT_COUNTRY_CODE;
            }

            // When the number is valid, we can get the different formats required to effectively display a phone number
            self.e164FormattedNumber = PhoneNumberUtil.format(googlePhoneNumber, PhoneNumberFormat.E164);
            self.internationalNumber = PhoneNumberUtil.format(googlePhoneNumber, PhoneNumberFormat.INTERNATIONAL);
            self.nationalFormattedNumber = PhoneNumberUtil.format(googlePhoneNumber, PhoneNumberFormat.NATIONAL);
            self.internetDialableNumber = PhoneNumberUtil.format(googlePhoneNumber, PhoneNumberFormat.RFC3966);
            self.isDialable = isValidNumber;
        }

        function findExtraDigits(formattedNumber) {
            var lengthOfNumberWithoutSpecialCharacters = PhoneNumberFormatter.stripSpecialCharacters(formattedNumber).length;
            return self.withoutSpecialCharacters.slice(lengthOfNumberWithoutSpecialCharacters);
        }

        function attemptToParseNumberAssumingInternationalFormat() {
            // Attempt to parse the number with a leading plus sign to catch international numbers
            // Only use the first 15 digits because international numbers cannot be more than 15 digits
            attemptToParseNumberWithGoogleLibrary('+' + self.first15Digits);
            if (self.isDialable) {
                self.extraDigits = findExtraDigits(self.internationalNumber);
            }
        }

        function attemptToParseNumberAssumingUsFormat() {
            // var phoneNumberCurrent = PhoneNumberUtil.extractPossibleNumber(this.withoutSpecialCharacters);
            // attemptToParseNumberWithGoogleLibrary(PhoneNumberUtil.extractPossibleNumber(this.withoutSpecialCharacters));
            // Retry and default to a US number
            if (self.dialString.charAt(0) === '1') {
                attemptToParseNumberWithGoogleLibrary(self.first11Digits, DEFAULT_REGION);
                if (self.isDialable) {
                    self.extraDigits = self.withoutSpecialCharacters.slice(11);
                }
            } else {
                attemptToParseNumberWithGoogleLibrary(self.first10Digits, DEFAULT_REGION);
                if (self.isDialable) {
                    self.extraDigits = self.withoutSpecialCharacters.slice(10);
                }
            }
        }

        function parseAsUndialableNumberWithStandardUsFormatting() {
            // Give up on a valid number and use the standard US formatter unless the number starts with a 0.
            // Numbers that start with 0 are likely international and shouldn't be formatted like US numbers
            if (self.first15Digits.charAt(0) !== '0') {
                self.nationalFormattedNumber = StandardPhoneFormatter.format({value: self.dialString});
                self.countryCode = DEFAULT_COUNTRY_CODE;
                self.region = DEFAULT_REGION;
            }
            // A number cannot be dialed unless we can verify it is valid and can obtain an internet dialable number from libPhoneNumber
            self.isDialable = false;
        }

        function getPossibleFormatsForCurrentNumber() {
            attemptToParseNumberWithGoogleLibrary();

            if (!self.isDialable) {
                attemptToParseNumberAssumingInternationalFormat();
            }

            if (!self.isDialable) {
                attemptToParseNumberAssumingUsFormat();
            }

            if (!self.isDialable) {
                parseAsUndialableNumberWithStandardUsFormatting();
            }
        }
    }

    module.exports = PhoneNumberFormatter;

}());
