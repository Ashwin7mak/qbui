import React from 'react';
import QBicon from '../qbIcon/qbIcon';
//import Fluxxor from 'fluxxor';
import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import FilterUtils from '../../utils/filterUtils';
import * as query from '../../constants/query';
import ReportUtils from '../../utils/reportUtils';
import StringUtils from '../../utils/stringUtils';
import constants from '../../../../common/src/constants';
import Header from '../header/smallHeader';
import './reportHeader.scss';
import {connect} from 'react-redux';
import {toggleLeftNav} from '../../actions/shellActions';
import {loadDynamicReport} from '../../actions/reportActions';
import {clearSearchInput, searchInput} from '../../actions/searchActions';
import {CONTEXT} from '../../actions/context';

//let FluxMixin = Fluxxor.FluxMixin(React);
//let StoreWatchMixin = Fluxxor.StoreWatchMixin;

/**
 * A header that takes the place of the top nav when viewing a report
 * (visible on small breakpoint currently)
 */
var ReportHeader = React.createClass({
    //mixins: [FluxMixin],
    facetFields : {},
    // a key send delay (keep it very small otherwise noticable lag on keypress entry)
    debounceInputMillis: 100,

    propTypes: {
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        rptId: React.PropTypes.string,
        reportData: React.PropTypes.object,
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


    // no top nav present so the hamburger exists here
    onNavClick() {
        this.props.toggleLeftNav();
    },

    searchTheString(searchTxt) {
        //this.getFlux().actions.filterSearchPending(searchTxt);
        this.props.searchInput(searchTxt);
        this.debouncedFilterReport(searchTxt, this.props.reportData.selections);
    },

    clearSearchString() {
        //this.getFlux().actions.filterSearchPending('');
        this.props.clearSearchInput();
        this.debouncedFilterReport('', this.props.reportData.selections);
    },

    mapFacetFields() {
        this.facetFields = {};
        if (this.props.reportData && this.props.reportData.data &&
            this.props.reportData.data.facets) {
            this.props.reportData.data.facets.map((facet) => {
                // a fields id ->facet lookup
                this.facetFields[facet.id] = facet;
            });
        }
    },

    filterReport(searchString, selections) {
        // leading and trailing spaces are trimmed..
        const trimmedSearch = StringUtils.trim(searchString);
        const filter = FilterUtils.getFilter(trimmedSearch, selections, this.facetFields);

        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = ReportUtils.getGListString(this.props.reportData.data.sortFids, this.props.reportData.data.groupEls);
        queryParams[query.OFFSET_PARAM] = constants.PAGE.DEFAULT_OFFSET;
        queryParams[query.NUMROWS_PARAM] = constants.PAGE.DEFAULT_NUM_ROWS;

        //this.getFlux().actions.loadDynamicReport(this.props.selectedAppId,
        //    this.props.routeParams.tblId,
        //    typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.routeParams.rptId,
        //    true, filter, queryParams);
        this.props.loadDynamicReport(CONTEXT.REPORT.NAV, this.props.selectedAppId,
            this.props.routeParams.tblId,
            typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.routeParams.rptId,
            true, filter, queryParams);

    },

    handleSearchChange(e) {
        if (this.searchTheString) {
            var searchTxt = e.target.value;
            this.searchTheString(searchTxt);
        }
    },

    render: function() {
        const headerClasses = "reportHeader";

        const reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;
        const title = <div className="title"><QBicon icon="report-menu-3"/><span className="reportLabel">{reportName}</span></div>;
        let placeMsg = Locale.getMessage("report.searchPlaceHolder") + " " + Locale.getMessage("records.plural");

        return <Header
            headerClasses={headerClasses}
            title={title}
            enableSearch={true}
            onSearchChange={this.handleSearchChange}
            onClearSearch={this.clearSearchString}
            searchPlaceHolder={placeMsg}
            searchValue={this.props.search.searchInput || ""}
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
