import RelationshipUtils from '../../src/utils/relationshipUtils';

describe('RelationshipUtils', () => {

    describe('getValidParentTablesForRelationship', () => {
        let tables = [
            {id: "t1"},
            {id: "t2"},
            {id: "t3"}
        ];

        let existingRelationships = [
            {masterTableId: "t1", detailTableId: "t2"},
            {masterTableId: "t3", detailTableId: "t2"}
        ];
        let testCases = [
            {
                description: 'test no current table',
                detailTable: null,
                app: {tables, relationships: existingRelationships},
                deletedFields: [],
                newRelationshipFieldIds: [],
                expectedList: []
            },
            {
                description: 'test no app tables',
                detailTable: tables[0],
                app: {tables: [], relationships: existingRelationships},
                deletedFields: [],
                newRelationshipFieldIds: [],
                expectedList: []
            },
            {
                description: 'test null app tables',
                detailTable: tables[0],
                app: {tables: null, relationships: existingRelationships},
                deletedFields: [],
                newRelationshipFieldIds: [],
                expectedList: []
            },
            {
                description: 'test no existing relationship, filter out self',
                detailTable: tables[0],
                app: {tables, relationships: []},
                deletedFields: [],
                newRelationshipFieldIds: [],
                expectedList: [tables[1], tables[2]]
            },
            {
                description: 'test filter out existing masters',
                detailTable: tables[1],
                app: {tables, relationships: existingRelationships},
                deletedFields: [],
                newRelationshipFieldIds: [],
                expectedList: []
            },
            {
                description: 'test filter out circular relationships',
                detailTable: tables[0],
                app: {tables, relationships: [{masterTableId: "t1", detailTableId: "t2"}]},
                deletedFields: [],
                newRelationshipFieldIds: [],
                expectedList: [tables[2]]
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(RelationshipUtils.getValidParentTablesForRelationship(testCase.app, testCase.detailTable, testCase.fields, testCase.newRelationshipFieldIds, testCase.deletedFields)).toEqual(testCase.expectedList);
            });
        });
    });


    describe('isValidRelationshipKeyField', () => {

        let validTextField = {required: true, unique: true, datatypeAttributes: {type: "TEXT"}};
        let validNumericField = {required: true, unique: true, datatypeAttributes: {type: "NUMERIC"}};
        let nonRequiredField = {required: false, unique: true, datatypeAttributes: {type: "TEXT"}};
        let nonUniqueField = {required: true, unique: false, datatypeAttributes: {type: "NUMERIC"}};
        let multiLineTextField = {required: true, unique: false, datatypeAttributes: {type: "TEXT", clientSideAttributes: {num_lines: 5}}};
        let multiChoiceTextField = {required: true, unique: true, datatypeAttributes: {type: "TEXT"}, multipleChoice: []};
        let multiChoiceNumericField = {required: true, unique: true, datatypeAttributes: {type: "NUMERIC"}, multipleChoice: []};

        let testCases = [
            {
                description: 'return true for a unique, required, text field',
                field: validTextField,
                expectation: true
            },
            {
                description: 'return true for a unique, required, numeric field',
                field: validNumericField,
                expectation: true
            },
            {
                description: 'return false for non required field',
                field: nonRequiredField,
                expectation: false
            },
            {
                description: 'return false for non unique field',
                field: nonUniqueField,
                expectation: false
            },
            {
                description: 'return false for a multiline text field',
                field: multiLineTextField,
                expectation: false
            },
            {
                description: 'return false for a multi choice text field',
                field: multiChoiceTextField,
                expectation: false
            },
            {
                description: 'return false for a multi choice numeric field',
                field: multiChoiceNumericField,
                expectation: false
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(RelationshipUtils.isValidRelationshipKeyField(testCase.field)).toEqual(testCase.expectation);
            });
        });
    });
});
