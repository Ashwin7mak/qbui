/**
 * Any actions related to Report model are defined here. This is responsible for making calls to Node layer api based on the action.
 */
import * as actions from '../constants/actions';
import * as query from '../constants/query';
import ReportService from '../services/reportService';
import RecordService from '../services/recordService';
import Logger from '../utils/logger';
import Promise from 'bluebird';
import QueryUtils from '../utils/queryUtils';
import ReportUtils from '../utils/reportUtils';

let logger = new Logger();

//  Report model object used by the client to render a report
let reportModel = {

    set: function(reportMeta, reportData) {
        var obj = {
            metaData: {},
            recordData: {}
        };

        //  make available to the client the report meta data
        if (reportMeta && reportMeta.data) {
            obj.metaData = reportMeta.data;
        }

        //  make available to the client the report grid data
        if (reportData && reportData.data) {
            obj.recordData = reportData.data;
        }

        return obj;
    }
};

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
        return new Promise(function(resolve, reject) {

            if (appId && tblId && rptId) {
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId});
                let reportService = new ReportService();

                //  query for the report meta data
                reportService.getReport(appId, tblId, rptId).then(
                    (reportMetaData) => {
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
                            function(reportData) {
                                logger.debug('ReportDataAndFacets service call successful');
                                var model = reportModel.set(reportMetaData, reportData);
                                _.extend(model, {sortList: sortList});
                                this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                                resolve();
                            }.bind(this),
                            function(error) {
                                logger.error('ReportDataAndFacets service call error:' + JSON.stringify(error));
                                this.dispatch(actions.LOAD_REPORT_FAILED, {error: error});
                                reject();
                            }.bind(this)
                        );
                    },
                    (error) => {
                        logger.error('Report service call error when querying for report meta data:' + JSON.stringify(error));
                        this.dispatch(actions.LOAD_REPORT_FAILED, {error: error});
                        reject();
                    }
                ).catch(
                    function(ex) {
                        logger.error('Unexpected Report service call exception:', ex);
                        this.dispatch(actions.LOAD_REPORT_FAILED, {exception: ex});
                        reject();
                    }.bind(this)
                );
            } else {
                logger.error('Missing one or more required input parameters to reportDataActions.loadReport.  AppId:' + appId + '; TblId:' + tblId + '; RptId:' + rptId);
                this.dispatch(actions.LOAD_REPORT_FAILED);
                reject();
            }
        }.bind(this));
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
     * add a new record (EMPOWER)
     */
    addReportRecord() {
        this.dispatch(actions.ADD_REPORT_RECORD);
    },
    /**
     * delete a record (EMPOWER)
     */
    deleteReportRecord(id) {
        this.dispatch(actions.DELETE_REPORT_RECORD, id);
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
        return new Promise(function(resolve, reject) {

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
                    (response) => {
                        var queryParams = buildRequestQuery(response[0], requiredQueryParams, overrideQueryParams, response[1], filter);

                        //  Get the filtered records
                        recordService.getRecords(appId, tblId, queryParams).then(
                            (recordResponse) => {
                                logger.debug('Filter Report Records service call successful');
                                var model = reportModel.set(null, recordResponse);
                                this.dispatch(actions.LOAD_RECORDS_SUCCESS, model);
                                resolve();
                            },
                            (error) => {
                                logger.error('Filter Report Records service call error:', JSON.stringify(error));
                                this.dispatch(actions.LOAD_RECORDS_FAILED, {error: error});
                                reject();
                            }
                        ).catch(
                            function(ex) {
                                logger.error('Get Filtered Records- Records service call exception:', ex);
                                this.dispatch(actions.LOAD_RECORDS_FAILED, {error: ex});
                                reject();
                            }.bind(this)
                        );
                    },
                    (error) => {
                        logger.error('Filter Report service call error:', error);
                        this.dispatch(actions.LOAD_RECORDS_FAILED, {error: error});
                        reject();
                    }
                ).catch(
                    function(ex) {
                        logger.error('Get Filtered Records- service calls exception:', ex);
                        this.dispatch(actions.LOAD_RECORDS_FAILED, {exception: ex});
                        reject();
                    }.bind(this)
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to reportDataActions.getFilteredRecords. AppId:' +
                    appId + '; TblId:' + tblId + '; RptId:' + rptId;
                logger.error(errMessage);
                this.dispatch(actions.LOAD_RECORDS_FAILED, {error: errMessage});
                reject();
            }
        }.bind(this));
    },
};

export default reportDataActions;
