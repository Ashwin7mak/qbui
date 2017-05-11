import React from 'react';
import NotificationManager from 'REUSE/scripts/notificationManager';
import Icon from 'REUSE/components/icon/icon';
import {I18nMessage} from 'REUSE/utils/i18nMessage';
import Locale from 'REUSE/locales/locale';

// IMPORTS FROM CLIENT REACT
import Device from 'APP/utils/device';
// IMPORTS FROM CLIENT REACT

/**
 * Loads the Walkme on non-touch devices
 * WalkMePlayerAPI is defined globally if the third-party javascript is included
 * in the environment configuration
 */
function getHelpWalkme() {
    return NotificationManager.info(Locale.getMessage('missingHelp'));

    // BELOW IS DISABLED FOR BETA.
    // To be re-enabled once help system has been developed
    // if (Device.isTouch()) {
    //     // Walkme is disabled on touch devices
    //     return;
    // }
    // try {
    //     WalkMePlayerAPI.toggleMenu();
    // } catch (err) {
    //     NotificationManager.info(Locale.getMessage('missingWalkMe'), '');
    // }
}

/**
 * A button to start the Walkme help if it is available.
 * Which WalkMe starts is configured within the Walkme system based the current URL.
 */
const ReHelpButton = () => (
    <a className="dropdownToggle globalActionLink reHelpButton" onClick={getHelpWalkme}>
        <Icon icon="help" />
        <span className="navLabel"><I18nMessage message="globalActions.help" /></span>
    </a>
);

export default ReHelpButton;
