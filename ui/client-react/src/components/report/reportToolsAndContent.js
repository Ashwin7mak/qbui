import React from 'react';
import Logger from '../../utils/logger';
import ReportActions from '../actions/reportActions';
import ReportToolbar from './reportToolbar';
import ReportContent from './dataTable/reportContent';
import ReportFooter from './reportFooter';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import Fluxxor from 'fluxxor';
import simpleStringify from '../../../../common/src/simpleStringify';
import _ from 'lodash';
import FacetSelections from '../facet/facetSelections';
import unloadable from '../hoc/unloadable';
import './report.scss';
import FilterUtils from '../../utils/filterUtils';
import StringUtils from '../../utils/stringUtils';
import * as query from '../../constants/query';
import FieldUtils from '../../utils/fieldUtils';
import ReportUtils from '../../utils/reportUtils';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import * as Constants from "../../../../common/src/constants";
import ReportContentError from './dataTable/reportContentError';
import {connect} from 'react-redux';
import {searchInput, clearSearchInput} from '../../actions/searchActions';
import {tableFieldsReportDataObj} from '../../reducers/fields';
import {EDIT_RECORD_KEY, NEW_RECORD_VALUE} from '../../constants/urlConstants';

let logger = new Logger();

let FluxMixin = Fluxxor.FluxMixin(React);

let AddRecordButton = React.createClass({

    render() {
        return (
            <a href="#" className="addNewRecord" onClick={this.props.onClick}><QBicon icon="add-new-filled" /></a>
        );
    }
});

/**
 * The container for report and its toolbar
 *
 * Note: this component has been partially migrated to Redux
 */
export const UnconnectedReportToolsAndContent = React.createClass({
    mixins: [FluxMixin],
    //facetFields : {},
    debounceInputMillis: 700, // a key send delay
    // TODO: the tablePropertiesEndpoint on EE has the noun for records
    // get from table meta data
    nameForRecords: "Records",
    propTypes: {
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        rptId: React.PropTypes.string,
        reportData: React.PropTypes.object,
        appUsers: React.PropTypes.array,
        pageActions: React.PropTypes.element,
        callbacks :  React.PropTypes.object,
        selectedRows: React.PropTypes.array,
        pageStart: React.PropTypes.number,
        pageEnd: React.PropTypes.number,
        loadDynamicReport: React.PropTypes.func,

        // used for relationships phase-1
        phase1: React.PropTypes.bool
    },
    getDefaultProps() {
        return {
            selections:null
        };
    },
    getInitialState: function() {
        return {};
    },
    componentWillMount() {
        // Create a debounced function that delays invoking filterReport func
        // until after debounceInputMillis milliseconds have elapsed since the
        // last time the debouncedFilterReport was invoked.
        this.debouncedFilterReport = _.debounce(this.filterReport, this.debounceInputMillis);
        // note the facets by id
        //this.mapFacetFields();
    },
    componentWillReceiveProps() {
        ///this.mapFacetFields();
    },

    //when report changed from not loading to loading start measure of components performance
    startPerfTiming(nextProps) {
        if (_.has(this.props, 'reportData.loading') &&
            !this.props.reportData.loading &&
            nextProps.reportData.loading) {
            let flux = this.getFlux();
            flux.actions.mark('component-ReportToolsAndContent start');
        }
    },

    //when report changed from loading to loaded finish measure of components performance
    capturePerfTiming(prevProps) {
        let timingContextData = {numReportCols:0, numReportRows:0};
        let flux = this.getFlux();
        if (_.has(this.props, 'reportData.loading') &&
            !this.props.reportData.loading &&
            prevProps.reportData.loading) {
            flux.actions.measure('component-ReportToolsAndContent', 'component-ReportToolsAndContent start');
            // note the size of the report with the measure
            if (_.has(this.props, 'reportData.data.columns.length')) {
                let reportData = this.props.reportData.data;
                timingContextData.numReportCols = reportData.columns.length;
                timingContextData.numReportRows = reportData.filteredRecordsCount ?
                    reportData.filteredRecordsCount : reportData.recordsCount;
            }
            flux.actions.logMeasurements(timingContextData);
            flux.actions.doneRoute();
        }
    },

    componentWillUpdate(nextProps) {
        this.startPerfTiming(nextProps);
    },

    componentDidUpdate(prevProps) {
        this.capturePerfTiming(prevProps);
    },

    mapFacetFields() {
        //this.facetFields = {};
        let facetFields = {};
        if (this.props.reportData && this.props.reportData.data &&
            this.props.reportData.data.facets) {
            this.props.reportData.data.facets.map((facet) => {
                // a fields id ->facet lookup
                //this.facetFields[facet.id] = facet;
                facetFields[facet.id] = facet;
            });
        }
        return facetFields;
    },

    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add-new-filled', onClick: this.editNewRecord},
            {msg: 'pageActions.favorite', icon:'star', disabled: true},
            {msg: 'pageActions.print', icon:'print', disabled: true},
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },

    filterOnSearch(newSearch) {
        this.debouncedFilterReport(newSearch, this.props.reportData.selections);
    },

    filterReport(searchString, selections, alwaysRunReport) {
        // leading and trailing spaces are trimmed..
        const trimmedSearch = StringUtils.trim(searchString);

        //  only generate a report if search value differs from prior search value OR alwaysRunReport is set to true
        if (trimmedSearch !== this.props.searchStringForFiltering || alwaysRunReport === true) {
            logger.debug('Sending filter action with:' + trimmedSearch);

            let facetFields = this.mapFacetFields();
            const filter = FilterUtils.getFilter(StringUtils.trim(trimmedSearch), selections, facetFields);

            let queryParams = {};
            queryParams[query.SORT_LIST_PARAM] = ReportUtils.getGListString(this.props.reportData.data.sortFids, this.props.reportData.data.groupEls);

            // new search always resets to 1st page
            queryParams[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
            queryParams[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;

            this.props.loadDynamicReport(
                this.props.selectedAppId,
                this.props.routeParams.tblId,
                typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.routeParams.rptId,
                true, filter, queryParams);
        }
    },

    searchTheString(searchTxt) {
        this.props.searchInput(searchTxt);
        this.filterOnSearch(searchTxt);
    },

    filterOnSelections(newSelections) {
        this.debouncedFilterReport(this.props.searchStringForFiltering, newSelections, true);
    },

    clearSearchString() {
        this.props.clearSearchInput();
        // no debounce when clicking the clear button
        this.filterReport('', this.props.reportData.selections);
    },

    clearAllFilters() {
        // TODO clear out filter selection
        let noSelections = new FacetSelections();
        // TODO: don't think this filterSelectionsPending is necessray

        this.props.clearSearchInput();
        this.debouncedFilterReport('', noSelections, true);
    },

    getReportToolbar() {
        let {appId, tblId, rptId,
            reportData:{selections, ...otherReportData}} = this.props;

        return <ReportToolbar appId={this.props.reportData.appId}
                              tblId={this.props.reportData.tblId}
                              rptId={typeof this.props.reportData.rptId !== "undefined" ? this.props.reportData.rptId : this.props.params.rptId}
                              reportData={this.props.reportData}
                              selections={this.props.reportData.selections}
                              searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                              pageActions={this.getPageActions(0)}
                              nameForRecords={this.nameForRecords}
                              searchTheString={this.searchTheString}
                              filterOnSelections={this.filterOnSelections}
                              clearSearchString={this.clearSearchString}
                              clearAllFilters={this.clearAllFilters}
                              getNextReportPage={this.getNextReportPage}
                              getPreviousReportPage={this.getPreviousReportPage}
                              pageStart={this.pageStart}
                              pageEnd={this.pageEnd}
                              recordsCount={this.recordsCount}
                              width={this.state.gridWidth}

                              // used for relationships phase-1
                              phase1={this.props.phase1}
               />;
    },
    getSelectionActions() {
        return (<ReportActions selection={this.props.selectedRows} appId={this.props.params.appId} tblId={this.props.params.tblId} rptId={this.props.params.rptId} nameForRecords={this.props.nameForRecords}/>);
    },

    getTableActions() {
        const selectedRows = this.props.selectedRows;
        const hasSelection = !!(selectedRows && selectedRows.length > 0);

        let classes = "tableActionsContainer secondaryBar";

        if (hasSelection) {
            classes += " selectionActionsOpen";
        }

        return (<div className={classes}>
            {hasSelection ? this.getSelectionActions() : this.getReportToolbar()}
        </div>);
    },

    getNextReportPage() {
        if (this.props.reportData) {
            if (this.props.reportData.pageOffset + this.props.reportData.numRows >= this.props.reportData.data.recordsCount) {
                return false;
            }
            this.getPageUsingOffsetMultiplicant(1);
        }
    },

    getPreviousReportPage() {
        if (this.props.reportData) {
            if (this.props.reportData.pageOffset === 0) {
                return false;
            }
            this.getPageUsingOffsetMultiplicant(-1);
        }
    },

    getPageUsingOffsetMultiplicant(multiplicant) {
        let appId = this.props.reportData.appId;
        let tblId = this.props.reportData.tblId;
        let rptId = typeof this.props.reportData.rptId !== "undefined" ? this.props.reportData.rptId : this.props.params.rptId;
        let filter = {};
        let queryParams = {};
        let sortList = "";
        let numRows = Constants.PAGE.DEFAULT_NUM_ROWS;
        let offset =  Constants.PAGE.DEFAULT_OFFSET;

        if (this.props.reportData) {
            let reportData = this.props.reportData;
            if (reportData.numRows) {
                numRows = reportData.numRows;
            }
            if (reportData.pageOffset) {
                offset = reportData.pageOffset;
            }

            filter.selections = reportData.selections;
            filter.search = reportData.searchStringForFiltering;
            filter.facet = reportData.facetExpression;

            if (reportData.data && reportData.data.sortList) {
                sortList = reportData.data.sortList;
            }
        }

        queryParams[query.SORT_LIST_PARAM] = sortList;
        queryParams[query.OFFSET_PARAM] = offset + (multiplicant * numRows);
        queryParams[query.NUMROWS_PARAM] = numRows;

        this.props.loadDynamicReport(appId, tblId, rptId, true, filter, queryParams);
    },

    /**
     * Returns the count of records for a report.
     */
    getReportRecordsCount(reportData) {
        return reportData && reportData.data ? reportData.data.recordsCount : 0;
    },

    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    editNewRecord() {
        // need to dispatch to Fluxxor since report store handles this too...
        //const flux = this.getFlux();
        //flux.actions.editNewRecord();

        //this.props.dispatch(editNewRecord(false));
        WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, NEW_RECORD_VALUE);
    },

    render() {
        if (_.isUndefined(this.props.reportData) ||
            _.isUndefined(this.props.reportData.appId) ||
            _.isUndefined(this.props.reportData.tblId) ||
            _.isUndefined(this.props.reportData.rptId)
        ) {
            logger.info("the necessary params were not specified to reportToolsAndContent render params=" + simpleStringify(this.props.params));
            return <ReportContentError errorDetails={this.props.reportData.errorDetails}/>;
        } else {
            let classes = ['reportToolsAndContentContainer'];
            // TODO get from reports store
            if (this.props.selectedRows) {
                if (this.props.selectedRows.length > 0) {
                    classes.push('activeSelection');
                }
                if (this.props.selectedRows.length === 1) {
                    classes.push('singleSelection');
                }
            }

            if (this.props.reportData && this.props.reportData.isRecordDeleted) {
                this.getPageUsingOffsetMultiplicant(0);
            }

            let {appId, tblId, rptId, reportData: {selections, ...otherReportData}} = this.props;

            let fields = this.props.fields;
            let primaryKeyName = FieldUtils.getPrimaryKeyFieldName(fields);

            // Define the page start. Page offset is zero indexed. For display purposes, add one.
            this.pageStart = this.props.reportData.pageOffset + 1;
            // Define page end. This is page offset added to page size or number of rows.
            this.pageEnd = this.props.reportData.pageOffset + this.props.reportData.numRows;

            this.recordsCount = this.getReportRecordsCount(this.props.reportData);
            this.pageEnd = this.pageEnd > this.recordsCount ? this.recordsCount : this.pageEnd;

            let toolbar = this.getReportToolbar();

            let reportFooter = <ReportFooter
                                reportData={this.props.reportData}
                                getNextReportPage={this.getNextReportPage}
                                getPreviousReportPage={this.getPreviousReportPage}
                                pageStart={this.pageStart}
                                pageEnd={this.pageEnd}
                                recordsCount={this.recordsCount}/>;

            let cardViewPagination = <ReportFooter
                                reportData={this.props.reportData}
                                getNextReportPage={this.getNextReportPage}
                                getPreviousReportPage={this.getPreviousReportPage}
                                pageStart={this.pageStart}
                                pageEnd={this.pageEnd}
                                recordsCount={this.recordsCount}/>;

            return (
                <div className={classes.join(' ')}>
                    {this.getTableActions()}
                    <ReportContent appId={this.props.reportData.appId}
                                   tblId={this.props.reportData.tblId}
                                   rptId={typeof this.props.reportData.rptId !== "undefined" ? this.props.reportData.rptId : this.props.params.rptId}
                                   reportData={this.props.reportData}
                                   appUsers={this.props.appUsers}
                                   reportHeader={toolbar}
                                   reportFooter={reportFooter}
                                   cardViewPagination={cardViewPagination }
                                   primaryKeyName={primaryKeyName}
                                   flux={this.getFlux()}
                                   gridOptions={this.props.gridOptions}
                                   onAddNewRecord={this.editNewRecord}
                                   fieldSelectMenu={this.props.fieldSelectMenu}
                                   {...this.props}
                        // until all sub-components reference store directly, need to explicitly override this.props.fields
                                   fields={fields}/>

                    {!this.props.scrollingReport && <AddRecordButton onClick={this.editNewRecord}/>}
                </div>
            );
        }
    }
});

const mapStateToProps = (state, props) => {
    const reportData = _.has(props, 'reportData') ? props.reportData : {};
    return {
        report: state.report,
        search: state.search,
        fields: tableFieldsReportDataObj(state.fields, reportData.appId, reportData.tblId)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        searchInput: (input) => {
            dispatch(searchInput(input));
        },
        clearSearchInput: () => {
            dispatch(clearSearchInput());
        }
    };
};

const ReportToolsAndContent = connect(
    mapStateToProps,
    mapDispatchToProps
)(UnconnectedReportToolsAndContent);
export default ReportToolsAndContent;

// Wrap ReportToolsAndContent with unloadable HOC for use in embedded reports. The HOC will call
// loadDynamicReport to add data to the redux store. The HOC also handles unloading data from the
// redux store when the component unmounts.
export const TrackableReportToolsAndContent = unloadable(ReportToolsAndContent);
