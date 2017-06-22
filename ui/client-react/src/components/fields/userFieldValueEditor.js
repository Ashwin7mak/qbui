import React from 'react';
import Select from '../select/reactSelectWrapper';
import QbIcon from '../qbIcon/qbIcon';
import Locale from '../../locales/locales';
import * as userFormatter from '../../../../common/src/formatter/userFormatter';
import {ERROR_CSS_CLASSES} from '../../constants/componentConstants';
import _ from 'lodash';
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
         * A boolean to disabled field on form builder
         */
        isDisabled: React.PropTypes.bool,

        /**
         * the currently selected user
         */
        value: React.PropTypes.any,
        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object.isRequired,

        /**
         * renders with red border if true */
        invalid: React.PropTypes.bool,

        /**
         * message to display in the tool tip when invalid */
        invalidMessage: React.PropTypes.string,
        /**
         * callback when the user editor loses focus
         */
        onBlur: React.PropTypes.func
    },

    defaultProps: {
        loadingPlaceholder: 'Loading'
    },

    /**
     * select userId from value prop
     * @returns {{selectedUserId: null}}
     */
    getInitialState() {
        return {
            selectedUserId: this.props.value ? this.props.value.userId : null,
            inputValue: '',
        };
    },

    updateValidState(isValid, selectedUser) {
        if (this.props.isValid) {
            this.props.isValid(isValid ? selectedUser : false);
        }
    },

    /**
     * user selection callback
     * @param user
     */
    selectUser(user) {
        let selectedUserIsValid = user || !this.props.fieldDef.required;

        if (selectedUserIsValid) {
            this.setState({selectedUserId: user ? user.value : null});
        }

        this.updateValidState(selectedUserIsValid, user);
    },

    /**
     * find user from appUsers with id
     * @param id
     * @returns {T}
     */
    getAppUser(id) {
        return _.find(this.props.appUsers, user => user.userId === id);
    },

	/**
     * checks if a user is already added to an app
	 * @param user a list of users
     * @returns Boolean
	 */
    isUserInApp(user) {
        let roles = this.props.existingUsers;
        let userPresent =  _.find(Object.keys(roles), (roleId)=>{
            return _.find(roles[roleId], (existingUser)=>{
                return existingUser.userId === user.userId;
            });
        });
        return Boolean(userPresent);
    },

    /**
     * get value/label pairs for select menu items
     * @returns array of user objects with value/label/showEmail properties
     */
    getSelectItems() {
        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
        const appUserItems = this.props.appUsers ?
            this.props.appUsers.map(user => {
                let disabled = this.props.isAddUser ? this.isUserInApp(user) : false;
                const label = userFormatter.format({value: user}, datatypeAttributes);
                return {
                    value: user.userId,
                    label, disabled};
            }) : [];

        // for each user, if there is another user with the same label, show the email to disambiguate
        appUserItems.forEach(current => {
            current.showEmail = appUserItems.reduce((count, user) => count + (user.label === current.label ? 1 : 0), 0) > 1;
        });
        // added the ternary because we dont need the blank entry in the options when "Add User to App" uses this component
        return this.props.isAddUser ? appUserItems : [{value:null, label:""}].concat(appUserItems);

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
        let user = this.getAppUser(option.value);
        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
        const userLabel = userFormatter.format({value: user}, datatypeAttributes);

        if (user) {
            return (
                <div className="userOption">
                    {this.state.selectedUserId === user.userId && !this.props.isAddUser && <QbIcon icon="check-reversed"/>}
                    <div className="userLabel">{userLabel} {user.screenName &&
                    <span>({user.screenName})</span>} {user.deactivated &&
                    <span className="deactivatedLabel">(deactivated)</span>}</div>
                    {(option.showEmail || this.props.isAddUser) && user.email && <div className="email">{user.email}</div>}
                </div>);
        } else {
            return <div className="hidden">&nbsp;</div>;
        }
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
            user.email      && user.email.toLowerCase().indexOf(filter) === 0 ||
            user.firstName  && user.firstName.toLowerCase().indexOf(filter) === 0 ||
            user.lastName   && user.lastName.toLowerCase().indexOf(filter) === 0 ||
            user.screenName && user.screenName.toLowerCase().indexOf(filter) === 0;
    },

    /**
     * Called when the user types text into the react-select input.
     * @param {String} newInputValue value of the react-select input
     */
    onInputChange(newInputValue) {
        if (!this.props.isAddUser) {this.setState({inputValue: newInputValue});}
    },

    loadAsyncOptions(input, callback) {
        return input === '' ?
            callback(null, {
                options: this.getSelectItems(),
                complete: false
            }) :
            this.props.searchUsers(input).then(()=>{
                callback(null, {
                    options: this.getSelectItems(),
                    complete: false
                });
            });
    },

    /**
     * user picker wrapper on react-select component
     */
    render() {
        let classes = "cellEdit userFormat";

        // error state css class
        if (this.props.invalid) {
            classes += ' ' + ERROR_CSS_CLASSES;
        }

        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        let noResultsText;

        // this text is displayed in the dropdown when there are no users that matches a search
        if (this.props.isAddUser) {
            noResultsText = `${Locale.getMessage("field.searchNoMatchAddUser")}`;
        }        else {
            noResultsText = `${Locale.getMessage("field.searchNoMatch")} "${this.state.inputValue}"`;
        }

        return (
            <Select
                className={classes}
                tabIndex={this.props.tabIndex}
                isDisabled={this.props.isDisabled}
                filterOption={this.filterOption}
                value={this.state.selectedUserId}
                optionRenderer={this.renderOption}
                options={this.getSelectItems()}
                loadAsyncOptions={this.loadAsyncOptions}
                onChange={this.selectUser}
                onInputChange={this.onInputChange}
                placeholder={Locale.getMessage("field.search")}
                isAddUser={this.props.isAddUser}
                noResultsText={noResultsText}
                loadingPlaceholder={this.props.loadingPlaceholder}
                autosize={false}
                clearable={false}
                searchPromptText={this.props.searchPromptText}
                onBlur={this.onBlur}/>
        );
    }
});

export default UserFieldValueEditor;
