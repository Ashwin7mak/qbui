// action creators
import * as actions from '../constants/actions';
import * as query from '../constants/query';
import ReportService from '../services/reportService';
import RecordService from '../services/recordService';
import Logger from '../utils/logger';
import Promise from 'bluebird';

let logger = new Logger();

let reportDataActions = {

    loadReport: function(appId, tblId, rptId, format) {

        let deferred = Promise.defer();

        if (appId && tblId && rptId) {
            let reportService = new ReportService();

            this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId});

            var promises = [];
            promises.push(reportService.getReport(appId, tblId, rptId));
            promises.push(reportService.getReportResults(appId, tblId, rptId, format));

            Promise.all(promises).then(
                function(response) {
                    logger.debug('Report service calls successful');
                    var report = {
                        name:response[0].data.name,
                        data:response[1].data
                    };
                    this.dispatch(actions.LOAD_REPORT_SUCCESS, report);
                    deferred.resolve(report);
                }.bind(this),
                function(error) {
                    logger.error('Report service calls error:' + error);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                    deferred.reject(error);
                }.bind(this))
                .catch(
                function(ex) {
                    logger.error('Report service calls exception:' + ex);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                    deferred.reject(ex);
                }.bind(this)
            );
        } else {
            logger.error('Missing required input parameters to reportDataActions.loadReport');
            deferred.reject('error');
        }

        return deferred.promise;

    },

    /* Action call to filter a report when a facet is selected.
    * TODO: This needs to be extended to accept a facetExpression that's built on client side.
    * For now use a hard-coded facet expression for the sake of setting up node end point.
    * facetexpression parameter- expression representing all the facets selected by user so far example [{fid: fid1, values: value1, value2}, {fid: fid2, values: value3, value4}, ..]
    */
    filterReport: function(appId, tblId, rptId, format, facetExpression) {
        let deferred = Promise.defer();

        if (appId && tblId && rptId && facetExpression) {
            let reportService = new ReportService();
            let recordService = new RecordService();
            this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId});
            var promises = [];
            //1st call get report meta data. TODO: can we skip this somehow, do we store meta data somewhere that we could re-use?
            promises.push(reportService.getReport(appId, tblId, rptId));
            // 2nd call to node server resolves facet expression to a query expression.
            promises.push(reportService.resolveFacetExpression(facetExpression));
            Promise.all(promises).then(
                function(response) {
                    var queryString = response[1].data;

                    if (queryString) {
                        //TODO: Add the rest of query params like numRows, offset
                        var report = {
                            name: response[0].data.name,
                            query: response[0].data.query,
                            columns: response[0].data.fids ? response[0].data.fids.join(",") : "",
                            sortList: response[0].data.sortFids ? response[0].data.sortFids.join(",") : ""
                        };

                        var mergedQueryString = "";
                        if (report.query) {
                            mergedQueryString = report.query;
                            if (queryString) {
                                mergedQueryString +=  query.QUERY_AND + queryString;
                            }
                        } else if (queryString) {
                            mergedQueryString = queryString;
                        }
                        report.query = mergedQueryString;

                        //3rd call to get filtered records based off of the updated query string
                        recordService.getRecords(appId, tblId, format, report).then(
                            function(recordresponse) {
                                logger.debug('Records service calls successful');
                                this.dispatch(actions.LOAD_RECORDS_SUCCESS, recordresponse.data);
                                deferred.resolve(recordresponse.data);
                                deferred.resolve(recordresponse.data);
                            }.bind(this),
                            function(error) {
                                logger.error('Records service calls error:' + error);
                                this.dispatch(actions.LOAD_RECORDS_FAILED);
                                deferred.reject(error);
                            }.bind(this))
                            .catch(
                            function(ex) {
                                logger.error('Records service calls exception:' + ex);
                                this.dispatch(actions.LOAD_RECORDS_FAILED);
                                deferred.reject(ex);
                            }.bind(this)
                        );
                    } else {
                        logger.error('Error resolving facet expression to a query.');
                        deferred.reject('error');
                    }
                }.bind(this),
                function(error) {
                    logger.error('Report service calls error:' + error);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                    deferred.reject(error);
                }.bind(this))
                .catch(
                function(ex) {
                    logger.error('Report service calls exception:' + ex);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                    deferred.reject(ex);
                }.bind(this)
            );
        } else {
            logger.error('Missing required input parameters to reportDataActions.filterReport');
            deferred.reject('error');
        }

        return deferred.promise;

    }
};

export default reportDataActions;
