import FieldFormats from '../../src/utils/fieldFormats';
import Locale from '../locales/locales';

export const defaultOptionsI18nPath = 'builder.defaultMultichoiceOptions';

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

    [FieldFormats.TEXT_FORMAT_MULTICHOICE]: {
        "name": Locale.getMessage(`fieldsDefaultLabels.${FieldFormats.TEXT_FORMAT_MULTICHOICE}`),
        "multipleChoice": {
            "allowNew": false,
            "choices": [
                {"coercedValue": {"value": Locale.getMessage(`${defaultOptionsI18nPath}.first`)}, "displayValue": Locale.getMessage(`${defaultOptionsI18nPath}.first`)},
                {"coercedValue": {"value": Locale.getMessage(`${defaultOptionsI18nPath}.second`)}, "displayValue": Locale.getMessage(`${defaultOptionsI18nPath}.second`)},
                {"coercedValue": {"value": Locale.getMessage(`${defaultOptionsI18nPath}.third`)}, "displayValue": Locale.getMessage(`${defaultOptionsI18nPath}.third`)}
            ],
            "sortAsGiven": false
        }
    },

    [FieldFormats.USER_FORMAT]: {
        "indexed": true
    }
};
