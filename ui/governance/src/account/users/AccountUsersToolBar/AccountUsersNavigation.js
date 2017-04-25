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
        this.PAGE_ITEMS = 10;
    }

    isNextDisabled() {
        return this.props.totalRecords < this.PAGE_ITEMS;
    }

    isPreviousDisabled() {
        return this.props.pagination.currentIndex === 0;
    }

    render() {
        return (
            <Pagination startRecord={1}
            endRecord={this.props.totalRecords}
            isPreviousDisabled={this.isPreviousDisabled()}
            isNextDisabled={this.isNextDisabled()}
            isHidden={false} />
        );
    }
}

AccountUsersNavigation.defaultProps = {
    pagination : {}
};

AccountUsersNavigation.propTypes = {
    pagination: PropTypes.object
};

export {AccountUsersNavigation};

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => {
    return {
        pagination: state.Grids.pagination
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountUsersNavigation);
