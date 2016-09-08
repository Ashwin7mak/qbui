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

    getSelectedUser() {
        return this.props.appUsers.find(appUser => appUser.userId === this.state.selectedUserId);
    },

    getSelectItems() {
        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};

        return this.props.appUsers ?
            this.props.appUsers.map(user => {
                const label = userFormatter.format({value: user}, datatypeAttributes);
                return {value: user.userId, label};
            }) : [];
    },

    onBlur() {
        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};

        const user = this.getSelectedUser();

        const theVals = {
            value: user,
            display: user ? userFormatter.format(user, datatypeAttributes) : ''
        };

        this.props.onBlur(theVals);
    },

    render() {

        return (
            <Select
                className="cellEdit"
                tabIndex="0"
                value={this.state.selectedUserId}
                options={this.getSelectItems()}
                onChange={this.selectUser}
                onBlur={this.onBlur} />
        );
    }
});

export default UserFieldValueEditor;
