import React from 'react';
import Select from 'react-select';
import QbIcon from '../qbIcon/qbIcon';
import Locale from '../../locales/locales';
import * as userFormatter from '../../../../common/src/formatter/userFormatter';
import 'react-select/dist/react-select.min.css';
import './userFieldValueEditor.scss';

/**
 * # UserFieldValueEditor
 *
 *
 * This component presents a list of users and allows the user to select one of them.
 *
 *
 * */
const UserFieldValueEditor = React.createClass({
    displayName: 'UserFieldValueEditor',

    propTypes: {
        /**
         * the users available to choose from
         */
        appUsers: React.PropTypes.array.isRequired,

        /**
         * the currently selected user
         */
        value: React.PropTypes.object,
        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object.isRequired,

        /**
         * callback when the user editor loses focus
         */
        onBlur: React.PropTypes.func
    },

    /**
     * select userId from value prop
     * @returns {{selectedUserId: null}}
     */
    getInitialState() {

        let selectedUserId = this.props.value ? this.props.value.userId : null;

        // select the first user if the value was not set but is required
        if (selectedUserId === null && this.props.fieldDef.required && this.props.appUsers.length > 0) {
            selectedUserId = this.props.appUsers[0].userId;
        }

        return {selectedUserId};
    },

    /**
     * user selection callback
     * @param user
     */
    selectUser(user) {
        if (user || !this.props.fieldDef.required) {
            this.setState({selectedUserId: user ? user.value : null});
        }
    },

    /**
     * find user from appUsers with id
     * @param id
     * @returns {T}
     */
    getAppUser(id) {
        return this.props.appUsers.find(user => user.userId === id);
    },

    /**
     * get value/label pairs for select menu items
     * @returns array of user objects with value/label/showEmail properties
     */
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

    /**
     * handle onBlur (invoke parent prop callback)
     */
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

    /**
     * render an menu item in the select
     * @param option user object with value & email flag
     */
    renderOption(option) {

        if (option.value === null) {
            return <div>&nbsp;</div>; // placeholder for no-user
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

    /**
     * apply search text filter to menu item
     * @param option
     * @param filter
     * @returns true if menu option matches filter
     */
    filterOption(option, filter) {

        if (option.value === null) {
            // only show placeholder when not searching
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

    /**
     * user picker wrapper on react-select component
     */
    render() {

        return (
            <Select
                className="cellEdit userFormat"
                tabIndex="0"
                filterOption={this.filterOption}
                value={this.state.selectedUserId}
                optionRenderer={this.renderOption}
                options={this.getSelectItems()}
                onChange={this.selectUser}
                placeholder={Locale.getMessage("field.search")}
                noResultsText={Locale.getMessage("field.searchNoMatch")}
                autosize={false}
                clearable={false}
                onBlur={this.onBlur} />
        );
    }
});

export default UserFieldValueEditor;
