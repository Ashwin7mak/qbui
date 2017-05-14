import {Component, PropTypes} from 'react';
import React from 'react';
import UserFieldValueEditor from '../fields/userFieldValueEditor';
import Select from 'react-select';
import './addUserDialog.scss';

class addUserPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRole: 'MT'
        };
        this.updateRole = this.updateRole.bind(this);
    }

    getRoles() {
        return [
            {value: 'MO', label: 'Missouri'},
            {value: 'MT', label: 'Montana'},
            {value: 'NE', label: 'Nebraska'},
            {value: 'NV', label: 'Nevada'}
        ];
    }
    updateRole(role) {
        this.setState({
            selectedRole: role
        });
    }
    render() {

        const appUsers = this.props.allUsers.map((element)=>{
            return {firstName: element.firstName, lastName: element.lastName, email: element.email};
        })

        // const appUsers = this.props.allUsers
        //
        const fieldDef1 = {
            builtIn: false,
            datatypeAttributes: {
                type: "USER",
                userDisplayFormat: "FIRST_THEN_LAST"
            },
        };

        const fieldDef2 = {
            builtIn: false,
            dataTtypeAttributes: {
                type: "USER",
                userDisplayFormat: "LAST_THEN_FIRST",
            },
            required:true
        };



        return (
            <div className = "panelContainer">
                <div className="selectUser panel-items">
                    <dt>Select Users</dt>
                    <dd>
                        <UserFieldValueEditor value={this.state.selectedRole} appUsers={appUsers} isAddUser={true} fieldDef={fieldDef1} searchUsers={this.props.searchUsers}/>
                    </dd>
                </div>
                <div className="assignRole panel-items">
                    Assign Roles
                    <Select autofocus options={this.getRoles()} simpleValue clearable={false} value={this.state.selectedRole} onChange={this.updateRole}/>

                </div>

            </div>
        );
    }

}


export default addUserPanel;
