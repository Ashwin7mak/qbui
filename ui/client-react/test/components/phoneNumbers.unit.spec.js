/**
 * A few unit tests to help outline possible functionality of the PhoneNumber field.
 * These are not extensive, but rather a start.
 */

var assert = require('assert');
var PhoneNumberFormatterV3 = require('../src/formatter/phoneNumberFormatterV3');

describe('PhoneNumberFormatterV3', () => {
    describe('Testing Migration Phone Numbers', () => {
        var testCases = [
            {
                name: 'autodetects region and country code from an international number [E.164] (US)',
                phoneNumber: '+1 123-456-7890',
                region: null,
                expectedCountryCode: '1',
                expectedFormattedNumber: '(123) 456-7890',
                expectedInternationalNumber: '+11234567890'
            },
            {
                name: 'autodetects region and country code from an international number [E.164] (DE)',
                phoneNumber: '+49 30 123456',
                region: null,
                expectedCountryCode: '49',
                expectedFormattedNumber: '030 123456',
                expectedInternationalNumber: '+4930123456'
            },
            {
                name: 'autodetects region and country code from an international number [E.164] (FR)',
                phoneNumber: '+33 1 23 45 67 89',
                region: null,
                expectedCountryCode: '33',
                expectedFormattedNumber: '01 23 45 67 89',
                expectedInternationalNumber: '+33123456789'
            },
            {
                name: 'autodetects region and country code from an international number [E.164] (GB)',
                phoneNumber: '+44 121 234 5678',
                region: null,
                expectedCountryCode: '44',
                expectedFormattedNumber: '0121 234 5678',
                expectedInternationalNumber: '+441212345678'
            },
            {
                name: 'obtains a country code and correct formatting if a region is provided',
                phoneNumber: '555-123-4567',
                region: 'US',
                expectedCountryCode: '1',
                expectedFormattedNumber: '(555) 123-4567',
                expectedInternationalNumber: '+15551234567'
            },
            {
                name: 'formats US numbers without an area code',
                phoneNumber: '1234567',
                region: 'US',
                expectedCountryCode: '1',
                expectedFormattedNumber: '123-4567',
                expectedInternationalNumber: null
            },
            {
                name: 'assumes a US phone number if a region is not specified or cannot be detected',
                phoneNumber: '1234567',
                region: null,
                expectedCountryCode: '1',
                expectedFormattedNumber: '123-4567',
                expectedInternationalNumber: null
            },
            {
                name: 'obtains international number and formatting from a local dial string with the region calling from specified (e.g., calling UK from Germany has a region of DE)',
                phoneNumber: '00 44 5551234567',
                region: 'DE',
                expectedCountryCode: '44',
                expectedFormattedNumber: '00 44 55 5123 4567',
                expectedInternationalNumber: '+445551234567'
            },
            {
                name: 'does not format numbers that are too long',
                phoneNumber: '(555) 123-4567 8901',
                region: 'US',
                expectedCountryCode: '1',
                expectedFormattedNumber: '55512345678901',
                expectedInternationalNumber: null
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.name, () => {
                var number = new PhoneNumberFormatterV3.QBPhoneNumber(testCase.phoneNumber, testCase.region);

                assert.equal(number.countryCode, testCase.expectedCountryCode, 'Country codes do not match');
                assert.equal(number.formattedNumber, testCase.expectedFormattedNumber, 'Formatted phone numbers do not match');
                assert.equal(number.internationalNumber, testCase.expectedInternationalNumber, 'International phone number does not match');
            });
        });
    });

});