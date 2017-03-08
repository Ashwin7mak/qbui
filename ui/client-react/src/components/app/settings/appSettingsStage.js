/**
 * Created by rbeyer on 3/6/17.
 */
import React, {PropTypes} from 'react';

class AppSettingsStage extends React.Component {

    constructor(...args) {
        super(...args);
        this.getRoleTotals = this.getRoleTotals.bind(this);
    }

    getRoleTotals() {
        let usersInRolesCount = ``;
        let appUsers = this.props.appUsers;
        this.props.appRoles.forEach(function(role) {
            if (appUsers[role.id]) {
                usersInRolesCount = usersInRolesCount + `${appUsers[role.id].length} ${role.name} `;
            }
        });
        return usersInRolesCount;
    }

    render() {
        return (
            <div className="report-content">
                <div className="left">
                    <div className="content">
                        <div className="stage-showHide-content">{this.getRoleTotals()}</div>
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
