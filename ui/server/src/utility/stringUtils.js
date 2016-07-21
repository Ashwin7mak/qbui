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
        },

        /**
         * Search the given array for the obj. Return true if found, otherwise false.
         *
         * @param inArr
         * @param obj
         * @returns {boolean}
         */
        contains: function(inArr, obj) {
            if (Array.isArray(inArr)) {
                for (let i = 0; i < inArr.length; i++) {
                    if (inArr[i] === obj) {
                        return true;
                    }
                }
            }
            return false;
        }
    };

}());
