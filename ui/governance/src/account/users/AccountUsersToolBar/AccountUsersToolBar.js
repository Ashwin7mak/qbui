import React, {PropTypes, Component} from "react";
import {I18nMessage} from "../../../../reuse/client/src/utils/i18nMessage";
import Locale from "../../../../reuse/client/src/locales/locale";
import lodash from 'lodash';

/**
 * The stage for the AccountUsers page
 */
class AccountUsersToolBar extends React.Component {

    constructor(...args) {
        super(...args);
    }

    render() {
        return (
            <div>TOOLBAR</div>
        );
    }
}

AccountUsersToolBar.defaultProps = {
    users: []
};

AccountUsersToolBar.propTypes = {
    users: PropTypes.array,
};

export default AccountUsersToolBar;
