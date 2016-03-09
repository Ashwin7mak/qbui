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


    getDefaultProps : function() {
        return {
            fillinDummyFacets : false,
            selections:new FacetSelections(),
            searchStringForFiltering: "",
            debounceInputTime :.5 *  secondInMilliseconds, // 1/5 a second delay
        };
    },

    getInitialState: function() {
        return {
            //seed the initial search value
            searchInput: this.props.searchStringForFiltering ? this.props.searchStringForFiltering : '',
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

        timerId = setTimeout((updateName)(name), this.props.debounceInputTime);
        this.timerId = timerId;
        return deferred.promise;
    },

    isFiltered : function() {
        let answer = false;
        if (this.props.searchStringForFiltering.length !== 0) {
            answer = true;
        } else {
            answer = this.props.selections.hasAnySelections();
        }
        return answer;
    },

    filterReport: function(searchString, selections) {
        //var facetExpression = [{fid:'3', values:['10', '11']}, {fid:'4', values:['abc']}];
        let facetExpression = [];
        let selected = selections;
        let fields = selected.whichHasAnySelections();
        facetExpression = fields.map((field) => {
            let values = selected.getFieldSelections(field);
            // use 1 or 0 for searching bool field types not the text
            if (this.fields[field].type === 'CHECKBOX') {
                var boolVal = values[0] === "Yes" ? 1 : 0;
                values = [boolVal];
            }
            return {fid : field, values: values};
        });
        let filterParam = {
            selections: selections,
            facet : facetExpression,
            search : searchString
        };
        let flux = this.getFlux();
        flux.actions.filterReport(this.props.appId, this.props.tblId, this.props.rptId, true, filterParam);
    },

    filterOnSelections : function(newSelections) {
        this.filterReport(this.props.searchStringForFiltering, newSelections);
    },
    filterOnSearch : function(newSearch) {
        this.filterReport(newSearch, this.props.selections);
    },
    handleFacetSelect : function(e, facet, value) {
        var newSelections = this.props.selections.copy();
        newSelections.toggleSelectFacetValue(facet, value);
        this.filterOnSelections(newSelections);
    },

    handleFacetDeselect : function(e, facet, value) {
        var newSelections = this.props.selections.copy();
        newSelections.setFacetValueSelectState(facet, value, false);
        this.filterOnSelections(newSelections);
    },

    handleFacetClearFieldSelects : function(facet) {
        var newSelections = this.props.selections.copy();
        newSelections.removeAllFieldSelections(facet.id);
        this.filterOnSelections(newSelections);
    },

    handleFacetClearAllSelects : function() {
        var newSelections = new FacetSelections();
        this.filterOnSelections(newSelections);
    },

    handleFacetClearAllSelectsAndSearch : function() {
        var newSelections = new FacetSelections();
        this.setState({searchInput:''});
        this.filterReport('', newSelections);
    },

    executeSearchString : function(result) {
        this.filterOnSearch(result);
    },

    searchTheString : function(searchTxt, debounced) {
        if (debounced) {
            this.debouncedChange(searchTxt).then((result) => {
                this.executeSearchString(result.trim());
            });
        }  else {
            this.executeSearchString(searchTxt.trim());
        }
    },


    handleSearchChange: function(e) {
        var searchTxt = e.target.value.trim();
        this.setState({
            searchInput: searchTxt
        });
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

    populateDummyFacets() {
        if (this.props.reportData && this.props.reportData.data)  {
            this.props.reportData.data.facets = [
                {id : 1, name : "Types", type: "TEXT", blanks: true,
                    values : [{value:"Design"}, {value:"Development"}, {value:"Planning"}, {value:"Test"}]},
                {id : 2, name : "Names", type: "TEXT", blanks: false,
                    values : [
                        {value: "Aditi Goel"}, {value: "Christopher Deery"}, {value: "Claire Martinez"}, {value: "Claude Keswani"}, {value: "Deborah Pontes"},
                        {value: "Donald Hatch"}, {value: "Drew Stevens"}, {value: "Erica Rodrigues"}, {value: "Kana Eiref"},
                        {value: "Ken LaBak"}, {value: "Lakshmi Kamineni"}, {value: "Lisa Davidson"}, {value: "Marc Labbe"},
                        {value: "Matthew Saforrian"}, {value: "Micah Zimring"}, {value: "Rick Beyer"}, {value: "Sam Jones"}, {value: "XJ He"}
                    ]},
                {id : 3, name : "Status", type: "TEXT", blanks: false,
                    values : [{value: "No Started"}, {value: "In Progress"}, {value: "Blocked"}, {value: "Completed"}]},
                {id : 4, name : "Flag", type: "CHECKBOX",  blanks: false,
                    values : [{value: "Yes"}, {value: "No"}]},
                {id : 5, name : "Companies", type: "TEXT",  blanks: false,
                    values : []}, // too many values for facets example
                //{id : 4, name : "Dates", type: "date",  blanks: false,
                //    range : {start: 1, end: 2}},
            ];
        }
    },

    render() {
        if (this.props.fillinDummyFacets) {
            this.populateDummyFacets();
        }

        this.appendBlanks();

        let recordCount = this.props.reportData && this.props.reportData.data && this.props.reportData.data.records ?
                                this.props.reportData.data.records.length : null; //TODO what to show for pagination?

        let filteredRecordCount  = this.props.reportData && this.props.reportData.data && this.props.reportData.data.filteredRecords ?
                                this.props.reportData.data.filteredRecords.length : null;

        // determine if there is a search/filter in effect and if there are records/results to show
        let hasRecords = true;
        if (this.isFiltered()) {
            hasRecords = filteredRecordCount ? true : false;
        } else {
            hasRecords = recordCount ? true : false;
        }

        let hasSelectedFacets = this.props.selections && this.props.selections.hasAnySelections();

        let loadedReportToolbar = (
            <div className="reportToolbar">
                <RecordsCount recordCount={recordCount}
                              isFiltered={this.isFiltered()}
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
                                 value={this.state.searchInput}
                    {...this.props} />
                }

                {/*TODO :  - check if facets is enabled for this report,
                 also hide Facets Menu Button if facets disabled  */}
                {recordCount &&
                (<FacetsMenu className="facetMenu"
                             {...this.props}
                             selectedValues={this.props.selections}
                             onFacetSelect={this.handleFacetSelect}
                             onFacetDeselect={this.handleFacetDeselect}
                             onFacetClearFieldSelects={this.handleFacetClearFieldSelects}
                />)
                }

                {<div id="facetsMenuTarget"></div>}

            </div>
        );

        let notLoadedReportToolbar = <div>Loading...</div>;
        return (<div>{(this.props.reportData && this.props.reportData.loading) ? notLoadedReportToolbar : loadedReportToolbar } </div>);
    }
});

export default ReportToolbar;

