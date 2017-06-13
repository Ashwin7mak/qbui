import _ from 'lodash';
import * as constants from '../../../common/src/constants';
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
    static canCreateNewParentRelationship(tableId, tables, relationships, newRelationshipFieldIds = []) {

        const otherTables = tables.filter(table => table.id !== tableId);
        if (tableId && otherTables.length) {

            let relatedParentTables = [];
            if (Array.isArray(relationships) && relationships.length > 0) {
                relatedParentTables = relationships.filter(rel => rel.detailTableId === tableId);
            }

            // enable new relationships to be created if we have multiple tables and at least
            // one of those tables is not already a parent table
            if (relatedParentTables.length + newRelationshipFieldIds.length < otherTables.length) {
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
    static getValidParentTablesForRelationship(existingRelationships, appTables, detailTable, deletedFields = []) {
        if (!detailTable || !Array.isArray(appTables) || !appTables.length) {
            return [];
        }

        let validParentTables = [];

        //remove the currentTable from the list -- cant create relationship to self.
        validParentTables = _.reject(appTables, table => table.id === detailTable.id);

        //remove tables that are already parents for the currentTable
        validParentTables = _.reject(validParentTables, table => _.find(existingRelationships, relation => (deletedFields.indexOf(relation.detailFieldId) === -1) && (relation.masterTableId === table.id) && (relation.detailTableId === detailTable.id)));

        //remove tables that already are in a relationship with detailTable as master to avoid circular relationships
        validParentTables = _.reject(validParentTables, table => _.find(existingRelationships, relation => (relation.masterTableId === detailTable.id) && (relation.detailTableId === table.id)));

        return validParentTables;
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

    /**
     * Given a field object figure out whether this field is allowed as a relationship key field or not
     * The decision is based on following constraints
     * - Must be unique
     * - Must be required
     * - Must be data type Text or Numeric
     *      -- No multi choice field (checked by field.multipleChoice)
     *      -- No multi line text field (checked by num_lines = 1)
     * @param field
     * @returns {*|boolean}
     */
    static isValidRelationshipKeyField(field) {
        let isTextOrNumeric = field.datatypeAttributes && field.datatypeAttributes.type === constants.TEXT || field.datatypeAttributes.type === constants.NUMERIC;
        let isMultiChoice = field.multipleChoice;
        let isMultiline = field.datatypeAttributes && field.datatypeAttributes.clientSideAttributes && field.datatypeAttributes.clientSideAttributes.num_lines ? field.datatypeAttributes.clientSideAttributes.num_lines > 1 : false;
        return field.unique && field.required && isTextOrNumeric && !isMultiChoice && !isMultiline;
    }
}

export default RelationshipUtils;
