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
        isSingleEmailValid: function(email) {
            // Don't validate empty strings
            if (!email) {
                return true;
            }

            return FULL_EMAIL_ADDRESS_REGEX.test(email);
        },

        /**
         * Helper method for React property isInvalid on many components. Returns opposite value of validate
         * @param email
         * @returns {boolean}
         */
        isSingleEmailInvalid: function(email) {
            return !this.isSingleEmailValid(email);
        },

        /**
         * Checks an array of emails. If any email in the array is invalid it marks the list as invalid
         * @param emails
         * @returns {{isValid: boolean, isInvalid: boolean, invalidEmails: Array}}
         */
        validateArrayOfEmails(emails) {
            var self = this;
            var valid = true;
            var invalidEmails = [];

            if (emails) {
                emails.forEach(function(singleEmail, index) {
                    if (self.isSingleEmailInvalid(singleEmail)) {
                        valid = false;
                        invalidEmails.push({
                            index: index,
                            email: singleEmail
                        });
                    }
                });
            }

            return {
                isValid: valid,
                isInvalid: !valid,
                invalidEmails: invalidEmails
            };
        },

        /**
         * Validates a single email, or a string with multiple emails, and returns a result for use in validationUtils
         * @param email
         * @param fieldName
         * @param results
         * @returns {Result}
         */
        validateAndReturnResults: function(email, fieldName, results) {
            var emails = emailFormatter.splitEmails(email);

            var emailValidationResult = this.validateArrayOfEmails(emails);

            if (emailValidationResult.isInvalid) {
                return this._formatValidationResults(results, fieldName, emailValidationResult.invalidEmails);
            }

            return results;
        },

        /**
         * A private method to format the validation results object appropriately
         * @param results
         * @param fieldName
         * @param invalidEmails
         * @returns {Result}
         * @private
         */
        _formatValidationResults(results, fieldName, invalidEmails) {
            var resultsCopy = Object.assign({error: {}}, results);

            resultsCopy.error.code = dataErrorCodes.INVALID_ENTRY;
            resultsCopy.error.messageId = 'invalidMsg.email';
            resultsCopy.error.data = {fieldName: fieldName, invalidEmails: invalidEmails};
            resultsCopy.isInvalid = true;

            return resultsCopy;
        }
    };
}());


