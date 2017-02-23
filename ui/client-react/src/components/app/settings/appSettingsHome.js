/**
 * Created by rbeyer on 2/3/17.
 */
import React, {PropTypes} from 'react';
import Card from '../../card/card';
import './appSettingsHome.scss';


/**
 * This class is the layout for the app/:appId/settings route
 * Currently uses cards to show the list of categories in settings
 *
 * @param appId
 * @param appUsers the unfiltered list of Users in the app (meaning the role name and other pertinent information hasn't be added to the user object yet)
 * @param appRoles the list of roles associated with this app
 * @param selectedApp this gives us our default list of app properties which will need to be expanded upon, probably dropped in the future
 * @type {ClassicComponentClass<P>}
 */
const AppSettingsHome = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired
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
