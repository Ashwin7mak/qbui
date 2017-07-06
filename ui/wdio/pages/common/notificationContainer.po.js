class notificationContainerWindow {

    /**
     * Method for spinner to dissaper after hitting on any save buttons on edit forms
     */
    waitUntilNotificationContainerGoesAway() {
        //wait until notification container slides away
        browser.waitForExist('.notification-message', e2eConsts.longWaitTimeMs, true);
        //Need this to wait for container to slide away
        return browser.pause(e2eConsts.shortWaitTimeMs);
    }

    waitForSuccessNotification() {
        browser.waitForExist('.notification-success', e2eConsts.longWaitTimeMs);
    }

    waitForErrorNotification() {
        browser.waitForExist('.notification-error', e2eConsts.longWaitTimeMs);
    }
}

module.exports = new notificationContainerWindow();
