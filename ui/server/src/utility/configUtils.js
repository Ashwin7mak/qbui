/**
 * Create new exception type that inherits the prototype of the Error constructor
 *
 * @param message
 * @constructor
 */
function InvalidConfigValueError(message) {
    this.name = 'InvalidValue';
    this.message = message || 'The provided value is invalid';
    this.stack = (new Error()).stack;
}

InvalidConfigValueError.prototype = Object.create(Error.prototype);
InvalidConfigValueError.prototype.constructor = InvalidConfigValueError;

module.exports = {
    /**
     * Parse and validate an expected boolean config value and return a boolean type
     * or exception in the case of configuration errors.
     *
     * Adds type safety in the case of accidental capitalization, string conversions
     * and environment variable parsing.
     *
     * @param boolValue
     * @returns {boolean}
     */
    parseBooleanConfigValue(boolValue) {
        if (typeof boolValue === 'boolean') {
            return boolValue;
        } else if (typeof boolValue === 'string') {
            switch (boolValue.toLowerCase().trim()) {
            case "false":
                return false;
            case "true":
                return true;
            default:
                throw new InvalidConfigValueError("The value provided " + boolValue + " at the environment config must be 'true' or 'false'");
            }
        } else {
            throw new InvalidConfigValueError("The value provided " + boolValue + " at the environment config is not a valid string or boolean");
        }
    },

    /**
     * Parse and validate an expected string config value and return the string
     * or exception in the case of configuration errors.
     *
     * Adds type safety in the case of misconfiguration.
     *
     * @param stringValue
     * @returns {string}
     */
    parseStringConfigValue(stringValue) {
        // Check type and not empty/whitespace, null or undefined.
        if (typeof stringValue === 'string' && stringValue.trim() && stringValue.trim().length !== 0) {
            return stringValue.trim();
        } else {
            throw new InvalidConfigValueError("The value provided " + stringValue + " at the environment config is not a string");
        }
    }
};
