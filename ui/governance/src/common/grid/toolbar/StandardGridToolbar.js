import React, {PropTypes, Component} from "react";
import StandardGridNavigation from "./StandardGridNavigation";
import StandardGridItemsCount from "../../../../../reuse/client/src/components/itemsCount/StandardGridItemsCount";
import * as StandardGridActions from "../../../common/grid/standardGridActions";
import GenericFilterSearchBox from "../../../../../reuse/client/src/components/facets/genericFilterSearchBox";
import {connect} from "react-redux";
import FacetSelections from "../../../../../reuse/client/src/components/facets/facetSelections";
import StandardGridFacetsMenu from "./StandardGridFacetsMenu";
import _ from "lodash";
import constants from "../../../app/constants";

import "./StandardGridToolBar.scss";

/**
 * The toolbar for Standard Grid
 */
class StandardGridToolBar extends Component {

    handleFacetSelect = (facet, value) => {
        let newSelections = _.isEmpty(this.props.facetSelections) ? new FacetSelections() : this.props.facetSelections.copy();
        newSelections.toggleSelectFacetValue(facet, value);
        this.props.setFacetSelection(newSelections);
    };

    handleFacetClearFieldSelects = (facet) => {
        let newSelections = _.isEmpty(this.props.facetSelections) ? new FacetSelections() : this.props.facetSelections.copy();
        newSelections.removeAllFieldSelections(facet.id);
        this.props.setFacetSelection(newSelections);
    };

    render() {
        let hasFacets = this.props.shouldFacet;
        let hasNavigation = (this.props.totalFilteredItems || this.props.totalItems) > this.props.itemsPerPage;
        return (
            <div>
                <div className={"standardGridToolBar " + (hasFacets ? "" : "noFacets")}>
                    <div className="standardLeftToolBar">
                        {this.props.shouldSearch &&
                        <GenericFilterSearchBox searchBoxKey={`${this.props.id}_searchBox`}
                                                placeholder={`Search ${this.props.itemTypePlural}`}
                                                onChange={this.props.onSearchChange}
                                                clearSearchTerm={this.props.clearSearchTerm}
                                                searchTerm={this.props.searchTerm}
                        />
                        }
                        {hasFacets &&
                            <div className="standardGridFacet">
                                <StandardGridFacetsMenu
                                    className="facetMenu"
                                    {...this.props}
                                    isLoading={false}
                                    facetFields={{facets: this.props.facetFields}}
                                    onFacetSelect={this.handleFacetSelect}
                                    onFacetClearFieldSelects={this.handleFacetClearFieldSelects}
                                    selectedValues={this.props.facetSelections.selectionsHash}
                                />
                            </div>
                        }
                    </div>
                    <div className="standardRightToolBar">
                        <div className="standardGridItemsCount">
                            <div className="itemsCount">
                                {this.props.totalItems !== 0 &&
                                    <StandardGridItemsCount totalItems={this.props.totalItems}
                                                            totalFilteredItems={this.props.totalFilteredItems}
                                                            itemTypePlural={this.props.itemTypePlural}
                                                            itemTypeSingular={this.props.itemTypeSingular}
                                    />
                                }
                            </div>
                        </div>
                        <div className="standardGridNavigation" >
                            {hasNavigation &&
                                <StandardGridNavigation className="standardGridNavigation"
                                                        getPreviousPage={this.props.getPreviousPage}
                                                        getNextPage={this.props.getNextPage}
                                                        id={this.props.id}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

StandardGridToolBar.defaultProps = {
    shouldFacet: true,
    shouldSearch: true
};

StandardGridToolBar.propTypes = {
    /**
     * ID of the Grid
     */
    id: PropTypes.string.isRequired,


    /**
     * The type of item we are displaying. For example "Users"/"User"
     */
    totalItems: PropTypes.number.isRequired,
    itemTypePlural: PropTypes.string,
    itemTypeSingular: PropTypes.string,

    /**
     * Call back that updates the toolbar
     */
    doUpdate: PropTypes.func.isRequired,

    /**
     * Whether to Facet in this grid or no
     */
    shouldFacet: PropTypes.bool,

    /**
     * Whether to Facet in this grid or no
     */
    doFacet: PropTypes.bool,

    /**
     * Navigation controls. What to do when a user presses next or previous
     */
    getPreviousPage: PropTypes.func.isRequired,
    getNextPage: PropTypes.func.isRequired,

    /**
     * Search Functionality Properties
     * Should we search, what is the current search term, callback for search
     */
    shouldSearch: PropTypes.bool,
    onSearchChange: PropTypes.func.isRequired,
    searchTerm: PropTypes.string,
    /**
     * Number of items to be displayed in a page in the grid
     */
    itemsPerPage: PropTypes.number
};

const mapStateToProps = (state, ownProps) => {
    let facetInfo = (state.Grids[ownProps.id] || {}).facets || {};
    let paginationInfo = (state.Grids[ownProps.id] || {}).pagination || {};
    return {
        facetSelections:  facetInfo.facetSelections || {},
        totalFilteredItems: paginationInfo.totalFilteredItems || 0,
        totalItems: paginationInfo.totalItems || 0,
        searchTerm: (state.Grids[ownProps.id] || {}).searchTerm || '',
    };
};


/**
 * Every one of these actions have the pattern of Setting the State and Informing an Update
 * All of them trigger through the same update pipeline in the doUpdate (which needs to be provided)
 * @param dispatch
 * @param ownProps
 * @returns {{getPreviousPage: (function()), getNextPage: (function()), onSearchChange: (function(*)), clearSearchTerm: (function()), setFacetSelection: (function(*=))}}
 */
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getPreviousPage: () => {
            // Go back means a negative offset
            dispatch(StandardGridActions.setCurrentPageOffset(ownProps.id, -1));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        },

        getNextPage: () => {
            dispatch(StandardGridActions.setCurrentPageOffset(ownProps.id, 1));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        },

        onSearchChange: (searchEvent) => {
            dispatch(StandardGridActions.setSearch(ownProps.id, searchEvent.target.value));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        },

        clearSearchTerm: () => {
            dispatch(StandardGridActions.clearSearchTerm(ownProps.id));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        },

        setFacetSelection: (newSelections) => {
            dispatch(StandardGridActions.setFacetSelections(ownProps.id, newSelections));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        }
    };
};

export {StandardGridToolBar};

export default connect(mapStateToProps, mapDispatchToProps)(StandardGridToolBar);
