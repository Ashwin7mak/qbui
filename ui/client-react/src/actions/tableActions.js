// action creators
import * as actions from '../constants/actions';
import TableService from '../services/tableService';
import Promise from 'bluebird';
import reportModel from '../models/reportModel';

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

let tableActions = {

    loadTableHomePage: function(appId, tblId) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                let tableService = new TableService();
                tableService.getHomePage(appId, tblId).then(
                    (response) => {
                        this.dispatch(actions.LOAD_REPORT, {appId, tblId, "rptId": response.data.reportMetadata.data.id.toString()});
                        var model = reportModel.set(response.data.reportMetadata, response.data.reportData);
                        this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                        resolve();
                    },
                    (error) => {
                        logger.debug('TableService getHomePage error:' + JSON.stringify(error));
                        this.dispatch(actions.LOAD_REPORT_FAILED, {error: error});
                        reject();
                    }
                ).catch((ex) => {
                    logger.debug('TableService getHomePage exception:' + JSON.stringify(ex));
                    this.dispatch(actions.LOAD_REPORT_FAILED, {exception: ex});
                    reject();
                });
            } else {
                logger.error('Missing required input parameters for tableService.getHomePage.');
                this.dispatch(actions.LOAD_REPORT_FAILED);
                reject();
            }
        });
    }
};

export default tableActions;
