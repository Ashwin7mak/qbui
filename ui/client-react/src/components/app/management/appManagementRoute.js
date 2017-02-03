/**
 * Created by rbeyer on 2/2/17.
 */
import React from 'react';
import Logger from '../../../utils/logger';
import UserManagement from './userManagement';


let logger = new Logger();

const AppManagementRoute = React.createClass({

    render() {
        return (
            <UserManagement appId={this.props.params.appId}
                            appUsers={this.props.appUsers}
            />
        );
    }

});

export default AppManagementRoute;