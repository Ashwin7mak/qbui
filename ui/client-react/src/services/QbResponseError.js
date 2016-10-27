import _ from 'lodash';
import Locale from '../locales/locales';
import {NotificationManager} from 'react-notifications';

class QbResponseError {
    constructor(responseError) {
        if (!responseError) {
            return responseError;
        }

        // this.error = responseError;
        this.request = responseError.request;
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
            this.errorMessages = JSON.parse(this.response.data.body);
        }

        return this;
    }

    /**
     * Display a growl notification
     * @param messageId The id for the localized message
     * @param type The type of alert (success or error)
     * @param duration How long the alert should show
     */
    displayMessage(messageId, type = 'failed', duration = 1500) {
        NotificationManager.success(Locale.getMessage(messageId), Locale.getMessage(type), duration);
    }

    /**
     * Display a growl notification of the error
     * @param messageId The id for the localized message
     */
    displayErrorMessage(messageId) {
        this.displayMessage(messageId, 'failed');
    }
}

export default QbResponseError;
