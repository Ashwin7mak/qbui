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

//  Build the request query parameters needed to properly filter the report request based on the report
//  meta data.  Information that could be sent include fid list, sort list, grouping and query parameters
function buildRequestQuery(response, requiredQueryParams, overrideQueryParams, facetQueryExpression, filter) {
    var queryParams = {};
    var reportMetaData = {};

    if (response.data && response.data.reportMetaData) {
        reportMetaData = response.data.reportMetaData;
    } else {
        reportMetaData = response;
    }

    //required query params
    queryParams[query.OFFSET_PARAM] = requiredQueryParams[query.OFFSET_PARAM];
    queryParams[query.NUMROWS_PARAM] = requiredQueryParams[query.NUMROWS_PARAM];
    queryParams[query.FORMAT_PARAM] = requiredQueryParams[query.FORMAT_PARAM];

    //for the optional ones, if something is null/undefined pull from report's meta data
    if (reportMetaData && reportMetaData.data) {
        overrideQueryParams = overrideQueryParams || {};

        if (overrideQueryParams.hasOwnProperty(query.COLUMNS_PARAM)) {
            queryParams[query.COLUMNS_PARAM] = overrideQueryParams[query.COLUMNS_PARAM];
        } else {
            if (reportMetaData.data && reportMetaData.data.fids) {
                queryParams[query.COLUMNS_PARAM] = ReportUtils.getFidListString(reportMetaData.data.fids);
            }
        }

        //  Optional parameters used to return a result set in sorted and/or grouped order for
        //  easier client rendering of the result set data.
        //
        //      sortList: ==>  '2.1:V.33:C'
        //
        // if the report started out with sort/group settings defined and you removed them via the sort/group popover
        // to modify the sort/group settings adhoc, it should use the empty sort/group param and not fall
        // thru to use the original report settings. So here we test for hasOwnProperty since an empty value in the property
        // means to overide the sort/group with no sort/grouping. if the property is excluded only then do we default to the
        // original report settings for sort/group
        if (overrideQueryParams.hasOwnProperty(query.SORT_LIST_PARAM)) {
            queryParams[query.SORT_LIST_PARAM] = overrideQueryParams[query.SORT_LIST_PARAM];
        } else {
            /*eslint no-lonely-if:0*/
            if (reportMetaData.data.sortList) {
                queryParams[query.SORT_LIST_PARAM] = ReportUtils.getSortListString(reportMetaData.data.sortList);
            }
        }

        if (overrideQueryParams.hasOwnProperty(query.QUERY_PARAM)) {
            queryParams[query.QUERY_PARAM] = overrideQueryParams[query.QUERY_PARAM];
        } else {
            //  Concatenate facet expression(if any) and search filter(if any) into single query expression
            //  where each individual expression is 'AND'ed with the other.  To optimize query performance,
            //  order the array elements 1..n in order of significance/most targeted selection as the
            //  outputted query is built starting at offset 0.
            let filterQueries = [];
            if (reportMetaData.data.query) {
                filterQueries.push(reportMetaData.data.query);
            }
            if (facetQueryExpression) {
                filterQueries.push(facetQueryExpression.data);
            }

            if (filter && filter.search) {
                filterQueries.push(QueryUtils.parseStringIntoAllFieldsContainsExpression(filter.search));
            }
            queryParams[query.QUERY_PARAM] = QueryUtils.concatQueries(filterQueries);
        }
    }

    return queryParams;
}

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
     * @param sortList
     */
    loadReport(appId, tblId, rptId, format, offset, rows, sortList) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && rptId) {
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId, offset, rows});
                let reportService = new ReportService();

                //format, offset, rows, sortList
                let optionalParams = {
                    format: format,
                    offset: offset,
                    rows: rows
                };

                var promises = [];
                promises.push(reportService.getReportMetaData(appId, tblId, rptId));
                promises.push(reportService.getReportResults(appId, tblId, rptId, optionalParams));

                Promise.all(promises).then(
                    (response) => {
                        var model = reportModel.set(response[0], response[1]);

                        //  ..fire off the load report and record count events
                        this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                        this.dispatch(actions.LOAD_REPORT_RECORDS_COUNT_SUCCESS, {body: model.recordData.filteredCount});
                        resolve();

                        //if (response.data.reportMetaData && response.data.reportData) {
                        //    var model = reportModel.set(response.data.reportMetaData, response.data.reportData);
                        //    _.extend(model, {sortList: sortList});
                        //    this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                        //    resolve();
                        //}
                    },
                    error => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'reportService.getReport:');
                        this.dispatch(actions.LOAD_REPORT_FAILED, error.response.status);
                        reject();
                    }
                ).catch(ex => {
                    logger.logException(ex);
                    this.dispatch(actions.LOAD_REPORT_FAILED, 500);
                    reject();
                });

                //reportService.getReportRecordsCount(appId, tblId, rptId).then(
                //    response => {
                //        if (response.data) {
                //            logger.debug('ReportRecordsCount service call successful');
                //            this.dispatch(actions.LOAD_REPORT_RECORDS_COUNT_SUCCESS, response.data);
                //        }
                //    },
                //    error => {
                //        logger.parseAndLogError(LogLevel.ERROR, error, 'reportService.getReportRecordsCount:');
                //        this.dispatch(actions.LOAD_REPORT_RECORDS_COUNT_FAILED, error.response.status);
                //        reject();
                //    }
                //).catch(ex => {
                //    logger.logException(ex);
                //    this.dispatch(actions.LOAD_REPORT_RECORDS_COUNT_FAILED, 500);
                //    reject();
                //});
            } else {
                logger.error('reportDataActions.loadReport: Missing one or more required input parameters.  AppId:' + appId + '; TblId:' + tblId + '; RptId:' + rptId);
                this.dispatch(actions.LOAD_REPORT_FAILED, 500);
                reject();
            }
        });
    },

    loadDynamicReport(appId, tblId, rptId, format, filter, queryParams) {
        return new Promise((resolve, reject) => {
            if (appId && tblId && rptId) {

                if (!queryParams) {
                    queryParams = {};
                }

                this.dispatch(actions.LOAD_RECORDS, {appId, tblId, rptId, filter, offset:queryParams[query.OFFSET_PARAM], numRows:queryParams[query.NUMROWS_PARAM], sortList: queryParams[query.SORT_LIST_PARAM]});

                let reportService = new ReportService();

                // The filter parameter may contain a facetExpression
                let facetExpression = filter ? filter.facet : '';
                reportService.parseFacetExpression(facetExpression).then(
                    (response) => {
                        let filterQueries = [];

                        //  add the facet expression
                        if (response.data) {
                            filterQueries.push(response.data);
                        }

                        if (filter && filter.search) {
                            filterQueries.push(QueryUtils.parseStringIntoAllFieldsContainsExpression(filter.search));
                        }

                        queryParams = queryParams || {};
                        queryParams[query.QUERY_PARAM] = QueryUtils.concatQueries(filterQueries);

                        reportService.runDynamicReport(appId, tblId, rptId, queryParams).then (
                            (response) => {

                            },
                            (error) => {

                            }
                        )

                        var model = reportModel.set(null, null);

                        //  ..fire off the load report and record count events
                        this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                        this.dispatch(actions.LOAD_REPORT_RECORDS_COUNT_SUCCESS, {body: model.recordData.filteredCount});
                        resolve();
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
                logger.error('reportDataActions.getFilteredRecords: Missing one or more required input parameters.  AppId:' + appId + '; TblId:' + tblId + '; RptId:' + rptId);
                this.dispatch(actions.LOAD_RECORDS_FAILED, 500);
                reject();
            }
        });
    },

    /* Action called to get a new set of records given a report.
     * Override params can override report's sortlist/query etc
     *
     * Extended filter criteria can be attached to the query -
     *  Supported filtering options include:
     *       facet  : expression representing all the facets selected by user so far example [{fid: fid1, values: value1, value2}, {fid: fid2, values: value3, value4}, ..]
     *       search : search string
     *
     * @param requiredQueryParams: {format, offset, numrows}
     * @param filter: {facet, search}
     * @param overrideQueryParams: {columns, sortlist, query}
     */
    getFilteredRecords(appId, tblId, rptId, requiredQueryParams, filter, overrideQueryParams) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {

            if (appId && tblId && rptId) {
                let sortList = overrideQueryParams && overrideQueryParams[query.SORT_LIST_PARAM] ? overrideQueryParams[query.SORT_LIST_PARAM] : "";
                let offset = requiredQueryParams && requiredQueryParams[query.OFFSET_PARAM] ? requiredQueryParams[query.OFFSET_PARAM] : constants.PAGE.DEFAULT_OFFSET;
                let numRows = requiredQueryParams && requiredQueryParams[query.NUMROWS_PARAM] ? requiredQueryParams[query.NUMROWS_PARAM] : constants.PAGE.DEFAULT_NUM_ROWS;
                this.dispatch(actions.LOAD_RECORDS, {appId, tblId, rptId, filter, offset: offset, numRows: numRows, sortList: sortList});

                let reportService = new ReportService();
                let recordService = new RecordService();

                // Fetch the report meta data and parse the facet expression into a query expression
                // that is used when querying for the report data.
                var promises = [];
                promises.push(reportService.getReport(appId, tblId, rptId));

                // The filter parameter may contain a facetExpression
                let facetExpression = filter ? filter.facet : '';
                if (facetExpression !== '' && facetExpression.length) {
                    promises.push(reportService.parseFacetExpression(facetExpression));
                }

                Promise.all(promises).then(
                    response => {
                        var queryParams = buildRequestQuery(response[0], requiredQueryParams, overrideQueryParams, response[1], filter);

                        //  Get the filtered records
                        recordService.getRecords(appId, tblId, queryParams).then(
                            recordResponse => {
                                logger.debug('Filter Report Records service call successful');
                                var model = reportModel.set(null, recordResponse);
                                this.dispatch(actions.LOAD_RECORDS_SUCCESS, model);
                                this.dispatch(actions.LOAD_FILTERED_RECORDS_COUNT_SUCCESS, recordResponse);
                                resolve();
                            },
                            error => {
                                //  axios upgraded to an error.response object in 0.13.x
                                logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.getRecords:');
                                this.dispatch(actions.LOAD_RECORDS_FAILED, error.response.status);
                                this.dispatch(actions.LOAD_FILTERED_RECORDS_COUNT_FAILED, error.response.status);
                                reject();
                            }
                        ).catch(
                            ex => {
                                logger.logException(ex);
                                this.dispatch(actions.LOAD_RECORDS_FAILED, 500);
                                reject();
                            }
                        );
                    },
                    error => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.getRecords');
                        this.dispatch(actions.LOAD_RECORDS_FAILED, error.response.status);
                        reject();
                    }
                ).catch(
                    ex => {
                        logger.logException(ex);
                        this.dispatch(actions.LOAD_RECORDS_FAILED, 500);
                        reject();
                    }
                );
            } else {
                logger.error('reportDataActions.getFilteredRecords: Missing one or more required input parameters.  AppId:' + appId + '; TblId:' + tblId + '; RptId:' + rptId);
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
    },
};

export default reportDataActions;
