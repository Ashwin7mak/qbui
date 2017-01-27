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
                description: 'passes through null values',
                change: null,
                expectedChange: null
            },
            {
                description: 'converts empty strings to null for numeric fields',
                change: buildNumericChange(constants.NUMERIC, ''),
                expectedChange: buildNumericChange(constants.NUMERIC, null)
            },
            {
                description: 'converts empty strings to null for percent fields',
                change: buildNumericChange(constants.PERCENT, ''),
                expectedChange: buildNumericChange(constants.PERCENT, null)
            },
            {
                description: 'converts empty strings to null for currency fields',
                change: buildNumericChange(constants.CURRENCY, ''),
                expectedChange: buildNumericChange(constants.CURRENCY, null)
            },
            {
                description: 'converts empty strings to null for rating fields',
                change: buildNumericChange(constants.RATING, ''),
                expectedChange: buildNumericChange(constants.RATING, null)
            },
            {
                description: 'converts empty strings to null for duration fields',
                change: buildNumericChange(constants.DURATION, ''),
                expectedChange: buildNumericChange(constants.DURATION, null)
            },
            {
                description: 'does not convert an invalid duration that is a string',
                change: buildNumericChange(constants.DURATION, '1 wolf'),
                expectedChange: buildNumericChange(constants.DURATION, '1 wolf')
            },
            {
                description: 'does not convert numeric that is already null',
                change: buildNumericChange(constants.NUMERIC, null),
                expectedChange: buildNumericChange(constants.NUMERIC, null)
            },
            {
                description: 'does not convert numeric that is already a number',
                change: buildNumericChange(constants.NUMERIC, 13),
                expectedChange: buildNumericChange(constants.NUMERIC, 13)
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

    function buildNumericChange(type, value) {
        return {
            value: value,
            display: '',
            fieldDef: {datatypeAttributes: {type: type}}
        };
    }
});
