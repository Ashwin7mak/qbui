/**
 * Created by rbeyer on 3/6/17.
 */
import React, {PropTypes} from 'react';
import Locale from '../../../../../reuse/client/src/locales/locale';
import './appSettingsStage.scss';

class AppSettingsStage extends React.Component {

    constructor(...args) {
        super(...args);
        this.getRoleTotals = this.getRoleTotals.bind(this);
        this.getAppOwnerSection = this.getAppOwnerSection.bind(this);
        this.getAppOwnerName = this.getAppOwnerName.bind(this);
    }

    getRoleTotals() {
        let usersRoleCount = [];
        let appUsers = this.props.appUsers;
        this.props.appRoles.forEach(function(role) {
            if (appUsers[role.id]) {
                //a local hack while we have no user defined roles, this is so we have pluralized role names
                let roleTitle = (appUsers[role.id].length > 1 ? role.name + "s" : role.name);
                usersRoleCount.push(
                    <div className="appRolesPod">
                        <div className="appRolesDivider">
                            <div className="appRolesPodCount">{`${appUsers[role.id].length}`}</div>
                            <div className="appRolesPodName">{roleTitle}</div>
                        </div>
                    </div>
                );
            }
        });
        return usersRoleCount;
    }

    getAppOwnerName() {
        let appOwner = `${this.props.appOwner.firstName} ${this.props.appOwner.lastName}`;
        if (this.props.appOwner.email) {
            let mailTo = `mailto:${this.props.appOwner.email}`;
            return (<a href={mailTo}>{appOwner}</a>);
        } else {
            return (appOwner);
        }
    }

    getAppOwnerSection() {
        let appOwnerTitle = `, Application Manager`;
        let appUsersManagementContent = `${Locale.getMessage('app.users.content')}`;
        return (
            <div className="appOwnerContainer">
                <div className="appOwnerName">
                    <div>{this.getAppOwnerName()}{appOwnerTitle}</div>
                </div>
                <div className="appUsersManagementContent">
                    {appUsersManagementContent}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="report-content">
                <div className="left">
                    <div className="content">
                        <div className="stage-showHide-content">
                            {this.getAppOwnerSection()}
                            <div className="appRolesContent">
                                {this.getRoleTotals()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}
AppSettingsStage.propTypes = {
    appUsers: PropTypes.object.isRequired,
    appRoles: PropTypes.array.isRequired,
    appOwner: PropTypes.object.isRequired
};

export default AppSettingsStage;
