'use strict';

var assert = require('assert');
var passthroughFormatter = require('../../src/formatter/passthroughFormatter');

describe('PassthroughFormatter', () => {
    describe('format', () => {
        let testCases = [
            {
                description: 'passes through a display value if present (string)',
                value: 'Caleb Hawley',
                display: 'When My Babys Gone',
                expectedDisplay: 'When My Babys Gone'
            },
            {
                description: 'passes through a display value if present (object)',
                value: 'Caleb Hawley',
                display: {
                    line1: 'When my babys gone',
                    line2: 'everybody just be asking',
                    line3: 'How she been or where she at or what shes like'
                },
                expectedDisplay: {
                    line1: 'When my babys gone',
                    line2: 'everybody just be asking',
                    line3: 'How she been or where she at or what shes like'
                },
            },
            {
                description: 'uses the value if a display is not provided',
                value: 'Oh everything is going right',
                display: undefined,
                expectedDisplay: 'Oh everything is going right',
            },
            {
                description: 'uses the value if a display is null',
                value: 'All the people passing by well they just stare',
                display: null,
                expectedDisplay: 'All the people passing by well they just stare',
            },
            {
                description: 'passes through a display value that is an empty string',
                value: 'cause shes the brightest light in the whole downtown',
                display: '',
                expectedDisplay: '',
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let fieldValue = {value: testCase.value, display: testCase.display};
                assert.deepEqual(passthroughFormatter.format(fieldValue, {}), testCase.expectedDisplay);
            });
        });
    });
});
