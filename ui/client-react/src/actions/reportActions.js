// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

let reportActions = {

    /**
     * Retrieve a list of reports for the given app/table.  This function is called primarily when
     * populating the left hand navigation window with the list of reports and when displaying a
     * trowser window that displays all of the reports for a table.
     *
     * @param appId
     * @param tblId
     */
    loadReports(appId, tblId) {

        let logger = new Logger();

        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                logger.debug('Loading report list for appId:' + appId + '; tableId:' + tblId);

                this.dispatch(actions.LOAD_REPORTS);
                let reportService = new ReportService();

                reportService.getReports(appId, tblId).then(
                    (response) => {
                        logger.debug('ReportService getReports success');
                        this.dispatch(actions.LOAD_REPORTS_SUCCESS, {appId, tblId, data: response.data});
                        resolve();
                    },
                    (error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'reportService.getReports:');
                        this.dispatch(actions.LOAD_REPORTS_FAILED, error.response.status);
                        reject();
                    }
                ).catch((ex) => {
                    // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                    logger.logException(ex);
                    reject();
                });
            } else {
                logger.error('reportService.getReports: Missing required input parameters.');
                this.dispatch(actions.LOAD_REPORTS_FAILED, 500);
                reject();
            }
        });
    }

};

export default reportActions;
