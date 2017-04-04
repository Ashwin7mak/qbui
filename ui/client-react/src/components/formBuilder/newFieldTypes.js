import fieldFormats from '../../utils/fieldFormats';
import Locale from '../../../../reuse/client/src/locales/locale';

/**
 * A master list of supported that affect which field types are displayed in the new field menu in form builder.
 * @type {[*]}
 */
export const SUPPORTED_NEW_FIELD_TYPES = [
    {
        titleI18nKey: 'builder.fieldGroups.text',
        fieldTypes: [
            fieldFormats.TEXT_FORMAT,
            fieldFormats.MULTI_LINE_TEXT_FORMAT,
            fieldFormats.TEXT_FORMAT_MULTICHOICE,
            fieldFormats.TEXT_FORMAT_RADIO_BUTTONS
        ]
    },
    {
        titleI18nKey: 'builder.fieldGroups.numeric',
        fieldTypes: [
            fieldFormats.NUMBER_FORMAT,
            fieldFormats.CURRENCY_FORMAT,
            fieldFormats.PERCENT_FORMAT,
            fieldFormats.NUMBER_FORMAT_MULTICHOICE,
            fieldFormats.NUMBER_FORMAT_RADIO_BUTTONS
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
            fieldFormats.USER_FORMAT,
            fieldFormats.URL,
            fieldFormats.EMAIL_ADDRESS,
            fieldFormats.PHONE_FORMAT,
            fieldFormats.RATING_FORMAT,
            fieldFormats.TEXT_FORMULA_FORMAT,
            fieldFormats.NUMERIC_FORMULA_FORMAT,
            fieldFormats.URL_FORMULA_FORMAT
        ]
    }
];

/**
 * A helper constant that has the supported fields along with the default props for each field type for display in form builder
 * @type {Array}
 */
export const SUPPORTED_NEW_FIELDS_WITH_PROPERTIES = SUPPORTED_NEW_FIELD_TYPES.map(fieldGroup => {
    return {
        ...fieldGroup,
        fieldTypes: fieldGroup.fieldTypes.map(fieldType => createFieldTypeProps(fieldType))
    }
});

/**
 * Builds an object with the appropriate props for the field type. Includes localized field type names.
 * @param fieldType
 * @returns {{type: *, title: *, tooltipText: string, isNewField: boolean}}
 */
export function createFieldTypeProps(fieldType) {
    let title = Locale.getMessage(`fieldsDefaultLabels.${fieldType}`);
    let tooltipText = getTooltipForNewField(fieldType, title);

    return {
        key: fieldType,
        type: fieldType,
        isNewField: true,
        title,
        tooltipText
    };
}

export function getTooltipForNewField(fieldType, fieldName) {
    switch(fieldType) {
        case fieldFormats.CHECKBOX_FORMAT :
            return Locale.getMessage('builder.tooltips.addNewCheckboxTooltip');

        case fieldFormats.TEXT_FORMAT_MULTICHOICE :
        case fieldFormats.CURRENCY_FORMAT_MULTICHOICE :
        case fieldFormats.PERCENT_FORMAT_MULTICHOICE :
        case fieldFormats.NUMBER_FORMAT_MULTICHOICE :
        case fieldFormats.RATING_FORMAT_MULTICHOICE :
            return Locale.getMessage('builder.tooltips.addNewChoiceListTooltip');

        case fieldFormats.TEXT_FORMAT_RADIO_BUTTONS :
        case fieldFormats.NUMBER_FORMAT_RADIO_BUTTONS :
            return Locale.getMessage('builder.tooltips.addNewRadioListTooltip');

        default :
            return Locale.getMessage(`builder.tooltips.addNewFieldTooltip`, {fieldName});
    }
}