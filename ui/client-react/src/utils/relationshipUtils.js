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

        const validParentTables = tables.filter(table => table.recordTitleFieldId && table.fields && table.fields.find(field => field.id === table.recordTitleFieldId));
        if (tableId && validParentTables.length) {

            let parentTables = [];
            if (Array.isArray(relationships) && relationships.length > 0) {
                parentTables = relationships.filter(rel => rel.detailTableId === tableId);
            }

            // enable new relationships to be created if we have multiple tables with recordTitleFieldId and at least
            // one of those tables is not already a parent table
            if (validParentTables.length > 1 && (parentTables.length < validParentTables.length - 1)) {
                return true;
            }
        }
        return false;
    }
}

export default RelationshipUtils;
