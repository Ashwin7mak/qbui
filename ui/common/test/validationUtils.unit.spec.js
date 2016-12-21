var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var LimitConstants = require('../src/limitConstants');
var constants = require('../src/constants');
var ValidationUtils = rewire('../src/validationUtils');

describe('test validateFieldValue', () => {

    it('null field definition gets no errors', () => {
        var def = null;
        var name = null;
        var value = "hello";
        var result = ValidationUtils.checkFieldValue(def, name, value);
        assert.notEqual(result, null);
        assert.equal(result.isInvalid, false);
    });

    it('undefined field definition gets no errors', () => {
        var def = undefined;
        var name = undefined;
        var value = "hello";
        var result = ValidationUtils.checkFieldValue(def, name, value);
        assert.notEqual(result, null);
        assert.equal(result.isInvalid, false);
    });

    describe('required test', () => {
        var name = 'testFieldRequired';

        describe('required with some value gets no errors', () => {
            var dataProvider = [
                {test: '0 value ', value: 0},
                {test: 'string value ', value: "this"},
                {test: 'date object value', value: new Date()},
                {test: 'object value', value: {this:'is an', object:44}},
                {test: 'number value not error', value: -1223.34},
            ];

            dataProvider.forEach((data) => {
                it(data.test, () => {
                    var def = {fieldDef: {required: true}};
                    var value = data.value;
                    var result = ValidationUtils.checkFieldValue(def, name, value, true);
                    assert.notEqual(result, null);
                    assert.equal(result.isInvalid, false);
                });
            });
        });

        describe('required with ', () => {
            var dataProvider = [
                {test: 'null value gets error', value: null, isInvalid: true},
                {test: 'empty string value gets error', value: "", isInvalid: true},
                {test: 'undefined value gets error', value: undefined, isInvalid: true},
                {test: '0 value not error', value: 0, isInvalid: false},
            ];
            dataProvider.forEach((data) => {
                it(data.test, () => {
                    var def = {fieldDef: {required: true}};
                    var value = data.value;
                    var result = ValidationUtils.checkFieldValue(def, name, value, true);
                    assert.notEqual(result, null);
                    assert.equal(result.isInvalid, data.isInvalid);
                });
            });
        });
    });

    describe('max field length test ', () => {
        var maxChars = 4;
        var def = {fieldDef: {required: false, datatypeAttributes : {clientSideAttributes : {max_chars: maxChars}}}};
        var defOverSysMax = {fieldDef: {required: false, datatypeAttributes : {clientSideAttributes : {max_chars: LimitConstants.maxTextFieldValueLength + 20}}}};
        var defSys = {fieldDef: {required: false}};
        var chance = require('chance').Chance();
        var sysMaxString = chance.string({length: LimitConstants.maxTextFieldValueLength + 1});
        var name = 'testField';

        var dataProvider = [
            {test: `max: ${maxChars}`, value: null, isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: undefined, isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: '', isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: 'abcd', isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: 88, isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: new Date(), isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: -44, isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: 'abcde', isInvalid: true, def: def},
            {test: `max: ${LimitConstants.maxTextFieldValueLength}`, value: sysMaxString, isInvalid: true, def: defSys},
            {test: `max: ${LimitConstants.maxTextFieldValueLength + 1}`, value: sysMaxString, isInvalid: true, def: defOverSysMax},

        ];
        dataProvider.forEach((data) => {
            it(data.test + ` value:${data.value} expected isInvalid:${data.isInvalid}`, () => {
                var value = data.value;
                var result = ValidationUtils.checkFieldValue(data.def, name, value);
                assert.notEqual(result, null);
                assert.equal(result.isInvalid, data.isInvalid);
            });
        });
    });

    // These tests only ensure a field type validator was called correctly. Please add separate unit tests for
    // confirming the field specific validators work as expected
    describe('field type specific validation tests', () => {
        var fieldSpecificValidatorTestCases = [
            {
                description: 'validates emails',
                validatorVariableName: 'EmailValidator',
                fieldType: constants.EMAIL_ADDRESS
            },
            {
                description: 'validates phone numbers',
                validatorVariableName: 'PhoneValidator',
                fieldType: constants.PHONE_NUMBER
            }
        ];

        fieldSpecificValidatorTestCases.forEach(testCase => {
            it(testCase.description, () => {
                var fieldDef = {fieldDef: {datatypeAttributes: {type: testCase.fieldType}}};

                var testFieldName = 'my field';
                var testValue = '1234';
                var testCheckRequired = false;

                var mockValidator = {validateAndReturnResults: sinon.spy()};
                var mockDependencies = {};
                mockDependencies[testCase.validatorVariableName] = mockValidator;
                var revert = ValidationUtils.__set__(mockDependencies);

                ValidationUtils.checkFieldValue(fieldDef, testFieldName, testValue, testCheckRequired);

                assert(mockValidator.validateAndReturnResults.calledOnce);

                revert();
            });
        });
    });
});
