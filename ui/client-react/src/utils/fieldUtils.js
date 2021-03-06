import * as SchemaConsts from '../constants/schema';
import consts from '../../../common/src/constants';
import FieldFormats from '../utils/fieldFormats';
import Locale from '../locales/locales';
import * as durationFormatter from "../../../common/src/formatter/durationFormatter";
import _ from 'lodash';

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
        let fieldType = FieldFormats.getFormatType(relatedField);
        if (element && element.useAlternateLabel) {
            return element.displayText || '';
        } else if (relatedField) {
            return relatedField.name || Locale.getMessage(`fieldsDefaultLabels.${fieldType}`) || '';
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

    /**
     * Determines the field type for formula fields, for rendering purposes.
     * Defaults to the type that is sent in as argument. If the field definition indicates
     * a formula field type, attempt to get the type of formula field
     *
     * @param fieldDef
     * @param type
     * @param attributes
     * @returns {*}
     */
    static getFieldType(fieldDef, type, attributes) {
        // TODO - Make sure multiline works. https://quickbase.atlassian.net/browse/MB-1908
        let fieldType = type;
        if (fieldDef) {
            if (fieldDef.type === consts.FORMULA) {
                if (attributes && attributes.type) {
                    switch (attributes.type) {
                    case consts.NUMERIC:
                        fieldType = FieldFormats.NUMERIC_FORMULA_FORMAT;
                        break;
                    case consts.URL:
                        fieldType = FieldFormats.URL_FORMULA_FORMAT;
                        break;
                    case consts.TEXT:
                    default:
                        fieldType = FieldFormats.TEXT_FORMULA_FORMAT;
                    }
                }
            }
        }
        return fieldType;
    }

    static getDefaultValueForFieldType(type) {
        switch (type) {
        case SchemaConsts.CHECKBOX :
            return false;
        case SchemaConsts.DURATION :
            return null;
        default:
            return '';
        }
    }

    /**
     * * TODO:: Once AgGrid is removed, consider using the server field formats and get both the type specific class
     * https://quickbase.atlassian.net/browse/MB-1920
     *
     * Gets the css class for a specific field type
     * and alignment class
     * @param type
     * @param fieldDef
     * @returns {*}
     */
    static getFieldSpecificCellClass(type, fieldDef) {
        if (!type) {
            return 'textFormat';
        }

        switch (type) {
        case FieldFormats.DATE_FORMAT:            return "dateFormat";
        case FieldFormats.DATETIME_FORMAT:        return "dateTimeFormat";
        case FieldFormats.TIME_FORMAT:            return "timeFormat";
        case FieldFormats.NUMBER_FORMAT:          return "numberFormat";
        case FieldFormats.RATING_FORMAT:          return "ratingFormat";
        case FieldFormats.CURRENCY_FORMAT:        return "currencyFormat";
        case FieldFormats.PERCENT_FORMAT:         return "percentFormat";
        case FieldFormats.DURATION_FORMAT:        return getClassNameForDuration(fieldDef);
        case FieldFormats.PHONE_FORMAT:           return "phoneFormat";
        case FieldFormats.TEXT_FORMAT:            return "textFormat";
        case FieldFormats.MULTI_LINE_TEXT_FORMAT: return "multiLineTextFormat";
        case FieldFormats.USER_FORMAT:            return "userFormat";
        case FieldFormats.URL:                    return "urlFormat";
        case FieldFormats.EMAIL_ADDRESS:          return "emailFormat";
        case FieldFormats.TEXT_FORMULA_FORMAT:    return "formulaTextFormat";
        case FieldFormats.NUMERIC_FORMULA_FORMAT: return "formulaNumericFormat";
        case FieldFormats.URL_FORMULA_FORMAT:     return "formulaUrlFormat";
        case FieldFormats.CHECKBOX_FORMAT:        return 'checkboxFormat';
        case FieldFormats.LINK_TO_RECORD:         return 'linkToRecordFormat';
        default:                                  return "textFormat";
        }
    }

    /**
     * Gets the classes for a gridHeaderCell including alignment based on field type
     * @param fieldDef
     * @returns {string}
     */
    static getColumnHeaderClasses(fieldDef) {
        let classes = ['gridHeaderCell'];
        classes = [...classes, ...FieldUtils.getCellAlignmentClassesForFieldType(fieldDef)];
        return classes.join(' ');
    }

    /**
     * Gets the classes for a gridHeaderCell's label
     * @returns {string}
     */
    static getColumnHeaderLabelClasses() {
        return 'gridHeaderLabel';
    }
    /**
     * Get the alignment classes for a specific field type (e.g., numeric fields are aligned right in a grid)
     * @param fieldDef
     * @returns {Array}
     */
    static getCellAlignmentClassesForFieldType(fieldDef) {
        let classes = [];

        if (!_.has(fieldDef, 'datatypeAttributes.type')) {
            return classes;
        }

        switch (fieldDef.datatypeAttributes.type) {
        case consts.NUMERIC:
        case consts.CURRENCY:
        case consts.RATING:
        case consts.PERCENT:
            classes.push('AlignRight');
            break;
        case consts.CHECKBOX:
            classes.push('AlignCenter');
            break;
        case FieldFormats.DURATION_FORMAT:
            if (durationFormatter.hasUnitsText(fieldDef.datatypeAttributes.scale)) {
                classes.push('AlignRight');
            }
            break;
        default:
            classes.push('AlignLeft');
            break;
        }

        return classes;
    }
    static compareFieldValues(currentCellValues, nextCellValues) {
        let isDifferent = false;
        nextCellValues.some((currentCellValue, index) => {
            if (!_.has(currentCellValue, 'props.children.props.value' || !_.has(currentCellValues[index], 'props.children.props.value'))) {
                return false;
            }

            if (currentCellValue.props.children.props.value !== currentCellValues[index].props.children.props.value) {
                isDifferent = true;
                return true;
            }
        });

        return isDifferent;
    }

    /**
    * Returns the icon for a field type (used in Builder)
    * See spec for specific icons at https://quickbase.atlassian.net/wiki/display/qbasepd/Fields+List#FieldsList-VISUALDESIGN
    */
    static getFieldSpecificIcon(fieldType) {
        if (!fieldType) {
            return 'text';
        }

        switch (fieldType) {
        case FieldFormats.TEXT_FORMAT:                 return 'text';
        case FieldFormats.MULTI_LINE_TEXT_FORMAT:      return 'text-long';
        case FieldFormats.TEXT_FORMAT_MULTICHOICE:     return 'multiple-choice';
        case FieldFormats.TEXT_FORMAT_RADIO_BUTTONS:   return 'radio-buttons';
        case FieldFormats.CHECKBOX_FORMAT:             return 'selected';
        case FieldFormats.NUMBER_FORMAT:               return 'number';
        case FieldFormats.NUMBER_FORMAT_MULTICHOICE:   return 'multiple-choice';
        case FieldFormats.NUMBER_FORMAT_RADIO_BUTTONS: return 'radio-buttons';
        case FieldFormats.CURRENCY_FORMAT:             return 'currency';
        case FieldFormats.PERCENT_FORMAT:              return 'percentage';
        case FieldFormats.RATING_FORMAT:               return 'rating';
        case FieldFormats.DATE_FORMAT:                 return 'date';
        case FieldFormats.DATETIME_FORMAT:             return 'date-time';
        case FieldFormats.TIME_FORMAT:                 return 'time-of-day';
        case FieldFormats.DURATION_FORMAT:             return 'duration';
        case FieldFormats.EMAIL_ADDRESS:               return 'email-address';
        case FieldFormats.URL:                         return 'url';
        case FieldFormats.PHONE_FORMAT:                return 'phone-number';
        case FieldFormats.USER_FORMAT:                 return 'user';
        case FieldFormats.TEXT_FORMULA_FORMAT:         return 'formula';
        case FieldFormats.NUMERIC_FORMULA_FORMAT:      return 'formula';
        case FieldFormats.URL_FORMULA_FORMAT:          return 'formula';
        case FieldFormats.LIST_OF_RECORDS:             return 'report-table';
        case FieldFormats.LINK_TO_RECORD:              return 'url';
        default:                                       return 'text';
        }
    }

    /**
     * Figure out if a field is a recordTitleField on a table
     * @param currentTable
     * @param fieldId
     * @returns {boolean}
     */
    static isRecordTitleField(currentTable, fieldId) {
        return (currentTable && currentTable.recordTitleFieldId === fieldId) || false;
    }

    /**
     * Given a set of relationships, figure out if a field belonging to an app and table is a detail key field.
     * @param relationships
     * @param appId
     * @param tblId
     * @param fieldId
     * @returns {null}
     */
    static isDetailKeyField(relationships, appId, tblId, fieldId) {
        return _.find(relationships, {detailAppId: appId, detailTableId: tblId, detailFieldId: fieldId}) ? true : false;
    }
}

// PRIVATE METHODS
function requiredFieldsArePresent(fields) {
    return fields && fields.fields && fields.fields.data && fields.fields.data.length;
}

function getClassNameForDuration(fieldDef) {
    let answer = "durationFormat";
    if (_.has(fieldDef, 'datatypeAttributes.scale') &&
        durationFormatter.hasUnitsText(fieldDef.datatypeAttributes.scale)) {
        answer += " wUnitsText";
    }
    return answer;
}


export default FieldUtils;
