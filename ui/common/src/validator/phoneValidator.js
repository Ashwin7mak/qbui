(function() {
    var dataErrorCodes = require('../dataEntryErrorCodes');
    var phoneFormatter = require('../formatter/phoneNumberFormatter');

    /**
     * This is a basic first pass at validating phone numbers. More complete validation happens on the server
     * through the Google Libphonenumber Library on save. See server/src/api/quickbase/validator/phoneNumberValidator.js
     * @type {{validateAndReturnResults: phoneValidator.validateAndReturnResults, _isValidLengthForPhoneNumber: ((phoneNumber))}}
     */
    var phoneValidator = {
        validateAndReturnResults: function(phoneNumber, fieldName, results) {
            if (!phoneNumber || phoneNumber.length === 0) {
                return results;
            }

            var phoneNumberOnly = phoneFormatter.getPhoneNumber(phoneNumber);
            phoneNumberOnly = phoneFormatter.stripSpecialCharacters(phoneNumberOnly);

            if (!this._isValidLengthForPhoneNumber(phoneNumberOnly)) {
                var resultsCopy = Object.assign({error: {}}, results);

                resultsCopy.error.code = dataErrorCodes.INVALID_ENTRY;
                resultsCopy.error.messageId = 'invalidMsg.phone';
                resultsCopy.error.data = {fieldName: fieldName};
                resultsCopy.isInvalid = true;
                return resultsCopy;
            }

            return results;
        },

        _isValidLengthForPhoneNumber: function(phoneNumber) {
            return (phoneNumber.length === 3 || phoneNumber.length === 4 || phoneNumber.length >= 7);
        },
    };

    module.exports = phoneValidator;
}());
