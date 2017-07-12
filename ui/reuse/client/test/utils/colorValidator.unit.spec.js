import * as ColorValidator from '../../src/utils/colorValidator';

describe('ColorValidator', () => {
    describe('isValidHexColor', () => {
        let testCases = [
            {
                description: 'returns true for a valid hex value',
                color: '#74489d',
                expectedResult: true
            },
            {
                description: 'returns false if the value is missing the # sign',
                color: '74489d',
                expectedResult: false
            },
            {
                description: 'returns false for 3 digit hex values because the React-Color third party component does not accept them',
                color: '#fff',
                expectedResult: false
            },
            {
                description: 'returns false hex values with invalid characters',
                color: '#ffyyff',
                expectedResult: false
            },
            {
                description: 'returns false for invalid hex values',
                color: '$7448',
                expectedResult: false
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(ColorValidator.isValidHexColor(testCase.color)).toEqual(testCase.expectedResult);
            });
        });
    });

    describe('formatHexColor', () => {
        let testCases = [
            {
                description: 'passed through a valid hex color',
                color: '#74489d',
                expectedResult: '#74489d'
            },
            {
                description: 'removes extra # signs',
                color: '##74489d',
                expectedResult: '#74489d'
            },
            {
                description: 'adds a missing # sign',
                color: '74489d',
                expectedResult: '#74489d'
            },
            {
                description: 'returns "#" for a non-string value',
                color: null,
                expectedResult: '#'
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(ColorValidator.formatHexColor(testCase.color)).toEqual(testCase.expectedResult);
            });
        });
    });
});
