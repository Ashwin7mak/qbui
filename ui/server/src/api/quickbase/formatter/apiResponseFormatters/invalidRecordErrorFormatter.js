var _ = require('lodash');
var apiResponseErrors = require('../../../../constants/apiResponseErrors');
var Helpers = require('./apiResponseFormatterHelpers');

var InvalidRecordErrorFormatter = {
    formatInvalidRecordErrorsIfExist(message, requestBody) {
        if (responseHasInvalidRecord(message)) {
            return formatInvalidRecordErrors(requestBody, message);
        }

        return [];
    }
};

function responseHasInvalidRecord(message) {
    return Helpers.getErrorCode(message) === apiResponseErrors.INVALID_RECORD;
}

function formatInvalidRecordErrors(requestBody, message) {
    var field = requestBody.find(currentField => currentField.id === Helpers.getFieldId(message));
    if (field) {
        return [Helpers.formatFieldAsValidationError(field, {}, apiResponseErrors.INVALID_RECORD)];
    }

    return [];
}

module.exports = InvalidRecordErrorFormatter;
