// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
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

let reportActions = {

    loadReports: function(appId, tblId) {

        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                this.dispatch(actions.LOAD_REPORTS);
                let reportService = new ReportService();

                reportService.getReports(appId, tblId).then(
                    (response) => {
                        logger.debug('ReportService getReports success:' + JSON.stringify(response));
                        this.dispatch(actions.LOAD_REPORTS_SUCCESS, {appId, tblId, data: response.data});
                        resolve();
                    },
                    (error) => {
                        logger.debug('ReportService getReports error:' + JSON.stringify(error));
                        this.dispatch(actions.LOAD_REPORTS_FAILED);
                        reject();
                    }
                ).catch((ex) => {
                    logger.debug('ReportService getReports exception:' + JSON.stringify(ex));
                    this.dispatch(actions.LOAD_REPORTS_FAILED);
                    reject();
                });
            } else {
                logger.error('Missing required input parameters for reportService.getReports.');
                this.dispatch(actions.LOAD_REPORTS_FAILED);
                reject();
            }
        });
    }
};

export default reportActions;
