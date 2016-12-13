var assert = require('assert');
var PhoneNumberFormatter = require('../../../../src/api/quickbase/formatter/phoneNumberFormatter');
var CommonPhoneNumberFormatter = require('../../../../../common/src/formatter/phoneNumberFormatter');

// national format for anything with US region/code
// starting with a zero, we will not apply any formatting
// formatted number for recognized international numbers

describe.only('PhoneNumberFormatter (server side)', () => {
    var phoneNumberTestCases = [
        {
            description: 'correctly identifies an international number',
            phoneNumber: '+1 508 481 1234',
            region: 'US',
            expectedRegion: 'US',
            expectedCountryCode: '1',
            expectedDialString: '+1 508 481 1234',
            expectedE164FormattedNumber: '+15084811234',
            expectedInternationalNumber: '+1 508-481-1234',
            expectedInternetDialableNumber: 'tel:+1-508-481-1234',
            expectedPhoneNumberWithoutExtension: '+1 508 481 1234',
            expectedNationalFormattedNumber: '(508) 481-1234',
            expectedExtension: null,
            expectedExtraDigits: null
        },

        {
            description: 'correctly identifies an international number from a non-US country',
            phoneNumber: '+33-970736058',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '+33-970736058',
            expectedE164FormattedNumber: '+33970736058',
            expectedInternationalNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '+33-970736058',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedExtension: null,
            expectedExtraDigits: null
        },

        {
            description: 'correctly identifies an international number from a non-US country that has extra digits at the end',
            phoneNumber: '+33-970736058 777777777777',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '+33-970736058 777777777777',
            expectedE164FormattedNumber: '+33970736058',
            expectedInternationalNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '+33-970736058 777777777777',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedExtension: null,
            expectedExtraDigits: '777777777777'
        },

        {
            description: 'correctly identifies a US number (without region)',
            phoneNumber: '5084814567',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '1',
            expectedDialString: '5084814567',
            expectedE164FormattedNumber: '+15084814567',
            expectedInternationalNumber: '+1 508-481-4567',
            expectedInternetDialableNumber: 'tel:+1-508-481-4567',
            expectedPhoneNumberWithoutExtension: '5084814567',
            expectedNationalFormattedNumber: '(508) 481-4567',
            expectedExtension: null,
            expectedExtraDigits: null
        },

        {
            description: 'correctly identifies a US number (with region)',
            phoneNumber: '5084814567',
            region: 'US',
            expectedRegion: 'US',
            expectedCountryCode: '1',
            expectedDialString: '5084814567',
            expectedE164FormattedNumber: '+15084814567',
            expectedInternationalNumber: '+1 508-481-4567',
            expectedInternetDialableNumber: 'tel:+1-508-481-4567',
            expectedPhoneNumberWithoutExtension: '5084814567',
            expectedNationalFormattedNumber: '(508) 481-4567',
            expectedExtension: null,
            expectedExtraDigits: null
        },

        {
            description: 'identifies an international number without a leading plus sign',
            phoneNumber: '33-970736058',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '33-970736058',
            expectedE164FormattedNumber: '+33970736058',
            expectedInternationalNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '33-970736058',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedExtension: null,
            expectedExtraDigits: null
        },

        {
            description: 'uses the standard US formatting for a number that is too long',
            phoneNumber: '5084811234567890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: 1,
            expectedDialString: '5084811234567890',
            expectedE164FormattedNumber: '+15084811234',
            expectedInternationalNumber: '+1 508-481-1234',
            expectedInternetDialableNumber: 'tel:+1-508-481-1234',
            expectedPhoneNumberWithoutExtension: '5084811234567890',
            // This test uses the constants because it gets its formatting from the CommonPhoneNumberFormatter. Other tests use Google Lib which does not have constants setup.
            expectedNationalFormattedNumber: `${CommonPhoneNumberFormatter.OPEN_PAREN}508${CommonPhoneNumberFormatter.CLOSE_PAREN} 481${CommonPhoneNumberFormatter.DASH}1234`,
            expectedExtension: null,
            expectedExtraDigits: '567890'
        },

        {
            description: 'uses the standard US formatting for a number that is too short',
            phoneNumber: '911',
            region: null,
            expectedRegion: 'US',
            expectedCountryCode: 1,
            expectedDialString: '911',
            expectedE164FormattedNumber: null,
            expectedInternationalNumber: null,
            expectedInternetDialableNumber: null,
            expectedPhoneNumberWithoutExtension: '911',
            expectedNationalFormattedNumber: '911',
            expectedExtension: null,
            expectedExtraDigits: null
        },

        {
            description: 'does not format numbers that start with a zero and cannot be identified by Google Phone Number',
            phoneNumber: '0-800-180-0566',
            region: null,
            expectedRegion: null,
            expectedCountryCode: null,
            expectedDialString: '0-800-180-0566',
            expectedE164FormattedNumber: null,
            expectedInternationalNumber: null,
            expectedInternetDialableNumber: null,
            expectedPhoneNumberWithoutExtension: '0-800-180-0566',
            expectedNationalFormattedNumber: null,
            expectedExtension: null,
            expectedExtraDigits: null
        },

        // --------------- WITH EXTENSION --------------------------

        {
            description: 'correctly identifies an international number with an extension',
            phoneNumber: '+1 508 481 1234x7890',
            region: 'US',
            expectedRegion: 'US',
            expectedCountryCode: '1',
            expectedDialString: '+1 508 481 1234x7890',
            expectedE164FormattedNumber: '+15084811234',
            expectedInternationalNumber: '+1 508-481-1234',
            expectedInternetDialableNumber: 'tel:+1-508-481-1234',
            expectedPhoneNumberWithoutExtension: '+1 508 481 1234',
            expectedNationalFormattedNumber: '(508) 481-1234',
            expectedExtension: '7890',
            expectedExtraDigits: null
        },

        {
            description: 'correctly identifies an international number from a non-US country with an extension',
            phoneNumber: '+33-970736058x7890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '+33-970736058x7890',
            expectedE164FormattedNumber: '+33970736058',
            expectedInternationalNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '+33-970736058',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedExtension: '7890',
            expectedExtraDigits: null
        },

        {
            description: 'correctly identifies an international number from a non-US country that has extra digits at the end with an extension',
            phoneNumber: '+33-970736058 777777777777 x 9890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '+33-970736058 777777777777 x 9890',
            expectedE164FormattedNumber: '+33970736058',
            expectedInternationalNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '+33-970736058 777777777777',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedExtension: '9890',
            expectedExtraDigits: '777777777777'
        },

        {
            description: 'correctly identifies a US number (without region) with an extension',
            phoneNumber: '5084814567x7890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '1',
            expectedDialString: '5084814567x7890',
            expectedE164FormattedNumber: '+15084814567',
            expectedInternationalNumber: '+1 508-481-4567',
            expectedInternetDialableNumber: 'tel:+1-508-481-4567',
            expectedPhoneNumberWithoutExtension: '5084814567',
            expectedNationalFormattedNumber: '(508) 481-4567',
            expectedExtension: '7890',
            expectedExtraDigits: null
        },

        {
            description: 'correctly identifies a US number (with region) with an extension',
            phoneNumber: '5084814567x7890',
            region: 'US',
            expectedRegion: 'US',
            expectedCountryCode: '1',
            expectedDialString: '5084814567x7890',
            expectedE164FormattedNumber: '+15084814567',
            expectedInternationalNumber: '+1 508-481-4567',
            expectedInternetDialableNumber: 'tel:+1-508-481-4567',
            expectedPhoneNumberWithoutExtension: '5084814567',
            expectedNationalFormattedNumber: '(508) 481-4567',
            expectedExtension: '7890',
            expectedExtraDigits: null
        },

        {
            description: 'identifies an international number without a leading plus sign with an extension',
            phoneNumber: '33-970736058x7890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '33-970736058x7890',
            expectedE164FormattedNumber: '+33970736058',
            expectedInternationalNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '33-970736058',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedExtension: '7890',
            expectedExtraDigits: null
        },

        {
            description: 'does not format numbers that start with a zero (and have an extension) and cannot be identified by Google Phone Number',
            phoneNumber: '0-800-180-0566x7890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: null,
            expectedDialString: '0-800-180-0566x7890',
            expectedE164FormattedNumber: null,
            expectedInternationalNumber: null,
            expectedInternetDialableNumber: null,
            expectedPhoneNumberWithoutExtension: '0-800-180-0566',
            expectedNationalFormattedNumber: null,
            expectedExtension: '7890',
            expectedExtraDigits: null
        },

    ];

    function buildCustomMessage(message, actual, expected) {
        return message + ' Actual: ' + actual + ' | Expected: ' + expected;
    }

    phoneNumberTestCases.forEach((testCase) => {
        it(testCase.description, () => {
            var phoneNumber = new PhoneNumberFormatter.QbPhoneNumber(testCase.phoneNumber, testCase.region);

            assert.equal(phoneNumber.region, testCase.expectedRegion, buildCustomMessage('Regions are not equal.', phoneNumber.region, testCase.expectedRegion));
            assert.equal(phoneNumber.countryCode, testCase.expectedCountryCode, buildCustomMessage('Country codes is not equal', phoneNumber.countryCode, testCase.expectedCountryCode));
            assert.equal(phoneNumber.dialString, testCase.expectedDialString, buildCustomMessage('Dial String is not equal', phoneNumber.dialString, testCase.expectedDialString));
            assert.equal(phoneNumber.e164FormattedNumber, testCase.expectedE164FormattedNumber, buildCustomMessage('International number is not equal', phoneNumber.e164FormattedNumber, testCase.expectedE164FormattedNumber));
            assert.equal(phoneNumber.internationalNumber, testCase.expectedInternationalNumber, buildCustomMessage('Formatted number is not equal', phoneNumber.internationalNumber, testCase.expectedInternationalNumber));
            assert.equal(phoneNumber.extension, testCase.expectedExtension, buildCustomMessage('Extension is not equal', phoneNumber.extension, testCase.expectedExtension));
            assert.equal(phoneNumber.extraDigits, testCase.expectedExtraDigits, buildCustomMessage('Extra digits are not equal', phoneNumber.extraDigits, testCase.expectedExtraDigits));
            assert.equal(phoneNumber.phonenumberWithoutExtension, testCase.expectedPhoneNumberWithoutExtension, buildCustomMessage('Phone number without extension is not equal', phoneNumber.phonenumberWithoutExtension, testCase.expectedPhoneNumberWithoutExtension));
            assert.equal(phoneNumber.internetDialableNumber, testCase.expectedInternetDialableNumber, buildCustomMessage('Internet dialable number is not equal', phoneNumber.internetDialableNumber, testCase.expectedInternetDialableNumber));
            assert.equal(phoneNumber.nationalFormattedNumber, testCase.expectedNationalFormattedNumber, buildCustomMessage('National phone number is not equal', phoneNumber.nationalFormattedNumber, testCase.expectedNationalFormattedNumber));
        });
    });
});
