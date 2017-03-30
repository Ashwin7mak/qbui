import fieldFormats from '../../utils/fieldFormats';

export const SUPPORTED_FIELD_TYPES = [
    {
        titleI18nKey: 'builder.fieldGroups.text',
        fieldTypes: [
            fieldFormats.TEXT_FORMAT,
            fieldFormats.MULTI_LINE_TEXT_FORMAT,
            fieldFormats.MULTI_CHOICE_TEXT
        ]
    },
    {
        titleI18nKey: 'builder.fieldGroups.numeric',
        fieldTypes: [
            fieldFormats.NUMBER_FORMAT,
        ]
    },
    {
        titleI18nKey: 'builder.fieldGroups.other',
        fieldTypes: [
            fieldFormats.CHECKBOX_FORMAT,
        ]
    }
];

export function createFieldTypeProps(fieldType) {
    return {
        type: fieldType,
        title: fieldType,
        isNewField: true
    };
}
