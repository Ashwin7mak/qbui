import React from 'react';
import Select from 'react-select';
import QbIcon from '../qbIcon/qbIcon';

import * as userFormatter from '../../../../common/src/formatter/userFormatter';
import 'react-select/dist/react-select.min.css';
import './userFieldValueEditor.scss';

const UserFieldValueEditor = React.createClass({
    displayName: 'UserFieldValueEditor',

    propTypes: {
        appUsers: React.PropTypes.array.isRequired,
        value: React.PropTypes.object,
        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object.isRequired,
        onBlur: React.PropTypes.func
    },

    getInitialState() {

        return {selectedUserId: this.props.value ? this.props.value.userId : null};
    },

    selectUser(user) {

        if (user || !this.props.fieldDef.required) {
            this.setState({selectedUserId: user ? user.value : null});
        }
    },

    getAppUser(id) {
        return this.props.appUsers.find(user => user.userId === id);
    },


    getSelectItems() {
        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};

        const appUserItems = this.props.appUsers ?
            this.props.appUsers.map(user => {
                const label = userFormatter.format({value: user}, datatypeAttributes);
                return {
                    value: user.userId,
                    label};
            }) : [];

        // for each user, if there is another user with the same label, show the email to disambiguate
        appUserItems.forEach(current => {
            current.showEmail = appUserItems.reduce((count, user) => count + (user.label === current.label ? 1 : 0), 0) > 1;
        });

        // if a field is not required, include a blank selection at the beginning of the list
        if (!this.props.fieldDef.required) {
            return  [{value:null, label:""}].concat(appUserItems);

        }

        return appUserItems;
    },

    onBlur() {
        if (this.props.onBlur) {
            const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
            const user = this.getAppUser(this.state.selectedUserId);

            const theVals = {
                value: user,
                display: user ? userFormatter.format({value: user}, datatypeAttributes) : ''
            };
            this.props.onBlur(theVals);
        }
    },

    renderOption(option) {

        if (option.value === null) {
            return <div>&nbsp;</div>;
        }
        const user = this.getAppUser(option.value);

        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
        const userLabel = userFormatter.format({value: user}, datatypeAttributes);

        return (
            <div className="userOption">
                {this.state.selectedUserId === user.userId && <QbIcon icon="check-reversed"/>}
                <div className="userLabel">{userLabel} {user.deactivated && <span className="deactivatedLabel">(deactivated)</span>}</div>
                {option.showEmail && user.email && <div className="email">{user.email}</div>}
            </div>);
    },

    filterOption(option, filter) {

        if (option.value === null) {
            return filter === '';
        }

        const user = this.getAppUser(option.value);

        filter = filter.toLowerCase();

        return user.value === null ||
            user.email      && user.email.toLowerCase().startsWith(filter) ||
            user.firstName  && user.firstName.toLowerCase().startsWith(filter) ||
            user.lastName   && user.lastName.toLowerCase().startsWith(filter) ||
            user.screenName && user.screenName.toLowerCase().startsWith(filter);
    },

    render() {

        return (
            <Select
                className="cellEdit"
                tabIndex="0"
                filterOption={this.filterOption}
                value={this.state.selectedUserId}
                optionRenderer={this.renderOption}
                options={this.getSelectItems()}
                onChange={this.selectUser}
                placeholder="Search..."
                noResultsText="Not found"
                autosize={false}
                clearable={false}
                onBlur={this.onBlur} />
        );
    }
});

export default UserFieldValueEditor;
