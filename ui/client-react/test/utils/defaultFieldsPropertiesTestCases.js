import FieldFormats from '../../src/utils/fieldFormats';
import Locale from '../../src/locales/locales';
import {defaultOptionsI18nPath} from '../../src/constants/defaultFieldPropertiesConstants';
const serverTypeConsts = require('../../../common/src/constants');

const standardProperties = {
    type: "SCALAR",
    required: false,
    userEditableValue: true
};

const testCases = [
    {
        type: FieldFormats.NUMBER_FORMAT,
        serverType: serverTypeConsts.NUMERIC,
        expectedResult: {
            ...standardProperties,
            datatypeAttributes: {
                type: "NUMERIC",
                treatNullAsZero: true
            },
            name: "Number"
        }
    },
    {
        type: FieldFormats.NUMBER_FORMAT,
        serverType: serverTypeConsts.NUMERIC,
        userDefault: {datatypeAttributes: {treatNullAsZero: false, decimalPlaces: 2}, pizza: 'yummy'},
        expectedResult: {
            ...standardProperties,
            datatypeAttributes: {
                type: "NUMERIC",
                treatNullAsZero: false,
                decimalPlaces: 2
            },
            pizza: 'yummy',
            name: "Number"
        }
    },
    {
        type: FieldFormats.DATE_FORMAT,
        serverType: serverTypeConsts.DATE_FORMAT,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "DATE"
            },
            "name": "Date"
        }
    },
    {
        type: FieldFormats.DURATION_FORMAT,
        serverType: serverTypeConsts.DURATION,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "DURATION"
            },
            "name": "Duration"
        }
    },
    {
        type: FieldFormats.DATETIME_FORMAT,
        serverType: serverTypeConsts.DATE_TIME,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "DATE_TIME"
            },
            "name": "Time stamp"
        }
    },
    {
        type: FieldFormats.TIME_FORMAT,
        serverType: serverTypeConsts.TIME_OF_DAY,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "TIME_OF_DAY"
            },
            "name": "Time of day"
        }
    },
    {
        type: FieldFormats.CHECKBOX_FORMAT,
        serverType: serverTypeConsts.CHECKBOX,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "CHECKBOX"
            },
            "name": "Checkbox"
        }
    },
    {
        type: FieldFormats.USER_FORMAT,
        serverType: serverTypeConsts.USER,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "USER"
            },
            "name": "User",
            "indexed": true
        }
    },
    {
        type: FieldFormats.CURRENCY_FORMAT,
        serverType: serverTypeConsts.CURRENCY,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "CURRENCY"
            },
            "name": "Currency"
        }
    },
    {
        type: FieldFormats.RATING_FORMAT,
        serverType: serverTypeConsts.RATING,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "RATING"
            },
            "name": "Rating"
        }
    },
    {
        type: FieldFormats.PERCENT_FORMAT,
        serverType: serverTypeConsts.PERCENT,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "PERCENT"
            },
            "name": "Percentage"
        }
    },
    {
        type: FieldFormats.URL,
        serverType: serverTypeConsts.URL,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "URL"
            },
            "name": "URL"
        }
    },
    {
        type: FieldFormats.EMAIL_ADDRESS,
        serverType: serverTypeConsts.EMAIL_ADDRESS,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "EMAIL_ADDRESS"
            },
            "name": "Email"
        }
    },
    {
        type: FieldFormats.PHONE_FORMAT,
        serverType: serverTypeConsts.PHONE_NUMBER,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "PHONE_NUMBER"
            },
            "name": "Phone"
        }
    },
    {
        type: FieldFormats.TEXT_FORMAT,
        serverType: serverTypeConsts.TEXT,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "TEXT"
            },
            "name": "Text"
        }
    },
    {
        type: FieldFormats.TEXT_FORMAT_MULTICHOICE,
        serverType: serverTypeConsts.TEXT,
        expectedResult: {
            ...standardProperties,
            "datatypeAttributes": {
                "type": "TEXT"
            },
            "name": "Choice list",
            "multipleChoice": {
                "allowNew": false,
                "choices": [
                    {"coercedValue": {"value": Locale.getMessage(`${defaultOptionsI18nPath}.first`)}, "displayValue": Locale.getMessage(`${defaultOptionsI18nPath}.first`)},
                    {"coercedValue": {"value": Locale.getMessage(`${defaultOptionsI18nPath}.second`)}, "displayValue": Locale.getMessage(`${defaultOptionsI18nPath}.second`)},
                    {"coercedValue": {"value": Locale.getMessage(`${defaultOptionsI18nPath}.third`)}, "displayValue": Locale.getMessage(`${defaultOptionsI18nPath}.third`)}
                ],
                "sortAsGiven": false
            }
        }
    }
];

export default testCases;
