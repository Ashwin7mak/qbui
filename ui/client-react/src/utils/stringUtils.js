import Logger from './logger';
var logger = new Logger();

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
}

export default StringUtils;