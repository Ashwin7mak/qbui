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

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();
import _ from 'lodash';

/**
 * a ReportToolbar for table reports with search field and a filter icon
 * does the heavy lifting and maintaining of search and facets selections
 */

var ReportToolbar = React.createClass({
    //interaction options
    secondInMilliseconds : 1000,
    debounceInputTime : 0, // 1/5 a second delay
    facetVisValues : 50,  // how many facets to list before showing more...link

    mixins: [FluxMixin],

    getDefaultProps : function() {
        return {
            initialSelections : new FacetSelections()
        };
    },

    getInitialState: function() {
        this.debounceInputTime = .5 * this.secondInMilliseconds; // 1/5 a second delay
        let initSel = this.props.initialSelections;
        initSel.initSelections();
        return {
            searchInput: '',
            searchStringForFiltering: '',
            selections : initSel
        };
    },

    debouncedChange: function(name) {
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

        timerId = setTimeout((updateName)(name), this.debounceInputTime);
        this.timerId = timerId;
        return deferred.promise;
    },

    searchReport: function(inputText) {
        const text = inputText;
        let flux = this.getFlux();
        flux.actions.searchFor(text);
    },

    isFiltered : function() {
        let answer = false;
        if (this.state.searchStringForFiltering.length !== 0) {
            answer = true;
        } else {
            answer = this.state.selections.hasAnySelections();
        }
        return answer;
    },

    /* Placeholder method to hook into node layer call to get filtered records when user selects a facet
     * Hardcoded facetExpression for testing
     * TODO: replace with a real method.
     */
    filterReport: function() {
        var facetExpression = [{fid:'3', values:['10', '11']}, {fid:'4', values:['abc']}];

        let flux = this.getFlux();
        flux.actions.filterReport(this.props.appId, this.props.tblId, this.props.rptId, true, facetExpression);
    },

    handleFacetSelect : function(e, facet, value) {
        this.state.selections.handleToggleSelect(e, facet, value);
        var mutated = new FacetSelections();
        mutated.initSelections(this.state.selections.getSelections());
        this.setState({selections: mutated});
    },

    handleFacetClearFieldSelects : function(facet) {
        this.state.selections.removeAllFieldSelections(facet.id);
        var mutated = new FacetSelections();
        mutated.initSelections(this.state.selections.getSelections());
        this.setState({selections: mutated});
    },

    handleFacetClearAllSelects : function() {
        this.state.selections.removeAllSelections();
        var mutated = new FacetSelections();
        this.setState({selections: mutated});
    },

    handleChange: function(e) {
        var searchTxt = e.target.value;
        var self = this;
        this.debouncedChange(searchTxt).then(function(result) {
            self.setState({
                searchStringForFiltering: searchTxt.trim()
            });
            self.searchReport(self.state.searchStringForFiltering);
        });
        this.setState({
            searchInput: searchTxt
        });

    },

    //Report Facets: {"facets":[{"id":"1","name":"Facet01","type":"text","values":["Facet01-Value01","Facet01-Value02"]},
    // {"id":"2","name":"Facet02","type":"text","values":["Facet02-Value01","Facet02-Value02"]},
    // {"id":"3","name":"Facet03","type":"numeric","values":[1000,1045.33,2099]}]}
    populateDummyFacets() {
        if (this.props.reportData && this.props.reportData.data)  {
            this.props.reportData.data.facets = {
                list : [
                    {id : 1, name : "Types", type: "text", blanks: true,
                        values : [{value:"Design"}, {value:"Development"}, {value:"Planning"}, {value:"Test"}]},
                    {id : 2, name : "Names", type: "text", blanks: false,
                        values : [
                            {value: "Aditi Goel"}, {value: "Christopher Deery"}, {value: "Claire Martinez"}, {value: "Claude Keswani"}, {value: "Deborah Pontes"},
                            {value: "Donald Hatch"}, {value: "Drew Stevens"}, {value: "Erica Rodrigues"}, {value: "Kana Eiref"},
                            {value: "Ken LaBak"}, {value: "Lakshmi Kamineni"}, {value: "Lisa Davidson"}, {value: "Marc Labbe"},
                            {value: "Matthew Saforrian"}, {value: "Micah Zimring"}, {value: "Rick Beyer"}, {value: "Sam Jones"}, {value: "XJ He"}
                        ]},
                    {id : 3, name : "Status", type: "text", blanks: false,
                        values : [{value: "No Started"}, {value: "In Progress"}, {value: "Blocked"}, {value: "Completed"}]},
                    {id : 4, name : "Flag", type: "bool",  blanks: false,
                        values : [{value: "True"}, {value: "False"}]},
                    //{id : 4, name : "Dates", type: "date",  blanks: false,
                    //    range : {start: 1, end: 2}},
                ],
            };
        }
    },

    /*TODO : remove this when facets ui is integrated with backend, only for dev testing not users */
    renderFakeFilterButton() {
        let tooltip = (
                        <Tooltip  id="fakeFacetTip">This button is hard wired filter by facets - only matches
                                Record#id = 10 OR 11
                        </Tooltip>);
        {/* hide this - devs can use document.getElementById('fakeFacet').style.display='block'; */}
        return (
                <OverlayTrigger overlay={tooltip} placement="bottom">
                    <div className="button-container">
                        <Button  id="fakeFacet" className="testFilterButton"
                                    bsStyle="link" onClick={this.filterReport}>
                        Fake filter this report </Button>
                    </div>
                </OverlayTrigger>
        );
    },

    render() {
        this.populateDummyFacets();
        let fakeFilterButton = this.renderFakeFilterButton();

        let recordCount = this.props.reportData && this.props.reportData.data && this.props.reportData.data.records ?
                                this.props.reportData.data.records.length : null; //TODO what to show for pagination?

        let filteredRecordCount  = this.props.reportData && this.props.reportData.data && this.props.reportData.data.filteredRecords ?
                                this.props.reportData.data.filteredRecords.length : null;

        // determine if there is a search/filter in effect and if there are records/results to show
        let hasRecords = true;
        if (this.isFiltered()) {
            hasRecords = filteredRecordCount ? true : false;
        } else {
            hasRecords = this.props.recordCount ? true : false;
        }

        let hasSelectedFacets = this.state.selections.hasAnySelections();

        return (
            <div className="reportToolbar">

                {/*TODO : check if searchbox is enabled for this report,
                if has facets has search too */}
                {recordCount &&
                    <FilterSearchBox onChange={this.handleChange}
                                     nameForRecords="Records"
                                     {...this.props} />
                }

                {/*TODO :  - check if facets is enabled for this report,
                also hide Facets Menu Button if facets disabled  */}
                {recordCount &&
                    (<FacetsMenu className="facetMenu"  {...this.props}
                                  selectedValues={this.state.selections}
                                  onFacetSelect={this.handleFacetSelect}
                                  onFacetClearFieldSelects={this.handleFacetClearFieldSelects}
                    />)
                }

                <RecordsCount recordCount={recordCount}
                              isFiltered={this.isFiltered()}
                              filteredRecordCount={filteredRecordCount}
                              nameForRecords="Records"
                                {...this.props} />


                {hasSelectedFacets &&
                    (<span onClick={this.handleFacetClearAllSelects}>
                                        <QBicon className="clearAllFacets" icon="clear-mini" />
                    </span>)
                }

                {fakeFilterButton}

            </div>
        );
    }
});

export default ReportToolbar;

