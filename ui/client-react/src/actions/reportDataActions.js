// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
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

    }
};

export default reportDataActions;
