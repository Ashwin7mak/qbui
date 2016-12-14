(function() {
    'use strict';

    module.exports = {
        /**
         * Returns the value of display if it exists, otherwise sets the display to the same as the value
         * @param fieldValue
         * @param fieldInfo
         * @returns {String}
         */
        format: function(fieldValue, fieldInfo) {
            if (fieldValue.display) {
                return fieldValue.display;
            }

            return fieldValue.value;
        }
    };
}());
