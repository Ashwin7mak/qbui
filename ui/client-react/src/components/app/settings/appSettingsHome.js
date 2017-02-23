/**
 * Created by rbeyer on 2/3/17.
 */
import React, {PropTypes} from 'react';
import Card from '../../card/card';
import './appSettingsHome.scss';

const AppSettingsHome = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired,
        appUsers: PropTypes.object.isRequired,
        appRoles: PropTypes.array.isRequired,
        selectedApp: PropTypes.object.isRequired
    },

    constructSettingsLink(setting) {
        return "/qbase/app/" + this.props.appId + "/" + setting;
    },

    render() {
        return (
            <div className="appSettingsHomeContainer">
                <Card title="Roles"
                                  subTitle="Manage the roles in this app"
                                  icon="thumbs-up"
                />
                <Card title="Tables"
                                  subTitle="Manage the tables in this app"
                                  icon="report-table"
                />
                <Card title="App Properties"
                                  subTitle="Manage the properties of this app"
                                  icon="settings"
                                  link={this.constructSettingsLink("properties")}
                />
                <Card title="Pages"
                                  subTitle="Manage the pages in this app"
                                  icon="report-menu-4"
                />
                <Card title="Branding"
                                  subTitle="Customize the appearance of your app"
                                  icon="favicon"
                />
                <Card title="Users"
                                  subTitle="Add/Remove Users in this app"
                                  icon="users"
                                  link={this.constructSettingsLink("users")}
                />
            </div>
        );
    }

});

export default AppSettingsHome;
