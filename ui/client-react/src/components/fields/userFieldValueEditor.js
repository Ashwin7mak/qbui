import React from 'react';
import Select from 'react-select';
import * as userFormatter from '../../../../common/src/formatter/userFormatter';
import 'react-select/dist/react-select.min.css';
import './userFieldValueEditor.scss';

const UserFieldValueEditor = React.createClass({
    displayName: 'UserFieldValueEditor',

    propTypes: {
        appUsers: React.PropTypes.array,
        value: React.PropTypes.object,
        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object
    },

    getInitialState() {

        return {selectedUserId: this.props.value ? this.props.value.userId : null};
    },

    selectUser(user) {

        this.setState({selectedUserId: user ? user.value : null});
    },

    getAppUser(id) {
        return this.props.appUsers.find(user => user.id === id);
    },

    getSelectedUser() {
        const appUser = this.getAppUser(this.state.selectedUserId);

        if (appUser) {
            // sadly the app user object has an id property but the record user object has a userId property...
            let selectedUser = _.clone(appUser);
            if (appUser.id) {
                selectedUser.userId = selectedUser.id;
            }
            _.unset(selectedUser, "id");

            return selectedUser;
        } else {
            return null;
        }
    },

    getSelectItems() {
        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};

        return this.props.appUsers ?
            this.props.appUsers.map(user => {
                const label = userFormatter.format({value: user}, datatypeAttributes);
                return {
                    value: user.id,
                    label};
            }) : [];
    },

    onBlur() {

        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
        const user = this.getSelectedUser();

        const theVals = {
            value: user,
            display: user ? userFormatter.format({value: user}, datatypeAttributes) : ''
        };

        this.props.onBlur(theVals);
    },

    renderOption(option) {

        const user = this.getAppUser(option.value);
        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
        const userLabel = userFormatter.format({value: user}, datatypeAttributes);

        return (
            <div className="userOption">
                <div className="userLabel">{userLabel}</div>
                <div className="email">{user.email}</div>
            </div>);
    },

    render() {

        return (
            <Select
                className="cellEdit"
                tabIndex="0"
                matchPos="start"
                value={this.state.selectedUserId}
                optionRenderer={this.renderOption}
                options={this.getSelectItems()}
                onChange={this.selectUser}
                onBlur={this.onBlur} />
        );
    }
});

export default UserFieldValueEditor;
