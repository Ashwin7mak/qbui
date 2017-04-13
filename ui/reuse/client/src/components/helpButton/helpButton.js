import React from 'react';
import NotificationManager from '../../scripts/notificationManager';
import Icon from '../icon/icon';

// IMPORTS FROM CLIENT REACT
import Device from '../../../../../client-react/src/utils/device';
import Locale from '../../../../../client-react/src/locales/locales';
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
// IMPORTS FROM CLIENT REACT

/**
 * Loads the Walkme on non-touch devices
 * WalkMePlayerAPI is defined globally if the third-party javascript is included
 * in the environment configuration
 */
function getHelpWalkme() {
    if (Device.isTouch()) {
        return;
    }
    try {
        WalkMePlayerAPI.toggleMenu();
    } catch (err) {
        NotificationManager.info(Locale.getMessage('missingWalkMe'), '');
    }
}

/**
 * A button to start the Walkme help if it is available.
 * Which WalkMe starts is configured within the Walkme system based the current URL.
 */
const ReHelpButton = () => (
    <a className="dropdownToggle globalActionLink" onClick={getHelpWalkme}>
        <Icon icon="help" />
        <span className="navLabel"><I18nMessage message="globalActions.help" /></span>
    </a>
);

export default ReHelpButton;
