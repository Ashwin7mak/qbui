(function() {
    var durationFormatter = require('../formatter/durationFormatter');
    var dataErrorCodes = require('../dataEntryErrorCodes');
    var ALLOWED_DURATION_TYPE = ['s', 'second', 'seconds', 'ms', 'millisecond', 'milliseconds', 'm', 'minute', 'minutes', 'h', 'hour', 'hours', 'd', 'day', 'days', 'w', 'week', 'weeks'];

    module.exports = {
        /**
         * Validate a duration field
         * @param user input
         * @returns {boolean}
         */
        isValid: function(value) {
            // Don't validate empty strings
            return durationFormatter.isValid(value);
        },
        // Helper method for React property isInvalid on many components. Returns opposite value of validate
        isInvalid: function(value) {
            console.log('isInvalid value: ', value);
            console.log('isINvalid value: ', !this.isValid(value));
            return !this.isValid(value);
        },
        validateAndReturnResults: function(value, fieldName, results) {
            console.log('durationValidator:', '\nvalue: ', value, '\nfieldName: ', fieldName, '\nresults: ', results);
            if (this.isInvalid(value)) {
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


