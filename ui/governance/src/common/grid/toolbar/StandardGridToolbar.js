import React, {PropTypes, Component} from "react";
import StandardGridNavigation from "./StandardGridNavigation";
import * as StandardGridActions from "../../../common/grid/standardGridActions";
import IconInputBox from "../../../../../reuse/client/src/components/iconInputBox/iconInputBox";
import {I18nMessage} from '../../../../../reuse/client/src/utils/i18nMessage';
import {connect} from "react-redux";
import "./StandardGridToolBar.scss";
import FacetSelections from "../../../../../reuse/client/src/components/facets/facetSelections";
import StandardGridFacetsMenu from "./StandardGridFacetsMenu";
import _ from "lodash";
import * as SCHEMACONSTS from "../../../../../client-react/src/constants/schema";

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
        // temporary until the RecordCount is set
        let recordCountMessage = (this.props.filteredRecords === 1) ? this.props.itemTypeSingular : this.props.itemTypePlural;
        return (
            <div>
                <div className={"standardGridToolBar " + (hasFacets ? "" : "noFacets")}>
                    <div className="standardLeftToolBar">
                        <IconInputBox placeholder={`Search ${this.props.itemTypePlural}`}
                                      onChange={this.props.onSearchChange}/>
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
                        {/* Temporary RecordCount until the real component is set*/}
                        <div className="standardGridRecordCount">
                            <div className="recordsCount">
                                {this.props.filteredRecords === this.props.totalRecords ?
                                    `${this.props.totalRecords} ${recordCountMessage}` :
                                    `${this.props.filteredRecords} of ${this.props.totalRecords} ${recordCountMessage}`}
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
    itemTypePlural: PropTypes.string,
    itemTypeSingular: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
    let facetInfo = (state.Grids[ownProps.id] || {}).facets || {};
    let paginationInfo = (state.Grids[ownProps.id] || {}).pagination || {};
    return {
        facetSelections:  facetInfo.facetSelections || {},
        filteredRecords: paginationInfo.filteredRecords || 0,
        totalRecords: paginationInfo.totalRecords || 0,
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

        setFacetSelection: (newSelections) => {
            dispatch(StandardGridActions.setFacetSelections(ownProps.id, newSelections));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        }
    };
};

export {StandardGridToolBar};

export default connect(mapStateToProps, mapDispatchToProps)(StandardGridToolBar);
