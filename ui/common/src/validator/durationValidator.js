(function() {
    var dataErrorCodes = require('../dataEntryErrorCodes');
    var DURATION_CONSTS = require('../constants').DURATION_CONSTS;
    module.exports = {
        /**
         * Validate a duration field
         * @param user input
         * @returns {boolean}
         */
        isValid: function(value) {
            if (value === DURATION_CONSTS.ACCEPTED_TYPE.DURATION_TYPE_INVALID_INPUT) {
                return false;
            }
            return true;
        },
        // Helper method for React property isInvalid on many components. Returns opposite value of validate
        isInvalid: function(value) {
            return !this.isValid(value);
        },
        validateAndReturnResults: function(value, fieldName, results) {
            /**
             * The scales for HHMMSS, HHMM, MM, MMSS and Smart Units are not formatted properly when it comes back from
             * the database. By using an object, the proper format is set to each scale.
             * Note: Smart Units always default to days, for placeholders or error messsages according to XD specs
             * */
            var scale = results.def.fieldDef.datatypeAttributes.scale;
            var scaleTimeFormat = {};
            scaleTimeFormat[DURATION_CONSTS.SCALES.SMART_UNITS] = DURATION_CONSTS.SCALES.DAYS;
            scaleTimeFormat[DURATION_CONSTS.SCALES.HHMMSS] = DURATION_CONSTS.ACCEPTED_TYPE.HHMMSS;
            scaleTimeFormat[DURATION_CONSTS.SCALES.HHMM] = DURATION_CONSTS.ACCEPTED_TYPE.HHMM;
            scaleTimeFormat[DURATION_CONSTS.SCALES.MMSS] = DURATION_CONSTS.ACCEPTED_TYPE.MMSS;
            scaleTimeFormat[DURATION_CONSTS.SCALES.MM] = DURATION_CONSTS.ACCEPTED_TYPE.MM;



            if (this.isInvalid(value)) {
                if (!results) {
                    results = {
                        error: {}
                    };
                }
                results.error.code = dataErrorCodes.INVALID_ENTRY;
                results.error.messageId = 'invalidMsg.duration';
                results.error.data = {fieldName: fieldName};
                results.isInvalid = true;

                if (scaleTimeFormat[scale]) {
                    results.error.messageId = 'invalidMsg.duration.timeFormat';
                    results.error.data = {fieldName: fieldName, value: scaleTimeFormat[scale]};
                } else {
                    results.error.messageId = 'invalidMsg.duration.' + scale;
                }
            }
            return results;
        }
    };
}());


