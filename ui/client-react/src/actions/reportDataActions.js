// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
import Logger from '../utils/logger';
import Promise from 'bluebird';

let logger = new Logger();

let reportService = new ReportService();

let reportDataActions = {

    loadReport: function(report) {

        if (report.appId && report.tblId && report.rptId) {
            this.dispatch(actions.LOAD_REPORT, report.rptId);

            var promises = [];
            promises.push(reportService.getReport(report.appId, report.tblId, report.rptId));
            promises.push(reportService.getReportResults(report.appId, report.tblId, report.rptId, true));

            Promise.all(promises).then(
                function(response) {
                    logger.debug('Report service calls successful');
                    var report = {
                        name:response[0].data.name,
                        data:response[1].data
                    };
                    this.dispatch(actions.LOAD_REPORT_SUCCESS,report);
                }.bind(this),
                function(error) {
                    logger.debug('Report service calls error:' + error);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                }.bind(this))
                .catch(
                function(ex) {
                    logger.debug('Report service calls exception:' + ex);
                    this.dispatch(actions.LOAD_REPORT_FAILED);
                }.bind(this)
            );
        }

    }
};

export default reportDataActions