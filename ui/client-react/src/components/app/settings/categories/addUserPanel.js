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

	/**
     * get user roles in a react-select key-value pair structure
     * @returns [] User Roles
	 */
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

	/**
     * update selected role in state
	 * @param roleId
	 */
    updateRole(roleId) {
        this.setState({
            selectedRole: roleId
        });
        // used to add user during API call
        this.props.setUserRoleToAdd(roleId);
    }

	/**
     * gets the selected user Id from fieldValueEditor component
	 * @returns string
	 */
    getSelectedUser() {
        return this.fieldValueEditor.state.selectedUserId;
    }
    render() {
        // set userId key with user.id as a value based on
        // the structure needed by UserFieldValueEditor component
        const appUsers = this.props.realmUsers.map((user)=>{
            let {firstName, lastName, email, screenName} = user;
            return {firstName, lastName, email, screenName, userId: user.id};
        });

        const fieldDef1 = {
            builtIn: false,
            datatypeAttributes: {
                type: constants.USER,
                userDisplayFormat: constants.FIRST_THEN_LAST
            },
        };

        return (
            <div className = "panelContainer">
                <div className="selectUser panel-items">
                    <dt>{Locale.getMessage('addUserToApp.selectUsers')}</dt>
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
                    <dt>{Locale.getMessage('addUserToApp.assignRole')}</dt>
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
