(function() {
    // Maintains parity with Core validation - EmailAddressAttributes.java lines 31-45
    var EMAIL_ADDRESS_DOMAIN_VALIDATION_REGEX = "(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])";
    var MAILBOX_REGEX = "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*";
    var FULL_EMAIL_ADDRESS_REGEX = MAILBOX_REGEX + "@" +
        EMAIL_ADDRESS_DOMAIN_VALIDATION_REGEX + "?";

    module.exports = {
        ONLY_VALIDATE_DOMAIN: 'only_validate_domain',
        ONLY_VALIDATE_MAILBOX: 'only_validate_mailbox',
        VALIDATE_FULL_ADDRESS: 'validate_full_address',
        /**
         * Validate an email address
         * @param email
         * @param [validation_option=VALIDATE_FULL_ADDRESS] - The type of validation required (whole email, mailbox only, or domain only)
         * @returns {boolean}
         */
        isValid: function(email, validation_option) {
            // Don't validate empty strings
            if (!email) {
                return true;
            }

            var regex;
            switch (validation_option) {
            case this.ONLY_VALIDATE_DOMAIN :
                regex = new RegExp(EMAIL_ADDRESS_DOMAIN_VALIDATION_REGEX);
                break;
            case this.ONLY_VALIDATE_MAILBOX :
                regex = new RegExp(MAILBOX_REGEX);
                break;
            case this.VALIDATE_FULL_ADDRESS :
            default :
                regex = new RegExp(FULL_EMAIL_ADDRESS_REGEX);
            }

            return regex.test(email);
        },
        // Helper method for React property isInvalid on many components. Returns opposite value of validate
        isInvalid: function(email, validation_option) {
            return !this.isValid(email, validation_option);
        }
    };
}());


