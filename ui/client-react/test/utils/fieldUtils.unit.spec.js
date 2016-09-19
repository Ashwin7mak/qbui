import FieldUtils from '../../src/utils/fieldUtils';
import * as SchemaConsts from '../../src/constants/schema';

describe('FieldUtils', () => {
    let testData;
    let recordIdCustomName = 'Employee ID';

    describe('getUniqueIdentifierFieldNameFromFields', () => {
        it('returns the default Record ID column name if no fields are provided', () => {
            testData = {};

            let field = FieldUtils.getUniqueIdentifierFieldNameFromFields(testData);
            expect(field).toBe(SchemaConsts.DEFAULT_RECORD_KEY);
        });

        it('returns the default Record ID column name if a Record ID column is not found', () => {
            testData = {
                fields: {
                    data: [
                        {id: 1, name: 'Last Name'},
                        {id: 2, name: 'First Name'}
                    ]
                }
            };

            let field = FieldUtils.getUniqueIdentifierFieldNameFromFields(testData);
            expect(field).toBe(SchemaConsts.DEFAULT_RECORD_KEY);
        });

        it('finds Record ID column name if the field name has not been changed', () => {
            testData = {
                fields: {
                    data: [
                        {id: 1, name: 'Last Name'},
                        {id: 2, name: 'First Name'},
                        {id: 3, name: SchemaConsts.DEFAULT_RECORD_KEY}
                    ]
                }
            };

            let field = FieldUtils.getUniqueIdentifierFieldNameFromFields(testData);
            expect(field).toBe(SchemaConsts.DEFAULT_RECORD_KEY);
        });

        it('finds the name of the Record ID field if the name has been changed to something else', () => {
            testData = {
                fields: {
                    data: [
                        {id: 1, name: 'Last Name'},
                        {id: 2, name: 'First Name'},
                        {id: 3, name: recordIdCustomName}
                    ]
                }
            };

            let field = FieldUtils.getUniqueIdentifierFieldNameFromFields(testData);
            expect(field).toBe(recordIdCustomName);
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
});
