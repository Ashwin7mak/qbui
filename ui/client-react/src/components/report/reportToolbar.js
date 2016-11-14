import React from 'react';
import Fluxxor from 'fluxxor';

import './report.scss';

import {I18nMessage} from '../../../src/utils/i18nMessage';
import FilterSearchBox from '../facet/filterSearchBox';
import FacetsMenu from '../facet/facetsMenu';
import FacetSelections from '../facet/facetSelections';
import RecordsCount from './recordsCount';
import ReportNavigation from './reportNavigation';
import SortAndGroup from '../sortGroup/sortAndGroup';
import mockFacets from '../../mocks/facets';
import Breakpoints from "../../utils/breakpoints";
import _ from 'lodash';

let FluxMixin = Fluxxor.FluxMixin(React);


/**
 * a ReportToolbar for table reports with search field and a filter icon
 * does the heavy lifting and maintaining of search and facets selections
 */

const ReportToolbar = React.createClass({
    //interaction options

    mixins: [FluxMixin],

    propTypes: {
        /**
         *  Takes in for properties the reportData which includes the list of facets
         *  and a function to call when a facet value is selected.
         **/
        reportData: React.PropTypes.shape({
            data: React.PropTypes.shape({
                facets:  React.PropTypes.array
            })
        }),
        searchStringForFiltering: React.PropTypes.string,
        selections: React.PropTypes.object,
        nameForRecords:React.PropTypes.string,
        pageActions: React.PropTypes.element,
        onFacetSelect: React.PropTypes.func,
        filterOnSelections: React.PropTypes.func,
        searchTheString: React.PropTypes.func,
        pageStart: React.PropTypes.number,
        pageEnd: React.PropTypes.number,
        recordsCount: React.PropTypes.number,
        width: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            fillinMockFacets : _.includes(window.location.search, 'mockFilter'),
            selections:new FacetSelections(),
            searchStringForFiltering: ""
        };
    },

    isFiltered() {
        let answer = false;
        if (this.props.searchStringForFiltering && this.props.searchStringForFiltering.length !== 0) {
            answer = true;
        } else {
            answer = this.props.selections ? this.props.selections.hasAnySelections() : false;
        }
        return answer;
    },

    handleFacetSelect(e, facet, value) {
        if (this.props.filterOnSelections) {
            let newSelections = this.props.selections.copy();
            newSelections.toggleSelectFacetValue(facet, value);
            this.props.filterOnSelections(newSelections);
        }
    },

    handleFacetDeselect(e, facet, value) {
        if (this.props.filterOnSelections) {
            let newSelections = this.props.selections.copy();
            newSelections.setFacetValueSelectState(facet, value, false);
            this.props.filterOnSelections(newSelections);
        }
    },

    handleFacetClearFieldSelects(facet) {
        if (this.props.filterOnSelections) {
            let newSelections = this.props.selections.copy();
            newSelections.removeAllFieldSelections(facet.id);
            this.props.filterOnSelections(newSelections);
        }
    },

    handleFacetClearAllSelects() {
        if (this.props.filterOnSelections) {
            let newSelections = new FacetSelections();
            this.props.filterOnSelections(newSelections);
        }
    },

    handleSearchChange(e) {
        if (this.props.searchTheString && e && e.target) {
            let searchTxt = e.target.value;
            this.props.searchTheString(searchTxt);
        }
    },

    /**
     * Support filtering of blank values; add a (blank) entry to the end of the list of values
     * if the facet has blanks.
     * Note the I18nMessage version we are using only supports outputting a span wrapped component not just
     * a translated string so until we move to reactintl 2.0
     * see - http://stackoverflow.com/questions/35286239/how-to-put-valuedata-into-html-attribute-with-reactjs-and-reactintl
     * user the english string, the resource and 'report.blank'message is has been added to the bundle
     */
    appendBlanks() {
        let blankMsg = 'report.blank';
        if (this.props.reportData && this.props.reportData.data &&
            this.props.reportData.data.facets) {
            this.props.reportData.data.facets.map((facet) => {
                // a fields id ->facet lookup
                if (facet.blanks && facet.type === "text" && !facet.blankAdded) {
                    // Note the I18nMessage version we are using only supports outputting a span wrapped component not just
                    // a translated string so until we move to reactintl 2.0
                    // see - http://stackoverflow.com/questions/35286239/how-to-put-valuedata-into-html-attribute-with-reactjs-and-reactintl
                    // user the english string, the resource and 'report.blank'message is has been added to the bundle
                    //facet.values.push(<I18nMessage message={(blankMsg)}/>);
                    facet.values.push({value:'(blank)'});
                    facet.blankAdded = true;
                }
            });
        }
    },


    populateDummyFacets() {
        if (this.props.reportData && this.props.reportData.data && this.props.reportData.data.facets && !this.props.reportData.data.facets.appendedMockFilter)  {
            this.props.reportData.data.facets = [...this.props.reportData.data.facets, ...mockFacets];
            this.props.reportData.data.facets.appendedMockFilter = true;
        }
    },

    render() {
        let isSmall = Breakpoints.isSmallBreakpoint();

        if (this.props.fillinMockFacets) {
            this.populateDummyFacets();
        }

        this.appendBlanks();

        let isLoading = false;
        let isCountingRecords = false;
        let isError = false;

        let filteredRecordCount = null;
        // This is the count of all records that apply to this report
        let recordCount = 0;
        // This indicates a page load
        let isPageLoaded = false;

        let hasFacets = false;

        if (this.props.reportData) {
            if (this.props.reportData.loading) {
                isLoading = this.props.reportData.loading;
            }
            if (this.props.reportData.countingTotalRecords) {
                isCountingRecords = this.props.reportData.countingTotalRecords;
            }
            if (this.props.reportData.error) {
                isError = true;
            }
            if (this.props.reportData.data) {
                if (this.props.reportData.data.filteredRecords) {
                    filteredRecordCount =  this.props.reportData.data.filteredRecordsCount;
                }
                if (!isCountingRecords && this.props.reportData.data.recordsCount) {
                    recordCount = this.props.reportData.data.recordsCount;
                }
                if (this.props.reportData.data.records) {
                    isPageLoaded = true;
                }
                if (this.props.reportData.data.facets &&
                    (this.props.reportData.data.facets.length > 0)) {
                    hasFacets =  this.props.reportData.data.facets[0].values;
                }
            }
        }
        // Conditional marking display of filter box. Show when records have been loaded. This box does not depend on the record counting call
        let showFilterSearchBox = !isLoading && isPageLoaded && !isError;
console.log(this.props.width);
        let reportToolbar = (
            <div className={"reportToolbar " + (hasFacets ? "" : "noFacets")}>
                <div className="leftReportToolbar">
                    {/* Search and grouping icon will go in the toolbar here per discussion with xd-ers */}

                    {/*TODO : check if searchBox is enabled for this report,
                     if has facets has search too, eg no facets without searchBox */}
                    {showFilterSearchBox ?
                        <FilterSearchBox onChange={this.handleSearchChange}
                                         nameForRecords={this.props.nameForRecords}
                                         searchBoxKey="reportToolBar"
                                         {...this.props} /> :
                        null
                    }
                    {!isLoading && !isError ?
                        <SortAndGroup  {...this.props}
                                       filter={{selections: this.props.selections,
                                           facet: this.props.reportData.facetExpression,
                                           search: this.props.searchStringForFiltering}}/> :
                        null
                    }
                    {/* check if facets is enabled for this report,
                     also hide Facets Menu Button if facets disabled  */}
                    {!isLoading && hasFacets && !isError ?
                        (<FacetsMenu className="facetMenu"
                                     {...this.props}
                                     isLoading={isLoading}
                                     selectedValues={this.props.selections}
                                     onFacetSelect={this.handleFacetSelect}
                                     onFacetDeselect={this.handleFacetDeselect}
                                     onFacetClearFieldSelects={this.handleFacetClearFieldSelects}
                        />) :
                        null
                    }
                </div>
                <div className="rightReportToolbar">
                    {!isLoading && !isError ?
                        <RecordsCount recordCount={recordCount}
                                      isFiltered={this.isFiltered() && (!_.isUndefined(this.props.reportData))}
                                      filteredRecordCount={filteredRecordCount}
                                      clearAllFilters={this.props.clearAllFilters}
                                      isCounting={this.props.reportData.countingTotalRecords}
                        /> :
                        null
                    }
                    <ReportNavigation reportData={this.props.reportData}
                                       pageStart={this.props.pageStart}
                                       pageEnd={this.props.pageEnd}
                                       getNextReportPage={this.props.getNextReportPage}
                                       getPreviousReportPage={this.props.getPreviousReportPage}
                                       recordsCount={this.props.recordsCount}
                    />
                </div>
                {this.props.pageActions}

            </div>
        );

        return (<div className="reportToolbarContainer"  style={{maxWidth: this.props.width}}> {reportToolbar} </div>);
    }
});

export default ReportToolbar;
