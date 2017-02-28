import * as FormUtils from '../../src/utils/formUtils';

describe('FormUtils', () => {

    describe('findFormElementKey', () => {
        let testCases = [
            {
                description: 'returns the key of an element that has a positionSameRow property',
                element: {wrongElement: {}, rightElement: {positionSameRow: false}},
                expectedResult: 'rightElement'
            },
            {
                description: 'returns undefined an element with positionSameRow cannot be found',
                element: {wrongElement: {someOtherProp: 'test'}, anotherWrongElement: {}},
                expectedResult: undefined
            },
            {
                description: 'returns undefined for an empty object',
                element: {},
                expectedResult: undefined
            },
            {
                description: 'returns undefined if null is passed in',
                element: null,
                expectedResult: undefined
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(FormUtils.findFormElementKey(testCase.element)).toEqual(testCase.expectedResult);
            });
        });
    });
});
