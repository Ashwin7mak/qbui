const serverTypeConsts = require('../../../common/src/constants');

export const testCases = [
    {
        type: serverTypeConsts.NUMERIC,
        expectedResult: {
            type: "SCALAR",
            datatypeAttributes: {
                type: "NUMERIC",
                treatNullAsZero: true,
                decimalPlaces: 0
            },
            name: "Number",
            required: false
        }
    },
    {
        type: serverTypeConsts.NUMERIC,
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
        type: serverTypeConsts.DATE,
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
        type: serverTypeConsts.DURATION,
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
        type: serverTypeConsts.DATE_TIME,
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
        type: serverTypeConsts.TIME_OF_DAY,
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
        type: serverTypeConsts.CHECKBOX,
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
        type: serverTypeConsts.USER,
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
        type: serverTypeConsts.CURRENCY,
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
        type: serverTypeConsts.RATING,
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
        type: serverTypeConsts.PERCENT,
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
        type: serverTypeConsts.URL,
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
        type: serverTypeConsts.EMAIL_ADDRESS,
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
        type: serverTypeConsts.PHONE_NUMBER,
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
        type: serverTypeConsts.TEXT,
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
