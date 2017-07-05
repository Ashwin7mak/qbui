/**
 * Created by rbeyer on 3/6/17.
 */
import React, {PropTypes} from 'react';
import Locale from '../../../../../reuse/client/src/locales/locale';
import './appSettingsStage.scss';
import {connect} from 'react-redux';
import {changeStageSelectedRoleId} from '../../../actions/userActions';


export class AppSettingsStage extends React.Component {

    getRoleTotals = ()=> {
        let usersRoleCount = [];
        let appUsers = this.props.appUsers || [];
        this.props.appRoles.forEach((role) => {
            if (appUsers[role.id]) {
                let numberOfUsers = appUsers[role.id].length;
                //a local hack while we have no user defined roles, this is so we have pluralized role names
                let roleTitle = (numberOfUsers > 1 ? role.name + "s" : role.name);
                let classes = numberOfUsers > 0 ? ["appRolesPod", "selectable"] : ["appRolesPod"];
                let selected = false;
                if (this.props.stageSelectedRoleId === role.id) {classes.push('active') ; selected = true;}
                usersRoleCount.push(
                    <div className={classes.join(' ')}
                         key={role.id}
                         onClick={()=>this.filterUserByRole(role.id, numberOfUsers, selected)}>
                        <div className="appRolesDivider">
                            <div className="appRolesPodCount">{numberOfUsers}</div>
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

    filterUserByRole = (roleId, numberOfUsers, isActive)=> {
        if (numberOfUsers === 0) {return;}
        roleId = isActive ? null : roleId;
        this.props.changeStageSelectedRoleId(roleId);

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

const mapStateToProps = (state) => ({stageSelectedRoleId: state.selectedApp.stageSelectedRoleId});
const mapDispatchToProps = {changeStageSelectedRoleId};

export default connect(mapStateToProps, mapDispatchToProps)(AppSettingsStage);
