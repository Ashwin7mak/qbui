import * as SchemaConsts from '../constants/schema';
import consts from '../../../common/src/constants';

class FieldUtils {
    /**
    * Determines what type of data has been provided and finds the unique record id field name
    * This is a helper method that can determine which type of data is available and get the record id field from it
    * @param {object} data
    * @returns {string}
    *
    */
    static getPrimaryKeyFieldName(data) {
        if (_.has(data, 'fields')) {
            return FieldUtils.getPrimaryKeyFieldNameFromFields(data);
        } else {
            return FieldUtils.getPrimaryKeyFieldNameFromData(data);
        }
    }

    /**
    * Gets the name of the field that is the unique identifier field (e.g., Record ID #)
    * even if it is no longer named Record ID #
    * @param {object} fields
    * @returns {string}
    */
    static getPrimaryKeyFieldNameFromFields(fields) {
        if (requiredFieldsArePresent(fields)) {
            let primaryKeyField = _.find(fields.fields.data, {id: SchemaConsts.DEFAULT_RECORD_KEY_ID});

            if (primaryKeyField) {
                return primaryKeyField.name;
            } else {
                return SchemaConsts.DEFAULT_RECORD_KEY;
            }
        } else {
            return SchemaConsts.DEFAULT_RECORD_KEY;
        }
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
    static getPrimaryKeyFieldNameFromData(rowData) {
        let primaryKeyFieldName = _.findKey(rowData, {id: SchemaConsts.DEFAULT_RECORD_KEY_ID});
        if (primaryKeyFieldName) {
            return primaryKeyFieldName;
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
     * Returns the label to be displayed for a fieldLabelElement.
     * @param {object} element
     *     {
     *         useAlternateLabel: <boolean>,
     *         displayText: <string>,
     *     }
     * @param {object} relatedField
     *     {
     *         name: <string>,
     *     }
     */
    static getFieldLabel(element, relatedField) {
        if (element && element.useAlternateLabel) {
            return element.displayText || '';
        } else if (relatedField) {
            return relatedField.name || '';
        } else {
            return '';
        }
    }

    /**
     * Returns whether a field should be considered editable or now based on fieldDef.
     * Rules: Built-in fields, non-Scalar fields and fields marked with userEditableValue=false are non-editable
     * @param fieldDef
     * @returns {boolean}
     */
    static isFieldEditable(fieldDef) {
        if (fieldDef) {
            // built in fields are not editable
            if (typeof fieldDef.builtIn !== 'undefined' && fieldDef.builtIn) {
                return false;
            }
            // field must be scalar (a non-generated field value)
            if (typeof fieldDef.type !== 'undefined' && fieldDef.type !== consts.SCALAR) {
                return false;
            }
            // field must be editable i.e. user editable not a restricted value
            if (typeof fieldDef.userEditableValue !== 'undefined' && !fieldDef.userEditableValue) {
                return false;
            }
            return true;
        }
        return false;
    }
}

// PRIVATE METHODS
function requiredFieldsArePresent(fields) {
    return fields && fields.fields && fields.fields.data && fields.fields.data.length;
}

export default FieldUtils;
