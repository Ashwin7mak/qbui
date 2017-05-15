import _ from 'lodash';
import * as SchemaConsts from '../constants/schema';

/**
 * The data structure of the formMeta has elements (array) of element. Element has a property, but it changes depending on the type.
 * E.g., Element.FormFieldElement.positionSameRow or Element.FormTextElement.positionSameRow
 * We don't know what type of element this might be (FormFieldElement, HeaderElement, FormTextElement, etc.)
 * so we are going to find it via duck typing. If it has a positionSameRow attribute, that is the one we want.
 * Returns the element key or undefined.
 * @param element
 * @returns {*}
 */
export function findFormElementKey(element) {
    if (!element || !_.isObject(element)) {
        return undefined;
    }

    return Object.keys(element).find(key => {
        if (element[key]) {
            return (element[key].positionSameRow !== undefined);
        }
    });
}

/**
 * Given a table and a record this method calculates what should show as the record title
 * If the table has a recordTitleFieldId set and a value for that field is available on the record then that value is used.
 * Otherwise if no record is available fallback to table noun + recId
 * Otherwise if no tableNoun is available fallback to tableName + recId
 * @param table
 * @param record
 * @param recId
 * @returns {string}
 */

export function getRecordTitle(table, record, recId) {
    if (!table) {
        return "";
    }

    let defaultRecordTitle = (table.tableNoun ? table.tableNoun : table.name) + (recId && recId !== SchemaConsts.UNSAVED_RECORD_ID ? " #" + recId : "");
    if (!record) {
        return defaultRecordTitle;
    }

    let recordName = "";
    if (table.recordTitleFieldId) {
        let recordIdField = _.find(record, (field) =>{
            return field.id === table.recordTitleFieldId;
        });
        recordName = recordIdField ? recordIdField.display : "";
    }

    if (_.isEmpty(recordName)) {
        recordName = defaultRecordTitle;
    }
    return recordName;
}
