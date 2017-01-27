// action creators
import * as actions from '../constants/actions';
import TableService from '../services/tableService';
import Promise from 'bluebird';
import ReportModel from '../models/reportModel';
import * as query from '../constants/query';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

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
                logger.debug('Loading table homepage for appId:' + appId + '; tableId:' + tblId);

                let tableService = new TableService();

                //  dispatch the LOAD_REPORT event.
                this.dispatch(actions.LOAD_REPORT, {appId, tblId, rptId:null});

                let params = {};
                params[query.OFFSET_PARAM] = offset;
                params[query.NUMROWS_PARAM] = numRows;

                //  Fetch the home page.  The response will include:
                //    - report data/grouping data
                //    - report meta data
                //    - report fields
                //    - report facets
                //    - report count
                tableService.getHomePage(appId, tblId, offset, numRows).then(
                    (response) => {
                        let metaData = response.data ? response.data.metaData : null;
                        let model = new ReportModel(appId, metaData, response.data, params);
                        this.dispatch(actions.LOAD_REPORT_SUCCESS, model.get());
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
