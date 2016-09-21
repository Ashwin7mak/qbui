
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

    /**
     * Returns value of the supplied property if it exists in the object, otherwise null
     * @param obj
     * @param propertyName
     * @returns {*}
     */
    static getNumericPropertyValue(obj, propertyName) {
        if (obj && obj.hasOwnProperty(propertyName)) {
            let propVal = obj[propertyName];
            return NumberUtils.isInt(propVal) ? propVal : null;
        }
        return null;
    }
}

export default NumberUtils;
