import _ from 'lodash';
import * as constants from '../../../common/src/constants';
/**
 * relationship utils
 */
class RelationshipUtils {

    /**
     * For a set of relationships and a list of tables, find the list of parents allowed for a new relationship to the given detailTable
     * @param existingRelationships
     * @param appTables
     * @param detailTable
     * @returns {Array}
     */
    static getValidParentTablesForRelationship(app, detailTable, fields, newRelationshipFieldIds, deletedFields) {

        if (!detailTable || !Array.isArray(app.tables) || !app.tables.length) {
            return [];
        }

        const fieldsList = _.find(fields, fieldList => fieldList.appId === app.id && fieldList.tblId === detailTable.id);

        let linkToRecordFields = [];
        if (fieldsList) {
            linkToRecordFields = _.filter(fieldsList.fields, field => newRelationshipFieldIds.indexOf(field.id) !== -1);
        }

        let validParentTables = _.reject(app.tables, table => _.find(linkToRecordFields, field => field.parentTableId === table.id));

        //remove the currentTable from the list -- cant create relationship to self.
        validParentTables = _.reject(validParentTables, table => table.id === detailTable.id);

        //remove tables that are already parents for the currentTable
        validParentTables = _.reject(validParentTables, table => _.find(app.relationships, relation => deletedFields.indexOf(relation.detailFieldId) === -1 && (relation.masterTableId === table.id) && (relation.detailTableId === detailTable.id)));

        //remove tables that already are in a relationship with detailTable as master to avoid circular relationships
        validParentTables = _.reject(validParentTables, table => _.find(app.relationships, relation => (relation.masterTableId === detailTable.id) && (relation.detailTableId === detailTable.id)));

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
