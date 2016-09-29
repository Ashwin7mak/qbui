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
import './report.scss';
import FilterUtils from '../../utils/filterUtils';
import StringUtils from '../../utils/stringUtils';
import * as query from '../../constants/query';
import FieldUtils from '../../utils/fieldUtils';
import ReportUtils from '../../utils/reportUtils';
import * as SchemaConsts from "../../constants/schema";
import * as Constants from "../../../../common/src/constants";

let logger = new Logger();

let FluxMixin = Fluxxor.FluxMixin(React);

let AddRecordButton = React.createClass({


    render() {
        return (
            <a href="#" className="addNewRecord" onClick={this.props.onClick}><QBicon icon="add" /></a>
        );
    }
});

/* The container for report and its toolbar */
const ReportToolsAndContent = React.createClass({
    mixins: [FluxMixin],
    facetFields : {},
    debounceInputMillis: 700, // a key send delay
    nameForRecords: "Records",  // get from table meta data
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
    },
    getDefaultProps() {
        return {
            selections:null,
        };
    },
    getInitialState: function() {
        return {
            reactabular: false
        };
    },
    componentWillMount() {
        // Create a debounced function that delays invoking filterReport func
        // until after debounceInputMillis milliseconds have elapsed since the
        // last time the debouncedFilterReport was invoked.
        this.debouncedFilterReport = _.debounce(this.filterReport, this.debounceInputMillis);
        // note the facets by id
        this.mapFacetFields();
    },
    componentWillReceiveProps() {
        this.mapFacetFields();
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
        this.facetFields = {};
        if (this.props.reportData && this.props.reportData.data &&
            this.props.reportData.data.facets) {
            this.props.reportData.data.facets.map((facet) => {
                // a fields id ->facet lookup
                this.facetFields[facet.id] = facet;
            });
        }
    },
    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add'},
            {msg: 'pageActions.favorite', icon:'star'},
            {msg: 'pageActions.gridEdit', icon:'report-grid-edit'},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.customizeReport', icon:'settings-hollow'},
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },
    filterOnSearch(newSearch) {
        this.debouncedFilterReport(newSearch, this.props.reportData.selections);
    },
    filterReport(searchString, selections) {
        let flux = this.getFlux();

        const filter = FilterUtils.getFilter(searchString, selections, this.facetFields);

        logger.debug('Sending filter action with:' + searchString);

        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = ReportUtils.getGListString(this.props.reportData.data.sortFids, this.props.reportData.data.groupEls);
        flux.actions.getFilteredRecords(this.props.selectedAppId,
            this.props.routeParams.tblId,
            typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.routeParams.rptId,
            {format:true, offset: Constants.PAGE.DEFAULT_OFFSET, numRows: Constants.PAGE.DEFAULT_NUM_ROWS}, filter, queryParams);
    },
    searchTheString(searchTxt) {
        this.getFlux().actions.filterSearchPending(searchTxt);
        this.filterOnSearch(searchTxt);
    },
    filterOnSelections(newSelections) {
        this.getFlux().actions.filterSelectionsPending(newSelections);
        this.debouncedFilterReport(this.props.searchStringForFiltering, newSelections);
    },
    clearSearchString() {
        this.getFlux().actions.filterSearchPending('');
        this.filterOnSearch('');
    },
    clearAllFilters() {
        let noSelections = new FacetSelections();
        this.getFlux().actions.filterSelectionsPending(noSelections);
        this.getFlux().actions.filterSearchPending('');
        this.debouncedFilterReport('', noSelections);
    },
    getReportToolbar() {
        let {appId, tblId, rptId,
            reportData:{selections, ...otherReportData}} = this.props;

        return <ReportToolbar appId={this.props.params.appId}
                              tblId={this.props.params.tblId}
                              rptId={typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.params.rptId}
                              reportData={this.props.reportData}
                              selections={this.props.reportData.selections}
                              searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                              pageActions={this.getPageActions(0)}
                              nameForRecords={this.nameForRecords}
                              fields={this.props.fields}
                              searchTheString={this.searchTheString}
                              filterOnSelections={this.filterOnSelections}
                              clearSearchString={this.clearSearchString}
                              clearAllFilters={this.clearAllFilters}
                              getNextReportPage={this.getNextReportPage}
                              getPreviousReportPage={this.getPreviousReportPage}
                              pageStart={this.pageStart}
                              pageEnd={this.pageEnd}
                              recordsCount={this.recordsCount}/>;
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
        let appId = this.props.params.appId;
        let tblId = this.props.params.tblId;
        let rptId = typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.params.rptId;
        let format = true;
        let numRows = this.props.reportData.numRows;
        let newOffset = this.props.reportData.pageOffset + (multiplicant * numRows);

        // Set up sort list
        let sortList = "";
        let data = this.props.reportData.data;
        if (data && data.sortFids && data.sortFids.length > 0) {
            sortList = ReportUtils.getListString(data.sortFids);
        }

        let searchString = this.props.reportData.searchStringForFiltering;
        if (StringUtils.isNonEmptyString(searchString)) {
            let filter = {
                selections: this.props.reportData.selections,
                search: searchString,
                facet: this.props.reportData.facetExpression
            };
            let queryParams =  {
                format:format,
                offset:newOffset,
                numRows:numRows
            };
            let overrideQueryParams = {
                sortList:sortList
            };
            this.getFlux().actions.getFilteredRecords(appId, tblId, rptId, queryParams, filter, overrideQueryParams);
        } else {
            this.getFlux().actions.loadReport(appId, tblId, rptId, format, newOffset, numRows, sortList);
        }
    },
    /**
     * Returns the count of records for a report.
     * If the report has been filtered or has facets, returns the filtered count. If not, returns the total records count.
     */
    getReportRecordsCount(reportData) {
        if (reportData.data) {
            let isReportFiltered = false;
                // check if report filtered?
            if (reportData.searchStringForFiltering && StringUtils.trim(reportData.searchStringForFiltering).length !== 0) {
                isReportFiltered = true;
            } else {
                // Report is not filtered, check for facet selections.
                isReportFiltered = reportData.selections ? reportData.selections.hasAnySelections() : false;
            }
            return isReportFiltered ? reportData.data.filteredRecordsCount : reportData.data.recordsCount;
        }
        return 0;
    },

    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    editNewRecord() {

        const {appId, tblId, rptId} = this.props.params;

        const flux = this.getFlux();

        flux.actions.editNewRecord(appId, tblId, rptId);
    },
    render() {
        let classes = "reportToolsAndContentContainer";
        if (this.props.selectedRows) {
            if (this.props.selectedRows.length > 0) {
                classes += " activeSelection";
            }
            if (this.props.selectedRows.length === 1) {
                classes += " singleSelection";
            }
        }

        let {appId, tblId, rptId, reportData:{selections, ...otherReportData}} = this.props;
        let uniqueIdentifier = FieldUtils.getUniqueIdentifierFieldName(this.props.fields);

        // Define the page start. Page offset is zero indexed. For display purposes, add one.
        this.pageStart = this.props.reportData.pageOffset + 1;
        // Define page end. This is page offset added to page size or number of rows.
        this.pageEnd = this.props.reportData.pageOffset + this.props.reportData.numRows;

        this.recordsCount = this.getReportRecordsCount(this.props.reportData);
        this.pageEnd = this.pageEnd > this.recordsCount ? this.recordsCount : this.pageEnd;


        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            (_.isUndefined(this.props.params.rptId) && _.isUndefined(this.props.rptId))
        ) {
            logger.info("the necessary params were not specified to reportRoute render params=" + simpleStringify(this.props.params));
            return null;
        } else {
            let toolbar = <ReportToolbar appId={this.props.params.appId}
                                         tblId={this.props.params.tblId}
                                         rptId={typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.params.rptId}
                                         reportData={this.props.reportData}
                                         selections={this.props.reportData.selections}
                                         searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                                         pageActions={this.getPageActions(0)}
                                         nameForRecords={this.nameForRecords}
                                         fields={this.props.fields}
                                         searchTheString={this.searchTheString}
                                         filterOnSelections={this.filterOnSelections}
                                         clearSearchString={this.clearSearchString}
                                         clearAllFilters={this.clearAllFilters}
                                         getNextReportPage={this.getNextReportPage}
                                         getPreviousReportPage={this.getPreviousReportPage}
                                         pageStart={this.pageStart}
                                         pageEnd={this.pageEnd}
                                         recordsCount={this.recordsCount}/>;

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
                <div className={classes}>
                    <label id="reactabularToggle" style={{display: "none"}}>&nbsp;
                        <input type="checkbox"
                               defaultChecked={this.state.reactabular}
                               onClick={(e) => {this.setState({reactabular: e.target.checked});}}/>&nbsp;Use Reactabular Grid
                    </label>
                    {this.getTableActions()}

                    <ReportContent appId={this.props.params.appId}
                                   tblId={this.props.params.tblId}
                                   rptId={typeof this.props.rptId !== "undefined" ? this.props.rptId : this.props.params.rptId}
                                   reportData={this.props.reportData}
                                   appUsers={this.props.appUsers}
                                   reportHeader={toolbar}
                                   reportFooter={reportFooter}
                                   cardViewPagination={cardViewPagination }
                                   keyField={this.props.fields && this.props.fields.keyField ?
                                       this.props.fields.keyField.name : SchemaConsts.DEFAULT_RECORD_KEY }
                                   uniqueIdentifier={uniqueIdentifier}
                                   flux={this.getFlux()}
                                   reactabular={this.state.reactabular}
                                   gridOptions={this.props.gridOptions}
                                   {...this.props} />

                    {!this.props.scrollingReport && <AddRecordButton onClick={this.editNewRecord}/>}
                </div>
            );
        }
    }
});

export default ReportToolsAndContent;
