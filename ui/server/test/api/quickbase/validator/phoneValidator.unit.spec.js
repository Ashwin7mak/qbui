'use strict';

var assert = require('assert');
var phoneValidator = require('../../../../src/api/quickbase/validator/phoneValidator');
var dataErrorCodes = require('../../../../../common/src/dataEntryErrorCodes');

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
                description: 'is invalid for numbers that are too short',
                phoneNumber: '12',
                previousResults: null,
                expectedResults: invalidPhoneNumberResults
            },
            {
                description: 'is invalid for numbers that are too short and have an extension',
                phoneNumber: '12 x 1235',
                previousResults: null,
                expectedResults: invalidPhoneNumberResults
            },
            {
                description: 'is invalid for fake numbers',
                phoneNumber: '555-555-5555',
                previousResults: null,
                expectedResults: invalidPhoneNumberResults
            },
            {
                description: 'is valid for US numbers',
                phoneNumber: '(508) 481-1015',
                previousResults: null,
                expectedResults: null
            },
            {
                description: 'is valid for international numbers',
                phoneNumber: '+33 9 68 68 68 58',
                previousResults: null,
                expectedResults: null
            },
            {
                description: 'is valid for numbers with an extension',
                phoneNumber: '+33 9 68 68 68 58 x 12354',
                previousResults: null,
                expectedResults: null
            },
            {
                description: 'is valid for long numbers that contain a valid number at the beginning',
                phoneNumber: '(508) 481-10158675309 x 12354',
                previousResults: null,
                expectedResults: null
            },
            {
                description: 'is invalid for long numbers that do not contain a valid number',
                phoneNumber: '(000) 555-5555558675309 x 12354',
                previousResults: null,
                expectedResults: invalidPhoneNumberResults
            },
            {
                description: 'does not validate null values',
                phoneNumber: null,
                previousResults: testPreviousResults,
                expectedResults: testPreviousResults
            }
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
