import ReportService from '../services/reportService';
import reportsModel from '../models/reportsModel';
import Promise from 'bluebird';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

import * as types from '../actions/types';

let logger = new Logger();

/**
 * Construct reports store payload
 *
 * @param context - context
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(context, type, content) {
    let id = context;
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
 * @param context - what context is requesting the report list (ie: nav)
 * @param appId - app id
 * @param tblId - table id
 */
export const loadReports = (context, appId, tblId) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (context && appId && tblId) {
                logger.debug(`ReportsAction.loadReports: loading report list for appId: ${appId}, tableId: ${tblId}`);

                dispatch(event(context, types.LOAD_REPORTS, {appId, tblId}));

                let reportService = new ReportService();
                reportService.getReports(appId, tblId).then(
                    (response) => {
                        logger.debug('ReportService getReports success');
                        let model = reportsModel.set(appId, tblId, response.data);
                        dispatch(event(context, types.LOAD_REPORTS_SUCCESS, model));
                        resolve();
                    },
                    (error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'reportService.getReports:');
                        dispatch(event(context, types.LOAD_REPORTS_FAILED, error));
                        reject();
                    }
                ).catch((ex) => {
                    logger.logException(ex);
                    reject();
                });
            } else {
                logger.error(`reportsActions.loadReports: Missing required input parameters.  context: ${context}, appId: ${appId}, tableId: ${tblId}`);
                dispatch(event(null, types.LOAD_REPORTS_FAILED, 500));
                reject();
            }
        });
    };
};
