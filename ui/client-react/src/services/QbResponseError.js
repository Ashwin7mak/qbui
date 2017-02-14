import _ from 'lodash';

/**
 * This class provides a consistent API for errors returned from the Node/Core layers. If the
 * Node or Core error APIs change, then we can simply update the functions in this class to find the relevant information
 * without updating everwhere that error information is used.
 */
class QbResponseError {
    constructor(responseError) {
        if (!responseError || !_.isObject(responseError)) {
            this.response = responseError;
            return this;
        }

        this.resetDefaults();
        this._setResponseIfExists(responseError);
        this._setStatusCodeIfExists(responseError);
        this._setConfigIfExists(responseError);
        this._setRequestIfExists(responseError);
        this._setQbErrorCodes();
        this._formatErrorMessages();

        return this;
    }

    resetDefaults() {
        this.statusCode = null;
        this.response = null;
        this.data = null;
        this.config = null;
        this.request = null;
        this.sid = null;
        this.tid = null;
        this.errorMessages = [];
    }

    _setResponseIfExists(responseError) {
        if (responseError.response) {
            this.response = responseError.response;
        }

        if (this.response) {
            this.data = this.response.data;
        }
    }

    _setStatusCodeIfExists() {
        if (_.has(this.data, 'response.status')) {
            this.statusCode = this.data.response.status;
        }
    }

    _setConfigIfExists(responseError) {
        if (responseError.config) {
            this.config = responseError.config;
        }
    }

    _setRequestIfExists(responseError) {
        if (responseError.request) {
            this.request = responseError.request;
        } else if (_.has(responseError, 'response.request')) {
            this.request = responseError.response.request;
        }
    }

    _setQbErrorCodes() {
        // Obtain the QB provided sid and tid for help with customer troubleshooting
        if (_.has(this.response, 'data.request.headers')) {
            this.sid = this.response.data.request.headers.sid;
            this.tid = this.response.data.request.headers.tid;
        }
    }

    _formatErrorMessages() {
        // Parse the error messages so they are nicely formatted and can be used in the UI
        if (_.has(this.response, 'data.body') && _.isString(this.response.data.body)) {
            try {
                this.errorMessages = JSON.parse(this.response.data.body);
            } catch (exception) {
                this.errorMessages = [];
            }
        }

        if (_.has(this.data, 'response.errors') && this.data.response.errors.length !== 0) {
            this.errorMessages = [...this.errorMessages, ...this.data.response.errors];
        }
    }
}

export default QbResponseError;
