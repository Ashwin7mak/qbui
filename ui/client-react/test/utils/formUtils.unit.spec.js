import {findFormElementKey, getRecordTitle} from '../../src/utils/formUtils';

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
                expect(findFormElementKey(testCase.element)).toEqual(testCase.expectedResult);
            });
        });
    });

    describe('getRecordTitle', () => {
        let testCases = [
            {
                description: 'returns empty string if no table is passed in',
                table: null,
                record: {},
                recId: null,
                expectedResult: ''
            },
            {
                description: 'returns table noun if table is passed in but no record',
                table: {tableNoun: "noun", name: "name"},
                record: null,
                recId: null,
                expectedResult: "noun"
            },
            {
                description: 'returns table noun + recId if table is passed in + recId but no record',
                table: {tableNoun: "noun", name: "name"},
                record: null,
                recId: 2,
                expectedResult: "noun #2"
            },
            {
                description: 'returns table name if table is passed w/o noun and no record',
                table: {name: "name"},
                record: null,
                recId: null,
                expectedResult: "name"
            },
            {
                description: 'returns table name + recId if table is passed w/o noun + recId and no record',
                table: {name: "name"},
                record: null,
                recId: 2,
                expectedResult: "name #2"
            },
            {
                description: 'returns table noun if table is passed in w/o recordTitleFieldId with record',
                table: {tableNoun: "noun", name: "name"},
                record: [{id: 1, value: 'abc', display: 'abc'}],
                recId: null,
                expectedResult: "noun"
            },
            {
                description: 'returns table noun if table is passed in with recordTitleFieldId with record wo/o values for that fieldId',
                table: {tableNoun: "noun", name: "name", recordTitleFieldId: 3},
                record: [{id: 1, value: 'abc', display: 'abc'}],
                recId: null,
                expectedResult: "noun"
            },
            {
                description: 'returns recordTitle field value if table + record is passed in',
                table: {tableNoun: "noun", name: "name", recordTitleFieldId: 3},
                record: [{id: 1, value: 'abc', display: 'abc'}, {id: 3, value: 'xy', display: 'xyz'}],
                recId: null,
                expectedResult: "xyz"
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(getRecordTitle(testCase.table, testCase.record, testCase.recId)).toEqual(testCase.expectedResult);
            });
        });
    });
});
