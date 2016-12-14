'use strict';

var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var recordValidator = rewire('../../../../src/api/quickbase/validator/recordValidator');
var constants = require('../../../../../common/src/constants');

var testDef = 'test field def';
var testName = 'test field name';
var testValue = '12345';
var testCheckRequired = true;
var testPreviousResults = {isInvalid: true};

var mockValidationUtils = {
    checkFieldValue: function(_def, _name, _value, _checkRequired) {return testPreviousResults;}
};

describe('RecordValidator', () => {

    before(function() {
        sinon.spy(mockValidationUtils, 'checkFieldValue');
        recordValidator.__set__({'ValidationUtils': mockValidationUtils});
    });

    it('calls the common validator to see if there are any common validation errors', () => {
        recordValidator.checkFieldValue(testDef, testName, testValue, testCheckRequired);

        // assert(mockValidationUtils.checkFieldValue.calledWith(testDef, testName, testValue, testCheckRequired));
        assert(mockValidationUtils.checkFieldValue.calledWith(testDef, testName, testValue, testCheckRequired));
    });

    it('returns the validation results', () => {
        var results = recordValidator.checkFieldValue(testDef, testName, testValue, testCheckRequired);

        assert.deepEqual(results, testPreviousResults);
    });

    // Test cases to make sure field specific validators are called within recordValidator
    var fieldSpecificValidatorTestCases = [
        {
            description: 'validates phone numbers',
            validatorVariableName: 'phoneValidator',
            fieldType: constants.PHONE_NUMBER
        }
    ];

    fieldSpecificValidatorTestCases.forEach(testCase => {
        it(testCase.description, () => {
            var mockValidator = {validateAndReturnResults: sinon.spy()};
            var mockDependencies = {};
            mockDependencies[testCase.validatorVariableName] = mockValidator;
            var revert = recordValidator.__set__(mockDependencies);

            var fieldDef = {fieldDef: {datatypeAttributes: {type: testCase.fieldType}}};

            recordValidator.checkFieldValue(fieldDef, testName, testValue, testCheckRequired);

            assert(mockValidator.validateAndReturnResults.calledWith(testValue, testName, testPreviousResults));

            revert();
        });
    });
});
