// action creators
import * as actions from '../constants/actions';
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
                    logger.debug('Report service calls error:' + error);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                    deferred.reject(error);
                }.bind(this))
                .catch(
                function(ex) {
                    logger.debug('Report service calls exception:' + ex);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                    deferred.reject(ex);
                }.bind(this)
            );
        } else {
            logger.warn('Missing required input parameters to reportDataActions.loadReport');
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

        if (appId && tblId && rptId) {
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
                    var report = {
                        name: response[0].data.name,
                        query: response[0].data.query,
                        clist: response[0].data.clist,
                        slist: response[0].data.slist
                    };

                    var mergedQueryString = "";
                    if (report.query){
                        mergedQueryString = report.query;
                        if (queryString) {
                            mergedQueryString += "AND" + queryString;
                        }
                    } else if (queryString) {
                        mergedQueryString = queryString;
                    }
                    report.query = mergedQueryString;

                    promises = [];
                    //3rd call to get filtered records based off of the updated query string
                    promises.push(recordService.getRecords(appId, tblId, format, report));
                    Promise.all(promises).then(
                        function(recordresponse) {
                            logger.debug('Records service calls successful');
                            report.data = recordresponse[0].data;
                            this.dispatch(actions.LOAD_RECORDS_SUCCESS, report);
                            deferred.resolve(report);
                        }.bind(this),
                        function(error) {
                            logger.debug('Records service calls error:' + error);
                            this.dispatch(actions.LOAD_RECORDS_FAILED);
                            deferred.reject(error);
                        }.bind(this))
                        .catch(
                        function(ex) {
                            logger.debug('Records service calls exception:' + ex);
                            this.dispatch(actions.LOAD_RECORDS_FAILED);
                            deferred.reject(ex);
                        }.bind(this)
                    );
                }.bind(this),
                function(error) {
                    logger.debug('Report service calls error:' + error);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                    deferred.reject(error);
                }.bind(this))
                .catch(
                function(ex) {
                    logger.debug('Report service calls exception:' + ex);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                    deferred.reject(ex);
                }.bind(this)
            );
        } else {
            logger.warn('Missing required input parameters to reportDataActions.filterReport');
            deferred.reject('error');
        }

        return deferred.promise;

    }
};

export default reportDataActions;
