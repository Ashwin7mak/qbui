// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
import Logger from '../utils/logger';
import Promise from 'bluebird';

let logger = new Logger();

let reportActions = {


    loadReports: function(appId, tblId) {

        let deferred = Promise.defer();

        if (appId && tblId) {
            let reportService = new ReportService();

            this.dispatch(actions.LOAD_REPORTS);

            reportService.getReports(appId, tblId).
                then(
                (response) => {
                    logger.debug('ReportService getReports success:' + JSON.stringify(response));
                    this.dispatch(actions.LOAD_REPORTS_SUCCESS, {appId, tblId, data: response.data});
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

export default reportActions;
