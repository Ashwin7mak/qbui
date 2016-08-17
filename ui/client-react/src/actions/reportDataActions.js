/**
 * Any actions related to Report model are defined here. This is responsible for making calls to Node layer api based on the action.
 */
import * as actions from '../constants/actions';
import * as query from '../constants/query';
import ReportService from '../services/reportService';
import RecordService from '../services/recordService';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import Promise from 'bluebird';
import QueryUtils from '../utils/queryUtils';
import ReportUtils from '../utils/reportUtils';
import Locale from '../locales/locales';
import {NotificationManager} from 'react-notifications';

let logger = new Logger();

import reportModel from '../models/reportModel';

//  Build the request query parameters needed to properly filter the report request based on the report
//  meta data.  Information that could be sent include fid list, sort list, grouping and query parameters
function buildRequestQuery(reportMetaData, requiredQueryParams, overrideQueryParams, facetQueryExpression, filter) {
    var queryParams = {};

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

    loadReport(appId, tblId, rptId, format, offset, rows, sortList) {

        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {

            if (appId && tblId && rptId) {
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId});
                let reportService = new ReportService();

                //  query for the report meta data
                //  TODO: refactor by having just 1 network call to node to retrieve a report...
                //  TODO: leverage how homepage report is loaded..
                reportService.getReport(appId, tblId, rptId).then(
                    reportMetaData => {
                        let requiredParams = {};
                        requiredParams[query.FORMAT_PARAM] = format;
                        requiredParams[query.OFFSET_PARAM] = offset;
                        requiredParams[query.NUMROWS_PARAM] = rows;
                        let overrideQueryParams = {};
                        if (sortList !== undefined) {
                            overrideQueryParams[query.SORT_LIST_PARAM] = sortList;
                        }

                        var queryParams = buildRequestQuery(reportMetaData, requiredParams, overrideQueryParams);

                        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams).then(
                            reportData => {
                                logger.debug('ReportDataAndFacets service call successful');
                                var model = reportModel.set(reportMetaData, reportData);
                                _.extend(model, {sortList: sortList});
                                this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                                resolve();
                            },
                            error => {
                                //  axios upgraded to an error.response object in 0.13.x
                                logger.parseAndLogError(LogLevel.ERROR, error.response, 'reportService.getReportDataAndFacets:');
                                this.dispatch(actions.LOAD_REPORT_FAILED, error.response.status);
                                reject();
                            }
                        );
                    },
                    error => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'reportService.getReport:');
                        this.dispatch(actions.LOAD_REPORT_FAILED, error.response.status);
                        reject();
                    }
                ).catch(
                    ex => {
                        logger.logException(ex);
                        this.dispatch(actions.LOAD_REPORT_FAILED, 500);
                        reject();
                    }
                );
            } else {
                logger.error('reportDataActions.loadReport: Missing one or more required input parameters.  AppId:' + appId + '; TblId:' + tblId + '; RptId:' + rptId);
                this.dispatch(actions.LOAD_REPORT_FAILED, 500);
                reject();
            }
        });
    },

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
     * save a new record
     */
    saveNewReportRecord(appId, tblId, record) {
            // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && record) {
                this.dispatch(actions.ADD_REPORT_RECORD, {appId, tblId, record});
                let recordService = new RecordService();

                    //  save the changes to the record
                recordService.createRecord(appId, tblId, record).then(
                        response => {
                            logger.debug('RecordService createRecord success:' + JSON.stringify(response));
                            if (response !== undefined && response.data !== undefined && response.data.body !== undefined) {
                                let resJson = JSON.parse(response.data.body);
                                this.dispatch(actions.ADD_REPORT_RECORD_SUCCESS, {appId, tblId, record, recId: resJson.id});
                                NotificationManager.success(Locale.getMessage('recordNotifications.recordAdded'), Locale.getMessage('success'), 1500);
                                resolve();
                            } else {
                                logger.error('RecordService createRecord call error: no response data value returned');
                                this.dispatch(actions.ADD_REPORT_RECORD_FAILED, {appId, tblId, record, error: new Error('no response data member')});
                                NotificationManager.error(Locale.getMessage('recordNotifications.recordNotAdded'), Locale.getMessage('failed'), 1500);
                                reject();
                            }
                        },
                        error => {
                            //  axios upgraded to an error.response object in 0.13.x
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.createRecord:');
                            this.dispatch(actions.ADD_REPORT_RECORD_FAILED, {appId, tblId, record, error: error.response});
                            NotificationManager.error(Locale.getMessage('recordNotifications.recordNotAdded'), Locale.getMessage('failed'), 1500);
                            reject();
                        }
                    ).catch(
                        ex => {
                            logger.logException(ex);
                            this.dispatch(actions.ADD_REPORT_RECORD_FAILED, {appId, tblId, record, error: ex});
                            reject();
                        }
                    );
            } else {
                var errMessage = 'Missing one or more required input parameters to reportDataActions.addReportRecord. AppId:' +
                        appId + '; TblId:' + tblId + '; record:' + record;
                logger.error(errMessage);
                this.dispatch(actions.ADD_REPORT_RECORD_FAILED, {error: errMessage});
                reject();
            }
        });
    },

    /**
     * delete a record
     */
    deleteReportRecord(appId, tblId, recId, nameForRecords) {
        // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && (!!(recId === 0 || recId))) {
                this.dispatch(actions.DELETE_REPORT_RECORD, {appId, tblId, recId});
                let recordService = new RecordService();

                //delete the record
                recordService.deleteRecord(appId, tblId, recId).then(
                    response => {
                        logger.debug('RecordService deleteRecord success:' + JSON.stringify(response));
                        this.dispatch(actions.DELETE_REPORT_RECORD_SUCCESS, recId);
                        NotificationManager.success("1 " + nameForRecords + " " + Locale.getMessage('recordNotifications.deleted'), Locale.getMessage('success'), 2000);
                        resolve();
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.deleteRecord:');
                        this.dispatch(actions.DELETE_REPORT_RECORD_FAILED, {appId, tblId, recId, error: error.response});
                        NotificationManager.error("1 " + nameForRecords + " " + Locale.getMessage('recordNotifications.notDeleted'), Locale.getMessage('failed'), 3000);
                        reject();
                    }
                ).catch(
                    ex => {
                        logger.logException(ex);
                        this.dispatch(actions.DELETE_REPORT_RECORD_FAILED, {appId, tblId, recId, error: ex});
                        reject();
                    }
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to reportDataActions.deleteReportRecord. AppId:' +
                    appId + '; TblId:' + tblId + '; recId:' + recId ;
                logger.error(errMessage);
                this.dispatch(actions.DELETE_REPORT_RECORD_FAILED, {appId, tblId, recId, error: errMessage});
                reject();
            }
        });
    },

    /**
     * delete records in bulk
     */
    deleteReportRecordBulk(appId, tblId, recIds, nameForRecords) {
        // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && recIds && recIds.length >= 1) {
                this.dispatch(actions.DELETE_REPORT_RECORD_BULK, {appId, tblId, recIds});
                let recordService = new RecordService();

                //delete the records
                recordService.deleteRecordBulk(appId, tblId, recIds).then(
                    response => {
                        logger.debug('RecordService deleteRecordBulk success:' + JSON.stringify(response));
                        this.dispatch(actions.DELETE_REPORT_RECORD_BULK_SUCCESS, recIds);
                        let message = recIds.length === 1 ? ("1 " + nameForRecords + " " + Locale.getMessage('recordNotifications.deleted')) : (recIds.length + " " + nameForRecords + " " + Locale.getMessage('recordNotifications.deleted'));
                        NotificationManager.success(message, Locale.getMessage('success'), 2000);
                        resolve();
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.deleteRecordBulk:');
                        this.dispatch(actions.DELETE_REPORT_RECORD_BULK_FAILED, {appId, tblId, recIds, error: error.response});
                        let message = recIds.length === 1 ? ("1 " + nameForRecords + " " + Locale.getMessage('recordNotifications.notDeleted')) : (recIds.length + " " + nameForRecords + " " + Locale.getMessage('recordNotifications.notDeleted'));
                        NotificationManager.error(message, Locale.getMessage('failed'), 3000);
                        reject();
                    }
                ).catch(
                    ex => {
                        logger.logException(ex);
                        this.dispatch(actions.DELETE_REPORT_RECORD_BULK_FAILED, {appId, tblId, recIds, error: ex});
                        reject();
                    }
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to reportDataActions.deleteReportRecordBulk. AppId:' +
                    appId + '; TblId:' + tblId + '; recIds:' + recIds ;
                logger.error(errMessage);
                this.dispatch(actions.DELETE_REPORT_RECORD_BULK_FAILED, {appId, tblId, recIds, error: errMessage});
                reject();
            }
        });
    },

    /* the start of editing a record */
    /**
     * save a record
     */
    saveReportRecord(appId, tblId, recId, changes) {
        // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && (!!(recId === 0 || recId)) && changes) {
                this.dispatch(actions.SAVE_REPORT_RECORD, {appId, tblId, recId, changes});
                let recordService = new RecordService();

                //  save the changes to the record
                recordService.saveRecord(appId, tblId, recId, changes).then(
                    response => {
                        logger.debug('RecordService saveRecord success:' + JSON.stringify(response));
                        this.dispatch(actions.SAVE_REPORT_RECORD_SUCCESS, {appId, tblId, recId, changes});
                        NotificationManager.success(Locale.getMessage('recordNotifications.recordSaved'), Locale.getMessage('success'), 1500);
                        resolve();
                    },
                    error => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.saveRecord:');
                        this.dispatch(actions.SAVE_REPORT_RECORD_FAILED, {appId, tblId, recId, changes, error: error.response});
                        NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'), 1500);
                        reject();
                    }
                ).catch(
                    ex => {
                        logger.logException(ex);
                        this.dispatch(actions.SAVE_REPORT_RECORD_FAILED, {appId, tblId, recId, changes, error: ex});
                        reject();
                    }
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to reportDataActions.saveReportRecord. AppId:' +
                    appId + '; TblId:' + tblId + '; recId:' + recId + '; changes:' + changes ;
                logger.error(errMessage);
                this.dispatch(actions.SAVE_REPORT_RECORD_FAILED, {error: errMessage});
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
                this.dispatch(actions.LOAD_RECORDS, {appId, tblId, rptId, filter, sortList: sortList});

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
                                resolve();
                            },
                            error => {
                                //  axios upgraded to an error.response object in 0.13.x
                                logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.getRecords:');
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
     * @param rptId
     */
    showPreviousRecord(rptId) {
        this.dispatch(actions.SHOW_PREVIOUS_RECORD, {rptId});
    },
    /**
     * navigate to next record after opening record from report
     * @param rptId
     */
    showNextRecord(rptId) {
        this.dispatch(actions.SHOW_NEXT_RECORD, {rptId});
    },
    /**
     * open record from report (i.e. drill-down)
     * @param rptId
     */
    openingReportRow(rptId, recId) {
        this.dispatch(actions.OPEN_REPORT_RECORD, {rptId, recId});
    }
};

export default reportDataActions;
