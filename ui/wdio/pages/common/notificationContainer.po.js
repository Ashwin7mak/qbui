'use strict';
class notificationContainerWindow {

    /**
     * Method for spinner to dissaper after hitting on any save buttons on edit forms
     */
    waitUntilNotificationContainerGoesAway() {
        //wait until notification container slides away
        browser.waitForExist('.notification-container-empty', e2eConsts.mediumWaitTimeMs);
        //Need this to wait for container to slide away
        return browser.pause(e2eConsts.mediumWaitTimeMs);
    }

}
module.exports = new notificationContainerWindow();
