import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import Pagination from "../../../../../reuse/client/src/components/pagination/pagination";

/**
 * The Navigation Component
 */
export class StandardGridNavigation extends Component {

    getStartItem = () => {
        return this.props.paginationInfo.firstItemIndexInCurrentPage;
    };

    getEndItem = () => {
        return this.props.paginationInfo.lastItemIndexInCurrentPage;
    };

    /**
     * Previous is disabled if we are at the first page or there are no items
     * @returns {boolean}
     */
    isPreviousDisabled = () => {
        return this.props.paginationInfo.totalFilteredItems === 0 || this.props.paginationInfo.currentPage === 1;
    };

    /**
     * Previous is disabled if we are at the last page or there are no items
     * @returns {boolean}
     */
    isNextDisabled = () => {
        return this.props.paginationInfo.totalFilteredItems === 0 || this.props.paginationInfo.currentPage === this.props.paginationInfo.totalPages;
    };

    render() {
        return (
            <Pagination startRecord={this.getStartItem()}
                        endRecord={this.getEndItem()}
                        onClickPrevious={this.props.getPreviousPage}
                        onClickNext={this.props.getNextPage}
                        isPreviousDisabled={this.isPreviousDisabled()}
                        isNextDisabled={this.isNextDisabled()}
                        isHidden={false} />
        );
    }
}

StandardGridNavigation.propTypes = {
    /**
     * ID of the Grid
     */
    id: PropTypes.string.required,

    firstItemIndexInCurrentPage: PropTypes.number,
    lastItemIndexInCurrentPage: PropTypes.number,

    /**
     * The total items that we are displaying
     */
    totalFilteredItems: PropTypes.number,

    /**
     * Keep track of the total as well as current page
     */
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,

    /**
     * Navigation to previous or next pages
     */
    getPreviousPage :PropTypes.func.required,
    getNextPage :PropTypes.func.required
};

StandardGridNavigation.defaultProps = {
    firstItemIndexInCurrentPage: 0,
    lastItemIndexInCurrentPage: 0,
    totalFilteredItems: 0,
    totalPages: 0,
    currentPage: 1,
};

const mapStateToProps = (state, ownProps) => {
    return {
        paginationInfo: state.Grids[ownProps.id] ? state.Grids[ownProps.id].pagination : {},
    };
};


export default connect(mapStateToProps)(StandardGridNavigation);
