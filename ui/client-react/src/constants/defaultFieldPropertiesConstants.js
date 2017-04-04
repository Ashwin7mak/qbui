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
                "required": false
            }
    },

    DEFAULT_FORM_ELEMENT: {
        "FormFieldElement": {
            "displayText":"Ob",
            "displayOptions":["VIEW","ADD","EDIT"],
            "labelPosition":"LEFT",
            "type":"FIELD",
            "orderIndex": undefined,
            "positionSameRow":true,
            "useAlternateLabel":false,
            "readOnly":false,
            "required":false,
            "fieldId":11,
            "showAsRadio":false
        },
        "id": undefined,
        "orderIndex": 5
    },

    [FieldFormats.NUMBER_FORMAT]: {
        "datatypeAttributes": {
            "treatNullAsZero": true
        }
    },
};
