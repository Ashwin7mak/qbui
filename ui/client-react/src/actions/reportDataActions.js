// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
import Logger from '../utils/logger';

let logger = new Logger();

let reportService = new ReportService();

let reportDataActions = {

    loadReport: function(report) {

        this.dispatch(actions.LOAD_REPORT, report.rptId);

        if (report.appId && report.tblId && report.rptId) {
            reportService.getReportResults(report.appId, report.tblId, report.rptId, true).
                then(
                function(response) {

                    logger.debug('success:' + response);
                    this.dispatch(actions.LOAD_REPORT_SUCCESS,response.data);
                }.bind(this),
                function(error) {
                    logger.debug('error:' + error);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                }.bind(this))
                .catch(
                function(ex) {
                    logger.debug('exception:' + ex);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                }.bind(this)
            );
        }

    }
};

export default reportDataActions