import ReportService from '../services/reportService';
import ReportModel from '../models/reportModel';
import ReportsModel from '../models/reportsModel';
import FieldsService from '../services/fieldsService';
import Promise from 'bluebird';
import QueryUtils from '../utils/queryUtils';
import _ from 'lodash';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

import * as types from '../actions/types';
import {CONTEXT} from '../actions/context';
import * as query from '../constants/query';

let logger = new Logger();

/**
 * Construct reports store payload
 *
 * @param context - context
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(context, type, content) {
    let id = context;
    return {
        id: id,
        type: type,
        content: content || null
    };
}

/**
 * Track the list of records that are selected when viewing a report.
 *
 * @param context - the context that the report is being viewed
 * @param selections - list of record ids selected
 * @returns {{id, type, content}|{id: *, type: *, content: *}}
 */
export const selectReportRecords = (context, selections) => {
    return event(context, types.SELECT_REPORT_RECORDS, {selections});
};

export const addBlankRecordToReport = (context, afterRecId) => {
    return (dispatch) => {
        return new Promise((resolve) => {
            dispatch(event(context, types.ADD_BLANK_REPORT_RECORD, {context, afterRecId}));
            resolve();
        });
    };
};

export const removeBlankRecordFromReport = (context, appId, tblId, recId) => {
    return event(context, types.REMOVE_BLANK_REPORT_RECORD, {appId, tblId, recId});
};

/**
 * Retrieve a list of reports for the given app/table.  This function is called primarily when
 * populating the left hand navigation window with the list of reports and when displaying a
 * trowser window that displays all of the reports for a table.
 *
 * @param context - what context is requesting the report list (ie: nav)
 * @param appId - app id
 * @param tblId - table id
 */
export const loadReports = (context, appId, tblId) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (context && appId && tblId) {
                logger.debug(`ReportsAction.loadReports: loading report list for appId: ${appId}, tableId: ${tblId}`);

                dispatch(event(context, types.LOAD_REPORTS, {appId, tblId}));

                let reportService = new ReportService();
                reportService.getReports(appId, tblId)
                    .then((response) => {
                        logger.debug('ReportService getReports success');
                        //  TODO change to a class like reportModel
                        let model = ReportsModel.set(appId, tblId, response.data);
                        dispatch(event(context, types.LOAD_REPORTS_SUCCESS, model));
                        resolve();
                    }).catch((error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'reportService.getReports:');
                        dispatch(event(context, types.LOAD_REPORTS_FAILED, error));
                        reject();
                    });
            } else {
                logger.error(`reportActions.loadReports: Missing required input parameters.  context: ${context}, appId: ${appId}, tableId: ${tblId}`);
                dispatch(event(null, types.LOAD_REPORTS_FAILED, 500));
                reject();
            }
        });
    };
};

/**
 * Retrieve a report for the given app/table.
 *
 * @param context - what context is requesting the report list (ie: nav)
 * @param appId - app id
 * @param tblId - table id
 * @param rptId - report id
 * @param format
 * @param offset - row offset
 * @param rows - number of rows to return for the report
 */
export const loadReport = (context, appId, tblId, rptId, format, offset, rows) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (context && appId && tblId && rptId) {
                logger.debug(`ReportAction.loadReport: loading report for appId:${appId}, tableId:${tblId}, rptId:${rptId}`);

                dispatch(event(context, types.LOAD_REPORT, {appId, tblId, rptId}));
                let reportService = new ReportService();

                let params = {};
                params[query.OFFSET_PARAM] = offset;
                params[query.NUMROWS_PARAM] = rows;

                //  Fetch a report.  The response will include:
                //    - report data/grouping data
                //    - report meta data
                //    - report fields
                //    - report facets
                //    - report count
                //
                reportService.getReportResults(appId, tblId, rptId, params, format)
                    .then((reportResponse) => {
                        let metaData = reportResponse.data ? reportResponse.data.metaData : null;
                        let model = new ReportModel(appId, metaData, reportResponse.data, params);
                        dispatch(event(context, types.LOAD_REPORT_SUCCESS, model.get()));
                        resolve();
                    }).catch((reportResponseError) => {
                        logger.parseAndLogError(LogLevel.ERROR, reportResponseError.response, 'reportService.getReport:');
                        dispatch(event(context, types.LOAD_REPORT_FAILED, reportResponseError));
                        reject();
                    });
            } else {
                logger.error(`ReportAction.loadReport: Missing one or more required input parameters.  Context:${context}, AppId:${appId}, tableId:${tblId}, rptId:${rptId}`);
                dispatch(event(context, types.LOAD_REPORT_FAILED, 500));
                reject();
            }
        });
    };
};

/**
 * Construct a query parameters for the dynamic report using supplied facet expression, filter, and
 * existing queryParams.
 */
const constructQueryParams = (facetExpression, filter = {}, queryParams) => {
    const filterQueries = [];

    //  add the facet expression
    if (facetExpression) {
        filterQueries.push(facetExpression);
    }
    //  any search filters
    if (filter && filter.search) {
        filterQueries.push(QueryUtils.parseStringIntoAllFieldsContainsExpression(filter.search));
    }
    //  override the report query expressions
    if (filterQueries.length > 0) {
        queryParams = queryParams || {};
        queryParams[query.QUERY_PARAM] = QueryUtils.concatQueries(filterQueries);
    }

    logger.debug('Dynamic report query params: offset:' +
        queryParams[query.OFFSET_PARAM] + ', numRows:' +
        queryParams[query.NUMROWS_PARAM] + ', sortList:' +
        queryParams[query.SORT_LIST_PARAM] + ', query:' +
        queryParams[query.QUERY_PARAM]);

    return queryParams;
};

/**
 *  Fetch a report with custom attributes.  The response will include:
 *    - report data/grouping data
 *    - report meta data (includes the override settings..if any)
 *    - report fields
 *    - report count
 *
 *  NOTE:
 *    - the sorting, grouping and clist requirements(if any) are expected to be included in queryParams
 *    - no faceting data is returned..
 *
 * @param {String} context context of the redux action
 * @param {Object} <Object> containing parameters needed by reportService.getDynamicReportResults
 * @param {filter} filter Optional, filter being applied to the report
 */
const getDynamicReportResults = (context, {appId, tblId, rptId, queryParams, format}, filter) => {
    const reportService = new ReportService();
    return reportService.getDynamicReportResults(appId, tblId, rptId, queryParams, format)
        .then((reportResponse) => {
            const metaData = reportResponse.data ? reportResponse.data.metaData : null;

            //  ensure the model includes the input run-time parameters
            const params = {
                [query.OFFSET_PARAM] : queryParams[query.OFFSET_PARAM],
                [query.NUMROWS_PARAM] : queryParams[query.NUMROWS_PARAM],
                filter
            };

            const model = new ReportModel(appId, metaData, reportResponse.data, params);
            return model.get();
        });
};

/**
 * Utility function for handling rejected promises.
 * This is a curried function which returns a function expecting 2 parameters, which returns another
 * function that expects an error object.
 *
 * Ex.
 *     const parseAndLogHandler = parseAndLogError(context, dispatch);
 *     const errorHandler = parseAndLogHandler(action, 'something failed!');
 *     errorHandler(new Error('oh no'));
 *
 * @param {String} context string representing the context to dispatch the failure event
 * @param {Function} dispatch dispatch funtion to call
 * @returns {Function}
 */
const parseAndLogError = (context, dispatch) =>
    /* @param {String} action action type for the dispatch event
     * @param {String} errorString message to log with the Logger
     * @returns {Function} */
    (action, errorString) =>
        /* @param {Error} */
        (error) => {
            error = error.response || error;
            logger.parseAndLogError(LogLevel.ERROR, error, errorString);
            dispatch(event(context, action, error));
            // reject the promise to prevent bluebird from swallowing the error
            return Promise.reject();
        };

/* Run a customized report that optionally allows for dynamically overriding report meta data defaults for
 * sort/grouping, query and column list settings.
 *
 * Currently supported query filtering overrides include:
 *       facet  : expression representing all the facets selected by user so far example [{fid: fid1, values: value1, value2}, {fid: fid2, values: value3, value4}, ..]
 *       search : search string
 *
 * The overrides are expected to be defined in the queryParams parameter.  If no entry is found, then the report meta
 * data defaults will be used.  NOTE: an empty parameter value is considered valid (clear the default value) and will
 * be passed to the node layer.
 *
 * @param context
 * @param appId
 * @param tblId
 * @param rptId
 * @param format: should the report output be formatted for display.  If not true, raw data values are returned.
 * @param filter: {facet, search}
 * @param queryParams: {offset, numrows, cList, sList, query}
 */
export const loadDynamicReport = (context, appId, tblId, rptId, format, filter, queryParams) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        // set the actions to embedded or not embedded using the passed in context
        const embedded = _.includes(context, CONTEXT.REPORT.EMBEDDED);
        const actions = {
            LOAD_REPORT: embedded ? types.LOAD_EMBEDDED_REPORT : types.LOAD_REPORT,
            LOAD_REPORT_SUCCESS: embedded ? types.LOAD_EMBEDDED_REPORT_SUCCESS : types.LOAD_REPORT_SUCCESS,
            LOAD_REPORT_FAILED: embedded ? types.LOAD_EMBEDDED_REPORT_FAILED : types.LOAD_REPORT_FAILED
        };
        if (appId && tblId && rptId) {
            logger.debug(`Loading dynamic report for appId: ${appId}, tblId:${tblId}, rptId:${rptId}`);

            dispatch(event(context, actions.LOAD_REPORT, {appId, tblId, rptId}));
            const reportService = new ReportService();

            // error handler for when a promise is rejected
            const parseAndLogHandler = parseAndLogError(context, dispatch);

            //  parse the supplied facet expression into a query expression that
            //  can be included on the request.
            return reportService.parseFacetExpression(filter ? filter.facet : '')
                .then((facetResponse) => {
                    const facetExpression = _.get(facetResponse, 'data');
                    return constructQueryParams(facetExpression, filter, queryParams);
                }).then((newQueryParams) => {
                    return getDynamicReportResults(context, {appId, tblId, rptId, queryParams: newQueryParams, format}, filter)
                        .then((report) => {
                            dispatch(event(context, actions.LOAD_REPORT_SUCCESS, report));
                            return; //resolve promise with undefined
                        }).catch(
                            parseAndLogHandler(actions.LOAD_REPORT_FAILED, `reportActions.getDynamicReportResults, context: ${context}`)
                        );
                }).catch(
                    parseAndLogHandler(actions.LOAD_REPORT_FAILED, `reportActions.parseFacetExpression, context: ${context}`)
                );
        } else {
            logger.error(`reportActions.loadDynamicReport: Missing one or more required input parameters.  AppId:${appId}; TblId:${tblId}; RptId:${rptId}`);
            dispatch(event(context, actions.LOAD_REPORT_FAILED, 500));
            return new Promise.reject();
        }
    };
};

/**
 * Called when an embedded report is being unmounted. We want to clear its report entry from the
 * embeddedReports store.
 * @param  context unique context for the embeddedReport instance
 * @return {{id: *, type}}
 */
export const unloadEmbeddedReport = (context) =>
    event(context, types.UNLOAD_EMBEDDED_REPORT);

/** Find the records count for a report. Allows customized report that optionally allows for query
 * parameters. The overrides are expected to be defined in the queryParams parameter.
 *
 * When the results are returned from the node layer a LOAD_REPORT_SUCCESS event is fired and the
 * result will be passed to the report store.
 * @param context
 * @param appId
 * @param tblId
 * @param rptId
 * @param queryParams: {offset, numrows, cList, sList, query}
 */
export const loadReportRecordsCount = (context, appId, tblId, rptId, queryParams) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        if (appId && tblId && rptId) {
            logger.debug(`Loading records count for appId: ${appId}, tblId:${tblId}, rptId:${rptId}, queryParams:${JSON.stringify(queryParams)}`);

            const reportService = new ReportService();
            return reportService.getReportRecordsCount(appId, tblId, rptId, queryParams)
                .then((response) => {
                    dispatch(event(context, types.LOAD_REPORT_RECORDS_COUNT_SUCCESS, Number(response.data.body)));
                    return; //resolve promise with undefined
                }).catch(
                    parseAndLogError(context, dispatch)(types.LOAD_REPORT_RECORDS_COUNT_FAILED, `reportActions.loadReportRecordsCount, context: ${context}`)
                );
        } else {
            logger.error(`reportActions.loadReportRecordsCount: Missing one or more required input parameters.  AppId:${appId}; TblId:${tblId}; RptId:${rptId}`);
            dispatch(event(context, types.LOAD_REPORT_RECORDS_COUNT_FAILED, 500));
            return new Promise.reject();
        }
    };
};

/**
 * Refresh the fields for the field select menu.
 * @param context
 * @param appId
 * @param tblId
 */
export const refreshFieldSelectMenu = (context, appId, tblId) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let fieldsService = new FieldsService();
            fieldsService.getFields(appId, tblId)
                .then(response => {
                    logger.debug('FieldsService getFields success');
                    dispatch(event(context, types.REFRESH_FIELD_SELECT_MENU, {response}));
                    resolve();
                }).catch(error => {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'fieldsService.getFields:');
                    reject();
                });
        });
    };
};

/**
 * Toggle the field select menu open.
 * @param context
 * @param clickedColumnId
 * @param addBeforeColumn
 */
export const openFieldSelectMenu = (context, clickedColumnId, addBeforeColumn) => {
    return event(context, types.OPEN_FIELD_SELECT_MENU, {clickedColumnId, addBeforeColumn});
};

/**
 * Toggle the field select menu closed.
 * @param context
 */
export const closeFieldSelectMenu = (context) => {
    return event(context, types.CLOSE_FIELD_SELECT_MENU, {});
};

/**
 * Add the selected field to the report table.
 * @param context
 * @param requestedColumn
 * @param addBefore
 */
export const addColumnFromExistingField = (context, requestedColumn, addBefore) => {
    return event(context, types.ADD_COLUMN_FROM_EXISTING_FIELD, {requestedColumn, addBefore});
};

/**
 * Hide a column based on the column id given.
 * @param context
 * @param clickedId
 */
export const hideColumn = (context, clickedId) => {
    return event(context, types.HIDE_COLUMN, {clickedId});
};

export const moveColumn = (context, params) => {
    return event(context, types.MOVE_COLUMN, params);
};
