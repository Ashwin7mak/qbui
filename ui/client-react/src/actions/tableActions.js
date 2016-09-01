// action creators
import * as actions from '../constants/actions';
import TableService from '../services/tableService';
import ReportService from '../services/reportService';
import Promise from 'bluebird';
import reportModel from '../models/reportModel';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

let logger = new Logger();

//  Custom handling of 'possible unhandled rejection' error,  because we don't want
//  to see an exception in the console output.  The exception is thrown by bluebird
//  because the core application code has no logic implemented to handle a rejected
//  promise.  This is expected as promises are NOT implemented in the application
//  code.  Promises are returned only to support our unit tests, which are expected
//  to implement the appropriate handlers.
Promise.onPossiblyUnhandledRejection(function(err) {
    logger.debug('Bluebird Unhandled rejection', err);
});

let tableActions = {

    loadTableHomePage: function(appId, tblId) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                let tableService = new TableService();
                let reportService = new ReportService();

                tableService.getHomePage(appId, tblId).then(
                    (response) => {
                        var model = reportModel.set(response.data.reportMetaData, response.data.reportData);
                        reportService.getReportRecordsCount(appId, tblId, model.rptId).then(
                            response1 => {
                                if (response1.data) {
                                    logger.debug('ReportRecordsCount service call successful');
                                    this.dispatch(actions.LOAD_REPORT_RECORDS_COUNT_SUCCESS, response1.data);
                                    resolve();
                                }
                            },
                            error1 => {
                                logger.parseAndLogError(LogLevel.ERROR, error1, 'reportService.getReportRecordsCount:');
                                this.dispatch(actions.LOAD_REPORT_RECORDS_COUNT_FAILED, error1.response.status);
                                reject();
                            }
                        ).catch(ex => {
                            logger.logException(ex);
                            this.dispatch(actions.LOAD_REPORT_RECORDS_COUNT_FAILED, 500);
                            reject();
                        });

                        //  not waiting for the records count..fire off the load report events
                        this.dispatch(actions.LOAD_REPORT, {appId, tblId, "rptId": model.rptId});
                        this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                    },
                    (error) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'tableService.getHomePage:');
                        this.dispatch(actions.LOAD_REPORT_FAILED, error.response.status);
                        reject();
                    }
                ).catch((ex) => {
                    logger.logException(ex);
                    this.dispatch(actions.LOAD_REPORT_FAILED, 500);
                    reject();
                });
            } else {
                logger.error('tableService.getHomePage: Missing required input parameters');
                this.dispatch(actions.LOAD_REPORT_FAILED, 500);
                reject();
            }
        });
    }
};

export default tableActions;
