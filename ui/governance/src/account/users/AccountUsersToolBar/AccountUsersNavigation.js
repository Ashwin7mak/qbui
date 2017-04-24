import React, {PropTypes, Component} from "react";
import {I18nMessage} from "../../../../../reuse/client/src/utils/i18nMessage";
import Locale from "../../../../../reuse/client/src/locales/locale";
import lodash from 'lodash';
import {connect} from 'react-redux';
import Pagination from "../../../../../reuse/client/src/components/pagination/pagination";

/**
 * The stage for the AccountUsers page
 */
class AccountUsersNavigation extends React.Component {

    constructor(...args) {
        super(...args);
    }

    isNextDisabled() {
        return false;
    }

    isPreviousDisabled() {
        return false;
    }

    render() {
        return (
            <Pagination startRecord={1}
            endRecord={this.props.users.length}
            isPreviousDisabled={this.isPreviousDisabled()}
            isNextDisabled={this.isNextDisabled()}
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

export {AccountUsersNavigation};

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => {
    return {
        requestUser: state.RequestContext.currentUser
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountUsersNavigation);
