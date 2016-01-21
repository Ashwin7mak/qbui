/**
 * Static class for Query Utility functions
 */
import * as Constants from '../constants/query';
import StringUtils from './stringUtils';

class QueryUtils {

    /**
     * Output a Quickbase 'CONTAINS' query expression for the given input string
     *
     * parseStringIntoContainsExpression('professional')  ==> {0.CT.'Professional'}
     *
     * @param inputStr
     * @returns {string} contains query expression.  If input is not a string with content, returns empty string.
     */
    static parseStringIntoContainsExpression(inputStr) {
        return typeof inputStr === 'string' && StringUtils.trim(inputStr) ? '{' + Constants.ALL_FIELDS_ID + Constants.OPERATOR_CONTAINS + '\'' + StringUtils.trim(inputStr) + '\'}' : '';
    }

    /**
     * Concatenate a list of query expressions.  Each query expression in the input list is 'AND'ed by default.
     * Set the 'useOr' parameter to true to 'OR' the query list.
     *
     * Example usage:
     *
     *  queryList = [{'14'.EX.'Butter'}, {'13'.EX.'Oil'}]
     *
     *  concatQueries(queryList) ==> ({14.EX.'Butter'})AND({13.EX.'Oil'})
     *  concatQueries(queryList, true) ==> ({14.EX.'Butter'})OR({13.EX.'Oil'})
     *
     * @param queryList - list of query expressions to concatenate.  Each query expression must be a string or it is skipped.  If the queryList
     * is undefined or all entries in the list are invalid/empty, then empty string is returned.
     * @param useOr - optional parameter to 'OR' the queryList.  Default is to 'AND' the query list.
     * @returns {string} Concatenated query expressions
     */
    static concatQueries(queryList, useOr) {
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
}

export default QueryUtils;
