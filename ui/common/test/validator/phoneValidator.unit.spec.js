'use strict';

var assert = require('assert');
var phoneValidator = require('../../src/validator/phoneValidator');
var dataErrorCodes = require('../../src/dataEntryErrorCodes');

describe('PhoneValidator', () => {
    describe('validateAndReturnResults', () => {
        const testFieldName = 'phone number field';

        const testPreviousResults = {
            isInvalid: true,
            error: {
                code: dataErrorCodes.MAX_LEN_EXCEEDED,
                messageId: 'something',
                data: {fieldName: 'previous results field'},
            }
        };

        const invalidPhoneNumberResults = {
            error: {
                code: dataErrorCodes.INVALID_ENTRY,
                messageId: 'invalidMsg.phone',
                data: {fieldName: testFieldName},
            },
            isInvalid: true
        };

        var testCases = [
            {
                description: 'passes through the results if a number is not provided',
                phoneNumber: '',
                previousResults: testPreviousResults,
                expectedResults: testPreviousResults,
            },
            {
                description: 'passes through the results if the number is null',
                phoneNumber: null,
                previousResults: testPreviousResults,
                expectedResults: testPreviousResults,
            },
            {
                description: 'is invalid for a number that is too short',
                phoneNumber: '86',
                previousResults: null,
                expectedResults: invalidPhoneNumberResults,
            },
            {
                description: 'is invalid for a number that is an unlikely phone number length',
                phoneNumber: '86753',
                previousResults: null,
                expectedResults: invalidPhoneNumberResults,
            },
            {
                description: 'is valid for a likely emergency number (3 characters)',
                phoneNumber: '911',
                previousResults: null,
                expectedResults: null
            },
            {
                description: 'is valid for a number that is 7 characters',
                phoneNumber: '8675309',
                previousResults: null,
                expectedResults: null
            },
            {
                description: 'is valid for numbers longer than 7 characters (valid numbers must only start with a valid number, but could have extra digits)',
                phoneNumber: '8675309 18009453669',
                previousResults: null,
                expectedResults: null
            },
            {
                description: 'does not include special characters in the length count (this number is invalid because it has less than 3 digits)',
                phoneNumber: '1- 2 - ()',
                previousResults: null,
                expectedResults: invalidPhoneNumberResults
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                assert.deepEqual(
                    phoneValidator.validateAndReturnResults(testCase.phoneNumber, testFieldName, testCase.previousResults),
                    testCase.expectedResults
                );
            });
        });
    });
});
