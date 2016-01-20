import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';

import './report.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import {Tooltip, OverlayTrigger, Button} from 'react-bootstrap';
import FilterSearchBox from '../facet/filterSearchBox';
import FacetsMenuButton from '../facet/facetsMenuButton';
import RecordsCount from './RecordsCount';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

//interaction options
let secondInMilliseconds = 1000;
let debounceInputTime = .5 * secondInMilliseconds ; // 1/5 a second delay
let facetVisValues = 50; // how many facets to list before showing more...link

/**
 * a ReportToolbar for table reports with search field and a filter icon
 * does the heavy lifting and maintaining of search and facets selections
 */

var ReportToolbar = React.createClass({
    mixins: [FluxMixin],

    getDefaultProps : function() {
        // Facets  = array 1 per facet fid
        // in current stack each entry in array has :
        //      array of aspects(values)
        //      type of data (text, bool, or daterange), also field type
        //      has empty bool (if true include empty as a choice)
        //      fid number
        //      field name
        //      toomany to facet? bool
        //      reason = messageid for why no facets (too many values, other reasons?)

    },
    getInitialState: function() {
        return {
            searchInput: '',
            searchStringForFiltering: '',
            selectedFacets : {}
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

        timerId = setTimeout((updateName)(name), debounceInputTime);
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
        if (this.state.searchStringForFiltering.length !== 0){
            answer = true;
        } else {
            answer = Object.keys(this.state.selectedFacets).length !== 0 ;
        }
        return answer;
    },

    /* Placeholder method to hook into node layer call to get filtered records when user selects a facet
     * Hardcoded facetExpression for testing
     * TODO: replace with a real method.
     */
    filterReport: function(){
        var facetExpression = [{fid:'3', values:['10', '11']}, {fid:'4', values:['abc']}];

        let flux = this.getFlux();
        flux.actions.filterReport(this.props.appId, this.props.tblId, this.props.rptId, true, facetExpression);
    },

    handleFacetSelect : function(facet, value) {
        logger.debug("facet clicked field:" + facet.name + " value:" + value);
        //determine enable if not in selectedFacets yet, return true for select, false for deselect
        //TODO update selectedFacter:
        //if enable == true (when selecting the value in the facet)
            //if there is not an facet entry in the selecetFacets hash add it. then add the value
            //if (this.selectedFacets.z !== undefined ) {
                    // this.selectedFacets.z["9"]= [] or {} ?// add entry first selection
            //}
            // this.selectedFacets.z["9] = {"9":"9"} // push the selection to the list
            // }
        // else { //disable the selected value
            // find the item in the fids list of selected values
            // this.selectFacets.z // list of values
            // remove the item from the hash or array
            // if the array is empty delete the fid from those with values selected
                //}
        //
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


    populateDummyFacets() {
        if (this.props.reportData && this.props.reportData.data)  {
            this.props.reportData.data.facets = {
                list : [
                    {fid : 1, name : "Names", type: "text", blanks: false,
                        values : [{value: "Item 1"}, {value: "Item 2"}, {value: "Item 3"}, {value: "Item 4"}, {value: "Item 5"}]},
                    {fid : 2, name : "Types", type: "text", blanks: true,
                        values : [{value:"Design"}, {value:"Development"}, {value:"Planning"}, {value:"Test"}]},
                    {fid : 3, name : "Status", type: "text", blanks: false,
                        values : [{value: "No Started"}, {value: "In Progress"}, {value: "Blocked"}, {value: "Completed"}]},
                    {fid : 4, name : "Flag", type: "bool",  blanks: false,
                        values : [{value: "True"}, {value: "False"}]},
                    //{fid : 4, name : "Dates", type: "date",  blanks: false,
                    //    range : {start: 1, end: 2}},
                ],
            };
        }
    },

    /*TODO : remove this when facets ui is integrated with backend, only for dev testing not users */
    renderFakeFilterButton() {
        let tooltip = (
                        <Tooltip  id="FakeFacetTip">This button is hard wired filter by facets - only matches
                                Record#id = 10 OR 11
                        </Tooltip>);
        return (
                <OverlayTrigger id="FakeFacet" overlay={tooltip} placement="bottom">
                    <div className="button-container">
                        &nbsp;<Button className="testFilterButton"
                                    bsStyle="link" onClick={this.filterReport}>
                        Fake filter this report </Button>
                    </div>
                </OverlayTrigger>
        );
    },

    render() {
        this.populateDummyFacets();
        let fakeFilterButton = this.renderFakeFilterButton();
        return (
                <div className="reportToolbar">

                    {/*TODO : check if searchbox is enabled for this report,
                    if has facets has search too */}
                    <FilterSearchBox onChange={this.handleChange}
                                     {...this.props} />

                    {/*TODO :  - check if facets is enabled for this report,
                    hide Facets Menu Button if facets disabled  */}
                    <FacetsMenuButton id="facetMenuButton" {...this.props}
                                      onFacetSelect={this.handleFacetSelect} />

                    {/*TODO :  - get real records count from props */}
                    <RecordsCount recordCount="100"
                                  isFiltered={this.isFiltered()}
                                  filteredRecordCount="0"
                                  nameForRecords="Records"
                                    {...this.props} />

                    {fakeFilterButton}
                </div>
        );
    }
});

export default ReportToolbar;

