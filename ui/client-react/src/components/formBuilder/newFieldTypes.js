import consts from '../../../../common/src/constants';

export const SUPPORTED_FIELD_TYPES = [
    consts.CHECKBOX,
    consts.TEXT,
    consts.NUMERIC
];

export function createFieldTypeProps(fieldType) {
    return {
        type: fieldType,
        title: fieldType.toLowerCase(),
        isNewField: true
    };
}
