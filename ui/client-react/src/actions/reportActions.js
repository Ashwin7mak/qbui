// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
import Logger from '../utils/logger';

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
        if (report.appId && report.tblId) {
            let reportService = new ReportService();

            this.dispatch(actions.LOAD_REPORTS, report);
            reportService.getReports(report.appId, report.tblId).
                then(
                (response) => {
                    logger.debug('success:' + response);
                    this.dispatch(actions.LOAD_REPORTS_SUCCESS, {appId: report.appId, tblId:report.tblId, data: response.data});
                },
                (error) => {
                    logger.debug('error:' + error);
                    this.dispatch(actions.LOAD_REPORTS_FAILED);
                })
                .catch(
                (ex) => {
                    logger.debug('exception:' + ex);
                    this.dispatch(actions.LOAD_REPORTS_FAILED);
                }
            );
        }


    }
};

export default reportActions