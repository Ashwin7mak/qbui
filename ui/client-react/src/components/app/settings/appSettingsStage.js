/**
 * Created by rbeyer on 3/6/17.
 */
import React, {PropTypes} from 'react';
import './appSettingsStage.scss';

class AppSettingsStage extends React.Component {

    constructor(...args) {
        super(...args);
        this.getRoleTotals = this.getRoleTotals.bind(this);
    }

    getRoleTotals() {
        let usersRoleCount = [];
        let appUsers = this.props.appUsers;
        this.props.appRoles.forEach(function(role) {
            if (appUsers[role.id]) {
                usersRoleCount.push(
                    <div className="appRolesPod">
                        <div className="appRolesDivider">
                            <div className="appRolesPodCount">{`${appUsers[role.id].length}`}</div>
                            <div className="appRolesPodName">{role.name}</div>
                        </div>
                    </div>
                );
            }
        });
        return usersRoleCount;
    }

    render() {
        return (
            <div className="report-content">
                <div className="left">
                    <div className="content">
                        <div className="stage-showHide-content">
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
    appRoles: PropTypes.array.isRequired
};

export default AppSettingsStage;
