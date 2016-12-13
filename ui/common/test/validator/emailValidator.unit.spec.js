'use strict';

var assert = require('assert');
var sinon = require('sinon');
var emailValidator = require('../../src/validator/emailValidator');
var dataErrorCodes = require('../../src/dataEntryErrorCodes');

describe('emailValidator', () => {
    describe('isSingleEmailValid', () => {
        let testCases = [
            {
                description: 'returns true if an email is valid',
                email: 'valid@quickbase.com',
                expectation: true
            },
            {
                description: 'returns false if an email is invalid',
                email: 'somethinginvalid./',
                expectation: false
            },
            {
                description: 'returns false if the hostname is missing',
                email: 'something.com',
                expectation: false
            },
            {
                description: 'returns false if the TLD is missing',
                email: 'something@something',
                expectation: false
            },
            {
                description: 'returns false if the mailbox is missing',
                email: '@something.com',
                expectation: false
            },
            {
                description: 'does not validate an empty string',
                email: '',
                expectation: true
            },
            {
                description: 'correctly validates international TLDs',
                email: 'test@test.de',
                expectation: true
            },
            {
                description: 'correctly validates long TLDs',
                email: 'test@test.expert',
                expectation: true
            },
            {
                description: 'correctly validates emails with multiple subdomains',
                email: 'test@test.subdomain.quickbase.com',
                expectation: true
            },
            {
                description: 'correctly validates emails with special characters as part of the mailbox',
                email: 'test!&$!@emai-l.com',
                expectation: true
            },
            {
                description: 'returns false if there are special characters in the domain (not including hyphen)',
                email: 'test@em&$%^.com',
                expectation: false
            },
            {
                description: 'returns false if there are special characters in the TLD',
                email: 'test@email.&%^em',
                expectation: false
            },
            {
                description: 'returns false if the domain does not start with a letter, number',
                email: 'test@-test.com',
                expectation: false
            },
        ];

        testCases.forEach((testCase) => {
            it(testCase.description, () => {
                var result = emailValidator.isSingleEmailValid(testCase.email);
                assert.equal(result, testCase.expectation, 'Validator did not return the correct result: ' + result + ' (actual) is not ' + testCase.expectation);
            });
        });
    });

    describe('isSingleEmailInvalid', () => {
        it('is a helper method to match the React property isInvalid (returns opposite result of validate)', () => {
            sinon.spy(emailValidator, 'isSingleEmailValid');

            var result = emailValidator.isSingleEmailInvalid('test@quickbase.com');

            assert.equal(result, false);
            assert(emailValidator.isSingleEmailValid.calledOnce);
        });
    });

    describe('validateArrayOfEmails', () => {
        let invalidEmailA = 'invalidEmail';
        let invalidEmailB = 'foo@test';

        let testCases = [
            {
                description: 'returns as valid if all emails in the Array are valid',
                emails: ['valid@test.com', 'bob@quickbase.com', 'sue@gmail.com'],
                expectedIsValidResult: true,
                expectedArrayOfInvalidEmails: []
            },
            {
                description: 'returns as valid if the array of emails is empty',
                emails: [],
                expectedIsValidResult: true,
                expectedArrayOfInvalidEmails: []
            },
            {
                description: 'returns as valid if null is passed in as an argument',
                emails: null,
                expectedIsValidResult: true,
                expectedArrayOfInvalidEmails: []
            },
            {
                description: 'returns as invalid if any email in the array is invalid (And provides an array of emails with their index in the array)',
                emails: ['valid@test.com', invalidEmailA, 'anotherValidEmail@quickbase.de', invalidEmailB],
                expectedIsValidResult: false,
                expectedArrayOfInvalidEmails: [{index: 1, email: invalidEmailA}, {index: 3, email: invalidEmailB}]
            },
        ];

        testCases.forEach((testCase) => {
            it(testCase.description, () => {
                let validationResult = emailValidator.validateArrayOfEmails(testCase.emails);

                assert.equal(validationResult.isValid, testCase.expectedIsValidResult);
                assert.equal(validationResult.isInvalid, !testCase.expectedIsValidResult);
                assert.deepEqual(validationResult.invalidEmails, testCase.expectedArrayOfInvalidEmails);
            });
        });
    });

    describe('validateAndReturnResults', () => {
        let fieldName = 'email';
        let invalidEmail = 'invalidemail';

        let resultsFromPreviousValidationCheck = {
            isInvalid: true,
            error: {
                messageId: 'invalidMsg.required',
                code: dataErrorCodes.REQUIRED_FIELD_EMPTY,
                data: {
                    fieldId: 1,
                    fieldName: fieldName
                }
            }
        };

        let testCases = [
            {
                description: 'returns a result (including an error message), to be used with validatorUtils, if the email is invalid',
                email: invalidEmail,
                previousResults: null,
                expectedResult: {
                    isInvalid: true,
                    error: {
                        code: dataErrorCodes.INVALID_ENTRY,
                        messageId: 'invalidMsg.email',
                        data: {
                            fieldName: fieldName,
                            invalidEmails: [{index: 0, email: invalidEmail}]
                        }
                    }
                }
            },
            {
                description: 'returns an invalid message about multiple emails if multiple emails are in the string',
                email: `valid@test.com;${invalidEmail};valid@dev.de`,
                previousResults: null,
                expectedResult: {
                    isInvalid: true,
                    error: {
                        code: dataErrorCodes.INVALID_ENTRY,
                        messageId: 'invalidMsg.emails', // note the s in emails for this error code
                        data: {
                            fieldName: fieldName,
                            invalidEmails: [{index: 1, email: invalidEmail}]
                        }
                    }
                }
            },
            {
                description: 'passes through the result if the email is valid',
                email: 'valid@test.com',
                previousResults: resultsFromPreviousValidationCheck,
                expectedResult: resultsFromPreviousValidationCheck
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                assert.deepEqual(emailValidator.validateAndReturnResults(testCase.email, fieldName, testCase.previousResults), testCase.expectedResult);
            });
        });
    });
});
