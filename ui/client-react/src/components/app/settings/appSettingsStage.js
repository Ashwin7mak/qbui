/**
 * Created by rbeyer on 3/6/17.
 */
import React, {PropTypes} from 'react';
import Locale from '../../../../../reuse/client/src/locales/locale';
import './appSettingsStage.scss';

class AppSettingsStage extends React.Component {

    constructor(...args) {
        super(...args);
    }

    getRoleTotals = ()=> {
        let usersRoleCount = [];
        let appUsers = this.props.appUsers || [];
        let self = this;
        this.props.appRoles.forEach(function(role) {
            if (appUsers[role.id]) {
                //a local hack while we have no user defined roles, this is so we have pluralized role names
                let noOfUsers = appUsers[role.id].length;
                let roleTitle = (noOfUsers > 1 ? role.name + "s" : role.name);
                let classes = noOfUsers > 0 ? "appRolesPod selectable" : "appRolesPod";
                let selected = false;
                if (self.props.selectedRole === role.id) {classes += ' active'; selected = true;}
                usersRoleCount.push(
                    <div className={classes}
                         key={role.id}
                         onClick={()=>{self.props.filterUserByRole(role.id, noOfUsers, selected);}}>
                        <div className="appRolesDivider">
                            <div className="appRolesPodCount">{`${noOfUsers}`}</div>
                            <div className="appRolesPodName">{roleTitle}</div>
                        </div>
                    </div>
                );
            }
        });
        return usersRoleCount;
    }

    getAppOwnerName= ()=> {
        if (this.props.appOwner) {
            let appOwner = `${this.props.appOwner.firstName} ${this.props.appOwner.lastName}`;
            if (this.props.appOwner.email) {
                let mailTo = `mailto:${this.props.appOwner.email}`;
                return (<a href={mailTo}>{appOwner}</a>);
            } else {
                return (appOwner);
            }
        }
        return '';
    }

    getAppOwnerSection = ()=> {
        let appOwnerTitle = `, ${Locale.getMessage('app.users.manager')}`;
        let appUsersManagementContent = Locale.getMessage('app.users.content');
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
