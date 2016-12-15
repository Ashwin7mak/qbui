var assert = require('assert');
var PhoneNumberFormatter = require('../../src/formatter/phoneNumberFormatter');

describe('PhoneNumberFormatter (common)', () => {
    describe('format', () => {
        var testCases = [
            {
                description: 'does not format a single digit number',
                testPhoneNumber: '1',
                expectedPhoneNumber: '1'
            },
            {
                description: 'does not format a short number (less than or equal to 4 digits)',
                testPhoneNumber: '1234',
                expectedPhoneNumber: '1234'
            },
            {
                description: 'starts to format a 6 digit number like a US number ({0-3}-{4})',
                testPhoneNumber: '123456',
                expectedPhoneNumber: `12${PhoneNumberFormatter.DASH}3456`
            },
            {
                description: 'formats a 7 digits number like a typical US number',
                testPhoneNumber: '1234567',
                expectedPhoneNumber: `123${PhoneNumberFormatter.DASH}4567`
            },
            {
                description: 'starts to format an 8 digit number like a typical US number (({0-3}) {3}-{4})',
                testPhoneNumber: '12345678',
                expectedPhoneNumber: `${PhoneNumberFormatter.OPEN_PAREN}1${PhoneNumberFormatter.CLOSE_PAREN} 234${PhoneNumberFormatter.DASH}5678`
            },
            {
                description: 'formats a 10 digit number like a typical US Number',
                testPhoneNumber: '1234567890',
                expectedPhoneNumber: `${PhoneNumberFormatter.OPEN_PAREN}123${PhoneNumberFormatter.CLOSE_PAREN} 456${PhoneNumberFormatter.DASH}7890`
            },
            {
                description: 'formats like a typical US number if the first digit is 1 and the string is 11 characters',
                testPhoneNumber: '12345678902',
                expectedPhoneNumber: `1 ${PhoneNumberFormatter.OPEN_PAREN}234${PhoneNumberFormatter.CLOSE_PAREN} 567${PhoneNumberFormatter.DASH}8902`
            },
            {
                description: 'formats numbers longer that are longer than 11 characters like a US phone number with any remaining characters at the end',
                testPhoneNumber: '1234567890234567',
                expectedPhoneNumber: `1 ${PhoneNumberFormatter.OPEN_PAREN}234${PhoneNumberFormatter.CLOSE_PAREN} 567${PhoneNumberFormatter.DASH}8902 34567`
            },
            {
                description: 'formats numbers longer that are longer than 11 characters like a US phone number with any remaining characters at the end (leading digit is not a 1)',
                testPhoneNumber: '01234567890234567',
                expectedPhoneNumber: `${PhoneNumberFormatter.OPEN_PAREN}012${PhoneNumberFormatter.CLOSE_PAREN} 345${PhoneNumberFormatter.DASH}6789 0234567`
            },
            {
                description: 'formats as an international number if the first character is a +',
                testPhoneNumber: '+33968686868',
                expectedPhoneNumber: '+33 9 68 68 68 68'
            }
        ];

        testCases.forEach((testCase) => {
            it(testCase.description, () => {
                assert.equal(PhoneNumberFormatter.format({value: testCase.testPhoneNumber}), testCase.expectedPhoneNumber);
            });
        });
    });

    describe('formatAsBasicInternationalNumber', () => {
        var testCases = [
            {
                description: 'formats numbers that start with a 1 as US numbers',
                phoneNumber: '12345678901',
                includeExtension: false,
                expectedValue: '1 (234) 567-8901'
            },
            {
                description: 'formats numbers that do not start with a 1 as basic international numbers',
                phoneNumber: '33968686868',
                includeExtension: false,
                expectedValue: '+33 9 68 68 68 68'
            },
            {
                description: 'adds extra numbers to the end',
                phoneNumber: '339686868681234',
                includeExtension: false,
                expectedValue: '+33 9 68 68 68 68 1234'
            },
            {
                description: 'hides the extension if includeExtension is false',
                phoneNumber: '33968686868x1234',
                includeExtension: false,
                expectedValue: '+33 9 68 68 68 68'
            },
            {
                description: 'shows the extension if includeExtension is true',
                phoneNumber: '33968686868   x1234',
                includeExtension: true,
                expectedValue: '+33 9 68 68 68 68 x1234'
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                var fieldInfo = {includeExtension: testCase.includeExtension};

                assert.equal(PhoneNumberFormatter.formatAsBasicInternationalNumber({value: testCase.phoneNumber}, fieldInfo), testCase.expectedValue);
            });
        });
    });

    describe('splitPhoneNumberAndExtension', () => {
        var testCases = [
            {
                description: 'returns empty strings for a null value',
                phoneNumber: null,
                expectedPhoneNumber: '',
                expectedExtension: ''
            },
            {
                description: 'splits the phone number and extension',
                phoneNumber: '12345' + PhoneNumberFormatter.EXTENSION_DELIM + '6789',
                expectedPhoneNumber: '12345',
                expectedExtension: '6789'
            },
            {
                description: 'removes extra spaces around the extension',
                phoneNumber: '12345' + PhoneNumberFormatter.EXTENSION_DELIM + '   6789',
                expectedPhoneNumber: '12345',
                expectedExtension: '6789'
            },
            {
                description: 'does not remove extra spaces after the number so users can enter spaces in the input box',
                phoneNumber: '12345  ' + PhoneNumberFormatter.EXTENSION_DELIM + '6789',
                expectedPhoneNumber: '12345  ',
                expectedExtension: '6789'
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                var splitPhoneNumber = PhoneNumberFormatter.splitPhoneNumberAndExtension(testCase.phoneNumber);
                assert.equal(splitPhoneNumber.getPhoneNumber, testCase.expectedPhoneNumber);
                assert.equal(splitPhoneNumber.getExtension, testCase.expectedExtension);
            });
        });
    });

    describe('stripSpecialCharacters', () => {
        var testCases = [
            {
                description: 'clears all special characters from a phone number string',
                phoneNumber: '1*%^23$%^)(4  56-_',
                expectedValue: '123456'
            },
            {
                description: 'handles null values',
                phoneNumber: null,
                expectedValue: ''
            },
            {
                description: 'handles blank values',
                phoneNumber: '',
                expectedValue: ''
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                assert.equal(PhoneNumberFormatter.stripSpecialCharacters(testCase.phoneNumber), testCase.expectedValue);
            });
        });
    });
});
