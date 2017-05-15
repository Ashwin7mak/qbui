import {Component, PropTypes} from 'react';
import React from 'react';
import UserFieldValueEditor from '../fields/userFieldValueEditor';
import Select from 'react-select';
import './addUserDialog.scss';

class addUserPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRole: 'Participant',
        };
        this.updateRole = this.updateRole.bind(this);
    }

    getRoles() {
        const roles = this.props.appRoles.map((appRole)=>{
            return {value: appRole.id, label: appRole.name, clearableValue: false};
        });
        return roles;
    }
    updateRole(roleId) {
        this.setState({
            selectedRole: roleId
        });
        this.props.setUserRoleToAdd(roleId);
    }
    getSelectedUser() {
        return this.testField.state.selectedUserId;
    }
    render() {

        const appUsers = this.props.allUsers.map((user)=>{
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
                    <dt>Select Users</dt>
                    <dd>
                        <UserFieldValueEditor
                            appUsers={appUsers}
                            isAddUser={true}
                            fieldDef={fieldDef1}
                            searchUsers={this.props.searchUsers}
                            ref={(fieldValueEditor) => {this.testField = fieldValueEditor;}}
                        />
                    </dd>
                </div>
                <div className="assignRole panel-items">
                    Assign Roles
                    <Select autofocus options={this.getRoles()} searchable={false} simpleValue clearable={false} value={this.state.selectedRole} onChange={this.updateRole}/>

                </div>

            </div>
        );
    }

}


export default addUserPanel;
