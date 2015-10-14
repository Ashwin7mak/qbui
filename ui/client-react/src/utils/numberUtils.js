
class NumberUtils {

    /**
     * Function to test if the parameter value is an integer
     *
     * @param val
     * @returns {boolean}
     */
    static isInt(val) {
        return (typeof val === 'number' && (val % 1) === 0);
    }
}

export default NumberUtils;