(function() {
    var durationEditorParsing = require('../../../client-react/src/components/fields/durationEditorParsing');
    var dataErrorCodes = require('../dataEntryErrorCodes');

    module.exports = {
        /**
         * Validate a duration field
         * @param user input
         * @returns {boolean}
         */
        isValid: function(value) {
            return durationEditorParsing.isValid(value);
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
                scale = durationEditorParsing.getPlaceholder(results.def.fieldDef.datatypeAttributes);
                results.error.code = dataErrorCodes.INVALID_ENTRY;
                results.error.messageId = 'invalidMsg.duration';
                results.error.data = {fieldName: fieldName, scale: scale};
                results.isInvalid = true;
            }
            return results;
        }
    };
}());


