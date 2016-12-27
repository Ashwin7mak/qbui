(function() {
    var dataErrorCodes = require('../dataEntryErrorCodes');
    var DURATION_CONSTS = require('../constants').DURATION_CONSTS;

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
            if (value === DURATION_CONSTS.ACCEPTED_TYPE.DURATION_TYPE_INVALID_IPUT) {
                return false;
            }
            return true;
        },
        // Helper method for React property isInvalid on many components. Returns opposite value of validate
        isInvalid: function(value) {
            return !this.isValid(value);
        },
        validateAndReturnResults: function(value, fieldName, results) {
            var fieldScale = results.def.fieldDef.datatypeAttributes.scale;
            var scale = {};
            var scaleTimeFormat = {};
            scale[DURATION_CONSTS.SCALES.SECONDS] = DURATION_CONSTS.SCALES.SECONDS;
            scale[DURATION_CONSTS.SCALES.MINUTES] = DURATION_CONSTS.SCALES.MINUTES;
            scale[DURATION_CONSTS.SCALES.HOURS] = DURATION_CONSTS.SCALES.HOURS;
            scale[DURATION_CONSTS.SCALES.DAYS] = DURATION_CONSTS.SCALES.DAYS;
            scale[DURATION_CONSTS.SCALES.SMART_UNITS] = DURATION_CONSTS.SCALES.DAYS;
            scale[DURATION_CONSTS.SCALES.WEEKS] = DURATION_CONSTS.SCALES.WEEKS;

            scaleTimeFormat[DURATION_CONSTS.SCALES.HHMMSS] = DURATION_CONSTS.ACCEPTED_TYPE.HHMMSS;
            scaleTimeFormat[DURATION_CONSTS.SCALES.HHMM] = DURATION_CONSTS.ACCEPTED_TYPE.HHMM;
            scaleTimeFormat[DURATION_CONSTS.SCALES.MMSS] = DURATION_CONSTS.ACCEPTED_TYPE.MMSS;
            scaleTimeFormat[DURATION_CONSTS.SCALES.MM] = DURATION_CONSTS.ACCEPTED_TYPE.MM;

            results.error.code = dataErrorCodes.INVALID_ENTRY;
            results.error.messageId = 'invalidMsg.duration';
            results.error.data = {fieldName: fieldName};
            results.isInvalid = true;

            if (this.isInvalid(value)) {
                if (!results) {
                    results = {
                        error: {}
                    };
                }
            }

            if (scale[fieldScale]) {
                results.error.messageId = 'invalidMsg.duration.' + scale[fieldScale];
            } else if (scaleTimeFormat[fieldScale]) {
                results.error.messageId = 'invalidMsg.duration.timeFormat';
                results.error.data = {fieldName: fieldName, value: scaleTimeFormat[fieldScale]};
            }
            console.log('RESULTS: ', results);
            return results;
        }
    };
}());


