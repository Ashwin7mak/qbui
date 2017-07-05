const assert = require('assert');
const configUtils = require('../../src/utility/configUtils');
const should = require('should');

/**
 * Unit tests for config utility functions
 */
describe('Validate that the config utility functions', () => {
    it('should return an initialized configUtils module by default', () => {
        should.exist(configUtils);
    });

    describe('based on the provided config value should validate that the boolean value is', () => {
        const booleanExpected = [
            {name: 'true when config value is boolean true', providedValue: true, expectation: true},
            {name: 'false when config value is boolean false', providedValue: false, expectation: false},
            {name: 'true when config value is string true', providedValue: "true", expectation: true},
            {name: 'false when config value is string false', providedValue: "false", expectation: false},
            {name: 'true when config value is string TRUE', providedValue: "TRUE", expectation: true},
            {name: 'false when config value is string FALSE', providedValue: "FALSE", expectation: false},
        ];

        const booleanExceptional = [
            {
                name: 'a thrown InvalidConfigValueError when config value is string notABoolean',
                providedValue: "notABoolean",
                exceptionType: 'InvalidConfigValueError'
            },
            {
                name: 'a thrown InvalidConfigValueError when config value is 123',
                providedValue: 123,
                exceptionType: 'InvalidConfigValueError'
            },
            {
                name: 'a thrown InvalidConfigValueError when config value is {}',
                providedValue: {},
                exceptionType: 'InvalidConfigValueError'
            },
            {
                name: 'a thrown InvalidConfigValueError when config value is null',
                providedValue: null,
                exceptionType: 'InvalidConfigValueError'
            },
            {
                name: 'a thrown InvalidConfigValueError when config value is undefined',
                providedValue: undefined,
                exceptionType: 'InvalidConfigValueError'
            },
        ];

        booleanExpected.forEach(testCase => {
            it(testCase.name, function() {
                assert.equal(configUtils.parseBooleanConfigValue(testCase.providedValue), testCase.expectation);
            });
        });

        booleanExceptional.forEach(testCase => {
            it(testCase.name, () => {
                assert.throws(() => configUtils.parseBooleanConfigValue(testCase.providedValue), testCase.exceptionType);
            });
        });
    });

    describe('based on the provided config value should validate that the string value is', () => {
        it('hostname when config value is string hostname', () => {
            assert.equal(configUtils.parseStringConfigValue('hostname'), 'hostname');
        });

        it('hostname when config value is string "hostname"', () => {
            assert.equal(configUtils.parseStringConfigValue(' hostname '), 'hostname');
        });


        const stringExceptional = [
            {
                name: 'a thrown InvalidConfigValueError when config value is empty string ""',
                providedValue: "",
                exceptionType: 'InvalidConfigValueError'
            },
            {
                name: 'a thrown InvalidConfigValueError when config value is whitespace string " "',
                providedValue: " ",
                exceptionType: 'InvalidConfigValueError'},
            {
                name: 'a thrown InvalidConfigValueError when config value is 123',
                providedValue: 123,
                exceptionType: 'InvalidConfigValueError'
            },
            {
                name: 'a thrown InvalidConfigValueError when config value is {}',
                providedValue: {},
                exceptionType: 'InvalidConfigValueError'
            },
            {
                name: 'a thrown InvalidConfigValueError when config value is null',
                providedValue: null,
                exceptionType: 'InvalidConfigValueError'
            },
            {
                name: 'a thrown InvalidConfigValueError when config value is undefined',
                providedValue: undefined,
                exceptionType: 'InvalidConfigValueError'
            },
        ];

        stringExceptional.forEach(testCase => {
            it(testCase.name, () => {
                assert.throws(() => configUtils.parseStringConfigValue(testCase.providedValue), testCase.exceptionType);
            });
        });
    });
});
