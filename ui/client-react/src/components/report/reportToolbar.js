import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';

import './report.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import FilterSearchBox from './filter/filterSearchBox';
import FilterListButton from './filter/filterListButton';
import FacetsList from './filter/facetsList';
import RecordsCount from './RecordsCount';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

let secondInMilliseconds = 1000;
let debounceInputTime = .5 * secondInMilliseconds ; // 1/5 a second delay

var ReportToolbar = React.createClass({
    mixins: [FluxMixin],

    getInitialState: function() {
        return {
            searchInput: '',
            searchOutput: '',
            facetListOpen : false,
            selectedFacets:[],
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

    handleChange: function(searchTxt) {
        var self = this;
        this.debouncedChange(searchTxt).then(function(result) {
            self.setState({
                searchOutput: searchTxt
            });
            self.searchReport(searchTxt);
        });
        this.setState({
            searchInput: searchTxt
        });
    },

    handleFilterClick : function() {
        var self = this;
        this.setState({
            facetListOpen: !this.state.facetListOpen
        });

    },

    componentDidMount() {
    },

    render() {
        return (<div>
                    <div className="reportToolbar">
                        <FilterSearchBox onChange={this.handleChange}/>
                        <FilterListButton onClick={this.handleFilterClick}>
                                <FacetsList open={this.state.facetListOpen}
                                            facets={this.props.facets}/>
                        </FilterListButton>
                        <RecordsCount numberRecords="100"
                                      nameforRecords="Records"/>
                    </div>
        </div>);
    }
});

export default ReportToolbar;

