import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';

import './report.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import {Tooltip, OverlayTrigger, Button} from 'react-bootstrap';
import FilterSearchBox from '../facet/filterSearchBox';
import FacetsMenu from '../facet/facetsMenu';
import FacetSelections from '../facet/facetSelections';
import RecordsCount from './recordsCount';
import QBicon from '../qbIcon/qbIcon';
import PageActions from '../actions/pageActions';
import FilterUtils from '../../utils/filterUtils';

let FluxMixin = Fluxxor.FluxMixin(React);

let logger = new Logger();


const secondInMilliseconds = 1000;

/**
 * a ReportToolbar for table reports with search field and a filter icon
 * does the heavy lifting and maintaining of search and facets selections
 */

var ReportToolbar = React.createClass({
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
        onFacetSelect : React.PropTypes.func
    },


    getDefaultProps() {
        return {
            fillinDummyFacets : window.location.search.includes('dummy'),
            selections:new FacetSelections(),
            searchStringForFiltering: "",
            debounceInputTime :.5 *  secondInMilliseconds, // 1/5 a second delay
        };
    },

    getInitialState() {
        return {
            //seed the initial search value
            searchInput: this.props.searchStringForFiltering ? this.props.searchStringForFiltering : '',
        };
    },

    debouncedChange(name) {
        let deferred = Promise.defer();

        var timerId = this.timerId;
        var self = this;
        if (timerId) {
            clearTimeout(timerId);
        }

        function updateName(innerName) {
            return function() {
                deferred.resolve(innerName);
            };
        }

        timerId = setTimeout((updateName)(name), this.props.debounceInputTime);
        this.timerId = timerId;
        return deferred.promise;
    },

    isFiltered() {
        let answer = false;
        if (this.props.searchStringForFiltering.length !== 0) {
            answer = true;
        } else {
            answer = this.props.selections.hasAnySelections();
        }
        return answer;
    },

    filterReport(searchString, selections) {
        let flux = this.getFlux();

        const filter = FilterUtils.getFilter(searchString,
            selections,
            this.fields);

        flux.actions.filterReport(this.props.appId, this.props.tblId, this.props.rptId, true, filter);
    },

    filterOnSelections(newSelections) {
        this.filterReport(this.props.searchStringForFiltering, newSelections);
    },
    filterOnSearch(newSearch) {
        this.filterReport(newSearch, this.props.selections);
    },
    handleFacetSelect(e, facet, value) {
        var newSelections = this.props.selections.copy();
        newSelections.toggleSelectFacetValue(facet, value);
        this.filterOnSelections(newSelections);
    },

    handleFacetDeselect(e, facet, value) {
        var newSelections = this.props.selections.copy();
        newSelections.setFacetValueSelectState(facet, value, false);
        this.filterOnSelections(newSelections);
    },

    handleFacetClearFieldSelects(facet) {
        var newSelections = this.props.selections.copy();
        newSelections.removeAllFieldSelections(facet.id);
        this.filterOnSelections(newSelections);
    },

    handleFacetClearAllSelects() {
        var newSelections = new FacetSelections();
        this.filterOnSelections(newSelections);
    },

    handleFacetClearAllSelectsAndSearch() {
        var newSelections = new FacetSelections();
        this.setState({searchInput:''});
        this.filterReport('', newSelections);
    },

    executeSearchString(result) {
        this.filterOnSearch(result);
    },

    searchTheString(searchTxt, debounced) {
        if (debounced) {
            this.debouncedChange(searchTxt).then((result) => {
                this.executeSearchString(result);
            });
        }  else {
            this.executeSearchString(searchTxt);
        }
    },


    handleSearchChange(e) {
        var searchTxt = e.target.value;
        this.searchTheString(searchTxt, true);
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
            this.fields = {};
            this.props.reportData.data.facets.map((facet) => {
                // a fields id ->facet lookup
                this.fields[facet.id] = facet;
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
            {id : 101, name : "Types", type: "TEXT", dummyData: true, blanks: true,
                values : [{value:"Design"}, {value:"Development"}, {value:"Planning"}, {value:"Test"}]},
            {id : 102, name : "Names", type: "TEXT", dummyData: true, blanks: false,
                values : [
                {value: "Aditi Goel"}, {value: "Christopher Deery"}, {value: "Claire Martinez"}, {value: "Claude Keswani"}, {value: "Deborah Pontes"},
                {value: "Donald Hatch"}, {value: "Drew Stevens"}, {value: "Erica Rodrigues"}, {value: "Kana Eiref"},
                {value: "Ken LaBak"}, {value: "Lakshmi Kamineni"}, {value: "Lisa Davidson"}, {value: "Marc Labbe"},
                {value: "Matthew Saforrian"}, {value: "Micah Zimring"}, {value: "Rick Beyer"}, {value: "Sam Jones"}, {value: "XJ He"}
                ]},
            {id : 103, name : "Status", type: "TEXT", dummyData: true, blanks: false,
                values : [{value: "No Started"}, {value: "In Progress"}, {value: "Blocked"}, {value: "Completed"}]},
            {id : 104, name : "Flag", type: "CHECKBOX", dummyData: true,  blanks: false,
                values : [{value: "No"}, {value: "Yes"}]},
            {id : 105, name : "Companies", type: "TEXT", dummyData: true,  blanks: false,
                    // TODO: support date ranges in filtering see https://jira.intuit.com/browse/QBSE-20422
                values : []}, // too many values for facets example
            //{id : 4, name : "Dates", type: "date",  blanks: false,
            //    range : {start: 1, end: 2}},
    ],

    dummyFacets: [
            {id : 101, name : "Types", type: "TEXT", dummyData: true, blanks: true,
                values : ["Design", "Development", "Planning", "Test"]},
            {id : 102, name : "Names", type: "TEXT", dummyData: true, blanks: false,
                values : [
                    "Aditi Goel",  "Christopher Deery",  "Claire Martinez",  "Claude Keswani",  "Deborah Pontes",
                    "Donald Hatch",  "Drew Stevens",  "Erica Rodrigues",  "Kana Eiref",
                    "Ken LaBak",  "Lakshmi Kamineni",  "Lisa Davidson",  "Marc Labbe",
                    "Matthew Saforrian",  "Micah Zimring",  "Rick Beyer",  "Sam Jones",  "XJ He"
                ]},
            {id : 103, name : "Status", type: "TEXT", dummyData: true, blanks: false,
                values : ["No Started",  "In Progress",  "Blocked",  "Completed"]},
            {id : 104, name : "Companies", type: "TEXT", dummyData: true, blanks: false,
                // TODO: support date ranges in filtering see https://jira.intuit.com/browse/QBSE-20422
                values : []}, // too many values for facets example
            {id : 105, name : "Flag", type: "CHECKBOX", dummyData: true, blanks: false,
             values : ["No",  "Yes"]},
            //{id : 106, name : "Dates", type: "date",  blanks: false,
            //    range : {start: 1, end: 2}},
    ],


    populateDummyFacets() {
        if (this.props.reportData && this.props.reportData.data && !this.props.reportData.data.facets.appendedDummyData)  {
            this.props.reportData.data.facets = [...this.props.reportData.data.facets, ...this.dummyFacets];
            this.props.reportData.data.facets.appendedDummyData = true;
        }
    },
    getPageActions() {
        const actions = [
            {name: 'i.e. edit', icon:'edit'},
            {name: 'i.e. mail', icon:'mail'},
            {name: 'i.e. delete', icon:'delete'},
            {name: 'i.e. print', icon:'print'}
        ];
        return (<PageActions actions={actions} menuAfter={0} {...this.props}/>);
    },

    render() {
        if (this.props.fillinDummyFacets) {
            this.populateDummyFacets();
        }

        this.appendBlanks();

        let recordCount = this.props.reportData && this.props.reportData.data && this.props.reportData.data.records ?
                                this.props.reportData.data.records.length : null;

        let filteredRecordCount  = this.props.reportData && this.props.reportData.data &&
        this.props.reportData.data.filteredRecords ?
            this.props.reportData.data.filteredRecords.length : null;

        // determine if there is a search/filter in effect and if there are records/results to show
        let hasRecords = true;
        if (this.isFiltered()) {
            hasRecords = filteredRecordCount ? true : false;
        } else {
            hasRecords = recordCount ? true : false;
        }

        let hasFacets = this.props.reportData && this.props.reportData.data &&
            this.props.reportData.data.facets && (this.props.reportData.data.facets.length > 0) &&
            this.props.reportData.data.facets[0].values;

        let hasSelectedFacets = this.props.selections && this.props.selections.hasAnySelections();

        let reportToolbar = (
            <div className={"reportToolbar " + (hasFacets ? "" : "noFacets")}>
                <RecordsCount recordCount={recordCount}
                              isFiltered={this.isFiltered() && !this.props.loading}
                              filteredRecordCount={filteredRecordCount}
                              nameForRecords="Records"
                    {...this.props} />

                {(this.isFiltered() || this.state.searchInput.length !== 0) &&
                (<span onClick={this.handleFacetClearAllSelectsAndSearch}>
                                        <QBicon className="clearAllFacets" icon="clear-mini"/>
                    </span>)
                }

                {/* Search and grouping icon will go in the toolbar here per discussion with xd-ers */
                }


                {/*TODO : check if searchbox is enabled for this report,
                 if has facets has search too, eg no facets without searchbox */}
                {recordCount &&
                <FilterSearchBox onChange={this.handleSearchChange}
                                 nameForRecords="Records"
                                 ref="searchInputbox"
                                 value={this.props.searchStringForFiltering}
                    {...this.props} />
                }

                {/* check if facets is enabled for this report,
                 also hide Facets Menu Button if facets disabled  */}
                {(recordCount && hasFacets) &&
                (<FacetsMenu className="facetMenu"
                    {...this.props}
                             selectedValues={this.props.selections}
                             onFacetSelect={this.handleFacetSelect}
                             onFacetDeselect={this.handleFacetDeselect}
                             onFacetClearFieldSelects={this.handleFacetClearFieldSelects}
                />)
                }

                {hasFacets && <div id="facetsMenuTarget"></div>}
                {this.getPageActions()}
            </div>
        );

        return (<div> {reportToolbar} </div>);
    }
});

export default ReportToolbar;

