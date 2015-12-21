// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
import RecordService from '../services/recordService';
import Logger from '../utils/logger';
import Promise from 'bluebird';

let logger = new Logger();

let reportDataActions = {

    loadReport_1: function(appId, tblId, rptId, format) {

        let deferred = Promise.defer();

        logger.debug("logging report call data " + appId + ":" + tblId + ":" + rptId);
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

    loadReport_2: function(appId, tblId, rptId, format) {

        let deferred = Promise.defer();
        logger.debug("logging record call data " + appId + ":" + tblId + ":" + rptId);
        if (appId && tblId && rptId) {
            let reportService = new ReportService();
            let recordService = new RecordService();

            this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId});

            logger.debug('1');
            var promises = [];

            var facetExpression = [];
            facetExpression.push({fid:'3', values:['10', '11']}, {fid:'4', values:['abc']});

            promises.push(reportService.getReport(appId, tblId, rptId));
            promises.push(reportService.resolveFacetExpression(facetExpression));
            Promise.all(promises).then(
                function(response) {
                    logger.debug('Report2 service calls successful');

                    var report = {
                        name: response[0].data.name,
                        query: response[0].data.query,
                        clist: response[0].data.clist,
                        slist: response[0].data.slist
                    };

                    var queryString = response[1].data;
                    console.log("queryString: " + queryString);

                    promises = [];

                    promises.push(recordService.filterReport(appId, tblId, rptId, format, report, queryString));
                    logger.debug('4');
                    Promise.all(promises).then(
                        function(recordresponse) {
                            logger.debug('Records service calls successful');
                            console.log(recordresponse);
                            report.data = recordresponse[0].data;
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

    }
};

export default reportDataActions;
