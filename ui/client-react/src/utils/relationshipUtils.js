/**
 * relationship utils
 */
class RelationshipUtils {

    static canCreateNewParentRelationship(tableId, tables, relationships) {

        if (tableId && tables) {

            let parentTables = [];
            if (Array.isArray(relationships) && relationships.length > 0) {
                parentTables = relationships.filter(rel => rel.detailTableId === tableId);
            }

            // enable new relationships to be created if we have multiple tables and at least
            // one of the remaining tables is not already a parent table
            if (tables.length > 1 && (parentTables.length < tables.length - 1)) {
                return true;
            }
        }
        return false;
    }
}

export default RelationshipUtils;
