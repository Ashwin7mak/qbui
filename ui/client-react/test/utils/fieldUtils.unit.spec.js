import FieldUtils from '../../src/utils/fieldUtils';
import * as SchemaConsts from '../../src/constants/schema';
import consts from '../../../common/src/constants';

describe('FieldUtils', () => {
    let testData;
    let recordIdCustomName = 'Employee ID';

    describe('getUniqueIdentifierFieldNameFromFields', () => {

        let testCases = [
            {
                name: 'returns the default Record ID column name if no fields are provided',
                data: {},
                expectation: SchemaConsts.DEFAULT_RECORD_KEY
            },
            {
                name: 'returns the default Record ID column name if a Record ID column is not found',
                data: {
                    fields: {
                        data: [
                            {id: 1, name: 'Last Name'},
                            {id: 2, name: 'First Name'}
                        ]
                    }
                },
                expectation: SchemaConsts.DEFAULT_RECORD_KEY
            },
            {
                name: 'finds Record ID column name if the field name has not been changed',
                data: {
                    fields: {
                        data: [
                            {id: 1, name: 'Last Name'},
                            {id: 2, name: 'First Name'},
                            {id: 3, name: SchemaConsts.DEFAULT_RECORD_KEY}
                        ]
                    }
                },
                expectation: SchemaConsts.DEFAULT_RECORD_KEY
            },
            {
                name: 'finds the name of the Record ID field if the name has been changed to something else',
                data: {
                    fields: {
                        data: [
                            {id: 1, name: 'Last Name'},
                            {id: 2, name: 'First Name'},
                            {id: 3, name: recordIdCustomName}
                        ]
                    }
                },
                expectation: recordIdCustomName
            }
        ];

        testCases.forEach(function(testCase) {
            it(testCase.name, () => {
                let field = FieldUtils.getUniqueIdentifierFieldNameFromFields(testCase.data);
                expect(field).toBe(testCase.expectation);
            });
        });

    });

    describe('getUniqueIdentifierFieldNameFromData', () => {
        it('returns the default Record ID column name if the provided data is misisng that info', () => {
            testData = {};

            let field = FieldUtils.getUniqueIdentifierFieldNameFromData(testData);
            expect(field).toBe(SchemaConsts.DEFAULT_RECORD_KEY);
        });

        it('returns the Record ID column name if it has not been changed', () => {
            testData = {};
            testData[SchemaConsts.DEFAULT_RECORD_KEY] = {
                id: 3,
                value: 8,
                display: '8'
            };
            testData['First Name'] = {
                id: 1,
                value: 'Bob',
                display: 'Bob'
            };

            let field = FieldUtils.getUniqueIdentifierFieldNameFromData(testData);
            expect(field).toBe(SchemaConsts.DEFAULT_RECORD_KEY);
        });

        it('returns the Record ID column name if it has been changed', () => {
            testData = {
                'First Name': {
                    id: 1,
                    value: 'Bob',
                    display: 'Bob'
                }
            };
            testData[recordIdCustomName] = {
                id: 3,
                value: 8,
                display: '8'
            };

            let field = FieldUtils.getUniqueIdentifierFieldNameFromData(testData);
            expect(field).toBe(recordIdCustomName);
        });
    });

    describe('getUniqueIdentifierFieldName', () => {
        it('gets the Record ID column name from row data', () => {
            testData = {};
            testData[recordIdCustomName] = {
                id: 3,
                value: 8,
                display: '8'
            };
            testData['First Name'] = {
                id: 1,
                value: 'Bob',
                display: 'Bob'
            };

            let field = FieldUtils.getUniqueIdentifierFieldName(testData);
            expect(field).toBe(recordIdCustomName);
        });

        it('gets the Record ID column name from a list of fields', () => {
            testData = {
                fields: {
                    data: [
                        {id: 1, name: 'Last Name'},
                        {id: 3, name: recordIdCustomName},
                        {id: 2, name: 'First Name'}
                    ]
                }
            };

            let field = FieldUtils.getUniqueIdentifierFieldName(testData);
            expect(field).toBe(recordIdCustomName);
        });

        it('provides the default Record ID column name if it cannot identify the data', () => {
            testData = {};

            let field = FieldUtils.getUniqueIdentifierFieldName(testData);
            expect(field).toBe(SchemaConsts.DEFAULT_RECORD_KEY);
        });
    });

    describe('test getMaxLength', () => {
        let maxtest = 10;
        let testCases = [
            {
                name: 'no fieldDef provided',
                data: {},
                expectation: undefined
            },
            {
                name: 'partial fieldDef provided datatypeAttributes',
                data: {datatypeAttributes : {}},
                expectation: undefined
            },
            {
                name: 'partial fieldDef provided clientSideAttributes',
                data: {datatypeAttributes : {clientSideAttributes : {}}},
                expectation: undefined
            },
            {
                name: 'max_chars 0 unlimited length',
                data: {datatypeAttributes : {clientSideAttributes : {max_chars: 0}}},
                expectation: undefined
            },
            {
                name: 'max_chars ' + maxtest,
                data: {datatypeAttributes : {clientSideAttributes : {max_chars: maxtest}}},
                expectation: maxtest
            },
        ];
        testCases.forEach(function(testCase) {
            it(testCase.name, () => {
                let max = FieldUtils.getMaxLength(testCase.data);
                expect(max).toBe(testCase.expectation);
            });
        });
    });

    describe('test isFieldEditable', () => {
        let testCases = [
            {
                name: 'no fieldDef provided',
                data: {},
                expectation: true
            },
            {
                name: 'partial fieldDef provided builtin',
                data: {builtIn : true},
                expectation: false
            },
            {
                name: 'partial fieldDef provided type',
                data: {type : consts.CONCRETE},
                expectation: false
            },
            {
                name: 'partial fieldDef provided userEditableValue',
                data: {userEditableValue : false},
                expectation: false
            },
            {
                name: 'fieldDef as expected',
                data: {userEditableValue : true},
                expectation: true
            },
        ];
        testCases.forEach(function(testCase) {
            it(testCase.name, () => {
                let result = FieldUtils.isFieldEditable(testCase.data);
                expect(result).toBe(testCase.expectation);
            });
        });
    });
});
