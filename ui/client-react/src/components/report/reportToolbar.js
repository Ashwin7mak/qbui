import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';

import './report.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import FilterSearchBox from './filter/filterSearchBox';
import FacetsMenuButton from './filter/facetsMenuButton';
import FacetsMenu from './filter/facetsMenu';
import RecordsCount from './RecordsCount';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

//interaction options
let secondInMilliseconds = 1000;
let debounceInputTime = .5 * secondInMilliseconds ; // 1/5 a second delay
let facetVisValues = 50; // how many facets to list before showing more...link

var ReportToolbar = React.createClass({
    mixins: [FluxMixin],

    getDefaultProps : function() {
        // Facets  = array 1 per facet fid
        // each entry in array has :
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
            facetsMenuShowing : false,
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

    searchReport: function(ev) {
        const text = ev.target.value;
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

    handleFacetSelect : function(facet, value, enable) {
        //if enable == true (when selecting the value in the facet)
            //if there is not an facet entry in the selecetfacets hash add it. then add the value
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

    handleChange: function(searchTxt) {
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

    handleFacetsMenuButtonClick : function() {
        var self = this;
        this.setState({
            facetsMenuShowing: !this.state.facetsMenuShowing
        });

    },

    componentDidMount() {
    },

    render() {
        return (<div>
                    <div className="reportToolbar">
                        {/*TODO : check if searchbox is enabled for this report, maybe disabled if facets are */}
                        <FilterSearchBox onChange={this.handleChange}
                                         {...this.props} />
                        {/*TODO : check if facets is enabled for this report, hide is disabled */}
                        <FacetsMenuButton onClick={this.handleFacetsMenuButtonClick}
                                        {...this.props} >
                            <FacetsMenu showing={this.state.facetsMenuShowing}
                                        facets={this.props.reportData.data.facets}
                                        onSelect={this.handleFacetSelect}
                                        {...this.props}
                            />
                        </FacetsMenuButton>
                        <RecordsCount recordCount="100"
                                      isFiltered={this.isFiltered()}
                                      filteredRecordCount="0"
                                      nameForRecords="Records"
                                        {...this.props} />
                    </div>
        </div>);
    }
});

export default ReportToolbar;

