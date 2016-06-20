(function() {
    'use strict';

    module.exports = {
        /**
         * Take as input an array list and return a string with each element separated by a delimiter. If no
         * delimiter, then the default of comma(,) is used to separate the entries. An empty string is returned
         * if the input list is not any array or has no content.
         *
         * @param inList
         * @param delimiter
         * @returns {*}
         */
        convertListToDelimitedString: function(inList, delimiter) {
            if (Array.isArray(inList)) {
                return delimiter ? inList.join(delimiter) : inList.join();
            }
            return '';
        }
    };

}());
