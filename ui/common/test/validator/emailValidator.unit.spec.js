'use strict';

var assert = require('assert');
var sinon = require('sinon');
var emailValidator = require('../../src/validator/emailValidator');
var dataErrorCodes = require('../../src/dataEntryErrorCodes');

describe('emailValidator', () => {
    describe('validate', () => {
        let testCases = [
            {
                name: 'returns true if an email is valid',
                email: 'valid@quickbase.com',
                expectation: true
            },
            {
                name: 'returns false if an email is invalid',
                email: 'somethinginvalid./',
                expectation: false
            },
            {
                name: 'returns false if the hostname is missing',
                email: 'something.com',
                expectation: false
            },
            {
                name: 'returns false if the TLD is missing',
                email: 'something@something',
                expectation: false
            },
            {
                name: 'returns false if the mailbox is missing',
                email: '@something.com',
                expectation: false
            },
            {
                name: 'does not validate an empty string',
                email: '',
                expectation: true
            },
            {
                name: 'correctly validates international TLDs',
                email: 'test@test.de',
                expectation: true
            },
            {
                name: 'correctly validates long TLDs',
                email: 'test@test.expert',
                expectation: true
            },
            {
                name: 'correctly validates emails with multiple subdomains',
                email: 'test@test.subdomain.quickbase.com',
                expectation: true
            },
            {
                name: 'correctly validates emails with special characters as part of the mailbox',
                email: 'test!&$!@emai-l.com',
                expectation: true
            },
            {
                name: 'returns false if there are special characters in the domain (not including hyphen)',
                email: 'test@em&$%^.com',
                expectation: false
            },
            {
                name: 'returns false if there are special characters in the TLD',
                email: 'test@email.&%^em',
                expectation: false
            },
            {
                name: 'returns false if the domain does not start with a letter, number',
                email: 'test@-test.com',
                expectation: false
            },
            {
                name: 'returns true if all emails in a list are valid',
                email: 'test@test.com; me@quickbase.com; whatsup@chocalat.fr',
                expectation: true
            },
            {
                name: 'returns false if any email in a list is invalid',
                email: 'test@test.com; me@quickbaseinvalid; whatsup@chocolat.fr',
                expectation: false
            }
        ];

        testCases.forEach((testCase) => {
            it(testCase.name, () => {
                var result = emailValidator.isValid(testCase.email);
                assert.equal(result, testCase.expectation, 'Validator did not return the correct result: ' + result + ' (actual) is not ' + testCase.expectation);
            });
        });
    });

    describe('isInvalid', () => {
        it('is a helper method to match the React property isInvalid (returns opposite result of validate)', () => {
            sinon.spy(emailValidator, 'isValid');

            var result = emailValidator.isInvalid('test@quickbase.com');

            assert.equal(result, false);
            assert(emailValidator.isValid.calledOnce);
        });
    });

    describe('validateAndReturnResults', () => {
        let fieldName = 'email';

        it('returns a result, to be used with validatorUtils, if the email is invalid', () => {
            let expectedResult = {
                isInvalid: true,
                error: {
                    code: dataErrorCodes.INVALID_ENTRY,
                    messageId: 'invalidMsg.email',
                    data: {fieldName: fieldName}
                }
            };

            assert.deepEqual(emailValidator.validateAndReturnResults('invalidemail', fieldName), expectedResult);
        });

        it('passes through the result if the email is valid', () => {
            let requiredResult = {
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

            assert.deepEqual(emailValidator.validateAndReturnResults('valid@test.com', fieldName, requiredResult), requiredResult);
        });
    });
});
