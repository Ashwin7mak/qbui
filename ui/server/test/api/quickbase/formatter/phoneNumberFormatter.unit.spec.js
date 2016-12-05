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
            expectedInternationalNumber: '+15084811234',
            expectedFormattedNumber: '+1 508-481-1234',
            expectedInternetDialableNumber: 'tel:+1-508-481-1234',
            expectedPhoneNumberWithoutExtension: '+1 508 481 1234',
            expectedNationalFormattedNumber: '(508) 481-1234',
            expectedUserFormattedNumber: '(508) 481-1234',
            expectedExtension: null,
        },

        {
            description: 'correctly identifies an international number from a non-US country',
            phoneNumber: '+33-970736058',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '+33-970736058',
            expectedInternationalNumber: '+33970736058',
            expectedFormattedNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '+33-970736058',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedUserFormattedNumber: '09 70 73 60 58',
            expectedExtension: null,
        },

        {
            description: 'correctly identifies a US number (without region)',
            phoneNumber: '5084814567',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '1',
            expectedDialString: '5084814567',
            expectedInternationalNumber: '+15084814567',
            expectedFormattedNumber: '+1 508-481-4567',
            expectedInternetDialableNumber: 'tel:+1-508-481-4567',
            expectedPhoneNumberWithoutExtension: '5084814567',
            expectedNationalFormattedNumber: '(508) 481-4567',
            expectedUserFormattedNumber: '(508) 481-4567',
            expectedExtension: null,
        },

        {
            description: 'correctly identifies a US number (with region)',
            phoneNumber: '5084814567',
            region: 'US',
            expectedRegion: 'US',
            expectedCountryCode: '1',
            expectedDialString: '5084814567',
            expectedInternationalNumber: '+15084814567',
            expectedFormattedNumber: '+1 508-481-4567',
            expectedInternetDialableNumber: 'tel:+1-508-481-4567',
            expectedPhoneNumberWithoutExtension: '5084814567',
            expectedNationalFormattedNumber: '(508) 481-4567',
            expectedUserFormattedNumber: '(508) 481-4567',
            expectedExtension: null,
        },

        {
            description: 'identifies an international number without a leading plus sign',
            phoneNumber: '33-970736058',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '33-970736058',
            expectedInternationalNumber: '+33970736058',
            expectedFormattedNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '33-970736058',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedUserFormattedNumber: '09 70 73 60 58',
            expectedExtension: null,
        },

        {
            description: 'uses the standard US formatting for a number that is too long',
            phoneNumber: '5084811234567890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: null,
            expectedDialString: '5084811234567890',
            expectedInternationalNumber: null,
            expectedFormattedNumber: null,
            expectedInternetDialableNumber: null,
            expectedPhoneNumberWithoutExtension: '5084811234567890',
            // This test uses the constants because it gets its formatting from the CommonPhoneNumberFormatter. Other tests use Google Lib which does not have constants setup.
            expectedNationalFormattedNumber: `${CommonPhoneNumberFormatter.OPEN_PAREN}508${CommonPhoneNumberFormatter.CLOSE_PAREN} 481${CommonPhoneNumberFormatter.DASH}1234 567890`,
            expectedUserFormattedNumber: null,
            expectedExtension: null,
        },

        {
            description: 'uses the standard US formatting for a number that is too short',
            phoneNumber: '911',
            region: null,
            expectedRegion: null,
            expectedCountryCode: null,
            expectedDialString: '911',
            expectedInternationalNumber: null,
            expectedFormattedNumber: null,
            expectedInternetDialableNumber: null,
            expectedPhoneNumberWithoutExtension: '911',
            expectedNationalFormattedNumber: '911',
            expectedUserFormattedNumber: null,
            expectedExtension: null,
        },

        {
            description: 'does not format numbers that start with a zero and cannot be identified by Google Phone Number',
            phoneNumber: '0-800-180-0566',
            region: null,
            expectedRegion: null,
            expectedCountryCode: null,
            expectedDialString: '0-800-180-0566',
            expectedInternationalNumber: null,
            expectedFormattedNumber: null,
            expectedInternetDialableNumber: null,
            expectedPhoneNumberWithoutExtension: '0-800-180-0566',
            expectedNationalFormattedNumber: null,
            expectedUserFormattedNumber: null,
            expectedExtension: null,
        },

        // --------------- WITH EXTENSION --------------------------

        {
            description: 'correctly identifies an international number with an extension',
            phoneNumber: '+1 508 481 1234x7890',
            region: 'US',
            expectedRegion: 'US',
            expectedCountryCode: '1',
            expectedDialString: '+1 508 481 1234x7890',
            expectedInternationalNumber: '+15084811234',
            expectedFormattedNumber: '+1 508-481-1234',
            expectedInternetDialableNumber: 'tel:+1-508-481-1234',
            expectedPhoneNumberWithoutExtension: '+1 508 481 1234',
            expectedNationalFormattedNumber: '(508) 481-1234',
            expectedUserFormattedNumber: '(508) 481-1234',
            expectedExtension: '7890',
        },

        {
            description: 'correctly identifies an international number from a non-US country',
            phoneNumber: '+33-970736058x7890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '+33-970736058x7890',
            expectedInternationalNumber: '+33970736058',
            expectedFormattedNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '+33-970736058',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedUserFormattedNumber: '09 70 73 60 58',
            expectedExtension: '7890',
        },

        {
            description: 'correctly identifies a US number (without region)',
            phoneNumber: '5084814567x7890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '1',
            expectedDialString: '5084814567x7890',
            expectedInternationalNumber: '+15084814567',
            expectedFormattedNumber: '+1 508-481-4567',
            expectedInternetDialableNumber: 'tel:+1-508-481-4567',
            expectedPhoneNumberWithoutExtension: '5084814567',
            expectedNationalFormattedNumber: '(508) 481-4567',
            expectedUserFormattedNumber: '(508) 481-4567',
            expectedExtension: '7890',
        },

        {
            description: 'correctly identifies a US number (with region)',
            phoneNumber: '5084814567x7890',
            region: 'US',
            expectedRegion: 'US',
            expectedCountryCode: '1',
            expectedDialString: '5084814567x7890',
            expectedInternationalNumber: '+15084814567',
            expectedFormattedNumber: '+1 508-481-4567',
            expectedInternetDialableNumber: 'tel:+1-508-481-4567',
            expectedPhoneNumberWithoutExtension: '5084814567',
            expectedNationalFormattedNumber: '(508) 481-4567',
            expectedUserFormattedNumber: '(508) 481-4567',
            expectedExtension: '7890',
        },

        {
            description: 'identifies an international number without a leading plus sign',
            phoneNumber: '33-970736058x7890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: '33',
            expectedDialString: '33-970736058x7890',
            expectedInternationalNumber: '+33970736058',
            expectedFormattedNumber: '+33 9 70 73 60 58',
            expectedInternetDialableNumber: 'tel:+33-9-70-73-60-58',
            expectedPhoneNumberWithoutExtension: '33-970736058',
            expectedNationalFormattedNumber: '09 70 73 60 58',
            expectedUserFormattedNumber: '09 70 73 60 58',
            expectedExtension: '7890',
        },

        {
            description: 'does not format numbers that start with a zero (and have an extension) and cannot be identified by Google Phone Number',
            phoneNumber: '0-800-180-0566x7890',
            region: null,
            expectedRegion: null,
            expectedCountryCode: null,
            expectedDialString: '0-800-180-0566x7890',
            expectedInternationalNumber: null,
            expectedFormattedNumber: null,
            expectedInternetDialableNumber: null,
            expectedPhoneNumberWithoutExtension: '0-800-180-0566',
            expectedNationalFormattedNumber: null,
            expectedUserFormattedNumber: null,
            expectedExtension: '7890',
        },

    ];

    phoneNumberTestCases.forEach((testCase) => {
        it(testCase.description, () => {
            var phoneNumber = new PhoneNumberFormatter.QbPhoneNumber(testCase.phoneNumber, testCase.region);

            assert.equal(phoneNumber.region, testCase.expectedRegion, 'Regions are not equal');
            assert.equal(phoneNumber.countryCode, testCase.expectedCountryCode, 'Country codes is not equal');
            assert.equal(phoneNumber.dialString, testCase.expectedDialString, 'Dial String is not equal');
            assert.equal(phoneNumber.internationalNumber, testCase.expectedInternationalNumber, 'International number is not equal');
            assert.equal(phoneNumber.formattedNumber, testCase.expectedFormattedNumber, 'Formatted number is not equal');
            assert.equal(phoneNumber.extension, testCase.expectedExtension, 'Extension is not equal');
            assert.equal(phoneNumber.phonenumberWithoutExtension, testCase.expectedPhoneNumberWithoutExtension, 'Phone number without extension is not equal');
            assert.equal(phoneNumber.internetDialableNumber, testCase.expectedInternetDialableNumber, 'Internet dialable number is not equal');
            assert.equal(phoneNumber.nationalFormattedNumber, testCase.expectedNationalFormattedNumber, 'National phone number is not equal');
            assert.equal(phoneNumber.userFormattedNumber, testCase.expectedUserFormattedNumber, 'User formatted number is not equal');
        });
    });
});
