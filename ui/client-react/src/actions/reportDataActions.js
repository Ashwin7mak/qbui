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

let reportDataActions = {

    loadReport: function(appId, tblId, rptId, format) {

        //  promise is returned in support of unit testing only
        return new Promise(function(resolve, reject) {

            if (appId && tblId && rptId) {
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId});
                let reportService = new ReportService();

                //  query for the report meta data, report results and report facets
                var promises = [];
                promises.push(reportService.getReport(appId, tblId, rptId));
                promises.push(reportService.getReportResults(appId, tblId, rptId, format));
                promises.push(reportService.getReportFacets(appId, tblId, rptId));

                Promise.all(promises).then(
                    function(response) {
                        logger.debug('Report service call successful');
                        var report = {
                            name: response[0].data.name,
                            data: response[1].data,
                            facets: response[2].data
                        };

                        logger.debug("Report Name: " + report.name);
                        logger.debug("Report Facets: " + JSON.stringify(report.facets));

                        this.dispatch(actions.LOAD_REPORT_SUCCESS, report);
                        resolve();
                    }.bind(this),
                    function(error) {
                        logger.error('Report service call error:' + JSON.stringify(error));
                        this.dispatch(actions.LOAD_REPORT_FAILED);
                        reject();
                    }.bind(this)
                ).catch(
                    function(ex) {
                        logger.error('Report service call exception:' + JSON.stringify(ex));
                        this.dispatch(actions.LOAD_REPORT_FAILED);
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
    filterReport: function(appId, tblId, rptId, format, filter) {

        //  promise is returned in support of unit testing only
        return new Promise(function(resolve, reject) {

            if (appId && tblId && rptId) {
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId});

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
                                this.dispatch(actions.LOAD_REPORT_SUCCESS, recordResponse.data);
                                return resolve();
                            }.bind(this),
                            function(error) {
                                logger.error('Filter Report Records service call error:' + JSON.stringify(error));
                                this.dispatch(actions.LOAD_REPORT_FAILED);
                                return reject();
                            }.bind(this)
                        ).catch(
                            function(ex) {
                                logger.error('Filter Report Records service call exception:' + ex);
                                this.dispatch(actions.LOAD_REPORT_FAILED);
                                return reject();
                            }.bind(this)
                        );

                    }.bind(this),
                    function(error) {
                        logger.error('Filter Report service call error:' + JSON.stringify(error));
                        this.dispatch(actions.LOAD_REPORT_FAILED);
                        reject();
                    }.bind(this)
                ).catch(
                    function(ex) {
                        logger.error('Filter Report service calls exception:' + JSON.stringify(ex));
                        this.dispatch(actions.LOAD_REPORT_FAILED);
                        reject();
                    }.bind(this)
                );
            } else {
                logger.error('Missing one or more required input parameters to reportDataActions.filterReport.  AppId:' + appId + '; TblId:' + tblId + '; RptId:' + rptId);
                this.dispatch(actions.LOAD_REPORT_FAILED);
                reject();
            }
        }.bind(this));
    }
};

export default reportDataActions;
