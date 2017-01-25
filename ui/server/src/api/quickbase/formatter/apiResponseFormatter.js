var Promise = require('bluebird');
var _ = require('lodash');
var errorCodes = require('../../../../../common/src/dataEntryErrorCodes');
var apiResponseErrors = require('../../../constants/apiResponseErrors');
var httpStatusCodes = require('../../../constants/httpStatusCodes');

const i18NUniqueValidationErrorKey = 'invalidMsg.api.notUniqueSingleField';
const i18NUniqueValidationErrorKeyMultiChoice = 'invalidMsg.api.notUniqueMultiChoice';
const i18NInvalidRecordKey = 'invalidMsg.api.invalidRecord';

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

function formatFieldAsValidationError(field, data, type) {
    var resultsCopy = {error: {}};
    resultsCopy.id = field.id;
    resultsCopy.value = field.value;
    resultsCopy.def = field;
    resultsCopy.error.code = errorCodes.INVALID_ENTRY;
    resultsCopy.error.messageId = getI18NValidationErrorMessageKey(field, type);
    resultsCopy.error.data = _.assign({}, {fieldName: field.fieldName}, data);
    resultsCopy.isInvalid = true;
    return resultsCopy;
}

function getI18NValidationErrorMessageKey(field, type) {
    if (type === apiResponseErrors.INVALID_RECORD) {
        return i18NInvalidRecordKey;
    }


    if (_.has(field, 'fieldDef.multipleChoice.choices')) {
        return i18NUniqueValidationErrorKeyMultiChoice;
    }

    return i18NUniqueValidationErrorKey;
}

function getErrorCode(message) {
    if (message && _.isObject(message)) {
        return message.code;
    }

    return null;
}

function getErrorMessage(message) {
    if (message && _.isObject(message)) {
        return message.message;
    }

    return null;
}

function responseHasUniqueValidationErrors(message) {
    // Core API returns a NOT_UNIQUE_VALUE error when creating a new record,
    // but returns a 404 and a NOT_UNIQUE_VALUE_MESSAGE when editing a record
    // if the there is a unique validation error.
    // The 404 status code becomes a more accurate 422 if unique validation errors are found.
    // TODO:: Improve and return specific fields once core is updated.
    // Core story: https://quickbase.atlassian.net/browse/CORE-1052
    return getErrorCode(message) === apiResponseErrors.NOT_UNIQUE_VALUE ||
        getErrorMessage(message) === apiResponseErrors.NOT_UNIQUE_VALUE_MESSAGE;
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

function responseHasInvalidRecord(message) {
    return getErrorCode(message) === apiResponseErrors.INVALID_RECORD;
}

function formatInvalidRecordErrors(requestBody, message) {
    var errorMessage = getErrorMessage(message);
    var fieldId = null;
    if (errorMessage && _.isString(errorMessage)) {
        fieldId = /field\s\d+\s/.exec(errorMessage);
        if (fieldId) {
            fieldId = parseInt(fieldId[0].replace(/\D/g, ''));

            var field = requestBody.find(currentField => currentField.id === fieldId);
            if (field) {
                return [formatFieldAsValidationError(field, {}, apiResponseErrors.INVALID_RECORD)];
            }
        }
    }

    return [];
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
    // Holds the value of the current error message being evaluated
    currentErrorMessage: null,

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

        if (Array.isArray(responseBodyAsJson)) {
            responseBodyAsJson.forEach(message => {
                if (responseHasUniqueValidationErrors(message)) {
                    formattedErrors = formattedErrors.concat(formatUniqueValidationErrors(requestBodyAsJson));
                } else if (responseHasInvalidRecord(message)) {
                    formattedErrors = formattedErrors.concat(formatInvalidRecordErrors(requestBodyAsJson, message));
                }
            });
        }

        if (formattedErrors.length > 0) {
            return Promise.reject({response:{message:'validation error', status: httpStatusCodes.UNPROCESSABLE_ENTITY, errors: formattedErrors}});
        }

        return returnPayload(payload);
    }
};

module.exports = ApiResponseFormatter;
