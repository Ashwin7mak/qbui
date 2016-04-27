import React from 'react';
import Fluxxor from 'fluxxor';

import './report.scss';

import {I18nMessage} from '../../../src/utils/i18nMessage';
import FilterSearchBox from '../facet/filterSearchBox';
import FacetsMenu from '../facet/facetsMenu';
import FacetSelections from '../facet/facetSelections';
import RecordsCount from './recordsCount';
import SortAndGroup from '../sortGroup/sortAndGroup';
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
    },

    getDefaultProps() {
        return {
            fillinMockFacets : window.location.search.includes('mockFilter'),
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

    dummyFacetsWithValueObjects: [
            {id : 101, name : "Types", type: "TEXT", mockFilter: true, blanks: true,
                values : [{value:"Design"}, {value:"Development"}, {value:"Planning"}, {value:"Test"}]},
            {id : 102, name : "Names", type: "TEXT", mockFilter: true, blanks: false,
                values : [
                {value: "Aditi Goel"}, {value: "Christopher Deery"}, {value: "Claire Martinez"}, {value: "Claude Keswani"}, {value: "Deborah Pontes"},
                {value: "Donald Hatch"}, {value: "Drew Stevens"}, {value: "Erica Rodrigues"}, {value: "Kana Eiref"},
                {value: "Ken LaBak"}, {value: "Lakshmi Kamineni"}, {value: "Lisa Davidson"}, {value: "Marc Labbe"},
                {value: "Matthew Saforrian"}, {value: "Micah Zimring"}, {value: "Rick Beyer"}, {value: "Sam Jones"}, {value: "XJ He"}
                ]},
            {id : 103, name : "Status", type: "TEXT", mockFilter: true, blanks: false,
                values : [{value: "No Started"}, {value: "In Progress"}, {value: "Blocked"}, {value: "Completed"}]},
            {id : 104, name : "Flag", type: "CHECKBOX", mockFilter: true,  blanks: false,
                values : [{value: "No"}, {value: "Yes"}]},
            {id : 105, name : "Companies", type: "TEXT", mockFilter: true,  blanks: false,
                    // TODO: support date ranges in filtering see https://jira.intuit.com/browse/QBSE-20422
                values : []}, // too many values for facets example
            //Date facets yet supported
            //{id : 4, name : "Dates", type: "date",  mockFilter: true, blanks: false,
                //    values[{range: {start: 1, end: 2}}],
    ],

    populateDummyFacets() {
        if (this.props.reportData && this.props.reportData.data && this.props.reportData.data.facets && !this.props.reportData.data.facets.appendedMockFilter)  {
            this.props.reportData.data.facets = [...this.props.reportData.data.facets, ...this.dummyFacetsWithValueObjects];
            this.props.reportData.data.facets.appendedMockFilter = true;
        }
    },

    render() {
        if (this.props.fillinMockFacets) {
            this.populateDummyFacets();
        }

        this.appendBlanks();
        let isLoading = false;
        let filteredRecordCount = null;
        let recordCount = null;
        let hasFacets = false;

        if (this.props.reportData) {
            if (this.props.reportData.loading) {
                isLoading = this.props.reportData.loading;
            }
            if (this.props.reportData.data) {
                if (this.props.reportData.data.filteredRecords) {
                    filteredRecordCount =  this.props.reportData.data.filteredRecordsCount;
                }
                if (this.props.reportData.data.records) {
                    recordCount =  this.props.reportData.data.recordsCount;
                }
                if (this.props.reportData.data.facets &&
                    (this.props.reportData.data.facets.length > 0)) {
                    hasFacets =  this.props.reportData.data.facets[0].values;
                }
            }
        }

        let reportToolbar = (
            <div className={"reportToolbar " + (hasFacets ? "" : "noFacets")}>

                    <div className="leftReportToolbar">

                        {/* Search and grouping icon will go in the toolbar here per discussion with xd-ers */}

                        {/*TODO : check if searchBox is enabled for this report,
                         if has facets has search too, eg no facets without searchBox */}
                        {recordCount &&
                            <FilterSearchBox onChange={this.handleSearchChange}
                                             nameForRecords={this.props.nameForRecords}
                                             searchBoxKey="reportToolBar"
                                {...this.props} />
                        }

                        {recordCount &&
                            <SortAndGroup  {...this.props} />
                        }

                        {/* check if facets is enabled for this report,
                         also hide Facets Menu Button if facets disabled  */}
                        {(recordCount && hasFacets) &&
                            (<FacetsMenu className="facetMenu"
                                {...this.props}
                                         isLoading={isLoading}
                                         selectedValues={this.props.selections}
                                         onFacetSelect={this.handleFacetSelect}
                                         onFacetDeselect={this.handleFacetDeselect}
                                         onFacetClearFieldSelects={this.handleFacetClearFieldSelects}
                            />)
                        }
                    </div>


                    {!isLoading &&
                        <RecordsCount recordCount={recordCount}
                              isFiltered={this.isFiltered() && this.props.reportData}
                              isLoading={isLoading}
                              filteredRecordCount={filteredRecordCount}
                              nameForRecords={this.props.nameForRecords}
                              clearAllFilters={this.props.clearAllFilters}
                        />
                    }

                {this.props.pageActions}

            </div>
        );

        return (<div className="reportToolbarContainer"> {reportToolbar} </div>);
    }
});

export default ReportToolbar;

