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

    /**
     * Determines if pagination navigation should be visible
     * @returns {boolean}
     */
    shouldNavigate = () => {
        return this.props.paginationInfo.totalPages > 1;
    };


    render() {
        return (
            this.shouldNavigate() &&
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
    id: PropTypes.string.isRequired,

    /**
     * Navigation to previous or next pages
     */
    getPreviousPage :PropTypes.func.isRequired,
    getNextPage :PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        paginationInfo: state.Grids[ownProps.id] ? state.Grids[ownProps.id].pagination : {},
    };
};


export default connect(mapStateToProps)(StandardGridNavigation);
