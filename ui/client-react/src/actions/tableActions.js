// action creators
import * as actions from '../constants/actions';
import TableService from '../services/tableService';
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

const DEFAULT_HOMEPAGE_ID = '0';

let tableActions = {

    /**
     * Fetch the table home page report and total record count for the report
     * @param appId
     * @param tblId
     * @param offset
     * @param numRows
     */
    loadTableHomePage: function(appId, tblId, offset, numRows) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                let tableService = new TableService();

                //  even though we don't yet know the home page report id, want a spinner to display,
                //  so dispatch the LOAD_REPORT event.
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId:DEFAULT_HOMEPAGE_ID});

                //  Fetch the home page.  The response will include the report data, report fields
                //  and record count.
                tableService.getHomePage(appId, tblId, offset, numRows).then(
                    (response) => {
                        var model = reportModel.set(response.data.reportMetaData, response.data.reportData);

                        //  now that we know the report id, re-init the load report event to
                        //  ensure the reportId is set in the store.
                        if (model.rptId !== DEFAULT_HOMEPAGE_ID) {
                            this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId: model.rptId});
                        }

                        //  ..fire off the load report and record count events
                        this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                        this.dispatch(actions.LOAD_REPORT_RECORDS_COUNT_SUCCESS, {body: model.recordData.filteredCount});
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
