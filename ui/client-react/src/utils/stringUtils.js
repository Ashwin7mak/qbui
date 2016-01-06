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
}

export default StringUtils;
