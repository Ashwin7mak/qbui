import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import Fluxxor from 'fluxxor';
import FilterSearchBox from '../facet/filterSearchBox';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import FilterUtils from '../../utils/filterUtils';
import * as query from '../../constants/query';
import ReportUtils from '../../utils/reportUtils';
import './reportHeader.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * A header that takes the place of the top nav when viewing a report
 * (visible on small breakpoint currently)
 */
var ReportHeader = React.createClass({
    mixins: [FluxMixin],
    facetFields : {},

    propTypes: {
        reportData: React.PropTypes.object,
        nameForRecords: React.PropTypes.string,
    },
    getInitialState() {
        return {
            searching: false,
        };
    },
    // no top nav present so the hamburger exists here
    onNavClick() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },
    searchTheString(searchTxt) {
        this.getFlux().actions.filterSearchPending(searchTxt);
        this.filterReport(searchTxt, this.props.reportData.selections);
    },
    clearSearchString() {
        this.getFlux().actions.filterSearchPending('');
        this.filterReport('', this.props.reportData.selections);
    },
    filterReport(searchString, selections) {
        const filter = FilterUtils.getFilter(searchString, selections, this.facetFields);

        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = ReportUtils.getGListString(this.props.reportData.data.sortFids, this.props.reportData.data.groupEls);
        queryParams[query.GLIST_PARAM] = ReportUtils.getGListString(this.props.reportData.data.sortFids, this.props.reportData.data.groupEls);
        this.getFlux().actions.getFilteredRecords(this.props.selectedAppId,
            this.props.routeParams.tblId,
            typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.routeParams.rptId, {format:true}, filter, queryParams);
    },
    handleSearchChange(e) {
        if (this.searchTheString) {
            var searchTxt = e.target.value;
            this.searchTheString(searchTxt);
        }
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
                                 nameForRecords={this.props.nameForRecords}
                                 searchBoxKey="reportHeader"
                                 clearSearchString={this.clearSearchString}
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
