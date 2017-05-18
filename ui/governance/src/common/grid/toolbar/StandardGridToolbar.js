import React, {PropTypes, Component} from "react";
import StandardGridNavigation from "./StandardGridNavigation";
import StandardGridItemsCount from "./StandardGridItemsCount";
import * as StandardGridActions from "../../../common/grid/standardGridActions";
import IconInputBox from "../../../../../reuse/client/src/components/iconInputBox/iconInputBox";
import {I18nMessage} from "../../../../../reuse/client/src/utils/i18nMessage";
import {connect} from "react-redux";
import "./StandardGridToolBar.scss";
import FacetSelections from "../../../../../reuse/client/src/components/facets/facetSelections";
import StandardGridFacetsMenu from "./StandardGridFacetsMenu";
import _ from "lodash";

/**
 * The toolbar for Standard Grid
 */
class StandardGridToolBar extends React.Component {

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
        let hasFacets = false;
        return (
            <div>
                <div className={"standardGridToolBar " + (hasFacets ? "" : "noFacets")}>
                    <div className="standardLeftToolBar">
                        <IconInputBox placeholder={`Search ${this.props.itemTypePlural}`}
                                      onChange={this.props.onSearchChange}
                                      onClear={this.props.clearSearchTerm}
                                      value={this.props.searchTerm}
                        />
                        {this.props.doFacet ?
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
                            </div> : null
                        }
                    </div>
                    <div className="standardRightToolBar">
                        <div className="standardGridItemsCount">
                            <div className="itemsCount">
                                    <StandardGridItemsCount itemCount={this.props.totalRecords}
                                                            filteredItemCount={this.props.filteredRecords}
                                                            itemTypePlural={this.props.itemTypePlural}
                                                            itemTypeSingular={this.props.itemTypeSingular}
                                    />
                            </div>
                        </div>
                        <StandardGridNavigation className="standardGridNavigation"
                                                getPreviousPage={this.props.getPreviousPage}
                                                getNextPage={this.props.getNextPage}
                                                id={this.props.id}/>
                    </div>
                </div>
            </div>

        );
    }
}

StandardGridToolBar.defaultProps = {
    doFacet: true,
};

StandardGridToolBar.propTypes = {
    id: PropTypes.string.isRequired,
    doFacet: PropTypes.bool,
    getPreviousPage: PropTypes.func.isRequired,
    getNextPage: PropTypes.func.isRequired,
    doUpdate: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    totalRecords: PropTypes.number.isRequired,
    itemTypePlural: PropTypes.string,
    itemTypeSingular: PropTypes.string,
    searchTerm: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
    let facetInfo = (state.Grids[ownProps.id] || {}).facets || {};
    let paginationInfo = (state.Grids[ownProps.id] || {}).pagination || {};
    return {
        facetSelections:  facetInfo.facetSelections || {},
        filteredRecords: paginationInfo.filteredRecords || 0,
        totalRecords: paginationInfo.totalRecords || 0,
        searchTerm: (state.Grids[ownProps.id] || {}).searchTerm || '',
    };
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getPreviousPage: () => {
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
