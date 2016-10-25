import React from 'react';
import Select from 'react-select';
import QbIcon from '../qbIcon/qbIcon';
import Locale from '../../locales/locales';
import * as userFormatter from '../../../../common/src/formatter/userFormatter';
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

    /**
     * select userId from value prop
     * @returns {{selectedUserId: null}}
     */
    getInitialState() {

        return {selectedUserId: this.props.value ? this.props.value.userId : null};
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
        return _.find(this.props.appUsers, user => user.userId === id);
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

        return  [{value:null, label:""}].concat(appUserItems);
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
            user.email      && user.email.toLowerCase().indexOf(filter) === 0 ||
            user.firstName  && user.firstName.toLowerCase().indexOf(filter) === 0 ||
            user.lastName   && user.lastName.toLowerCase().indexOf(filter) === 0 ||
            user.screenName && user.screenName.toLowerCase().indexOf(filter) === 0;
    },

    /**
     * user picker wrapper on react-select component
     */
    render() {
        let classes = "cellEdit userFormat borderOnError";

        // error state css class
        if (this.props.invalid) {
            classes += ' error';
        }

        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }
        return (
            <Select
                className={classes}
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
