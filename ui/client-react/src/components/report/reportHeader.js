import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import Fluxxor from 'fluxxor';
import FilterSearchBox from '../facet/filterSearchBox';
import _ from 'lodash';

import './reportHeader.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var ReportHeader = React.createClass({
    mixins: [FluxMixin],

    getInitialState() {
        return {
            //seed the initial search value
            searchInput: '',
            searching: false,
            debounceInputMillis: 500
        };
    },
    onNavClick() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },
    searchTheString(searchString)  {
        let flux = this.getFlux();
        /*
        flux.actions.filterReport(this.props.reportData.appId,
            this.props.reportData.tblId,
            this.props.reportData.rptId,
            true, searchString,
            this.props.reportData.selections);
            */
    },

    handleSearchChange(e) {
        var searchTxt = e.target.value;
        this.setState({
            searchInput: searchTxt
        });
        this.searchTheString(searchTxt);
    },
    startSearching() {
        this.setState({searching: true});
    },
    cancelSearch() {
        this.setState({searching: false, searchString: ''});
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
                                 value={this.state.searchInput}
                                {...this.props} />
                <a className="iconLink" href="#" onClick={this.cancelSearch}>
                    <QBicon icon="clear-mini"/>
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
