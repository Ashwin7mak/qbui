var Promise = require('bluebird');
var _ = require('lodash');
var apiResponseErrors = require('../../../constants/apiResponseErrors');
var httpStatusCodes = require('../../../constants/httpStatusCodes');
var uniqueFieldValidationError = require('./apiResponseFormatters/uniqueFieldValidationErrorFormatter');
var invalidRecordError = require('./apiResponseFormatters/invalidRecordErrorFormatter');



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

/**
 * Helps format response errors from Core.
 * Formatters for particular types of errors are in the /apiResponseFormatters directory.
 * A response formatter should return an empty array if the error type does not match the one for the formatter or
 * an array of formatted errors.
 * @type {{currentErrorMessage: null, formatResponseError: ApiResponseFormatter.formatResponseError}}
 */
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
                formattedErrors = formattedErrors.concat(
                    uniqueFieldValidationError.formatUniqueFieldValidationErrorsIfExist(message, requestBodyAsJson),
                    invalidRecordError.formatInvalidRecordErrorsIfExist(message, requestBodyAsJson)
                );
            });
        }

        if (formattedErrors.length > 0) {
            return Promise.reject({response:{message:'validation error', status: httpStatusCodes.UNPROCESSABLE_ENTITY, errors: formattedErrors}});
        }

        return returnPayload(payload);
    }
};



module.exports = ApiResponseFormatter;
