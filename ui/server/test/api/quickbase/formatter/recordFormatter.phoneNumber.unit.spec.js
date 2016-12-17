'use strict';

var recordFormatter = require('../../../../src/api/quickbase/formatter/recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for PhoneNumber field formatting
 * See phoneNumberFormatter.unit.spec.js for more detailed tests of the phoneNumberFormatter specifically
 */
describe('Phone number record formatter unit test', function() {

    /**
     * DataProvider containing Records, FieldProperties and record display expectations PhoneNumber fields
     */
    function provider() {
        var fieldInfo = [
            {
                id: 7,
                name: 'phone',
                datatypeAttributes: {
                    type: 'PHONE_NUMBER'
                }
            }
        ];

        // 10 digit US number
        var standardInput = [[{
            id: 7,
            value: '5557779999x1234'
        }]];
        var expectedStandardExpected = [[{
            id: 7,
            value: '5557779999x1234',
            display: {
                countryCode: 1,
                display: '(555) 777-9999',
                extension: '1234',
                extraDigits: null,
                internationalNumber: null,
                internetDialableNumber: null,
                isDialable: false
            }
        }]];

        return [
            {description: 'formats a phone number with extension', fieldInfo: fieldInfo, records: standardInput, expectedRecords: expectedStandardExpected},
        ];
    }

    /**
     * Unit test that validates PhoneNumber records formatting
     */
    describe('should format a phone number for display', function() {
        provider().forEach(function(entry) {
            it(entry.description, function() {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.description);
            });
        });
    });
});
