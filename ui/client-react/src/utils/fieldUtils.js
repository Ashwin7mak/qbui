import * as SchemaConsts from '../constants/schema';

class FieldUtils {
    /**
    * Determines what type of data has been provided and finds the unique record id field name
    * This is a helper method that can determine which type of data is available and get the record id field from it
    * @param {object} data
    * @returns {string}
    *
    */
    static getUniqueIdentifierFieldName(data) {
        if (_.has(data, 'fields')) {
            return FieldUtils.getUniqueIdentifierFieldNameFromFields(data);
        } else {
            return FieldUtils.getUniqueIdentifierFieldNameFromData(data);
        }
    }

    /**
    * Gets the name of the field that is the unique identifier field (e.g., Record ID #)
    * even if it is no longer named Record ID #
    * @param {object} fields
    * @returns {string}
    */
    static getUniqueIdentifierFieldNameFromFields(fields) {
        if (requiredFieldsArePresent(fields)) {
            let uniqueIdentifierField = _.find(fields.fields.data, {id: SchemaConsts.DEFAULT_RECORD_KEY_ID});
            if (uniqueIdentifierField) {
                return uniqueIdentifierField.name;
            } else {
                return SchemaConsts.DEFAULT_RECORD_KEY;
            }
        } else {
            return SchemaConsts.DEFAULT_RECORD_KEY;
        }
    }

    /**
     * gets the maxlength from the field def if specified
     * @param fieldDef - the field definition
     * @returns maxlenght or undefined
     */
    static getMaxLength(fieldDef) {
        let maxLength;
        if (fieldDef && _.has(fieldDef, 'datatypeAttributes.clientSideAttributes.max_chars') &&
            fieldDef.datatypeAttributes.clientSideAttributes.max_chars > 0) {
            maxLength =  fieldDef.datatypeAttributes.clientSideAttributes.max_chars;
        }
        return maxLength;
    }

    /**
    * Gets the name for the unique identifier row from grid data
    * even if the Record ID # field has been renamed
    * @param {object} rowData
    *    {
    *        fieldName: {
    *            id: 3 // this is the field id
    *            value: 2
    *            display: "2"
    *        }
    *    }
    * @returns {string}
    */
    static getUniqueIdentifierFieldNameFromData(rowData) {
        let recordIdField = _.findKey(rowData, {id: SchemaConsts.DEFAULT_RECORD_KEY_ID});
        if (recordIdField) {
            return recordIdField;
        } else {
            return SchemaConsts.DEFAULT_RECORD_KEY;
        }
    }
}

// PRIVATE METHODS
function requiredFieldsArePresent(fields) {
    return fields && fields.fields && fields.fields.data && fields.fields.data.length;
}

export default FieldUtils;
