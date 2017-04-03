const serverTypeConsts = require('../../../common/src/constants');

let arrayOfTypes = [
    serverTypeConsts.NUMERIC,
    serverTypeConsts.DATE,
    serverTypeConsts.DURATION,
    serverTypeConsts.DATE_TIME,
    serverTypeConsts.TIME_OF_DAY,
    serverTypeConsts.CHECKBOX,
    serverTypeConsts.USER,
    serverTypeConsts.CURRENCY,
    serverTypeConsts.RATING,
    serverTypeConsts.PERCENT,
    serverTypeConsts.URL,
    serverTypeConsts.EMAIL_ADDRESS,
    serverTypeConsts.PHONE_NUMBER,
    serverTypeConsts.TEXT
    // serverTypeConsts.TEXT_FORMULA,
    // serverTypeConsts.URL_FORMULA,
    // serverTypeConsts.NUMERIC_FORMULA
];

let newFields = {};

let createDefaultFields = (typeArray) => {
    return typeArray.forEach((type) => {
        newFields[type] = {
                "type": "SCALAR",
                "datatypeAttributes": {
                    "type": type
                },
                "name": type
            }

    });
};

createDefaultFields(arrayOfTypes);

(function() {
    'use strict';
    module.exports = Object.freeze({
        ...newFields
    })
}());
