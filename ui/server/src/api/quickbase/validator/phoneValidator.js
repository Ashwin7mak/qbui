(function() {
    'use strict';
    var _ = require('lodash');
    var phoneFormatter = require('../formatter/phoneNumberFormatter');
    var dataErrorCodes = require('../../../../../common/src/dataEntryErrorCodes');


    var phoneValidator = {
        /**
         * Validate a phone number and either pass through the existing result or update with new validation error
         * A number is valid when it is determined to be a real number by Google Libphonenumber or could be
         * an emergency number.
         * @param value
         * @param fieldName
         * @param result
         * @returns {*}
         */
        validateAndReturnResults: function(value, fieldName, result) {
            if (!value) {
                return result;
            }

            var phoneNumber = phoneFormatter.parse(value);

            if (!phoneNumber.isValid && this._isNotLikelyEmergencyNumber(phoneNumber)) {
                var resultsCopy = _.assign({error: {}}, result);
                resultsCopy.error.code = dataErrorCodes.INVALID_ENTRY;
                resultsCopy.error.messageId = this._getInvalidMessage(phoneNumber);
                resultsCopy.error.data = {fieldName: fieldName};
                resultsCopy.isInvalid = true;
                return resultsCopy;
            }

            return result;
        },

        _isNotLikelyEmergencyNumber(phoneNumber) {
            return phoneNumber.withoutSpecialCharacters.length !== 3;
        },

        _getInvalidMessage(phoneNumber) {
            return 'invalidMsg.phone';

            // TODO:: Provide contextual error messages once we can save the country code
            // if (phoneNumber.invalidReason === phoneFormatter.PHONE_VALIDATION_ERRORS.INVALID_COUNTRY_CODE) {
            //     return 'invalidMsg.phoneInvalidCountryCode';
            // } else {
            //     return 'invalidMsg.phone';
            // }
        }
    };

    module.exports = phoneValidator;
}());
