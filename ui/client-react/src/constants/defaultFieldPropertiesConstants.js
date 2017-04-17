import FieldFormats from '../../src/utils/fieldFormats';
import Locale from '../locales/locales';

export const DefaultFieldProperties = {
    defaultScalarFieldsProperties(type, fieldType) {
        return {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": type
            },
            "name": Locale.getMessage(`fieldsDefaultLabels.${fieldType}`),
            "required": false,
            "userEditableValue": true
        };
    },

    [FieldFormats.NUMBER_FORMAT]: {
        "datatypeAttributes": {
            "treatNullAsZero": true
        }
    },
};
