import RelationshipUtils from '../../src/utils/relationshipUtils';

describe('RelationshipUtils', () => {
    describe('canCreateNewParentRelationship', () => {

        let fields = [
            {id:1},
            {id:2},
            {id:3}
        ];

        let tables = [
            {id: "t1", recordTitleFieldId: 1, fields}, // only valid parent table
            {id: "t2", recordTitleFieldId: 1, fields}, // existing relationship to parent
            {id: "t3", fields}, // no record title field
        ];

        let relationships = [
            {masterTableId: "t1", detailTableId: "t2"}
        ];

        let allRelationships = [
            {masterTableId: "t1", detailTableId: "t2"},
            {masterTableId: "t3", detailTableId: "t2"}
        ];

        let testCases = [
            {
                description: 'returns true if parent is still available',
                tableId: "t3",
                tables: tables,
                relationships,
                expectation: true
            },
            {
                description: 'returns true if parent is still available due to no relationships',
                tableId: "t2",
                tables: tables,
                relationships: [],
                expectation: true
            },
            {
                description: 'returns false if no parent is available due to existing relationship',
                tableId: "t2",
                tables: tables,
                relationships: allRelationships,
                expectation: false
            },
            {
                description: 'returns false if no parent is available due to no tables',
                tableId: "t2",
                tables: [],
                relationships,
                expectation: false
            },
            {
                description: 'returns true if parent is available without having a recordTitleFieldId',
                tableId: "t2",
                tables: tables,
                relationships,
                expectation: true
            },

        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(RelationshipUtils.canCreateNewParentRelationship(testCase.tableId, testCase.tables, testCase.relationships)).toEqual(testCase.expectation);
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
