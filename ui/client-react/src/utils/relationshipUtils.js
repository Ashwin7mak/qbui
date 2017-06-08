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
    static canCreateNewParentRelationship(tableId, tables, relationships) {

        const validParentTables = tables.filter(table => table.id !== tableId);
        if (tableId && validParentTables.length) {

            let parentTables = [];
            if (Array.isArray(relationships) && relationships.length > 0) {
                parentTables = relationships.filter(rel => rel.detailTableId === tableId);
            }

            // enable new relationships to be created if we have multiple tables and at least
            // one of those tables is not already a parent table
            if (validParentTables.length > 0 && (parentTables.length < validParentTables.length)) {
                return true;
            }
        }
        return false;
    }
}

export default RelationshipUtils;
