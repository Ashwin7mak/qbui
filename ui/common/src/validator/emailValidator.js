(function() {
    var emailFormatter = require('../formatter/emailFormatter');
    var dataErrorCodes = require('../dataEntryErrorCodes');

    var FULL_EMAIL_ADDRESS_REGEX = /^[_A-Za-z0-9-!#$%&'*+/=?^`{|}~]+(?:\.[_A-Za-z0-9-!#$%&'*+/=?^`{|}~]+)*@[A-Za-z0-9]+[A-za-z0-9-]+(?:\.[A-Za-z0-9-]+)*(?:\.[A-Za-z]{2,})$/;

    module.exports = {
        /**
         * Validate an email address
         * @param email
         * @returns {boolean}
         */
        isValid: function(email) {
            // Don't validate empty strings
            if (!email) {
                return true;
            }

            // Split multiple email addresses
            var emails = emailFormatter.splitEmails(email);

            var valid = true;
            emails.forEach(function(splitEmail) {
                if (!FULL_EMAIL_ADDRESS_REGEX.test(splitEmail)) {
                    valid = false;
                }
            });

            return valid;
        },
        // Helper method for React property isInvalid on many components. Returns opposite value of validate
        isInvalid: function(email, validation_option) {
            return !this.isValid(email, validation_option);
        },
        validateAndReturnResults(email, fieldName, results) {
            if (this.isInvalid(email)) {
                if (!results) {
                    results = {
                        error: {}
                    };
                }

                results.error.code = dataErrorCodes.INVALID_ENTRY;
                results.error.messageId = 'invalidMsg.email';
                results.error.data = {fieldName: fieldName};
                results.isInvalid = true;
            }

            return results;
        }
    };
}());


