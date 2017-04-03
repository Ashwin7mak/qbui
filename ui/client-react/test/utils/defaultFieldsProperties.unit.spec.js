import DefaultFieldProperties from '../../src/utils/defaultFieldsProperties';
import jasmineEnzyme from 'jasmine-enzyme';
const serverTypeConsts = require('../../../common/src/constants');

let testCases = [
    {
        type: serverTypeConsts.NUMERIC,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "NUMERIC"
            },
            "name": "Number"
        }
    },
    {
        type: serverTypeConsts.DATE,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "DATE"
            },
            "name": "Date"
        }
    },
    {
        type: serverTypeConsts.DURATION,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "DURATION"
            },
            "name": "Duration"
        }
    },
    {
        type: serverTypeConsts.DATE_TIME,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "DATE_TIME"
            },
            "name": "Time stamp"
        }
    },
    {
        type: serverTypeConsts.TIME_OF_DAY,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "TIME_OF_DAY"
            },
            "name": "Time of day"
        }
    },
    {
        type: serverTypeConsts.CHECKBOX,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "CHECKBOX"
            },
            "name": "Checkbox"
        }
    },
    {
        type: serverTypeConsts.USER,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "USER"
            },
            "name": "User"
        }
    },
    {
        type: serverTypeConsts.CURRENCY,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "CURRENCY"
            },
            "name": "Currency"
        }
    },
    {
        type: serverTypeConsts.RATING,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "RATING"
            },
            "name": "Rating"
        }
    },
    {
        type: serverTypeConsts.PERCENT,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "PERCENT"
            },
            "name": "Percentage"
        }
    },
    {
        type: serverTypeConsts.URL,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "URL"
            },
            "name": "Url"
        }
    },
    {
        type: serverTypeConsts.EMAIL_ADDRESS,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "EMAIL_ADDRESS"
            },
            "name": "Email"
        }
    },
    {
        type: serverTypeConsts.PHONE_NUMBER,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "PHONE_NUMBER"
            },
            "name": "Phone"
        }
    },
    {
        type: serverTypeConsts.TEXT,
        expectedResult: {
            "type": "SCALAR",
            "datatypeAttributes": {
                "type": "TEXT"
            },
            "name": "Text"
        }
    },
];

describe('DefaultFieldsProperties', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    testCases.forEach(function(test) {
        it('should do something', () => {
           let result = DefaultFieldProperties.createScalarDefaultFieldsProperties()[test.type];
            expect(result).toEqual(test.expectedResult);
        });
    });
});