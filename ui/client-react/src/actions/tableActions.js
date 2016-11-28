// action creators
import * as actions from '../constants/actions';
import TableService from '../services/tableService';
import Promise from 'bluebird';
import reportModel from '../models/reportModel';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

const DEFAULT_HOMEPAGE_ID = '0';

let tableActions = {

    /**
     * Fetch the table home page report
     *
     * @param appId
     * @param tblId
     * @param offset
     * @param numRows
     */
    loadTableHomePage: function(appId, tblId, offset, numRows) {

        let logger = new Logger();

        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                let tableService = new TableService();

                //  even though we don't yet know the home page report id, want a spinner to display,
                //  so dispatch the LOAD_REPORT event.
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId:DEFAULT_HOMEPAGE_ID, offset, numRows});

                //  Fetch the home page.  The response will include:
                //    - report data/grouping data
                //    - report meta data
                //    - report fields
                //    - report facets
                //    - report count
                tableService.getHomePage(appId, tblId, offset, numRows).then(
                    (response) => {
                        let metaData = response.data ? response.data.metaData : null;
                        let model = reportModel.set(metaData, response.data);

                        //  if the report id does not match the default homepage id, re-init the load report
                        //  event to ensure the reportId is set in the store.
                        if (model.rptId !== DEFAULT_HOMEPAGE_ID) {
                            this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId: model.rptId, offset, numRows});
                        }

                        this.dispatch(actions.LOAD_REPORT_SUCCESS, model);
                        resolve();
                    },
                    (error) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'tableService.getHomePage:');
                        this.dispatch(actions.LOAD_REPORT_FAILED, error);
                        reject();
                    }
                ).catch((ex) => {
                    // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                    logger.logException(ex);
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
