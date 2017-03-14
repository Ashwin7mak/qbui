import React, {PropTypes, Component} from 'react';
import ReNotificationManager from '../../scripts/reNotificationManager';

// IMPORTS FROM CLIENT REACT
import QbIcon from '../../../../../client-react/src/components/qbIcon/qbIcon';
import Locale from '../../../../../client-react/src/locales/locales';
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
// IMPORTS FROM CLIENT REACT

/**
 * Loads the Walkme on non-touch devices
 * WalkMePlayerAPI is defined globally if the third-party javascript is included
 * in the environment configuration
 */
function getHelpWalkme() {
    let touch = "ontouchstart" in window;
    if (touch) {
        return;
    }
    try {
        WalkMePlayerAPI.toggleMenu();
    } catch (err) {
        ReNotificationManager.info(Locale.getMessage('missingWalkMe'), '');
    }
}

/**
 * A button to start the Walkme help if it is available.
 * Which WalkMe starts is configured within the Walkme system based the current URL.
 */
const ReHelpButton = () => (
    <a className="dropdownToggle globalActionLink" onClick={getHelpWalkme}>
        <QbIcon icon={'help'}/>
        <span className={"navLabel"}><I18nMessage message={'globalActions.help'}/></span>
    </a>
);

export default ReHelpButton;
