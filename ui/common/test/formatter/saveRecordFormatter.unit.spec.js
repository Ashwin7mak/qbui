'use strict';

var assert = require('assert');
var saveRecordFormatter = require('../../src/formatter/saveRecordFormatter');
var constants = require('../../src/constants');

describe('saveRecordFormatter', () => {

    describe('formatFieldForSaving', () => {
        let testCases = [
            {
                description: 'passes through a change if it does not match any of the field types',
                change: '123',
                expectedChange: '123'
            },
            {
                description: 'removes special characters from phone numbers',
                change: {
                    value: '+33 9 68 68 68 68',
                    display: '+33 9 68 68 68 68',
                    fieldDef: {datatypeAttributes: {type: constants.PHONE_NUMBER}}
                },
                expectedChange: {
                    value: '33968686868',
                    display: '+33 9 68 68 68 68',
                    fieldDef: {datatypeAttributes: {type: constants.PHONE_NUMBER}}
                }
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                assert.deepEqual(saveRecordFormatter.formatFieldForSaving(testCase.change), testCase.expectedChange);
            });
        });
    });

    describe('formatRecordForSaving', () => {
        let testCases = [
            {
                description: 'formats an array of changes',
                changes: [
                    {
                        value: '+5 05-193-0809',
                        display: '+5 05-193-0809',
                        fieldDef: {datatypeAttributes: {type: constants.PHONE_NUMBER}}
                    },
                    {
                        value: 'Walter White!',
                        display: 'Walter White!',
                        fieldDef: {datatypeAttributes: {type: constants.TEXT}}
                    },
                    {
                        value: 'Rick Grimes +',
                        display: 'Rick Grimes +',
                        fieldDef: {datatypeAttributes: {type: constants.TEXT}}
                    }
                ],
                expectedChanges: [
                    {
                        value: '5051930809',
                        display: '+5 05-193-0809',
                        fieldDef: {datatypeAttributes: {type: constants.PHONE_NUMBER}}
                    },
                    {
                        value: 'Walter White!',
                        display: 'Walter White!',
                        fieldDef: {datatypeAttributes: {type: constants.TEXT}}
                    },
                    {
                        value: 'Rick Grimes +',
                        display: 'Rick Grimes +',
                        fieldDef: {datatypeAttributes: {type: constants.TEXT}}
                    }
                ]
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                assert.deepEqual(saveRecordFormatter.formatRecordForSaving(testCase.changes), testCase.expectedChanges);
            });
        });
    });
});
