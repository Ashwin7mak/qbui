/**
 * Created by rbeyer on 2/2/17.
 */
import React from 'react';
import Logger from '../../../utils/logger';
import AppManagementHome from './appManagementHome';
import UserManagement from './userManagement';


let logger = new Logger();

const AppManagementRoute = React.createClass({

    /*
    render() {
        return (
            <UserManagement appId={this.props.params.appId}
                            appUsers={this.props.appUsers}
            />
        );
    }
    */
    render() {
        return (<AppManagementHome appId={this.props.params.appId}
                                   appUsers={this.props.appUsers}
                                   selectedApp={this.props.selectedApp}
            />

        );
    }

});

export default AppManagementRoute;