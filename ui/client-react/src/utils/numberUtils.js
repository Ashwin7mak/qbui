
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
     * @param parentObj
     * @param propertyName
     * @returns {*}
     */
    static getNumericPropertyValue(parentObj, propertyName) {
        if (parentObj && parentObj.hasOwnProperty(propertyName)) {
            let propVal = parentObj[propertyName];
            return NumberUtils.isInt(propVal) ? propVal : null;
        }
        return null;
    }
}

export default NumberUtils;
