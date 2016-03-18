import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import Fluxxor from 'fluxxor';
import FilterSearchBox from '../facet/filterSearchBox';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import FilterUtils from '../../utils/filterUtils';
import './reportHeader.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * A header that takes the place of the top nav when viewing a report
 */
var ReportHeader = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        reportData: React.PropTypes.object
    },
    getInitialState() {
        return {
            searching: false,
            debounceInputMillis: 500
        };
    },
    // no top nav present so the hamburger exists here
    onNavClick() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    getFacetFields() {
        let fields = {};
        this.props.reportData.data.facets.map(facet => {
            // a fields id ->facet lookup
            fields[facet.id] = facet;
        });
        return fields;
    },

    searchTheString(searchString)  {
        const facetFields = this.getFacetFields();
        let flux = this.getFlux();

        const filter = FilterUtils.getFilter(searchString,
            this.props.reportData.selections,
            facetFields);

        flux.actions.filterReport(this.props.reportData.appId,
            this.props.reportData.tblId,
            this.props.reportData.rptId,
            true, filter);
    },

    handleSearchChange(e) {
        var searchTxt = e.target.value;

        this.searchTheString(searchTxt);
    },
    // show the search elements
    startSearching() {
        this.setState({searching: true});
    },
    // hide the search elements
    cancelSearch() {
        this.setState({searching: false});
    },

    render: function() {
        const headerClasses = "reportHeader" + (this.state.searching ? " searching" : "");

        const reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;

        return (<div className={headerClasses}>
            <div className="left">
                <a className="iconLink toggleNavButton" href="#" onClick={this.onNavClick}>
                    <QBicon icon="hamburger" />
                </a>
            </div>

            <div className="center title">
                <QBicon icon="report-menu-3"/><span className="reportLabel">{reportName}</span>
            </div>

            <div className="center searchElements">
                <FilterSearchBox onChange={this.handleSearchChange}
                                 nameForRecords="Records"
                                 ref="searchInputbox"
                                 value={this.props.reportData.searchStringForFiltering}
                                {...this.props} />
                <a className="textLink" href="#" onClick={this.cancelSearch}>
                    <I18nMessage message="cancel"/>
                </a>
            </div>

            <div className="right">
                <a className="iconLink" href="#" onClick={this.startSearching}>
                    <QBicon icon="search" />
                </a>
                <a className="iconLink" href="#">
                    <QBicon icon="star-full" />
                </a>
            </div>
        </div>);
    }
});

export default ReportHeader;
