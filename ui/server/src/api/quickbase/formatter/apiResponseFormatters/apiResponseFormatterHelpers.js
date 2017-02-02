var _ = require('lodash');
var apiResponseErrors = require('../../../../constants/apiResponseErrors');
var errorCodes = require('../../../../../../common/src/dataEntryErrorCodes');


const i18NUniqueValidationErrorKey = 'invalidMsg.api.notUniqueSingleField';
const i18NUniqueValidationErrorKeyMultiChoice = 'invalidMsg.api.notUniqueMultiChoice';
const i18NInvalidRecordKey = 'invalidMsg.api.invalidRecord';

var ApiResponseFormatterHelpers = {
    i18NUniqueValidationErrorKey: 'invalidMsg.api.notUniqueSingleField',
    i18NUniqueValidationErrorKeyMultiChoice: 'invalidMsg.api.notUniqueMultiChoice',
    i18NInvalidRecordKey: 'invalidMsg.api.invalidRecord',

    getErrorCode(message) {
        if (message && _.isObject(message)) {
            return message.code;
        }

        return null;
    },

    getErrorMessage(message) {
        if (message && _.isObject(message)) {
            return message.message;
        }

        return null;
    },

    getFieldId(message) {
        if (message && _.isObject(message)) {
            return message.fieldId;
        }
    },

    getI18NValidationErrorMessageKey(field, type) {
        if (type === apiResponseErrors.INVALID_RECORD) {
            return i18NInvalidRecordKey;
        }


        if (_.has(field, 'fieldDef.multipleChoice.choices')) {
            return i18NUniqueValidationErrorKeyMultiChoice;
        }

        return i18NUniqueValidationErrorKey;
    },

    formatFieldAsValidationError(field, data, type) {
        var resultsCopy = {error: {}};
        resultsCopy.id = field.id;
        resultsCopy.value = field.value;
        resultsCopy.def = field;
        resultsCopy.error.code = errorCodes.INVALID_ENTRY;
        resultsCopy.error.messageId = this.getI18NValidationErrorMessageKey(field, type);
        resultsCopy.error.data = _.assign({}, {fieldName: field.fieldName}, data);
        resultsCopy.isInvalid = true;
        return resultsCopy;
    }
};

module.exports = ApiResponseFormatterHelpers;
