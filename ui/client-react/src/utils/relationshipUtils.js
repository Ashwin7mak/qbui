import _ from 'lodash';
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

    /**
     * For a set of relationships and a list of tables, find the list of parents allowed for a new relationship to the given detailTable
     * @param existingRelationships
     * @param appTables
     * @param detailTable
     * @returns {Array}
     */
    static getValidParentTablesForRelationship(existingRelationships, appTables, detailTable) {
        if (!detailTable || !Array.isArray(appTables) || !appTables.length) {
            return [];
        }

        let validParentTables = [];

        //remove the currentTable from the list -- cant create relationship to self.
        validParentTables = _.reject(appTables, table => table.id === detailTable.id);

        //remove tables that are already parents for the currentTable
        validParentTables = _.reject(validParentTables, table => _.find(existingRelationships, relation => (relation.masterTableId === table.id) && (relation.detailTableId === detailTable.id)));

        //remove tables that already are in a relationship with detailTable as master to avoid circular relationships
        validParentTables = _.reject(validParentTables, table => _.find(existingRelationships, relation => (relation.masterTableId === detailTable.id) && (relation.detailTableId === table.id)));

        return validParentTables;
    }
}

export default RelationshipUtils;
