import fieldFormats from '../../utils/fieldFormats';

export const SUPPORTED_FIELD_TYPES = [
    {
        titleI18nKey: 'builder.fieldGroups.text',
        fieldTypes: [
            fieldFormats.TEXT_FORMAT,
            fieldFormats.MULTI_LINE_TEXT_FORMAT
        ]
    },
    {
        titleI18nKey: 'builder.fieldGroups.numeric',
        fieldTypes: [
            fieldFormats.NUMBER_FORMAT,
            fieldFormats.CURRENCY_FORMAT,
            fieldFormats.PERCENT_FORMAT
        ]
    },
    {
        titleI18nKey: 'builder.fieldGroups.date',
        fieldTypes: [
            fieldFormats.DATE_FORMAT,
            fieldFormats.DATETIME_FORMAT,
            fieldFormats.DURATION_FORMAT,

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
            fieldFormats.RATING_FORMAT
        ]
    }
];

export function createFieldTypeProps(fieldType) {
    return {
        type: fieldType,
        title: fieldType,
        tooltipText: 'Add new field',
        isNewField: true
    };
}
