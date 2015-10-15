// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
import Logger from '../utils/logger';
import Promise from 'bluebird';

let logger = new Logger();

let reportActions = {
    //
    // uncomment when action is implemented..
    //
    //addReport: function(report){
    //    this.dispatch('ADD_REPORT', report);
    //},
    //removeReport: function(index){
    //    this.dispatch('REMOVE_REPORT', index);
    //},
    loadReports: function(report) {

        let deferred = Promise.defer();

        if (report.appId && report.tblId) {
            let reportService = new ReportService();

            this.dispatch(actions.LOAD_REPORTS);

            reportService.getReports(report.appId, report.tblId).
                then(
                (response) => {
                    logger.debug('ReportService getReports success:' + JSON.stringify(response));
                    this.dispatch(actions.LOAD_REPORTS_SUCCESS, {appId: report.appId, tblId:report.tblId, data: response.data});
                    deferred.resolve(response);
                },
                (error) => {
                    logger.debug('ReportService getReports error:' + JSON.stringify(error));
                    this.dispatch(actions.LOAD_REPORTS_FAILED);
                    deferred.reject(error);
                })
                .catch(
                (ex) => {
                    logger.debug('ReportService getReports exception:' + JSON.stringify(ex));
                    this.dispatch(actions.LOAD_REPORTS_FAILED);
                    deferred.reject(ex);
                }
            );
        } else {
            logger.warn('Missing required input parameters for reportService.getReports.');
            //  todo: need consistent return object for reject..here and above..
            deferred.reject('Missing input parameters');
        }

        return deferred.promise;

    }
};

export default reportActions