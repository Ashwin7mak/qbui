(function() {
    'use strict';

    module.exports = {
        /**
         * Concatenate a list of query expressions.  Each query expression in the input list is 'AND'ed by default.
         * To 'OR' the query list, set the 'useOr' parameter to true.
         *
         * Example usage:
         *
         *  queryList = [{14.EX.'Butter'}, {13.EX.'Oil'}]
         *
         *  concatQueries(queryList) ==> ({14.EX.'Butter'})AND({13.EX.'Oil'})
         *  concatQueries(queryList, true) ==> ({14.EX.'Butter'})OR({13.EX.'Oil'})
         *
         * @param queryList - list of query expressions to concatenate.  Each query expression must be a string or it is skipped.  If the queryList
         * is undefined or all entries in the list are invalid/empty, then empty string is returned.
         * @param useOr - optional parameter to 'OR' the queryList.  Default is to 'AND' the query list.
         * @returns {string} Concatenated query expressions
         */
        concatQueries: function(queryList, useOr) {
            let concatenatedList = '';
            if (Array.isArray(queryList)) {
                queryList.forEach(function(query) {
                    if (typeof query === 'string' && StringUtils.trim(query)) {
                        if (concatenatedList) {
                            concatenatedList = concatenatedList + (useOr === true ? Constants.QUERY_OR : Constants.QUERY_AND) + '(' + StringUtils.trim(query) + ')';
                        } else {
                            concatenatedList = '(' + StringUtils.trim(query) + ')';
                        }
                    }
                });
            }
            return concatenatedList;
        }
    };
}());
