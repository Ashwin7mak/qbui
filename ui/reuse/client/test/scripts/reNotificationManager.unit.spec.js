import ReNotificationManagager, {NOTIFICATION_MESSAGE_DISMISS_TIME, NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME, __RewireAPI__ as ReNotificationManagerRewireAPI} from '../../src/scripts/reNotificationManager';
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
        ReNotificationManagerRewireAPI.__Rewire__('NotificationManager', NotificationManager);
    });

    afterEach(() => {
        ReNotificationManagerRewireAPI.__ResetDependency__('NotificationManager', NotificationManager);
    });

    it('shows an info toast notification', () => {
        ReNotificationManagager.info(testMessage, testTitle, testCallback, testPriority);

        expect(NotificationManager.info).toHaveBeenCalledWith(testMessage, testTitle, NOTIFICATION_MESSAGE_DISMISS_TIME, testCallback, testPriority);
    });

    it('shows a success toast notification', () => {
        ReNotificationManagager.success(testMessage, testTitle, testCallback, testPriority);

        expect(NotificationManager.success).toHaveBeenCalledWith(testMessage, testTitle, NOTIFICATION_MESSAGE_DISMISS_TIME, testCallback, testPriority);
    });

    it('shows a warning toast notification', () => {
        ReNotificationManagager.warning(testMessage, testTitle, testCallback, testPriority);

        expect(NotificationManager.warning).toHaveBeenCalledWith(testMessage, testTitle, NOTIFICATION_MESSAGE_DISMISS_TIME, testCallback, testPriority);
    });

    it('shows an error toast notification', () => {
        ReNotificationManagager.error(testMessage, testTitle, testCallback, testPriority);

        expect(NotificationManager.error).toHaveBeenCalledWith(testMessage, testTitle, NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME, testCallback, testPriority);
    });
});
