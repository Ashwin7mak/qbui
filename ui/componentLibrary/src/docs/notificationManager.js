import React from 'react';

import ReactPlayground from '../components/ReactPlayground';
import Examples from '../components/Examples';

export default function NotificationManagerDoc() {
    return (
        <div>
            <h2>Notification Manager</h2>
            <p>Use this utility to display a notification to the user.</p>
            <p>There must be a &lt;NotificationContainer/&gt; component somewhere on the page.</p>

            <ReactPlayground codeText={Examples.NotificationManager} />

        </div>
    );
}
