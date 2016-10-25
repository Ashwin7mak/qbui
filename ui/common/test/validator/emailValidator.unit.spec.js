'use strict';

var assert = require('assert');
var sinon = require('sinon');
var emailValidator = require('../../src/validator/emailValidator');

describe('emailValidator', () => {
    describe('validate', () => {
        let testCases = [
            {
                name: 'returns true if an email is valid',
                email: 'valid@quickbase.com',
                validationType: null,
                expectation: true
            },
            {
                name: 'returns false if an email is invalid',
                email: 'somethinginvalid./',
                validationType: null,
                expectation: false
            },
            {
                name: 'does not validate an empty string',
                email: '',
                validationType: null,
                expectation: true
            },
            {
                name: 'can optionally only check the domain',
                email: '@domain.com',
                validationType: emailValidator.ONLY_VALIDATE_DOMAIN,
                expectation: true
            },
            {
                name: 'can optionally only check the mailbox',
                email: 'mailbox',
                validationType: emailValidator.ONLY_VALIDATE_MAILBOX,
                expectation: true
            }
        ];

        testCases.forEach((testCase) => {
            it(testCase.name, () => {
                var result = emailValidator.isValid(testCase.email, testCase.validationType);
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
});
