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
            {id: "t3", recordTitleFieldId: 999, fields}, // non-existing record title field
            {id: "t4", fields}, // no record id field
        ];

        let relationships = [
            {masterTableId: "t1", detailTableId: "t2"}
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
                relationships,
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
                description: 'returns false if no parent is available due to no valid parent',
                tableId: "t2",
                tables: tables,
                relationships,
                expectation: false
            },

        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                expect(RelationshipUtils.canCreateNewParentRelationship(testCase.tableId, testCase.tables, testCase.relationships)).toEqual(testCase.expectation);
            });
        });
    });
});
