import FieldFormats from '../../src/utils/fieldFormats';
const serverTypeConsts = require('../../../common/src/constants');


export const testCases = [
    {
        type: FieldFormats.NUMBER_FORMAT,
        serverType: serverTypeConsts.NUMERIC,
        expectedResult: {
            type: "SCALAR",
            datatypeAttributes: {
                type: "NUMERIC",
                treatNullAsZero: true
            },
            name: "Number",
            required: false
        }
    },
    {
        type: FieldFormats.NUMBER_FORMAT,
        serverType: serverTypeConsts.NUMERIC,
        userDefault: {datatypeAttributes: {treatNullAsZero: false, decimalPlaces: 2}, pizza: 'yummy'},
        expectedResult: {
            type: "SCALAR",
            datatypeAttributes: {
                type: "NUMERIC",
                treatNullAsZero: false,
                decimalPlaces: 2
            },
            pizza: 'yummy',
            name: "Number",
            required: false
        }
    },
    {
        type: FieldFormats.DATE_FORMAT,
        serverType: serverTypeConsts.DATE_FORMAT,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "DATE"
            },
            "name": "Date",
            "required": false
        }
    },
    {
        type: FieldFormats.DURATION_FORMAT,
        serverType: serverTypeConsts.DURATION,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "DURATION"
            },
            "name": "Duration",
            "required": false
        }
    },
    {
        type: FieldFormats.DATETIME_FORMAT,
        serverType: serverTypeConsts.DATE_TIME,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "DATE_TIME"
            },
            "name": "Time stamp",
            "required": false
        }
    },
    {
        type: FieldFormats.TIME_OF_DAY,
        serverType: serverTypeConsts.TIME_OF_DAY,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "TIME_OF_DAY"
            },
            "name": "Time of day",
            "required": false
        }
    },
    {
        type: FieldFormats.CHECKBOX_FORMAT,
        serverType: serverTypeConsts.CHECKBOX,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "CHECKBOX"
            },
            "name": "Checkbox",
            "required": false
        }
    },
    {
        type: FieldFormats.USER_FORMAT,
        serverType: serverTypeConsts.USER,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "USER"
            },
            "name": "User",
            "required": false
        }
    },
    {
        type: FieldFormats.CURRENCY_FORMAT,
        serverType: serverTypeConsts.CURRENCY,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "CURRENCY"
            },
            "name": "Currency",
            "required": false
        }
    },
    {
        type: FieldFormats.RATING_FORMAT,
        serverType: serverTypeConsts.RATING,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "RATING"
            },
            "name": "Rating",
            "required": false
        }
    },
    {
        type: FieldFormats.PERCENT_FORMAT,
        serverType: serverTypeConsts.PERCENT,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "PERCENT"
            },
            "name": "Percentage",
            "required": false
        }
    },
    {
        type: FieldFormats.URL,
        serverType: serverTypeConsts.URL,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "URL"
            },
            "name": "Url",
            "required": false
        }
    },
    {
        type: FieldFormats.EMAIL_ADDRESS,
        serverType: serverTypeConsts.EMAIL_ADDRESS,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "EMAIL_ADDRESS"
            },
            "name": "Email",
            "required": false
        }
    },
    {
        type: FieldFormats.PHONE_FORMAT,
        serverType: serverTypeConsts.PHONE_NUMBER,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "PHONE_NUMBER"
            },
            "name": "Phone",
            "required": false
        }
    },
    {
        type: FieldFormats.TEXT_FORMAT,
        serverType: serverTypeConsts.TEXT,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "TEXT"
            },
            "name": "Text",
            "required": false
        }
    }
];
