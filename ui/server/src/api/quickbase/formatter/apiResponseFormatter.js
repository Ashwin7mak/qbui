var _ = require('lodash');
var errorCodes = require('../../../../../common/src/dataEntryErrorCodes');
var Promise = require('bluebird');

var defaultValidationResult = {
    value: null,
    def: null,
    isInvalid : false,
    error : {
        messageId : null,
        code : null,
        data: {}
    },
};

function parseRequestBodyAsJson(payload) {

}

// function convertApiErrorToI18nMessageKey(error, subtype) {
//     switch (error) {
//     case 'NotUniqueKeyFieldValue' :
//         if (subtype === 'singleField') {
//             return 'invalidMsg.api.notUniqueSingleField';
//         } else if (subtype === 'multichoice') {
//             return 'invalidMsg.api.notUniqueMultiChoice';
//         }
//         break;
//     }
// }

function formatFieldAsValidationError(field, i18nErrorKey, data) {
    var resultsCopy = _.assign({}, defaultValidationResult);
    resultsCopy.id = field.id;
    resultsCopy.value = field.value;
    resultsCopy.def = field;
    resultsCopy.error.code = errorCodes.INVALID_ENTRY;
    resultsCopy.error.messageId = i18nErrorKey;
    resultsCopy.error.data = Object.assign({}, {fieldName: field.fieldName}, data);
    resultsCopy.isInvalid = true;
    return resultsCopy;
}

var ApiResponseFormatter = {

    formatResponseError: function(payload) {
        var formattedErrors = [];
        var requestBodyAsJson = [];
        if (_.has(payload, 'request.body') && _.isString(payload.request.body)) {
            requestBodyAsJson = JSON.parse(payload.request.body);
        }

        requestBodyAsJson.forEach(field => {
            if (_.has(field, 'fieldDef.unique') && field.fieldDef.unique) {
                formattedErrors.push(formatFieldAsValidationError(field, 'invalidMsg.api.notUniqueSingleField', {recordName: 'record'}));
            }
        });

        var payloadWithValidationErrors = _.assign({}, payload);
        payloadWithValidationErrors.body = JSON.stringify([_.assign(JSON.parse(payload.body)[0], {response: {errors: formattedErrors}})]);
        return Promise.reject({response:{message:'validation error', status: 422, errors: formattedErrors}});
    }
};

module.exports = ApiResponseFormatter;
