import fieldFormats from '../../utils/fieldFormats';
import Locale from '../../../../reuse/client/src/locales/locale';
import {createScalarDefaultFieldsProperties} from '../../utils/defaultFieldsProperties';

/**
 * A master list of supported field types that affect which field types are displayed in the new field menu in form builder.
 * NOTE: Currently unsupported fields are commented out to be added in a future PR.
 * @type {[*]}
 */
export const SUPPORTED_NEW_FIELD_TYPES = [
    {
        titleI18nKey: 'builder.fieldGroups.text',
        fieldTypes: [
            fieldFormats.TEXT_FORMAT,
            // fieldFormats.MULTI_LINE_TEXT_FORMAT,
            // fieldFormats.TEXT_FORMAT_MULTICHOICE,
            // fieldFormats.TEXT_FORMAT_RADIO_BUTTONS
        ]
    },
    {
        titleI18nKey: 'builder.fieldGroups.numeric',
        fieldTypes: [
            fieldFormats.NUMBER_FORMAT,
            fieldFormats.CURRENCY_FORMAT,
            fieldFormats.PERCENT_FORMAT,
            // fieldFormats.NUMBER_FORMAT_MULTICHOICE,
            // fieldFormats.NUMBER_FORMAT_RADIO_BUTTONS
        ]
    },
    {
        titleI18nKey: 'builder.fieldGroups.date',
        fieldTypes: [
            fieldFormats.DATE_FORMAT,
            fieldFormats.DATETIME_FORMAT,
            fieldFormats.TIME_FORMAT,
            fieldFormats.DURATION_FORMAT
        ]
    },
    {
        titleI18nKey: 'builder.fieldGroups.other',
        fieldTypes: [
            fieldFormats.CHECKBOX_FORMAT,
            // fieldFormats.USER_FORMAT,
            fieldFormats.URL,
            fieldFormats.EMAIL_ADDRESS,
            fieldFormats.PHONE_FORMAT,
            fieldFormats.RATING_FORMAT,
            // fieldFormats.TEXT_FORMULA_FORMAT,
            // fieldFormats.NUMERIC_FORMULA_FORMAT,
            // fieldFormats.URL_FORMULA_FORMAT
        ]
    }
];

/**
 * A helper function that has the supported fields along with the default props for each field type for display in form builder
 */
export const supportedNewFieldTypesWithProperties = () => {
    return SUPPORTED_NEW_FIELD_TYPES.map((fieldGroup, index) => {
        return {
            ...fieldGroup,
            key: `group_${index}`,
            title: Locale.getMessage(fieldGroup.titleI18nKey),
            children: fieldGroup.fieldTypes.map(fieldType => createFieldTypeProps(fieldType))
        };
    });
};

/**
 * Builds an object with the appropriate props for the field type. Includes localized field type names.
 * @param fieldType
 * @returns {{type: *, title: *, tooltipText: string, isNewField: boolean}}
 */
export function createFieldTypeProps(fieldType) {
    let title = Locale.getMessage(`fieldsDefaultLabels.${fieldType}`);

    return {
        key: `fieldType_${fieldType}`,
        type: fieldType,
        relatedField: {...createScalarDefaultFieldsProperties()[fieldType]},
        title,
        tooltipText: Locale.getMessage(`builder.formBuilder.tooltips.addNew${fieldType}`),
        isNewField: true
    };
}
