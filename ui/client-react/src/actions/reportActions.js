// action creators
import * as actions from '../constants/actions';
import ReportService from '../services/reportService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
let logger = new Logger();

let reportActions = {

    loadReports: function(appId, tblId) {

        //  promise is returned in support of unit testing only
        return new Promise(function(resolve, reject) {
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
        }.bind(this));
    }
};

export default reportActions;
