import ReNotificationManager, {NOTIFICATION_MESSAGE_DISMISS_TIME, NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME, __RewireAPI__ as NotificationManagerRewireAPI} from '../../src/scripts/notificationManager';
import {NotificationManager} from 'react-notifications';

const testMessage = 'test message';
const testTitle = 'test title';
const testCallback = () => 'test callback';
const testPriority = true;

describe('ReNotificationManager', () => {
    beforeEach(() => {
        spyOn(NotificationManager, 'info');
        spyOn(NotificationManager, 'success');
        spyOn(NotificationManager, 'warning');
        spyOn(NotificationManager, 'error');

        /**
         * This test rewires back to the original implementation of NotificationManager
         * so that the spies can verify the integrity of the underlying implementation.
         * If the API for NotificationManager changes, these spies will throw an error.
         * The rewire allows us to still spy on the imported NotificationManager.
         */
        NotificationManagerRewireAPI.__Rewire__('NotificationManager', NotificationManager);
    });

    afterEach(() => {
        NotificationManagerRewireAPI.__ResetDependency__('NotificationManager', NotificationManager);
    });

    it('shows an info toast notification', () => {
        ReNotificationManager.info(testMessage, testTitle, testCallback, testPriority);

        expect(NotificationManager.info).toHaveBeenCalledWith(testMessage, testTitle, NOTIFICATION_MESSAGE_DISMISS_TIME, testCallback, testPriority);
    });

    it('shows a success toast notification', () => {
        ReNotificationManager.success(testMessage, testTitle, testCallback, testPriority);

        expect(NotificationManager.success).toHaveBeenCalledWith(testMessage, testTitle, NOTIFICATION_MESSAGE_DISMISS_TIME, testCallback, testPriority);
    });

    it('shows a warning toast notification', () => {
        ReNotificationManager.warning(testMessage, testTitle, testCallback, testPriority);

        expect(NotificationManager.warning).toHaveBeenCalledWith(testMessage, testTitle, NOTIFICATION_MESSAGE_DISMISS_TIME, testCallback, testPriority);
    });

    it('shows an error toast notification', () => {
        ReNotificationManager.error(testMessage, testTitle, testCallback, testPriority);

        expect(NotificationManager.error).toHaveBeenCalledWith(testMessage, testTitle, NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME, testCallback, testPriority);
    });
});
