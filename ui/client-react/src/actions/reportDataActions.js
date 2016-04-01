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

let logger = new Logger();

// TODO: change this to enable/disable grouped view on report
const GROUPING_ON = false;

//  Model object referenced by UI layer for presentation of a report.
//  TODO: initial implementation...still in progress..
let reportModel = {
    //  build a report model object that is used by the front-end to render a report
    set: function(reportMeta, reportData) {
        var obj = {};

        if (reportMeta && reportMeta.data) {
            //  make available to the client the meta data that we think is necessary
            obj.name = reportMeta.data.name;

            //TODO: pull this from the real report meta data
            obj.hasGrouping = GROUPING_ON;
            //  TODO: not sure if sortList/grouping and summary info is needed OR if needed,
            //  TODO: that it is organized in the best way...
            //obj.sortList = reportMeta.data.sortList;
            //obj.summary = reportMeta.data.summary;
        }

        if (reportData) {
            //TODO: pull this from the real report meta data
            reportData.data.hasGrouping = GROUPING_ON;
            obj.data = reportData.data;
            //  TODO: not sure if this is how report summary information will be made available to the client
            //obj.summary = reportData.summary;
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

    loadReport(appId, tblId, rptId, format) {

        //  promise is returned in support of unit testing only
        return new Promise(function(resolve, reject) {

            if (appId && tblId && rptId) {
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId});
                let reportService = new ReportService();

                //  query for the report meta data, report results and report facets
                var promises = [];
                promises.push(reportService.getReport(appId, tblId, rptId));
                promises.push(reportService.getReportDataAndFacets(appId, tblId, rptId, format));

                Promise.all(promises).then(
                    function(response) {
                        logger.debug('Report service call successful');
                        var model = reportModel.set(response[0], response[1]);
                        this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                        resolve();
                    }.bind(this),
                    function(error) {
                        logger.error('Report service call error:' + JSON.stringify(error));
                        this.dispatch(actions.LOAD_REPORT_FAILED, {error: error});
                        reject();
                    }.bind(this)
                ).catch(
                    function(ex) {
                        logger.error('Report service call exception:', ex);
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

    /* Action called to filter a report.
     *
     *  Supported filtering options include:
     *       facet  : expression representing all the facets selected by user so far example [{fid: fid1, values: value1, value2}, {fid: fid2, values: value3, value4}, ..]
     *       search : search string
     */
    filterReport(appId, tblId, rptId, format, filter) {

        //  Build list of fids that is sent to the server as a part of the query parameters
        function getReportSortFids(reportMetaData) {
            let fids = [];

            if (reportMetaData.data.sortList) {
                reportMetaData.data.sortList.forEach(function(sort) {
                    if (sort) {
                        //var sortEl = sort.split(':');
                        //  split guarentees at least 1 array element returned
                        //fids.push(sortEl[0]);
                        fids.push(sort);
                    }
                });
            }
            return fids ? fids.join('.') : '';
        }

        //  Build the request query parameters needed to properly filter the report request.  Information
        //  that could be sent include fid list, sort list and query parameters
        function buildRequestQuery(reportMetaData, facetQueryExpression, searchExpression) {
            var queryParams = {};

            if (reportMetaData && reportMetaData.data) {
                queryParams.cList = reportMetaData.data.fids ? reportMetaData.data.fids.join('.') : '';
                queryParams.sList = getReportSortFids(reportMetaData);
                //  TODO: pass grouping and summary information with the query


                //  Concatenate facet expression(if any) and search filter(if any) into single
                //  query expression where each individual expression is 'AND'ed with the other.
                //
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
                queryParams.query = QueryUtils.concatQueries(filterQueries);
            }

            return queryParams;
        }

        //  promise is returned in support of unit testing only
        return new Promise(function(resolve, reject) {

            if (appId && tblId && rptId) {
                this.dispatch(actions.LOAD_RECORDS, {appId, tblId, rptId, filter});

                let reportService = new ReportService();
                let recordService = new RecordService();

                // Fetch the report meta data and parse the facet expression into a query expression
                // that is used when querying for the report data.
                var promises = [];
                promises.push(reportService.getReport(appId, tblId, rptId));

                // The filter parameter may contain a searchExpression and facetExpression
                let searchExpression = filter ? filter.search : '';
                let facetExpression = filter ? filter.facet : '';
                promises.push(reportService.parseFacetExpression(facetExpression));

                Promise.all(promises).then(
                    function(response) {
                        var queryParams = buildRequestQuery(response[0], response[1], searchExpression);

                        //  Get the filtered records
                        recordService.getRecords(appId, tblId, format, queryParams).then(
                            function(recordResponse) {
                                recordResponse.data.hasGrouping = GROUPING_ON; //TODO: pull this from the real report meta data
                                logger.debug('Filter Report Records service call successful');
                                var model = reportModel.set(null, recordResponse);
                                this.dispatch(actions.LOAD_RECORDS_SUCCESS, model);
                                resolve();
                            }.bind(this),
                            function(error) {
                                logger.error('Filter Report Records service call error:', JSON.stringify(error));
                                this.dispatch(actions.LOAD_RECORDS_FAILED, {error: error});
                                reject();
                            }.bind(this)
                        ).catch(
                            function(ex) {
                                logger.error('Filter Report Records service call exception:', ex);
                                this.dispatch(actions.LOAD_RECORDS_FAILED, {error: ex});
                                reject();
                            }.bind(this)
                        );
                    }.bind(this),
                    function(error) {
                        logger.error('Filter Report service call error:', error);
                        this.dispatch(actions.LOAD_RECORDS_FAILED, {error: error});
                        reject();
                    }.bind(this)
                ).catch(
                    function(ex) {
                        logger.error('Filter Report service calls exception:', ex);
                        this.dispatch(actions.LOAD_RECORDS_FAILED, {exception: ex});
                        reject();
                    }.bind(this)
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to reportDataActions.filterReport. AppId:' +
                    appId + '; TblId:' + tblId + '; RptId:' + rptId;
                logger.error(errMessage);
                this.dispatch(actions.LOAD_RECORDS_FAILED, {error: errMessage});
                reject();
            }
        }.bind(this));
    }
};

export default reportDataActions;
