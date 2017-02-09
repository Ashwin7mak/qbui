/**
 * Created by rbeyer on 2/2/17.
 */
import React from 'react';
import AppSettingsHome from './appSettingsHome';

const AppSettingsRoute = React.createClass({

    render() {
        return (<AppSettingsHome appId={this.props.params.appId}
                                   appUsers={this.props.appUsers}
                                   selectedApp={this.props.selectedApp}
            />

        );
    }

});

export default AppSettingsRoute;
