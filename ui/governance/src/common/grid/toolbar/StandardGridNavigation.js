import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import Pagination from "../../../../../reuse/client/src/components/pagination/pagination";

/**
 * The Navigation Component
 */
class StandardGridNavigation extends React.Component {

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
        return this.props.paginationInfo.totalRecords === 0 || this.props.paginationInfo.currentPage === 1;
    }

    isNextDisabled() {
        return this.props.paginationInfo.totalRecords === 0 || this.props.paginationInfo.currentPage === this.props.paginationInfo.totalPages;
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

StandardGridNavigation.propTypes = {
    id: PropTypes.string.required,
    getPreviousUsersPage :PropTypes.func.required,
    getNextUsersPage :PropTypes.func.required
};

export {StandardGridNavigation};

const mapStateToProps = (state, ownProps) => {
    return {
        paginationInfo: state.Grids[ownProps.id] ? state.Grids[ownProps.id].pagination : {},
    };
};


export default connect(mapStateToProps)(StandardGridNavigation);
