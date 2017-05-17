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
        return this.props.paginationInfo.firstRecordInCurrentPage;
    }

    getEndRecord() {
        return this.props.paginationInfo.lastRecordInCurrentPage;
    }

    isPreviousDisabled() {
        return this.props.paginationInfo.filteredRecords === 0 || this.props.paginationInfo.currentPage === 1;
    }

    isNextDisabled() {
        return this.props.paginationInfo.filteredRecords === 0 || this.props.paginationInfo.currentPage === this.props.paginationInfo.totalPages;
    }

    render() {
        return (
            <Pagination startRecord={this.getStartRecord()}
                        endRecord={this.getEndRecord()}
                        onClickPrevious={this.props.getPreviousPage}
                        onClickNext={this.props.getNextPage}
                        isPreviousDisabled={this.isPreviousDisabled()}
                        isNextDisabled={this.isNextDisabled()}
                        isHidden={false} />
        );
    }
}

StandardGridNavigation.defaultProps = {
    firstRecordInCurrentPage: 0,
    lastRecordInCurrentPage: 0,
    filteredRecords: 0,
    totalPages: 0,
    currentPage: 1,
};

StandardGridNavigation.propTypes = {
    id: PropTypes.func.required,
    firstRecordInCurrentPage: PropTypes.number,
    lastRecordInCurrentPage: PropTypes.number,
    filteredRecords: PropTypes.number,
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    getPreviousPage :PropTypes.func.required,
    getNextPage :PropTypes.func.required
};

export {StandardGridNavigation};

const mapStateToProps = (state, ownProps) => {
    return {
        paginationInfo: state.Grids[ownProps.id] ? state.Grids[ownProps.id].pagination : {},
    };
};


export default connect(mapStateToProps)(StandardGridNavigation);
