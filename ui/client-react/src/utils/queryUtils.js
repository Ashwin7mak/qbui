/* eslint-disable babel/no-invalid-this */

/**
 * Static class for Query Utility functions
 */
import * as Constants from '../constants/query';
import StringUtils from './stringUtils';

class QueryUtils {

    /**
     * Output a Quickbase 'ALL FIELDS' 'CONTAINS' query expression that will search all fields on
     * a record for the given input string.
     *
     * parseStringIntoAllFieldsContainsExpression('professional')  ==> {0.CT.'Professional'}
     *
     * @param inputStr
     * @returns {string} contains query expression.  If input is not a string with content, returns empty string.
     */
    static parseStringIntoAllFieldsContainsExpression(inputStr) {
        return QueryUtils.parseStringIntoContainsExpression(Constants.ALL_FIELDS_ID, inputStr);
    }

    /**
     * Output a Quickbase 'CONTAINS' query expression that search's the fid for the given input string.  The supplied
     * fid could be the 'all fields fid', where the entire record is searched, or just the column fid where just
     * that field is searched.
     *
     * parseStringIntoContainsExpression(10, 'professional')  ==> {10.CT.'Professional'}
     *
     * @param fid
     * @param inputStr
     * @returns {string} contains query expression.  If input is not a string with content, returns empty string.
     */
    static parseStringIntoContainsExpression(fid, inputStr) {
        var containsExpr = '';
        if (typeof inputStr === 'string') {
            var trimmedInput = StringUtils.trim(inputStr);
            if (trimmedInput) {
                containsExpr = StringUtils.format('{{0}{1}\'{2}\'}', [fid, Constants.OPERATOR_CONTAINS, trimmedInput]);
            }
        }
        return containsExpr;
    }

    /**
     * Output a Quickbase 'EXACTLY MATCHES' query expression searches the fid for the given value.
     *
     * parseStringIntoExactMatchExpression(10, 'professional')  ==> {10.EX.'Professional'}
     *
     * @param fid the fid to search
     * @param value the value which should be in the field with fid
     * @returns {string} query expression
     */
    static parseStringIntoExactMatchExpression(fid, value) {
        let containsExpr = '';
        let strValue = '';
        const isValidFid = typeof fid === 'number' || typeof fid === 'string';
        const isValidValue = typeof value === 'number' || typeof value === 'string';
        if (isValidFid && isValidValue) {
            // convert to string if numeric
            strValue = '' + value;
            strValue = strValue.trim();
            containsExpr = `{${fid}${Constants.OPERATOR_EXACTLY_MATCHES}'${strValue}'}`;
        }
        return containsExpr;
    }

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
