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
            },
            {
                name: 'adds the default domain to every email in a list that does not have one',
                email: 'test;test@hasdomain.com,test2,test3',
                domain: 'quickbase.com',
                expectation: 'test@quickbase.com;test@hasdomain.com;test2@quickbase.com;test3@quickbase.com'
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.name, () => {
                assert.equal(emailFormatter.addDefaultDomain(testCase.email, testCase.domain), testCase.expectation);
            });
        });
    });

    describe('splitEmails', () => {
        let testCases = [
            {
                name: 'does not split a single email',
                emails: 'test@test.com',
                expectation: ['test@test.com']
            },
            {
                name: 'splits emails separated by a semicolon',
                emails: 'test@test.com;test+2@test.com;test+3@quickbase.com',
                expectation: ['test@test.com', 'test+2@test.com', 'test+3@quickbase.com']
            },
            {
                name: 'splits emails separated by a semicolon (with a space)',
                emails: 'test@test.com; test+2@test.com; test+3@quickbase.com',
                expectation: ['test@test.com', 'test+2@test.com', 'test+3@quickbase.com']
            },
            {
                name: 'splits emails separated by a comma',
                emails: 'test@test.com,test+2@test.com,test+3@quickbase.com',
                expectation: ['test@test.com', 'test+2@test.com', 'test+3@quickbase.com']
            },
            {
                name: 'splits emails separated by a comma (and a space)',
                emails: 'test@test.com, test+2@test.com, test+3@quickbase.com',
                expectation: ['test@test.com', 'test+2@test.com', 'test+3@quickbase.com']
            },
            {
                name: 'splits emails separated by a delimiter (; or ,) and multiple spaces',
                emails: 'test@test.com ,    test+2@test.com    ; test+3@quickbase.com',
                expectation: ['test@test.com', 'test+2@test.com', 'test+3@quickbase.com']
            },
            {
                name: 'splits emails separated by a space (or multiple spaces)',
                emails: 'test@test.com test+2@test.com    test+3@quickbase.com',
                expectation: ['test@test.com', 'test+2@test.com', 'test+3@quickbase.com']
            },
            {
                name: 'splits emails separated by a tab',
                emails: "test@test.com\ttest+2@test.com\ttest+3@quickbase.com",
                expectation: ['test@test.com', 'test+2@test.com', 'test+3@quickbase.com']
            },
            {
                name: 'does not add a blank email if the string ends in a delimiter (; or ,)',
                emails: 'test@test.com;test2@test.com;',
                expectation: ['test@test.com', 'test2@test.com']
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.name, () => {
                assert.deepEqual(emailFormatter.splitEmails(testCase.emails), testCase.expectation);
            });
        });
    });

    describe('formatListOfEmails', () => {
        let fieldInfo = {
            defaultDomain: 'test.com'
        };

        let testCases = [
            {
                name: 'formats a single email correctly',
                emails: 'test',
                expectation: 'test@test.com'
            },
            {
                name: 'formats multiple emails',
                emails: 'test;test+2;test3',
                expectation: 'test@test.com;test+2@test.com;test3@test.com'
            },
            {
                name: 'formats multiple emails even if there are spaces',
                emails: 'test; test+2; test3',
                expectation: 'test@test.com;test+2@test.com;test3@test.com'
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.name, () => {
                assert.equal(emailFormatter.formatListOfEmails(testCase.emails, fieldInfo), testCase.expectation);
            });
        });
    });
});
