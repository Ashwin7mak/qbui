var _ = require('lodash');
var apiResponseErrors = require('../../../../constants/apiResponseErrors');
var Helpers = require('./apiResponseFormatterHelpers');

var UniqueFieldValidationErrorFormatter = {

    formatUniqueFieldValidationErrorsIfExist(message, requestBody) {

        if (responseHasUniqueValidationErrors(message)) {
            return formatUniqueValidationErrors(requestBody);
        }

        return [];
    }
};

function responseHasUniqueValidationErrors(message) {
    // Core API returns a NOT_UNIQUE_VALUE error when creating a new record,
    // but returns a 404 and a NOT_UNIQUE_VALUE_MESSAGE when editing a record
    // if the there is a unique validation error.
    // The 404 status code becomes a more accurate 422 if unique validation errors are found.
    // TODO:: Improve and return specific fields once core is updated.
    // Core story: https://quickbase.atlassian.net/browse/CORE-1052
    return Helpers.getErrorCode(message) === apiResponseErrors.NOT_UNIQUE_VALUE ||
        Helpers.getErrorMessage(message) === apiResponseErrors.NOT_UNIQUE_VALUE_MESSAGE;
}

function formatUniqueValidationErrors(requestBody) {
    var uniqueValidationErrors = [];

    requestBody.forEach(field => {
        // The Core API does not currently specify which fields failed the unique test, so this function
        // only applies the validation error to fields that are set as unique.
        if (_.has(field, 'fieldDef.unique') && field.fieldDef.unique) {
            uniqueValidationErrors.push(Helpers.formatFieldAsValidationError(field, {recordName: 'record'}));
        }
    });

    return uniqueValidationErrors;
}

module.exports = UniqueFieldValidationErrorFormatter;
