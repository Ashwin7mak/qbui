import React from 'react';
import UserFieldValueEditor from '../../../fields/userFieldValueEditor';
import Select from 'react-select';
import './addUserDialog.scss';
import constants from '../../../../../../common/src/constants';
import Locale from '../../../../../../reuse/client/src/locales/locale';

class addUserPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRole: '',
        };
        this.updateRole = this.updateRole.bind(this);
    }

    getRoles() {
        let defaultRole = constants.DEFAULT_ROLE;
        const roles = this.props.appRoles.map((appRole)=>{
            if (appRole.name === defaultRole) {defaultRole = appRole.id;}
            return {value: appRole.id, label: appRole.name, clearableValue: false};
        });
        roles.sort((a, b)=>{
            return b.value - a.value;
        });
        if (this.state.selectedRole === '') {
            this.state.selectedRole = defaultRole;
            this.props.setUserRoleToAdd(defaultRole);
        }
        return roles;
    }
    updateRole(roleId) {
        this.setState({
            selectedRole: roleId
        });
        // used to add user during API call
        this.props.setUserRoleToAdd(roleId);
    }
    getSelectedUser() {
        return this.fieldValueEditor.state.selectedUserId;
    }
    render() {

        const appUsers = this.props.realmUsers.map((user)=>{
            let {firstName, lastName, email, screenName} = user;
            return {firstName, lastName, email, screenName, userId: user.id};
        });

        const fieldDef1 = {
            builtIn: false,
            datatypeAttributes: {
                type: "USER",
                userDisplayFormat: "FIRST_THEN_LAST"
            },
        };

        return (
            <div className = "panelContainer">
                <div className="selectUser panel-items">
                    <dt>Select users</dt>
                    <dd>
                        <UserFieldValueEditor
                            appUsers={appUsers}
                            isAddUser={true}
                            fieldDef={fieldDef1}
                            loadingPlaceholder={Locale.getMessage('addUserToApp.searching')}
                            searchUsers={this.props.searchUsers}
                            isValid={this.props.isValid}
                            existingUsers={this.props.existingUsers}
                            ref={(fieldValueEditor) => {this.fieldValueEditor = fieldValueEditor;}}
                        />
                    </dd>
                </div>
                <div className="assignRole panel-items">
                    <dt>Assign role</dt>
                    <Select
                        autofocus
                        options={this.getRoles()}
                        searchable={false}
                        simpleValue
                        clearable={false}
                        value={this.state.selectedRole}
                        onChange={this.updateRole}
                    />
                </div>

            </div>
        );
    }
}

export default addUserPanel;
