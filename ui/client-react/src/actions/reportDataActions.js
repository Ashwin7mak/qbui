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

// TODO: change this to enable/disable grouped view on report
const GROUPING_ON = false;

//  Model object referenced by UI layer for presentation of a report.
//  TODO: initial implementation...still in progress..
let reportModel = {
    //  build a report model object that is used by the front-end to render a report
    set: function(reportMeta, reportData) {
        var obj = {
            metaData: {},
            recordData: {}
        };

        if (reportMeta && reportMeta.data) {
            //  make available to the client the meta data that we think is necessary
            obj.metaData = reportMeta.data;

            ////TODO: pull this from the real report meta data
            obj.metaData.hasGrouping = GROUPING_ON;
            ////  TODO: not sure if sortList/grouping and summary info is needed OR if needed,
            ////  TODO: that it is organized in the best way...
            ////obj.sortList = reportMeta.data.sortList;
            ////obj.summary = reportMeta.data.summary;
        }

        if (reportData && reportData.data) {
            obj.recordData = reportData.data;
        }

        return obj;
    }
};

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

    loadReport(appId, tblId, rptId, format, offset, rows) {

        //  promise is returned in support of unit testing only
        return new Promise(function(resolve, reject) {

            if (appId && tblId && rptId) {
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId});
                let reportService = new ReportService();

                //  query for the report meta data
                reportService.getReport(appId, tblId, rptId).then(
                    (reportMetaData) => {
                        var queryParams = {};

                        //  Optional parameter used by the Node layer to return the result set in grouping order for
                        //  easier client rendering of the result set.  The input sortList is a string array of
                        //  fids/grouptype, delimited by ':'.  The groupList parameter converts the array
                        //  into a string, with each individual entry separated by a '.' and included on the request
                        //  as a query parameter.  Example:
                        //
                        //      sortList: ['2', '1:V', '33:C']
                        //      glist: '2.1:V.33:C'
                        //
                        if (reportMetaData.data) {
                            queryParams[query.GLIST_PARAM] = reportMetaData.data.sortList ? reportMetaData.data.sortList.join('.') : '';
                        } else {
                            queryParams[query.GLIST_PARAM] = '';
                        }

                        //  Node query parameters which are all optional and could be null/undefined
                        queryParams[query.FORMAT_PARAM] = format;
                        queryParams[query.OFFSET_PARAM] = offset;
                        queryParams[query.NUMROWS_PARAM] = rows;

                        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams).then(
                            function(reportData) {
                                logger.debug('ReportDataAndFacets service call successful');
                                var model = reportModel.set(reportMetaData, reportData);
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

    /* Action called to get a new set of records given a report.
     * Override params can override report's sortlist/query etc
     *
     * Extended filter criteria can be attached to the query -
     *  Supported filtering options include:
     *       facet  : expression representing all the facets selected by user so far example [{fid: fid1, values: value1, value2}, {fid: fid2, values: value3, value4}, ..]
     *       search : search string
     */

    getFilteredRecords(appId, tblId, rptId, format, filter, overrideQueryParams) {

        //  Build list of fids that is sent to the server to fulfill report sorting requirements
        //  The input sortList is a string array of fids/grouptype, delimited by ':'. Will extract
        //  out the fids and return as a string, with each fid separated by a '.'
        function getReportSortFids(reportMetaData) {
            //TODO: Replace this with reportutils. Not sure why we are doing this.
            let fids = [];
            if (reportMetaData.data.sortList) {
                reportMetaData.data.sortList.forEach(function(sort) {
                    if (sort) {
                        var sortEl = sort.split(':');
                        fids.push(sortEl[0]);
                    }
                });
            }
            return fids ? fids.join('.') : '';
        }

        //  Build the request query parameters needed to properly filter the report request based on the report
        //  meta data.  Information that could be sent include fid list, sort list, grouping and query parameters
        function buildRequestQuery(reportMetaData, facetQueryExpression, searchExpression) {
            var queryParams = {};

            if (reportMetaData && reportMetaData.data) {

                if (overrideQueryParams && overrideQueryParams[query.COLUMNS_PARAM]) {
                    queryParams[query.COLUMNS_PARAM] = overrideQueryParams[query.COLUMNS_PARAM];
                } else {
                    queryParams[query.COLUMNS_PARAM] = ReportUtils.getSortListString(reportMetaData.data.fids);
                }
                if (overrideQueryParams && overrideQueryParams[query.SORT_LIST_PARAM]) {
                    queryParams[query.SORT_LIST_PARAM] = overrideQueryParams[query.SORT_LIST_PARAM];
                } else {
                    queryParams[query.SORT_LIST_PARAM] = getReportSortFids(reportMetaData);
                }

                //  Optional parameter used by the Node layer to return the result set in grouping order for
                //  easier client rendering of the result set.  The input sortList is a string array of
                //  fids/grouptype, delimited by ':'.  The groupList parameter converts the array
                //  into a string, with each individual entry separated by a '.' and included on the request
                //  as a query parameter.  Example:
                //
                //      sortList: ['2', '1:V', '33:C']
                //      glist: '2.1:V.33:C'
                //
                queryParams[query.GLIST_PARAM] = reportMetaData.data.sortList ? reportMetaData.data.sortList.join('.') : '';

                if (overrideQueryParams && overrideQueryParams[query.OFFSET_PARAM]) {
                    queryParams[query.OFFSET_PARAM] = overrideQueryParams[query.OFFSET_PARAM];
                }
                if (overrideQueryParams && overrideQueryParams[query.NUMROWS_PARAM]) {
                    queryParams[query.NUMROWS_PARAM] = overrideQueryParams[query.NUMROWS_PARAM];
                }


                if (overrideQueryParams && overrideQueryParams[query.QUERY_PARAM]) {
                    queryParams[query.QUERY_PARAM] = overrideQueryParams[query.QUERY_PARAM];
                } else {
                    //  Concatenate facet expression(if any) and search filter(if any) into single
                    //  query expression where each individual expression is 'AND'ed with the other.
                    //  To optimize query performance, order the array elements 1..n in order of
                    //  significance/most targeted selection as the outputted query is built starting
                    //  at offset 0.
                    let filterQueries = [];
                    if (reportMetaData.data.query) {
                        filterQueries.push(reportMetaData.data.query);
                    }
                    if (facetQueryExpression) {
                        filterQueries.push(facetQueryExpression.data);
                    }
                    if (searchExpression) {
                        filterQueries.push(QueryUtils.parseStringIntoAllFieldsContainsExpression(searchExpression));
                    }
                    queryParams[query.QUERY_PARAM] = QueryUtils.concatQueries(filterQueries);
                }
            }

            return queryParams;
        }

        //  promise is returned in support of unit testing only
        return new Promise(function(resolve, reject) {

            if (appId && tblId && rptId) {
                let sortListParam = overrideQueryParams && overrideQueryParams[query.SORT_LIST_PARAM] ? overrideQueryParams[query.SORT_LIST_PARAM] : "";
                this.dispatch(actions.LOAD_RECORDS, {appId, tblId, rptId, filter, sortList: sortListParam});

                let reportService = new ReportService();
                let recordService = new RecordService();

                // Fetch the report meta data and parse the facet expression into a query expression
                // that is used when querying for the report data.
                var promises = [];
                promises.push(reportService.getReport(appId, tblId, rptId));

                // The filter parameter may contain a searchExpression and facetExpression
                let searchExpression = filter && filter.search ? filter.search : '';
                let facetExpression = filter && filter.facet ? filter.facet : '';
                if (facetExpression !== '' && facetExpression.length) {
                    promises.push(reportService.parseFacetExpression(facetExpression));
                }

                Promise.all(promises).then(
                    (response) => {
                        var queryParams = buildRequestQuery(response[0], response[1], searchExpression);

                        //  parameters which are all optional and could be null/undefined
                        queryParams[query.FORMAT_PARAM] = format;

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
