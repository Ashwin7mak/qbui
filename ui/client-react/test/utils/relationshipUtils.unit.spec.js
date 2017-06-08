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
});
