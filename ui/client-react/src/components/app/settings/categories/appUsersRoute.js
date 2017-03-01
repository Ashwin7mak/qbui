/**
 * Created by rbeyer on 2/4/17.
 */
import React from 'react';
import Logger from '../../../../utils/logger';
import UserManagement from './userManagement';


let logger = new Logger();

const AppUsersRoute = React.createClass({

    componentDidMount() {
        this.props.flux.actions.loadAppRoles(this.props.params.appId);
    },

    componentWillReceiveProps(props) {
        if (props.params.appId) {
            if (this.props.params.appId !== props.params.appId) {
                this.props.flux.actions.loadAppRoles(this.props.params.appId);
            }
        } else {
            this.props.flux.actions.loadAppRoles(null);
        }

        if (this.props.params.appId !== props.params.appId) {
            this.props.flux.actions.loadAppRoles(this.props.params.appId);
        }
    },

    render() {
        return (
            <UserManagement appId={this.props.params.appId}
                            appUsers={this.props.appUsersUnfiltered}
                            appRoles={this.props.appRoles}
            />
        );
    }

});

export default AppUsersRoute;
