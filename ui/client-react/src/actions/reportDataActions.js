/**
 * Any actions related to Report model are defined here. This is responsible for making calls to Node layer api based on the action.
 */
import * as actions from '../constants/actions';
import * as query from '../constants/query';
import * as schemaConsts from '../constants/schema.js';
import ReportService from '../services/reportService';
import RecordService from '../services/recordService';
import Logger from '../utils/logger';
import Promise from 'bluebird';
import QueryUtils from '../utils/queryUtils';

let logger = new Logger();

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
                        var report = {
                            name: response[0].data.name,
                            data: response[1].data
                        };
                        logger.debug("Report Name: " + report.name);
                        this.dispatch(actions.LOAD_REPORT_SUCCESS, report);
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
    filterReport(appId, tblId, rptId, format, searchString, selections) {

        function getFilterParam(search, selected) {
            /*eslint-disable */
            console.log('get filter param',search,selected);
            /*eslint-enable*/
            let fields = selected.whichHasAnySelections();
            let facetExpression = fields.map(field => {
                let values = selected.getFieldSelections(field);
                // use 1 or 0 for searching bool field types not the text
                if (fields[field].type === schemaConsts.CHECKBOX) {
                    var boolVal = values[0] === "Yes" ? 1 : 0;
                    values = [boolVal];
                }
                return {fid : field, values: values};
            });
            return {
                selections: selected,
                facet : facetExpression,
                search : search
            };
        }

        const filter = getFilterParam(searchString, selections);

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

                // parse the facet into query language
                let facetExpression = filter ? filter.facet : '';
                promises.push(reportService.parseFacetExpression(facetExpression));

                Promise.all(promises).then(
                    function(response) {
                        var queryParams = {
                            cList: response[0].data.fids ? response[0].data.fids.join('.') : '',
                            sList: response[0].data.sortFids ? response[0].data.sortFids.join('.') : ''
                        };

                        //  Concatenate facet expression(if any) and search filter(if any) into single
                        //  query expression where each individual expression is 'AND'ed with the other.
                        //
                        //  To optimize query performance, order the array elements 1..n in order of
                        //  significance/most targeted selection as the outputted query is built starting
                        //  at offset 0.
                        let filterQueries = [];
                        filterQueries.push(response[0].data.query);
                        filterQueries.push(response[1].data);

                        let searchExpression = filter ? filter.search : '';
                        filterQueries.push(QueryUtils.parseStringIntoAllFieldsContainsExpression(searchExpression));
                        queryParams.query = QueryUtils.concatQueries(filterQueries);

                        //  Get the filtered records
                        recordService.getRecords(appId, tblId, format, queryParams).then(
                            function(recordResponse) {
                                logger.debug('Filter Report Records service call successful');
                                this.dispatch(actions.LOAD_RECORDS_SUCCESS, recordResponse.data);
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
