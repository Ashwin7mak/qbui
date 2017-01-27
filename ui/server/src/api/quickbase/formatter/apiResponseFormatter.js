var Promise = require('bluebird');
var _ = require('lodash');
var errorCodes = require('../../../../../common/src/dataEntryErrorCodes');
var apiResponseErrors = require('../../../constants/apiResponseErrors');
var httpStatusCodes = require('../../../constants/httpStatusCodes');

const i18NUniqueValidationErrorKey = 'invalidMsg.api.notUniqueSingleField';
const i18NUniqueValidationErrorKeyMultiChoice = 'invalidMsg.api.notUniqueMultiChoice';

function parseRequestBodyAsJson(payload) {
    if (_.has(payload, 'request.body')) {
        if (_.isString(payload.request.body)) {
            return JSON.parse(payload.request.body);
        } else {
            return payload.request.body;
        }
    }

    return [];
}

function parseResponseBodyAsJson(payload) {
    if (_.has(payload, 'body')) {
        if (_.isString(payload.body)) {
            return JSON.parse(payload.body);
        } else {
            return payload.body;
        }
    }

    return [];
}

function formatFieldAsValidationError(field, data) {
    var resultsCopy = {error: {}};
    resultsCopy.id = field.id;
    resultsCopy.value = field.value;
    resultsCopy.def = field;
    resultsCopy.error.code = errorCodes.INVALID_ENTRY;
    resultsCopy.error.messageId = getI18NValidationErrorMessageKey(field);
    resultsCopy.error.data = _.assign({}, {fieldName: field.fieldName}, data);
    resultsCopy.isInvalid = true;
    return resultsCopy;
}

function getI18NValidationErrorMessageKey(field) {
    if (_.has(field, 'fieldDef.multipleChoice.choices')) {
        return i18NUniqueValidationErrorKeyMultiChoice;
    }

    return i18NUniqueValidationErrorKey;
}

function transformResponseBodyToObject(responseBody) {
    if (_.isArray(responseBody) && _.isObject(responseBody[0])) {
        return responseBody[0];
    }

    return null;
}

function getErrorCode(responseBody) {
    var transformedResponseBody = transformResponseBodyToObject(responseBody);

    if (transformedResponseBody) {
        return transformedResponseBody.code;
    }

    return null;
}

function getErrorMessage(responseBody) {
    var transformedResponseBody = transformResponseBodyToObject(responseBody);

    if (transformedResponseBody) {
        return transformedResponseBody.message;
    }

    return null;
}

function responseHasUniqueValidationErrors(responseBody) {
    // Core API returns a NOT_UNIQUE_VALUE error when creating a new record,
    // but returns a 404 and a NOT_UNIQUE_VALUE_MESSAGE when editing a record
    // if the there is a unique validation error.
    // The 404 status code becomes a more accurate 422 if unique validation errors are found.
    // TODO:: Improve and return specific fields once core is updated.
    // Core story: https://quickbase.atlassian.net/browse/CORE-1052
    return getErrorCode(responseBody) === apiResponseErrors.NOT_UNIQUE_VALUE ||
        getErrorMessage(responseBody) === apiResponseErrors.NOT_UNIQUE_VALUE_MESSAGE;
}

function formatUniqueValidationErrors(requestBody) {
    var uniqueValidationErrors = [];

    requestBody.forEach(field => {
        // The Core API does not currently specify which fields failed the unique test, so this function
        // only applies the validation error to fields that are set as unique.
        if (_.has(field, 'fieldDef.unique') && field.fieldDef.unique) {
            uniqueValidationErrors.push(formatFieldAsValidationError(field, {recordName: 'record'}));
        }
    });

    return uniqueValidationErrors;
}

/**
 * The promise needs to be rejected if the response is not ok. If the promise is not rejected,
 * the response will be incorrectly marked as 200.
 * @param payload
 * @returns {*}
 */
function returnPayload(payload) {
    if (payload.statusCode >= 400) {
        return Promise.reject(payload);
    }

    return payload;
}

var ApiResponseFormatter = {
    /**
     * Accepts an error response from the Core API and formats it for use in the UI layer.
     * Consider carefully before adding an error handler here. Could this be caught in a Node layer validator? If so, add it there.
     * This only affects errors which cannot be evaluated by the Node server layer (e.g., unique values).
     * @param payload
     * @returns {*}
     */
    formatResponseError: function(payload) {
        var formattedErrors = [];
        var requestBodyAsJson = parseRequestBodyAsJson(payload);
        var responseBodyAsJson = parseResponseBodyAsJson(payload);

        if (responseHasUniqueValidationErrors(responseBodyAsJson)) {
            formattedErrors = formattedErrors.concat(formatUniqueValidationErrors(requestBodyAsJson));
        }

        if (formattedErrors.length > 0) {
            return Promise.reject({response:{message:'validation error', status: httpStatusCodes.UNPROCESSABLE_ENTITY, errors: formattedErrors}});
        }

        return returnPayload(payload);
    }
};

module.exports = ApiResponseFormatter;
