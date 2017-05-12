import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import FilterUtils from '../../utils/filterUtils';
import * as query from '../../constants/query';
import ReportUtils from '../../utils/reportUtils';
import StringUtils from '../../utils/stringUtils';
import Header from '../header/smallHeader';
import {connect} from 'react-redux';
import {toggleLeftNav} from '../../actions/shellActions';
import {loadDynamicReport} from '../../actions/reportActions';
import {clearSearchInput, searchInput} from '../../actions/searchActions';
import {CONTEXT} from '../../actions/context';
import {PAGE} from '../../../../common/src/constants';

import './reportHeader.scss';

/**
 * A header that takes the place of the top nav when viewing a report
 * (visible on small breakpoint currently)
 */
export const ReportHeader = React.createClass({
    facetFields : {},
    // a key send delay (keep it very small otherwise noticable lag on keypress entry)
    debounceInputMillis: 100,

    propTypes: {
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        rptId: React.PropTypes.string,
        nameForRecords: React.PropTypes.string
    },

    componentWillMount() {
        // Create a debounced function that delays invoking filterReport func
        // until after debounceInputMillis milliseconds have elapsed since the
        // last time the debouncedFilterReport was invoked.
        this.debouncedFilterReport = _.debounce(this.filterReport, this.debounceInputMillis);
        this.mapFacetFields();
    },
    componentWillReceiveProps() {
        this.mapFacetFields();
    },

    searchTheString(searchTxt) {
        this.props.searchInput(searchTxt);
        this.debouncedFilterReport(searchTxt, this.getReport().selections);
    },

    clearSearchString() {
        this.props.clearSearchInput();
        this.debouncedFilterReport('', this.getReport().selections);
    },

    mapFacetFields() {
        this.facetFields = {};
        let reportData = this.getReportData();
        if (reportData.facets) {
            reportData.facets.map((facet) => {
                // a fields id ->facet lookup
                this.facetFields[facet.id] = facet;
            });
        }
    },

    filterReport(searchString, selections) {
        // leading and trailing spaces are trimmed..
        const trimmedSearch = StringUtils.trim(searchString);
        const filter = FilterUtils.getFilter(trimmedSearch, selections, this.facetFields);

        let reportData = this.getReportData();
        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = ReportUtils.getGListString(reportData.sortFids, reportData.groupEls);
        queryParams[query.OFFSET_PARAM] = PAGE.DEFAULT_OFFSET;
        queryParams[query.NUMROWS_PARAM] = PAGE.DEFAULT_NUM_ROWS;

        this.props.loadDynamicReport(CONTEXT.REPORT.NAV,
            reportData.appId,
            reportData.tblId,
            reportData.rptId,
            true,
            filter,
            queryParams
        );

    },

    handleSearchChange(e) {
        var searchTxt = e.target.value;
        this.searchTheString(searchTxt);
    },

    getReportData() {
        let report = this.getReport();
        return _.has(report, 'data') ? report.data : {};
    },
    getReport() {
        let report = _.find(this.props.report, function(rpt) {
            return rpt.id === CONTEXT.REPORT.NAV;
        });
        return report ? report : {};
    },

    render: function() {
        const headerClasses = "reportHeader";

        let reportIcon = <QBicon icon="report-menu-3"/>;
        if (this.props.selectedTable && this.props.selectedTable.tableIcon) {
            reportIcon = <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.selectedTable.tableIcon}/>;
        }

        let reportName = this.getReportData().name;
        if (!reportName && this.props.selectedTable) {
            reportName = this.props.selectedTable.name;
        }

        const title = <div className="title">{reportIcon}<span className="reportLabel">{reportName}</span></div>;
        let placeMsg = Locale.getMessage("report.searchPlaceHolder") + " " + Locale.getMessage("records.plural");

        return <Header
            headerClasses={headerClasses}
            title={title}
            enableSearch={true}
            onSearchChange={this.handleSearchChange}
            onClearSearch={this.clearSearchString}
            searchPlaceHolder={placeMsg}
            searchValue={_.get(this, 'props.search.searchInput') || ""}
        />;
    }
});

const mapStateToProps = (state) => {
    return {
        report: state.report,
        search: state.search
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        searchInput: (input) => {
            dispatch(searchInput(input));
        },
        clearSearchInput: () => {
            dispatch(clearSearchInput());
        },
        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) => {
            dispatch(loadDynamicReport(context, appId, tblId, rptId, format, filter, queryParams));
        },
        toggleLeftNav: () => {
            dispatch(toggleLeftNav());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportHeader);
