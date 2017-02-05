/**
 * Created by rbeyer on 2/3/17.
 */
import React, {PropTypes} from 'react';
import SettingsMenuItem from './settingsMenuItem';
import './appManagementHome.scss';

const AppManagementHome = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired,
        appUsers: PropTypes.array.isRequired,
        selectedApp: PropTypes.object.isRequired
    },

    constructSettingsLink(setting) {
        return "/qbase/app/" + this.props.appId + "/" + setting;
    },

    render() {
        return (
            <div className="appManagementHomeContainer">
                <SettingsMenuItem appId={this.props.appId}
                                  title="Roles"
                                  subTitle="Manage the roles in this app"
                                  icon="thumbs-up"
                />
                <SettingsMenuItem appId={this.props.appId}
                                  title="Tables"
                                  subTitle="Manage the tables in this app"
                                  icon="report-table"
                />
                <SettingsMenuItem appId={this.props.appId}
                                  title="App Properties"
                                  subTitle="Manage the properties of this app"
                                  icon="settings"
                />
                <SettingsMenuItem appId={this.props.appId}
                                  title="Pages"
                                  subTitle="Manage the pages in this app"
                                  icon="report-menu-4"
                />
                <SettingsMenuItem appId={this.props.appId}
                                  title="Branding"
                                  subTitle="Customize the appearance of your app"
                                  icon="favicon"
                />
                <SettingsMenuItem appId={this.props.appId}
                                  title="Users"
                                  subTitle="Add/Remove Users in this app"
                                  icon="users"
                                  link={this.constructSettingsLink("users")}
                />
            </div>
        );
    }

});

export default AppManagementHome;