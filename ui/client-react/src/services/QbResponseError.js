import _ from 'lodash';

class QbResponseError {
    constructor(responseError) {
        if (!responseError) {
            return responseError;
        }

        this.config = responseError.config;
        if (responseError.request) {
            this.request = responseError.request;
        } else if (_.has(responseError, 'response.request')) {
            this.request = responseError.response.request;
        }
        this.response = responseError.response;

        if (_.has(this.response, 'data')) {
            this.data = this.response.data;
        }

        // Obtain the QB provided sid and tid for help with customer troubleshooting
        if (_.has(this.response, 'data.request.headers')) {
            this.sid = this.response.data.request.headers.sid;
            this.tid = this.response.data.request.headers.tid;
        }

        // Parse the error messages so they are nicely formatted and can be used in the UI
        if (_.has(this.response, 'data.body') && typeof this.response.data.body === 'string') {
            try {
                this.errorMessages = JSON.parse(this.response.data.body);
            } catch (exception) {
                this.errorMessages = null;
            }
        }

        return this;
    }
}

export default QbResponseError;
