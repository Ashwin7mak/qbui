module.exports = {
    /**
     * Determine whether an API request came back with a success response
     * Success is defined as and status code in the 200 range.
     * @param statusCode
     * @returns {boolean}
     */
    wasRequestSuccessful(statusCode) {
        return statusCode >= 200 && statusCode < 300;
    }
};
