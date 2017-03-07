/**
 * Created by rbeyer on 2/2/17.
 */
import React from 'react';
import AppSettingsHome from './appSettingsHome';

const AppSettingsRoute = React.createClass({

    render() {
        return (<AppSettingsHome appId={this.props.params.appId}
                                   appUsers={this.props.appUsersUnfiltered}
                                   appRoles={this.props.appRoles}
                                   selectedApp={this.props.selectedApp}
            />

        );
    }

});

export default AppSettingsRoute;
