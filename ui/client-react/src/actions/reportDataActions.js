/**
 * Any actions related to Report model are defined here. This is responsible for making calls to Node layer api based on the action.
 */
import * as actions from '../constants/actions';
import * as query from '../constants/query';
import ReportService from '../services/reportService';
import RecordService from '../services/recordService';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import constants from '../../../common/src/constants';
import Promise from 'bluebird';
import QueryUtils from '../utils/queryUtils';
import ReportUtils from '../utils/reportUtils';
import Locale from '../locales/locales';
import {NotificationManager} from 'react-notifications';

let logger = new Logger();

import reportModel from '../models/reportModel';

//  Custom handling of 'possible unhandled rejection' error,  because we don't want
//  to see an exception in the console output.  The exception is thrown by bluebird
//  because the core application code has no logic implemented to handle a rejected
//  promise.  This is expected as promises are NOT implemented in the application
//  code.  Promises are returned only to support our unit tests, which are expected
//  to implement the appropriate handlers.
Promise.onPossiblyUnhandledRejection(function(err) {
    logger.debug('Bluebird Unhandled rejection', err);
});

let reportDataActions = {

    filterSelectionsPending(selections) {
        this.dispatch(actions.FILTER_SELECTIONS_PENDING, {selections});
    },

    filterSearchPending(string) {
        this.dispatch(actions.FILTER_SEARCH_PENDING, {string});
    },

    /**
     * rows were selected (toolbar etc cares about this)
     * @param rows array of row objects
     */
    selectedRows(rows) {
        this.dispatch(actions.SELECTED_ROWS, rows);
    },

    /**
     * setup a a new record not yet saved to the database
     */
    newBlankReportRecord(appId, tblId, afterRecId) {
        this.dispatch(actions.NEW_BLANK_REPORT_RECORD, {appId, tblId, afterRecId});
    },

    /**
     * Load a report based on it's meta data definition.
     *
     * @param appId
     * @param tblId
     * @param rptId
     * @param format
     * @param offset
     * @param rows
     */
    loadReport(appId, tblId, rptId, format, offset, rows) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && rptId) {
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId, offset, rows});
                let reportService = new ReportService();

                //format, offset, rows, sortList
                let params = [];
                params[query.OFFSET_PARAM] = offset;
                params[query.NUMROWS_PARAM] = rows;

                //  Fetch a report.  The response will include:
                //    - report data/grouping data
                //    - report meta data
                //    - report fields
                //    - report facets
                //    - report count
                reportService.getReportResults(appId, tblId, rptId, params, format).then(
                    (reportResponse) => {
                        let model = reportModel.set(reportResponse.data.metaData, reportResponse.data);
                        this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                        resolve();
                    },
                    (reportResponseError) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, reportResponseError.response, 'reportService.getReport:');
                        this.dispatch(actions.LOAD_REPORT_FAILED, reportResponseError.response.status);
                        reject();
                    }
                ).catch(ex => {
                    logger.logException(ex);
                    this.dispatch(actions.LOAD_REPORT_FAILED, 500);
                    reject();
                });
            } else {
                logger.error('reportDataActions.loadReport: Missing one or more required input parameters.  AppId:' + appId + '; TblId:' + tblId + '; RptId:' + rptId);
                this.dispatch(actions.LOAD_REPORT_FAILED, 500);
                reject();
            }
        });
    },

    /* Action called to run a report that overrides the report meta data defaults.
     *
     * Override params can override report's sortlist/query etc
     *
     * Extended filter criteria can be attached to the query -
     *  Supported filtering options include:
     *       facet  : expression representing all the facets selected by user so far example [{fid: fid1, values: value1, value2}, {fid: fid2, values: value3, value4}, ..]
     *       search : search string
     *
     * @param queryParams: {offset, numrows, cList, sList, query}
     * @param filter: {facet, search}
     */
    loadDynamicReport(appId, tblId, rptId, format, filter, queryParams) {
        return new Promise((resolve, reject) => {
            if (appId && tblId && rptId) {

                if (!queryParams) {
                    queryParams = {};
                }

                let offset = queryParams[query.OFFSET_PARAM];
                let numRows = queryParams[query.NUMROWS_PARAM];
                let sortList = queryParams[query.SORT_LIST_PARAM];

                this.dispatch(actions.LOAD_RECORDS, {appId, tblId, rptId, filter, offset:offset, numRows:numRows, sortList:sortList});
                let reportService = new ReportService();

                reportService.parseFacetExpression(filter ? filter.facet : '').then(
                    (facetResponse) => {
                        let filterQueries = [];

                        //  add the facet expression..if any
                        if (facetResponse.data) {
                            filterQueries.push(facetResponse.data);
                        }

                        //  any search filters
                        if (filter && filter.search) {
                            filterQueries.push(QueryUtils.parseStringIntoAllFieldsContainsExpression(filter.search));
                        }

                        //  override the report query expressions
                        if (filterQueries.length > 0) {
                            queryParams[query.QUERY_PARAM] = QueryUtils.concatQueries(filterQueries);
                        }

                        //  the sorting, grouping and clist requirements(if any) are expected to be included in the supplied queryParams

                        //  Fetch a report with custom attributes.  The response will include:
                        //    - report data/grouping data
                        //    - report meta data
                        //    - report fields
                        //    - report count
                        reportService.getDynamicReportResults(appId, tblId, rptId, queryParams, format).then(
                            (reportResponse) => {
                                var model = reportModel.set(reportResponse.data.metaData, reportResponse.data);
                                this.dispatch(actions.LOAD_RECORDS_SUCCESS, model);
                                resolve();
                            },
                            (reportResultsError) => {
                                logger.parseAndLogError(LogLevel.ERROR, reportResultsError.response, 'reportDataActions.loadDynamicReport');
                                this.dispatch(actions.LOAD_RECORDS_FAILED, reportResultsError.response.status);
                                reject();
                            }
                        ).catch((ex) => {
                            logger.logException(ex);
                            this.dispatch(actions.LOAD_RECORDS_FAILED, 500);
                            reject();
                        });
                    },
                    (error) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'reportDataActions.parseFacetExpression');
                        this.dispatch(actions.LOAD_RECORDS_FAILED, error.response.status);
                        reject();
                    }
                ).catch((ex) => {
                    logger.logException(ex);
                    this.dispatch(actions.LOAD_RECORDS_FAILED, 500);
                    reject();
                });
            } else {
                logger.error('reportDataActions.loadDynamicReport: Missing one or more required input parameters.  AppId:' + appId + '; TblId:' + tblId + '; RptId:' + rptId);
                this.dispatch(actions.LOAD_RECORDS_FAILED, 500);
                reject();
            }
        });
    },

    /**
     * navigate to previous record after opening record from report
     * @param recId
     */
    showPreviousRecord(recId) {
        this.dispatch(actions.SHOW_PREVIOUS_RECORD, {recId});
    },
    /**
     * navigate to next record after opening record from report
     * @param recId
     */
    showNextRecord(recId) {
        this.dispatch(actions.SHOW_NEXT_RECORD, {recId});
    },
    /**
     * open record from report (i.e. drill-down)
     * @param recId
     */
    openingReportRow(recId) {
        this.dispatch(actions.OPEN_REPORT_RECORD, {recId});
    },
    /**
     * navigate to previous record after opening record from report
     * @param recId
     */
    editPreviousRecord(recId) {
        this.dispatch(actions.EDIT_PREVIOUS_RECORD, {recId});
    },
    /**
     * navigate to next record after opening record from report
     * @param recId
     */
    editNextRecord(recId) {
        this.dispatch(actions.EDIT_NEXT_RECORD, {recId});
    },
    /**
     * open record from report (i.e. drill-down)
     * @param recId
     */
    editingReportRow(recId) {
        this.dispatch(actions.EDIT_REPORT_RECORD, {recId});
    }
};

export default reportDataActions;
