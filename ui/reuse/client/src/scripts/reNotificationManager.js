import {NotificationManager} from 'react-notifications';

export const NOTIFICATION_MESSAGE_DISMISS_TIME = 2000;
export const NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME = 2500;

export default {
    info(message, title, callback, priority) {
        NotificationManager.info(message, title, NOTIFICATION_MESSAGE_DISMISS_TIME, callback, priority);
    },

    success(message, title, callback, priority) {
        NotificationManager.success(message, title, NOTIFICATION_MESSAGE_DISMISS_TIME, callback, priority);
    },

    warning(message, title, callback, priority) {
        NotificationManager.warning(message, title, NOTIFICATION_MESSAGE_DISMISS_TIME, callback, priority);
    },

    error(message, title, callback, priority) {
        NotificationManager.error(message, title, NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME, callback, priority);
    }
}