import ReportService from '../services/reportService';
import reportsModel from '../models/reportsModel';
import Promise from 'bluebird';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

import * as types from '../actions/types';

let logger = new Logger();

/**
 * Construct Redux action
 *
 * @param id - unique id
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(id, type, content) {
    return {
        id: id,
        type: type,
        content: content || null
    };
}

/**
 * Retrieve a list of reports for the given app/table.  This function is called primarily when
 * populating the left hand navigation window with the list of reports and when displaying a
 * trowser window that displays all of the reports for a table.
 *
 * @param appId
 * @param tblId
 */
export const loadReports = (appId, tblId) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)

    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                logger.debug('Loading report list for appId:' + appId + '; tableId:' + tblId);

                //  unique id in the store
                const id = appId + '-' + tblId;
                dispatch(event(id, types.LOAD_REPORTS));

                let reportService = new ReportService();

                reportService.getReports(appId, tblId).then(
                    (response) => {
                        logger.debug('ReportService getReports success');
                        let model = reportsModel.set(appId, tblId, response.data);
                        dispatch(event(id, types.LOAD_REPORTS_SUCCESS, model));
                        resolve();
                    },
                    (error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'reportService.getReports:');
                        dispatch(event(id, types.LOAD_REPORTS_FAILED, error));
                        reject();
                    }
                ).catch((ex) => {
                    logger.logException(ex);
                    reject();
                });
            } else {
                logger.error('reportService.getReports: Missing required input parameters.');
                dispatch(id, types.LOAD_REPORTS_FAILED, 500);
                reject();
            }
        });
    };
};
