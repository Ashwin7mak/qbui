'use strict';

var assert = require('assert');
var emailFormatter = require('../../src/formatter/emailFormatter');

// Other scenarios are covered in component unit tests
describe('EmailFormatter', () => {
    describe('addDefaultDomain', () => {
        let testCases = [
            {
                name: 'adds a default domain if one is provided and the email does not have one',
                email: 'test',
                domain: '@quickbase.com',
                expectation: 'test@quickbase.com'
            },
            {
                name: 'does not add the default domain if the email already has a domain',
                email: 'test@test.com',
                domain: '@quickbase.com',
                expectation: 'test@test.com'
            },
            {
                name: 'adds the @ symbol to the domain if it was not provided',
                email: 'test',
                domain: 'quickbase.com',
                expectation: 'test@quickbase.com'
            },
            {
                name: 'does not add a default domain if a domain is not provided',
                email: 'test',
                domain: '',
                expectation: 'test'
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.name, () => {
                assert.equal(emailFormatter.addDefaultDomain(testCase.email, testCase.domain), testCase.expectation);
            });
        });
    });
});
