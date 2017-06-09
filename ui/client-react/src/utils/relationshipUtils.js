/**
 * relationship utils
 */
class RelationshipUtils {

    /**
     * can we create a new parent relationship to table with id
     * @param tableId child table ID
     * @param tables existing app tables
     * @param relationships existing app relationships
     * @returns {boolean}
     */
    static canCreateNewParentRelationship(tableId, tables, relationships, newRelationshipFieldIds) {

        const otherTables = tables.filter(table => table.id !== tableId);
        if (tableId && otherTables.length) {

            let relatedParentTables = [];
            if (Array.isArray(relationships) && relationships.length > 0) {
                relatedParentTables = relationships.filter(rel => rel.detailTableId === tableId);
            }

            // enable new relationships to be created if we have multiple tables and at least
            // one of those tables is not already a parent table
            if (relatedParentTables.length + newRelationshipFieldIds.length < otherTables.length ) {
                return true;
            }
        }
        return false;
    }
}

export default RelationshipUtils;
