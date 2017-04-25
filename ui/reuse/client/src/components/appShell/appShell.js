import React, {PropTypes} from 'react';

// The following two imports are necessary to support our current implementation of notifications
// These work along with ReNotificationManager to display notifications with defaults similar across all apps within qbase
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

/**
 * Builds a very basic App shell that includes an general setup required for common packages to work (e.g., notifications)
 * @param functionalAreaName
 * @param children
 * @constructor
 */
const ReAppShell = ({functionalAreaName, children}) => (
    <div className={`${functionalAreaName}AppShell`}>
        <NotificationContainer/>
        {children}
    </div>
);

ReAppShell.propTypes = {
    functionalAreaName: PropTypes.string.isRequired
};

export default ReAppShell;
