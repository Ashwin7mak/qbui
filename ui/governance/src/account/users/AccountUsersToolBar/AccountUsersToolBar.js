import React, {PropTypes, Component} from "react";
import {I18nMessage} from "../../../../../reuse/client/src/utils/i18nMessage";
import Locale from "../../../../../reuse/client/src/locales/locale";
import AccountUsersNavigation from "./AccountUsersNavigation";
import lodash from 'lodash';

/**
 * The toolbar for the AccountUsers page
 */
class AccountUsersToolBar extends React.Component {

    constructor(...args) {
        super(...args);
    }

    render() {
        return (
            <div>
                <AccountUsersNavigation totalRecords={this.props.totalRecords}/>
            </div>
        );
    }
}

AccountUsersToolBar.defaultProps = {
    totalRecords: 0
};

AccountUsersToolBar.propTypes = {
    totalRecords: PropTypes.Number
};

export default AccountUsersToolBar;
