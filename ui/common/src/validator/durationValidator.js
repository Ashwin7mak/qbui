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
        isTimeFormatValid: function(value, type) {
            var regexTimeFormat = /\./g;
            var colons;
            /**
             * If a type is inserted with time format, it is not valid
             * HH:MM:SS minutes is not a valid format
             * */
            type = type.join('').trim().split(' ');
            if (type.length > 1 || type.length === 1 && type[0] !== '') {
                return false;
            }
            /**
             * Decimals are not a valid input with time formats
             * Example 5.5:5.5:5.5 is an invalid input
             * 5:5:5 is a valid input
             * */
            if (regexTimeFormat.test(value)) {
                return false;
            }
            colons = value.match(/:/g);
            if (colons.length > 3) {
                return false;
            }
            return true;
        },
        isValid: function(value) {
            var regexHasNums = /[0-9]+/g;
            var tempNum;
            var tempType = [];
            var valid = true;
            var type;
            /**
             * Don't validate empty strings
             * */
            if (!value) {
                return true;
            }
            /**
             * If a user does not input a number, throw an error
             * */
            if (!regexHasNums.test(value)) {
                return false;
            }
            /**
             * If the input is only a number, return true
             * */
            if (typeof value === 'number' || !value) {
                return true;
            }
            /**
             * If a user inserted a colon, it will be validated based off of time formats validation requirements
             * */
            value = value.toLowerCase();
            type = value.replace(regexNumsDecimalsColons, ' ').split(' ');
            if (value.split('').indexOf(':') !== -1) {
                return this.isTimeFormatValid(value, type);
            }
            /**
             * Strips out all numbers
             * If there is an invalid type return false
             * If there are no types, return true
             * If there are only accepted types return true
             * */
            type.forEach(function(val) {
                if (ALLOWED_DURATION_TYPE.indexOf(val) === -1 && val !== '') {
                    valid = false;
                } else if (val !== '') {
                    tempType.push(val);
                }
            });
            /**
             * If a user inserts more types than nums return false
             * 1 week day invalid format
             * 1 week 2 days valid format
             * */
            tempNum = value.match(regexNumsDecimalsColons);
            if (!(tempType.length === 0) && tempNum.length !== tempType.length) {
                return false;
            }
            return valid;
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


