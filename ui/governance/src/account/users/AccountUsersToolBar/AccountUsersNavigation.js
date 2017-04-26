import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import Pagination from "../../../../../reuse/client/src/components/pagination/pagination";
import * as _ from "lodash";

/**
 * The Navigation Component for the AccountUsers page
 */
class AccountUsersNavigation extends React.Component {

    constructor(...args) {
        super(...args);
    }

    getStartRecord() {
        return this.props.paginationInfo.currentPage;
    }

    getEndRecord() {
        return this.props.paginationInfo.totalPages;
    }

    isPreviousDisabled() {
        return this.props.paginationInfo.currentPage === 1;
    }

    isNextDisabled() {
        return this.props.paginationInfo.currentPage === this.props.paginationInfo.totalPages;
    }

    render() {
        return (
            <Pagination startRecord={this.getStartRecord()}
                        endRecord={this.getEndRecord()}
                        onClickPrevious={this.props.getPreviousUsersPage}
                        onClickNext={this.props.getNextUsersPage}
                        isPreviousDisabled={this.isPreviousDisabled()}
                        isNextDisabled={this.isNextDisabled()}
                        isHidden={false} />
        );
    }
}

AccountUsersNavigation.propTypes = {
    id: PropTypes.string
};

export {AccountUsersNavigation};

const mapStateToProps = (state, ownProps) => {
    return {
        paginationInfo: _.has(state.Grids, ownProps.id) ? state.Grids[ownProps.id].pagination : {},
    };
};


export default connect(mapStateToProps)(AccountUsersNavigation);
