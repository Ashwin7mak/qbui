/**
 * Created by rbeyer on 2/4/17.
 */
import React from 'react';
import Logger from '../../../../utils/logger';
import UserManagement from './userManagement';


let logger = new Logger();

const AppUsersRoute = React.createClass({

    render() {
        return (
            <UserManagement appId={this.props.params.appId}
                            appUsers={this.props.appUsers}
            />
        );
    }

});

export default AppUsersRoute;
