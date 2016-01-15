/**
 * Static class of String Utility functions
 */
class StringUtils {

    /**
     * Function that trims leading and trailing whitespace
     *
     * @param input string
     * @returns trimmed string.
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
     * @returns {boolean}
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
     * @param tokenArray - array used to replace each corresponding token.  The array's
     * zero based index is used to search for matching tokens in the input string.
     * @returns string with tokens replaced.  The original tokenizedString is returned if the
     * intput parameters are invalid.
     *
     * Example calls:
     *  StringUtils.format( "My name is {0}, and my home town is {1}.", ["John Smith", "Denver, Colorado"] );
     * Outputs:
     *  My name is John Smith, and my home town is Denver, Colorado.
     *
     *  StringUtils.format( "{0} is from {2}, {1} is from {2}.", ["John", "Mary", "Utah"] );
     * Outputs:
     *  John is from Utah, Mary is from Utah.
     */
    static format(tokenizedString, tokenArray) {
        if (typeof tokenizedString === 'string') {
            if (Array.isArray(tokenArray)) {
                let replaceCallback = function(token, index, offset, str) {
                    return tokenArray.length > index ? tokenArray[index] : token;
                };
                return tokenizedString.replace(/\{([0-9]+)\}/g, replaceCallback);
            }
        }
        //  nothing to do...return the original tokenized string
        return tokenizedString;
    }

}

export default StringUtils;
