import React, {PropTypes, Component} from "react";
import {I18nMessage} from "../../../../../reuse/client/src/utils/i18nMessage";
import Locale from "../../../../../reuse/client/src/locales/locale";
import lodash from 'lodash';
import Pagination from "../../../../../reuse/client/src/components/pagination/pagination";

/**
 * The stage for the AccountUsers page
 */
class AccountUsersNavigation extends React.Component {

    constructor(...args) {
        super(...args);
    }

    render() {
        return (
            <Pagination startRecord={1}
            endRecord={3}
            isPreviousDisabled={true}
            isNextDisabled={false}
            isHidden={false} />
        );
    }
}

AccountUsersNavigation.defaultProps = {
    users: []
};

AccountUsersNavigation.propTypes = {
    users: PropTypes.array,
};

export default AccountUsersNavigation;
