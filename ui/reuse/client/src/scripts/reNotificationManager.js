import {NotificationManager} from 'react-notifications';

export const NOTIFICATION_MESSAGE_DISMISS_TIME = 2000;
export const NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME = 2500;

/**
 * A wrapper for a third-party notification library that includes the defaults used across the qbase app ecosystem
 */
export default {
    /**
     * Display a toast notification with 'info' styling
     * @param message
     * @param title
     * @param callback
     * @param priority
     */
    info(message, title, callback, priority) {
        NotificationManager.info(message, title, NOTIFICATION_MESSAGE_DISMISS_TIME, callback, priority);
    },

    /**
     * Display a toast notification with 'success' styling
     * @param message
     * @param title
     * @param callback
     * @param priority
     */
    success(message, title, callback, priority) {
        NotificationManager.success(message, title, NOTIFICATION_MESSAGE_DISMISS_TIME, callback, priority);
    },

    /**
     * Display a toast notification with 'warning' styling
     * @param message
     * @param title
     * @param callback
     * @param priority
     */
    warning(message, title, callback, priority) {
        NotificationManager.warning(message, title, NOTIFICATION_MESSAGE_DISMISS_TIME, callback, priority);
    },

    /**
     * Display a toast notification with 'error' styling
     * @param message
     * @param title
     * @param callback
     * @param priority
     */
    error(message, title, callback, priority) {
        NotificationManager.error(message, title, NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME, callback, priority);
    }
};
