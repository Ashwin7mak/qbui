(function() {
    var dataErrorCodes = require('../dataEntryErrorCodes');
    /**
     * ******IMPORTANT****
     * Currently the isValid and isTimeFormatValid methods are both in this file and the durationEditorParsing file
     * a common location for this method will be updated and addressed in an upcoming story which is now in the backlog
     * */
    module.exports = {
        /**
         * Validate a duration field
         * @param user input
         * @returns {boolean}
         */
        isValid: function(value) {
            if (value === 'Invalid Input') {
                return false;
            }
            return true;
        },
        // Helper method for React property isInvalid on many components. Returns opposite value of validate
        isInvalid: function(value) {
            return !this.isValid(value);
        },
        validateAndReturnResults: function(value, fieldName, results) {
            var scale;
            if (this.isInvalid(value)) {
                if (!results) {
                    results = {
                        error: {}
                    };
                }
                scale = results.def.fieldDef.datatypeAttributes.scale;
                results.error.code = dataErrorCodes.INVALID_ENTRY;
                results.error.messageId = 'invalidMsg.duration';
                results.error.data = {fieldName: fieldName, scale: scale};
                results.isInvalid = true;
            }
            return results;
        }
    };
}());


