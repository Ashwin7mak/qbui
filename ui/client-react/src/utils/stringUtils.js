/**
 * Static class of String Utility functions
 */
class StringUtils {

    /**
     * Function that trims leading and trailing whitespace
     *
     * @param input string
     * @returns trimmed string.  If the input parameter is not a string,
     * the input parameter is returned unchanged; otherwise the trimmed
     * string is returned.
     */
    static trim(inString) {
        if (typeof inString === 'string') {
            return inString.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
        }
        return inString;
    }

    /**
     * Function to test if the parameter value is an valid string
     *
     * @param val
     * @returns {boolean} - returns true if the intput parameter is of
     * type 'string' and the trimmed content length > 0; otherwise false.
     */
    static isNonEmptyString(val) {
        return (typeof val === 'string' && StringUtils.trim(val).length > 0);
    }

    /**
     * For the tokenized string, replace each token element with the content of
     * the corresponding array element using the array's zero based index.
     *
     * This call has similar functionality/intent as Java's String.format() method.
     *
     * @param tokenizedString - tokenized input string.
     * @param tokens - an array or object used to replace each corresponding token.  An array's
     * zero based index or an object's keys are used to search for matching tokens in the input string
     * @returns string with tokens replaced.  The original tokenizedString is returned if
     * the input parameters are invalid. The input parameters must be the correct data
     * type (string and array).  If invalid, the tokenizedString is returned unchanged.
     *
     * Example calls:
     *  StringUtils.format( "My name is {0}, and my home town is {1}.", ["John Smith", "Denver, Colorado"] );
     *  StringUtils.format( "My name is {name}, and my home town is {home}.", {name: "John Smith", home: "Denver, Colorado"} );
     * Outputs:
     *  My name is John Smith, and my home town is Denver, Colorado.
     *
     *  StringUtils.format( "{0} is from {2}, {1} is from {2}.", ["John", "Mary", "Utah"] );
     * Outputs:
     *  John is from Utah, Mary is from Utah.
     */
    static format(tokenizedString, tokens) {
        const isTokenArray = Array.isArray(tokens);
        if (typeof tokenizedString === 'string') {
            let tokenArray = [];
            if (isTokenArray) {
                tokenArray = tokens;
            } else  if (typeof tokens === 'object' && tokens !== null) {
                tokenArray = Object.keys(tokens);
            } else {
                return tokenizedString;
            }

            // tokens is valid so do the replacement
            let replaceCallback = function(token, match, offset, str) {
                // replace if match exists otherwise keep token
                if (isTokenArray) {
                    return tokenArray.length > match ? tokenArray[match] : token;
                } else {
                    return typeof tokens[match] === 'undefined' ? token : tokens[match];
                }
            };
            return tokenizedString.replace(/\{([0-9A-Za-z]+)\}/g, replaceCallback);
        }
        //  nothing to do...return the original tokenized string
        return tokenizedString;
    }

    static simpleStringify(object) {
        var simpleObject = {};
        for (var prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }
            if (typeof (object[prop]) === 'object') {
                continue;
            }
            if (typeof (object[prop]) === 'function') {
                continue;
            }
            simpleObject[prop] = object[prop];
        }
        var cleanedJson = JSON.stringify(simpleObject);
        return cleanedJson;
    }
}

export default StringUtils;
