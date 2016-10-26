import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import Fluxxor from 'fluxxor';
import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import FilterUtils from '../../utils/filterUtils';
import * as query from '../../constants/query';
import ReportUtils from '../../utils/reportUtils';
import Header from '../header/smallHeader';
import './reportHeader.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

/**
 * A header that takes the place of the top nav when viewing a report
 * (visible on small breakpoint currently)
 */
var ReportHeader = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('ReportDataSearchStore')],
    facetFields : {},

    propTypes: {
        reportData: React.PropTypes.object,
        nameForRecords: React.PropTypes.string,
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
        this.getFlux().actions.getFilteredRecords(this.props.selectedAppId,
            this.props.routeParams.tblId,
            typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.routeParams.rptId, {format:true, numRows:this.props.reportData.numRows, offset: this.props.reportData.pageOffset}, filter, queryParams);
    },
    handleSearchChange(e) {
        if (this.searchTheString) {
            var searchTxt = e.target.value;
            this.searchTheString(searchTxt);
        }
    },
    getStateFromFlux() {
        let flux = this.getFlux();
        return flux.store('ReportDataSearchStore').getState();
    },

    render: function() {
        const headerClasses = "reportHeader";

        const reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;
        const title = <div><QBicon icon="report-menu-3"/><span className="reportLabel">{reportName}</span></div>;
        let placeMsg = Locale.getMessage("report.searchPlaceHolder") + " " + Locale.getMessage("records.plural");

        return <Header
            headerClasses={headerClasses}
            title={title}
            enableSearch={true}
            onSearchChange={this.handleSearchChange}
            onClearSearch={this.clearSearchString}
            searchPlaceHolder={placeMsg}
            searchValue={this.state.searchStringInput}
        />;
    }
});

export default ReportHeader;
