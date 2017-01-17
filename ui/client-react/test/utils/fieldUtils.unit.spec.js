import FieldUtils from '../../src/utils/fieldUtils';
import * as SchemaConsts from '../../src/constants/schema';
import consts from '../../../common/src/constants';
import FieldFormats from '../../src/utils/fieldFormats';
import {DURATION_CONSTS} from '../../../common/src/constants';

describe('FieldUtils', () => {
    let testData;
    let recordIdCustomName = 'Employee ID';

    describe('getPrimaryKeyFieldNameFromFields', () => {

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
                let field = FieldUtils.getPrimaryKeyFieldNameFromFields(testCase.data);
                expect(field).toBe(testCase.expectation);
            });
        });

    });

    describe('getPrimaryKeyFieldNameFromData', () => {
        it('returns the default Record ID column name if the provided data is misisng that info', () => {
            testData = {};

            let field = FieldUtils.getPrimaryKeyFieldNameFromData(testData);
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

            let field = FieldUtils.getPrimaryKeyFieldNameFromData(testData);
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

            let field = FieldUtils.getPrimaryKeyFieldNameFromData(testData);
            expect(field).toBe(recordIdCustomName);
        });
    });

    describe('getPrimaryKeyFieldName', () => {
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

            let field = FieldUtils.getPrimaryKeyFieldName(testData);
            expect(field).toBe(recordIdCustomName);
        });

        it('gets the Record ID column name from a list of fields', () => {
            testData = {
                fields: {
                    data: [
                        {id: 1, name: 'Last Name'},
                        {id: 3, keyField: true, name: recordIdCustomName},
                        {id: 2, name: 'First Name'}
                    ]
                }
            };

            let field = FieldUtils.getPrimaryKeyFieldName(testData);
            expect(field).toBe(recordIdCustomName);
        });

        it('provides the default Record ID column name if it cannot identify the data', () => {
            testData = {};

            let field = FieldUtils.getPrimaryKeyFieldName(testData);
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

    describe(`getFieldLabel retrieves a fieldLabel's 'label' to be displayed`, () => {
        const relatedField = {
            id: 6,
            name: 'field',
        };
        const element = {
            fieldId: 6,
            type: 'FIELD',
        };
        const altElement = Object.assign({
            useAlternateLabel: true,
            displayText: 'alternate text',
        }, element);

        it(`when a label is specified via relatedField's 'name' property`, () => {
            const label = FieldUtils.getFieldLabel(element, relatedField);
            expect(label).toEqual(relatedField.name);
        });

        it(`when an alternate label is specified`, () => {
            const label = FieldUtils.getFieldLabel(altElement, relatedField);
            expect(label).toEqual(altElement.displayText);
        });

        it(`returns an empty string when no label is specified`, () => {
            const label = FieldUtils.getFieldLabel();
            expect(label).toEqual('');
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

    describe('getDefaultValueForFieldType', () => {
        let testCases = [
            {
                description: 'it gets the default value for a checkbox',
                fieldType: SchemaConsts.CHECKBOX,
                expectedValue: false
            },
            {
                description: 'it gets the default value for duration fields',
                fieldType: SchemaConsts.DURATION,
                expectedValue: 0
            },
            {
                description: 'it gets the default value for other types not specifically checked',
                fieldType: SchemaConsts.TEXT,
                expectedValue: ''
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(FieldUtils.getDefaultValueForFieldType(testCase.fieldType)).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('getFieldSpecificCellClass', () => {
        let testCases = [
            {
                description: 'get class for Date Field',
                type: FieldFormats.DATE_FORMAT,
                expectedValue: 'dateFormat'
            },
            {
                description: 'get class for DateTime Field',
                type: FieldFormats.DATETIME_FORMAT,
                expectedValue: 'dateTimeFormat'
            },
            {
                description: 'get class for Time Field',
                type: FieldFormats.TIME_FORMAT,
                expectedValue: 'timeFormat'
            },
            {
                description: 'get class for Numeric Field',
                type: FieldFormats.NUMBER_FORMAT,
                expectedValue: 'numberFormat'
            },
            {
                description: 'get class for Rating Field',
                type: FieldFormats.RATING_FORMAT,
                expectedValue: 'ratingFormat'
            },
            {
                description: 'get class for Currency Field',
                type: FieldFormats.CURRENCY_FORMAT,
                expectedValue: 'currencyFormat'
            },
            {
                description: 'get class for Percent Field',
                type: FieldFormats.PERCENT_FORMAT,
                expectedValue: 'percentFormat'
            },
            {
                description: 'get class for Phone Field',
                type: FieldFormats.PHONE_FORMAT,
                expectedValue: 'phoneFormat'
            },
            {
                description: 'get class for Text Field',
                type: FieldFormats.TEXT_FORMAT,
                expectedValue: 'textFormat'
            },
            {
                description: 'get class for MultiLineText Field',
                type: FieldFormats.MULTI_LINE_TEXT_FORMAT,
                expectedValue: 'multiLineTextFormat'
            },
            {
                description: 'get class for User Field',
                type: FieldFormats.USER_FORMAT,
                expectedValue: 'userFormat'
            },
            {
                description: 'get class for URL Field',
                type: FieldFormats.URL,
                expectedValue: 'urlFormat'
            },
            {
                description: 'get class for Email Field',
                type: FieldFormats.EMAIL_ADDRESS,
                expectedValue: 'emailFormat'
            },
            {
                description: 'get class for Formula Text Field',
                type: FieldFormats.TEXT_FORMULA_FORMAT,
                expectedValue: 'formulaTextFormat'
            },
            {
                description: 'get class for Formula Number Field',
                type: FieldFormats.NUMERIC_FORMULA_FORMAT,
                expectedValue: 'formulaNumericFormat'
            },
            {
                description: 'get class for Formula Url Field',
                type: FieldFormats.URL_FORMULA_FORMAT,
                expectedValue: 'formulaUrlFormat'
            },
            {
                description: 'get class for Checkbox Field',
                type: FieldFormats.CHECKBOX_FORMAT,
                expectedValue: 'checkboxFormat'
            },
            {
                description: 'get class for Duration Field (default)',
                type: FieldFormats.DURATION_FORMAT,
                expectedValue: 'durationFormat'
            },
            {
                description: 'get class for Duration Field with Scale',
                type: FieldFormats.DURATION_FORMAT,
                fieldDef: {
                    datatypeAttributes: {
                        scale: DURATION_CONSTS.SCALES.WEEKS
                    }
                },
                expectedValue: 'durationFormat wUnitsText'
            },
            {
                description: 'get class for Duration Field without Scale',
                type: FieldFormats.DURATION_FORMAT,
                fieldDef: {
                    datatypeAttributes: {
                        scale: DURATION_CONSTS.SCALES.HHMM
                    }
                },
                expectedValue: 'durationFormat'
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(FieldUtils.getFieldSpecificCellClass(testCase.type, testCase.fieldDef)).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('getColumnHeaderClasses', () => {
        it('gets the classes for a header column', () => {
            const fieldDef = {datatypeAttributes: {type: SchemaConsts.CHECKBOX}};
            spyOn(FieldUtils, 'getCellAlignmentClassesForFieldType').and.returnValue(['AlignCenter']);
            expect(FieldUtils.getColumnHeaderClasses(fieldDef)).toEqual('gridHeaderCell AlignCenter');
            expect(FieldUtils.getCellAlignmentClassesForFieldType).toHaveBeenCalledWith(fieldDef);
        });
    });

    describe('getCellAlignmentClassesForFieldType', () => {
        const AlignLeft = ['AlignLeft'];
        const AlignCenter = ['AlignCenter'];
        const AlignRight = ['AlignRight'];

        let testCases = [
            {
                description: 'aligns left by default',
                type: null,
                expectedValue: AlignLeft
            },
            {
                description: 'gets alignment for Numeric',
                type: SchemaConsts.NUMERIC,
                expectedValue: AlignRight
            },
            {
                description: 'gets alignment for Currency',
                type: SchemaConsts.CURRENCY,
                expectedValue: AlignRight
            },
            {
                description: 'gets alignment for Rating',
                type: SchemaConsts.RATING,
                expectedValue: AlignRight
            },
            {
                description: 'gets alignment for Percent',
                type: SchemaConsts.PERCENT,
                expectedValue: AlignRight
            },
            {
                description: 'gets alignment for Checkbox',
                type: SchemaConsts.CHECKBOX,
                expectedValue: AlignCenter
            },
            {
                description: 'gets alignment for Duration',
                type: SchemaConsts.DURATION,
                expectedValue: AlignLeft
            },
            {
                description: 'gets alignment for Duration with Scale',
                type: SchemaConsts.DURATION,
                scale: DURATION_CONSTS.SCALES.WEEKS,
                expectedValue: AlignLeft
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(FieldUtils.getCellAlignmentClassesForFieldType({
                    datatypeAttributes: {
                        type: testCase.type, // <-- Important line here!
                        scale: testCase.scale // Only used for duration fields
                    }
                })).toEqual(testCase.expectedValue);
            });
        });
    });

    // TODO:: Increase complexity of this test once we use this again for render performance improvements in QbGrid
    describe('compareFieldValues', () => {
        it('returns false if there are no values to compare', () => {
            expect(FieldUtils.compareFieldValues([], [])).toEqual(false);
        });
    });
});
